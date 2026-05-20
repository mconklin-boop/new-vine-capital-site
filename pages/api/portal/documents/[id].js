import { canViewOfferingDocuments, getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const user = await getPortalSession(req);
  if (!user || !canViewOfferingDocuments(user)) return res.status(403).json({ error: "Access denied" });

  const { id, action = "view" } = req.query;
  const supabase = getSupabaseAdmin();
  const { data: document, error } = await supabase
    .from("portal_documents")
    .select("id, name, storage_path")
    .eq("id", id)
    .maybeSingle();

  if (error || !document) return res.status(404).json({ error: "Document not found" });

  const { data: signed, error: signedError } = await supabase.storage
    .from("portal-documents")
    .createSignedUrl(document.storage_path, 60 * 5, { download: action === "download" });

  if (signedError || !signed?.signedUrl) return res.status(500).json({ error: "Unable to create secure document link" });

  await logPortalEvent({
    type: action === "download" ? "document_download" : "document_view",
    userId: user.id,
    email: user.email,
    resourceType: "portal_document",
    resourceId: document.id,
    metadata: { name: document.name },
  });

  res.writeHead(302, { Location: signed.signedUrl });
  res.end();
}
