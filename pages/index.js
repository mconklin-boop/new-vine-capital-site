import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f4ead2]">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 text-center">
        <h1 className="text-5xl font-semibold text-[#f8f1de]">
          Strategic Capital for Real Estate and Business
        </h1>

        <p className="mt-6 text-[#c5bea9] max-w-2xl mx-auto">
          New Vine Capital provides flexible lending solutions for investors,
          operators, and businesses looking to scale.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
          <Link
            href="/submit-deal"
            className="rounded-2xl bg-[#d7bb74] px-8 py-4 font-semibold text-[#16120a]"
          >
            Submit a Deal
          </Link>

          <Link
            href="/business-financing"
            className="rounded-2xl border border-[#8c6a2d] px-8 py-4"
          >
            Apply Now
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
