import Image from "next/image";
import Link from "next/link";

export default function BusinessFinancing() {
  const products = [
    {
      title: "Fuel Accounts",
      description:
        "Structured fuel solutions for trucking companies, fleets, and operators to manage expenses and improve cash flow.",
    },
    {
      title: "Business Lines of Credit",
      description:
        "Flexible access to capital for operating expenses, growth, and short-term cash flow needs.",
    },
    {
      title: "Equipment Leasing",
      description:
        "Financing solutions for equipment purchases without large upfront capital requirements.",
    },
    {
      title: "More Products Coming",
      description:
        "New Vine Capital is actively expanding its lending solutions to better serve business owners and operators.",
    },
  ];

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

          <Link
            href="/"
            className="text-sm text-[#d7bb74] hover:text-[#e5ca86]"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <h1 className="text-4xl font-semibold text-[#f8f1de]">
          Business Financing Solutions
        </h1>

        <p className="mt-4 max-w-2xl text-[#c5bea9]">
          Flexible capital solutions designed for business owners, operators,
          and growing companies that need reliable access to funding.
        </p>

        {/* PRODUCT GRID */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.title}
              className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-6 hover:bg-[#151510] transition"
            >
              <h2 className="text-lg font-semibold text-[#f4ead2]">
                {product.title}
              </h2>

              <p className="mt-3 text-[#c5bea9] leading-7">
                {product.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA SECTION */}
        <div className="mt-16 rounded-2xl border border-[#8c6a2d]/20 bg-[#10100d] p-8 text-center">
          <h2 className="text-2xl font-semibold text-[#f8f1de]">
            Get Started with Fuel Accounts
          </h2>

          <p className="mt-3 text-[#c5bea9]">
            Apply for fuel card financing and start improving your cash flow today.
          </p>

          <Link
            href="/fuel-cards"
            className="mt-6 inline-flex rounded-2xl bg-[#d7bb74] px-8 py-4 text-[#16120a] font-semibold hover:bg-[#e5ca86]"
          >
            Apply for Fuel Cards
          </Link>
        </div>
      </section>
    </div>
  );
}
