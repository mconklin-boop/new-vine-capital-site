import crypto from "crypto";
import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export const config = { api: { bodyParser: { sizeLimit: "25mb" } } };

async function requireAdmin(req, res) {
  const user = await getPortalSession(req);
  if (!user || user.role !== "Admin") {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }
  return user;
}

function cleanFileName(value) {
  return String(value || "document.pdf").replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120);
}

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  const supabase = getSupabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await supabase.from("investor_deal_documents").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ documents: data || [] });
  }

  if (req.method === "POST") {
    const { deal_id, name, type, display_date, storage_path, fileName, contentType, fileBase64 } = req.body || {};
    if (!deal_id || !name || !type) return res.status(400).json({ error: "Missing document fields" });
    let finalPath = storage_path || null;
    if (fileBase64) {
      finalPath = `investor-deals/${deal_id}/${crypto.randomUUID()}-${cleanFileName(fileName)}`;
      const buffer = Buffer.from(String(fileBase64).split(",").pop(), "base64");
      const { error: uploadError } = await supabase.storage.from("portal-documents").upload(finalPath, buffer, { contentType: contentType || "application/octet-stream", upsert: false });
      if (uploadError) return res.status(500).json({ error: uploadError.message });
    }
    const { data, error } = await supabase.from("investor_deal_documents").insert({ deal_id, name, type, display_date: display_date || new Date().toISOString().slice(0, 10), storage_path: finalPath }).select("*").single();
    if (error) return res.status(500).json({ error: error.message });
    await logPortalEvent({ type: "admin_investor_deal_document_create", userId: admin.id, email: admin.email, resourceType: "investor_deal_document", metadata: { deal_id, name, type } });
    return res.status(201).json({ document: data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
