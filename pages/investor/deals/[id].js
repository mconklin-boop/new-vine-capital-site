import { useMemo, useState } from "react";
import PortalLayout from "../../../components/PortalLayout";
import { DocumentAlertCard, Metric, Panel, ProgressBar, StatusPill } from "../../../components/InvestorPortalCards";
import { getInvestorDeal, listInvestorDocuments, listInvestorUpdates } from "../../../lib/investorPortalDb";
import { requirePortalSession } from "../../../lib/portalAuth";
import { currency, fundedPercent } from "../../../lib/investorPortalMockData";

const tabs = ["Overview", "Financials", "Documents", "Updates", "Invest"];

const defaultRiskNotes = [
  "Target returns are not guaranteed.",
  "Investments may lose principal.",
  "Liquidity may be limited.",
  "Final terms are controlled by offering documents.",
  "Investor eligibility and suitability review required.",
];

const defaultReviewProcess = [
  "Borrower or sponsor review",
  "Collateral and value review",
  "Title and lien review",
  "Senior lender review where applicable",
  "Exit strategy review",
  "Final admin approval before capital deployment",
];

export async function getServerSideProps(context) {
  const auth = await requirePortalSession(context);
  if (!auth.props?.user) return auth;
  const deal = await getInvestorDeal(context.params.id);
  if (!deal) return { notFound: true };
  const [allDocuments, allUpdates] = await Promise.all([listInvestorDocuments(), listInvestorUpdates()]);
  return { props: { user: auth.props.user, deal, allDocuments, allUpdates } };
}

