import { useState } from "react";
import PortalLayout from "../../components/PortalLayout";
import { requirePortalSession } from "../../lib/portalAuth";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

const inputClass = "w-full border border-white/10 bg-[#050605] px-4 py-3 text-white outline-none focus:border-[#d5ad62]";
const statuses = ["Open", "Closing Soon", "Fully Subscribed"];
const investmentTypes = ["Debt", "Equity", "Preferred Equity", "2nd Position", "1st Position", "EMD", "Appraisal", "Fund"];
const documentTypes = ["PPM", "Operating Agreement", "Subscription Agreement", "Investor Deck", "Underwriting Summary", "Appraisal / Valuation", "Funding Instructions", "Quarterly Statement", "K-1", "Signed Docs"];
const investorDocumentCategories = ["Company Overview", "Fund Materials", "Risk Disclosures", "Subscription Documents", "Tax Documents", "Monthly Reports", "Investor Notices"];

export async function getServerSideProps(context) {
  const result = await requirePortalSession(context, { roles: ["Admin"] });
  if (!result.props?.user) return result;
  const supabase = getSupabaseAdmin();
  const [{ data: deals }, { data: documents }, { data: updates }, { data: commitments }, { data: distributions }, { data: users }] = await Promise.all([
    supabase.from("investor_deals").select("*").order("created_at", { ascending: false }),
    supabase.from("investor_deal_documents").select("*").order("created_at", { ascending: false }),
    supabase.from("investor_deal_updates").select("*").order("created_at", { ascending: false }),
    supabase.from("investor_commitments").select("*, portal_profiles(name,email), investor_deals(name)").order("created_at", { ascending: false }),
    supabase.from("investor_distributions").select("*").order("created_at", { ascending: false }),
    supabase.from("portal_profiles").select("id,name,email,role,status").order("created_at", { ascending: false }),
  ]);
  return { props: { user: result.props.user, deals: deals || [], documents: documents || [], updates: updates || [], commitments: commitments || [], distributions: distributions || [], users: users || [] } };
}

function Field({ label, children }) {
  return <label className="grid gap-2 text-sm font-bold text-white/70"><span>{label}</span>{children}</label>;
}

function Section({ title, eyebrow, children }) {
  return <section className="border border-white/10 bg-[#111613] p-6 md:p-7"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{eyebrow}</p><h3 className="mt-3 text-2xl font-black">{title}</h3><div className="mt-5">{children}</div></section>;
}

