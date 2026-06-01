import { useState } from "react";
import PortalLayout from "../../components/PortalLayout";
import { requirePortalSession } from "../../lib/portalAuth";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

const roles = ["Admin", "Approved Investor", "Pending Investor", "Advisor / Referral Partner"];
const statuses = ["Approved Investor", "Pending Investor", "Advisor / Referral Partner", "Inactive"];
const categories = ["Company Overview", "Fund Materials", "Risk Disclosures", "Subscription Documents", "Tax Documents", "Monthly Reports", "Investor Notices"];

export async function getServerSideProps(context) {
  const result = await requirePortalSession(context, { roles: ["Admin"] });
  if (!result.props?.user) return result;

  const supabase = getSupabaseAdmin();
  const [{ data: users }, { data: documents }, { data: logs }, { data: updates }] = await Promise.all([
    supabase.from("portal_profiles").select("id, name, email, role, status, deactivated, created_at").order("created_at", { ascending: false }).limit(50),
    supabase.from("portal_documents").select("id, name, category, upload_date").order("upload_date", { ascending: false }).limit(50),
    supabase.from("portal_activity_logs").select("id, email, event_type, created_at").order("created_at", { ascending: false }).limit(25),
    supabase.from("portal_monthly_updates").select("id, title, update_date").order("update_date", { ascending: false }).limit(20),
  ]);

  return { props: { user: result.props.user, users: users || [], documents: documents || [], logs: logs || [], updates: updates || [] } };
}

async function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Field({ label, children }) {
  return <label className="grid gap-2 text-sm font-bold text-white/70"><span>{label}</span>{children}</label>;
}

const inputClass = "w-full border border-white/10 bg-[#050605] px-4 py-3 text-white outline-none focus:border-[#d5ad62]";

