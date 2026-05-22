import { useState } from "react";
import Link from "next/link";
import { dealOpportunities, investmentFunds, investorAccessSteps, investorTrustPoints } from "../lib/investmentOpportunities";
import { siteLinks } from "../lib/siteLinks";

function StatusBadge({ children, muted = false }) {
  return <span className={`inline-flex w-fit border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${muted ? "border-white/15 bg-white/5 text-white/55" : "border-[#d5ad62]/50 bg-[#d5ad62]/10 text-[#d5ad62]"}`}>{children}</span>;
}

function VisualMark({ children, muted = false }) {
  return (
    <div className={`relative grid h-16 w-16 place-items-center overflow-hidden border text-sm font-black ${muted ? "border-white/15 bg-white/[0.035] text-white/45" : "border-[#d5ad62]/50 bg-[#d5ad62]/10 text-[#d5ad62]"}`}>
      <span className="absolute inset-x-3 top-4 h-px bg-current opacity-35" />
      <span className="absolute bottom-4 left-4 right-2 h-px bg-current opacity-25" />
      <span className="relative">{children}</span>
    </div>
  );
}

function FundCard({ fund }) {
  return (
    <article className={`nvc-reveal group relative flex min-h-[520px] flex-col border p-6 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 ${fund.comingSoon ? "border-white/10 bg-[#101410]" : "border-white/10 bg-[#111613] hover:border-[#d5ad62]/60"}`}>
      {fund.comingSoon && <div className="absolute inset-x-0 top-0 h-1 bg-white/10" />}
      <div className="flex items-start justify-between gap-4">
        <VisualMark muted={fund.comingSoon}>{fund.visual}</VisualMark>
        <StatusBadge muted={fund.comingSoon}>{fund.status}</StatusBadge>
      </div>
      <p className="mt-8 text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{fund.type}</p>
      <h3 className="mt-3 text-2xl font-black leading-tight text-white">{fund.name}</h3>
      <p className="mt-4 text-sm leading-7 text-white/62">{fund.strategy}</p>
      <div className="mt-6 grid gap-3 border-y border-white/10 py-5 text-sm">
        <div><span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/35">Target Investment Focus</span><strong className="mt-1 block text-white/80">{fund.targetFocus}</strong></div>
        <div><span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/35">Structure Type</span><strong className="mt-1 block text-white/80">{fund.structureType}</strong></div>
        <div><span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/35">Distribution Style</span><strong className="mt-1 block text-white/80">{fund.distributionStyle}</strong></div>
      </div>
      <ul className="mt-5 grid gap-2 text-sm text-white/62">
        {fund.details.map((item) => <li key={item} className="border-l-2 border-[#d5ad62]/50 pl-3">{item}</li>)}
      </ul>
      <a href={siteLinks.jotformInvestorIntake} target="_blank" rel="noopener noreferrer" className={`mt-auto inline-flex w-full justify-center px-5 py-4 text-center text-xs font-black uppercase transition ${fund.comingSoon ? "border border-[#d5ad62]/60 text-[#d5ad62] hover:bg-[#d5ad62] hover:text-[#11100b]" : "bg-[#d5ad62] text-[#11100b] hover:bg-[#f0d99a]"}`}>{fund.cta}</a>
    </article>
  );
}

