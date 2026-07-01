import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { logPortalEvent } from "../../../lib/portalAuth";

const ITEM_STATUS_BY_WEBHOOK_CODE = {
  NEW_ACCOUNTS_AVAILABLE: "needs_update",
  PENDING_DISCONNECT: "needs_update",
  USER_PERMISSION_REVOKED: "needs_update",
  USER_ACCOUNT_REVOKED: "needs_update",
  ERROR: "error",
};

async function updateConnectedAccountStatus({ itemId, webhookCode }) {
  const nextStatus = ITEM_STATUS_BY_WEBHOOK_CODE[webhookCode];
  if (!itemId || !nextStatus) return { updated: 0 };

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("plaid_connected_accounts")
    .update({ connection_status: nextStatus, updated_at: new Date().toISOString() })
    .eq("plaid_item_id", itemId)
    .select("id");

  if (error) throw error;
  return { updated: data?.length || 0 };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const payload = req.body || {};
  const webhookType = payload.webhook_type || "UNKNOWN";
  const webhookCode = payload.webhook_code || "UNKNOWN";
  const itemId = payload.item_id || payload.item_id_old || null;

  try {
    const statusUpdate = await updateConnectedAccountStatus({ itemId, webhookCode });

    await logPortalEvent({
      type: "plaid_webhook_received",
      resourceType: "plaid_webhook",
      metadata: {
        webhookType,
        webhookCode,
        itemId,
        statusUpdate,
        environment: payload.environment || null,
        error: payload.error || null,
        requestId: payload.request_id || null,
      },
    });

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Plaid webhook handling failed", error);
    await logPortalEvent({
      type: "plaid_webhook_failed",
      resourceType: "plaid_webhook",
      metadata: { webhookType, webhookCode, itemId, message: error.message },
    });
    return res.status(500).json({ error: "Webhook handling failed." });
  }
}
