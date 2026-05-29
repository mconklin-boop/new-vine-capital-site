import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { siteLinks } from "../lib/siteLinks";

const JOTFORM_URL = siteLinks.jotformSubmitDeal;

const navItems = [
  { href: "/", label: "Borrowers" },
  { href: "/investors", label: "Investors" },
  { href: "/partners", label: "Partners" },
  { href: "/funding-process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export { JOTFORM_URL };

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050605]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-28 max-w-7xl items-center justify-between gap-5 px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="New Vine Capital home">
          <Image src="/logo.png" alt="New Vine Capital" width={132} height={132} className="h-24 w-24 object-contain md:h-28 md:w-28" priority />
        </Link>

        <nav className="hidden items-center gap-4 text-xs font-black uppercase tracking-wide text-white/70 lg:flex xl:gap-5">
          {navItems.map((item) => <Link key={`${item.href}-${item.label}`} href={item.href} className="transition hover:text-[#d5ad62]">{item.label}</Link>)}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={JOTFORM_URL} target="_blank" rel="noopener noreferrer" className="bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">
            Submit Deal
          </a>
          <Link href="/investor-portal" className="border border-[#d5ad62]/60 px-5 py-3 text-xs font-black uppercase text-[#d5ad62] transition hover:bg-[#d5ad62] hover:text-[#11100b]">
            Investor Portal Login
          </Link>
        </div>

        <button type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)} className="grid h-11 w-11 place-items-center border border-white/15 lg:hidden">
          <span className="grid gap-1.5"><span className="block h-0.5 w-6 bg-white" /><span className="block h-0.5 w-6 bg-white" /></span>
        </button>
      </div>

      {open && (
        <nav className="grid gap-1 border-t border-white/10 bg-[#050605] px-5 py-5 text-sm font-black uppercase text-white/80 lg:hidden">
          {navItems.map((item) => <Link key={`${item.href}-${item.label}`} href={item.href} onClick={() => setOpen(false)} className="py-3 transition hover:text-[#d5ad62]">{item.label}</Link>)}
          <a href={JOTFORM_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="mt-3 bg-[#d5ad62] px-5 py-4 text-center text-[#11100b]">
            Submit Deal
          </a>
          <Link href="/investor-portal" onClick={() => setOpen(false)} className="border border-[#d5ad62]/60 px-5 py-4 text-center text-[#d5ad62]">
            Investor Portal Login
          </Link>
        </nav>
      )}
    </header>
  );
}
