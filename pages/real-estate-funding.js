import Image from "next/image";
import Link from "next/link";

export default function RealEstateFunding() {
  const products = [
    {
      title: "DSCR Loans",
      description:
        "Long-term rental financing based on property cash flow rather than personal income, ideal for investors building or scaling rental portfolios.",
    },
    {
      title: "Fix & Flip Financing",
      description:
        "Short-term funding for acquisition and renovation projects with fast closings and flexible structuring for value-add opportunities.",
    },
    {
      title: "Bridge Loans",
      description:
        "Temporary financing solutions designed to bridge timing gaps between acquisition, refinance, stabilization, or sale.",
    },
    {
      title: "EMD Funding",
      description:
        "Earnest money deposit funding to help secure contracts and position investors competitively in time-sensitive transactions.",
    },
    {
      title: "Transactional Funding",
      description:
        "Short-term same-day funding for wholesalers and investors completing double-close transactions.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4ead2]">
      <header className="border-b border-[#8c6a2d]/25 bg-[#050505]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="New Vine Capital logo"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
            <div>
              <div className="text-xl font-semibold tracking-[0.18em] text-[#d7bb74]">
                NEW VINE CAPITAL
              </div>
              <div className="text-xs uppercase tracking-[0.35em] text-[#9ba082]">
                Private Lending • Strategic Capital
              </div>
            </div>
          </Link>

          <div className="hidden gap-8 text-sm text-[#d8cfb6] md:flex">
            <Link href="/" className="transition hover:text-[#d7bb74]">
              Home
            </Link>
            <Link
              href="/business-financing"
              className="transition hover:text-[#d7bb74]"
            >
              Business Financing
            </Link>
            <Link
              href="/submit-deal"
              className="transition hover:text-[#d7bb74]"
            >
              Submit Deal
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,187,116,0.15),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(83,101,68,0.15),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[#8c6a2d]/40 bg-[#1b160d] px-4 py-2 text-sm text-[#d7bb74]">
              Real Estate Funding Solutions
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-tight text-[#f8f1de] md:text-6xl">
              Funding solutions built for real estate investors and operators.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c5bea9]">
              New Vine Capital provides flexible capital for investors,
              wholesalers, and operators who need speed, structure, and direct
              communication to move opportunities forward.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/submit-deal"
                className="rounded-2xl bg-[#d7bb74] px-6 py-4 text-center text-sm font-semibold text-[#16120a] shadow-lg shadow-[#d7bb74]/20 transition hover:-translate-y-0.5 hover:bg-[#e5ca86]"
              >
                Submit a Deal
              </Link>
              <a
                href="tel:7208174277"
                className="rounded-2xl border border-[#8c6a2d]/35 bg-[#0f120d]/80 px-6 py-4 text-center text-sm font-semibold text-[#f4ead2] transition hover:bg-[#172015]"
              >
                Call 720-817-4277
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">
            Loan Products
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de] md:text-4xl">
            Specialized funding for a range of real estate strategies.
          </h2>
          <p className="mt-4 text-[#c5bea9]">
            We focus on practical capital solutions that support acquisition,
            stabilization, renovation, and investor execution.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.title}
              className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-6 transition hover:bg-[#151510]"
            >
              <h3 className="text-xl font-semibold text-[#f4ead2]">
                {product.title}
              </h3>
              <p className="mt-3 leading-7 text-[#c5bea9]">
                {product.description}
              </p>
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

      <footer className="border-t border-[#8c6a2d]/15 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="New Vine Capital logo"
                width={42}
                height={42}
                className="h-10 w-10 object-contain"
              />
              <div>
                <div className="text-sm font-semibold tracking-[0.18em] text-[#d7bb74]">
                  NEW VINE CAPITAL
                </div>
                <div className="text-xs text-[#9f9a89]">
                  Private Lending • Strategic Capital
                </div>
              </div>
            </div>

            <div className="text-sm text-[#9f9a89]">
              deals@newvinecapital.com • 720-817-4277 • 1500 N Grant St #7339
              Denver, CO 80203
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
