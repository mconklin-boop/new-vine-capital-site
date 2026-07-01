import { useEffect, useMemo, useState } from "react";

const PLAID_OAUTH_TOKEN_KEY = "nvc_plaid_link_token";

function formatDate(value) {
  if (!value) return "Pending";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function logoSrc(logo) {
  if (!logo) return "";
  if (logo.startsWith("data:") || logo.startsWith("http")) return logo;
  return `data:image/png;base64,${logo}`;
}

function StatusBadge({ status }) {
  const connected = status === "connected";
  return <span className={`inline-flex border px-3 py-1 text-[10px] font-black uppercase tracking-wide ${connected ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-white/20 bg-white/10 text-white/60"}`}>{connected ? "Connected" : status}</span>;
}

function loadPlaidScript() {
  if (typeof window === "undefined") return Promise.reject(new Error("Plaid Link is only available in the browser."));
  if (window.Plaid) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[src='https://cdn.plaid.com/link/v2/stable/link-initialize.js']");
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

async function parseJsonResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Request failed.");
  return payload;
}

async function postJsonWithTimeout(url, body, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw new Error("The bank connected, but saving the connection took too long. Please refresh the page and check whether the account appears.");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function isPlaidOAuthReturn() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("oauth_state_id");
}

export default function ConnectedBankAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState("");
  const [message, setMessage] = useState(null);
  const connectedAccounts = useMemo(() => accounts.filter((account) => account.connectionStatus !== "disconnected"), [accounts]);

  async function loadAccounts() {
    setLoading(true);
    try {
      const payload = await parseJsonResponse(await fetch("/api/portal/plaid/accounts"));
      setAccounts(payload.accounts || []);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function finishPlaidSuccess(publicToken, metadata) {
    setWorking("exchange");
    try {
      const payload = await parseJsonResponse(await postJsonWithTimeout("/api/portal/plaid/exchange-public-token", { publicToken, metadata }));
      window.localStorage.removeItem(PLAID_OAUTH_TOKEN_KEY);
      setAccounts(payload.accounts || []);
      const first = payload.accounts?.[0];
      setMessage({
        type: "success",
        text: first ? `Bank successfully connected. ${first.institutionName} / ${first.accountName} ending in ${first.accountMask}.` : "Bank successfully connected.",
      });
      if (window.location.search.includes("oauth_state_id")) window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "The bank connected, but the portal could not save the account. Please try again or contact New Vine Capital." });
      await loadAccounts();
    } finally {
      setWorking("");
    }
  }

  function createPlaidHandler(linkToken, receivedRedirectUri = null) {
    return window.Plaid.create({
      token: linkToken,
      receivedRedirectUri,
      onSuccess: finishPlaidSuccess,
      onExit: (error) => {
        if (error) setMessage({ type: "error", text: error.display_message || error.error_message || "Plaid Link closed before completing." });
        setWorking("");
      },
    });
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    async function resumeOAuth() {
      if (!isPlaidOAuthReturn()) return;
      const linkToken = window.localStorage.getItem(PLAID_OAUTH_TOKEN_KEY);
      if (!linkToken) {
        setMessage({ type: "error", text: "Plaid returned to the portal, but the secure connection session expired. Please click Connect Bank Account again." });
        return;
      }

      try {
        setWorking("connect");
        setMessage({ type: "success", text: "Bank verification complete. Finishing secure connection..." });
        await loadPlaidScript();
        createPlaidHandler(linkToken, window.location.href).open();
      } catch (error) {
        setMessage({ type: "error", text: error.message });
        setWorking("");
      }
    }

    resumeOAuth();
  }, []);

  async function connectAccount() {
    setWorking("connect");
    setMessage(null);

    try {
      await loadPlaidScript();
      const { linkToken } = await parseJsonResponse(await fetch("/api/portal/plaid/create-link-token", { method: "POST" }));
      window.localStorage.setItem(PLAID_OAUTH_TOKEN_KEY, linkToken);
      createPlaidHandler(linkToken).open();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      setWorking("");
    }
  }

  async function refreshAccount(id) {
    setWorking(`refresh-${id}`);
    setMessage(null);
    try {
      const payload = await parseJsonResponse(await fetch("/api/portal/plaid/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }));
      setAccounts(payload.accounts || []);
      setMessage({ type: "success", text: "Bank connection refreshed." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setWorking("");
    }
  }

  async function disconnectAccount(id) {
    setWorking(`disconnect-${id}`);
    setMessage(null);
    try {
      const payload = await parseJsonResponse(await fetch("/api/portal/plaid/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }));
      setAccounts(payload.accounts || []);
      setMessage({ type: "success", text: "Bank account disconnected." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setWorking("");
    }
  }

  return (
    <section className="mt-8 border border-white/10 bg-[#111613] p-6 shadow-xl shadow-black/10 md:p-8">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Secure Banking</p>
          <h3 className="mt-2 font-serif text-3xl leading-tight md:text-4xl">Connected Bank Accounts</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">Connect an approved bank account for future ACH readiness, balance verification, investor deposits, borrower repayments, and distribution workflows. No money movement is enabled in this phase.</p>
        </div>
        <button type="button" onClick={connectAccount} disabled={Boolean(working)} className="w-full bg-[#d5ad62] px-6 py-4 text-xs font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a] disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto">
          {working === "exchange" ? "Saving Connection..." : working === "connect" ? "Connecting..." : "Connect Bank Account"}
        </button>
      </div>

      {message && <div className={`mt-5 border p-4 text-sm leading-6 ${message.type === "success" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100" : "border-red-300/30 bg-red-400/10 text-red-100"}`}>{message.text}</div>}

      {loading && <div className="mt-6 border border-white/10 bg-white/[0.04] p-5 text-sm text-white/60">Loading connected bank accounts...</div>}

      {!loading && !connectedAccounts.length && <div className="mt-6 border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-white/60">No bank accounts are currently connected to your investor profile.</div>}

      {!!connectedAccounts.length && <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {connectedAccounts.map((account) => (
          <article key={account.id} className="border border-white/10 bg-[#0b120f] p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-white/5">
                {account.institutionLogo ? <img src={logoSrc(account.institutionLogo)} alt="" className="h-full w-full object-contain p-2" /> : <span className="text-sm font-black text-[#d5ad62]">NVC</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><StatusBadge status={account.connectionStatus} /><span className="text-[10px] font-black uppercase tracking-wide text-white/45">Connected {formatDate(account.createdAt)}</span></div>
                <h4 className="mt-3 text-lg font-black leading-tight text-white">{account.institutionName}</h4>
                <p className="mt-1 text-sm text-white/65">{account.accountName} ending in {account.accountMask || "----"}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="border border-white/10 bg-white/[0.04] p-3"><p className="text-[10px] font-black uppercase text-white/45">Nickname</p><p className="mt-1 text-sm font-bold text-white">{account.accountName}</p></div>
              <div className="border border-white/10 bg-white/[0.04] p-3"><p className="text-[10px] font-black uppercase text-white/45">Last Four</p><p className="mt-1 text-sm font-bold text-white">{account.accountMask || "----"}</p></div>
              <div className="border border-white/10 bg-white/[0.04] p-3"><p className="text-[10px] font-black uppercase text-white/45">Type</p><p className="mt-1 text-sm font-bold capitalize text-white">{[account.accountType, account.accountSubtype].filter(Boolean).join(" / ") || "Account"}</p></div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => refreshAccount(account.id)} disabled={Boolean(working)} className="border border-[#d5ad62]/60 px-4 py-3 text-xs font-black uppercase text-[#d5ad62] hover:bg-[#d5ad62] hover:text-[#11100b] disabled:opacity-60">{working === `refresh-${account.id}` ? "Refreshing..." : "Refresh Account Connection"}</button>
              <button type="button" onClick={() => disconnectAccount(account.id)} disabled={Boolean(working)} className="border border-white/15 px-4 py-3 text-xs font-black uppercase text-white/70 hover:border-red-300/50 hover:text-red-100 disabled:opacity-60">{working === `disconnect-${account.id}` ? "Disconnecting..." : "Disconnect Bank Account"}</button>
            </div>
          </article>
        ))}
      </div>}
    </section>
  );
}
