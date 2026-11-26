import Head from "next/head";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { CtaBand, Eyebrow, PageHero, ProductCard } from "../components/ProductSections";
import { businessProducts } from "../lib/products";

const fit = [
  ["Business purpose", "Financing for operating businesses, not personal or household use."],
  ["Established operations", "Time in business, revenue and credit profile drive what is available."],
  ["Clear use of funds", "Equipment, working capital, fuel or growth, with a plan for repayment."],
];

export default function BusinessFinancing() {
  const products = businessProducts.map((product) => (
    product.href ? { ...product, ctaLabel: `Explore ${product.title}` } : { ...product, href: "#contact-section", ctaLabel: "Ask about this" }
  ));

  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <Head>
        <title>Business Financing | New Vine Capital</title>
        <meta name="description" content="Equipment financing, business lines of credit, fuel accounts and credit stacking for business owners, carriers and fleets." />
      </Head>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Business Financing"
          title="Capital to run, equip and grow your business."
          copy="Equipment, working capital, fuel accounts and unsecured credit for owners and operators, with direct communication from first call to funding."
        >
          <a href="tel:7208174277" className="border border-white/35 px-7 py-4 text-center text-sm font-black uppercase text-white transition hover:border-[#d5ad62]">Call 720-817-4277</a>
        </PageHero>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <Eyebrow>Programs</Eyebrow>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">Business programs.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {products.map((product) => <ProductCard key={product.id} product={product} detailed />)}
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0b0e0c] px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <Eyebrow>Good Fit</Eyebrow>
              <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">What we look for.</h2>
              <div className="mt-8 grid gap-4">
                {fit.map(([title, copy]) => <article key={title} className="border-l-4 border-[#d5ad62] bg-[#111613] p-5"><h3 className="font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{copy}</p></article>)}
              </div>
            </div>
            <aside id="contact-section" className="scroll-mt-32 self-start border border-[#d5ad62]/40 bg-[#111613] p-8">
              <Eyebrow>Talk to Us</Eyebrow>
              <h3 className="mt-4 text-2xl font-black">Tell us what you need the capital for.</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">Call or email with your business, time in business, approximate revenue and what the funds are for. We will tell you which program fits.</p>
              <div className="mt-6 grid gap-3 text-sm">
                <a href="tel:7208174277" className="font-black text-[#d5ad62] hover:text-[#f0d99a]">720-817-4277</a>
                <a href="mailto:deals@newvinecapital.com" className="font-black text-[#d5ad62] hover:text-[#f0d99a]">deals@newvinecapital.com</a>
              </div>
            </aside>
          </div>
        </section>

        <CtaBand title="Ready to talk business financing?" copy="Call or email and we will point you to the right program, or submit a real estate deal through our form." />
      </main>
      <SiteFooter />
    </div>
  );
}
