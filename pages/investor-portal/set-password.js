import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SiteFooter from "../../components/SiteFooter";

function parseInviteHash() {
  if (typeof window === "undefined") return {};
  const hash = window.location.hash?.replace(/^#/, "") || "";
  return Object.fromEntries(new URLSearchParams(hash).entries());
}

export default function InvestorSetPassword() {
  const [tokens, setTokens] = useState({});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = useMemo(() => {
    if (typeof window === "undefined") return null;
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }, []);

  useEffect(() => {
    const parsed = parseInviteHash();
    setTokens(parsed);
    if (!parsed.access_token || !parsed.refresh_token) {
      setError("This invite link is missing its secure session. Please ask New Vine Capital to resend the investor portal invitation.");
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!tokens.access_token || !tokens.refresh_token) return setError("Invite link is invalid or expired.");
    if (password.length < 8) return setError("Please use a password with at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });

    if (sessionError) {
      setLoading(false);
      return setError(sessionError.message || "Unable to verify invite session.");
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setLoading(false);
      return setError(updateError.message || "Unable to set password.");
    }

    const response = await fetch("/api/portal/accept-invite-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: tokens.access_token, refresh_token: tokens.refresh_token }),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) return setError(data.error || "Password was set, but portal login could not be completed.");

    setMessage("Password created. Redirecting to your investor dashboard...");
    window.location.href = data.redirect || "/investor/dashboard";
  }

  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <main className="grid min-h-screen place-items-center px-5 py-16">
        <section className="w-full max-w-xl border border-white/10 bg-[#111613] p-8 shadow-2xl shadow-black/40">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">New Vine Capital</p>
          <h1 className="mt-3 font-serif text-5xl">Create Your Investor Portal Password</h1>
          <p className="mt-4 text-lg leading-8 text-white/70">Set your password to activate secure access to the New Vine Capital Investor Portal.</p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-white/75">New Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required autoComplete="new-password" className="bg-white px-4 py-4 text-[#050605]" /></label>
            <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-white/75">Confirm Password<input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" required autoComplete="new-password" className="bg-white px-4 py-4 text-[#050605]" /></label>
            {error && <p className="border border-red-400/40 bg-red-500/10 p-4 text-sm leading-6 text-red-100">{error}</p>}
            {message && <p className="border border-[#d5ad62]/40 bg-[#d5ad62]/10 p-4 text-sm leading-6 text-[#f0d99a]">{message}</p>}
            <button disabled={loading || !tokens.access_token} className="bg-[#d5ad62] px-6 py-4 text-sm font-black uppercase text-[#11100b] disabled:opacity-60">{loading ? "Creating Password..." : "Create Password"}</button>
          </form>

          <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm text-white/60">
            <Link href="/investor-portal" className="hover:text-[#d5ad62]">Return to login</Link>
            <Link href="/" className="hover:text-[#d5ad62]">Return to public site</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
