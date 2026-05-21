import PortalLayout from "../../components/PortalLayout";
import { Panel } from "../../components/InvestorPortalCards";
import { requirePortalSession } from "../../lib/portalAuth";
import { mockInvestor } from "../../lib/investorPortalMockData";

export async function getServerSideProps(context) {
  return requirePortalSession(context);
}

function ProfileField({ label, value }) {
  return <article className="border border-white/10 bg-white/5 p-5"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{label}</p><p className="mt-3 text-lg font-bold text-white">{value}</p></article>;
}

export default function InvestorProfile({ user }) {
  const profile = { ...mockInvestor, name: user.name || mockInvestor.name, email: user.email || mockInvestor.email, phone: user.phone || mockInvestor.phone, entityName: user.entityName || mockInvestor.entityName, accreditationStatus: user.accreditedStatus || mockInvestor.accreditationStatus };

  return (
    <PortalLayout user={user} title="Investor Profile & Settings">
      <Panel eyebrow="Profile Controls" title="Investor information on file"><p>Profile fields are shown for investor review. Compliance-sensitive information, accreditation status, tax records, and funding method details require Investor Relations or admin review before changes are finalized.</p></Panel>
      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ProfileField label="Name" value={profile.name} />
        <ProfileField label="Entity Name" value={profile.entityName || "Not applicable"} />
        <ProfileField label="Email" value={profile.email} />
        <ProfileField label="Phone" value={profile.phone} />
        <ProfileField label="Accreditation Status" value={profile.accreditationStatus} />
        <ProfileField label="Preferred Investment Type" value={profile.preferredInvestmentType} />
        <ProfileField label="Risk Tolerance" value={profile.riskTolerance} />
        <ProfileField label="Bank / Funding Method" value={profile.fundingMethod} />
        <ProfileField label="Tax Document Delivery" value={profile.taxDeliveryPreference} />
      </section>
      <section className="mt-8 border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Request Profile Update</h3><p className="mt-4 max-w-3xl leading-7 text-white/65">To request updates to entity, tax, accreditation, or funding-method details, contact Investor Relations. Direct self-service editing is intentionally limited in Phase 1.</p><a href="mailto:deals@newvinecapital.com" className="mt-6 inline-flex bg-[#d5ad62] px-6 py-4 text-xs font-black uppercase text-[#11100b]">Contact Investor Relations</a></section>
    </PortalLayout>
  );
}
