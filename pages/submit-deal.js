import { useEffect } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function SubmitDeal() {
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
              Submit a New Deal
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-tight text-[#f8f1de] md:text-6xl">
              Present your real estate opportunity for review.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c5bea9]">
              Use this form to submit acquisitions, refinance scenarios, bridge
              opportunities, fix and flip projects, DSCR requests, EMD funding,
              transactional funding, and other investor-focused deals.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#0d0d0b] p-8">
            <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">
              Deal Submission
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de]">
              Submit your deal for review
            </h2>
            <p className="mt-4 leading-8 text-[#c5bea9]">
              Provide the details below and New Vine Capital will evaluate the
              opportunity and follow up accordingly.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#10100d] p-5">
                <h3 className="text-lg font-semibold text-[#f4ead2]">
                  Common Submission Types
                </h3>
                <ul className="mt-4 space-y-3 text-[#c5bea9]">
                  <li>DSCR loans</li>
                  <li>Fix and flip financing</li>
                  <li>Bridge loans</li>
                  <li>Earnest money deposit funding</li>
                  <li>Transactional funding</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#10100d] p-5">
                <h3 className="text-lg font-semibold text-[#f4ead2]">
                  Helpful Information to Include
                </h3>
                <ul className="mt-4 space-y-3 text-[#c5bea9]">
                  <li>Property address</li>
                  <li>Purchase price</li>
                  <li>Estimated value or ARV</li>
                  <li>Requested loan amount</li>
                  <li>Exit strategy</li>
                  <li>Timeline and supporting deal details</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#10100d] p-8 shadow-2xl shadow-black/20">
            <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">
              Online Intake
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de]">
              Complete the deal submission form
            </h2>
            <p className="mt-4 leading-8 text-[#c5bea9]">
              Once submitted, your request will be reviewed and we will follow up
              based on the opportunity and fit.
            </p>

            <div className="mt-8 rounded-2xl border border-[#8c6a2d]/20 bg-[#0a0a08] p-6">
              <div
                className="hs-form-frame"
                data-region="na2"
                data-form-id="05fd2ac5-bdf4-4883-a2cd-e9bad7970034"
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
              Need Another Funding Path?
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de]">
              Explore our other financing solutions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#c5bea9]">
              If your request is business-related rather than property-specific,
              New Vine Capital also offers business financing solutions including
              fuel accounts and other products.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/real-estate-funding"
                className="rounded-2xl bg-[#d7bb74] px-8 py-4 text-sm font-semibold text-[#16120a] transition hover:bg-[#e5ca86]"
              >
                View Real Estate Funding
              </a>
              <a
                href="/business-financing"
                className="rounded-2xl border border-[#8c6a2d]/35 bg-[#0f120d]/80 px-8 py-4 text-sm font-semibold text-[#f4ead2] transition hover:bg-[#172015]"
              >
                View Business Financing
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
