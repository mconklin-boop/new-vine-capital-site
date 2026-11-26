import Link from "next/link";
import { useState } from "react";
import PortalLayout from "../../../components/PortalLayout";
import { requirePortalSession } from "../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { ACTIVITY_TYPES, CONTACT_STAGES, CONTACT_TYPES, todayMountain } from "../../../lib/crm";

const inputClass = "w-full border border-white/15 bg-[#050605] px-3 py-3 text-sm text-white focus:border-[#d5ad62] focus:outline-none";
const ICON = { note: "✎", call: "☎", email: "✉", meeting: "◷", deal_submitted: "◆", call_requested: "◷", status_change: "→", stage_change: "→" };

export async function getServerSideProps(context) {
  const result = await requirePortalSession(context, { roles: ["Admin"] });
  if (!result.props?.user) return result;
  const supabase = getSupabaseAdmin();
  const id = String(context.params.id);
  const { data: contact } = await supabase.from("crm_contacts").select("*").eq("id", id).maybeSingle();
  if (!contact) return { notFound: true };
  const [{ data: activities }, { data: deals }, { data: calls }] = await Promise.all([
    supabase.from("crm_activities").select("*").eq("contact_id", id).order("created_at", { ascending: false }).limit(300),
    supabase.from("deal_submissions").select("id, created_at, product, status, screen_decision, screen_score, screen_result, loan_amount, property_address, property_city, property_state").eq("contact_id", id).order("created_at", { ascending: false }),
    supabase.from("investor_call_requests").select("id, created_at, requested_slot, status").eq("contact_id", id).order("created_at", { ascending: false }),
  ]);
  return { props: { user: result.props.user, initialContact: contact, initialActivities: activities || [], deals: deals || [], calls: calls || [], today: todayMountain() } };
}

const stamp = (v) => new Date(v).toLocaleString("en-US", { timeZone: "America/Denver", dateStyle: "medium", timeStyle: "short" });
const money = (v) => (v ? `$${Number(v).toLocaleString("en-US")}` : "");

