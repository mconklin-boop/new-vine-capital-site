import { clearSessionCookies, getPortalSession, logPortalEvent } from "../../../lib/portalAuth";

export default async function handler(req, res) {
  const user = await getPortalSession(req);
  if (user) await logPortalEvent({ type: "logout", userId: user.id, email: user.email });

  res.setHeader("Set-Cookie", clearSessionCookies());
  res.writeHead(302, { Location: "/investor-portal" });
  res.end();
}
