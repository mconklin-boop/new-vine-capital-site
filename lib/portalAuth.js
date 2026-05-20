import { getSupabaseAdmin, getSupabaseAuthClient } from "./supabaseAdmin";

const ACCESS_COOKIE = "nvc_sb_access";
const REFRESH_COOKIE = "nvc_sb_refresh";
const SESSION_MAX_AGE_SECONDS = 30 * 60;
const REFRESH_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const ALLOWED_ROLES = ["Admin", "Approved Investor", "Pending Investor", "Advisor / Referral Partner"];

function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || "").split(";").filter(Boolean).map((cookie) => {
      const [key, ...value] = cookie.trim().split("=");
      return [key, decodeURIComponent(value.join("="))];
    })
  );
}

function serializeCookie(name, value, maxAge) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function mapProfile(profile, authUser = {}) {
  return {
    id: profile?.id || authUser.id || authUser.email,
    name: profile?.name || authUser.user_metadata?.name || authUser.email || "Investor",
    email: profile?.email || authUser.email,
    phone: profile?.phone || "",
    role: ALLOWED_ROLES.includes(profile?.role) ? profile.role : "Pending Investor",
    status: profile?.status || "Pending Investor",
    entityName: profile?.entity_name || "",
    accreditedStatus: profile?.accredited_status || "Under review",
    investorType: profile?.investor_type || "Not specified",
    estimatedRange: profile?.estimated_range || "Not specified",
    relationshipSource: profile?.relationship_source || "Not specified",
    onboardingStatus: profile?.onboarding_status || "In review",
    documentsCompleted: profile?.documents_completed || "Pending",
    complianceReviewStatus: profile?.compliance_review_status || "Pending review",
    deactivated: Boolean(profile?.deactivated),
  };
}

async function fetchProfileForAuthUser(authUser) {
  if (!authUser?.id) return null;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("portal_profiles")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  const user = mapProfile(data, authUser);
  if (user.deactivated) return null;
  return user;
}

export async function validatePortalLogin({ email, password }) {
  const supabaseAuth = getSupabaseAuthClient();
  const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });

  if (error || !data?.session || !data?.user) {
    return { ok: false, reason: "invalid" };
  }

  const user = await fetchProfileForAuthUser(data.user);
  if (!user) return { ok: false, reason: "pending" };

  return { ok: true, user, session: data.session };
}

export function createSessionCookies(session) {
  return [
    serializeCookie(ACCESS_COOKIE, session.access_token, SESSION_MAX_AGE_SECONDS),
    serializeCookie(REFRESH_COOKIE, session.refresh_token || "", REFRESH_MAX_AGE_SECONDS),
  ];
}

export function clearSessionCookies() {
  return [
    serializeCookie(ACCESS_COOKIE, "", 0),
    serializeCookie(REFRESH_COOKIE, "", 0),
  ];
}

export async function getPortalSession(req) {
  const token = parseCookies(req)[ACCESS_COOKIE];
  if (!token) return null;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return null;
    return await fetchProfileForAuthUser(data.user);
  } catch (error) {
    console.error("Portal session lookup failed", error);
    return null;
  }
}

export async function requirePortalSession(context, options = {}) {
  const user = await getPortalSession(context.req);
  if (!user) {
    return { redirect: { destination: "/investor-portal", permanent: false } };
  }
  if (options.roles && !options.roles.includes(user.role)) {
    return { redirect: { destination: "/investor-portal/dashboard", permanent: false } };
  }
  return { props: { user } };
}

export function canViewOfferingDocuments(user) {
  return user?.role === "Admin" || (user?.role === "Approved Investor" && user?.status === "Approved Investor");
}

export async function logPortalEvent(event) {
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from("portal_activity_logs").insert({
      user_id: event.userId || null,
      email: event.email || null,
      event_type: event.type || "portal_event",
      resource_type: event.resourceType || null,
      resource_id: event.resourceId || null,
      metadata: event.metadata || {},
    });
  } catch (error) {
    console.info(JSON.stringify({ portalEvent: true, timestamp: new Date().toISOString(), ...event }));
  }
}
