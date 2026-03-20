import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function SubmitDeal() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js-na2.hsforms.net/forms/embed/245491482.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

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

          <Link
            href="/"
            className="text-sm text-[#d7bb74] hover:text-[#e5ca86]"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#10100d] p-8 shadow-2xl shadow-black/20">
          <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">
            Submit a New Deal
          </div>

          <h1 className="mt-3 text-4xl font-semibold text-[#f8f1de]">
            Real estate and opportunity-based deal intake
          </h1>

          <p className="mt-4 max-w-3xl leading-8 text-[#c5bea9]">
            Use this page for acquisitions, refinance scenarios, bridge
            requests, collateral-based opportunities, and other real estate
            submissions.
          </p>

          {/* HUBSPOT FORM */}
          <div className="mt-10 rounded-2xl border border-[#8c6a2d]/20 bg-[#0a0a08] p-6">
            <div
              className="hs-form-frame"
              data-region="na2"
              data-form-id="05fd2ac5-bdf4-4883-a2cd-e9bad7970034"
              data-portal-id="245491482"
            ></div>
          </div>

          {/* INFO SECTION */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-6">
              <h3 className="text-lg font-semibold text-[#f4ead2]">
                What to include
              </h3>
              <ul className="mt-4 space-y-3 text-[#c5bea9]">
                <li>Property address</li>
                <li>Purchase price</li>
                <li>Estimated value</li>
                <li>Requested loan amount</li>
                <li>Exit strategy</li>
                <li>Timeline and supporting details</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-6">
              <h3 className="text-lg font-semibold text-[#f4ead2]">
                Contact
              </h3>
              <div className="mt-4 space-y-3 text-[#c5bea9]">
                <div>deals@newvinecapital.com</div>
                <div>720-817-4277</div>
                <div>1500 N Grant St #7339, Denver, CO 80203</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
