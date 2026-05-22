import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { siteLinks } from "../../lib/siteLinks";

const nextSteps = [
  "Confirm the investor intake form has been submitted",
  "Select an available intake call time below",
  "Watch for meeting confirmation details",
  "Prepare questions for the call",
  "Request investor portal access if applicable",
];

export default function InvestorCallConfirmed() {
  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <SiteHeader />
      <main>
        <section className="nvc-page-bg px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl py-12"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Investor Intake Call</p><h1 className="mt-5 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">Schedule Your Investor Intake Call</h1><p className="mt-6 max-w-3xl text-xl leading-8 text-white/75">After completing the investor intake form, select a meeting time below. The booking experience stays on the New Vine Capital website so you can return to the investor pages when finished.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href={siteLinks.jotformInvestorIntake} target="_blank" rel="noopener noreferrer" className="bg-[#d5ad62] px-7 py-4 text-center text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Complete Intake Form</a><Link href={siteLinks.investorsPage} className="border border-[#d5ad62]/70 px-7 py-4 text-center text-sm font-black uppercase text-[#d5ad62] transition hover:bg-[#d5ad62] hover:text-[#11100b]">Return to Investors Page</Link><Link href={siteLinks.investorPortal} className="border border-white/25 px-7 py-4 text-center text-sm font-black uppercase text-white transition hover:border-[#d5ad62] hover:text-[#d5ad62]">Investor Portal</Link></div></div></section>

        <section className="bg-[#111613] px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1fr]"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Google Booking</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">Book after submitting the intake form.</h2><p className="mt-5 text-lg leading-8 text-white/65">Use the embedded Google Booking page to select a time. If the scheduler does not load on your device, open the booking page in a new tab.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col"><a href={siteLinks.googleInvestorBooking} target="_blank" rel="noopener noreferrer" className="bg-[#d5ad62] px-6 py-4 text-center text-xs font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Open Google Booking</a><Link href={siteLinks.investorsPage} className="border border-white/20 px-6 py-4 text-center text-xs font-black uppercase text-white transition hover:border-[#d5ad62] hover:text-[#d5ad62]">Return to Website</Link></div></div><div className="overflow-hidden border border-white/10 bg-white p-2 shadow-2xl shadow-black/30"><iframe src={siteLinks.googleInvestorBooking} title="New Vine Capital investor intake booking" className="h-[720px] w-full bg-white" loading="lazy" /></div></div></section>

        <section className="bg-[#f4f1e9] px-5 py-20 text-[#050605] lg:px-8"><div className="mx-auto max-w-5xl"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#1f5b3f]">Next Steps</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">After your call is booked.</h2><div className="mt-10 grid gap-4">{nextSteps.map((step, index) => <article key={step} className="grid gap-4 border border-black/10 bg-white p-5 sm:grid-cols-[auto_1fr] sm:items-center"><span className="grid h-10 w-10 place-items-center bg-[#d5ad62] text-sm font-black text-[#11100b]">{index + 1}</span><div><h3 className="text-xl font-black text-[#050605]">{step}</h3><p className="mt-2 text-sm leading-6 text-[#53615a]">This step helps New Vine Capital prepare for an informational conversation and any future qualification review.</p></div></article>)}</div></div></section>

        <section className="px-5 py-16 lg:px-8"><div className="mx-auto max-w-5xl border-l-4 border-[#d5ad62] bg-white/[0.04] p-5 text-sm leading-7 text-white/60">This page is informational only. Investor portal access, investment eligibility, and any opportunity review remain subject to qualification, suitability review, allocation availability, and offering documents.</div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