function DealCard({ deal }) {
  return (
    <article className="nvc-reveal grid gap-5 border border-white/10 bg-[#111613] p-6 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-[#d5ad62]/60 lg:grid-cols-[auto_1fr]">
      <VisualMark>{deal.visual}</VisualMark>
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{deal.type}</p>
            <h3 className="mt-2 text-2xl font-black leading-tight text-white">{deal.title}</h3>
          </div>
          <StatusBadge>{deal.status}</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <div className="border border-white/10 bg-white/[0.035] p-3"><span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/35">Location</span><strong className="mt-1 block text-white/80">{deal.location}</strong></div>
          <div className="border border-white/10 bg-white/[0.035] p-3"><span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/35">Target Structure</span><strong className="mt-1 block text-white/80">{deal.targetStructure}</strong></div>
          <div className="border border-white/10 bg-white/[0.035] p-3"><span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/35">Duration</span><strong className="mt-1 block text-white/80">{deal.duration}</strong></div>
        </div>
        <a href={siteLinks.jotformInvestorIntake} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex w-full justify-center border border-[#d5ad62]/70 px-5 py-4 text-center text-xs font-black uppercase text-[#d5ad62] transition hover:bg-[#d5ad62] hover:text-[#11100b] sm:w-auto">{deal.cta}</a>
      </div>
    </article>
  );
}

export default function InvestmentOpportunitiesSection() {
  const [activeTab, setActiveTab] = useState("funds");

  return (
    <section className="bg-[#050605] px-5 py-24 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Private investor access</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">Investment Opportunities</h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-white/65">New Vine Capital provides approved investors access to select private real estate credit opportunities, structured investment funds, and transaction-specific capital strategies.</p>
            <p className="mt-4 border-l-2 border-[#d5ad62]/70 bg-white/[0.025] px-3 py-2 text-[11px] leading-5 text-white/45">Opportunities shown are for informational purposes only and may not be currently available. All investments are subject to investor qualification, suitability review, allocation availability, and offering documents.</p>
          </div>
        </div>

        <div className="mt-10 grid gap-2 border border-white/10 bg-[#111613] p-2 sm:inline-grid sm:grid-cols-2">
          {[["funds", "Managed Funds"], ["deals", "Deal-by-Deal Opportunities"]].map(([key, label]) => (
            <button key={key} type="button" onClick={() => setActiveTab(key)} className={`px-5 py-3 text-xs font-black uppercase tracking-[0.12em] transition ${activeTab === key ? "bg-[#d5ad62] text-[#11100b]" : "text-white/65 hover:bg-white/5 hover:text-white"}`}>{label}</button>
          ))}
        </div>

        {activeTab === "funds" ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {investmentFunds.map((fund) => <FundCard key={fund.id} fund={fund} />)}
          </div>
        ) : (
          <div className="mt-8">
            <p className="mb-6 max-w-4xl text-lg leading-8 text-white/65">Approved investors may receive access to select transaction-specific opportunities reviewed through the New Vine Capital underwriting and review process.</p>
            <div className="grid gap-5">
              {dealOpportunities.map((deal) => <DealCard key={deal.id} deal={deal} />)}
            </div>
          </div>
        )}

        <div className="mt-14 grid gap-8 border border-white/10 bg-[#123827] p-6 md:p-8 lg:grid-cols-[0.75fr_1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Investor Access</p>
            <h3 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">How Investor Access Works</h3>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a href={siteLinks.jotformInvestorIntake} target="_blank" rel="noopener noreferrer" className="bg-[#d5ad62] px-6 py-4 text-center text-xs font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Complete Investor Intake</a>
              <Link href={siteLinks.investorBookCall} className="border border-[#d5ad62]/70 px-6 py-4 text-center text-xs font-black uppercase text-[#d5ad62] transition hover:bg-[#d5ad62] hover:text-[#11100b]">Schedule Investor Call</Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {investorAccessSteps.map((step, index) => <article key={step} className="border border-white/10 bg-white/[0.055] p-5"><span className="text-xs font-black text-[#d5ad62]">0{index + 1}</span><h4 className="mt-4 text-base font-black leading-tight">{step}</h4></article>)}
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {investorTrustPoints.map((point, index) => <article key={point} className="border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#d5ad62]/50"><div className="flex h-9 w-9 items-center justify-center border border-[#d5ad62]/40 text-xs font-black text-[#d5ad62]">{index + 1}</div><h4 className="mt-5 text-sm font-black uppercase tracking-[0.08em] text-white/80">{point}</h4></article>)}
        </div>

        <p className="mt-6 max-w-5xl border-l-2 border-[#d5ad62]/70 bg-white/[0.025] px-3 py-2 text-[11px] leading-5 text-white/45">Investment opportunities are available only to qualified investors. All investments involve risk, including possible loss of principal. Information provided is for informational purposes only and does not constitute investment advice or an offer to sell securities.</p>
      </div>
    </section>
  );
}
