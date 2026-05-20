import { createSessionCookies, logPortalEvent, validatePortalLogin } from "../../../lib/portalAuth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body || {};
  const result = await validatePortalLogin({ email, password });

  await logPortalEvent({
    type: "login_attempt",
    email,
    success: result.ok,
    reason: result.reason || "ok",
  });

  if (!result.ok) {
    const message = result.reason === "pending"
      ? "Your portal profile is pending approval. Please contact Investor Relations."
      : "Invalid portal credentials.";
    return res.status(401).json({ error: message });
  }

  await logPortalEvent({ type: "login_success", userId: result.user.id, email: result.user.email });
  res.setHeader("Set-Cookie", createSessionCookies(result.session));
  return res.status(200).json({ ok: true, redirect: "/investor-portal/dashboard" });
}
