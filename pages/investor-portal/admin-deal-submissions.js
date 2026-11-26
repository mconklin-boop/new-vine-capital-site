import { useMemo, useState } from "react";
import PortalLayout from "../../components/PortalLayout";
import { requirePortalSession } from "../../lib/portalAuth";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";
import { DECISIONS } from "../../lib/underwriting";

const STATUSES = ["New", "Contacted", "Terms Sent", "In Underwriting", "Approved", "Closed", "Declined", "Dead"];
const OPEN_STATUSES = ["New", "Contacted", "Terms Sent", "In Underwriting", "Approved"];

const decisionStyle = {
  [DECISIONS.PASS]: "border-[#3f8f5f] bg-[#3f8f5f]/15 text-[#9be3b4]",
  [DECISIONS.REVIEW]: "border-[#d5ad62] bg-[#d5ad62]/15 text-[#f0d99a]",
  [DECISIONS.FAIL]: "border-[#8a2516] bg-[#8a2516]/15 text-[#ffb6a9]",
};
const flagStyle = { fail: "text-[#ffb6a9]", warn: "text-[#f0d99a]", missing: "text-white/60", info: "text-white/45" };
const flagLabel = { fail: "Fail", warn: "Review", missing: "Missing", info: "Note" };

function formatDate(value) {
  return value ? new Date(value).toLocaleString("en-US", { timeZone: "America/Denver", dateStyle: "medium", timeStyle: "short" }) : "";
}
const money = (value) => (value === null || value === undefined ? "" : `$${Number(value).toLocaleString("en-US")}`);

export async function getServerSideProps(context) {
  const result = await requirePortalSession(context, { roles: ["Admin"] });
  if (!result.props?.user) return result;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("deal_submissions").select("*").order("created_at", { ascending: false }).limit(200);
  return { props: { user: result.props.user, initial: data || [], loadError: error?.message || "" } };
}

function SubmissionCard({ item, onSaved }) {
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.admin_notes || "");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const screen = item.screen_result || {};
  const form = item.form_data || {};

  async function save(body, label) {
    setBusy(label); setMessage("");
    try {
      const response = await fetch("/api/portal/admin/deal-submissions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, ...body }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed");
      onSaved(data.submission);
      setMessage("Saved");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy("");
    }
  }

  const location = [item.property_address, item.property_city, item.property_state, item.property_zip].filter(Boolean).join(", ");
  const errors = Array.isArray(item.integration_errors) ? item.integration_errors : [];

  return (
    <article id={item.id} className="scroll-mt-6 border border-white/10 bg-[#111613] p-5 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`border px-3 py-1 text-xs font-black uppercase ${decisionStyle[item.screen_decision] || "border-white/20 text-white/60"}`}>{item.screen_decision || "Not screened"}</span>
            <span className="text-xs font-black uppercase tracking-wide text-white/50">Score {item.screen_score ?? "-"}/100</span>
            <span className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{screen.productLabel || item.product}</span>
          </div>
          <h3 className="mt-3 text-2xl font-black">{item.contact_name}{item.company_name ? <span className="text-white/50"> · {item.company_name}</span> : null}</h3>
          <p className="mt-1 text-sm text-white/60">
            <a href={`mailto:${item.contact_email}`} className="hover:text-[#d5ad62]">{item.contact_email}</a> · <a href={`tel:${item.contact_phone}`} className="hover:text-[#d5ad62]">{item.contact_phone}</a>
            {item.submitter_role ? ` · ${item.submitter_role}` : ""}
            {item.contact_id ? <> · <a href={`/investor-portal/admin-contacts/${item.contact_id}`} className="font-black text-[#d5ad62] hover:underline">Open contact</a></> : null}
          </p>
          {location && <p className="mt-1 text-sm text-white/60">{location}</p>}
        </div>
        <p className="text-xs text-white/45">{formatDate(item.created_at)}</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-white/45">Screen metrics</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {(screen.metrics || []).map((m) => <div key={m.label} className="contents"><dt className="text-white/55">{m.label}</dt><dd className="text-right font-black">{m.value}</dd></div>)}
          </dl>
          <p className="mt-5 text-xs font-black uppercase tracking-wide text-white/45">Flags</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {(screen.flags || []).length === 0 && <li className="text-[#9be3b4]">No flags. Meets current screening guidelines.</li>}
            {(screen.flags || []).map((flag, index) => <li key={index} className={flagStyle[flag.level]}><strong>{flagLabel[flag.level]}:</strong> {flag.message}</li>)}
          </ul>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-white/45">Submitted numbers</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {[["Purchase price", money(item.purchase_price)], ["As-is value", money(item.as_is_value)], ["Loan requested", money(item.loan_amount)], ["Rehab", form.rehabBudget ? money(form.rehabBudget.replace(/[$,]/g, "")) : ""], ["ARV", form.arv ? money(form.arv.replace(/[$,]/g, "")) : ""], ["Closing", item.closing_date || ""], ["Credit", form.creditBand || ""], ["Occupancy", item.occupancy || ""]].filter(([, val]) => val).map(([label, val]) => <div key={label} className="contents"><dt className="text-white/55">{label}</dt><dd className="text-right font-black">{val}</dd></div>)}
          </dl>
          {form.exitStrategy && <p className="mt-4 text-sm text-white/70"><strong className="text-white">Exit:</strong> {form.exitStrategy}</p>}
          {form.useOfFunds && <p className="mt-2 text-sm text-white/70"><strong className="text-white">Use of funds:</strong> {form.useOfFunds}</p>}
          {form.notes && <p className="mt-2 text-sm text-white/70"><strong className="text-white">Notes:</strong> {form.notes}</p>}
          <details className="mt-4 text-sm text-white/60"><summary className="cursor-pointer text-xs font-black uppercase tracking-wide text-white/45">All submitted fields</summary><pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words bg-[#050605] p-3 text-xs">{JSON.stringify(form, null, 2)}</pre></details>
        </div>
      </div>

      <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 md:grid-cols-[220px_1fr_auto] md:items-end">
        <label className="grid gap-2 text-xs font-black uppercase tracking-wide text-white/55">Status
          <select value={status} onChange={(e) => { setStatus(e.target.value); save({ status: e.target.value }, "status"); }} className="border border-white/15 bg-[#050605] px-3 py-3 text-sm normal-case text-white">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        </label>
        <label className="grid gap-2 text-xs font-black uppercase tracking-wide text-white/55">Notes
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="border border-white/15 bg-[#050605] px-3 py-2 text-sm normal-case text-white" />
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={() => save({ adminNotes: notes }, "notes")} disabled={!!busy} className="bg-[#d5ad62] px-4 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-60">{busy === "notes" ? "Saving" : "Save notes"}</button>
          <button type="button" onClick={() => save({ rescreen: true }, "rescreen")} disabled={!!busy} className="border border-white/20 px-4 py-3 text-xs font-black uppercase text-white/70 hover:border-[#d5ad62] disabled:opacity-60">{busy === "rescreen" ? "Running" : "Re-run screen"}</button>
        </div>
      </div>
      {(message || errors.length > 0) && (
        <p className="mt-3 text-xs text-white/45">{message}{errors.length > 0 && ` Integration issues: ${errors.map((e) => e.key).join(", ")}.`}</p>
      )}
    </article>
  );
}

