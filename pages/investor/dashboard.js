import Link from "next/link";
import PortalLayout from "../../components/PortalLayout";
import { DealCard, Panel, StatCard } from "../../components/InvestorPortalCards";
import { getInvestorDashboardData } from "../../lib/investorPortalDb";
import { currency } from "../../lib/investorPortalMockData";
import { requirePortalSession } from "../../lib/portalAuth";

export async function getServerSideProps(context) {
  const auth = await requirePortalSession(context);
  if (!auth.props?.user) return auth;
  const data = await getInvestorDashboardData();
  return { props: { user: auth.props.user, ...data } };
}

export default function InvestorDashboard({ user, deals = [], documents = [], updates = [], notifications = [], summary }) {
  const openDeals = deals.filter((deal) => deal.status !== "Fully Subscribed");
  const recentUpdates = updates.slice(0, 3);
  const documentAlerts = documents.filter((doc) => ["Subscription Agreement", "Funding Instructions", "PPM"].includes(doc.type)).slice(0, 3);

  return (
    <PortalLayout user={user} title="Investor Dashboard">
      <section className="border border-white/10 bg-[#111613] p-6 md:p-8"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Private Investor Overview</p><h3 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">Welcome back, {user.name || "Investor"}.</h3><p className="mt-4 max-w-4xl leading-8 text-white/65">Review your active investment activity, open private capital opportunities, document alerts, pending funding items, and projected reporting. Figures are subject to offering documents and admin records.</p></section>
      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4"><StatCard label="Total Committed Capital" value={currency(summary.totalCommittedCapital)} detail="Committed allocation across active opportunities." /><StatCard label="Total Funded Capital" value={currency(summary.totalFundedCapital)} detail="Capital shown as funded in the portal record." /><StatCard label="Active Investments" value={summary.activeInvestments} detail="Current active portal records." /><StatCard label="Projected Annual Return" value={summary.projectedAnnualReturn} detail="Target only. Not guaranteed." /></section>
      <section className="mt-8 grid gap-5 lg:grid-cols-3"><Panel eyebrow="Upcoming Distributions" title={summary.upcomingDistributions}><p>Projected timing is subject to borrower performance, sponsor reporting, legal documents, and available cash flow.</p></Panel><Panel eyebrow="Capital Call Status" title={summary.pendingFundingStatus}><p>Funding instructions are provided only after an approved commitment and document review.</p></Panel><Panel eyebrow="Document Alerts" title={`${documentAlerts.length} items need review`}><div className="grid gap-3">{documentAlerts.map((doc) => <div key={doc.id} className="border border-white/10 bg-white/5 p-3"><p className="font-black text-white">{doc.name}</p><p className="mt-1 text-sm text-white/50">{doc.type}</p></div>)}</div></Panel></section>
      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.8fr]"><div><div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Open Investment Opportunities</p><h3 className="mt-2 text-2xl font-black">Available Deal Rooms</h3></div><Link href="/investor/opportunities" className="border-b border-[#d5ad62] pb-1 text-xs font-black uppercase text-[#d5ad62]">View All</Link></div><div className="grid gap-5">{openDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)}</div></div><div className="grid gap-5"><Panel eyebrow="Recent Updates" title="Latest Portal Activity"><div className="grid gap-4">{recentUpdates.map((update) => <article key={`${update.dealId}-${update.title}`} className="border-l-4 border-[#d5ad62] bg-white/5 p-4"><p className="font-black text-white">{update.title}</p><p className="mt-1 text-xs text-white/45">{update.date}</p><p className="mt-3 text-sm leading-6 text-white/60">{update.summary}</p></article>)}</div></Panel><Panel eyebrow="Notifications" title="Portal Notices"><div className="grid gap-3">{notifications.map((item) => <div key={item.message} className="border border-white/10 bg-white/5 p-4"><p className="text-xs font-black uppercase text-[#d5ad62]">{item.type}</p><p className="mt-2 text-sm leading-6 text-white/65">{item.message}</p><p className="mt-2 text-xs text-white/40">{item.date}</p></div>)}</div></Panel></div></section>
    </PortalLayout>
  );
}
