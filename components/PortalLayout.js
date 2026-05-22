import Link from "next/link";
import SiteFooter from "./SiteFooter";

const nav = [
  ["/investor/dashboard", "Dashboard"],
  ["/investor/opportunities", "Opportunities"],
  ["/investor/documents", "Documents"],
  ["/investor/reporting", "Reporting"],
  ["/investor/profile", "Profile"],
];

export default function PortalLayout({ user, title, children }) {
  const isAdmin = user?.role === "Admin";
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050605] text-white">
      <header className="border-b border-white/10 bg-[#050605]/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">New Vine Capital</p>
            <h1 className="mt-1 font-serif text-3xl">Investor Portal</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
            <span>{user?.name}</span>
            <span className="border border-white/15 px-3 py-1 text-xs uppercase">{user?.role}</span>
            <form action="/api/portal/logout" method="post"><button className="bg-white/10 px-4 py-2 text-xs font-black uppercase hover:bg-white/20">Log Out</button></form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 pb-5 text-xs font-black uppercase tracking-wide text-white/70 [scrollbar-width:thin] lg:px-8">
          {nav.map(([href, label]) => <Link key={href} href={href} className="shrink-0 whitespace-nowrap border border-white/10 px-4 py-3 hover:border-[#d5ad62] hover:text-[#d5ad62]">{label}</Link>)}
          {isAdmin && <Link href="/investor-portal/admin" className="shrink-0 whitespace-nowrap border border-[#d5ad62]/50 px-4 py-3 text-[#d5ad62]">Admin</Link>}
          {isAdmin && <Link href="/investor-portal/admin-investments" className="shrink-0 whitespace-nowrap border border-[#d5ad62]/50 px-4 py-3 text-[#d5ad62]">Investment Admin</Link>}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Private investor access</p>
          <h2 className="mt-2 font-serif text-4xl leading-tight md:text-5xl">{title}</h2>
        </div>
        {children}
      </main>

      <div className="mx-auto max-w-7xl px-5 pb-10 text-xs leading-6 text-white/45 lg:px-8">
        Investment opportunities are available only to qualified investors. All investments involve risk, including possible loss of principal. Target returns are not guaranteed and are subject to market conditions and offering documents. This portal is for informational purposes only and does not constitute an offer to sell securities or investment advice.
      </div>
      <SiteFooter />
    </div>
  );
}
