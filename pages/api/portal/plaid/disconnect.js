import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { decryptPlaidAccessToken, getPlaidClient, safePlaidAccount } from "../../../../lib/plaid";

async function listSafeAccounts(userId) {
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
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const user = await getPortalSession(req, res);
  if (!user) return res.status(401).json({ error: "Investor portal login required." });

  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: "Missing connected account id." });

  try {
    const supabase = getSupabaseAdmin();
    const { data: row, error: rowError } = await supabase
      .from("plaid_connected_accounts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (rowError) throw rowError;
    if (!row) return res.status(404).json({ error: "Connected account not found." });

    try {
      const plaid = getPlaidClient();
      await plaid.itemRemove({ access_token: decryptPlaidAccessToken(row.plaid_access_token) });
    } catch (plaidError) {
      console.info("Plaid item removal warning", plaidError?.response?.data || plaidError.message);
    }

    const { error: updateError } = await supabase
      .from("plaid_connected_accounts")
      .update({ connection_status: "disconnected", updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("plaid_item_id", row.plaid_item_id);
    if (updateError) throw updateError;

    await logPortalEvent({ type: "plaid_account_disconnected", userId: user.id, email: user.email, resourceType: "plaid_connected_accounts", resourceId: id, metadata: { institutionName: row.institution_name } });
    return res.status(200).json({ accounts: await listSafeAccounts(user.id) });
  } catch (error) {
    console.error("Plaid account disconnect failed", error);
    await logPortalEvent({ type: "plaid_account_disconnect_failed", userId: user.id, email: user.email, resourceType: "plaid_connected_accounts", resourceId: id, metadata: { message: error.message } });
    return res.status(500).json({ error: "Unable to disconnect bank account." });
  }
}
