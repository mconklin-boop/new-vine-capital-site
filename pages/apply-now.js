import { useEffect } from "react";
import SiteHeader, { JOTFORM_URL } from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function ApplyNow() {
  useEffect(() => {
    window.location.href = JOTFORM_URL;
  }, []);

  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-24 text-center lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Apply Now</p>
        <h1 className="mt-5 font-serif text-5xl leading-tight">Opening the New Vine Capital application.</h1>
        <p className="mt-5 text-white/70">If it does not open automatically, use the button below.</p>
        <a href={JOTFORM_URL} className="mt-8 inline-flex bg-[#d5ad62] px-8 py-4 text-sm font-black uppercase text-[#11100b]">Open Application</a>
      </main>
      <SiteFooter />
    </div>
  );
}
