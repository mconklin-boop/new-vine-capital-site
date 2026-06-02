import { useMemo, useState } from "react";
import InvestorCommitmentForm from "../../../components/InvestorCommitmentForm";
import PortalLayout from "../../../components/PortalLayout";
import { DocumentAlertCard, Metric, Panel, ProgressBar, StatusPill } from "../../../components/InvestorPortalCards";
import { getInvestorDeal, listInvestorDocuments, listInvestorUpdates } from "../../../lib/investorPortalDb";
import { requirePortalSession } from "../../../lib/portalAuth";
import { currency, fundedPercent } from "../../../lib/investorPortalMockData";

const tabs = ["Invest", "Overview", "Financials", "Documents", "Updates"];

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

function opportunityLanguage(deal) {
  const isFund = deal?.investmentType === "Fund";
  return {
    noun: isFund ? "fund" : "opportunity",
    titleNoun: isFund ? "Fund" : "Opportunity",
    overviewTitle: isFund ? "Fund Overview" : "Opportunity Overview",
    emptyDetails: isFund ? "Fund details will appear here after New Vine Capital completes the admin setup." : "Opportunity details will appear here after New Vine Capital completes the admin setup.",
    investorFitTitle: isFund ? "Why Investors Like This Fund" : "Why Investors Like This Opportunity",
    documentTitle: isFund ? "Fund Document Package" : "Opportunity Document Package",
    emptyDocuments: isFund ? "No documents have been posted for this fund yet." : "No documents have been posted for this opportunity yet.",
    emptyUpdates: isFund ? "No updates have been posted for this fund yet." : "No updates have been posted for this opportunity yet.",
  };
}

export async function getServerSideProps(context) {
  const auth = await requirePortalSession(context);
  if (!auth.props?.user) return auth;
  const deal = await getInvestorDeal(context.params.id, { user: auth.props.user });
  if (!deal) return { notFound: true };
  const [allDocuments, allUpdates] = await Promise.all([listInvestorDocuments(), listInvestorUpdates()]);
  return { props: { user: auth.props.user, deal, allDocuments, allUpdates } };
}

