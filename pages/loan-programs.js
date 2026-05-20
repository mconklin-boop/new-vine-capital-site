import SiteHeader, { JOTFORM_URL } from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const loans = [
  ["DSCR Loans", "Rental investor financing", "Debt-service coverage financing for residential rental properties where income profile matters more than conventional borrower income guidelines.", "Rental investors and portfolio operators", "Purchase, refinance, cash-out, or portfolio growth capital"],
  ["Fix & Flip Loans", "Acquisition and rehab capital", "Short-term funding for investors buying discounted or value-add properties with a clear renovation and resale strategy.", "Fix-and-flip operators and repeat investors", "Purchase funding with rehab reserve and interest-only payments"],
  ["Bridge Loans", "Speed for transitional assets", "Flexible short-term capital when a property needs time, repositioning, lease-up, sale, refinance, or another defined exit.", "Investors, sponsors, business owners, and developers", "Interest-only bridge debt secured by real estate collateral"],
  ["Transactional Funding", "Same-day and short-hold capital", "Capital for wholesale closings, double closes, and back-to-back transactions with a documented exit buyer.", "Wholesalers and acquisition teams", "Very short-term funding tied to confirmed resale proceeds"],
  ["Gap / Second Position", "Creative capital stack support", "Supplemental capital for shortfalls, time-sensitive closings, or strong collateral positions requiring added liquidity.", "Experienced investors with clear exits", "Gap loan, second-position note, or structured participation"],
  ["Construction Loans", "Build and completion capital", "Private construction and completion funding for developers and builders with credible budgets, timelines, and takeout plans.", "Developers and builders", "Draw-based funding secured by project collateral"],
  ["Portfolio Loans", "Capital across multiple assets", "Financing for investors consolidating, refinancing, or scaling income-producing real estate assets.", "Rental portfolio owners and operators", "Cross-collateralized or asset-level portfolio debt"],
  ["EMD Funding", "Earnest money support", "Capital support for qualified investors who need to move decisively on competitive acquisitions.", "Investors pursuing contracted acquisitions", "Short-term capital tied to a defined purchase strategy"],
  ["Appraisal Funding", "Diligence capital", "Funding support for appraisal and transaction diligence costs when a strong deal needs momentum.", "Brokers, borrowers, and investors with active closings", "Short-duration funding tied to transaction completion"],
];

export default function LoanPrograms() {
  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <SiteHeader />
      <main>
        <section className="nvc-page-bg px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl py-12">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Lending Programs</p>
            <h1 className="mt-5 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">Flexible private capital for complex real estate transactions.</h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-white/75">Asset-based lending solutions for investors, developers, wholesalers, brokers, and business owners.</p>
          </div>
        </section>
        <section className="bg-[#f4f1e9] px-5 py-20 text-[#050605] lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5">
            {loans.map(([kicker, title, copy, borrower, structure]) => (
              <article key={kicker} className="grid gap-6 border-l-4 border-[#d5ad62] bg-white p-7 lg:grid-cols-[0.7fr_1fr_auto] lg:items-center">
                <div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#1f5b3f]">{kicker}</p><h2 className="mt-3 font-serif text-3xl leading-tight">{title}</h2></div>
                <div><p className="text-[#5e6962]">{copy}</p><dl className="mt-5 grid gap-4 md:grid-cols-2"><div><dt className="text-xs font-black uppercase text-[#1f5b3f]">Ideal borrower</dt><dd className="mt-1">{borrower}</dd></div><div><dt className="text-xs font-black uppercase text-[#1f5b3f]">Typical structure</dt><dd className="mt-1">{structure}</dd></div></dl></div>
                <a href={JOTFORM_URL} target="_blank" rel="noopener noreferrer" className="bg-[#d5ad62] px-6 py-4 text-center text-xs font-black uppercase text-[#11100b]">Apply</a>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
