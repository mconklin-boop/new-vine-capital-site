import crypto from "crypto";

const SESSION_COOKIE = "nvc_portal_session";
const SESSION_MAX_AGE_SECONDS = 30 * 60;
const ALLOWED_ROLES = ["Admin", "Approved Investor", "Pending Investor", "Advisor / Referral Partner"];

function getSecret() {
  return process.env.INVESTOR_PORTAL_SESSION_SECRET || process.env.NEXTAUTH_SECRET || "development-only-change-me";
}

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(payload) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || "").split(";").filter(Boolean).map((cookie) => {
      const [key, ...value] = cookie.trim().split("=");
      return [key, decodeURIComponent(value.join("="))];
    })
  );
}

export function hashPortalSecret(value, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(value, salt, 210000, 32, "sha256").toString("hex");
  return { salt, hash };
}

function verifySecret(value, salt, expectedHash) {
  if (!value || !salt || !expectedHash) return false;
  const actual = crypto.pbkdf2Sync(value, salt, 210000, 32, "sha256");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

export function getPortalUsers() {
  try {
    const users = JSON.parse(process.env.INVESTOR_PORTAL_USERS || "[]");
    return users.filter((user) => user.email && ALLOWED_ROLES.includes(user.role));
  } catch (error) {
    console.error("Invalid INVESTOR_PORTAL_USERS JSON", error);
    return [];
  }
}

export function validatePortalLogin({ email, password, mfaCode }) {
  const user = getPortalUsers().find((item) => item.email.toLowerCase() === String(email || "").toLowerCase());
  if (!user || user.deactivated) return { ok: false, reason: "invalid" };
  if (!verifySecret(password, user.passwordSalt, user.passwordHash)) return { ok: false, reason: "invalid" };
  if (process.env.INVESTOR_PORTAL_REQUIRE_MFA === "true") {
    if (!verifySecret(mfaCode, user.mfaSalt, user.mfaHash)) return { ok: false, reason: "mfa" };
  }
  return { ok: true, user: sanitizeUser(user) };
}

export function sanitizeUser(user) {
  return {
    id: user.id || user.email,
    name: user.name || "Investor",
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    status: user.status || (user.role === "Pending Investor" ? "Pending Investor" : "Approved Investor"),
    entityName: user.entityName || "",
    accreditedStatus: user.accreditedStatus || "Under review",
    investorType: user.investorType || "Not specified",
    estimatedRange: user.estimatedRange || "Not specified",
    relationshipSource: user.relationshipSource || "Not specified",
    onboardingStatus: user.onboardingStatus || "In review",
    documentsCompleted: user.documentsCompleted || "Pending",
    complianceReviewStatus: user.complianceReviewStatus || "Pending review",
  };
}

export function createSessionCookie(user) {
  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(JSON.stringify({ user, iat: now, exp: now + SESSION_MAX_AGE_SECONDS }));
  const token = `${payload}.${sign(payload)}`;
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}; Secure`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`;
}

export function getPortalSession(req) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || signature !== sign(payload)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    return data.user;
  } catch {
    return null;
  }
}

export function requirePortalSession(context, options = {}) {
  const user = getPortalSession(context.req);
  if (!user) {
    return { redirect: { destination: "/investor-portal", permanent: false } };
  }
  if (options.roles && !options.roles.includes(user.role)) {
    return { redirect: { destination: "/investor-portal/dashboard", permanent: false } };
  }
  return { props: { user } };
}

export function canViewOfferingDocuments(user) {
  return user?.role === "Admin" || user?.role === "Approved Investor";
}

export function logPortalEvent(event) {
  console.info(JSON.stringify({ portalEvent: true, timestamp: new Date().toISOString(), ...event }));
}
