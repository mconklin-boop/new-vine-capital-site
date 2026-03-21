import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function RealEstateFunding() {
  const fundingTypes = [
    {
      title: "DSCR Loans",
      description:
        "Debt Service Coverage Ratio loans designed for rental properties, allowing investors to qualify based on property income rather than personal income.",
    },
    {
      title: "Fix & Flip",
      description:
        "Short-term financing for acquiring and renovating properties, structured to support fast acquisitions and profitable resale execution.",
    },
    {
      title: "Bridge Loans",
      description:
        "Temporary financing solutions used to bridge the gap between acquisition and long-term financing or sale.",
    },
    {
      title: "EMD Funding",
      description:
        "Earnest Money Deposit funding solutions that allow investors to secure deals without tying up their own capital.",
    },
    {
      title: "Transactional Funding",
      description:
        "Same-day or short-term capital used for double closings, enabling investors to complete deals without using their own funds.",
      wide: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4ead2]">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,187,116,0.15),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(83,101,68,0.15),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[#8c6a2d]/40 bg-[#1b160d] px-4 py-2 text-sm text-[#d7bb74]">
              Real Estate Funding
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-tight text-[#f8f1de] md:text-6xl">
              Flexible capital solutions built for real estate investors and operators.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c5bea9]">
              New Vine Capital provides funding solutions for acquisitions,
              rental portfolios, bridge needs, earnest money, and double-close
              transactions.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">
            Funding Solutions
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de] md:text-4xl">
            Real estate capital built for investors and operators.
          </h2>
          <p className="mt-4 text-[#c5bea9]">
            Explore our core real estate funding solutions below. Hover over each
            card for a quick overview, then click Apply Now to submit your opportunity.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {fundingTypes.map((item) => (
            <div
              key={item.title}
              className={`group rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-6 transition hover:-translate-y-1 hover:bg-[#151510] ${
                item.wide ? "md:col-span-2 lg:col-span-4" : ""
              }`}
            >
              <h3 className="text-lg font-semibold text-[#f4ead2]">
                {item.title}
              </h3>

              <p className="mt-3 text-[#c5bea9] opacity-100 transition duration-300 md:opacity-0 md:group-hover:opacity-100">
                {item.description}
              </p>

              <Link
                href="/submit-deal"
                className="mt-6 inline-flex rounded-xl bg-[#d7bb74] px-4 py-3 text-sm font-semibold text-[#16120a] transition hover:bg-[#e5ca86]"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#8c6a2d]/15 bg-[#0a0a08]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#10100d] p-8">
              <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">
                Ideal For
              </div>
              <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de]">
                Built for active investors and dealmakers.
              </h2>
              <ul className="mt-6 space-y-4 text-[#c5bea9]">
                <li>Rental property investors</li>
                <li>Fix and flip operators</li>
                <li>Wholesalers and double-close transactions</li>
                <li>Borrowers needing bridge capital</li>
                <li>Investors securing time-sensitive opportunities</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#10100d] p-8">
              <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">
                What to Expect
              </div>
              <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de]">
                Clear process. Direct communication.
              </h2>
              <ul className="mt-6 space-y-4 text-[#c5bea9]">
                <li>Responsive initial review</li>
                <li>Practical evaluation of the opportunity</li>
                <li>Flexible structure based on the transaction</li>
                <li>Straightforward next steps</li>
                <li>Efficient execution when the deal aligns</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#10100d] p-8 text-center shadow-2xl shadow-black/20">
          <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">
            Next Step
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de]">
            Ready to submit your deal?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#c5bea9]">
            Present your opportunity for review and let New Vine Capital evaluate
            the structure, timing, and fit for funding.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/submit-deal"
              className="rounded-2xl bg-[#d7bb74] px-8 py-4 text-sm font-semibold text-[#16120a] transition hover:bg-[#e5ca86]"
            >
              Submit a Deal
            </Link>
            <Link
              href="/business-financing"
              className="rounded-2xl border border-[#8c6a2d]/35 bg-[#0f120d]/80 px-8 py-4 text-sm font-semibold text-[#f4ead2] transition hover:bg-[#172015]"
            >
              View Business Financing
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
