import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { CONTACT_STAGES, CONTACT_TYPES, logActivity, upsertContact } from "../../../../lib/crm";

const EDITABLE = ["name", "phone", "company", "contact_type", "stage", "source", "next_follow_up", "follow_up_note", "notes"];

export default async function handler(req, res) {
  const admin = await getPortalSession(req, res);
  if (!admin || admin.role !== "Admin") return res.status(403).json({ error: "Admin access required" });
  const supabase = getSupabaseAdmin();
  const by = admin.email || admin.name || "admin";

  if (req.method === "POST") {
    const { email, name, phone, company, contactType, source, notes } = req.body || {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim())) return res.status(400).json({ error: "A valid email is required." });
    if (!String(name || "").trim()) return res.status(400).json({ error: "Name is required." });
    try {
      const id = await upsertContact(supabase, { email, name: name.trim(), phone, company, contactType, source: source || "Added manually" });
      if (notes) await logActivity(supabase, { contactId: id, type: "note", summary: "Contact added", body: notes, createdBy: by });
      return res.status(200).json({ ok: true, id });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "PATCH") {
    const { id, ...fields } = req.body || {};
    if (!id) return res.status(400).json({ error: "Contact id is required." });
    const update = { updated_at: new Date().toISOString() };
    for (const key of EDITABLE) {
      if (fields[key] === undefined) continue;
      const value = fields[key] === "" ? null : String(fields[key]).slice(0, 5000);
      update[key] = value;
    }
    if (update.name === null) return res.status(400).json({ error: "Name cannot be blank." });
    if (update.contact_type && !CONTACT_TYPES.includes(update.contact_type)) return res.status(400).json({ error: "Invalid contact type." });
    if (update.stage && !CONTACT_STAGES.includes(update.stage)) return res.status(400).json({ error: "Invalid stage." });
    if (update.next_follow_up && !/^\d{4}-\d{2}-\d{2}$/.test(update.next_follow_up)) return res.status(400).json({ error: "Invalid follow-up date." });

    const { data: before } = await supabase.from("crm_contacts").select("stage").eq("id", id).single();
    const { data, error } = await supabase.from("crm_contacts").update(update).eq("id", id).select("*").single();
    if (error) return res.status(500).json({ error: error.message });

    let activity = null;
    if (update.stage && before && before.stage !== update.stage) {
      activity = await logActivity(supabase, { contactId: id, type: "stage_change", summary: `Stage changed: ${before.stage} → ${update.stage}`, createdBy: by });
    }
    await logPortalEvent({ type: "admin_contact_update", userId: admin.id, email: admin.email, resourceType: "crm_contact", resourceId: id });
    return res.status(200).json({ ok: true, contact: data, activity });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
