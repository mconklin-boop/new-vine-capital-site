import { useMemo, useState } from "react";
import PortalLayout from "../../components/PortalLayout";
import { DealCard } from "../../components/InvestorPortalCards";
import { listInvestorDeals } from "../../lib/investorPortalDb";
import { requirePortalSession } from "../../lib/portalAuth";

const categories = ["All Opportunities", "Direct Deals", "Managed Funds", "Private Credit"];

export async function getServerSideProps(context) {
  const auth = await requirePortalSession(context);
  if (!auth.props?.user) return auth;
  const deals = await listInvestorDeals();
  return { props: { user: auth.props.user, deals } };
}

export default function Opportunities({ user, deals = [] }) {
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All Opportunities");
  const statuses = ["All", ...new Set(deals.map((deal) => deal.status))];
  const types = ["All", ...new Set(deals.map((deal) => deal.investmentType))];
  const filteredDeals = useMemo(() => deals.filter((deal) => {
    const matchesStatus = status === "All" || deal.status === status;
    const matchesType = type === "All" || deal.investmentType === type;
    const dealCategories = deal.categories || [];
    const matchesCategory = category === "All Opportunities" || dealCategories.includes(category) || (category === "Direct Deals" && !dealCategories.includes("Managed Funds"));
    return matchesStatus && matchesType && matchesCategory;
  }), [deals, status, type, category]);

  return (
    <PortalLayout user={user} title="Active Deal Opportunities">
      <section className="border border-white/10 bg-[#111613] p-6 md:p-8"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Private Deal Flow</p><h3 className="mt-3 font-serif text-3xl md:text-5xl">Review private opportunities and controlled deal rooms.</h3><p className="mt-4 max-w-4xl leading-8 text-white/65">Opportunities are shown for approved portal users and remain subject to suitability review, allocation availability, legal documentation, and offering terms. Commitments are reviewed by New Vine Capital before funding instructions are released.</p></section>
      <section className="mt-6 grid gap-4 border border-white/10 bg-white/5 p-4 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold text-white/70">Status<select value={status} onChange={(event) => setStatus(event.target.value)} className="border border-white/10 bg-[#050605] px-4 py-3 text-white">{statuses.map((item) => <option key={item}>{item}</option>)}</select></label><label className="grid gap-2 text-sm font-bold text-white/70">Investment Type<select value={type} onChange={(event) => setType(event.target.value)} className="border border-white/10 bg-[#050605] px-4 py-3 text-white">{types.map((item) => <option key={item}>{item}</option>)}</select></label></section>
      <section className="mt-5 flex gap-2 overflow-x-auto pb-1 text-xs font-black uppercase tracking-wide text-white/65 [scrollbar-width:thin]">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 border px-4 py-3 ${category === item ? "border-[#d5ad62] bg-[#d5ad62] text-[#11100b]" : "border-white/10 bg-white/5 hover:border-[#d5ad62] hover:text-[#d5ad62]"}`}>{item}</button>)}</section>
      <section className="mt-8 grid gap-5">{filteredDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)}</section>
      {!filteredDeals.length && <section className="mt-8 border border-white/10 bg-[#111613] p-6 text-white/60">No opportunities match the selected filters.</section>}
    </PortalLayout>
  );
}
