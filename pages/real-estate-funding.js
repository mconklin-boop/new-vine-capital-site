import Head from "next/head";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { ChecklistSection, CtaBand, Eyebrow, PageHero, ProcessSection, ProductCard } from "../components/ProductSections";
import { realEstateProducts } from "../lib/products";

const underwriting = [
  ["Collateral", "Property type, condition, location and current or after-repair value."],
  ["Leverage", "Total loan against value and purchase price, including any senior debt."],
  ["Exit", "A credible path to repayment through sale, refinance or cash flow."],
  ["Sponsor", "Entity, experience and track record with similar projects."],
];

export default function RealEstateFunding() {
  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <Head>
        <title>Real Estate Loan Programs | New Vine Capital</title>
        <meta name="description" content="DSCR rental loans, fix and flip, bridge, gap and second-position, transactional funding, EMD financing and select first-position loans for real estate investors." />
      </Head>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Real Estate Financing"
          title="Loan programs for real estate investors."
          copy="From a single rental to a same-day double close, we structure private capital around the property and the exit. Investment properties only."
        />

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <Eyebrow>Programs</Eyebrow>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">Pick the structure that fits the deal.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {realEstateProducts.map((product) => <ProductCard key={product.id} product={product} detailed />)}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-6 text-white/50">Not sure which program fits? Submit the deal and we will recommend a structure. All terms are preliminary until underwriting is complete.</p>
        </section>

        <section className="border-y border-white/10 bg-[#0b0e0c] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Eyebrow>How We Underwrite</Eyebrow>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">Four things decide every loan.</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {underwriting.map(([title, copy]) => <article key={title} className="border-t-4 border-[#d5ad62] bg-[#111613] p-6"><h3 className="text-lg font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-white/65">{copy}</p></article>)}
            </div>
            <p className="mt-8 max-w-3xl text-sm leading-6 text-white/55">Valuation depends on the property: an income-based valuation report where there is verifiable rental history, or a full appraisal. Any credit report or valuation fee is disclosed before it is collected.</p>
          </div>
        </section>

        <ProcessSection />
        <ChecklistSection />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
