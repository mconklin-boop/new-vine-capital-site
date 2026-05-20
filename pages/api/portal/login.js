import { createSessionCookie, logPortalEvent, validatePortalLogin } from "../../../lib/portalAuth";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email, password, mfaCode } = req.body || {};
  const result = validatePortalLogin({ email, password, mfaCode });
  logPortalEvent({ type: "login_attempt", email, success: result.ok, reason: result.reason || "ok" });
  if (!result.ok) return res.status(401).json({ error: result.reason === "mfa" ? "MFA verification failed." : "Invalid portal credentials." });
  res.setHeader("Set-Cookie", createSessionCookie(result.user));
  return res.status(200).json({ ok: true, redirect: "/investor-portal/dashboard" });
}
