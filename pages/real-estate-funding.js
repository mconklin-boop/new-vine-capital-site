import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function RealEstateFunding() {
  const services = [
    "DSCR Loans",
    "Fix & Flip Financing",
    "Bridge Loans",
    "Earnest Money Deposit (EMD) Funding",
    "Transactional Funding",
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4ead2]">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <h1 className="text-4xl font-semibold text-[#f8f1de]">
          Real Estate Funding Solutions
        </h1>

        <p className="mt-4 text-[#c5bea9] max-w-2xl">
          Flexible capital for real estate investors across multiple strategies.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service}
              className="rounded-xl border border-[#8c6a2d]/20 p-6 bg-[#0d0d0b]"
            >
              {service}
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/submit-deal"
            className="rounded-2xl bg-[#d7bb74] px-8 py-4 text-[#16120a] font-semibold"
          >
            Submit a Deal
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
