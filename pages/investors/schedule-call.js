import { useMemo, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { siteLinks } from "../../lib/siteLinks";

const availableSlots = [
  { date: "Tuesday, June 2", times: ["9:30 AM", "11:00 AM", "2:00 PM"] },
  { date: "Wednesday, June 3", times: ["10:00 AM", "1:30 PM", "3:30 PM"] },
  { date: "Thursday, June 4", times: ["9:00 AM", "12:30 PM", "4:00 PM"] },
  { date: "Friday, June 5", times: ["10:30 AM", "1:00 PM"] },
];

const callTopics = [
  "Investor qualification and suitability review",
  "Preferred real estate credit strategies",
  "Risk tolerance and liquidity expectations",
  "Investor portal access and next steps",
];

export default function InvestorScheduler() {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedSlotLabel = useMemo(() => {
    if (!selectedSlot) return "No time selected";
    return selectedSlot.replace("|", " at ");
  }, [selectedSlot]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedSlot) return;
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      slot: selectedSlot,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      entity: formData.get("entity"),
      notes: formData.get("notes"),
    };

    try {
      const response = await fetch("/api/investor-call-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to submit the call request.");
      setSubmitted(true);
    } catch (error) {
      setErrorMessage(error.message || "Unable to submit the call request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <SiteHeader />
      <main>
        <section className="nvc-page-bg px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl py-12"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Investor Intake Scheduler</p><h1 className="mt-5 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">Schedule Your Investor Intake Call</h1><p className="mt-6 max-w-3xl text-xl leading-8 text-white/75">Select a preferred time for your investor intake conversation. New Vine Capital will review your intake form and follow up with confirmation details.</p></div></section>

        <section className="bg-[#111613] px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1fr]"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Private Investor Access</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">Choose a time for your intake conversation.</h2><p className="mt-5 text-lg leading-8 text-white/65">Calls are informational and used to understand objectives, fit, qualification, and next steps. Submitting a call request does not guarantee eligibility or portal access.</p><div className="mt-8 grid gap-3">{callTopics.map((topic) => <div key={topic} className="border-l-4 border-[#d5ad62] bg-white/[0.04] p-4 text-sm font-bold text-white/75">{topic}</div>)}</div></div>

          <form onSubmit={handleSubmit} className="border border-white/10 bg-white p-5 text-[#050605] shadow-2xl shadow-black/30 md:p-7">
            {submitted ? (
              <div className="grid min-h-[520px] place-items-center text-center"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#1f5b3f]">Request Received</p><h2 className="mt-4 font-serif text-4xl leading-tight">Your intake call request has been submitted.</h2><p className="mt-5 text-lg leading-8 text-[#53615a]">Requested time: <strong>{selectedSlotLabel}</strong>. New Vine Capital will review your intake form and follow up with confirmation details.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"><Link href={siteLinks.investorsPage} className="bg-[#1f5b3f] px-6 py-4 text-center text-xs font-black uppercase text-white">Return to Investors Page</Link><Link href={siteLinks.investorPortal} className="border border-[#1f5b3f]/40 px-6 py-4 text-center text-xs font-black uppercase text-[#1f5b3f]">Investor Portal</Link></div></div></div>
            ) : (
              <>
                <div className="flex flex-col gap-2 border-b border-black/10 pb-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#1f5b3f]">Available Times</p><h2 className="mt-2 text-3xl font-black">Select a preferred call time.</h2></div><p className="text-sm font-bold text-[#53615a]">Mountain Time</p></div>

                <div className="mt-6 grid gap-5">{availableSlots.map((day) => <fieldset key={day.date} className="border border-black/10 p-4"><legend className="px-2 text-sm font-black text-[#1f5b3f]">{day.date}</legend><div className="mt-3 grid gap-2 sm:grid-cols-3">{day.times.map((time) => { const value = `${day.date}|${time}`; const isSelected = selectedSlot === value; return <label key={value} className={`cursor-pointer border px-4 py-3 text-center text-sm font-black transition ${isSelected ? "border-[#1f5b3f] bg-[#1f5b3f] text-white" : "border-black/10 bg-[#f4f1e9] text-[#050605] hover:border-[#d5ad62]"}`}><input type="radio" name="slot" value={value} checked={isSelected} onChange={() => setSelectedSlot(value)} className="sr-only" />{time}</label>; })}</div></fieldset>)}</div>

                <div className="mt-7 grid gap-4 md:grid-cols-2"><label className="grid gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#53615a]">Name<input required name="name" className="border border-black/10 bg-[#f4f1e9] px-4 py-3 text-base font-semibold normal-case tracking-normal text-[#050605] outline-none focus:border-[#1f5b3f]" /></label><label className="grid gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#53615a]">Email<input required type="email" name="email" className="border border-black/10 bg-[#f4f1e9] px-4 py-3 text-base font-semibold normal-case tracking-normal text-[#050605] outline-none focus:border-[#1f5b3f]" /></label><label className="grid gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#53615a]">Phone<input required name="phone" className="border border-black/10 bg-[#f4f1e9] px-4 py-3 text-base font-semibold normal-case tracking-normal text-[#050605] outline-none focus:border-[#1f5b3f]" /></label><label className="grid gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#53615a]">Entity Name<input name="entity" className="border border-black/10 bg-[#f4f1e9] px-4 py-3 text-base font-semibold normal-case tracking-normal text-[#050605] outline-none focus:border-[#1f5b3f]" /></label></div>

                <label className="mt-5 grid gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#53615a]">Notes<textarea name="notes" rows="4" className="border border-black/10 bg-[#f4f1e9] px-4 py-3 text-base font-semibold normal-case tracking-normal text-[#050605] outline-none focus:border-[#1f5b3f]" placeholder="Optional topics you would like to discuss" /></label>

                {!selectedSlot && <p className="mt-4 text-sm font-bold text-[#8a5b16]">Please select a time before submitting.</p>}
                {errorMessage && <p className="mt-4 border-l-4 border-[#8a2516] bg-[#fff0ed] p-3 text-sm font-bold text-[#8a2516]">{errorMessage}</p>}
                <button type="submit" disabled={isSubmitting} className="mt-6 w-full bg-[#d5ad62] px-6 py-4 text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Submitting Request..." : "Request Intake Call"}</button>
                <p className="mt-4 text-xs leading-5 text-[#53615a]">Call times are subject to confirmation by New Vine Capital. This scheduler does not create an investment offer or guarantee investor eligibility.</p>
              </>
            )}
          </form></div></section>

        <section className="px-5 py-16 lg:px-8"><div className="mx-auto max-w-5xl border-l-4 border-[#d5ad62] bg-white/[0.04] p-5 text-sm leading-7 text-white/60">This scheduler is for informational intake calls only. Investor portal access, investment eligibility, and any opportunity review remain subject to qualification, suitability review, allocation availability, and offering documents.</div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
