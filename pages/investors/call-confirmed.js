import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { siteLinks } from "../../lib/siteLinks";

const nextSteps = [
  "Complete Investor Intake Form",
  "Review New Vine Capital investment strategies",
  "Prepare questions for the call",
  "Watch for meeting confirmation details",
  "Request investor portal access if applicable",
];

export default function InvestorCallConfirmed() {
  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <SiteHeader />
      <main>
        <section className="nvc-page-bg px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl py-12"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Investor Intake Call</p><h1 className="mt-5 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">Your Investor Intake Call Is Confirmed</h1><p className="mt-6 max-w-3xl text-xl leading-8 text-white/75">Thank you for scheduling with New Vine Capital. Please complete the next steps below before your call.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href={siteLinks.jotformInvestorIntake} target="_blank" rel="noopener noreferrer" className="bg-[#d5ad62] px-7 py-4 text-center text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Complete Intake Form</a><Link href={siteLinks.investorPortal} className="border border-[#d5ad62]/70 px-7 py-4 text-center text-sm font-black uppercase text-[#d5ad62] transition hover:bg-[#d5ad62] hover:text-[#11100b]">Visit Investor Portal</Link><Link href={siteLinks.investorsPage} className="border border-white/25 px-7 py-4 text-center text-sm font-black uppercase text-white transition hover:border-[#d5ad62] hover:text-[#d5ad62]">Return to Investors Page</Link></div></div></section>

        <section className="bg-[#111613] px-5 py-20 lg:px-8"><div className="mx-auto max-w-5xl"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Pre-Call Checklist</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">Complete these items before your meeting.</h2><div className="mt-10 grid gap-4">{nextSteps.map((step, index) => <article key={step} className="grid gap-4 border border-white/10 bg-white/[0.04] p-5 sm:grid-cols-[auto_1fr] sm:items-center"><span className="grid h-10 w-10 place-items-center bg-[#d5ad62] text-sm font-black text-[#11100b]">{index + 1}</span><div><h3 className="text-xl font-black text-white">{step}</h3><p className="mt-2 text-sm leading-6 text-white/60">This step helps New Vine Capital prepare for an informational conversation and any future qualification review.</p></div></article>)}</div></div></section>

        <section className="px-5 py-16 lg:px-8"><div className="mx-auto max-w-5xl border-l-4 border-[#d5ad62] bg-white/[0.04] p-5 text-sm leading-7 text-white/60">This page is informational only. Investor portal access, investment eligibility, and any opportunity review remain subject to qualification, suitability review, allocation availability, and offering documents.</div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
