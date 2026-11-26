import crypto from "crypto";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";
import { logActivity, upsertContact } from "../../lib/crm";
import { addMinutes, buildAvailability, CALL_MINUTES, isBookable, labelForSlot, TIME_ZONE } from "../../lib/scheduling";


function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing Vercel environment variable: ${name}`);
  return value;
}

function normalizePrivateKey(key) {
  return key ? key.replace(/\\n/g, "\n") : "";
}

function base64Url(value) {
  return Buffer.from(value).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function signJwt({ clientEmail, privateKey }) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({ iss: clientEmail, scope: "https://www.googleapis.com/auth/calendar.events", aud: "https://oauth2.googleapis.com/token", exp: now + 3600, iat: now }));
  const unsignedToken = `${header}.${payload}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsignedToken).sign(privateKey, "base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${unsignedToken}.${signature}`;
}

function parseSlot(start) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(start || "")) return null;
  const end = addMinutes(start, CALL_MINUTES);
  return { startLocal: `${start}:00`, endLocal: `${end}:00`, display: labelForSlot(start).display };
}

async function bookedStarts(supabase) {
  const { data, error } = await supabase.from("investor_call_requests").select("requested_start, status").not("status", "in", "(Cancelled,Canceled)");
  if (error) throw error;
  return (data || []).map((row) => row.requested_start);
}

async function sendNotificationEmail(payload, slotDetails) {
  const apiKey = requireEnv("RESEND_API_KEY");
  const notificationEmail = process.env.SCHEDULER_NOTIFICATION_EMAIL || process.env.COMMITMENT_NOTIFICATION_EMAIL || "mike@newvinecapital.com";
  const fromEmail = process.env.SCHEDULER_FROM_EMAIL || process.env.EMAIL_FROM || "New Vine Capital <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromEmail,
      to: [notificationEmail],
      subject: `Investor intake call request: ${payload.name}`,
      text: [
        "New investor intake call request",
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone}`,
        `Entity: ${payload.entity || "N/A"}`,
        `Requested time: ${slotDetails.display}`,
        `Notes: ${payload.notes || "N/A"}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) throw new Error(`Resend email failed: ${await response.text()}`);
  return response.json();
}

async function createGoogleCalendarEvent(payload, slotDetails) {
  const clientEmail = requireEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = normalizePrivateKey(requireEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY"));
  const calendarId = requireEnv("GOOGLE_CALENDAR_ID");

  const assertion = signJwt({ clientEmail, privateKey });
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!tokenResponse.ok) throw new Error(`Google token failed: ${await tokenResponse.text()}`);
  const tokenData = await tokenResponse.json();

  const eventResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=all`, {
    method: "POST",
    headers: { Authorization: `Bearer ${tokenData.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: `Investor Intake Call - ${payload.name}`,
      description: `New Vine Capital investor intake call request.\n\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nEntity: ${payload.entity || "N/A"}\nNotes: ${payload.notes || "N/A"}`,
      start: { dateTime: slotDetails.startLocal, timeZone: TIME_ZONE },
      end: { dateTime: slotDetails.endLocal, timeZone: TIME_ZONE },
      attendees: [{ email: payload.email, displayName: payload.name }],
    }),
  });
  if (!eventResponse.ok) throw new Error(`Google event failed: ${await eventResponse.text()}`);
  return eventResponse.json();
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const booked = await bookedStarts(getSupabaseAdmin());
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json({ timeZone: TIME_ZONE, days: buildAvailability({ booked }) });
    } catch (error) {
      console.error("Availability lookup failed", error);
      return res.status(200).json({ timeZone: TIME_ZONE, days: buildAvailability() });
    }
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const payload = {
    name: String(req.body?.name || "").trim(),
    email: String(req.body?.email || "").trim().toLowerCase(),
    phone: String(req.body?.phone || "").trim(),
    entity: String(req.body?.entity || "").trim(),
    notes: String(req.body?.notes || "").trim(),
    slot: String(req.body?.slot || "").trim(),
  };

  const slotDetails = parseSlot(payload.slot);
  if (!payload.name || !payload.email || !payload.phone || !slotDetails) {
    return res.status(400).json({ error: "Name, email, phone, and selected time are required." });
  }

  const integrationResults = {};
  const integrationErrors = [];
  let requestId = null;
  const supabase = getSupabaseAdmin();

  try {
    const booked = await bookedStarts(supabase);
    if (!isBookable(payload.slot, { booked })) return res.status(409).json({ error: "That time is no longer available. Please pick another time." });
  } catch (error) {
    console.error("Availability check failed", error);
  }

  try {
    const { data, error } = await supabase.from("investor_call_requests").insert({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      entity_name: payload.entity || null,
      notes: payload.notes || null,
      requested_slot: slotDetails.display,
      requested_start: slotDetails.startLocal,
      requested_end: slotDetails.endLocal,
      timezone: TIME_ZONE,
      status: "Requested",
    }).select("id").single();
    if (error) throw error;
    requestId = data.id;
    integrationResults.supabaseId = data.id;
  } catch (error) {
    console.error("Investor call request Supabase save failed", error);
    return res.status(500).json({ error: "Could not save the call request." });
  }

  try {
    integrationResults.email = await sendNotificationEmail(payload, slotDetails);
  } catch (error) {
    console.error("Investor scheduler email integration failed", error);
    integrationErrors.push({ key: "email", message: error.message });
  }

  try {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) integrationResults.googleCalendar = await createGoogleCalendarEvent(payload, slotDetails);
  } catch (error) {
    console.error("Investor scheduler Google Calendar integration failed", error);
    integrationErrors.push({ key: "googleCalendar", message: error.message });
  }

  try {
    integrationResults.contactId = await upsertContact(supabase, {
      email: payload.email, name: payload.name, phone: payload.phone, company: payload.entity, contactType: "Investor", source: "Investor call request",
    });
    await logActivity(supabase, {
      contactId: integrationResults.contactId,
      type: "call_requested",
      summary: `Requested investor intake call: ${slotDetails.display}`,
      body: payload.notes || null,
      metadata: { callRequestId: requestId, start: slotDetails.startLocal },
      createdBy: "system",
    });
    await supabase.from("crm_contacts").update({ next_follow_up: slotDetails.startLocal.slice(0, 10), follow_up_note: "Investor intake call" }).eq("id", integrationResults.contactId);
  } catch (error) {
    console.error("Investor scheduler CRM update failed", error);
    integrationErrors.push({ key: "crm", message: error.message });
  }

  const updatePayload = {
    google_event_id: integrationResults.googleCalendar?.id || null,
    contact_id: integrationResults.contactId || null,
    email_sent_at: integrationResults.email?.id ? new Date().toISOString() : null,
    integration_errors: integrationErrors,
    status: integrationErrors.length ? "Integration Review Needed" : "Requested",
    updated_at: new Date().toISOString(),
  };

  const { error: updateError } = await supabase.from("investor_call_requests").update(updatePayload).eq("id", requestId);
  if (updateError) console.error("Investor call request integration status update failed", updateError);

  return res.status(200).json({
    ok: true,
    requestedTime: slotDetails.display,
    integrationResults: {
      saved: Boolean(integrationResults.supabaseId),
      emailSent: Boolean(integrationResults.email?.id),
      googleCalendarCreated: Boolean(integrationResults.googleCalendar?.id),
    },
    integrationErrors,
  });
}
