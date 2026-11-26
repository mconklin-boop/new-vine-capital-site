import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { screenDeal } from "../../../../lib/underwriting";
import { logActivity } from "../../../../lib/crm";

const PIPELINE_STATUSES = ["New", "Contacted", "Terms Sent", "In Underwriting", "Approved", "Closed", "Declined", "Dead"];

export default async function handler(req, res) {
  const admin = await getPortalSession(req, res);
  if (!admin || admin.role !== "Admin") return res.status(403).json({ error: "Admin access required" });
  if (req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });

  const { id, status, adminNotes, rescreen } = req.body || {};
  if (!id) return res.status(400).json({ error: "Submission id is required." });

  const supabase = getSupabaseAdmin();
  const update = { updated_at: new Date().toISOString() };
  if (status !== undefined) {
    if (!PIPELINE_STATUSES.includes(status)) return res.status(400).json({ error: "Invalid status." });
    update.status = status;
  }
  if (adminNotes !== undefined) update.admin_notes = String(adminNotes).slice(0, 5000);

  if (rescreen) {
    const { data: row, error } = await supabase.from("deal_submissions").select("form_data").eq("id", id).single();
    if (error) return res.status(404).json({ error: "Submission not found." });
    const screen = screenDeal(row.form_data || {});
    update.screen_result = screen;
    update.screen_decision = screen.decision;
    update.screen_score = screen.score;
  }

  const { data: before } = await supabase.from("deal_submissions").select("status").eq("id", id).single();
  const { data, error } = await supabase.from("deal_submissions").update(update).eq("id", id).select("*").single();
  if (error) return res.status(500).json({ error: error.message });

  if (data.contact_id && update.status && before?.status !== update.status) {
    try {
      await logActivity(supabase, { contactId: data.contact_id, type: "status_change", summary: `Deal status: ${before?.status || "New"} → ${update.status} (${data.screen_result?.productLabel || data.product})`, metadata: { dealSubmissionId: id }, createdBy: admin.email || "admin" });
    } catch (activityError) {
      console.error("Deal status activity log failed", activityError);
    }
  }

  await logPortalEvent({ type: "admin_deal_submission_update", userId: admin.id, email: admin.email, resourceType: "deal_submission", resourceId: id, metadata: { status, rescreen: Boolean(rescreen) } });
  return res.status(200).json({ ok: true, submission: data });
}
