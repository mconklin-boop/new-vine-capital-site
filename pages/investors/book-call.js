import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { siteLinks } from "../../lib/siteLinks";

const coverageItems = [
  "Investment objectives",
  "Preferred investment strategies",
  "Risk tolerance and liquidity expectations",
  "Accreditation and qualification review",
  "New Vine Capital investor portal access",
  "Available and upcoming opportunities",
];

const preCallSteps = [
  ["01", "Complete the Investor Intake Form", "Submit background information first so New Vine Capital can review fit, qualification, and suitability before an intake call is scheduled."],
  ["02", "Schedule after submission", "After the intake form is completed, use the scheduling step to select an available Google Booking time."],
  ["03", "Review confirmation details", "After scheduling, watch for your confirmation email and any portal access instructions."],
];

export default function BookInvestorCall() {
  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <SiteHeader />
      <main>
        <section className="nvc-page-bg px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl py-12"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Investor Intake</p><h1 className="mt-5 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">Complete Investor Intake Before Scheduling</h1><p className="mt-6 max-w-3xl text-xl leading-8 text-white/75">New Vine Capital investor intake calls are scheduled after the investor intake form is submitted for initial qualification and suitability review.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href={siteLinks.jotformInvestorIntake} target="_blank" rel="noopener noreferrer" className="bg-[#d5ad62] px-7 py-4 text-center text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Complete Investor Intake Form</a><Link href={siteLinks.callConfirmed} className="border border-[#d5ad62]/70 px-7 py-4 text-center text-sm font-black uppercase text-[#d5ad62] transition hover:bg-[#d5ad62] hover:text-[#11100b]">I Completed the Form</Link></div><p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">Please complete the JotForm before booking a call. The scheduling link is provided on the next-steps page for investors who have submitted the intake form.</p></div></section>

        <section className="bg-[#111613] px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">What We'll Cover</p><h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-6xl">A focused conversation after initial intake.</h2><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{coverageItems.map((item) => <article key={item} className="border border-white/10 bg-white/[0.04] p-5"><h3 className="text-lg font-black text-white">{item}</h3><p className="mt-3 text-sm leading-6 text-white/60">Reviewed for informational purposes and subject to investor qualification, suitability, and available opportunities.</p></article>)}</div></div></section>

        <section className="bg-[#f4f1e9] px-5 py-20 text-[#050605] lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1fr]"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#1f5b3f]">Before the Call</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">The intake form comes first.</h2><p className="mt-5 leading-8 text-[#53615a]">After submitting the investor intake form, return to the next-steps page to schedule your call and review what to prepare before the meeting.</p><Link href={siteLinks.callConfirmed} className="mt-7 inline-flex bg-[#1f5b3f] px-6 py-4 text-xs font-black uppercase text-white">Continue After Form Submission</Link></div><div className="grid gap-4">{preCallSteps.map(([number, title, copy]) => <article key={title} className="border-l-4 border-[#d5ad62] bg-white p-5"><span className="text-xs font-black text-[#1f5b3f]">{number}</span><h3 className="mt-2 text-xl font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-[#53615a]">{copy}</p></article>)}</div></div></section>

        <section className="bg-white px-5 py-20 text-[#050605] lg:px-8"><div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2"><article className="border border-black/10 bg-[#f4f1e9] p-7"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#1f5b3f]">Step 1</p><h2 className="mt-3 text-3xl font-black">Complete investor intake.</h2><p className="mt-4 leading-7 text-[#53615a]">Use the New Vine Capital investor intake form to request information and begin the qualification and suitability review process.</p><a href={siteLinks.jotformInvestorIntake} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-full justify-center bg-[#d5ad62] px-6 py-4 text-xs font-black uppercase text-[#11100b] sm:w-auto">Complete Investor Intake Form</a></article><article className="border border-black/10 bg-[#111613] p-7 text-white"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Step 2</p><h2 className="mt-3 text-3xl font-black">Schedule after submission.</h2><p className="mt-4 leading-7 text-white/65">The Google Booking link is provided on the next-steps page after the intake form has been completed.</p><Link href={siteLinks.callConfirmed} className="mt-6 inline-flex w-full justify-center border border-[#d5ad62]/70 px-6 py-4 text-xs font-black uppercase text-[#d5ad62] transition hover:bg-[#d5ad62] hover:text-[#11100b] sm:w-auto">I Completed the Form</Link></article></div></section>

        <section className="px-5 py-16 lg:px-8"><div className="mx-auto max-w-7xl border-l-4 border-[#d5ad62] bg-white/[0.04] p-5 text-sm leading-7 text-white/60">This call is for informational purposes only and does not constitute investment advice or an offer to sell securities. Any investment opportunity is subject to investor qualification, suitability review, allocation availability, and offering documents.</div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
