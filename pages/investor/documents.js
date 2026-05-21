import { useMemo, useState } from "react";
import PortalLayout from "../../components/PortalLayout";
import { MockDownloadButton, Panel } from "../../components/InvestorPortalCards";
import { requirePortalSession } from "../../lib/portalAuth";
import { dealDocuments, deals } from "../../lib/investorPortalMockData";

const extraDocuments = [
  { id: "tax-2025", dealId: "All", name: "2025 Tax Document Placeholder", type: "Tax Document", date: "Pending" },
  { id: "signed-docs", dealId: "All", name: "Signed Investor Documents", type: "Signed Docs", date: "May 10, 2026" },
  { id: "annual-statement", dealId: "All", name: "Annual Statement Placeholder", type: "Quarterly Statement", date: "Pending" },
];

export async function getServerSideProps(context) {
  return requirePortalSession(context);
}

export default function Documents({ user }) {
  const allDocuments = [...dealDocuments, ...extraDocuments];
  const [investment, setInvestment] = useState("All");
  const [type, setType] = useState("All");
  const investmentOptions = ["All", ...deals.map((deal) => deal.id)];
  const typeOptions = ["All", ...new Set(allDocuments.map((doc) => doc.type))];
  const filteredDocs = useMemo(() => allDocuments.filter((doc) => (investment === "All" || doc.dealId === investment || doc.dealId === "All") && (type === "All" || doc.type === type)), [allDocuments, investment, type]);

  return (
    <PortalLayout user={user} title="Document Center">
      <Panel eyebrow="Investor Document Vault" title="Centralized documents and mock downloads"><p>Review tax documents, subscription agreements, operating agreements, quarterly statements, funding instructions, signed documents, and deal-room files assigned to your investor profile.</p></Panel>
      <section className="mt-6 grid gap-4 border border-white/10 bg-white/5 p-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-white/70">Investment<select value={investment} onChange={(event) => setInvestment(event.target.value)} className="border border-white/10 bg-[#050605] px-4 py-3 text-white"><option value="All">All Investments</option>{deals.map((deal) => <option key={deal.id} value={deal.id}>{deal.name}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-bold text-white/70">Document Type<select value={type} onChange={(event) => setType(event.target.value)} className="border border-white/10 bg-[#050605] px-4 py-3 text-white">{typeOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
      </section>
      <section className="mt-8 grid gap-4">{filteredDocs.map((doc) => { const deal = deals.find((item) => item.id === doc.dealId); return <article key={doc.id} className="grid gap-4 border border-white/10 bg-[#111613] p-5 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{doc.type}</p><h3 className="mt-2 text-xl font-black">{doc.name}</h3><p className="mt-1 text-sm text-white/50">{deal?.name || "General Investor Documents"} / {doc.date}</p></div><MockDownloadButton>Download</MockDownloadButton></article>; })}</section>
    </PortalLayout>
  );
}
