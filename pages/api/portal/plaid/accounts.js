import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { safePlaidAccount } from "../../../../lib/plaid";

async function listAccounts(userId) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("plaid_connected_accounts")
    .select("id, institution_id, institution_name, institution_logo, account_id, account_name, account_mask, account_type, account_subtype, connection_status, created_at, updated_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(safePlaidAccount);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const user = await getPortalSession(req, res);
  if (!user) return res.status(401).json({ error: "Investor portal login required." });

  try {
    const accounts = await listAccounts(user.id);
    await logPortalEvent({ type: "plaid_accounts_viewed", userId: user.id, email: user.email, resourceType: "plaid_connected_accounts" });
    return res.status(200).json({ accounts });
  } catch (error) {
    console.error("Plaid account listing failed", error);
    return res.status(500).json({ error: "Unable to load connected bank accounts." });
  }
}
