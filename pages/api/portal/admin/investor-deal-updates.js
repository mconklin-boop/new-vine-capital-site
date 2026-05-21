import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await getPortalSession(req);
  if (!admin || admin.role !== "Admin") return res.status(403).json({ error: "Admin access required" });
  const supabase = getSupabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await supabase.from("investor_deal_updates").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ updates: data || [] });
  }

  if (req.method === "POST") {
    const { deal_id, title, update_date, summary } = req.body || {};
    if (!deal_id || !title || !summary) return res.status(400).json({ error: "Missing update fields" });
    const { data, error } = await supabase.from("investor_deal_updates").insert({ deal_id, title, update_date: update_date || new Date().toISOString().slice(0, 10), summary }).select("*").single();
    if (error) return res.status(500).json({ error: error.message });
    await logPortalEvent({ type: "admin_investor_deal_update_create", userId: admin.id, email: admin.email, resourceType: "investor_deal_update", metadata: { deal_id, title } });
    return res.status(201).json({ update: data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
