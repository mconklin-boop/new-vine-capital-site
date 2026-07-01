import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { encryptPlaidAccessToken, getPlaidClient, getPlaidCountryCodes, safePlaidAccount } from "../../../../lib/plaid";

function selectedAccountIds(metadata) {
  return new Set((metadata?.accounts || []).map((account) => account.id).filter(Boolean));
}

async function getInstitution(plaid, institutionId) {
  if (!institutionId) return null;

  try {
    const response = await plaid.institutionsGetById({
      institution_id: institutionId,
      country_codes: getPlaidCountryCodes(),
      options: { include_optional_metadata: true },
    });
    return response.data.institution;
  } catch (error) {
    console.info("Plaid institution lookup failed", error?.response?.data || error.message);
    return null;
  }
}

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

  const { publicToken, metadata } = req.body || {};
  if (!publicToken) return res.status(400).json({ error: "Missing Plaid public token." });

  try {
    const plaid = getPlaidClient();
    const tokenResponse = await plaid.itemPublicTokenExchange({ public_token: publicToken });
    const accessToken = tokenResponse.data.access_token;
    const itemId = tokenResponse.data.item_id;
    const encryptedAccessToken = encryptPlaidAccessToken(accessToken);

    const [accountsResponse, institution] = await Promise.all([
      plaid.accountsGet({ access_token: accessToken }),
      getInstitution(plaid, metadata?.institution?.institution_id),
    ]);

    const selectedIds = selectedAccountIds(metadata);
    const selectedAccounts = accountsResponse.data.accounts.filter((account) => !selectedIds.size || selectedIds.has(account.account_id));
    const institutionId = institution?.institution_id || metadata?.institution?.institution_id || "";
    const institutionName = institution?.name || metadata?.institution?.name || "Connected Institution";
    const institutionLogo = institution?.logo || "";

    if (!selectedAccounts.length) {
      return res.status(400).json({ error: "No eligible account was selected." });
    }

    const supabase = getSupabaseAdmin();
    const rows = selectedAccounts.map((account) => ({
      user_id: user.id,
      plaid_item_id: itemId,
      plaid_access_token: encryptedAccessToken,
      institution_id: institutionId,
      institution_name: institutionName,
      institution_logo: institutionLogo,
      account_id: account.account_id,
      account_name: account.name || account.official_name || "Bank Account",
      account_mask: account.mask || "",
      account_type: account.type || "",
      account_subtype: account.subtype || "",
      connection_status: "connected",
      updated_at: new Date().toISOString(),
    }));

    const { error: upsertError } = await supabase
      .from("plaid_connected_accounts")
      .upsert(rows, { onConflict: "user_id,account_id" });
    if (upsertError) throw upsertError;

    await logPortalEvent({
      type: "plaid_account_connected",
      userId: user.id,
      email: user.email,
      resourceType: "plaid_connected_accounts",
      metadata: { institutionId, institutionName, accountCount: rows.length },
    });

    return res.status(200).json({
      message: "Bank successfully connected.",
      institution: institutionName,
      accounts: await listSafeAccounts(user.id),
    });
  } catch (error) {
    console.error("Plaid token exchange failed", error?.response?.data || error);
    await logPortalEvent({ type: "plaid_account_connect_failed", userId: user.id, email: user.email, resourceType: "plaid_connected_accounts", metadata: { message: error.message } });
    return res.status(500).json({ error: "Unable to save connected bank account." });
  }
}
