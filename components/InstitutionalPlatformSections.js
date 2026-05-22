import { opportunityReviewSteps, platformMetricCards, platformMetrics, platformMilestones, whyNewVine } from "../lib/platformData";

function Eyebrow({ children, tone = "gold" }) {
  return <p className={`text-xs font-black uppercase tracking-[0.18em] ${tone === "green" ? "text-[#1f5b3f]" : "text-[#d5ad62]"}`}>{children}</p>;
}

export function WhyNewVineSection({ compact = false }) {
  return (
    <section className="bg-[#050605] px-5 py-24 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-end">
          <div>
            <Eyebrow>Why New Vine Capital</Eyebrow>
            <h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-6xl">Why New Vine Capital</h2>
          </div>
          <p className="text-lg leading-8 text-white/65">
            New Vine Capital was built to provide qualified investors with access to private real estate credit opportunities through a disciplined, process-driven approach focused on transparency, structure, and operational execution.
          </p>
        </div>

        <div className={`mt-12 grid gap-4 ${compact ? "lg:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3"}`}>
          {whyNewVine.map((item) => (
            <article key={item.title} className="nvc-reveal group min-h-[245px] border border-white/10 bg-[#111613] p-6 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-[#d5ad62]/60 hover:bg-[#152018]">
              <div className="flex h-11 w-11 items-center justify-center border border-[#d5ad62]/50 bg-[#d5ad62]/10 text-xs font-black text-[#d5ad62] transition group-hover:bg-[#d5ad62] group-hover:text-[#11100b]">{item.icon}</div>
              <h3 className="mt-7 text-xl font-black leading-tight text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/62">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 border-l-4 border-[#d5ad62] bg-[#123827] p-6 md:p-8">
          <Eyebrow>Built for Long-Term Platform Growth</Eyebrow>
          <p className="mt-4 max-w-5xl text-xl leading-8 text-white/78">
            Our objective is to build a scalable private capital ecosystem focused on disciplined growth, operational transparency, and long-term investor relationships.
          </p>
        </div>
      </div>
    </section>
  );
}

export function PlatformActivitySection() {
  return (
    <section className="bg-[#0b0f0c] px-5 py-24 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <Eyebrow>Platform Activity</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">Platform Activity</h2>
          <p className="mt-5 text-lg leading-8 text-white/65">Historical platform activity across New Vine Capital investment strategies and capital relationships.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {platformMetricCards.map(([label, key], index) => (
            <article key={key} className="nvc-reveal border border-white/10 bg-[#111613] p-5 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-[#d5ad62]/60" style={{ animationDelay: `${index * 50}ms` }}>
              <p className="min-h-[34px] text-[10px] font-black uppercase tracking-[0.14em] text-[#d5ad62]">{label}</p>
              <h3 className="mt-4 text-2xl font-black leading-tight text-white lg:text-xl xl:text-2xl">{platformMetrics[key]}</h3>
            </article>
          ))}
        </div>
        <p className="mt-4 max-w-5xl border-l-2 border-[#d5ad62]/70 bg-white/[0.025] px-3 py-2 text-[11px] leading-5 text-white/45">
          Historical platform activity is informational only and does not guarantee future results. Investment opportunities are subject to qualification, suitability review, allocation availability, and offering documents.
        </p>
      </div>
    </section>
  );
}

export function PlatformMilestonesSection() {
  return (
    <section className="bg-[#f4f1e9] px-5 py-24 text-[#050605] lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1fr]">
        <div>
          <Eyebrow tone="green">Platform Milestones</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">Platform Milestones</h2>
          <p className="mt-5 text-lg leading-8 text-[#53615a]">Operational milestones shown for informational context as the New Vine Capital platform develops.</p>
        </div>
        <div className="relative grid gap-4 before:absolute before:left-5 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-[#d5ad62]/50">
          {platformMilestones.map((item) => (
            <article key={item.title} className="relative grid gap-4 pl-14 sm:grid-cols-[140px_1fr]">
              <span className="absolute left-2 top-1 h-6 w-6 border-4 border-[#f4f1e9] bg-[#d5ad62] shadow-sm shadow-black/20" />
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[#1f5b3f]">{item.date}</p>
              <div className="border border-black/10 bg-white p-5 shadow-xl shadow-black/5">
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#53615a]">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OpportunityReviewSection() {
  return (
    <section className="bg-[#123827] px-5 py-24 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-end">
          <div>
            <Eyebrow>How Opportunities Are Reviewed</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">How Opportunities Are Reviewed</h2>
          </div>
          <p className="text-lg leading-8 text-white/65">A disciplined review framework supports consistency across borrower, collateral, structure, and investor-facing distribution decisions.</p>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {opportunityReviewSteps.map((step, index) => (
            <article key={step} className="border border-white/10 bg-white/[0.055] p-5 transition hover:border-[#d5ad62]/70 hover:bg-white/[0.08]">
              <span className="text-xs font-black text-[#d5ad62]">0{index + 1}</span>
              <h3 className="mt-5 text-base font-black leading-tight">{step}</h3>
            </article>
          ))}
        </div>
        <p className="mt-5 text-xs leading-6 text-white/45">Review processes may vary by opportunity and do not eliminate investment risk.</p>
      </div>
    </section>
  );
}

export default function InstitutionalPlatformSections({ includeWhy = true, includePlatform = true, includeTimeline = true, includeReview = true }) {
  return (
    <>
      {includeWhy && <WhyNewVineSection />}
      {includePlatform && <PlatformActivitySection />}
      {includeTimeline && <PlatformMilestonesSection />}
      {includeReview && <OpportunityReviewSection />}
    </>
  );
}
