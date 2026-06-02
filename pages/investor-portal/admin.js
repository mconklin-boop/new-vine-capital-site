import { useState } from "react";
import PortalLayout from "../../components/PortalLayout";
import { requirePortalSession } from "../../lib/portalAuth";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

const roles = ["Admin", "Approved Investor", "Pending Investor", "Advisor / Referral Partner"];
const statuses = ["Approved Investor", "Pending Investor", "Advisor / Referral Partner", "Inactive"];
const categories = ["Company Overview", "Fund Materials", "Risk Disclosures", "Subscription Documents", "Tax Documents", "Monthly Reports", "Investor Notices"];
const opportunityStatuses = ["Open", "Closing Soon", "Fully Subscribed", "Pending Review"];
const opportunityTypes = ["Private Credit", "Debt", "Equity", "Preferred Equity", "2nd Position", "1st Position", "EMD", "Appraisal", "Fund", "Bridge Lending", "Transactional Funding"];
const opportunityCategories = ["Private Credit", "Managed Funds", "Direct Deals"];

export async function getServerSideProps(context) {
  const result = await requirePortalSession(context, { roles: ["Admin"] });
  if (!result.props?.user) return result;

  const supabase = getSupabaseAdmin();
  const [{ data: users }, { data: documents }, { data: logs }, { data: updates }, { data: deals }] = await Promise.all([
    supabase.from("portal_profiles").select("id, name, email, role, status, deactivated, created_at").order("created_at", { ascending: false }).limit(50),
    supabase.from("portal_documents").select("id, name, category, upload_date").order("upload_date", { ascending: false }).limit(50),
    supabase.from("portal_activity_logs").select("id, email, event_type, created_at").order("created_at", { ascending: false }).limit(25),
    supabase.from("portal_monthly_updates").select("id, title, update_date").order("update_date", { ascending: false }).limit(20),
    supabase.from("investor_deals").select("id, name, investment_type, status, total_raise, amount_funded, created_at").order("created_at", { ascending: false }).limit(50),
  ]);

  return { props: { user: result.props.user, users: users || [], documents: documents || [], logs: logs || [], updates: updates || [], deals: deals || [] } };
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

export default function AdminDashboard({ user, users = [], documents = [], logs = [], updates = [], deals = [] }) {
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

  async function createOpportunity(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    if (payload.assignment_type !== "specific") payload.profile_id = "";
    await submitJson("/api/portal/admin/deals", payload);
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

  const summary = [["Investor Users", users.length], ["Opportunities", deals.length], ["Documents", documents.length], ["Monthly Updates", updates.length]];

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

        <form onSubmit={createOpportunity} className="border border-white/10 bg-[#111613] p-7 xl:col-span-2">
          <h3 className="text-2xl font-black">Create Investor Opportunity</h3>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-white/55">Create a private opportunity and choose whether it appears for every approved investor or one specific investor. All commitments still require New Vine Capital review before funding instructions are released.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Opportunity Name"><input name="name" required className={inputClass} placeholder="Example: Denver Bridge Note" /></Field>
            <Field label="Location"><input name="location" className={inputClass} placeholder="Denver, Colorado" /></Field>
            <Field label="Investment Type"><select name="investment_type" defaultValue="Private Credit" className={inputClass}>{opportunityTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
            <Field label="Category"><select name="category" defaultValue="Private Credit" className={inputClass}>{opportunityCategories.map((category) => <option key={category}>{category}</option>)}</select></Field>
            <Field label="Status"><select name="status" defaultValue="Pending Review" className={inputClass}>{opportunityStatuses.map((status) => <option key={status}>{status}</option>)}</select></Field>
            <Field label="Visibility"><select name="assignment_type" defaultValue="all" className={inputClass}><option value="all">All Approved Investors</option><option value="specific">Specific Investor</option></select></Field>
            <Field label="Specific Investor"><select name="profile_id" className={inputClass}><option value="">None</option>{users.map((item) => <option key={item.id} value={item.id}>{item.name || item.email}</option>)}</select></Field>
            <Field label="Target Return"><input name="target_return" className={inputClass} placeholder="Subject to offering documents" /></Field>
            <Field label="Minimum Investment"><input name="minimum_investment" className={inputClass} placeholder="25000" /></Field>
            <Field label="Total Raise"><input name="total_raise" className={inputClass} placeholder="500000" /></Field>
            <Field label="Amount Funded"><input name="amount_funded" className={inputClass} placeholder="0" /></Field>
            <Field label="Term"><input name="term" className={inputClass} placeholder="Estimated 12 months" /></Field>
            <Field label="Distribution Frequency"><input name="distribution_frequency" className={inputClass} placeholder="Subject to offering documents" /></Field>
            <Field label="Visual Type"><select name="visual_type" defaultValue="capital-stack" className={inputClass}><option value="capital-stack">Capital Stack</option><option value="lending-diagram">Lending Diagram</option></select></Field>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Summary"><textarea name="summary" rows="4" className={inputClass} /></Field>
            <Field label="Strategy Description"><textarea name="strategy_description" rows="4" className={inputClass} /></Field>
            <Field label="Business Plan"><textarea name="business_plan" rows="4" className={inputClass} /></Field>
            <Field label="Sponsor Notes"><textarea name="sponsor_notes" rows="4" className={inputClass} /></Field>
            <Field label="Why Investors Like This"><textarea name="why_investors_like_this" rows="4" className={inputClass} placeholder="One item per line" /></Field>
            <Field label="Timeline"><textarea name="timeline" rows="4" className={inputClass} placeholder="One item per line" /></Field>
            <Field label="Capital Stack"><textarea name="capital_stack" rows="4" className={inputClass} placeholder="Label | Value, one per line" /></Field>
            <Field label="Sources and Uses"><textarea name="sources_uses" rows="4" className={inputClass} placeholder="Label | Value, one per line" /></Field>
            <Field label="Sensitivity Summary"><textarea name="sensitivity" rows="4" className={inputClass} /></Field>
          </div>
          <button disabled={busy} className="mt-6 bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-50">Create Opportunity</button>
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
        <article className="border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Investor Opportunities</h3><div className="mt-5 grid gap-3">{deals.map((item) => <div key={item.id} className="border border-white/10 bg-white/5 p-4"><p className="font-black">{item.name}</p><p className="mt-1 text-sm text-white/55">{item.investment_type} / {item.status}</p></div>)}</div>{!deals.length && <p className="mt-5 text-white/55">No opportunities have been created yet.</p>}</article>
        <article className="border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Document Library</h3><div className="mt-5 grid gap-3">{documents.map((item) => <div key={item.id} className="border border-white/10 bg-white/5 p-4"><p className="font-black">{item.name}</p><p className="mt-1 text-sm text-white/55">{item.category} / {item.upload_date}</p></div>)}</div>{!documents.length && <p className="mt-5 text-white/55">No documents uploaded yet.</p>}</article>
        <article className="border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Monthly Updates</h3><div className="mt-5 grid gap-3">{updates.map((item) => <div key={item.id} className="border border-white/10 bg-white/5 p-4"><p className="font-black">{item.title}</p><p className="mt-1 text-sm text-white/55">{item.update_date}</p></div>)}</div>{!updates.length && <p className="mt-5 text-white/55">No updates posted yet.</p>}</article>
        <article className="border border-white/10 bg-[#111613] p-7 lg:col-span-2"><h3 className="text-2xl font-black">Access Logs</h3><div className="mt-5 grid gap-3">{logs.map((item) => <div key={item.id} className="border border-white/10 bg-white/5 p-4"><p className="font-black">{item.event_type}</p><p className="mt-1 text-sm text-white/55">{item.email || "System"} / {item.created_at}</p></div>)}</div></article>
      </section>
    </PortalLayout>
  );
}
