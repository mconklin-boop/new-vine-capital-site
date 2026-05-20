import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const admin = await getPortalSession(req);
  if (!admin || admin.role !== "Admin") return res.status(403).json({ error: "Admin access required" });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("portal_profiles")
    .select("name, email, phone, role, status, entity_name, accredited_status, investor_type, estimated_range, relationship_source, onboarding_status, compliance_review_status, deactivated, created_at")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const headers = ["Name", "Email", "Phone", "Role", "Status", "Entity", "Accredited Status", "Investor Type", "Estimated Range", "Relationship Source", "Onboarding", "Compliance Review", "Deactivated", "Created At"];
  const rows = (data || []).map((item) => [item.name, item.email, item.phone, item.role, item.status, item.entity_name, item.accredited_status, item.investor_type, item.estimated_range, item.relationship_source, item.onboarding_status, item.compliance_review_status, item.deactivated, item.created_at]);
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  await logPortalEvent({ type: "admin_user_csv_export", userId: admin.id, email: admin.email });

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=new-vine-capital-investors.csv");
  return res.status(200).send(csv);
}
