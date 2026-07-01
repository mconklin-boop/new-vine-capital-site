import Link from "next/link";
import PortalLayout from "../../components/PortalLayout";
import { DealCard, StatCard, StatusPill } from "../../components/InvestorPortalCards";
import { getInvestorDashboardData } from "../../lib/investorPortalDb";
import { requirePortalSession } from "../../lib/portalAuth";
import { siteLinks } from "../../lib/siteLinks";

const quickActions = [
  ["/investor/opportunities", "View Opportunities", "Review opportunities assigned to your portal."],
  ["/investor/documents", "Review Documents", "Open investor materials when assigned."],
  ["/investor/documents", "Funding Instructions", "Released after commitment approval."],
  [siteLinks.investorBookCall, "Book Investor Call", "Schedule an investor relations call."],
];

export async function getServerSideProps(context) {
  const auth = await requirePortalSession(context);
  if (!auth.props?.user) return auth;
  const data = await getInvestorDashboardData(auth.props.user);
  return { props: { user: auth.props.user, ...data } };
}

export default function InvestorDashboard({ user, deals = [], summary }) {
  const openDeals = deals.filter((deal) => deal.status !== "Fully Subscribed");
  const pendingCommitments = summary.pendingCommitments ?? 0;
  const activeCommitments = summary.activeCommitments ?? summary.activeInvestments ?? 0;

  return (
    <PortalLayout user={user} title="Investor Dashboard">
      <section className="border border-white/10 bg-[#111613] p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3"><StatusPill status="Private Access" /><span className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">Available only to approved investors</span></div>
        <h3 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-6xl">Welcome to the New Vine Capital Investor Network</h3>
        <p className="mt-5 max-w-4xl leading-8 text-white/75">Review assigned private investment opportunities, investor materials, pending commitments, and portfolio reporting from your secure investor portal.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map(([href, label, detail]) => <Link key={label} href={href} className="border border-white/10 bg-white/[0.04] p-4 transition hover:border-[#d5ad62]/70 hover:bg-[#d5ad62]/10"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{label}</p><p className="mt-2 text-sm leading-5 text-white/65">{detail}</p></Link>)}
        </div>
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-2">
        <StatCard compact label="Pending Commitments" value={pendingCommitments} detail="Received, approved, or pending funding" />
        <StatCard compact label="Active Commitments" value={activeCommitments} detail="Funded commitment records" />
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Open Investment Opportunities</p><h3 className="mt-2 text-2xl font-black">Available Opportunities</h3></div><Link href="/investor/opportunities" className="border-b border-[#d5ad62] pb-1 text-xs font-black uppercase text-[#d5ad62]">View All</Link></div>
        <div className="grid gap-5">{openDeals.map((deal) => <DealCard key={deal.id} deal={deal} compact />)}</div>
        {!openDeals.length && <div className="border border-white/10 bg-[#111613] p-6 text-white/60">No investment opportunities are currently assigned to your portal.</div>}
      </section>
    </PortalLayout>
  );
}
