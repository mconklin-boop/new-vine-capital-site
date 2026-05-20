import { getPortalSession, logPortalEvent } from "../../../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const user = await getPortalSession(req);
  if (!user) return res.status(403).json({ error: "Access denied" });

  const { id } = req.query;
  const supabase = getSupabaseAdmin();
  const { data: update, error } = await supabase
    .from("portal_monthly_updates")
    .select("id, title, pdf_storage_path")
    .eq("id", id)
    .maybeSingle();

  if (error || !update?.pdf_storage_path) return res.status(404).json({ error: "PDF not found" });

  const { data: signed, error: signedError } = await supabase.storage
    .from("portal-documents")
    .createSignedUrl(update.pdf_storage_path, 60 * 5, { download: true });

  if (signedError || !signed?.signedUrl) return res.status(500).json({ error: "Unable to create secure PDF link" });

  await logPortalEvent({
    type: "monthly_update_pdf_download",
    userId: user.id,
    email: user.email,
    resourceType: "portal_monthly_update",
    resourceId: update.id,
    metadata: { title: update.title },
  });

  res.writeHead(302, { Location: signed.signedUrl });
  res.end();
}
