import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { siteLinks } from "../lib/siteLinks";

export default function PartnerPortal() {
  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <SiteHeader />
      <main>
        <section className="nvc-page-bg px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl py-12">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Approved Partner Access</p>
            <h1 className="mt-5 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">Partner Portal</h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-white/75">Partner portal access is available to approved New Vine Capital lending partners, brokers, and authorized referral relationships.</p>
            <Link href={siteLinks.partnerAccess} className="mt-9 inline-flex bg-[#d5ad62] px-7 py-4 text-center text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Request Partner Access</Link>
          </div>
        </section>

        <section className="bg-[#f4f1e9] px-5 py-24 text-[#050605] lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {["Access is limited to approved relationships", "Deal status and resources will live here", "Partner tools will be added after approval"].map((item) => (
              <article key={item} className="border-t-4 border-[#d5ad62] bg-white p-7 shadow-xl shadow-black/5">
                <h2 className="text-xl font-black">{item}</h2>
                <p className="mt-4 text-sm leading-7 text-[#5e6962]">This area is being prepared for controlled partner workflows, document requests, and relationship-specific resources.</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
