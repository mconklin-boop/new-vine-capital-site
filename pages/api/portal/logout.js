import { clearSessionCookie, getPortalSession, logPortalEvent } from "../../../lib/portalAuth";

export default function handler(req, res) {
  const user = getPortalSession(req);
  if (user) logPortalEvent({ type: "logout", userId: user.id, email: user.email });
  res.setHeader("Set-Cookie", clearSessionCookie());
  res.writeHead(302, { Location: "/investor-portal" });
  res.end();
}