export default function DealRoom({ user, deal, allDocuments = [], allUpdates = [] }) {
  const [activeTab, setActiveTab] = useState("Invest");
  const documents = useMemo(() => allDocuments.filter((doc) => doc.dealId === deal.id), [allDocuments, deal.id]);
  const updates = useMemo(() => allUpdates.filter((update) => update.dealId === deal.id), [allUpdates, deal.id]);
  const percent = fundedPercent(deal);

  return (
    <PortalLayout user={user} title={deal.name}>
      <section className="border border-white/10 bg-[#111613] p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3"><StatusPill status={deal.status} /><span className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{deal.investmentType}</span><span className="text-sm text-white/50">{deal.location}</span><span className="text-xs font-bold uppercase tracking-wide text-white/45">Available only to approved investors</span></div>
        {deal.summary && <p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">{deal.summary}</p>}
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
  const language = opportunityLanguage(deal);
  return <div className="grid gap-6">
    <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]"><Panel eyebrow="Executive Summary" title={language.overviewTitle}><p className="leading-8">{deal.summary || language.emptyDetails}</p>{deal.strategyDescription && <><h4 className="mt-6 font-black text-white">Strategy</h4><p className="mt-2 leading-8">{deal.strategyDescription}</p></>}{deal.businessPlan && <><h4 className="mt-6 font-black text-white">Property / Business Plan</h4><p className="mt-2 leading-8">{deal.businessPlan}</p></>}{deal.sponsorNotes && <><h4 className="mt-6 font-black text-white">Sponsor Notes</h4><p className="mt-2 leading-8">{deal.sponsorNotes}</p></>}</Panel><div className="grid gap-6"><WhyInvestorsLike deal={deal} /><Panel eyebrow="Timeline" title="Milestones">{deal.timeline?.length ? <ol className="grid gap-3">{deal.timeline.map((item) => <li key={item} className="border-l-4 border-[#d5ad62] bg-white/5 p-4 text-white/70">{item}</li>)}</ol> : <p>No timeline items have been posted yet.</p>}</Panel></div></div>
    <ReviewProcess deal={deal} />
    <RiskNotes deal={deal} />
  </div>;
}

function WhyInvestorsLike({ deal }) {
  const bullets = deal.whyInvestorsLikeThis || [];
  const language = opportunityLanguage(deal);
  return <Panel eyebrow="Investor Fit" title={language.investorFitTitle}>{bullets.length ? <ul className="grid gap-3">{bullets.map((item) => <li key={item} className="border border-[#d5ad62]/20 bg-[#d5ad62]/10 p-3 text-sm leading-6 text-white/70">{item}</li>)}</ul> : <p>Investor fit notes have not been posted yet.</p>}</Panel>;
}

function ReviewProcess({ deal }) {
  const steps = deal.reviewProcess?.length ? deal.reviewProcess : defaultReviewProcess;
  return <Panel eyebrow="New Vine Review Process" title="Trust and underwriting checklist"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{steps.map((step, index) => <div key={step} className="border border-white/10 bg-white/5 p-4"><span className="text-xs font-black text-[#d5ad62]">0{index + 1}</span><p className="mt-2 text-sm font-bold leading-6 text-white/70">{step}</p></div>)}</div></Panel>;
}

function RiskNotes({ deal }) {
  const notes = deal.riskNotes?.length ? deal.riskNotes : defaultRiskNotes;
  return <Panel eyebrow="Risk Notes" title="Important investor considerations"><ul className="grid gap-3">{notes.map((note) => <li key={note} className="border-l-4 border-white/15 bg-white/5 p-4 text-sm leading-6 text-white/65">{note}</li>)}</ul></Panel>;
}

function Financials({ deal }) { return <div className="grid gap-6"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Metric label="Target Return" value={deal.targetReturn} /><Metric label="Preferred Return" value={deal.preferredReturn} /><Metric label="Term" value={deal.term} /><Metric label="LTV / Multiple" value={`${deal.ltv} / ${deal.equityMultiple}`} /></div><div className="grid gap-6 lg:grid-cols-2"><Panel eyebrow="Capital Stack" title="Sources of Capital">{deal.capitalStack?.length ? <div className="grid gap-3">{deal.capitalStack.map(([label, value]) => <div key={label} className="flex flex-col gap-2 border border-white/10 bg-white/5 p-4 sm:flex-row sm:justify-between"><span>{label}</span><strong className="text-white">{value}</strong></div>)}</div> : <p>No capital stack details have been posted yet.</p>}</Panel><Panel eyebrow="Sources and Uses" title="Use of Funds">{deal.sourcesUses?.length ? <div className="grid gap-3">{deal.sourcesUses.map(([label, value]) => <div key={label} className="flex flex-col gap-2 border border-white/10 bg-white/5 p-4 sm:flex-row sm:justify-between"><span>{label}</span><strong className="text-white">{value}</strong></div>)}</div> : <p>No sources and uses details have been posted yet.</p>}</Panel></div><Panel eyebrow="Sensitivity Summary" title="Scenario Considerations"><p className="leading-8">{deal.sensitivity || "No sensitivity summary has been posted yet."}</p></Panel></div>; }

function Documents({ documents, deal }) { const language = opportunityLanguage(deal); return <Panel eyebrow="Documents" title={language.documentTitle}><div className="grid gap-4">{documents.map((doc) => <DocumentAlertCard key={doc.id} doc={doc} opportunity={deal.name} />)}</div>{!documents.length && <p>{language.emptyDocuments}</p>}</Panel>; }

function Updates({ updates, deal }) { const percent = fundedPercent(deal); const language = opportunityLanguage(deal); return <div className="grid gap-5"><Panel eyebrow="Funding Status" title={`${currency(deal.amountFunded)} funded of ${currency(deal.totalRaise)}`}><p>Funding progress is shown for investor review and remains subject to final subscription acceptance, closing conditions, and offering documents.</p><div className="mt-5"><div className="mb-2 flex justify-between text-xs font-bold uppercase text-white/50"><span>Funding Progress</span><span>{percent}%</span></div><ProgressBar value={percent} thick /></div></Panel>{updates.map((update) => <article key={update.title} className="border border-white/10 bg-[#111613] p-6"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{update.date}</p><h3 className="mt-3 text-2xl font-black">{update.title}</h3><p className="mt-3 leading-7 text-white/60">{update.summary}</p></article>)}{!updates.length && <section className="border border-white/10 bg-[#111613] p-6 text-white/60">{language.emptyUpdates}</section>}</div>; }

function Invest({ deal }) {
  return <InvestorCommitmentForm deal={deal} />;
}
