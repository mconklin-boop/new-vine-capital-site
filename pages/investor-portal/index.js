import { useState } from "react";
import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";

export default function InvestorPortalLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/portal/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password"), mfaCode: form.get("mfaCode") }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setError(data.error || "Unable to log in.");
    window.location.href = data.redirect;
  }

  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <main className="grid min-h-screen place-items-center px-5 py-16">
        <section className="w-full max-w-xl border border-white/10 bg-[#111613] p-8 shadow-2xl shadow-black/40">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">New Vine Capital</p>
          <h1 className="mt-3 font-serif text-5xl">Investor Portal</h1>
          <p className="mt-4 text-lg text-white/70">Secure access for approved New Vine Capital investors.</p>
          <p className="mt-5 border-l-4 border-[#d5ad62] bg-white/5 p-4 text-sm leading-6 text-white/70">Access to this portal is restricted to approved investors and authorized representatives only.</p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-white/75">Email<input name="email" type="email" required autoComplete="email" className="bg-white px-4 py-4 text-[#050605]" /></label>
            <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-white/75">Password<input name="password" type="password" required autoComplete="current-password" className="bg-white px-4 py-4 text-[#050605]" /></label>
            <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-white/75">MFA / 2FA Code <span className="normal-case text-white/45">if enabled</span><input name="mfaCode" type="text" inputMode="numeric" autoComplete="one-time-code" className="bg-white px-4 py-4 text-[#050605]" /></label>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button disabled={loading} className="bg-[#d5ad62] px-6 py-4 text-sm font-black uppercase text-[#11100b] disabled:opacity-60">{loading ? "Verifying..." : "Log In"}</button>
          </form>

          <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm text-white/60">
            <Link href="/investor-portal/forgot-password" className="hover:text-[#d5ad62]">Forgot password?</Link>
            <Link href="/" className="hover:text-[#d5ad62]">Return to public site</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
