import Image from "next/image";
import Link from "next/link";

export default function SubmitDeal() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f4ead2]">
      <header className="border-b border-[#8c6a2d]/25 bg-[#050505]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-4">
            <Image src="/logo.png" alt="New Vine Capital logo" width={56} height={56} className="h-14 w-14 object-contain" />
            <div>
              <div className="text-xl font-semibold tracking-[0.18em] text-[#d7bb74]">
                NEW VINE CAPITAL
              </div>
              <div className="text-xs uppercase tracking-[0.35em] text-[#9ba082]">
                Private Lending • Strategic Capital
              </div>
            </div>
          </Link>
          <Link href="/" className="text-sm text-[#d7bb74] hover:text-[#e5ca86]">
            Back to Home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#10100d] p-8 shadow-2xl shadow-black/20">
          <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">Submit a New Deal</div>
          <h1 className="mt-3 text-4xl font-semibold text-[#f8f1de]">
            Real estate and opportunity-based deal intake
          </h1>
          <p className="mt-4 max-w-3xl leading-8 text-[#c5bea9]">
            Use this page for acquisitions, refinance scenarios, bridge requests, collateral-based
            opportunities, and other real estate-related submissions.
          </p>

          <div className="mt-8 rounded-2xl border border-[#8c6a2d]/20 bg-[#0a0a08] p-6">
            <h2 className="text-xl font-semibold text-[#f4ead2]">Temporary intake method</h2>
            <p className="mt-3 leading-7 text-[#c5bea9]">
              Until your HubSpot form is connected, use the button below to email your deal
              submission directly.
            </p>
            <a
              href="mailto:deals@newvinecapital.com?subject=New%20Deal%20Submission"
              className="mt-6 inline-flex rounded-2xl bg-[#d7bb74] px-6 py-4 text-sm font-semibold text-[#16120a] transition hover:bg-[#e5ca86]"
            >
              Email Your Deal Submission
            </a>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-6">
              <h3 className="text-lg font-semibold text-[#f4ead2]">What to include</h3>
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
              <h3 className="text-lg font-semibold text-[#f4ead2]">Contact</h3>
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
