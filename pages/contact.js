import SiteHeader, { JOTFORM_URL } from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <SiteHeader />
      <main>
        <section className="nvc-page-bg px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl py-12"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Contact / Submit Deal</p><h1 className="mt-5 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">Tell us about the deal. We will respond with a practical next step.</h1><p className="mt-6 max-w-3xl text-xl leading-8 text-white/75">Borrowers, brokers, wholesalers, developers, business owners, and investors can start here.</p></div></section>
        <section className="bg-[#f4f1e9] px-5 py-24 text-[#050605] lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.8fr]"><div className="bg-white p-8 shadow-2xl shadow-black/10" id="apply"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#1f5b3f]">Deal Submission</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">Submit a Deal</h2><p className="mt-5 text-[#5e6962]">Use the New Vine Capital deal submission link to send your funding request securely through Jotform.</p><a href={JOTFORM_URL} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex bg-[#d5ad62] px-8 py-4 text-sm font-black uppercase text-[#11100b]">Submit Deal</a></div><aside className="grid gap-5 bg-white p-8 shadow-2xl shadow-black/10"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#1f5b3f]">Direct Contact</p><h3 className="text-2xl font-black">New Vine Capital</h3><p><strong>Phone:</strong> 720-460-0337</p><p><strong>Email:</strong> deals@newvinecapital.com</p><div className="grid min-h-[190px] place-items-center bg-gradient-to-br from-[#1d251f] to-[#123827] p-7 text-white"><div><h3 className="text-xl font-black">Nationwide Lending Footprint</h3><p className="mt-3 text-white/70">Nationwide private lending support for investors, brokers, developers, and business owners.</p></div></div></aside></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
