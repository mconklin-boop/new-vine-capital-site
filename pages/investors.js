import Head from "next/head";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { Eyebrow } from "../components/ProductSections";
import { siteLinks } from "../lib/siteLinks";

export default function Investors() {
  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <Head>
        <title>Capital Partners | New Vine Capital</title>
        <meta name="robots" content="noindex" />
      </Head>
      <SiteHeader />
      <main>
        <section className="nvc-page-bg px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl py-10">
            <Eyebrow>Capital Partners</Eyebrow>
            <h1 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">Capital partner relationships.</h1>
            <p className="mt-6 text-lg leading-8 text-white/75">New Vine Capital works with a limited number of capital partners on a relationship basis. We do not publish offering terms or opportunities on this website.</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href={siteLinks.investorPortal} className="bg-[#d5ad62] px-7 py-4 text-center text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Existing Investor Login</Link>
              <a href="mailto:mike@newvinecapital.com" className="border border-white/35 px-7 py-4 text-center text-sm font-black uppercase text-white transition hover:border-[#d5ad62]">Contact Us</a>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
          <p className="text-sm leading-7 text-white/55">Nothing on this website is an offer to sell or a solicitation of an offer to buy any security. Any investment opportunity is made only to eligible persons through definitive offering documents, after verification and suitability review, and in compliance with applicable law. All investments involve risk, including possible loss of principal.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
