import Image from "next/image";
import Link from "next/link";

export default function BusinessFinancing() {
  const products = [
    {
      title: "Fuel Accounts",
      description:
        "Structured fuel purchasing solutions for trucking companies, fleets, and operators who need reliable access to fuel and better cash flow management.",
      href: "/fuel-cards",
      cta: "Apply for Fuel Accounts",
    },
    {
      title: "Business Lines of Credit",
      description:
        "Flexible access to capital for operating expenses, growth opportunities, and short-term business cash flow needs.",
      href: "#contact-section",
      cta: "Contact Us",
    },
    {
      title: "Equipment Leasing",
      description:
        "Financing solutions for equipment purchases without large upfront capital requirements, designed to support operational growth.",
      href: "#contact-section",
      cta: "Contact Us",
    },
    {
      title: "More Products Coming",
      description:
        "New Vine Capital is actively expanding its business financing solutions to better serve business owners, operators, and growing companies.",
      href: "#contact-section",
      cta: "Stay Connected",
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
              href="/real-estate-funding"
              className="transition hover:text-[#d7bb74]"
            >
              Real Estate Funding
            </Link>
            <Link
              href="/fuel-cards"
              className="transition hover:text-[#d7bb74]"
            >
              Fuel Accounts
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,187,116,0.15),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(83,101,68,0.15),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[#8c6a2d]/40 bg-[#1b160d] px-4 py-2 text-sm text-[#d7bb74]">
              Business Financing Solutions
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-tight text-[#f8f1de] md:text-6xl">
              Flexible business financing for operators, owners, and growing companies.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c5bea9]">
              New Vine Capital provides business-purpose financing solutions designed
              to support cash flow, operations, and growth. Our focus is practical
              capital, direct communication, and flexible execution.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/fuel-cards"
                className="rounded-2xl bg-[#d7bb74] px-6 py-4 text-center text-sm font-semibold text-[#16120a] shadow-lg shadow-[#d7bb74]/20 transition hover:-translate-y-0.5 hover:bg-[#e5ca86]"
              >
                Apply for Fuel Accounts
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
            Financing Products
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de] md:text-4xl">
            Business-purpose capital solutions designed to support operations and growth.
          </h2>
          <p className="mt-4 text-[#c5bea9]">
            We highlight practical financing products for operators who need reliable
            capital access, with more solutions being added over time.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.title}
              className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-6 transition hover:bg-[#151510]"
            >
              <h3 className="text-lg font-semibold text-[#f4ead2]">
                {product.title}
              </h3>
              <p className="mt-3 leading-7 text-[#c5bea9]">
                {product.description}
              </p>

              {product.href.startsWith("/") ? (
                <Link
                  href={product.href}
                  className="mt-6 inline-flex rounded-xl border border-[#8c6a2d]/30 bg-[#1a2117] px-4 py-3 text-sm font-semibold text-[#d7bb74] transition hover:bg-[#232d1f]"
                >
                  {product.cta}
                </Link>
              ) : (
                <a
                  href={product.href}
                  className="mt-6 inline-flex rounded-xl border border-[#8c6a2d]/30 bg-[#1a2117] px-4 py-3 text-sm font-semibold text-[#d7bb74] transition hover:bg-[#232d1f]"
                >
                  {product.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#8c6a2d]/15 bg-[#0a0a08]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#10100d] p-8">
              <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">
                Current Highlight
              </div>
              <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de]">
                Fuel accounts for fleet and transportation operators.
              </h2>
              <p className="mt-4 leading-8 text-[#c5bea9]">
                Our current featured business financing product is Fuel Accounts,
                designed for trucking companies, fleet-based businesses, and operators
                who need consistent access to fuel purchasing solutions.
              </p>
              <Link
                href="/fuel-cards"
                className="mt-6 inline-flex rounded-2xl bg-[#d7bb74] px-6 py-4 text-sm font-semibold text-[#16120a] transition hover:bg-[#e5ca86]"
              >
                Go to Fuel Accounts
              </Link>
            </div>

            <div
              id="contact-section"
              className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#10100d] p-8"
            >
              <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">
                Contact
              </div>
              <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de]">
                Ask about other business financing solutions.
              </h2>
              <p className="mt-4 leading-8 text-[#c5bea9]">
                For business lines of credit, equipment leasing, and upcoming products,
                contact New Vine Capital directly to discuss your funding needs.
              </p>

              <div className="mt-8 space-y-4 text-[#c5bea9]">
                <div>
                  <span className="font-semibold text-[#f4ead2]">Email:</span>{" "}
                  deals@newvinecapital.com
                </div>
                <div>
                  <span className="font-semibold text-[#f4ead2]">Phone:</span>{" "}
                  720-817-4277
                </div>
                <div>
                  <span className="font-semibold text-[#f4ead2]">Address:</span>{" "}
                  1500 N Grant St #7339, Denver, CO 80203
                </div>
              </div>
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
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#c5bea9]">
            Explore our featured Fuel Account application or contact New Vine Capital
            to discuss other business financing opportunities.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/fuel-cards"
              className="rounded-2xl bg-[#d7bb74] px-8 py-4 text-sm font-semibold text-[#16120a] transition hover:bg-[#e5ca86]"
            >
              Apply for Fuel Accounts
            </Link>
            <Link
              href="/real-estate-funding"
              className="rounded-2xl border border-[#8c6a2d]/35 bg-[#0f120d]/80 px-8 py-4 text-sm font-semibold text-[#f4ead2] transition hover:bg-[#172015]"
            >
              View Real Estate Funding
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
