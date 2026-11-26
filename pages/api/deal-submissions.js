import { getSupabaseAdmin } from "../../lib/supabaseAdmin";
import { num, PRODUCTS, screenDeal } from "../../lib/underwriting";

export const config = { api: { bodyParser: { sizeLimit: "64kb" } } };

// Every field the intake form may send. Anything else is dropped.
const FIELDS = [
  "contactName", "contactEmail", "contactPhone", "companyName", "submitterRole", "referralSource",
  "product", "transactionType", "propertyAddress", "propertyCity", "propertyState", "propertyZip", "propertyType", "occupancy",
  "purchasePrice", "asIsValue", "rehabBudget", "arv", "loanAmount", "seniorLoanAmount", "seniorLender",
  "monthlyRent", "annualTaxes", "annualInsurance", "monthlyHoa", "endBuyerPrice", "endBuyerUnderContract",
  "emdAmount", "underContract", "closingDate", "creditBand", "experienceDeals", "exitStrategy",
  "businessName", "monthsInBusiness", "annualRevenue", "useOfFunds", "notes",
];

function clean(body) {
  const out = {};
  for (const key of FIELDS) {
    const value = body?.[key];
    if (value === undefined || value === null) continue;
    const text = String(value).trim().slice(0, key === "notes" || key === "exitStrategy" || key === "useOfFunds" ? 2000 : 200);
    if (text) out[key] = text;
  }
  if (out.contactEmail) out.contactEmail = out.contactEmail.toLowerCase();
  return out;
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || "") ? value : null;
}

function siteOrigin(req) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (configured) return configured.startsWith("http") ? configured : `https://${configured}`;
  return `https://${req.headers["x-forwarded-host"] || req.headers.host}`;
}

