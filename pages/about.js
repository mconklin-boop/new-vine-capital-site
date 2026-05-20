import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function About() {
  const values = [
    ["Speed with discipline", "We move quickly, but every approval still depends on collateral quality, diligence, and a credible exit."],
    ["Relationship first", "Borrowers, brokers, and capital partners get direct communication and transparent expectations."],
    ["Creative structure", "We look for practical ways to make strong deals work when banks or conventional lenders cannot."],
  ];

  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <SiteHeader />
      <main>
        <section className="nvc-page-bg px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl py-12"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">About New Vine</p><h1 className="mt-5 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">Private lending built around structure, speed, and relationships.</h1><p className="mt-6 max-w-3xl text-xl leading-8 text-white/75">We are a private lending and investment firm specializing in creative finance and asset-based lending for real estate transactions nationwide.</p></div></section>
        <section className="grid gap-10 bg-white px-5 py-24 text-[#050605] lg:grid-cols-[0.8fr_1fr] lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:contents"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#1f5b3f]">Mission</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">Make difficult capital situations clear, fundable, and executable.</h2></div><div className="text-lg leading-8 text-[#53615a]"><p>New Vine Capital focuses on borrowers and deal partners who need more than a generic lending box. We evaluate collateral, timeline, business plan, borrower experience, exit strategy, and transaction context to shape practical financing solutions.</p><p className="mt-5">Our philosophy is simple: strong relationships and direct communication create better lending outcomes than rigid guidelines alone.</p></div></div></section>
        <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Values</p><h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-6xl">How we evaluate every opportunity.</h2><div className="mt-12 grid gap-5 md:grid-cols-3">{values.map(([title, copy]) => <article key={title} className="border border-white/10 bg-[#111613] p-7"><h3 className="text-xl font-black">{title}</h3><p className="mt-4 text-white/60">{copy}</p></article>)}</div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
