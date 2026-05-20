import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#030403] text-white/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1fr_auto] lg:px-8">
        <div className="max-w-xl">
          <Image src="/logo.png" alt="New Vine Capital" width={76} height={76} className="h-20 w-20 object-contain" />
          <p className="mt-4 text-sm leading-7">
            Fast Private Capital Solutions for real estate investors, brokers, developers, wholesalers, and business owners.
          </p>
        </div>

        <nav className="flex flex-wrap gap-5 text-xs font-black uppercase tracking-wide text-white/80">
          <Link href="/loan-programs" className="hover:text-[#d5ad62]">Loan Programs</Link>
          <Link href="/investors" className="hover:text-[#d5ad62]">Investors</Link>
          <Link href="/funding-process" className="hover:text-[#d5ad62]">Process</Link>
          <Link href="/contact" className="hover:text-[#d5ad62]">Contact</Link>
        </nav>

        <p className="border-t border-white/10 pt-6 text-xs leading-6 text-white/50 lg:col-span-2">
          New Vine Capital is not a bank. All loans and investment opportunities are subject to underwriting, diligence, eligibility, market conditions, and final approval. This website is for informational purposes only and is not an offer to lend, sell securities, or provide investment advice. Investment opportunities involve risk and may not be suitable for all investors.
        </p>
      </div>
    </footer>
  );
}