export default function AdminDashboard({ user, users = [], documents = [], logs = [], updates = [] }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitJson(path, payload, method = "POST") {
    setBusy(true);
    setMessage("Working...");
    const response = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setBusy(false);
      setMessage(data.error || "Something went wrong.");
      return;
    }
    setMessage("Saved. Refreshing...");
    window.location.reload();
  }

  async function createInvestor(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.email = payload.investor_email;
    payload.password = payload.temporary_password;
    delete payload.investor_email;
    delete payload.temporary_password;
    await submitJson("/api/portal/admin/users", payload);
  }

  async function updateInvestor(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.deactivated = payload.deactivated === "true";
    await submitJson("/api/portal/admin/users", payload, "PATCH");
  }

  async function uploadDocument(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("file");
    const payload = Object.fromEntries(form.entries());
    delete payload.file;
    if (file && file.size) {
      payload.fileName = file.name;
      payload.contentType = file.type;
      payload.fileBase64 = await readFileAsDataUrl(file);
    }
    if (payload.assignment_type === "profile") payload.role = "";
    if (payload.assignment_type === "role") payload.profile_id = "";
    if (payload.assignment_type === "none") {
      payload.profile_id = "";
      payload.role = "";
    }
    delete payload.assignment_type;
    await submitJson("/api/portal/admin/documents", payload);
  }

  async function postUpdate(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await submitJson("/api/portal/admin/monthly-updates", Object.fromEntries(form.entries()));
  }

  const summary = [["Investor Users", users.length], ["Documents", documents.length], ["Monthly Updates", updates.length], ["Recent Access Logs", logs.length]];

  return (
    <PortalLayout user={user} title="Admin Dashboard">
      {message && <div className="mb-6 border border-[#d5ad62]/40 bg-[#d5ad62]/10 p-4 text-sm font-bold text-[#f0d99a]">{message}</div>}
      <div className="grid gap-5 md:grid-cols-4">{summary.map(([label, value]) => <article key={label} className="border border-white/10 bg-[#111613] p-6"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{label}</p><h3 className="mt-3 text-3xl font-black">{value}</h3></article>)}</div>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <form onSubmit={createInvestor} autoComplete="off" className="border border-white/10 bg-[#111613] p-7">
          <h3 className="text-2xl font-black">Create Investor Login</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Name"><input name="name" autoComplete="off" className={inputClass} /></Field>
            <Field label="New Investor Email"><input name="investor_email" type="email" required autoComplete="off" placeholder="investor@example.com" className={inputClass} /></Field>
            <Field label="Temporary Password"><input name="temporary_password" type="password" required autoComplete="new-password" className={inputClass} /></Field>
            <Field label="Phone"><input name="phone" autoComplete="off" className={inputClass} /></Field>
            <Field label="Role"><select name="role" defaultValue="Pending Investor" className={inputClass}>{roles.map((role) => <option key={role}>{role}</option>)}</select></Field>
            <Field label="Status"><select name="status" defaultValue="Pending Investor" className={inputClass}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></Field>
            <Field label="Entity Name"><input name="entity_name" autoComplete="off" className={inputClass} /></Field>
            <Field label="Estimated Range"><input name="estimated_range" autoComplete="off" className={inputClass} placeholder="Example: $25,000 - $100,000" /></Field>
            <Field label="Investor Type"><input name="investor_type" autoComplete="off" className={inputClass} placeholder="Individual, entity, advisor" /></Field>
            <Field label="Relationship Source"><input name="relationship_source" autoComplete="off" className={inputClass} placeholder="JotForm, referral, broker" /></Field>
          </div>
          <button disabled={busy} className="mt-6 bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-50">Create Login</button>
        </form>

        <form onSubmit={updateInvestor} className="border border-white/10 bg-[#111613] p-7">
          <h3 className="text-2xl font-black">Approve / Update Investor</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Investor"><select name="id" required className={inputClass}>{users.map((item) => <option key={item.id} value={item.id}>{item.name || item.email}</option>)}</select></Field>
            <Field label="Role"><select name="role" className={inputClass}>{roles.map((role) => <option key={role}>{role}</option>)}</select></Field>
            <Field label="Status"><select name="status" className={inputClass}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></Field>
            <Field label="Portal Access"><select name="deactivated" defaultValue="false" className={inputClass}><option value="false">Active</option><option value="true">Deactivated</option></select></Field>
            <Field label="Onboarding Status"><input name="onboarding_status" className={inputClass} placeholder="Approved, In review, Missing documents" /></Field>
            <Field label="Compliance Review"><input name="compliance_review_status" className={inputClass} placeholder="Approved, Pending review" /></Field>
          </div>
          <button disabled={busy} className="mt-6 bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-50">Save Investor</button>
          <a href="/api/portal/admin/export-users" className="ml-3 mt-6 inline-flex border border-white/15 px-5 py-3 text-xs font-black uppercase text-white">Export CSV</a>
        </form>

        <form onSubmit={uploadDocument} className="border border-white/10 bg-[#111613] p-7">
          <h3 className="text-2xl font-black">Upload Private Document</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Document Name"><input name="name" required className={inputClass} /></Field>
            <Field label="Category"><select name="category" required className={inputClass}>{categories.map((category) => <option key={category}>{category}</option>)}</select></Field>
            <Field label="File"><input name="file" type="file" required className={inputClass} /></Field>
            <Field label="Assignment Type"><select name="assignment_type" defaultValue="role" className={inputClass}><option value="role">Assign by Role</option><option value="profile">Assign to Investor</option><option value="none">Unassigned</option></select></Field>
            <Field label="Assign to Investor"><select name="profile_id" className={inputClass}><option value="">None</option>{users.map((item) => <option key={item.id} value={item.id}>{item.name || item.email}</option>)}</select></Field>
            <Field label="Assign to Role"><select name="role" defaultValue="Approved Investor" className={inputClass}><option value="">None</option>{roles.map((role) => <option key={role}>{role}</option>)}</select></Field>
          </div>
          <p className="mt-4 text-sm text-white/55">Files are uploaded to the private Supabase bucket and shown only through secure signed links.</p>
          <button disabled={busy} className="mt-6 bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-50">Upload Document</button>
        </form>

        <form onSubmit={postUpdate} className="border border-white/10 bg-[#111613] p-7">
          <h3 className="text-2xl font-black">Post Monthly Update</h3>
          <div className="mt-5 grid gap-4">
            <Field label="Title"><input name="title" required className={inputClass} /></Field>
            <Field label="Date"><input name="update_date" type="date" className={inputClass} /></Field>
            <Field label="Summary"><textarea name="summary" required rows="3" className={inputClass} /></Field>
            <Field label="Full Update"><textarea name="content" required rows="7" className={inputClass} /></Field>
            <Field label="Optional PDF Storage Path"><input name="pdf_storage_path" className={inputClass} placeholder="documents/2026-05/report.pdf" /></Field>
          </div>
          <button disabled={busy} className="mt-6 bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-50">Post Update</button>
        </form>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Investor Users</h3><div className="mt-5 grid gap-3">{users.map((item) => <div key={item.id} className="border border-white/10 bg-white/5 p-4"><p className="font-black">{item.name || item.email}</p><p className="mt-1 text-sm text-white/55">{item.email} / {item.role} / {item.status}{item.deactivated ? " / Deactivated" : ""}</p></div>)}</div></article>
        <article className="border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Document Library</h3><div className="mt-5 grid gap-3">{documents.map((item) => <div key={item.id} className="border border-white/10 bg-white/5 p-4"><p className="font-black">{item.name}</p><p className="mt-1 text-sm text-white/55">{item.category} / {item.upload_date}</p></div>)}</div></article>
        <article className="border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Monthly Updates</h3><div className="mt-5 grid gap-3">{updates.map((item) => <div key={item.id} className="border border-white/10 bg-white/5 p-4"><p className="font-black">{item.title}</p><p className="mt-1 text-sm text-white/55">{item.update_date}</p></div>)}</div></article>
        <article className="border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Access Logs</h3><div className="mt-5 grid gap-3">{logs.map((item) => <div key={item.id} className="border border-white/10 bg-white/5 p-4"><p className="font-black">{item.event_type}</p><p className="mt-1 text-sm text-white/55">{item.email || "System"} / {item.created_at}</p></div>)}</div></article>
      </section>
    </PortalLayout>
  );
}
