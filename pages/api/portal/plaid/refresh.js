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

    const plaid = getPlaidClient();
    const accessToken = decryptPlaidAccessToken(row.plaid_access_token);
    const response = await plaid.accountsGet({ access_token: accessToken });
    const refreshed = response.data.accounts.find((account) => account.account_id === row.account_id);

    if (refreshed) {
      const { error: updateError } = await supabase
        .from("plaid_connected_accounts")
        .update({
          account_name: refreshed.name || refreshed.official_name || row.account_name,
          account_mask: refreshed.mask || row.account_mask,
          account_type: refreshed.type || row.account_type,
          account_subtype: refreshed.subtype || row.account_subtype,
          connection_status: "connected",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);
      if (updateError) throw updateError;
    }

    await logPortalEvent({ type: "plaid_account_refreshed", userId: user.id, email: user.email, resourceType: "plaid_connected_accounts", resourceId: id });
    return res.status(200).json({ accounts: await listSafeAccounts(user.id) });
  } catch (error) {
    console.error("Plaid account refresh failed", error?.response?.data || error);
    await logPortalEvent({ type: "plaid_account_refresh_failed", userId: user.id, email: user.email, resourceType: "plaid_connected_accounts", resourceId: id, metadata: { message: error.message } });
    return res.status(500).json({ error: "Unable to refresh bank connection." });
  }
}
