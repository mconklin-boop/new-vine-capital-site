import PortalLayout from "../../components/PortalLayout";
import { requirePortalSession } from "../../lib/portalAuth";

export async function getServerSideProps(context) {
  return requirePortalSession(context, { roles: ["Admin"] });
}

const adminCards = [
  ["Investor Users", "View investor users, pending investors, advisors, and referral partners."],
  ["Access Control", "Approve, deactivate, or change portal roles and statuses."],
  ["Document Management", "Upload documents and assign materials to all investors or specific investors."],
  ["Monthly Updates", "Post monthly updates and attach PDF reports."],
  ["Access Logs", "View login activity, document views, and download logs."],
  ["CSV Export", "Export investor list and status data for internal reporting."],
];

export default function AdminDashboard({ user }) {
  return (
    <PortalLayout user={user} title="Admin Dashboard">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{adminCards.map(([title, copy]) => <article key={title} className="border border-white/10 bg-[#111613] p-7"><h3 className="text-xl font-black">{title}</h3><p className="mt-3 text-white/60">{copy}</p><button className="mt-6 border border-[#d5ad62]/60 px-4 py-3 text-xs font-black uppercase text-[#d5ad62]">Configure</button></article>)}</div>
      <section className="mt-8 border border-white/10 bg-white/5 p-7"><h3 className="text-2xl font-black">Integration Roadmap</h3><div className="mt-5 grid gap-3 text-white/65 md:grid-cols-2"><p>HubSpot CRM: investor records and status sync</p><p>JotForm: investor inquiry submissions</p><p>PandaDoc / DocuSign: subscription and legal documents</p><p>Google Drive or secure storage: protected document library</p><p>QuickBooks: future investor reporting workflows</p><p>Audit storage: login, document view, and download logs</p></div></section>
    </PortalLayout>
  );
}
