import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { siteLinks } from "../../lib/siteLinks";

const nextSteps = [
  "New Vine Capital reviews the intake form and call request",
  "Confirmation details are sent if the requested time is available",
  "Prepare questions for the intake conversation",
  "Investor portal access may be reviewed after the call",
];

export default function InvestorCallConfirmed() {
  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <SiteHeader />
      <main>
        <section className="nvc-page-bg px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl py-12"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Investor Intake Call</p><h1 className="mt-5 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">Your Intake Call Request Was Received</h1><p className="mt-6 max-w-3xl text-xl leading-8 text-white/75">Thank you for requesting an investor intake call with New Vine Capital. We will review your intake form and requested time before confirming the meeting.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href={siteLinks.investorScheduler} className="bg-[#d5ad62] px-7 py-4 text-center text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Request Another Time</Link><Link href={siteLinks.investorsPage} className="border border-[#d5ad62]/70 px-7 py-4 text-center text-sm font-black uppercase text-[#d5ad62] transition hover:bg-[#d5ad62] hover:text-[#11100b]">Return to Investors Page</Link><Link href={siteLinks.investorPortal} className="border border-white/25 px-7 py-4 text-center text-sm font-black uppercase text-white transition hover:border-[#d5ad62] hover:text-[#d5ad62]">Investor Portal</Link></div></div></section>

        <section className="bg-[#111613] px-5 py-20 lg:px-8"><div className="mx-auto max-w-5xl"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Next Steps</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">What happens next.</h2><div className="mt-10 grid gap-4">{nextSteps.map((step, index) => <article key={step} className="grid gap-4 border border-white/10 bg-white/[0.04] p-5 sm:grid-cols-[auto_1fr] sm:items-center"><span className="grid h-10 w-10 place-items-center bg-[#d5ad62] text-sm font-black text-[#11100b]">{index + 1}</span><div><h3 className="text-xl font-black text-white">{step}</h3><p className="mt-2 text-sm leading-6 text-white/60">This step helps New Vine Capital prepare for an informational conversation and any future qualification review.</p></div></article>)}</div></div></section>

        <section className="px-5 py-16 lg:px-8"><div className="mx-auto max-w-5xl border-l-4 border-[#d5ad62] bg-white/[0.04] p-5 text-sm leading-7 text-white/60">This page is informational only. Investor portal access, investment eligibility, and any opportunity review remain subject to qualification, suitability review, allocation availability, and offering documents.</div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
