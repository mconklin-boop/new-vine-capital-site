import { useState } from "react";
import ConnectedBankAccounts from "../../components/ConnectedBankAccounts";
import PortalLayout from "../../components/PortalLayout";
import { requirePortalSession } from "../../lib/portalAuth";

export async function getServerSideProps(context) {
  return requirePortalSession(context);
}

const inputClass = "w-full border border-white/10 bg-[#050605] px-4 py-3 text-white outline-none focus:border-[#d5ad62]";
const investorTypeOptions = ["Not specified", "Individual", "Joint Investors", "LLC / Entity", "Trust", "SDIRA / Retirement Account", "Advisor / Referral Partner", "Other"];
const investmentRangeOptions = ["Not specified", "Under $10,000", "$10,000 - $24,999", "$25,000 - $49,999", "$50,000 - $99,999", "$100,000 - $249,999", "$250,000 - $499,999", "$500,000+", "Varies by opportunity"];

function normalizeOption(value, options) {
  return options.includes(value) ? value : "Not specified";
}

function Field({ label, children }) {
  return <label className="grid gap-2 text-sm font-bold text-white/70"><span>{label}</span>{children}</label>;
}

function LockedField({ label, value }) {
  return <article className="border border-white/10 bg-white/5 p-4"><p className="text-xs font-black uppercase tracking-wide text-white/45">{label}</p><p className="mt-2 text-white/80">{value || "Pending"}</p></article>;
}

export default function InvestorProfile({ user }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    entity_name: user.entityName || "",
    investor_type: normalizeOption(user.investorType, investorTypeOptions),
    estimated_range: normalizeOption(user.estimatedRange, investmentRangeOptions),
    relationship_source: user.relationshipSource || "",
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitProfile(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("Saving profile updates...");

    const response = await fetch("/api/portal/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => ({}));

    setBusy(false);
    if (!response.ok) {
      setMessage(data.error || "Unable to save profile updates.");
      return;
    }
    setMessage("Profile updates saved.");
  }

  const lockedFields = [
    ["Email", user.email],
    ["Accreditation Status", user.accreditedStatus],
    ["Onboarding Status", user.onboardingStatus],
    ["Documents Completed", user.documentsCompleted],
    ["Compliance Review Status", user.complianceReviewStatus],
    ["Portal Role", user.role],
    ["Bank / Funding Method", "ACH / Wire instructions after approval"],
    ["Tax Document Delivery", "Electronic delivery"],
  ];

  return (
    <PortalLayout user={user} title="Investor Profile & Settings">
      <ConnectedBankAccounts />

      {message && <div className="mt-6 border border-[#d5ad62]/40 bg-[#d5ad62]/10 p-4 text-sm font-bold text-[#f0d99a]">{message}</div>}

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <form onSubmit={submitProfile} className="border border-white/10 bg-[#111613] p-7">
          <p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">Investor-controlled profile</p>
          <h3 className="mt-3 text-2xl font-black">Update Profile Details</h3>
          <p className="mt-3 text-sm leading-6 text-white/60">Keep your contact information and investor profile details current. Locked items remain controlled by New Vine Capital for compliance and portal access review.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Investor name"><input name="name" value={form.name} onChange={updateField} className={inputClass} /></Field>
            <Field label="Phone"><input name="phone" value={form.phone} onChange={updateField} className={inputClass} /></Field>
            <Field label="Entity name"><input name="entity_name" value={form.entity_name} onChange={updateField} className={inputClass} placeholder="Individual, LLC, trust, etc." /></Field>
            <Field label="Investor type"><select name="investor_type" value={form.investor_type} onChange={updateField} className={inputClass}>{investorTypeOptions.map((option) => <option key={option}>{option}</option>)}</select></Field>
            <Field label="Estimated investment range"><select name="estimated_range" value={form.estimated_range} onChange={updateField} className={inputClass}>{investmentRangeOptions.map((option) => <option key={option}>{option}</option>)}</select></Field>
            <Field label="Relationship source"><input name="relationship_source" value={form.relationship_source} onChange={updateField} className={inputClass} placeholder="Referral, broker, JotForm, existing relationship" /></Field>
          </div>

          <button disabled={busy} className="mt-6 bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-50">Save Profile Updates</button>
        </form>

        <aside className="border border-white/10 bg-white/5 p-7">
          <p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">Admin-reviewed fields</p>
          <h3 className="mt-3 text-2xl font-black">Locked Profile Items</h3>
          <p className="mt-3 text-sm leading-6 text-white/60">These items are controlled by New Vine Capital because they relate to portal access, qualification, tax delivery, funding method, or compliance review.</p>
          <div className="mt-6 grid gap-3">
            {lockedFields.map(([label, value]) => <LockedField key={label} label={label} value={value} />)}
          </div>
          <a href="mailto:deals@newvinecapital.com" className="mt-5 inline-flex border border-white/15 px-5 py-3 text-xs font-black uppercase text-white">Request Compliance Update</a>
        </aside>
      </section>
    </PortalLayout>
  );
}
