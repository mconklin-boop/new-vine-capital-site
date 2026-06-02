import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

async function requireAdmin(req, res) {
  const user = await getPortalSession(req);
  if (!user || user.role !== "Admin") {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }
  return user;
}

function getSiteOrigin(req) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (configuredUrl) return configuredUrl.startsWith("http") ? configuredUrl : `https://${configuredUrl}`;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  return `${protocol}://${host}`;
}

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const supabase = getSupabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("portal_profiles")
      .select("id, name, email, phone, role, status, entity_name, accredited_status, investor_type, estimated_range, relationship_source, onboarding_status, documents_completed, compliance_review_status, deactivated, created_at")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ users: data || [] });
  }

  if (req.method === "POST") {
    const { email, name, phone, role = "Pending Investor", status = "Pending Investor", entity_name, investor_type, estimated_range, relationship_source } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email is required" });

    const redirectTo = `${getSiteOrigin(req)}/investor-portal/set-password`;
    const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: { name: name || email },
    });
    if (authError) return res.status(500).json({ error: authError.message });
    if (!authData?.user?.id) return res.status(500).json({ error: "Supabase did not return an invited user id" });

    const profile = {
      id: authData.user.id,
      email,
      name: name || email,
      phone: phone || null,
      role,
      status,
      entity_name: entity_name || null,
      investor_type: investor_type || "Not specified",
      estimated_range: estimated_range || "Not specified",
      relationship_source: relationship_source || "Admin created",
      onboarding_status: status === "Approved Investor" ? "Approved" : "In review",
      compliance_review_status: status === "Approved Investor" ? "Approved" : "Pending review",
      deactivated: false,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("portal_profiles")
      .upsert(profile, { onConflict: "id" })
      .select("*")
      .single();
    if (error) return res.status(500).json({ error: error.message });

    await logPortalEvent({ type: "admin_user_invite", userId: admin.id, email: admin.email, resourceType: "portal_profile", resourceId: data.id, metadata: { email, role, status, redirectTo } });
    return res.status(201).json({ user: data, invited: true });
  }

  if (req.method === "PATCH") {
    const { id, role, status, deactivated, onboarding_status, compliance_review_status } = req.body || {};
    if (!id) return res.status(400).json({ error: "Missing user id" });

    const updates = { updated_at: new Date().toISOString() };
    if (role) updates.role = role;
    if (status) updates.status = status;
    if (typeof deactivated === "boolean") updates.deactivated = deactivated;
    if (onboarding_status) updates.onboarding_status = onboarding_status;
    if (compliance_review_status) updates.compliance_review_status = compliance_review_status;

    const { data, error } = await supabase.from("portal_profiles").update(updates).eq("id", id).select("*").single();
    if (error) return res.status(500).json({ error: error.message });

    await logPortalEvent({ type: "admin_user_update", userId: admin.id, email: admin.email, resourceType: "portal_profile", resourceId: id, metadata: updates });
    return res.status(200).json({ user: data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