export default function DealRoom({ user, deal, allDocuments = [], allUpdates = [] }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const documents = useMemo(() => allDocuments.filter((doc) => doc.dealId === deal.id), [allDocuments, deal.id]);
  const updates = useMemo(() => allUpdates.filter((update) => update.dealId === deal.id), [allUpdates, deal.id]);
  const percent = fundedPercent(deal);

  return (
    <PortalLayout user={user} title={deal.name}>
      <section className="border border-white/10 bg-[#111613] p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3"><StatusPill status={deal.status} /><span className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{deal.investmentType}</span><span className="text-sm text-white/50">{deal.location}</span><span className="text-xs font-bold uppercase tracking-wide text-white/45">Available only to approved investors</span></div>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">{deal.summary}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6"><Metric label="Target Return" value={deal.targetReturn} /><Metric label="Minimum" value={currency(deal.minimumInvestment)} /><Metric label="Duration" value={deal.term} /><Metric label="Total Raise" value={currency(deal.totalRaise)} /><Metric label="Funded" value={currency(deal.amountFunded)} /><Metric label="Distributions" value={deal.distributionFrequency || "Subject to docs"} /></div>
        <div className="mt-6"><div className="mb-2 flex flex-wrap justify-between gap-2 text-xs font-bold uppercase text-white/50"><span>{currency(deal.amountFunded)} / {currency(deal.totalRaise)} funded</span><span>{percent}%</span></div><ProgressBar value={percent} thick /></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2"><button onClick={() => setActiveTab("Invest")} className="bg-[#d5ad62] px-6 py-4 text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Review Commitment Steps</button><button onClick={() => setActiveTab("Documents")} className="border border-[#d5ad62]/60 px-6 py-4 text-sm font-black uppercase text-[#d5ad62] transition hover:bg-[#d5ad62] hover:text-[#11100b]">Review Documents</button></div>
        <p className="mt-4 text-sm leading-6 text-white/50">Commitments reviewed by New Vine Capital before funding instructions are released.</p>
      </section>

      <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 text-xs font-black uppercase tracking-wide text-white/65 [scrollbar-width:thin]">{tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 whitespace-nowrap border px-4 py-3 ${activeTab === tab ? "border-[#d5ad62] bg-[#d5ad62] text-[#11100b]" : "border-white/10 bg-white/5 hover:border-[#d5ad62] hover:text-[#d5ad62]"}`}>{tab}</button>)}</nav>
      <section className="mt-6">{activeTab === "Overview" && <Overview deal={deal} />}{activeTab === "Financials" && <Financials deal={deal} />}{activeTab === "Documents" && <Documents documents={documents} deal={deal} />}{activeTab === "Updates" && <Updates updates={updates} deal={deal} />}{activeTab === "Invest" && <Invest deal={deal} />}</section>
    </PortalLayout>
  );
}

function Overview({ deal }) {
  return <div className="grid gap-6">
    <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]"><Panel eyebrow="Executive Summary" title="Deal Overview"><p className="leading-8">{deal.summary}</p>{deal.strategyDescription && <><h4 className="mt-6 font-black text-white">What This Fund Does</h4><p className="mt-2 leading-8">{deal.strategyDescription}</p></>}<h4 className="mt-6 font-black text-white">Property / Business Plan</h4><p className="mt-2 leading-8">{deal.businessPlan}</p><h4 className="mt-6 font-black text-white">Sponsor Notes</h4><p className="mt-2 leading-8">{deal.sponsorNotes}</p></Panel><div className="grid gap-6"><WhyInvestorsLike deal={deal} /><Panel eyebrow="Timeline" title="Milestones"><ol className="grid gap-3">{(deal.timeline || []).map((item) => <li key={item} className="border-l-4 border-[#d5ad62] bg-white/5 p-4 text-white/70">{item}</li>)}</ol></Panel></div></div>
    <ReviewProcess deal={deal} />
    <RiskNotes deal={deal} />
  </div>;
}

function WhyInvestorsLike({ deal }) {
  const bullets = deal.whyInvestorsLikeThis || [];
  return <Panel eyebrow="Investor Fit" title="Why Investors Like This Opportunity"><ul className="grid gap-3">{bullets.map((item) => <li key={item} className="border border-[#d5ad62]/20 bg-[#d5ad62]/10 p-3 text-sm leading-6 text-white/70">{item}</li>)}</ul></Panel>;
}

function ReviewProcess({ deal }) {
  const steps = deal.reviewProcess?.length ? deal.reviewProcess : defaultReviewProcess;
  return <Panel eyebrow="New Vine Review Process" title="Trust and underwriting checklist"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{steps.map((step, index) => <div key={step} className="border border-white/10 bg-white/5 p-4"><span className="text-xs font-black text-[#d5ad62]">0{index + 1}</span><p className="mt-2 text-sm font-bold leading-6 text-white/70">{step}</p></div>)}</div></Panel>;
}

function RiskNotes({ deal }) {
  const notes = deal.riskNotes?.length ? deal.riskNotes : defaultRiskNotes;
  return <Panel eyebrow="Risk Notes" title="Important investor considerations"><ul className="grid gap-3">{notes.map((note) => <li key={note} className="border-l-4 border-white/15 bg-white/5 p-4 text-sm leading-6 text-white/65">{note}</li>)}</ul></Panel>;
}

function Financials({ deal }) { return <div className="grid gap-6"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Metric label="Target Return" value={deal.targetReturn} /><Metric label="Preferred Return" value={deal.preferredReturn} /><Metric label="Term" value={deal.term} /><Metric label="LTV / Multiple" value={`${deal.ltv} / ${deal.equityMultiple}`} /></div><div className="grid gap-6 lg:grid-cols-2"><Panel eyebrow="Capital Stack" title="Sources of Capital"><div className="grid gap-3">{(deal.capitalStack || []).map(([label, value]) => <div key={label} className="flex flex-col gap-2 border border-white/10 bg-white/5 p-4 sm:flex-row sm:justify-between"><span>{label}</span><strong className="text-white">{value}</strong></div>)}</div></Panel><Panel eyebrow="Sources and Uses" title="Use of Funds"><div className="grid gap-3">{(deal.sourcesUses || []).map(([label, value]) => <div key={label} className="flex flex-col gap-2 border border-white/10 bg-white/5 p-4 sm:flex-row sm:justify-between"><span>{label}</span><strong className="text-white">{value}</strong></div>)}</div></Panel></div><Panel eyebrow="Sensitivity Summary" title="Scenario Considerations"><p className="leading-8">{deal.sensitivity}</p></Panel></div>; }

function Documents({ documents, deal }) { const expectedTypes = ["PPM", "Operating Agreement", "Subscription Agreement", "Investor Deck", "Underwriting Summary", "Appraisal / Valuation"]; return <Panel eyebrow="Documents" title="Deal Room Document Package"><div className="grid gap-4">{expectedTypes.map((type) => { const doc = documents.find((item) => item.type === type); const displayDoc = doc || { id: type, name: `${type} Placeholder`, type, status: "Pending Upload", date: "Pending" }; return <DocumentAlertCard key={type} doc={displayDoc} opportunity={deal.name} />; })}</div></Panel>; }

function Updates({ updates, deal }) { const percent = fundedPercent(deal); return <div className="grid gap-5"><Panel eyebrow="Funding Status" title={`${currency(deal.amountFunded)} funded of ${currency(deal.totalRaise)}`}><p>Funding progress is shown for investor review and remains subject to final subscription acceptance, closing conditions, and offering documents.</p><div className="mt-5"><div className="mb-2 flex justify-between text-xs font-bold uppercase text-white/50"><span>Funding Progress</span><span>{percent}%</span></div><ProgressBar value={percent} thick /></div></Panel>{updates.map((update) => <article key={update.title} className="border border-white/10 bg-[#111613] p-6"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{update.date}</p><h3 className="mt-3 text-2xl font-black">{update.title}</h3><p className="mt-3 leading-7 text-white/60">{update.summary}</p></article>)}</div>; }

function Invest({ deal }) { const [submitted, setSubmitted] = useState(false); const [amount, setAmount] = useState(deal.minimumInvestment); const [fundingMethod, setFundingMethod] = useState("Wire"); const [accredited, setAccredited] = useState(false); async function submit(event) { event.preventDefault(); await fetch("/api/portal/investor-commitments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deal_id: deal.id, amount, funding_method: fundingMethod, accreditation_confirmed: accredited }) }); setSubmitted(true); } if (submitted) return <Panel eyebrow="Commitment Received" title="Funding instructions will be available in your portal."><p className="leading-8">Your commitment for {currency(Number(amount || 0))} in {deal.name} has been received for review. No payment has been processed. Funding instructions and final documents are provided only after approval and completion of applicable requirements.</p></Panel>; return <form onSubmit={submit} className="grid gap-6"><Panel eyebrow="Private Investor Commitment" title="Submit a non-binding commitment request"><p className="mb-5 leading-7">This workflow records your requested commitment for New Vine Capital review. It does not process payment, accept funds, or finalize an investment.</p><label className="grid gap-2 text-sm font-bold text-white/70">Amount<input type="number" min={deal.minimumInvestment} step="100" value={amount} onChange={(event) => setAmount(event.target.value)} className="border border-white/10 bg-[#050605] px-4 py-3 text-white" /></label><p className="mt-3 text-sm text-white/50">Minimum investment: {currency(deal.minimumInvestment)}</p></Panel><Panel eyebrow="Step 2" title="Investor Accreditation"><label className="flex gap-3 text-sm leading-6 text-white/70"><input type="checkbox" checked={accredited} onChange={(event) => setAccredited(event.target.checked)} className="mt-1" /> I confirm that my investor status and suitability information is accurate and subject to New Vine Capital review.</label></Panel><Panel eyebrow="Step 3" title="Funding Method"><div className="grid gap-3 md:grid-cols-4">{["ACH", "Wire", "SDIRA", "Manual"].map((method) => <button type="button" key={method} onClick={() => setFundingMethod(method)} className={`border px-4 py-3 text-xs font-black uppercase ${fundingMethod === method ? "border-[#d5ad62] bg-[#d5ad62] text-[#11100b]" : "border-white/10 bg-white/5 text-white/65"}`}>{method}</button>)}</div></Panel><Panel eyebrow="Step 4" title="Review Summary"><div className="grid gap-3 text-sm"><p><strong className="text-white">Opportunity:</strong> {deal.name}</p><p><strong className="text-white">Requested commitment:</strong> {currency(Number(amount || 0))}</p><p><strong className="text-white">Funding method:</strong> {fundingMethod}</p><p><strong className="text-white">Important:</strong> All commitments remain subject to approval, suitability review, allocation availability, and offering documents.</p></div></Panel><button disabled={!accredited} className="w-full bg-[#d5ad62] px-6 py-4 text-sm font-black uppercase text-[#11100b] disabled:opacity-40">Submit Commitment Request</button></form>; }
