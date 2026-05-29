import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#030403] text-white/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1fr_auto] lg:px-8">
        <div className="max-w-xl">
          <Image src="/logo.png" alt="New Vine Capital" width={112} height={112} className="h-28 w-28 object-contain" />
          <p className="mt-4 text-sm leading-7">
            Fast Private Capital Solutions for real estate investors, brokers, developers, wholesalers, and business owners.
          </p>
        </div>

        <nav className="flex flex-wrap gap-5 text-xs font-black uppercase tracking-wide text-white/80">
          <Link href="/investors" className="hover:text-[#d5ad62]">Investors</Link>
          <Link href="/funding-process" className="hover:text-[#d5ad62]">Process</Link>
          <Link href="/contact" className="hover:text-[#d5ad62]">Contact</Link>
        </nav>

        <p className="border-t border-white/10 pt-6 text-xs leading-6 text-white/50 lg:col-span-2">
          Investment opportunities are available only to qualified investors. All investments involve risk, including possible loss of principal. Historical platform activity does not guarantee future results. Information contained on this website is for informational purposes only and does not constitute investment advice or an offer to sell securities. New Vine Capital is not a bank. All loans are subject to underwriting, diligence, eligibility, market conditions, and final approval.
        </p>
      </div>
    </footer>
  );
}
