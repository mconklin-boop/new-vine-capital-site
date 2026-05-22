import Link from "next/link";
import PortalLayout from "../../components/PortalLayout";
import { DealCard, DocumentAlertCard, Panel, StatCard, StatusPill } from "../../components/InvestorPortalCards";
import { getInvestorDashboardData } from "../../lib/investorPortalDb";
import { currency } from "../../lib/investorPortalMockData";
import { requirePortalSession } from "../../lib/portalAuth";
import { siteLinks } from "../../lib/siteLinks";

const quickActions = [
  ["/investor/opportunities", "View Opportunities", "Review active private credit opportunities."],
  ["/investor/documents", "Review Documents", "Open pending investor materials."],
  ["/investor/documents", "Complete Subscription", "Finish documents before funding."],
  ["/investor/documents", "Funding Instructions", "Released after commitment approval."],
  [siteLinks.investorBookCall, "Book Investor Call", "Schedule an intake or investor relations call."],
];

const platformMetricCards = [
  ["Total Platform Capital Deployed", "totalCapitalDeployed"],
  ["Total Investor Commitments", "totalInvestorCommitments"],
  ["Historical Funded Transactions", "transactionsFunded"],
  ["Active Opportunities", "activeOpportunities"],
  ["Capital Currently Allocated", "capitalCurrentlyAllocated"],
  ["Distributions Processed", "distributionsProcessed"],
];

export async function getServerSideProps(context) {
  const auth = await requirePortalSession(context);
  if (!auth.props?.user) return auth;
  const data = await getInvestorDashboardData();
  return { props: { user: auth.props.user, ...data } };
}

export default function InvestorDashboard({ user, deals = [], documents = [], updates = [], notifications = [], activity = [], platformMetrics = {}, platformTimeline = [], summary }) {
  const openDeals = deals.filter((deal) => deal.status !== "Fully Subscribed");
  const pendingDocuments = documents.filter((doc) => ["Needs Review", "Pending Upload"].includes(doc.status || "Needs Review"));
  const documentAlerts = pendingDocuments.slice(0, 4);
  const pendingCommitments = summary.pendingCommitments ?? openDeals.length;
  const upcomingDistributionCount = 0;

  return (
    <PortalLayout user={user} title="Investor Dashboard">
      <section className="border border-white/10 bg-[#111613] p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3"><StatusPill status="Open" /><span className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">Available only to approved investors</span></div>
        <h3 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-6xl">Welcome to the New Vine Capital Investor Network</h3>
        <p className="mt-5 max-w-4xl leading-8 text-white/75">Review private investment opportunities, document alerts, pending commitments, and portfolio reporting from your secure investor portal.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {quickActions.map(([href, label, detail]) => <Link key={label} href={href} className="border border-white/10 bg-white/[0.04] p-4 transition hover:border-[#d5ad62]/70 hover:bg-[#d5ad62]/10"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{label}</p><p className="mt-2 text-sm leading-5 text-white/65">{detail}</p></Link>)}
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-6">
        <StatCard compact label="Committed" value={currency(summary.totalCommittedCapital)} detail="Investor record" />
        <StatCard compact label="Funded" value={currency(summary.totalFundedCapital)} detail="Capital funded" />
        <StatCard compact label="Active" value={summary.activeInvestments} detail="Investments" />
        <StatCard compact label="Documents" value={pendingDocuments.length} detail="Pending" />
        <StatCard compact label="Commitments" value={pendingCommitments} detail="Pending review" />
        <StatCard compact label="Distributions" value={upcomingDistributionCount} detail="Upcoming" />
      </section>

      <section className="mt-8 border border-white/10 bg-[#111613] p-5 md:p-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Platform Metrics</p><h3 className="mt-2 text-2xl font-black text-white">New Vine Capital Platform Activity</h3></div><p className="max-w-2xl text-sm leading-6 text-white/55">Historical and informational figures only. Platform activity does not indicate future performance.</p></div>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-6">{platformMetricCards.map(([label, key]) => <StatCard key={key} compact label={label} value={platformMetrics[key] ?? "--"} />)}</div>
        <div className="mt-6 grid gap-3 md:grid-cols-4">{platformTimeline.map((item) => <article key={`${item.date}-${item.title}`} className="border border-white/10 bg-white/[0.04] p-4"><p className="text-[10px] font-black uppercase tracking-wide text-[#d5ad62]">{item.date} / {item.type}</p><h4 className="mt-2 font-black text-white">{item.title}</h4><p className="mt-2 text-sm leading-6 text-white/60">{item.description}</p></article>)}</div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <div>
          <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Open Investment Opportunities</p><h3 className="mt-2 text-2xl font-black">Available Deal Rooms</h3></div><Link href="/investor/opportunities" className="border-b border-[#d5ad62] pb-1 text-xs font-black uppercase text-[#d5ad62]">View All</Link></div>
          <div className="grid gap-5">{openDeals.map((deal) => <DealCard key={deal.id} deal={deal} compact />)}</div>
        </div>

        <div className="grid content-start gap-5">
          <Panel eyebrow="Document Alerts" title={`${documentAlerts.length} items need review`}>
            <div className="grid gap-3">{documentAlerts.map((doc) => { const deal = deals.find((item) => item.id === doc.dealId); return <DocumentAlertCard key={doc.id} doc={doc} opportunity={deal?.name} />; })}</div>
          </Panel>
          <Panel eyebrow="Recent Activity" title="Portal Feed">
            <div className="grid gap-4">
              {activity.map((item) => <article key={`${item.date}-${item.title}`} className="border border-white/10 bg-white/[0.04] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{item.date}</p><span className="border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white/65">{item.status}</span></div><h4 className="mt-3 font-black text-white">{item.title}</h4><p className="mt-2 text-sm leading-6 text-white/70">{item.description}</p></article>)}
            </div>
          </Panel>
          <Panel eyebrow="Investor Notices" title="Private access reminders">
            <div className="grid gap-3">{notifications.map((item) => <div key={item.message} className="border border-white/10 bg-white/5 p-4"><p className="text-xs font-black uppercase text-[#d5ad62]">{item.type}</p><p className="mt-2 text-sm leading-6 text-white/70">{item.message}</p><p className="mt-2 text-xs text-white/45">{item.date}</p></div>)}</div>
          </Panel>
        </div>
      </section>
    </PortalLayout>
  );
}
