import Link from "next/link";
import { currency, fundedPercent } from "../lib/investorPortalMockData";

function displayMetricValue(value) {
  if (typeof value !== "string") return value;
  const match = value.match(/^\$([\d,]+)$/);
  if (!match) return value;

  const amount = Number(match[1].replace(/,/g, ""));
  if (amount >= 1000000 && amount % 1000000 === 0) return `$${amount / 1000000}M`;
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  return value;
}

function isFundOpportunity(deal) {
  return deal?.investmentType === "Fund";
}

export function StatCard({ label, value, detail, compact = false }) {
  return <article className={`border border-white/10 bg-[#111613] shadow-xl shadow-black/10 ${compact ? "p-4" : "p-6"}`}><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#d5ad62]">{label}</p><h3 className={`${compact ? "mt-2 text-xl" : "mt-4 text-2xl md:text-3xl"} font-black leading-tight text-white`}>{value}</h3>{detail && <p className="mt-2 text-xs leading-5 text-white/55">{detail}</p>}</article>;
}

export function Panel({ eyebrow, title, children, className = "" }) {
  return <section className={`border border-white/10 bg-[#111613] p-6 md:p-7 ${className}`}><p className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{eyebrow}</p><h3 className="mt-3 text-2xl font-black text-white">{title}</h3><div className="mt-5 text-white/65">{children}</div></section>;
}

export function ProgressBar({ value, thick = false }) {
  return <div className={`${thick ? "h-4" : "h-3"} overflow-hidden bg-white/10`}><div className="h-full bg-[#d5ad62]" style={{ width: `${value}%` }} /></div>;
}

export function StatusPill({ status }) {
  const color = status === "Open" ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : status === "Closing Soon" ? "border-[#d5ad62]/50 bg-[#d5ad62]/10 text-[#f0d99a]" : status === "Pending Review" ? "border-sky-300/40 bg-sky-300/10 text-sky-200" : "border-white/20 bg-white/10 text-white/65";
  return <span className={`inline-flex border px-3 py-1 text-[11px] font-black uppercase tracking-wide ${color}`}>{status}</span>;
}

