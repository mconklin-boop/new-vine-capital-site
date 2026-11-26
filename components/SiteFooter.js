import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#030403] text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1fr_auto_auto] lg:px-8">
        <div className="max-w-md">
          <Image src="/logo.png" alt="New Vine Capital" width={112} height={112} className="h-24 w-24 object-contain" />
          <p className="mt-4 text-sm leading-7">Private real estate and business-purpose financing for investors, brokers, wholesalers and business owners.</p>
        </div>

        <nav className="grid content-start gap-3 text-xs font-black uppercase tracking-wide text-white/80">
          <Link href="/real-estate-funding" className="hover:text-[#d5ad62]">Real Estate</Link>
          <Link href="/business-financing" className="hover:text-[#d5ad62]">Business</Link>
          <Link href="/funding-process" className="hover:text-[#d5ad62]">Process</Link>
          <Link href="/about" className="hover:text-[#d5ad62]">About</Link>
          <Link href="/investors" className="hover:text-[#d5ad62]">Capital Partners</Link>
          <Link href="/privacy-policy" className="hover:text-[#d5ad62]">Privacy Policy</Link>
        </nav>

        <address className="grid content-start gap-2 text-sm not-italic leading-6">
          <span className="text-xs font-black uppercase tracking-wide text-white/80">Contact</span>
          <a href="tel:7208174277" className="hover:text-[#d5ad62]">720-817-4277</a>
          <a href="mailto:deals@newvinecapital.com" className="hover:text-[#d5ad62]">deals@newvinecapital.com</a>
          <span>1500 N Grant St #7339<br />Denver, CO 80203</span>
        </address>

        <div className="grid gap-3 border-t border-white/10 pt-6 text-xs leading-6 text-white/50 lg:col-span-3">
          <p>New Vine Capital is a trade name of Conklin Investments, Inc. New Vine Capital is not a bank. All financing is for business purposes only; we do not make consumer or owner-occupied residential loans. All loans are subject to underwriting, diligence, eligibility and final approval, and any terms provided are preliminary until approved in writing.</p>
          <p>Nothing on this website is an offer to sell or a solicitation of an offer to buy any security. All investments involve risk, including possible loss of principal.</p>
        </div>
      </div>
    </footer>
  );
}
