import { getPortalSession, logPortalEvent } from "../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

const notificationEmail = process.env.COMMITMENT_NOTIFICATION_EMAIL || "mike@newvinecapital.com";
const emailFrom = process.env.EMAIL_FROM || "New Vine Capital <mike@newvinecapital.com>";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

async function sendCommitmentNotification({ user, deal, commitment, fundingMethod }) {
  if (!process.env.RESEND_API_KEY) {
    console.info("Skipping commitment notification email because RESEND_API_KEY is not configured.");
    return { skipped: true };
  }

  const dealName = deal?.name || commitment.deal_id;
  const subject = `New investor commitment: ${dealName}`;
  const html = `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.55">
      <h2>New Investor Commitment Submitted</h2>
      <p>An investor submitted a commitment request in the New Vine Capital investor portal.</p>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;border:1px solid #ddd">
        <tr><td><strong>Investor</strong></td><td>${user.name || user.email}</td></tr>
        <tr><td><strong>Email</strong></td><td>${user.email}</td></tr>
        <tr><td><strong>Opportunity</strong></td><td>${dealName}</td></tr>
        <tr><td><strong>Investment Type</strong></td><td>${deal?.investment_type || deal?.investmentType || "Not specified"}</td></tr>
        <tr><td><strong>Amount</strong></td><td>${formatCurrency(commitment.amount)}</td></tr>
        <tr><td><strong>Funding Method</strong></td><td>${fundingMethod}</td></tr>
        <tr><td><strong>Status</strong></td><td>${commitment.status}</td></tr>
        <tr><td><strong>Submitted</strong></td><td>${new Date(commitment.created_at).toLocaleString()}</td></tr>
      </table>
      <p style="margin-top:16px">Log in to the New Vine Capital admin portal to review the commitment and release funding instructions if approved.</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: emailFrom,
      to: [notificationEmail],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend email failed: ${errorBody}`);
  }

  return response.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const user = await getPortalSession(req);
  if (!user) return res.status(403).json({ error: "Investor login required" });
  const { deal_id, amount, funding_method, accreditation_confirmed } = req.body || {};
  if (!deal_id || !amount || !funding_method || !accreditation_confirmed) return res.status(400).json({ error: "Missing commitment details" });
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("investor_commitments").insert({ investor_id: user.id, deal_id, amount: Number(amount), funding_method, accreditation_confirmed: Boolean(accreditation_confirmed), status: "Received" }).select("*").single();
  if (error) return res.status(500).json({ error: error.message });

  const { data: deal } = await supabase.from("investor_deals").select("id, name, investment_type").eq("id", deal_id).maybeSingle();

  let emailResult = { skipped: true };
  try {
    emailResult = await sendCommitmentNotification({ user, deal, commitment: data, fundingMethod: funding_method });
  } catch (emailError) {
    console.error("Commitment notification email failed", emailError);
    emailResult = { error: emailError.message };
  }

  await logPortalEvent({ type: "investor_commitment_submit", userId: user.id, email: user.email, resourceType: "investor_commitment", resourceId: data.id, metadata: { deal_id, amount, funding_method, notificationEmail, emailResult } });
  return res.status(201).json({ commitment: data });
}
