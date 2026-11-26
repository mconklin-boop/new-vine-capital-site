import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import SiteHeader, { JOTFORM_URL } from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { ChecklistSection, CtaBand, Eyebrow, ProcessSection, ProductCard } from "../components/ProductSections";
import { businessProducts, realEstateProducts } from "../lib/products";

const audiences = [
  ["Real estate investors", "Rental, flip, bridge and gap capital for investment properties."],
  ["Wholesalers", "EMD and transactional funding to lock up and close contracts."],
  ["Brokers", "Bring us the deals that do not fit a bank box. We keep you in the loop through closing."],
  ["Business owners", "Equipment, working capital, fuel accounts and unsecured credit."],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050605] text-[#fffdf7]">
      <Head>
        <title>New Vine Capital | Private Real Estate & Business Financing</title>
        <meta name="description" content="DSCR, fix and flip, bridge, gap, transactional and EMD financing for real estate investors, plus equipment, working capital and fuel financing for business owners." />
      </Head>
      <SiteHeader />

      <main>
        <section className="nvc-hero-bg relative overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1fr_400px] lg:items-end">
            <div className="max-w-4xl">
              <Image src="/logo.png" alt="New Vine Capital" width={200} height={200} className="mb-8 h-32 w-32 object-contain drop-shadow-2xl md:h-44 md:w-44" priority />
              <Eyebrow>Private Lending for Investors & Operators</Eyebrow>
              <h1 className="mt-5 max-w-5xl font-serif text-5xl leading-none text-white md:text-7xl">Capital for the deals banks won&apos;t touch.</h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">DSCR, fix and flip, bridge, gap and transactional financing for real estate investors, plus equipment and working capital for business owners. Underwritten on the asset and the exit, not a rigid checklist.</p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a href={JOTFORM_URL} className="bg-[#d5ad62] px-7 py-4 text-center text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Submit a Deal</a>
                <Link href="/real-estate-funding" className="border border-white/35 px-7 py-4 text-center text-sm font-black uppercase text-white transition hover:border-[#d5ad62]">View Loan Programs</Link>
              </div>
            </div>

            <aside className="border border-white/15 bg-[#111613]/90 p-7 shadow-2xl shadow-black/30">
              <Eyebrow>How we work</Eyebrow>
              <dl className="mt-5 grid gap-4 text-sm">
                <div className="flex justify-between gap-6 border-b border-white/10 pb-4"><dt className="text-white/55">Underwriting</dt><dd className="text-right font-black">Asset and exit based</dd></div>
                <div className="flex justify-between gap-6 border-b border-white/10 pb-4"><dt className="text-white/55">Decisions</dt><dd className="text-right font-black">Direct, in-house review</dd></div>
                <div className="flex justify-between gap-6 border-b border-white/10 pb-4"><dt className="text-white/55">Approvals</dt><dd className="text-right font-black">Weekly Friday review</dd></div>
                <div className="flex justify-between gap-6"><dt className="text-white/55">Loan purpose</dt><dd className="text-right font-black">Business purpose only</dd></div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Eyebrow>Real Estate Financing</Eyebrow>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">Seven ways to fund an investment property.</h2>
            </div>
            <Link href="/real-estate-funding" className="text-xs font-black uppercase tracking-wide text-[#d5ad62] hover:text-[#f0d99a]">All real estate programs →</Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {realEstateProducts.map((product) => <ProductCard key={product.id} product={{ ...product, href: `/real-estate-funding#${product.id}` }} />)}
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0b0e0c] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <Eyebrow>Business Financing</Eyebrow>
                <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">Capital to run and grow the business.</h2>
              </div>
              <Link href="/business-financing" className="text-xs font-black uppercase tracking-wide text-[#d5ad62] hover:text-[#f0d99a]">All business programs →</Link>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {businessProducts.map((product) => <ProductCard key={product.id} product={{ ...product, href: product.href || `/business-financing#${product.id}` }} />)}
            </div>
          </div>
        </section>

        <ProcessSection />

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <Eyebrow>Who We Work With</Eyebrow>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">Built for people who close deals.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {audiences.map(([title, copy]) => <article key={title} className="border-l-4 border-[#d5ad62] bg-[#111613] p-6"><h3 className="text-lg font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-white/65">{copy}</p></article>)}
          </div>
        </section>

        <ChecklistSection />
        <CtaBand />
      </main>

      <a href={JOTFORM_URL} className="fixed bottom-4 right-4 z-40 bg-[#d5ad62] px-5 py-4 text-xs font-black uppercase text-[#11100b] shadow-2xl shadow-black/40 md:right-6">Submit Deal</a>
      <SiteFooter />
    </div>
  );
}
