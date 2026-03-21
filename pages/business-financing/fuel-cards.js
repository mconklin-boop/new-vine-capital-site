import Link from "next/link";
import { useEffect } from "react";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export default function FuelCards() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js-na2.hsforms.net/forms/embed/245491482.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4ead2]">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,187,116,0.15),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(83,101,68,0.15),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[#8c6a2d]/40 bg-[#1b160d] px-4 py-2 text-sm text-[#d7bb74]">
              Fuel Accounts
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-tight text-[#f8f1de] md:text-6xl">
              Fuel account solutions built for fleets, trucking companies, and operators.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c5bea9]">
              New Vine Capital helps business owners access fuel purchasing solutions
              designed to support cash flow, operational consistency, and growth.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#0d0d0b] p-8">
            <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">
              Fuel Account Financing
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de]">
              Built for operators who need reliable fuel purchasing power.
            </h2>
            <p className="mt-4 leading-8 text-[#c5bea9]">
              Fuel accounts can help streamline business operations, improve cash flow,
              and support growth for companies that depend on consistent access to fuel.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#10100d] p-5">
                <h3 className="text-lg font-semibold text-[#f4ead2]">
                  Potential Benefits
                </h3>
                <ul className="mt-4 space-y-3 text-[#c5bea9]">
                  <li>Improved fuel purchasing flexibility</li>
                  <li>Support for business cash flow management</li>
                  <li>Scalable solutions for fleets and operators</li>
                  <li>More control over fuel-related operating expenses</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#10100d] p-5">
                <h3 className="text-lg font-semibold text-[#f4ead2]">
                  Good Fit For
                </h3>
                <ul className="mt-4 space-y-3 text-[#c5bea9]">
                  <li>Trucking companies</li>
                  <li>Owner-operators</li>
                  <li>Delivery and transportation businesses</li>
                  <li>Fleet-based service businesses</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#10100d] p-8 shadow-2xl shadow-black/20">
            <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">
              Apply Now
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de]">
              Start your fuel account application
            </h2>
            <p className="mt-4 leading-8 text-[#c5bea9]">
              Complete the application below and New Vine Capital will review your
              request and follow up with next steps.
            </p>

            <div className="mt-8 rounded-2xl border border-[#8c6a2d]/20 bg-[#0a0a08] p-6">
              <div
                className="hs-form-frame"
                data-region="na2"
                data-form-id="1831ff5d-b3be-4a38-8f20-6ea2393cb283"
                data-portal-id="245491482"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#8c6a2d]/15 bg-[#0a0a08]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#10100d] p-8 text-center">
            <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">
              Need Something Else?
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de]">
              Explore more business financing solutions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#c5bea9]">
              New Vine Capital also highlights business lines of credit, equipment
              leasing, and additional business-purpose products as we expand.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/business-financing"
                className="rounded-2xl bg-[#d7bb74] px-8 py-4 text-sm font-semibold text-[#16120a] transition hover:bg-[#e5ca86]"
              >
                View Business Financing
              </Link>
              <a
                href="tel:7208174277"
                className="rounded-2xl border border-[#8c6a2d]/35 bg-[#0f120d]/80 px-8 py-4 text-sm font-semibold text-[#f4ead2] transition hover:bg-[#172015]"
              >
                Call 720-817-4277
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
