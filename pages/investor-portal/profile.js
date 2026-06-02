import { useState } from "react";
import PortalLayout from "../../components/PortalLayout";
import { requirePortalSession } from "../../lib/portalAuth";

export async function getServerSideProps(context) {
  return requirePortalSession(context);
}

const inputClass = "w-full border border-white/10 bg-[#050605] px-4 py-3 text-white outline-none focus:border-[#d5ad62]";

function Field({ label, children }) {
  return <label className="grid gap-2 text-sm font-bold text-white/70"><span>{label}</span>{children}</label>;
}

export default function InvestmentProfile({ user }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    entity_name: user.entityName || "",
    investor_type: user.investorType || "",
    estimated_range: user.estimatedRange || "",
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
    ["Accredited investor status", user.accreditedStatus],
    ["Onboarding status", user.onboardingStatus],
    ["Documents completed", user.documentsCompleted],
    ["Compliance review status", user.complianceReviewStatus],
    ["Portal role", user.role],
  ];

  return (
    <PortalLayout user={user} title="Investment Profile">
      {message && <div className="mb-6 border border-[#d5ad62]/40 bg-[#d5ad62]/10 p-4 text-sm font-bold text-[#f0d99a]">{message}</div>}

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <form onSubmit={submitProfile} className="border border-white/10 bg-[#111613] p-7">
          <p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">Investor-controlled profile</p>
          <h3 className="mt-3 text-2xl font-black">Update Profile Details</h3>
          <p className="mt-3 text-sm leading-6 text-white/60">Keep your contact information and investor profile details current. Compliance-sensitive fields remain locked and require New Vine Capital review.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Investor name"><input name="name" value={form.name} onChange={updateField} className={inputClass} /></Field>
            <Field label="Phone"><input name="phone" value={form.phone} onChange={updateField} className={inputClass} /></Field>
            <Field label="Entity name"><input name="entity_name" value={form.entity_name} onChange={updateField} className={inputClass} placeholder="Individual, LLC, trust, etc." /></Field>
            <Field label="Investor type"><input name="investor_type" value={form.investor_type} onChange={updateField} className={inputClass} placeholder="Individual, entity, advisor" /></Field>
            <Field label="Estimated investment range"><input name="estimated_range" value={form.estimated_range} onChange={updateField} className={inputClass} placeholder="Example: $25,000 - $100,000" /></Field>
            <Field label="Relationship source"><input name="relationship_source" value={form.relationship_source} onChange={updateField} className={inputClass} placeholder="Referral, broker, JotForm, existing relationship" /></Field>
          </div>

          <button disabled={busy} className="mt-6 bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] disabled:opacity-50">Save Profile Updates</button>
        </form>

        <aside className="border border-white/10 bg-white/5 p-7">
          <p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">Admin-reviewed fields</p>
          <h3 className="mt-3 text-2xl font-black">Locked Profile Items</h3>
          <p className="mt-3 text-sm leading-6 text-white/60">These items are controlled by New Vine Capital because they relate to portal access, qualification, or compliance review.</p>
          <div className="mt-6 grid gap-3">
            {lockedFields.map(([label, value]) => <article key={label} className="border border-white/10 bg-[#111613] p-4"><p className="text-xs font-black uppercase tracking-wide text-white/45">{label}</p><p className="mt-2 text-white/80">{value || "Pending"}</p></article>)}
          </div>
          <a href="mailto:deals@newvinecapital.com" className="mt-5 inline-flex border border-white/15 px-5 py-3 text-xs font-black uppercase text-white">Request Compliance Update</a>
        </aside>
      </section>
    </PortalLayout>
  );
}
