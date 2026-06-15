import { logPortalEvent } from "../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return req.headers.authorization === `Bearer ${secret}`;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });

  const startedAt = new Date().toISOString();

  try {
    const supabase = getSupabaseAdmin();

    // Vercel Cron calls this endpoint every 6 days. The lightweight HEAD query
    // touches Supabase/PostgREST without returning table data, which helps keep
    // the project active while avoiding unnecessary data transfer.
    const { error, status, count } = await supabase
      .from("portal_profiles")
      .select("id", { count: "exact", head: true })
      .limit(1);

    if (error) throw error;

    await logPortalEvent({
      type: "supabase_keep_alive_success",
      email: "system",
      resourceType: "cron",
      metadata: { startedAt, status, count, completedAt: new Date().toISOString() },
    });

    console.info("Supabase keep-alive completed", { startedAt, status, count });
    return res.status(200).json({ ok: true, status, count, startedAt, completedAt: new Date().toISOString() });
  } catch (error) {
    await logPortalEvent({
      type: "supabase_keep_alive_error",
      email: "system",
      resourceType: "cron",
      metadata: { startedAt, message: error.message, completedAt: new Date().toISOString() },
    });

    console.error("Supabase keep-alive failed", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}
