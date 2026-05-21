import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await getPortalSession(req);
  if (!admin || admin.role !== "Admin") return res.status(403).json({ error: "Admin access required" });
  const supabase = getSupabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await supabase.from("investor_commitments").select("*, portal_profiles(name,email), investor_deals(name)").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ commitments: data || [] });
  }

  if (req.method === "PATCH") {
    const { id, status } = req.body || {};
    if (!id || !status) return res.status(400).json({ error: "Missing commitment status" });
    const { data, error } = await supabase.from("investor_commitments").update({ status, updated_at: new Date().toISOString() }).eq("id", id).select("*").single();
    if (error) return res.status(500).json({ error: error.message });
    await logPortalEvent({ type: "admin_investor_commitment_update", userId: admin.id, email: admin.email, resourceType: "investor_commitment", resourceId: id, metadata: { status } });
    return res.status(200).json({ commitment: data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
