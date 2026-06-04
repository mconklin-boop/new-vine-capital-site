import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

function assignmentMatchesUser(assignment, user) {
  return assignment.profile_id === user.id || assignment.role === user.role || assignment.role === user.status;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const user = await getPortalSession(req, res);
  if (!user) return res.status(403).json({ error: "Investor portal login required" });

  const { id, action = "view" } = req.query;
  const supabase = getSupabaseAdmin();

  const { data: portalDocument, error: portalError } = await supabase
    .from("portal_documents")
    .select("id, name, storage_path")
    .eq("id", id)
    .maybeSingle();

  let document = portalDocument;
  let resourceType = "portal_document";

  if (!document && !portalError) {
    const { data: dealDocument, error: dealError } = await supabase
      .from("investor_deal_documents")
      .select("id, deal_id, name, storage_path")
      .eq("id", id)
      .maybeSingle();
    if (dealError) return res.status(500).json({ error: dealError.message });
    document = dealDocument;
    resourceType = "investor_deal_document";
  }

  if (portalError) return res.status(500).json({ error: portalError.message });
  if (!document) return res.status(404).json({ error: "Document not found" });
  if (!document.storage_path) return res.status(404).json({ error: "Document file is not available yet" });

  if (user.role !== "Admin") {
    if (resourceType === "portal_document") {
      const { data: assignments, error: assignmentError } = await supabase
        .from("portal_document_assignments")
        .select("profile_id, role")
        .eq("document_id", document.id);
      if (assignmentError) return res.status(500).json({ error: assignmentError.message });
      if (!(assignments || []).some((assignment) => assignmentMatchesUser(assignment, user))) {
        return res.status(403).json({ error: "Document has not been assigned to this investor" });
      }
    } else {
      const { data: assignments, error: assignmentError } = await supabase
        .from("investor_deal_assignments")
        .select("profile_id, role")
        .eq("deal_id", document.deal_id);
      if (assignmentError) return res.status(500).json({ error: assignmentError.message });
      if (!(assignments || []).some((assignment) => assignmentMatchesUser(assignment, user))) {
        return res.status(403).json({ error: "Document opportunity has not been assigned to this investor" });
      }
    }
  }

  const { data: signed, error: signedError } = await supabase.storage
    .from("portal-documents")
    .createSignedUrl(document.storage_path, 60 * 5, { download: action === "download" });

  if (signedError || !signed?.signedUrl) return res.status(500).json({ error: "Unable to create secure document link" });

  await logPortalEvent({
    type: action === "download" ? "document_download" : "document_view",
    userId: user.id,
    email: user.email,
    resourceType,
    resourceId: document.id,
    metadata: { name: document.name },
  });

  res.writeHead(302, { Location: signed.signedUrl });
  res.end();
}
