import { getPortalSession, logPortalEvent } from "../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

const editableFields = ["name", "phone", "entity_name", "investor_type", "estimated_range", "relationship_source"];

function cleanValue(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export default async function handler(req, res) {
  const user = await getPortalSession(req);
  if (!user) return res.status(401).json({ error: "Investor portal login required" });

  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const updates = { updated_at: new Date().toISOString() };
  for (const field of editableFields) {
    if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) {
      updates[field] = cleanValue(req.body[field]);
    }
  }

  if (!Object.keys(updates).some((key) => key !== "updated_at")) {
    return res.status(400).json({ error: "No profile updates were provided" });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("portal_profiles")
    .update(updates)
    .eq("id", user.id)
    .select("id, name, email, phone, role, status, entity_name, accredited_status, investor_type, estimated_range, relationship_source, onboarding_status, documents_completed, compliance_review_status, deactivated")
    .single();

  if (error) return res.status(500).json({ error: error.message });

  await logPortalEvent({
    type: "investor_profile_update",
    userId: user.id,
    email: user.email,
    resourceType: "portal_profile",
    resourceId: user.id,
    metadata: { fields: Object.keys(updates).filter((key) => key !== "updated_at") },
  });

  return res.status(200).json({ profile: data });
}
