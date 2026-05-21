import PortalLayout from "../../components/PortalLayout";
import { MockDownloadButton, Panel, StatCard } from "../../components/InvestorPortalCards";
import { getInvestorDashboardData } from "../../lib/investorPortalDb";
import { requirePortalSession } from "../../lib/portalAuth";
import { currency } from "../../lib/investorPortalMockData";

export async function getServerSideProps(context) {
  const auth = await requirePortalSession(context);
  if (!auth.props?.user) return auth;
  const data = await getInvestorDashboardData();
  return { props: { user: auth.props.user, ...data } };
}

export default function Reporting({ user, deals = [], distributions = [], summary }) {
  return (
    <PortalLayout user={user} title="Reporting & Distributions">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"><StatCard label="Funded Capital" value={currency(summary.totalFundedCapital)} detail="Funded capital across active records." /><StatCard label="Committed Capital" value={currency(summary.totalCommittedCapital)} detail="Includes pending funding commitments." /><StatCard label="Projected Return" value={summary.projectedAnnualReturn} detail="Target only. Not guaranteed." /><StatCard label="Active Investments" value={summary.activeInvestments} detail="Current portal investment count." /></section>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.75fr]"><Panel eyebrow="Distribution History" title="Paid and upcoming distributions"><div className="overflow-x-auto"><table className="w-full min-w-[680px] border-collapse text-left text-sm"><thead className="text-xs uppercase tracking-wide text-white/45"><tr><th className="border-b border-white/10 py-3">Investment</th><th className="border-b border-white/10 py-3">Date</th><th className="border-b border-white/10 py-3">Type</th><th className="border-b border-white/10 py-3">Amount</th><th className="border-b border-white/10 py-3">Status</th></tr></thead><tbody>{distributions.map((item) => <tr key={`${item.investment}-${item.date}`}><td className="border-b border-white/10 py-4 text-white">{item.investment}</td><td className="border-b border-white/10 py-4">{item.date}</td><td className="border-b border-white/10 py-4">{item.type}</td><td className="border-b border-white/10 py-4">{currency(item.amount)}</td><td className="border-b border-white/10 py-4">{item.status}</td></tr>)}</tbody></table></div></Panel><div className="grid gap-6"><Panel eyebrow="Upcoming Distributions" title="Projected next 90 days"><p>Upcoming distributions are estimates and remain subject to cash flow, timing, borrower performance, and offering documents.</p><div className="mt-4 grid gap-3">{distributions.filter((item) => item.status === "Projected").map((item) => <div key={item.investment} className="border border-white/10 bg-white/5 p-4"><p className="font-black text-white">{item.investment}</p><p className="mt-1 text-sm text-white/50">{item.date} / {item.type}</p></div>)}</div></Panel><Panel eyebrow="Annual Statement" title="Statement Placeholder"><p>Annual investor statement download will be available after year-end close and administrator review.</p><div className="mt-5"><MockDownloadButton>Download Report</MockDownloadButton></div></Panel></div></section>
      <section className="mt-8 grid gap-5 md:grid-cols-3">{deals.map((deal) => <article key={deal.id} className="border border-white/10 bg-[#111613] p-6"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">Performance Summary</p><h3 className="mt-3 text-xl font-black">{deal.name}</h3><p className="mt-3 text-sm leading-6 text-white/60">{deal.targetReturn} / {deal.term}. Performance shown as portal reporting and subject to offering documents.</p><div className="mt-5"><MockDownloadButton>Download Report</MockDownloadButton></div></article>)}</section>
    </PortalLayout>
  );
}
