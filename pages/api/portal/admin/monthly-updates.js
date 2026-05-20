import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await getPortalSession(req);
  if (!admin || admin.role !== "Admin") return res.status(403).json({ error: "Admin access required" });

  const supabase = getSupabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await supabase.from("portal_monthly_updates").select("*").order("update_date", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ updates: data || [] });
  }

  if (req.method === "POST") {
    const { title, update_date, summary, content, pdf_storage_path } = req.body || {};
    if (!title || !summary || !content) return res.status(400).json({ error: "Missing update fields" });

    const { data, error } = await supabase
      .from("portal_monthly_updates")
      .insert({ title, update_date: update_date || new Date().toISOString().slice(0, 10), summary, content, pdf_storage_path: pdf_storage_path || null })
      .select("*")
      .single();
    if (error) return res.status(500).json({ error: error.message });

    await logPortalEvent({ type: "admin_monthly_update_create", userId: admin.id, email: admin.email, resourceType: "portal_monthly_update", resourceId: data.id, metadata: { title } });
    return res.status(201).json({ update: data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
