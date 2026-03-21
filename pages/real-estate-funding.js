import Image from "next/image";
import Link from "next/link";

export default function RealEstateFunding() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f4ead2]">
      <header className="border-b border-[#8c6a2d]/25 bg-[#050505]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-4">
            <Image src="/logo.png" alt="logo" width={56} height={56} />
            <div className="text-[#d7bb74] font-semibold">
              NEW VINE CAPITAL
            </div>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-semibold text-[#f8f1de]">
          Real Estate Funding
        </h1>

        <p className="mt-4 max-w-2xl text-[#c5bea9]">
          Flexible capital solutions for acquisitions, refinance scenarios,
          bridge financing, and investment opportunities.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-6">
            <h2 className="text-xl font-semibold text-[#f4ead2]">
              Submit a Deal
            </h2>

            <p className="mt-3 text-[#c5bea9]">
              Present your opportunity for review and potential funding.
            </p>

            <Link
              href="/submit-deal"
              className="mt-6 inline-flex rounded-2xl bg-[#d7bb74] px-6 py-4 text-[#16120a]"
            >
              Submit Deal
            </Link>
          </div>

          <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-6">
            <h2 className="text-xl font-semibold text-[#f4ead2]">
              Types of Deals
            </h2>

            <ul className="mt-4 space-y-3 text-[#c5bea9]">
              <li>Fix & Flip</li>
              <li>Rental Acquisitions</li>
              <li>Bridge Loans</li>
              <li>Refinance</li>
              <li>Value-Add Projects</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
