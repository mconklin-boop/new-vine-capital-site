import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { siteLinks } from "../../lib/siteLinks";

const nextSteps = [
  "Watch for your HubSpot meeting confirmation email and calendar invite",
  "Prepare questions about investment objectives, liquidity, risk tolerance, and qualification",
  "Review New Vine Capital's private real estate credit strategies",
  "Investor portal access may be reviewed after the intake conversation",
];

export default function InvestorCallConfirmed() {
  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <SiteHeader />
      <main>
        <section className="nvc-page-bg px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl py-12"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Investor Intake Call</p><h1 className="mt-5 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">Your Investor Intake Call Is Booked</h1><p className="mt-6 max-w-3xl text-xl leading-8 text-white/75">Thank you for scheduling with New Vine Capital. Your meeting details will be delivered through HubSpot and your calendar confirmation.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href={siteLinks.investorsPage} className="bg-[#d5ad62] px-7 py-4 text-center text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Return to Investors Page</Link><Link href={siteLinks.investorPortal} className="border border-[#d5ad62]/70 px-7 py-4 text-center text-sm font-black uppercase text-[#d5ad62] transition hover:bg-[#d5ad62] hover:text-[#11100b]">Investor Portal Login</Link></div></div></section>

        <section className="bg-[#111613] px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1fr]"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Pre-Call Preparation</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">What happens next.</h2><p className="mt-5 text-lg leading-8 text-white/65">The intake call is informational and used to understand fit, qualification, and next steps. It does not constitute investment advice, an offer to sell securities, or a guarantee of eligibility.</p></div><div className="grid gap-4">{nextSteps.map((step, index) => <article key={step} className="grid gap-4 border border-white/10 bg-white/[0.04] p-5 sm:grid-cols-[auto_1fr] sm:items-center"><span className="grid h-10 w-10 place-items-center bg-[#d5ad62] text-sm font-black text-[#11100b]">{index + 1}</span><div><h3 className="text-xl font-black text-white">{step}</h3><p className="mt-2 text-sm leading-6 text-white/60">This helps New Vine Capital prepare for a focused investor conversation and any future suitability review.</p></div></article>)}</div></div></section>

        <section className="bg-[#f4f1e9] px-5 py-20 text-[#050605] lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3"><article className="border-l-4 border-[#d5ad62] bg-white p-6"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#1f5b3f]">Call Focus</p><h3 className="mt-3 text-2xl font-black">Investor fit and objectives</h3><p className="mt-3 text-sm leading-7 text-[#53615a]">We will discuss your objectives, preferred strategies, estimated investment range, liquidity expectations, and experience with private investments.</p></article><article className="border-l-4 border-[#d5ad62] bg-white p-6"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#1f5b3f]">Qualification</p><h3 className="mt-3 text-2xl font-black">Suitability review</h3><p className="mt-3 text-sm leading-7 text-[#53615a]">Any potential opportunity remains subject to qualification, suitability review, allocation availability, and offering documents.</p></article><article className="border-l-4 border-[#d5ad62] bg-white p-6"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#1f5b3f]">Portal Access</p><h3 className="mt-3 text-2xl font-black">Approved investor access</h3><p className="mt-3 text-sm leading-7 text-[#53615a]">Investor portal access is restricted to approved investors and authorized users after review by New Vine Capital.</p></article></div></section>

        <section className="px-5 py-16 lg:px-8"><div className="mx-auto max-w-5xl border-l-4 border-[#d5ad62] bg-white/[0.04] p-5 text-sm leading-7 text-white/60">This page is informational only. Nothing contained herein constitutes an offer to sell securities or investment advice. Any investment opportunity is subject to qualification, suitability review, allocation availability, legal documentation, and applicable securities laws.</div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
