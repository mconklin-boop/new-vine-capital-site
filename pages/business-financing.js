import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
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

        <nav className="hidden gap-8 text-sm text-[#d8cfb6] md:flex">
          <Link href="/" className="hover:text-[#d7bb74]">
            Home
          </Link>
          <Link href="/real-estate-funding" className="hover:text-[#d7bb74]">
            Real Estate Funding
          </Link>
          <Link href="/business-financing" className="hover:text-[#d7bb74]">
            Business Financing
          </Link>
          <Link
            href="/business-financing/fuel-cards"
            className="hover:text-[#d7bb74]"
          >
            Fuel Accounts
          </Link>
          <Link href="/submit-deal" className="hover:text-[#d7bb74]">
            Submit Deal
          </Link>
        </nav>
      </div>
    </header>
  );
}
