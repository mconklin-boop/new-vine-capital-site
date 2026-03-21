import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function BusinessFinancing() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f4ead2]">
      <SiteHeader />

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-[#8c6a2d]/40 bg-[#1b160d] px-4 py-2 text-sm text-[#d7bb74]">
            Business Financing Solutions
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-tight text-[#f8f1de] md:text-6xl">
            Flexible capital solutions for businesses and operators
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c5bea9]">
            New Vine Capital provides access to fuel accounts, business lines of credit,
            equipment leasing, and additional financing solutions designed to support
            business growth and operational needs.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">

          {/* FUEL ACCOUNTS */}
          <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-8">
            <h2 className="text-2xl font-semibold text-[#f8f1de]">
              Fuel Accounts
            </h2>

            <p className="mt-4 text-[#c5bea9]">
              Fuel account solutions designed for trucking companies, fleets,
              and operators who need consistent access to fuel with improved
              cash flow flexibility.
            </p>

            <Link
              href="/business-financing/fuel-cards"
              className="mt-6 inline-flex rounded-2xl bg-[#d7bb74] px-6 py-3 font-semibold text-[#16120a]"
            >
              Apply for Fuel Account
            </Link>
          </div>

          {/* BUSINESS LINE OF CREDIT */}
          <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-8">
            <h2 className="text-2xl font-semibold text-[#f8f1de]">
              Business Lines of Credit
            </h2>

            <p className="mt-4 text-[#c5bea9]">
              Access revolving capital to manage expenses, stabilize cash flow,
              and fund short-term opportunities in your business.
            </p>
          </div>

          {/* EQUIPMENT LEASING */}
          <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-8">
            <h2 className="text-2xl font-semibold text-[#f8f1de]">
              Equipment Leasing
            </h2>

            <p className="mt-4 text-[#c5bea9]">
              Finance vehicles, machinery, and equipment needed to operate and
              grow your business without large upfront capital requirements.
            </p>
          </div>

          {/* MORE COMING */}
          <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-8">
            <h2 className="text-2xl font-semibold text-[#f8f1de]">
              More Solutions Coming
            </h2>

            <p className="mt-4 text-[#c5bea9]">
              New Vine Capital continues to expand financing options to better
              serve business owners and operators across multiple industries.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-[#8c6a2d]/15 bg-[#0a0a08]">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
          <h2 className="text-3xl font-semibold text-[#f8f1de]">
            Not sure which solution fits your business?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[#c5bea9]">
            Contact New Vine Capital directly and we’ll help guide you to the
            right financing option.
          </p>

          <a
            href="tel:7208174277"
            className="mt-8 inline-flex rounded-2xl border border-[#8c6a2d] px-8 py-4 font-semibold"
          >
            Call 720-817-4277
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
