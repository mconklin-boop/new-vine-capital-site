import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const JOTFORM_URL = "https://form.jotform.com/260916045657058";

const navItems = [
  { href: "/loan-programs", label: "Loan Programs" },
  { href: "/about", label: "About" },
  { href: "/funding-process", label: "Process" },
  { href: "/investors", label: "Investors" },
  { href: "/contact", label: "Contact" },
  { href: "/investor-portal", label: "Investor Login" },
];

export { JOTFORM_URL };

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050605]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-28 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="New Vine Capital home">
          <Image src="/logo.png" alt="New Vine Capital" width={132} height={132} className="h-24 w-24 object-contain md:h-28 md:w-28" priority />
        </Link>

        <nav className="hidden items-center gap-5 text-xs font-black uppercase tracking-wide text-white/70 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#d5ad62]">
              {item.label}
            </Link>
          ))}
        </nav>

        <a href={JOTFORM_URL} target="_blank" rel="noopener noreferrer" className="hidden bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a] lg:inline-flex">
          Submit Deal
        </a>

        <button type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)} className="grid h-11 w-11 place-items-center border border-white/15 lg:hidden">
          <span className="grid gap-1.5">
            <span className="block h-0.5 w-6 bg-white" />
            <span className="block h-0.5 w-6 bg-white" />
          </span>
        </button>
      </div>

      {open && (
        <nav className="grid gap-1 border-t border-white/10 bg-[#050605] px-5 py-5 text-sm font-black uppercase text-white/80 lg:hidden">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-3 transition hover:text-[#d5ad62]">
              {item.label}
            </Link>
          ))}
          <a href={JOTFORM_URL} target="_blank" rel="noopener noreferrer" className="mt-3 bg-[#d5ad62] px-5 py-4 text-center text-[#11100b]">
            Submit Deal
          </a>
        </nav>
      )}
    </header>
  );
}
