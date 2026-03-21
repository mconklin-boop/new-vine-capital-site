import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f4ead2]">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-8">
        <h1 className="text-5xl font-semibold text-[#f8f1de] md:text-6xl">
          Strategic Capital for Real Estate and Business
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#c5bea9]">
          New Vine Capital provides flexible lending solutions for real estate
          investors, business owners, and operators looking to scale with
          reliable access to capital.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-8 text-center">
            <h2 className="text-2xl font-semibold text-[#f8f1de]">
              Real Estate Funding
            </h2>

            <p className="mt-4 text-[#c5bea9]">
              DSCR, Fix &amp; Flip, Bridge, EMD, and Transactional funding
              solutions for investors and operators.
            </p>

            <Link
              href="/real-estate-funding"
              className="mt-6 inline-flex rounded-2xl bg-[#d7bb74] px-6 py-3 font-semibold text-[#16120a]"
            >
              Explore Real Estate Funding
            </Link>
          </div>

          <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-8 text-center">
            <h2 className="text-2xl font-semibold text-[#f8f1de]">
              Business Financing
            </h2>

            <p className="mt-4 text-[#c5bea9]">
              Fuel accounts, business lines of credit, equipment leasing, and
              more solutions designed for operators and growing businesses.
            </p>

            <Link
              href="/business-financing"
              className="mt-6 inline-flex rounded-2xl border border-[#8c6a2d] px-6 py-3"
            >
              Explore Business Financing
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
