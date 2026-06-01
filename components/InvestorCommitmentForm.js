import { useState } from "react";
import { Panel } from "./InvestorPortalCards";
import { currency } from "../lib/investorPortalMockData";

const fundingMethod = "Credit Card Payment";
const creditCardFeeRate = 0.035;

export default function InvestorCommitmentForm({ deal }) {
  const [amount, setAmount] = useState(deal.minimumInvestment);
  const [accredited, setAccredited] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const numericAmount = Number(amount || 0);
  const creditCardFee = numericAmount * creditCardFeeRate;
  const estimatedTotal = numericAmount + creditCardFee;

  async function submit(event) {
    event.preventDefault();
    setError("");
    setProcessing(true);

    try {
      const response = await fetch("/api/portal/create-checkout-session", {
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
      if (result.url) window.location.href = result.url;
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6">
      <Panel eyebrow="Private Investor Commitment" title="Submit a commitment request">
        <p className="mb-5 leading-7">This workflow records your requested commitment for New Vine Capital review. Credit card payment is available for approved investors when online funding is selected. A 3.5% credit card processing fee applies. All commitments remain subject to suitability review, allocation availability, final documents, and offering terms.</p>
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
        <div className="border border-[#d5ad62]/40 bg-[#d5ad62]/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{fundingMethod}</p>
          <p className="mt-3 text-sm leading-6 text-white/60">You will be redirected to the secure New Vine Capital payment page. Payment details are handled by our payment processor and are not stored by this portal.</p>
          <p className="mt-4 text-sm font-bold leading-6 text-white">A 3.5% credit card processing fee applies.</p>
        </div>
      </Panel>

      <Panel eyebrow="Step 4" title="Review Summary">
        <div className="grid gap-3 text-sm">
          <p><strong className="text-white">Opportunity:</strong> {deal.name}</p>
          <p><strong className="text-white">Requested commitment:</strong> {currency(numericAmount)}</p>
          <p><strong className="text-white">Credit card processing fee:</strong> 3.5% ({currency(creditCardFee)})</p>
          <p><strong className="text-white">Estimated payment total:</strong> {currency(estimatedTotal)}</p>
          <p><strong className="text-white">Funding method:</strong> {fundingMethod}</p>
          <p><strong className="text-white">Important:</strong> All commitments remain subject to approval, suitability review, allocation availability, and offering documents.</p>
        </div>
      </Panel>

      {error && <div className="border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}

      <button disabled={!accredited || processing} className="w-full bg-[#d5ad62] px-6 py-4 text-sm font-black uppercase text-[#11100b] disabled:opacity-40">
        {processing ? "Processing..." : "Continue to Secure Payment"}
      </button>
    </form>
  );
}
