import { useMemo, useState } from "react";
import PortalLayout from "../../components/PortalLayout";
import { DocumentAlertCard, Panel } from "../../components/InvestorPortalCards";
import { listInvestorDeals, listInvestorDocuments } from "../../lib/investorPortalDb";
import { requirePortalSession } from "../../lib/portalAuth";

export async function getServerSideProps(context) {
  const auth = await requirePortalSession(context);
  if (!auth.props?.user) return auth;
  const [deals, documents] = await Promise.all([listInvestorDeals({ user: auth.props.user }), listInvestorDocuments()]);
  return { props: { user: auth.props.user, deals, documents } };
}

export default function Documents({ user, deals = [], documents = [] }) {
  const [investment, setInvestment] = useState("All");
  const [type, setType] = useState("All");
  const typeOptions = ["All", ...new Set(documents.map((doc) => doc.type))];
  const filteredDocs = useMemo(() => documents.filter((doc) => (investment === "All" || doc.dealId === investment || doc.dealId === "All") && (type === "All" || doc.type === type)), [documents, investment, type]);
  return <PortalLayout user={user} title="Document Center"><Panel eyebrow="Investor Document Vault" title="Controlled document review"><p>Documents will appear here after New Vine Capital assigns materials to your investor profile or an assigned opportunity. Offering materials are available only to approved investors and authorized users.</p></Panel>{!!documents.length && <section className="mt-6 grid gap-4 border border-white/10 bg-white/5 p-5 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold text-white/70">Investment<select value={investment} onChange={(event) => setInvestment(event.target.value)} className="border border-white/10 bg-[#050605] px-4 py-3 text-white"><option value="All">All Investments</option>{deals.map((deal) => <option key={deal.id} value={deal.id}>{deal.name}</option>)}</select></label><label className="grid gap-2 text-sm font-bold text-white/70">Document Type<select value={type} onChange={(event) => setType(event.target.value)} className="border border-white/10 bg-[#050605] px-4 py-3 text-white">{typeOptions.map((item) => <option key={item}>{item}</option>)}</select></label></section>}<section className="mt-8 grid gap-4">{filteredDocs.map((doc) => { const deal = deals.find((item) => item.id === doc.dealId); return <DocumentAlertCard key={doc.id} doc={doc} opportunity={deal?.name} />; })}</section>{!filteredDocs.length && <section className="mt-8 border border-white/10 bg-[#111613] p-6 text-white/60">No documents are currently assigned to your portal.</section>}</PortalLayout>;
}
