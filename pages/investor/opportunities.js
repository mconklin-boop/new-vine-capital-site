import { useMemo, useState } from "react";
import PortalLayout from "../../components/PortalLayout";
import { DealCard } from "../../components/InvestorPortalCards";
import { requirePortalSession } from "../../lib/portalAuth";
import { deals } from "../../lib/investorPortalMockData";

export async function getServerSideProps(context) {
  return requirePortalSession(context);
}

export default function Opportunities({ user }) {
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const statuses = ["All", ...new Set(deals.map((deal) => deal.status))];
  const types = ["All", ...new Set(deals.map((deal) => deal.investmentType))];
  const filteredDeals = useMemo(() => deals.filter((deal) => (status === "All" || deal.status === status) && (type === "All" || deal.investmentType === type)), [status, type]);

  return (
    <PortalLayout user={user} title="Active Deal Opportunities">
      <section className="border border-white/10 bg-[#111613] p-6 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Private Deal Flow</p>
        <h3 className="mt-3 font-serif text-3xl md:text-5xl">Review individual opportunities and private deal rooms.</h3>
        <p className="mt-4 max-w-4xl leading-8 text-white/65">Opportunities are shown for approved portal users and remain subject to suitability review, allocation availability, legal documentation, and offering terms.</p>
      </section>

      <section className="mt-6 grid gap-4 border border-white/10 bg-white/5 p-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-white/70">Status<select value={status} onChange={(event) => setStatus(event.target.value)} className="border border-white/10 bg-[#050605] px-4 py-3 text-white">{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-bold text-white/70">Investment Type<select value={type} onChange={(event) => setType(event.target.value)} className="border border-white/10 bg-[#050605] px-4 py-3 text-white">{types.map((item) => <option key={item}>{item}</option>)}</select></label>
      </section>

      <section className="mt-8 grid gap-5">{filteredDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)}</section>
    </PortalLayout>
  );
}
