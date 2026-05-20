import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

async function requireAdmin(req, res) {
  const user = await getPortalSession(req);
  if (!user || user.role !== "Admin") {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }
  return user;
}

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const supabase = getSupabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await supabase.from("portal_documents").select("*").order("upload_date", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ documents: data || [] });
  }

  if (req.method === "POST") {
    const { name, category, storage_path, profile_id, role } = req.body || {};
    if (!name || !category || !storage_path) return res.status(400).json({ error: "Missing document fields" });

    const { data: document, error } = await supabase
      .from("portal_documents")
      .insert({ name, category, storage_path, uploaded_by: admin.id })
      .select("*")
      .single();
    if (error) return res.status(500).json({ error: error.message });

    if (profile_id || role) {
      await supabase.from("portal_document_assignments").insert({ document_id: document.id, profile_id: profile_id || null, role: role || null });
    }

    await logPortalEvent({ type: "admin_document_create", userId: admin.id, email: admin.email, resourceType: "portal_document", resourceId: document.id, metadata: { name, category } });
    return res.status(201).json({ document });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