async function sendEmail({ to, subject, text, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set.");
  const from = process.env.DEAL_FROM_EMAIL || process.env.SCHEDULER_FROM_EMAIL || process.env.EMAIL_FROM || "New Vine Capital <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!response.ok) throw new Error(`Resend email failed: ${await response.text()}`);
  return response.json();
}

function internalEmailText(lead, screen, id, origin) {
  const lines = [
    `Automatic screen: ${screen.decision} (score ${screen.score}/100)`,
    "",
    `Product: ${screen.productLabel}`,
    `Contact: ${lead.contactName} | ${lead.contactEmail} | ${lead.contactPhone}`,
    `Company: ${lead.companyName || "N/A"} | Role: ${lead.submitterRole || "N/A"}`,
    lead.propertyAddress ? `Property: ${[lead.propertyAddress, lead.propertyCity, lead.propertyState, lead.propertyZip].filter(Boolean).join(", ")}` : null,
    lead.businessName ? `Business: ${lead.businessName}` : null,
    "",
    "Metrics:",
    ...screen.metrics.map((m) => `  ${m.label}: ${m.value}`),
    "",
    "Flags:",
    ...(screen.flags.length ? screen.flags.map((f) => `  [${f.level.toUpperCase()}] ${f.message}`) : ["  None"]),
    "",
    `Open in Deal Pipeline: ${origin}/investor-portal/admin-deal-submissions#${id}`,
    "",
    "Internal preliminary screen only. Not an approval and not shared with the borrower.",
  ];
  return lines.filter((line) => line !== null).join("\n");
}

async function upsertHubSpotLead(lead) {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return null;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const search = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
    method: "POST",
    headers,
    body: JSON.stringify({ filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: lead.contactEmail }] }], limit: 1 }),
  });
  if (!search.ok) throw new Error(`HubSpot search failed: ${await search.text()}`);
  const found = (await search.json()).results?.[0];
  if (found) return found.id;

  const [firstname, ...rest] = lead.contactName.split(" ");
  const create = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers,
    body: JSON.stringify({
      properties: {
        email: lead.contactEmail,
        firstname: firstname || lead.contactName,
        lastname: rest.join(" "),
        phone: lead.contactPhone,
        company: lead.companyName || lead.businessName || "",
        lifecyclestage: "lead",
      },
    }),
  });
  if (!create.ok) throw new Error(`HubSpot contact failed: ${await create.text()}`);
  return (await create.json()).id;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Spam honeypot: real visitors never fill this hidden field.
  if (req.body?.website) return res.status(200).json({ ok: true });

  const lead = clean(req.body);
  const errors = [];
  if (!lead.contactName) errors.push("Name is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.contactEmail || "")) errors.push("A valid email is required.");
  if ((lead.contactPhone || "").replace(/\D/g, "").length < 10) errors.push("A valid phone number is required.");
  if (!PRODUCTS.some((p) => p.value === lead.product)) errors.push("Select a financing program.");
  if (errors.length) return res.status(400).json({ error: errors.join(" ") });

  const screen = screenDeal(lead);
  const supabase = getSupabaseAdmin();

  let id;
  try {
    const { data, error } = await supabase.from("deal_submissions").insert({
      contact_name: lead.contactName,
      contact_email: lead.contactEmail,
      contact_phone: lead.contactPhone,
      company_name: lead.companyName || lead.businessName || null,
      submitter_role: lead.submitterRole || null,
      referral_source: lead.referralSource || null,
      product: lead.product,
      transaction_type: lead.transactionType || null,
      property_address: lead.propertyAddress || null,
      property_city: lead.propertyCity || null,
      property_state: lead.propertyState || null,
      property_zip: lead.propertyZip || null,
      property_type: lead.propertyType || null,
      occupancy: lead.occupancy || null,
      loan_amount: num(lead.loanAmount),
      purchase_price: num(lead.purchasePrice),
      as_is_value: num(lead.asIsValue),
      closing_date: validDate(lead.closingDate),
      form_data: lead,
      screen_result: screen,
      screen_decision: screen.decision,
      screen_score: screen.score,
      user_agent: String(req.headers["user-agent"] || "").slice(0, 300),
    }).select("id").single();
    if (error) throw error;
    id = data.id;
  } catch (error) {
    console.error("Deal submission save failed", error);
    return res.status(500).json({ error: "We could not save your submission. Please call 720-817-4277 or email deals@newvinecapital.com." });
  }

  const integrationErrors = [];
  const update = { updated_at: new Date().toISOString() };
  const origin = siteOrigin(req);
  const notifyTo = process.env.DEAL_NOTIFICATION_EMAIL || "deals@newvinecapital.com";

  try {
    await sendEmail({
      to: notifyTo,
      subject: `[${screen.decision}] New ${screen.productLabel} deal: ${lead.contactName}`,
      text: internalEmailText(lead, screen, id, origin),
      replyTo: lead.contactEmail,
    });
    update.notification_sent_at = new Date().toISOString();
  } catch (error) {
    integrationErrors.push({ key: "notificationEmail", message: error.message });
  }

  try {
    await sendEmail({
      to: lead.contactEmail,
      subject: "We received your deal | New Vine Capital",
      replyTo: notifyTo,
      text: [
        `Hi ${lead.contactName.split(" ")[0]},`,
        "",
        `Thanks for sending your ${screen.productLabel} request to New Vine Capital. Our team will review it and follow up with next steps or any questions.`,
        "",
        "If anything changes or you have documents to add, reply to this email or call 720-817-4277.",
        "",
        "New Vine Capital",
        "deals@newvinecapital.com | 720-817-4277",
        "",
        "This confirms receipt only. It is not a loan approval or commitment. All financing is subject to underwriting and final approval.",
      ].join("\n"),
    });
    update.confirmation_sent_at = new Date().toISOString();
  } catch (error) {
    integrationErrors.push({ key: "confirmationEmail", message: error.message });
  }

  try {
    const hubspotId = await upsertHubSpotLead(lead);
    if (hubspotId) update.hubspot_contact_id = String(hubspotId);
  } catch (error) {
    integrationErrors.push({ key: "hubspot", message: error.message });
  }

  update.integration_errors = integrationErrors;
  const { error: updateError } = await supabase.from("deal_submissions").update(update).eq("id", id);
  if (updateError) console.error("Deal submission integration update failed", updateError);
  if (integrationErrors.length) console.error("Deal submission integration errors", integrationErrors);

  // The borrower only learns that the submission was received, never the screen result.
  return res.status(200).json({ ok: true, id });
}
