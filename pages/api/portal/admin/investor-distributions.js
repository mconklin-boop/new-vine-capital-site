import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await getPortalSession(req);
  if (!admin || admin.role !== "Admin") return res.status(403).json({ error: "Admin access required" });
  const supabase = getSupabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await supabase.from("investor_distributions").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ distributions: data || [] });
  }

  if (req.method === "POST") {
    const { investor_id, deal_id, investment, distribution_date, amount, type, status } = req.body || {};
    if (!investment || !distribution_date || !type) return res.status(400).json({ error: "Missing distribution fields" });
    const { data, error } = await supabase.from("investor_distributions").insert({ investor_id: investor_id || null, deal_id: deal_id || null, investment, distribution_date, amount: Number(amount || 0), type, status: status || "Projected" }).select("*").single();
    if (error) return res.status(500).json({ error: error.message });
    await logPortalEvent({ type: "admin_investor_distribution_create", userId: admin.id, email: admin.email, resourceType: "investor_distribution", metadata: { investment, amount } });
    return res.status(201).json({ distribution: data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