function OpportunityVisual({ type = "capital-stack", compact = false }) {
  const bars = type === "lending-diagram" ? ["w-3/4", "w-1/2", "w-2/3"] : ["w-full", "w-3/4", "w-1/2"];
  return (
    <div className={`relative overflow-hidden border border-white/10 bg-[#0b120f] p-4 ${compact ? "min-h-[92px]" : "min-h-[132px]"}`}>
      <div className="absolute right-3 top-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#d5ad62]/70">Private Credit</div>
      <div className={`${compact ? "mt-8" : "mt-9"} grid gap-3`}>
        {bars.map((bar, index) => <div key={bar} className={`${bar} h-4 border border-[#d5ad62]/25 bg-[#d5ad62]/[0.12]`}><div className="h-full bg-[#d5ad62]/25" style={{ width: `${88 - index * 18}%` }} /></div>)}
      </div>
      {!compact && <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2"><span className="h-8 border border-white/10 bg-white/[0.04]" /><span className="h-10 border border-white/10 bg-white/[0.06]" /><span className="h-6 self-end border border-white/10 bg-white/[0.04]" /></div>}
    </div>
  );
}

export function DealCard({ deal, compact = false }) {
  const percent = fundedPercent(deal);
  const isFund = isFundOpportunity(deal);
  const viewLabel = isFund ? "View Fund" : "View Opportunity";
  const strategyLabel = isFund ? "What this fund does" : "Opportunity strategy";

  if (compact) {
    return (
      <article className="border border-white/10 bg-[#111613] p-4 shadow-xl shadow-black/10 md:p-5">
        <div className="grid gap-4 lg:grid-cols-[150px_1fr]">
          <OpportunityVisual type={deal.visualType} compact />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><StatusPill status={deal.status} /><span className="text-xs font-black uppercase tracking-[0.14em] text-[#d5ad62]">{deal.investmentType}</span></div>
            <h3 className="mt-3 text-xl font-black leading-tight text-white md:text-2xl">{deal.name}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/80">{deal.summary}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <Metric label="Target" value={deal.targetReturn} dense />
              <Metric label="Minimum" value={currency(deal.minimumInvestment)} dense />
              <Metric label="Raise" value={currency(deal.totalRaise)} dense />
              <Metric label="Term" value={deal.term} dense />
            </div>
            <div className="mt-4"><div className="mb-2 flex flex-wrap justify-between gap-2 text-xs font-bold uppercase text-white/65"><span>{currency(deal.amountFunded)} / {currency(deal.totalRaise)} funded</span><span>{percent}%</span></div><ProgressBar value={percent} thick /></div>
          </div>
        </div>
        <Link href={`/investor/deals/${deal.id}`} className="mt-5 block w-full bg-[#d5ad62] px-6 py-4 text-center text-xs font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">{viewLabel}</Link>
      </article>
    );
  }

  return (
    <article className="grid gap-5 border border-white/10 bg-[#111613] p-4 shadow-xl shadow-black/10 md:p-6 xl:grid-cols-[220px_1fr_auto]">
      <OpportunityVisual type={deal.visualType} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3"><StatusPill status={deal.status} /><span className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{deal.investmentType}</span><span className="text-xs font-bold uppercase tracking-wide text-white/55">Private investor access</span></div>
        <h3 className="mt-4 text-2xl font-black leading-tight text-white">{deal.name}</h3>
        <p className="mt-2 text-sm text-white/65">{deal.location} / Allocation subject to availability</p>
        <p className="mt-4 max-w-4xl leading-7 text-white/78">{deal.summary}</p>
        {deal.strategyDescription && <div className="mt-4 max-w-4xl border-l-4 border-[#d5ad62] bg-white/[0.07] p-4"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{strategyLabel}</p><p className="mt-2 text-sm leading-6 text-white/78">{deal.strategyDescription}</p></div>}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-6">
          <Metric label="Target Return" value={deal.targetReturn} />
          <Metric label="Minimum" value={currency(deal.minimumInvestment)} />
          <Metric label="Duration" value={deal.term} />
          <Metric label="Total Raise" value={currency(deal.totalRaise)} />
          <Metric label="Funded" value={currency(deal.amountFunded)} />
          <Metric label="Distributions" value={deal.distributionFrequency || "Subject to docs"} />
        </div>
        <div className="mt-5"><div className="mb-2 flex flex-wrap justify-between gap-2 text-xs font-bold uppercase text-white/65"><span>{currency(deal.amountFunded)} / {currency(deal.totalRaise)} funded</span><span>{percent}%</span></div><ProgressBar value={percent} thick /></div>
      </div>
      <div className="flex items-end"><Link href={`/investor/deals/${deal.id}`} className="w-full bg-[#d5ad62] px-6 py-4 text-center text-xs font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a] xl:w-auto">{viewLabel}</Link></div>
    </article>
  );
}

export function Metric({ label, value, dense = false }) {
  const displayValue = displayMetricValue(value);
  const isCompactMoney = typeof displayValue === "string" && /^\$\d+(\.\d)?M$/.test(displayValue);

  return (
    <div className={`${dense ? "min-h-[76px] p-3" : "min-h-[96px] p-3 md:p-4"} min-w-0 border border-white/10 bg-white/[0.055] shadow-inner shadow-white/[0.02]`}>
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55">{label}</p>
      <p className={`${isCompactMoney ? (dense ? "text-2xl" : "text-3xl") : dense ? "text-sm md:text-base" : "text-base md:text-lg"} mt-2 whitespace-normal font-black leading-tight text-white tabular-nums`}>{displayValue}</p>
      {isCompactMoney && !dense && <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-white/45">{value}</p>}
    </div>
  );
}

export function DocumentAlertCard({ doc, opportunity }) {
  return (
    <article className="grid gap-4 border border-white/10 bg-white/[0.04] p-4 transition hover:border-[#d5ad62]/60 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <div className="flex flex-wrap gap-2"><span className="text-[10px] font-black uppercase tracking-wide text-[#d5ad62]">{doc.status || "Needs Review"}</span><span className="text-[10px] font-bold uppercase tracking-wide text-white/45">{doc.type}</span></div>
        <h4 className="mt-2 font-black text-white">{doc.name}</h4>
        <p className="mt-1 text-sm text-white/60">{opportunity || "General Investor Documents"}</p>
      </div>
      <a href={`/api/portal/documents/${doc.id}`} target="_blank" rel="noreferrer" className="border border-[#d5ad62]/60 px-4 py-3 text-center text-xs font-black uppercase text-[#d5ad62] hover:bg-[#d5ad62] hover:text-[#11100b]">Review Document</a>
    </article>
  );
}

export function MockDownloadButton({ children = "Download" }) {
  return <button type="button" className="border border-[#d5ad62]/60 px-4 py-3 text-xs font-black uppercase text-[#d5ad62] hover:bg-[#d5ad62] hover:text-[#11100b]">{children}</button>;
}