export default function AdminDealSubmissions({ user, initial = [], loadError = "" }) {
  const [items, setItems] = useState(initial);
  const [decision, setDecision] = useState("All");
  const [view, setView] = useState("Open");

  const filtered = useMemo(() => items.filter((item) => (decision === "All" || item.screen_decision === decision) && (view === "All" || (view === "Open" ? OPEN_STATUSES.includes(item.status) : !OPEN_STATUSES.includes(item.status)))), [items, decision, view]);
  const count = (fn) => items.filter(fn).length;
  const summary = [
    ["New leads", count((i) => i.status === "New")],
    [DECISIONS.PASS, count((i) => i.screen_decision === DECISIONS.PASS && OPEN_STATUSES.includes(i.status))],
    [DECISIONS.REVIEW, count((i) => i.screen_decision === DECISIONS.REVIEW && OPEN_STATUSES.includes(i.status))],
    ["Open pipeline", money(items.filter((i) => OPEN_STATUSES.includes(i.status)).reduce((sum, i) => sum + (Number(i.loan_amount) || 0), 0))],
  ];

  const onSaved = (updated) => setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  const exportCsv = () => {
    const cols = ["created_at", "status", "screen_decision", "screen_score", "product", "contact_name", "contact_email", "contact_phone", "company_name", "submitter_role", "property_address", "property_city", "property_state", "loan_amount", "purchase_price", "as_is_value", "closing_date"];
    const esc = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...filtered.map((row) => cols.map((c) => esc(row[c])).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "nvc-deal-leads.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <PortalLayout user={user} title="Deal Pipeline">
      {loadError && <div className="mb-6 border border-[#8a2516]/50 bg-[#8a2516]/10 p-4 text-sm font-bold text-[#ffb6a9]">Could not load submissions: {loadError}. If this is a new setup, run supabase/deal_submissions.sql in Supabase.</div>}
      <div className="grid gap-4 md:grid-cols-4">
        {summary.map(([label, value]) => <article key={label} className="border border-white/10 bg-[#111613] p-5"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></article>)}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-black uppercase">
        {["Open", "Closed / Dead", "All"].map((item) => <button key={item} onClick={() => setView(item === "Closed / Dead" ? "Done" : item)} className={`border px-4 py-3 ${(view === item || (view === "Done" && item === "Closed / Dead")) ? "border-[#d5ad62] bg-[#d5ad62] text-[#11100b]" : "border-white/10 text-white/65"}`}>{item}</button>)}
        <span className="mx-2 h-6 w-px bg-white/15" />
        {["All", DECISIONS.PASS, DECISIONS.REVIEW, DECISIONS.FAIL].map((item) => <button key={item} onClick={() => setDecision(item)} className={`border px-4 py-3 ${decision === item ? "border-[#d5ad62] text-[#d5ad62]" : "border-white/10 text-white/65"}`}>{item}</button>)}
        <button onClick={exportCsv} className="ml-auto border border-white/20 px-4 py-3 text-white/70 hover:border-[#d5ad62]">Export CSV</button>
      </div>

      <p className="mt-4 text-xs text-white/45">Automatic screens are preliminary and internal only. They are not approvals and are never shown to borrowers.</p>

      <section className="mt-6 grid gap-5">
        {filtered.length === 0 && <div className="border border-white/10 bg-[#111613] p-7 text-white/60">No submissions match this view.</div>}
        {filtered.map((item) => <SubmissionCard key={item.id} item={item} onSaved={onSaved} />)}
      </section>
    </PortalLayout>
  );
}
