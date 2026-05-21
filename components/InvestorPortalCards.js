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

export function StatCard({ label, value, detail }) {
  return <article className="border border-white/10 bg-[#111613] p-6 shadow-xl shadow-black/10"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{label}</p><h3 className="mt-4 text-2xl font-black text-white md:text-3xl">{value}</h3>{detail && <p className="mt-3 text-sm leading-6 text-white/55">{detail}</p>}</article>;
}

export function Panel({ eyebrow, title, children, className = "" }) {
  return <section className={`border border-white/10 bg-[#111613] p-6 md:p-7 ${className}`}><p className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{eyebrow}</p><h3 className="mt-3 text-2xl font-black text-white">{title}</h3><div className="mt-5 text-white/65">{children}</div></section>;
}

export function ProgressBar({ value }) {
  return <div className="h-3 overflow-hidden bg-white/10"><div className="h-full bg-[#d5ad62]" style={{ width: `${value}%` }} /></div>;
}

export function StatusPill({ status }) {
  const color = status === "Open" ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : status === "Closing Soon" ? "border-[#d5ad62]/50 bg-[#d5ad62]/10 text-[#f0d99a]" : "border-white/20 bg-white/10 text-white/65";
  return <span className={`inline-flex border px-3 py-1 text-[11px] font-black uppercase tracking-wide ${color}`}>{status}</span>;
}

export function DealCard({ deal }) {
  const percent = fundedPercent(deal);
  return (
    <article className="grid gap-6 border border-white/10 bg-[#111613] p-6 shadow-xl shadow-black/10 lg:grid-cols-[1fr_auto]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3"><StatusPill status={deal.status} /><span className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{deal.investmentType}</span></div>
        <h3 className="mt-4 text-2xl font-black text-white">{deal.name}</h3>
        <p className="mt-2 text-sm text-white/55">{deal.location}</p>
        <p className="mt-4 max-w-3xl leading-7 text-white/65">{deal.summary}</p>
        {deal.strategyDescription && <div className="mt-4 max-w-3xl border-l-4 border-[#d5ad62] bg-white/5 p-4"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">What this fund does</p><p className="mt-2 text-sm leading-6 text-white/65">{deal.strategyDescription}</p></div>}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          <Metric label="Target Return" value={deal.targetReturn} />
          <Metric label="Minimum" value={currency(deal.minimumInvestment)} />
          <Metric label="Total Raise" value={currency(deal.totalRaise)} />
          <Metric label="Funded" value={currency(deal.amountFunded)} />
        </div>
        <div className="mt-5"><div className="mb-2 flex justify-between text-xs font-bold uppercase text-white/50"><span>Funding Progress</span><span>{percent}%</span></div><ProgressBar value={percent} /></div>
      </div>
      <div className="flex items-end"><Link href={`/investor/deals/${deal.id}`} className="w-full bg-[#d5ad62] px-6 py-4 text-center text-xs font-black uppercase text-[#11100b] lg:w-auto">View Deal Room</Link></div>
    </article>
  );
}

export function Metric({ label, value }) {
  const displayValue = displayMetricValue(value);
  const isCompactMoney = typeof displayValue === "string" && /^\$\d+(\.\d)?M$/.test(displayValue);

  return (
    <div className="min-h-[104px] min-w-0 border border-white/10 bg-white/[0.04] p-4 shadow-inner shadow-white/[0.02]">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/45">{label}</p>
      <p className={`${isCompactMoney ? "text-3xl md:text-4xl" : "text-lg md:text-xl"} mt-3 whitespace-normal font-black leading-none text-white tabular-nums`}>{displayValue}</p>
      {isCompactMoney && <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-white/40">{value}</p>}
    </div>
  );
}

export function MockDownloadButton({ children = "Download" }) {
  return <button type="button" className="border border-[#d5ad62]/60 px-4 py-3 text-xs font-black uppercase text-[#d5ad62] hover:bg-[#d5ad62] hover:text-[#11100b]">{children}</button>;
}
