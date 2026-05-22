import crypto from "crypto";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

const TIME_ZONE = "America/Denver";
const DEFAULT_DURATION_MINUTES = 30;

function normalizePrivateKey(key) {
  return key ? key.replace(/\\n/g, "\n") : "";
}

function base64Url(value) {
  return Buffer.from(value).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function signJwt({ clientEmail, privateKey }) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/calendar.events",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  }));
  const unsignedToken = `${header}.${payload}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsignedToken).sign(privateKey, "base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${unsignedToken}.${signature}`;
}

function parseSlot(slot) {
  const [dateLabel, timeLabel] = String(slot || "").split("|");
  const year = process.env.INVESTOR_SCHEDULER_YEAR || "2026";
  const cleanDate = dateLabel?.replace(/^[A-Za-z]+,\s*/, "");
  const parsed = new Date(`${cleanDate} ${year} ${timeLabel}`);
  if (!dateLabel || !timeLabel || Number.isNaN(parsed.getTime())) return null;

  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  const startLocal = `${year}-${month}-${day}T${hours}:${minutes}:00`;
  const end = new Date(parsed.getTime() + DEFAULT_DURATION_MINUTES * 60 * 1000);
  const endHours = String(end.getHours()).padStart(2, "0");
  const endMinutes = String(end.getMinutes()).padStart(2, "0");
  const endLocal = `${year}-${month}-${day}T${endHours}:${endMinutes}:00`;

  return { dateLabel, timeLabel, startLocal, endLocal, display: `${dateLabel} at ${timeLabel}` };
}

async function sendNotificationEmail(payload, slotDetails) {
  if (!process.env.RESEND_API_KEY || !process.env.SCHEDULER_NOTIFICATION_EMAIL) return null;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.SCHEDULER_FROM_EMAIL || "New Vine Capital <onboarding@resend.dev>",
      to: [process.env.SCHEDULER_NOTIFICATION_EMAIL],
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
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!clientEmail || !privateKey || !calendarId) return null;

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
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json",
    },
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

async function upsertHubSpotContact(payload) {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return null;

  const contactResponse = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      properties: {
        email: payload.email,
        firstname: payload.name.split(" ")[0] || payload.name,
        lastname: payload.name.split(" ").slice(1).join(" ") || "",
        phone: payload.phone,
        company: payload.entity || "",
      },
    }),
  });

  if (contactResponse.status === 409) return null;
  if (!contactResponse.ok) throw new Error(`HubSpot contact failed: ${await contactResponse.text()}`);
  return contactResponse.json();
}

async function createHubSpotMeeting(payload, slotDetails) {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return null;

  const timestamp = new Date(`${slotDetails.startLocal}-06:00`).toISOString();
  const response = await fetch("https://api.hubapi.com/crm/v3/objects/meetings", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      properties: {
        hs_timestamp: timestamp,
        hs_meeting_title: `Investor Intake Call - ${payload.name}`,
        hs_meeting_body: `Requested time: ${slotDetails.display}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nEntity: ${payload.entity || "N/A"}\nNotes: ${payload.notes || "N/A"}`,
        hs_meeting_outcome: "SCHEDULED",
      },
    }),
  });

  if (!response.ok) throw new Error(`HubSpot meeting failed: ${await response.text()}`);
  return response.json();
}

export default async function handler(req, res) {
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

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("investor_call_requests").insert({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      entity_name: payload.entity || null,
      notes: payload.notes || null,
      requested_slot: payload.slot,
      requested_start: slotDetails.startLocal,
      requested_end: slotDetails.endLocal,
      timezone: TIME_ZONE,
      status: "Requested",
    }).select("id").single();
    if (error) throw error;
    integrationResults.supabaseId = data.id;
  } catch (error) {
    return res.status(500).json({ error: "Could not save the call request." });
  }

  for (const [key, task] of [
    ["email", () => sendNotificationEmail(payload, slotDetails)],
    ["googleCalendar", () => createGoogleCalendarEvent(payload, slotDetails)],
    ["hubspotContact", () => upsertHubSpotContact(payload)],
    ["hubspotMeeting", () => createHubSpotMeeting(payload, slotDetails)],
  ]) {
    try {
      integrationResults[key] = await task();
    } catch (error) {
      integrationErrors.push({ key, message: error.message });
    }
  }

  return res.status(200).json({
    ok: true,
    requestedTime: slotDetails.display,
    integrationResults: {
      saved: Boolean(integrationResults.supabaseId),
      emailConfigured: Boolean(process.env.RESEND_API_KEY && process.env.SCHEDULER_NOTIFICATION_EMAIL),
      googleCalendarConfigured: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY && process.env.GOOGLE_CALENDAR_ID),
      hubspotConfigured: Boolean(process.env.HUBSPOT_PRIVATE_APP_TOKEN),
    },
    integrationErrors,
  });
}
