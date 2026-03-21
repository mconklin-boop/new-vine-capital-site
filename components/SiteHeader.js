import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#8c6a2d]/20 bg-[#050505]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="New Vine Capital logo"
            width={42}
            height={42}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="text-lg font-semibold text-[#f4ead2]">
            New Vine Capital
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#c5bea9] md:flex">
          <Link href="/" className="transition hover:text-[#d7bb74]">
            Home
          </Link>
          <Link
            href="/real-estate-funding"
            className="transition hover:text-[#d7bb74]"
          >
            Real Estate Funding
          </Link>
          <Link
            href="/business-financing"
            className="transition hover:text-[#d7bb74]"
          >
            Business Financing
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href="tel:7208174277"
            className="rounded-xl border border-[#8c6a2d]/30 px-4 py-2 text-sm text-[#f4ead2] transition hover:bg-[#172015]"
          >
            Call Now
          </a>
        </div>
      </div>
    </header>
  );
}
