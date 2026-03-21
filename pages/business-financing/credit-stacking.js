import { useEffect } from "react";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export default function CreditStacking() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js-na2.hsforms.net/forms/embed/YOUR_FORM_ID.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4ead2]">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,187,116,0.15),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(83,101,68,0.15),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[#8c6a2d]/40 bg-[#1b160d] px-4 py-2 text-sm text-[#d7bb74]">
              Credit Stacking
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-tight text-[#f8f1de] md:text-6xl">
              Unlock business credit using strategic stacking.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c5bea9]">
              Credit stacking allows business owners to access multiple unsecured
              lines of credit at once, creating immediate access to capital without
              giving up equity or requiring collateral.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* LEFT */}
          <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#0d0d0b] p-8">
            <h2 className="text-2xl font-semibold text-[#f8f1de]">
              What is Credit Stacking?
            </h2>

            <p className="mt-4 text-[#c5bea9] leading-8">
              Credit stacking is a method of acquiring multiple business credit
              lines simultaneously. Instead of relying on a single lender, this
              approach leverages multiple approvals to maximize available capital.
            </p>

            <div className="mt-8 space-y-4 text-[#c5bea9]">
              <div>• Access to larger amounts of capital</div>
              <div>• No collateral required</div>
              <div>• Can be used for business growth or investment</div>
              <div>• Faster access compared to traditional lending</div>
            </div>
          </div>

          {/* RIGHT - FORM */}
          <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#10100d] p-8">
            <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">
              Apply Now
            </div>

            <h2 className="mt-3 text-2xl font-semibold text-[#f8f1de]">
              Start your credit stacking application
            </h2>

            <p className="mt-4 text-[#c5bea9]">
              Complete the form below and our team will review your profile and
              determine the best stacking strategy for your business.
            </p>

            <div className="mt-8 rounded-2xl border border-[#8c6a2d]/20 bg-[#0a0a08] p-6">
              <div
                className="hs-form-frame"
                data-region="na2"
                data-form-id="YOUR_FORM_ID"
                data-portal-id="YOUR_PORTAL_ID"
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 text-center">
        <h2 className="text-3xl font-semibold text-[#f8f1de]">
          Need other financing options?
        </h2>

        <div className="mt-8">
          <Link
            href="/business-financing"
            className="rounded-2xl bg-[#d7bb74] px-8 py-4 text-sm font-semibold text-[#16120a] hover:bg-[#e5ca86]"
          >
            Back to Business Financing
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
