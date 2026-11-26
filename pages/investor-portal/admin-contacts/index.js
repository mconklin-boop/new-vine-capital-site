import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import PortalLayout from "../../../components/PortalLayout";
import { requirePortalSession } from "../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { CONTACT_STAGES, CONTACT_TYPES, todayMountain } from "../../../lib/crm";

const inputClass = "border border-white/15 bg-[#050605] px-3 py-3 text-sm text-white focus:border-[#d5ad62] focus:outline-none";

export async function getServerSideProps(context) {
  const result = await requirePortalSession(context, { roles: ["Admin"] });
  if (!result.props?.user) return result;
  const supabase = getSupabaseAdmin();
  const [{ data: contacts, error }, { data: deals }] = await Promise.all([
    supabase.from("crm_contacts").select("*").order("last_activity_at", { ascending: false, nullsFirst: false }).limit(1000),
    supabase.from("deal_submissions").select("contact_id, status, loan_amount").not("contact_id", "is", null),
  ]);
  const dealStats = {};
  for (const deal of deals || []) {
    const s = (dealStats[deal.contact_id] ||= { count: 0, open: 0 });
    s.count += 1;
    if (!["Closed", "Declined", "Dead"].includes(deal.status)) s.open += Number(deal.loan_amount) || 0;
  }
  return { props: { user: result.props.user, contacts: contacts || [], dealStats, today: todayMountain(), loadError: error?.message || "" } };
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString("en-US", { timeZone: "America/Denver", month: "short", day: "numeric", year: "numeric" }) : "";
}
function formatDay(value) {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { timeZone: "UTC", month: "short", day: "numeric" });
}

function AddContact({ onDone }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ contactType: "Borrower" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/portal/admin/contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not add contact");
      onDone(data.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  if (!open) return <button onClick={() => setOpen(true)} className="bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b]">+ Add Contact</button>;
  return (
    <form onSubmit={submit} className="mt-4 grid w-full gap-3 border border-[#d5ad62]/40 bg-[#111613] p-5 md:grid-cols-3">
      <input name="name" placeholder="Name *" required onChange={onChange} className={inputClass} />
      <input name="email" type="email" placeholder="Email *" required onChange={onChange} className={inputClass} />
      <input name="phone" placeholder="Phone" onChange={onChange} className={inputClass} />
      <input name="company" placeholder="Company" onChange={onChange} className={inputClass} />
      <select name="contactType" value={form.contactType} onChange={onChange} className={inputClass}>{CONTACT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
      <input name="source" placeholder="Source (referral, event...)" onChange={onChange} className={inputClass} />
      <textarea name="notes" placeholder="Notes" rows={2} onChange={onChange} className={`${inputClass} md:col-span-3`} />
      {error && <p className="text-sm text-[#ffb6a9] md:col-span-3">{error}</p>}
      <div className="flex gap-2 md:col-span-3">
        <button disabled={busy} className="bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-60">{busy ? "Saving" : "Save Contact"}</button>
        <button type="button" onClick={() => setOpen(false)} className="border border-white/20 px-5 py-3 text-xs font-black uppercase text-white/70">Cancel</button>
      </div>
    </form>
  );
}

export default function AdminContacts({ user, contacts = [], dealStats = {}, today, loadError = "" }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [stage, setStage] = useState("All");
  const [dueOnly, setDueOnly] = useState(router.query.due === "1");

  const isDue = (c) => c.next_follow_up && c.next_follow_up <= today;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts
      .filter((c) => (type === "All" || c.contact_type === type) && (stage === "All" || c.stage === stage) && (!dueOnly || isDue(c)))
      .filter((c) => !q || [c.name, c.email, c.phone, c.company].some((v) => String(v || "").toLowerCase().includes(q)))
      .sort((a, b) => (dueOnly ? String(a.next_follow_up).localeCompare(String(b.next_follow_up)) : 0));
  }, [contacts, query, type, stage, dueOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const summary = [
    ["Follow-ups due", contacts.filter(isDue).length],
    ["New this week", contacts.filter((c) => c.created_at >= weekAgo).length],
    ["Open leads", contacts.filter((c) => ["Lead", "Contacted"].includes(c.stage)).length],
    ["Total contacts", contacts.length],
  ];

  const exportCsv = () => {
    const cols = ["name", "email", "phone", "company", "contact_type", "stage", "source", "next_follow_up", "follow_up_note", "created_at", "last_activity_at"];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...filtered.map((row) => cols.map((c) => esc(row[c])).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "nvc-contacts.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <PortalLayout user={user} title="Contacts">
      {loadError && <div className="mb-6 border border-[#8a2516]/50 bg-[#8a2516]/10 p-4 text-sm font-bold text-[#ffb6a9]">Could not load contacts: {loadError}. If this is a new setup, run supabase/crm.sql in Supabase.</div>}
      <div className="grid gap-4 md:grid-cols-4">
        {summary.map(([label, value], index) => (
          <button key={label} onClick={() => index === 0 && setDueOnly(true)} className={`border p-5 text-left ${index === 0 && value > 0 ? "border-[#d5ad62]/60 bg-[#d5ad62]/10" : "border-white/10 bg-[#111613]"}`}>
            <p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{label}</p><p className="mt-2 text-3xl font-black">{value}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, phone, company" className={`${inputClass} min-w-[260px] flex-1`} />
        <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}><option>All</option>{CONTACT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        <select value={stage} onChange={(e) => setStage(e.target.value)} className={inputClass}><option>All</option>{CONTACT_STAGES.map((s) => <option key={s}>{s}</option>)}</select>
        <label className="flex items-center gap-2 text-xs font-black uppercase text-white/70"><input type="checkbox" checked={dueOnly} onChange={(e) => setDueOnly(e.target.checked)} /> Follow-ups due</label>
        <button onClick={exportCsv} className="border border-white/20 px-4 py-3 text-xs font-black uppercase text-white/70 hover:border-[#d5ad62]">Export CSV</button>
        <AddContact onDone={(id) => router.push(`/investor-portal/admin-contacts/${id}`)} />
      </div>

      <div className="mt-6 overflow-x-auto border border-white/10">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-[#111613] text-xs font-black uppercase tracking-wide text-white/50">
            <tr><th className="p-4">Name</th><th className="p-4">Type</th><th className="p-4">Stage</th><th className="p-4">Deals</th><th className="p-4">Follow-up</th><th className="p-4">Last activity</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={6} className="p-6 text-white/55">No contacts match.</td></tr>}
            {filtered.map((c) => {
              const stats = dealStats[c.id];
              return (
                <tr key={c.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                  <td className="p-4"><Link href={`/investor-portal/admin-contacts/${c.id}`} className="font-black text-white hover:text-[#d5ad62]">{c.name}</Link><p className="text-xs text-white/50">{c.company ? `${c.company} · ` : ""}{c.email}</p></td>
                  <td className="p-4 text-white/70">{c.contact_type}</td>
                  <td className="p-4"><span className="border border-white/15 px-2 py-1 text-xs font-black uppercase text-white/70">{c.stage}</span></td>
                  <td className="p-4 text-white/70">{stats ? `${stats.count}${stats.open ? ` · $${stats.open.toLocaleString("en-US")} open` : ""}` : "-"}</td>
                  <td className={`p-4 ${isDue(c) ? "font-black text-[#f0d99a]" : "text-white/60"}`}>{c.next_follow_up ? `${formatDay(c.next_follow_up)}${c.follow_up_note ? ` · ${c.follow_up_note}` : ""}` : "-"}</td>
                  <td className="p-4 text-white/50">{formatDate(c.last_activity_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PortalLayout>
  );
}