async function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminInvestments({ user, deals = [], documents = [], updates = [], commitments = [], distributions = [], users = [] }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitJson(path, payload, method = "POST") {
    setBusy(true);
    setMessage("Working...");
    const response = await fetch(path, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setBusy(false);
      setMessage(data.error || "Something went wrong.");
      return;
    }
    setMessage("Saved. Refreshing...");
    window.location.reload();
  }

  async function createDeal(event) {
    event.preventDefault();
    await submitJson("/api/portal/admin/investor-deals", Object.fromEntries(new FormData(event.currentTarget).entries()));
  }

  async function uploadDocument(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const file = form.get("file");
    delete payload.file;
    if (file && file.size) {
      payload.fileName = file.name;
      payload.contentType = file.type;
      payload.fileBase64 = await readFileAsDataUrl(file);
    }
    await submitJson("/api/portal/admin/investor-deal-documents", payload);
  }

  async function uploadInvestorDocument(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const file = form.get("file");
    delete payload.file;
    if (file && file.size) {
      payload.fileName = file.name;
      payload.contentType = file.type;
      payload.fileBase64 = await readFileAsDataUrl(file);
    }
    payload.role = "";
    await submitJson("/api/portal/admin/documents", payload);
  }

  async function postUpdate(event) {
    event.preventDefault();
    await submitJson("/api/portal/admin/investor-deal-updates", Object.fromEntries(new FormData(event.currentTarget).entries()));
  }

  async function addDistribution(event) {
    event.preventDefault();
    await submitJson("/api/portal/admin/investor-distributions", Object.fromEntries(new FormData(event.currentTarget).entries()));
  }

  async function updateCommitment(event) {
    event.preventDefault();
    await submitJson("/api/portal/admin/investor-commitments", Object.fromEntries(new FormData(event.currentTarget).entries()), "PATCH");
  }

  return (
    <PortalLayout user={user} title="Investment Management">
      {message && <div className="mb-6 border border-[#d5ad62]/40 bg-[#d5ad62]/10 p-4 text-sm font-bold text-[#f0d99a]">{message}</div>}
      <div className="mb-8 grid gap-5 md:grid-cols-5">{[["Deals", deals.length], ["Documents", documents.length], ["Updates", updates.length], ["Commitments", commitments.length], ["Distributions", distributions.length]].map(([label, value]) => <article key={label} className="border border-white/10 bg-white/5 p-5"><p className="text-xs font-black uppercase text-[#d5ad62]">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></article>)}</div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section eyebrow="Deals Admin" title="Create or Update Deal Opportunity">
          <form onSubmit={createDeal} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2"><Field label="Deal Name"><input name="name" required className={inputClass} /></Field><Field label="Custom Slug / ID"><input name="id" className={inputClass} placeholder="optional-custom-id" /></Field><Field label="Location"><input name="location" required className={inputClass} /></Field><Field label="Investment Type"><select name="investment_type" className={inputClass}>{investmentTypes.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Target Return"><input name="target_return" required className={inputClass} placeholder="11.25% target annualized" /></Field><Field label="Status"><select name="status" className={inputClass}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Minimum Investment"><input name="minimum_investment" type="number" className={inputClass} /></Field><Field label="Total Raise"><input name="total_raise" type="number" className={inputClass} /></Field><Field label="Amount Funded"><input name="amount_funded" type="number" className={inputClass} /></Field><Field label="Term"><input name="term" className={inputClass} /></Field><Field label="Preferred Return"><input name="preferred_return" className={inputClass} /></Field><Field label="LTV / Leverage"><input name="ltv" className={inputClass} /></Field><Field label="Equity Multiple"><input name="equity_multiple" className={inputClass} /></Field></div>
            <Field label="Executive Summary"><textarea name="summary" rows="3" className={inputClass} /></Field><Field label="Business Plan"><textarea name="business_plan" rows="3" className={inputClass} /></Field><Field label="Sponsor Notes"><textarea name="sponsor_notes" rows="3" className={inputClass} /></Field><Field label="Timeline, one item per line"><textarea name="timeline" rows="4" className={inputClass} /></Field><Field label="Capital Stack, one line as Label | Amount"><textarea name="capital_stack" rows="4" className={inputClass} placeholder="Senior debt | $750,000" /></Field><Field label="Sources and Uses, one line as Label | Amount"><textarea name="sources_uses" rows="4" className={inputClass} placeholder="Acquisition payoff | $640,000" /></Field><Field label="Sensitivity Summary"><textarea name="sensitivity" rows="4" className={inputClass} /></Field>
            <button disabled={busy} className="bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-50">Save Deal</button>
          </form>
        </Section>

        <Section eyebrow="Investor Documents" title="Upload Document to Individual Investor">
          <form onSubmit={uploadInvestorDocument} className="grid gap-4">
            <Field label="Investor"><select name="profile_id" required className={inputClass}>{users.map((item) => <option key={item.id} value={item.id}>{item.name || item.email}</option>)}</select></Field>
            <Field label="Document Name"><input name="name" required className={inputClass} /></Field>
            <Field label="Category"><select name="category" required className={inputClass}>{investorDocumentCategories.map((item) => <option key={item}>{item}</option>)}</select></Field>
            <Field label="File"><input name="file" type="file" required className={inputClass} /></Field>
            <p className="text-sm leading-6 text-white/55">This uploads the file to private storage and assigns it only to the selected investor. It will appear in that investor's Document Center after upload.</p>
            <button disabled={busy} className="bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-50">Upload Investor Document</button>
          </form>
        </Section>

        <Section eyebrow="Fund Documents" title="Upload Fund Document">
          <form onSubmit={uploadDocument} className="grid gap-4"><Field label="Fund"><select name="deal_id" required className={inputClass}>{deals.map((deal) => <option key={deal.id} value={deal.id}>{deal.name}</option>)}</select></Field><Field label="Document Name"><input name="name" required className={inputClass} /></Field><Field label="Document Type"><select name="type" className={inputClass}>{documentTypes.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Display Date"><input name="display_date" type="date" className={inputClass} /></Field><Field label="File"><input name="file" type="file" className={inputClass} /></Field><button disabled={busy} className="bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-50">Upload Document</button></form>
        </Section>

        <Section eyebrow="Deal Updates" title="Post Deal Update"><form onSubmit={postUpdate} className="grid gap-4"><Field label="Deal"><select name="deal_id" required className={inputClass}>{deals.map((deal) => <option key={deal.id} value={deal.id}>{deal.name}</option>)}</select></Field><Field label="Title"><input name="title" required className={inputClass} /></Field><Field label="Date"><input name="update_date" type="date" className={inputClass} /></Field><Field label="Summary"><textarea name="summary" required rows="5" className={inputClass} /></Field><button disabled={busy} className="bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-50">Post Update</button></form></Section>

        <Section eyebrow="Reporting Admin" title="Add Distribution Record"><form onSubmit={addDistribution} className="grid gap-4"><Field label="Investor"><select name="investor_id" className={inputClass}><option value="">All / Unassigned</option>{users.map((item) => <option key={item.id} value={item.id}>{item.name || item.email}</option>)}</select></Field><Field label="Deal"><select name="deal_id" className={inputClass}><option value="">General</option>{deals.map((deal) => <option key={deal.id} value={deal.id}>{deal.name}</option>)}</select></Field><Field label="Investment Name"><input name="investment" required className={inputClass} /></Field><Field label="Distribution Date"><input name="distribution_date" type="date" required className={inputClass} /></Field><Field label="Amount"><input name="amount" type="number" className={inputClass} /></Field><Field label="Type"><input name="type" required className={inputClass} placeholder="Preferred return" /></Field><Field label="Status"><select name="status" className={inputClass}><option>Projected</option><option>Paid</option><option>Held</option><option>Cancelled</option></select></Field><button disabled={busy} className="bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-50">Add Distribution</button></form></Section>
      </div>

      <Section eyebrow="Commitments Admin" title="Review Commitment Statuses" className="mt-6">
        <form onSubmit={updateCommitment} className="grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end"><Field label="Commitment"><select name="id" required className={inputClass}>{commitments.map((item) => <option key={item.id} value={item.id}>{item.portal_profiles?.email || "Investor"} / {item.investor_deals?.name || item.deal_id} / ${Number(item.amount || 0).toLocaleString()}</option>)}</select></Field><Field label="Status"><select name="status" className={inputClass}><option>Received</option><option>Approved</option><option>Pending Funding</option><option>Funded</option><option>Cancelled</option></select></Field><button disabled={busy} className="bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-50">Update</button></form>
      </Section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2"><Section eyebrow="Current Deals" title="Admin Deal Records"><div className="grid gap-3">{deals.map((deal) => <div key={deal.id} className="border border-white/10 bg-white/5 p-4"><p className="font-black">{deal.name}</p><p className="mt-1 text-sm text-white/50">{deal.investment_type} / {deal.status} / {deal.target_return}</p></div>)}</div></Section><Section eyebrow="Recent Commitments" title="Investor Commitments"><div className="grid gap-3">{commitments.map((item) => <div key={item.id} className="border border-white/10 bg-white/5 p-4"><p className="font-black">{item.portal_profiles?.email || "Investor"}</p><p className="mt-1 text-sm text-white/50">{item.investor_deals?.name || item.deal_id} / ${Number(item.amount || 0).toLocaleString()} / {item.status}</p></div>)}</div></Section></section>
    </PortalLayout>
  );
}
