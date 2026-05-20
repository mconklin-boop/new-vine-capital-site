import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <main className="grid min-h-screen place-items-center px-5 py-16">
        <section className="w-full max-w-2xl border border-white/10 bg-[#111613] p-8 shadow-2xl shadow-black/40">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Investor Portal</p>
          <h1 className="mt-3 font-serif text-5xl">Forgot Password</h1>
          <p className="mt-5 leading-8 text-white/70">For security, portal password resets are handled by New Vine Capital Investor Relations. Please contact the team to verify your identity and request a secure reset invitation.</p>
          <div className="mt-8 grid gap-3 text-white/70"><p><strong className="text-white">Email:</strong> deals@newvinecapital.com</p><p><strong className="text-white">Phone:</strong> 720-817-4277</p></div>
          <Link href="/investor-portal" className="mt-8 inline-flex bg-[#d5ad62] px-6 py-4 text-sm font-black uppercase text-[#11100b]">Back to Login</Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
