import { createSessionCookies, logPortalEvent } from "../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { access_token, refresh_token } = req.body || {};
  if (!access_token || !refresh_token) return res.status(400).json({ error: "Missing invite session tokens" });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(access_token);
  if (error || !data?.user) return res.status(401).json({ error: "Invite session is invalid or expired" });

  const { data: profile, error: profileError } = await supabase
    .from("portal_profiles")
    .select("id, email, role, status, deactivated")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) return res.status(500).json({ error: profileError.message });
  if (!profile || profile.deactivated) return res.status(403).json({ error: "Investor portal profile is not active" });

  await logPortalEvent({
    type: "invite_password_set",
    userId: data.user.id,
    email: data.user.email,
    resourceType: "portal_profile",
    resourceId: data.user.id,
    metadata: { role: profile.role, status: profile.status },
  });

  res.setHeader("Set-Cookie", createSessionCookies({ access_token, refresh_token }));
  return res.status(200).json({ ok: true, redirect: "/investor/dashboard" });
}
