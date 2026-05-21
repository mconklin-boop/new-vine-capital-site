import Image from "next/image";
import Link from "next/link";
import SiteHeader, { JOTFORM_URL } from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const programs = [
  ["DSCR", "Rental Investor Loans", "Cash-flow based capital for rental properties and portfolio growth."],
  ["Fix & Flip", "Acquisition + Rehab", "Short-term capital for operators moving quickly on value-add assets."],
  ["Bridge", "Time-Sensitive Closings", "Flexible bridge structures for acquisitions, refis, payoffs, and liquidity events."],
  ["Creative", "Gap + Second Position", "Structured capital for complex stacks, shortfalls, and unconventional transactions."],
];

const steps = ["Submit Deal", "Initial Review", "Underwriting", "Approval & Docs", "Funding"];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050605] text-[#fffdf7]">
      <SiteHeader />

      <main>
        <section className="nvc-hero-bg relative grid min-h-[92vh] items-center overflow-hidden px-5 py-24 lg:grid-cols-[1fr_420px] lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1fr_420px]">
            <div className="max-w-4xl self-center">
              <Image src="/logo.png" alt="New Vine Capital" width={260} height={260} className="mb-8 h-48 w-48 object-contain drop-shadow-2xl md:h-64 md:w-64 lg:h-72 lg:w-72" priority />
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Fast Private Capital Solutions</p>
              <h1 className="mt-5 max-w-5xl font-serif text-5xl leading-none text-white md:text-7xl lg:text-8xl">Private Capital Built for Real Estate Investors</h1>
              <p className="mt-7 max-w-3xl text-xl leading-8 text-white/80 md:text-2xl">Fast approvals. Creative structures. Nationwide funding solutions.</p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a href={JOTFORM_URL} target="_blank" rel="noopener noreferrer" className="bg-[#d5ad62] px-7 py-4 text-center text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Submit Deal</a>
                <Link href="/contact" className="border border-white/35 px-7 py-4 text-center text-sm font-black uppercase text-white transition hover:border-[#d5ad62]">Contact Us</Link>
                <Link href="/investor-portal" className="border border-[#d5ad62]/70 px-7 py-4 text-center text-sm font-black uppercase text-[#d5ad62] transition hover:bg-[#d5ad62] hover:text-[#11100b]">Investor Portal Login</Link>
              </div>
            </div>

            <aside className="self-end border border-white/15 bg-[#111613]/90 p-8 shadow-2xl shadow-black/30">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">Direct private lending</p>
              <strong className="mt-5 block font-serif text-2xl leading-tight">Asset-based underwriting for deals that do not fit rigid bank boxes.</strong>
              <dl className="mt-7 grid gap-4 border-t border-white/10 pt-6 text-sm"><div className="flex justify-between gap-6"><dt className="text-white/55">Footprint</dt><dd className="font-black">Nationwide</dd></div><div className="flex justify-between gap-6"><dt className="text-white/55">Focus</dt><dd className="font-black">Real estate capital</dd></div><div className="flex justify-between gap-6"><dt className="text-white/55">Approach</dt><dd className="font-black">Creative structuring</dd></div></dl>
            </aside>
          </div>
        </section>

        <section className="grid bg-white text-[#050605] md:grid-cols-5">{["Fast approvals", "Asset-based underwriting", "Nationwide lending", "Creative finance", "Investor-focused"].map((item) => <div key={item} className="min-h-[145px] border-b border-black/10 p-7 md:border-r"><strong className="block text-lg">{item}</strong><span className="mt-2 block text-sm text-[#5e6962]">Built for real estate operators, brokers, and sponsors who need certainty.</span></div>)}</section>
        <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Loan Programs</p><h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">Capital for real-world deals.</h2></div><Link href="/loan-programs" className="w-fit border-b-2 border-[#d5ad62] pb-2 text-xs font-black uppercase text-[#d5ad62]">View all programs</Link></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{programs.map(([kicker, title, copy]) => <article key={title} className="min-h-[275px] border border-white/10 bg-[#111613] p-7 transition hover:-translate-y-1 hover:border-[#d5ad62]/70"><span className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{kicker}</span><h3 className="mt-7 text-xl font-black">{title}</h3><p className="mt-4 text-sm leading-7 text-white/60">{copy}</p></article>)}</div></section>
        <section className="grid bg-[#123827] px-5 py-24 lg:grid-cols-[0.8fr_1fr] lg:px-8"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1fr]"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Why New Vine</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">Built for operators who need certainty, speed, and judgment.</h2></div><div className="grid gap-px">{[["Direct decision making", "Speak with capital partners who understand structure, collateral, and exits."], ["Flexible underwriting", "We evaluate the full transaction, not just a narrow checklist."], ["Broker friendly", "Clean communication and repeatable process for referral partners and deal sources."], ["Complex deal capability", "Bridge, gap, EMD, transactional, and second-position scenarios receive practical review."]].map(([title, copy]) => <article key={title} className="border border-white/10 bg-white/5 p-7"><h3 className="text-xl font-black">{title}</h3><p className="mt-3 text-white/65">{copy}</p></article>)}</div></div></section>
        <section className="bg-[#f4f1e9] px-5 py-24 text-[#050605] lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#1f5b3f]">Funding Process</p><h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-6xl">Five steps from deal submission to funding.</h2><div className="mt-12 grid gap-4 md:grid-cols-5">{steps.map((step, index) => <article key={step} className="border-t-4 border-[#d5ad62] bg-white p-6"><span className="font-black text-[#1f5b3f]">0{index + 1}</span><h3 className="mt-7 text-lg font-black">{step}</h3><p className="mt-3 text-sm text-[#5e6962]">Clear communication and direct review at every stage.</p></article>)}</div></div></section>
        <section className="grid gap-8 bg-[#123827] px-5 py-24 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8"><div className="mx-auto max-w-7xl lg:contents"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Investor Opportunities</p><h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-6xl">Private real estate debt strategies for passive capital partners.</h2><p className="mt-5 max-w-3xl text-white/70">New Vine Capital works with qualified investors seeking exposure to secured private lending opportunities.</p></div><div className="flex flex-col gap-3 sm:flex-row"><Link href="/investors" className="bg-[#d5ad62] px-7 py-4 text-center text-sm font-black uppercase text-[#11100b]">Explore Investor Options</Link><Link href="/investor-portal" className="border border-[#d5ad62]/70 px-7 py-4 text-center text-sm font-black uppercase text-[#d5ad62]">Investor Portal Login</Link></div></div></section>
      </main>

      <a href={JOTFORM_URL} target="_blank" rel="noopener noreferrer" className="fixed bottom-4 right-4 z-40 bg-[#d5ad62] px-5 py-4 text-xs font-black uppercase text-[#11100b] shadow-2xl shadow-black/40 md:right-6">Submit Deal</a>
      <SiteFooter />
    </div>
  );
}
