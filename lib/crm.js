// Portal CRM helpers. Server-side only (uses the Supabase service role client).

export const CONTACT_TYPES = ["Borrower", "Broker", "Wholesaler", "Business", "Investor", "Partner", "Other"];
export const CONTACT_STAGES = ["Lead", "Contacted", "Active", "Client", "Nurture", "Inactive"];
export const ACTIVITY_TYPES = [
  { value: "note", label: "Note" },
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
];

export function todayMountain(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Denver" }).format(now);
}

// Find a contact by email or create one. Fills in blank fields on an existing
// contact but never overwrites what is already there.
export async function upsertContact(supabase, { email, name, phone, company, contactType, source }) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) throw new Error("Contact email is required.");
  const now = new Date().toISOString();

  const { data: existing, error: findError } = await supabase.from("crm_contacts").select("*").eq("email", normalized).maybeSingle();
  if (findError) throw findError;

  if (existing) {
    const fill = { last_activity_at: now, updated_at: now };
    if (!existing.phone && phone) fill.phone = phone;
    if (!existing.company && company) fill.company = company;
    if (existing.stage === "Inactive") fill.stage = "Lead"; // came back
    const { error } = await supabase.from("crm_contacts").update(fill).eq("id", existing.id);
    if (error) throw error;
    return existing.id;
  }

  const { data, error } = await supabase.from("crm_contacts").insert({
    email: normalized,
    name: name || normalized,
    phone: phone || null,
    company: company || null,
    contact_type: CONTACT_TYPES.includes(contactType) ? contactType : "Other",
    source: source || null,
    last_activity_at: now,
  }).select("id").single();

  if (error?.code === "23505") {
    // Created by a concurrent request; fetch it.
    const { data: again } = await supabase.from("crm_contacts").select("id").eq("email", normalized).single();
    return again.id;
  }
  if (error) throw error;
  return data.id;
}

export async function logActivity(supabase, { contactId, type, summary, body = null, metadata = {}, createdBy = null }) {
  if (!contactId) return null;
  const { data, error } = await supabase.from("crm_activities").insert({
    contact_id: contactId,
    activity_type: type,
    summary: String(summary).slice(0, 300),
    body: body ? String(body).slice(0, 10000) : null,
    metadata,
    created_by: createdBy,
  }).select("*").single();
  if (error) throw error;
  await supabase.from("crm_contacts").update({ last_activity_at: new Date().toISOString() }).eq("id", contactId);
  return data;
}

export function contactTypeForDeal(lead, isBusiness) {
  if (lead.submitterRole === "broker") return "Broker";
  if (lead.submitterRole === "wholesaler") return "Wholesaler";
  return isBusiness ? "Business" : "Borrower";
}
