import { getPortalSession } from "../../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { ACTIVITY_TYPES, logActivity } from "../../../../lib/crm";

const LABELS = Object.fromEntries(ACTIVITY_TYPES.map((t) => [t.value, t.label]));

export default async function handler(req, res) {
  const admin = await getPortalSession(req, res);
  if (!admin || admin.role !== "Admin") return res.status(403).json({ error: "Admin access required" });
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { contactId, type, body, nextFollowUp, followUpNote, clearFollowUp } = req.body || {};
  if (!contactId) return res.status(400).json({ error: "Contact id is required." });
  if (!LABELS[type]) return res.status(400).json({ error: "Invalid activity type." });
  const text = String(body || "").trim();
  if (!text) return res.status(400).json({ error: "Write something to log." });
  if (nextFollowUp && !/^\d{4}-\d{2}-\d{2}$/.test(nextFollowUp)) return res.status(400).json({ error: "Invalid follow-up date." });

  const supabase = getSupabaseAdmin();
  try {
    const firstLine = text.split("\n")[0];
    const activity = await logActivity(supabase, {
      contactId,
      type,
      summary: `${LABELS[type]}: ${firstLine.length > 120 ? `${firstLine.slice(0, 117)}...` : firstLine}`,
      body: text,
      createdBy: admin.email || admin.name || "admin",
    });

    let contact = null;
    if (nextFollowUp || clearFollowUp) {
      const update = nextFollowUp
        ? { next_follow_up: nextFollowUp, follow_up_note: followUpNote ? String(followUpNote).slice(0, 300) : null }
        : { next_follow_up: null, follow_up_note: null };
      const { data, error } = await supabase.from("crm_contacts").update(update).eq("id", contactId).select("*").single();
      if (error) throw error;
      contact = data;
    }
    return res.status(200).json({ ok: true, activity, contact });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
