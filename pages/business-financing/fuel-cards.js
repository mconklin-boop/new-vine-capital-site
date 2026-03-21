import Image from "next/image";
import Link from "next/link";

export default function FuelCards() {
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

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-4xl font-semibold text-[#f8f1de]">
          Fuel Card Financing
        </h1>

        <p className="mt-4 text-[#c5bea9]">
          Fuel cards designed for trucking companies, fleets, and operators who
          need reliable access to fuel while maintaining strong cash flow.
        </p>

        <div className="mt-8 rounded-2xl border border-[#8c6a2d]/20 bg-[#0a0a08] p-6">
          <h2 className="text-xl font-semibold text-[#f4ead2]">
            Apply Now
          </h2>

          <p className="mt-3 text-[#c5bea9]">
            Complete the application below to get started.
          </p>

          {/* REPLACE WITH HUBSPOT APPLY FORM */}
          <a
            href="mailto:deals@newvinecapital.com"
            className="mt-6 inline-flex rounded-2xl bg-[#d7bb74] px-6 py-4 text-[#16120a]"
          >
            Apply for Fuel Cards
          </a>
        </div>
      </section>
    </div>
  );
}
