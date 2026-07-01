import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const user = await getPortalSession(req, res);
  if (!user) return res.status(401).json({ error: "Investor portal login required." });

  const { id } = req.query || {};
  if (!id) return res.status(400).json({ error: "Missing connected account id." });

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("plaid_connected_accounts")
      .select("id, institution_id, institution_name, institution_logo, connection_status, created_at, updated_at")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Institution not found." });

    await logPortalEvent({ type: "plaid_institution_viewed", userId: user.id, email: user.email, resourceType: "plaid_connected_accounts", resourceId: id });
    return res.status(200).json({ institution: data });
  } catch (error) {
    console.error("Plaid institution lookup failed", error);
    return res.status(500).json({ error: "Unable to load institution information." });
  }
}
