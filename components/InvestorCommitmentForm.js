import { useState } from "react";
import { Panel } from "./InvestorPortalCards";
import { currency } from "../lib/investorPortalMockData";

const fundingMethods = ["Stripe Checkout", "Wire", "ACH", "SDIRA", "Manual"];

export default function InvestorCommitmentForm({ deal }) {
  const [amount, setAmount] = useState(deal.minimumInvestment);
  const [fundingMethod, setFundingMethod] = useState("Stripe Checkout");
  const [accredited, setAccredited] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    setProcessing(true);

    try {
      const endpoint = fundingMethod === "Stripe Checkout" ? "/api/portal/create-checkout-session" : "/api/portal/investor-commitments";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deal_id: deal.id,
          amount,
          funding_method: fundingMethod,
          accreditation_confirmed: accredited,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to submit commitment request");
      if (result.url) {
        window.location.href = result.url;
        return;
      }
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setProcessing(false);
    }
  }

  if (submitted) {
    return (
      <Panel eyebrow="Commitment Received" title="Funding instructions will be available in your portal.">
        <p className="leading-8">Your commitment for {currency(Number(amount || 0))} in {deal.name} has been received for review. Funding instructions and final documents are provided only after approval and completion of applicable requirements.</p>
      </Panel>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-6">
      <Panel eyebrow="Private Investor Commitment" title="Submit a commitment request">
        <p className="mb-5 leading-7">This workflow records your requested commitment for New Vine Capital review. Stripe Checkout is available for approved investors when online funding is selected. All commitments remain subject to suitability review, allocation availability, final documents, and offering terms.</p>
        <label className="grid gap-2 text-sm font-bold text-white/70">
          Amount
          <input type="number" min={deal.minimumInvestment} step="100" value={amount} onChange={(event) => setAmount(event.target.value)} className="border border-white/10 bg-[#050605] px-4 py-3 text-white" />
        </label>
        <p className="mt-3 text-sm text-white/50">Minimum investment: {currency(deal.minimumInvestment)}</p>
      </Panel>

      <Panel eyebrow="Step 2" title="Investor Accreditation">
        <label className="flex gap-3 text-sm leading-6 text-white/70">
          <input type="checkbox" checked={accredited} onChange={(event) => setAccredited(event.target.checked)} className="mt-1" />
          I confirm that my investor status and suitability information is accurate and subject to New Vine Capital review.
        </label>
      </Panel>

      <Panel eyebrow="Step 3" title="Funding Method">
        <div className="grid gap-3 md:grid-cols-5">
          {fundingMethods.map((method) => (
            <button type="button" key={method} onClick={() => setFundingMethod(method)} className={`border px-4 py-3 text-xs font-black uppercase ${fundingMethod === method ? "border-[#d5ad62] bg-[#d5ad62] text-[#11100b]" : "border-white/10 bg-white/5 text-white/65"}`}>
              {method}
            </button>
          ))}
        </div>
        {fundingMethod === "Stripe Checkout" && <p className="mt-4 text-sm leading-6 text-white/50">You will be redirected to the secure New Vine Capital Stripe Checkout page. Payment details are handled by Stripe and are not stored by this portal.</p>}
      </Panel>

      <Panel eyebrow="Step 4" title="Review Summary">
        <div className="grid gap-3 text-sm">
          <p><strong className="text-white">Opportunity:</strong> {deal.name}</p>
          <p><strong className="text-white">Requested commitment:</strong> {currency(Number(amount || 0))}</p>
          <p><strong className="text-white">Funding method:</strong> {fundingMethod}</p>
          <p><strong className="text-white">Important:</strong> All commitments remain subject to approval, suitability review, allocation availability, and offering documents.</p>
        </div>
      </Panel>

      {error && <div className="border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}

      <button disabled={!accredited || processing} className="w-full bg-[#d5ad62] px-6 py-4 text-sm font-black uppercase text-[#11100b] disabled:opacity-40">
        {processing ? "Processing..." : fundingMethod === "Stripe Checkout" ? "Continue to Secure Payment" : "Submit Commitment Request"}
      </button>
    </form>
  );
}
