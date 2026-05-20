import PortalLayout from "../../components/PortalLayout";
import { requirePortalSession } from "../../lib/portalAuth";

export async function getServerSideProps(context) {
  return requirePortalSession(context);
}

export default function InvestmentProfile({ user }) {
  const fields = [
    ["Investor name", user.name],
    ["Email", user.email],
    ["Phone", user.phone || "On file / pending"],
    ["Entity name", user.entityName || "Not applicable"],
    ["Accredited investor status", user.accreditedStatus],
    ["Investor type", user.investorType],
    ["Estimated investment range", user.estimatedRange],
    ["Relationship source", user.relationshipSource],
    ["Onboarding status", user.onboardingStatus],
    ["Documents completed", user.documentsCompleted],
    ["Compliance review status", user.complianceReviewStatus],
  ];
  return <PortalLayout user={user} title="Investment Profile"><section className="grid gap-4 md:grid-cols-2">{fields.map(([label, value]) => <article key={label} className="border border-white/10 bg-[#111613] p-6"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{label}</p><p className="mt-3 text-lg text-white/75">{value}</p></article>)}</section><div className="mt-8 border border-white/10 bg-white/5 p-6"><h3 className="text-xl font-black">Request Profile Updates</h3><p className="mt-3 text-white/65">Investors may request profile updates through Investor Relations. Compliance-sensitive fields cannot be edited directly in the portal and require review.</p><a href="mailto:deals@newvinecapital.com" className="mt-5 inline-flex bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b]">Contact Investor Relations</a></div></PortalLayout>;
}