function Details({ contact, onSaved }) {
  const [form, setForm] = useState(contact);
  const [state, setState] = useState("");
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const dirty = ["name", "phone", "company", "contact_type", "stage", "source", "notes"].some((k) => (form[k] || "") !== (contact[k] || ""));

  async function save() {
    setState("Saving");
    const body = { id: contact.id };
    for (const k of ["name", "phone", "company", "contact_type", "stage", "source", "notes"]) body[k] = form[k] || "";
    const response = await fetch("/api/portal/admin/contacts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await response.json();
    if (!response.ok) return setState(data.error || "Save failed");
    onSaved(data.contact, data.activity);
    setForm(data.contact);
    setState("Saved");
  }

  const field = (label, name, extra = {}) => (
    <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-white/50">{label}<input name={name} value={form[name] || ""} onChange={onChange} className={inputClass} {...extra} /></label>
  );
  return (
    <section className="border border-white/10 bg-[#111613] p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">Details</p>
      <div className="mt-4 grid gap-3">
        {field("Name", "name")}
        <p className="text-sm"><a href={`mailto:${contact.email}`} className="text-[#d5ad62] hover:underline">{contact.email}</a>{contact.phone && <> · <a href={`tel:${contact.phone}`} className="text-[#d5ad62] hover:underline">{contact.phone}</a></>}</p>
        {field("Phone", "phone")}
        {field("Company", "company")}
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-white/50">Type<select name="contact_type" value={form.contact_type} onChange={onChange} className={inputClass}>{CONTACT_TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
          <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-white/50">Stage<select name="stage" value={form.stage} onChange={onChange} className={inputClass}>{CONTACT_STAGES.map((s) => <option key={s}>{s}</option>)}</select></label>
        </div>
        {field("Source", "source")}
        <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-white/50">Background notes<textarea name="notes" rows={4} value={form.notes || ""} onChange={onChange} className={inputClass} /></label>
        <div className="flex items-center gap-3">
          <button onClick={save} disabled={!dirty || state === "Saving"} className="bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-40">Save Details</button>
          <span className="text-xs text-white/50">{state}</span>
        </div>
        <p className="text-xs text-white/40">Added {stamp(contact.created_at)}</p>
      </div>
    </section>
  );
}

function FollowUp({ contact, today, onSaved }) {
  const [date, setDate] = useState(contact.next_follow_up || "");
  const [note, setNote] = useState(contact.follow_up_note || "");
  const [state, setState] = useState("");
  const due = contact.next_follow_up && contact.next_follow_up <= today;

  async function save(clear) {
    setState("Saving");
    const body = { id: contact.id, next_follow_up: clear ? "" : date, follow_up_note: clear ? "" : note };
    const response = await fetch("/api/portal/admin/contacts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await response.json();
    if (!response.ok) return setState(data.error || "Save failed");
    if (clear) { setDate(""); setNote(""); }
    onSaved(data.contact);
    setState(clear ? "Cleared" : "Saved");
  }

  return (
    <section className={`border p-5 ${due ? "border-[#d5ad62]/60 bg-[#d5ad62]/10" : "border-white/10 bg-[#111613]"}`}>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{due ? "Follow-up due" : "Next follow-up"}</p>
      <div className="mt-4 grid gap-3">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What to follow up on" className={inputClass} />
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => save(false)} disabled={!date} className="bg-[#d5ad62] px-4 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-40">Set</button>
          {contact.next_follow_up && <button onClick={() => save(true)} className="border border-white/20 px-4 py-3 text-xs font-black uppercase text-white/70">Mark done</button>}
          <span className="text-xs text-white/50">{state}</span>
        </div>
      </div>
    </section>
  );
}

function LogActivity({ contactId, onLogged }) {
  const [type, setType] = useState("note");
  const [body, setBody] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/portal/admin/contact-activities", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contactId, type, body, nextFollowUp: followUp || undefined }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not log activity");
      onLogged(data.activity, data.contact);
      setBody(""); setFollowUp("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="border border-white/10 bg-[#111613] p-5">
      <div className="flex flex-wrap gap-2">
        {ACTIVITY_TYPES.map((t) => <button type="button" key={t.value} onClick={() => setType(t.value)} className={`border px-4 py-2 text-xs font-black uppercase ${type === t.value ? "border-[#d5ad62] bg-[#d5ad62] text-[#11100b]" : "border-white/15 text-white/65"}`}>{t.label}</button>)}
      </div>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder={type === "call" ? "Who you spoke with, what was discussed, next step" : "What happened"} className={`${inputClass} mt-3`} />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-black uppercase text-white/55">Follow up on <input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className="border border-white/15 bg-[#050605] px-3 py-2 text-sm normal-case text-white" /></label>
        <button disabled={busy || !body.trim()} className="ml-auto bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-40">{busy ? "Saving" : "Log It"}</button>
      </div>
      {error && <p className="mt-2 text-sm text-[#ffb6a9]">{error}</p>}
    </form>
  );
}

export default function ContactDetail({ user, initialContact, initialActivities, deals, calls, today }) {
  const [contact, setContact] = useState(initialContact);
  const [activities, setActivities] = useState(initialActivities);
  const addActivity = (a) => a && setActivities((list) => [a, ...list]);

  return (
    <PortalLayout user={user} title={contact.name}>
      <Link href="/investor-portal/admin-contacts" className="text-xs font-black uppercase tracking-wide text-[#d5ad62] hover:underline">← All contacts</Link>
      <p className="mt-2 text-sm text-white/55">{contact.contact_type} · {contact.stage}{contact.company ? ` · ${contact.company}` : ""}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="grid content-start gap-6">
          <FollowUp contact={contact} today={today} onSaved={setContact} />
          <Details contact={contact} onSaved={(c, a) => { setContact(c); addActivity(a); }} />
        </div>

        <div className="grid content-start gap-6">
          <LogActivity contactId={contact.id} onLogged={(a, c) => { addActivity(a); if (c) setContact(c); }} />

          {(deals.length > 0 || calls.length > 0) && (
            <section className="border border-white/10 bg-[#111613] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">Deals & Calls</p>
              <ul className="mt-3 grid gap-2 text-sm">
                {deals.map((d) => (
                  <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 border border-white/10 p-3">
                    <Link href={`/investor-portal/admin-deal-submissions#${d.id}`} className="font-black hover:text-[#d5ad62]">{d.screen_result?.productLabel || d.product}{d.loan_amount ? ` · ${money(d.loan_amount)}` : ""}</Link>
                    <span className="text-xs text-white/55">{[d.property_address, d.property_city, d.property_state].filter(Boolean).join(", ")}</span>
                    <span className="text-xs font-black uppercase text-white/60">{d.screen_decision} · {d.status}</span>
                  </li>
                ))}
                {calls.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 border border-white/10 p-3">
                    <Link href="/investor-portal/admin-call-requests" className="font-black hover:text-[#d5ad62]">Investor intake call</Link>
                    <span className="text-xs text-white/55">{c.requested_slot}</span>
                    <span className="text-xs font-black uppercase text-white/60">{c.status}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="border border-white/10 bg-[#111613] p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">Timeline</p>
            <ol className="mt-4 grid gap-4">
              {activities.length === 0 && <li className="text-sm text-white/50">No activity yet.</li>}
              {activities.map((a) => (
                <li key={a.id} className="grid grid-cols-[28px_1fr] gap-3">
                  <span className="grid h-7 w-7 place-items-center border border-white/15 text-xs text-[#d5ad62]">{ICON[a.activity_type] || "•"}</span>
                  <div>
                    <p className="text-sm font-black">{a.summary}</p>
                    {a.body && a.body !== a.summary && <p className="mt-1 whitespace-pre-wrap text-sm text-white/65">{a.body}</p>}
                    <p className="mt-1 text-xs text-white/40">{stamp(a.created_at)}{a.created_by ? ` · ${a.created_by}` : ""}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </PortalLayout>
  );
}
