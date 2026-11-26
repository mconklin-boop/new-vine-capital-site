import Link from "next/link";
import { JOTFORM_URL } from "./SiteHeader";
import { dealChecklist, fundingSteps } from "../lib/products";

export function Eyebrow({ children, tone = "gold" }) {
  return <p className={`text-xs font-black uppercase tracking-[0.18em] ${tone === "green" ? "text-[#1f5b3f]" : "text-[#d5ad62]"}`}>{children}</p>;
}

export function ProductCard({ product, detailed = false }) {
  return (
    <article id={product.id} className="flex scroll-mt-32 flex-col border border-white/10 bg-[#111613] p-7 transition hover:-translate-y-1 hover:border-[#d5ad62]/70">
      <span className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{product.kicker}</span>
      <h3 className="mt-5 text-xl font-black">{product.title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/65">{product.summary}</p>
      {detailed && (
        <>
          <p className="mt-4 text-sm leading-6 text-white/80"><strong className="text-white">Best for:</strong> {product.bestFor}</p>
          <ul className="mt-5 grid gap-2 border-t border-white/10 pt-5 text-sm text-white/70">
            {product.highlights.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#d5ad62]" />{item}</li>)}
          </ul>
        </>
      )}
      <div className="mt-auto pt-6">
        {product.href ? (
          <Link href={product.href} className="text-xs font-black uppercase tracking-wide text-[#d5ad62] hover:text-[#f0d99a]">{product.ctaLabel || "Learn more"} →</Link>
        ) : (
          <a href={JOTFORM_URL} target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-wide text-[#d5ad62] hover:text-[#f0d99a]">Submit this deal →</a>
        )}
      </div>
    </article>
  );
}

export function PageHero({ eyebrow, title, copy, children }) {
  return (
    <section className="nvc-page-bg px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl py-10">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-5xl font-serif text-4xl leading-tight md:text-7xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75 md:text-xl">{copy}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <a href={JOTFORM_URL} target="_blank" rel="noopener noreferrer" className="bg-[#d5ad62] px-7 py-4 text-center text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Submit a Deal</a>
          {children}
        </div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="bg-[#f4f1e9] px-5 py-20 text-[#050605] lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Eyebrow tone="green">How Funding Works</Eyebrow>
        <h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-5xl">From submission to funding in five steps.</h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {fundingSteps.map(([title, copy], index) => (
            <li key={title} className="border-t-4 border-[#d5ad62] bg-white p-6">
              <span className="font-black text-[#1f5b3f]">0{index + 1}</span>
              <h3 className="mt-5 text-lg font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5e6962]">{copy}</p>
            </li>
          ))}
        </ol>
        <Link href="/funding-process" className="mt-8 inline-flex text-xs font-black uppercase tracking-wide text-[#1f5b3f] hover:underline">Full process details →</Link>
      </div>
    </section>
  );
}

export function ChecklistSection() {
  return (
    <section className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1fr] lg:items-start">
        <div>
          <Eyebrow>What to Send</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">A complete submission gets the fastest answer.</h2>
          <p className="mt-5 text-lg leading-8 text-white/70">Send what you have. If something is missing we will tell you exactly what we need before terms go out.</p>
          <a href={JOTFORM_URL} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex bg-[#d5ad62] px-7 py-4 text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Submit a Deal</a>
        </div>
        <ul className="grid gap-px border border-white/10 bg-white/10">
          {dealChecklist.map((item) => <li key={item} className="flex gap-4 bg-[#0b0e0c] p-5 text-white/80"><span className="font-black text-[#d5ad62]">✓</span>{item}</li>)}
        </ul>
      </div>
    </section>
  );
}

export function CtaBand({ title = "Have a deal that needs capital?", copy = "Send it over. We review every submission and respond with a practical next step." }) {
  return (
    <section className="bg-[#123827] px-5 py-20 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-center">
        <div>
          <h2 className="font-serif text-4xl leading-tight md:text-5xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-white/70">{copy}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={JOTFORM_URL} target="_blank" rel="noopener noreferrer" className="bg-[#d5ad62] px-7 py-4 text-center text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Submit a Deal</a>
          <a href="tel:7208174277" className="border border-white/35 px-7 py-4 text-center text-sm font-black uppercase text-white transition hover:border-[#d5ad62]">Call 720-817-4277</a>
        </div>
      </div>
    </section>
  );
}
