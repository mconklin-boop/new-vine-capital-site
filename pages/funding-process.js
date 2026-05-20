import SiteHeader, { JOTFORM_URL } from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const steps = [
  ["Submit Deal", "Send property details, loan request, contract status, borrower background, and timeline."],
  ["Initial Review", "We assess collateral, leverage, exit strategy, and whether the request fits private capital."],
  ["Underwriting", "Valuation, title, entity, borrower, budget, insurance, and exit diligence are coordinated."],
  ["Approval & Docs", "Terms are finalized, conditions are cleared, and closing documents are prepared."],
  ["Funding", "Funds are released when documentation, closing, and lender conditions are complete."],
];

const fees = [
  ["Credit Report Fee", "A credit report fee may be collected during underwriting when borrower credit review is required for the transaction."],
  ["Appraisal Fee", "An appraisal or valuation fee may be required when third-party valuation is needed to confirm collateral value and support final loan terms."],
];

export default function FundingProcess() {
  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <SiteHeader />
      <main>
        <section className="nvc-page-bg px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl py-12"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Funding Process</p><h1 className="mt-5 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">Clear steps. Fast turn times. Direct decision making.</h1><p className="mt-6 max-w-3xl text-xl leading-8 text-white/75">A practical path from deal submission to closing for borrowers and partners who need certainty.</p></div></section>
        <section className="bg-[#f4f1e9] px-5 py-24 text-[#050605] lg:px-8"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-5">{steps.map(([title, copy], index) => <article key={title} className="border-t-4 border-[#d5ad62] bg-white p-6"><span className="font-black text-[#1f5b3f]">0{index + 1}</span><h2 className="mt-8 text-xl font-black">{title}</h2><p className="mt-4 text-sm leading-7 text-[#5e6962]">{copy}</p></article>)}</div></section>
        <section className="bg-white px-5 py-20 text-[#050605] lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1fr]"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#1f5b3f]">Third-Party Fees</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">Some deals require underwriting and valuation costs before closing.</h2><p className="mt-5 text-[#5e6962]">Fee requirements are reviewed case by case and communicated before they are collected. Final costs depend on the property, borrower profile, transaction type, and third-party provider requirements.</p></div><div className="grid gap-4">{fees.map(([title, copy]) => <article key={title} className="border-l-4 border-[#d5ad62] bg-[#f4f1e9] p-6"><h3 className="text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-[#5e6962]">{copy}</p></article>)}</div></div></section>
        <section className="bg-[#123827] px-5 py-24 lg:px-8"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1fr]"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">What to Expect</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">Communication designed for tight timelines.</h2></div><div className="grid gap-px">{[["Fast turn times", "Initial feedback is designed to come quickly so you can protect the transaction."], ["Clear conditions", "You will know what is needed to move from interest to approval to closing."], ["Direct capital review", "Deal structure is evaluated by people who understand real estate risk and private lending execution."]].map(([t,c]) => <article key={t} className="border border-white/10 bg-white/5 p-7"><h3 className="text-xl font-black">{t}</h3><p className="mt-3 text-white/65">{c}</p></article>)}</div></div></section>
        <section className="px-5 py-20 text-center lg:px-8"><a href={JOTFORM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex bg-[#d5ad62] px-8 py-4 text-sm font-black uppercase text-[#11100b]">Submit a Deal</a></section>
      </main>
      <SiteFooter />
    </div>
  );
}
