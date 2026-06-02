import { useState } from "react";
import { Panel } from "./InvestorPortalCards";
import { currency } from "../lib/investorPortalMockData";

const fundingMethods = ["ACH Transfer", "Wire Transfer"];

const fundingInstructions = [
  ["ACH Transfer", "ACH instructions will be provided by New Vine Capital after your commitment is reviewed and approved."],
  ["Wire Transfer", "Wire instructions will be released as a private Funding Instructions document in your investor portal after your commitment is reviewed and approved."],
];

export default function InvestorCommitmentForm({ deal }) {
  const [amount, setAmount] = useState(deal.minimumInvestment);
  const [fundingMethod, setFundingMethod] = useState("ACH Transfer");
  const [accredited, setAccredited] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const numericAmount = Number(amount || 0);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setProcessing(true);

    try {
      const response = await fetch("/api/portal/investor-commitments", {
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
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setProcessing(false);
    }
  }

  if (submitted) {
    return (
      <Panel eyebrow="Commitment Received" title="Funding instructions will be available after review.">
        <div className="grid gap-4 text-sm leading-7 text-white/70">
          <p>Your commitment request for {currency(numericAmount)} in {deal.name} has been received for New Vine Capital review.</p>
          <p>No payment has been processed through this portal. Funding instructions are released only after approval, suitability review, allocation availability, and completion of applicable offering documents.</p>
          <div className="grid gap-3 md:grid-cols-2">
            {fundingInstructions.map(([title, copy]) => (
              <div key={title} className="border border-[#d5ad62]/30 bg-[#d5ad62]/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{title}</p>
                <p className="mt-3 text-white/65">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-6">
      <Panel eyebrow="Private Investor Commitment" title="Submit a commitment request">
        <p className="mb-5 leading-7">This workflow records your requested commitment for New Vine Capital review. ACH and wire funding instructions are provided only after approval, suitability review, allocation availability, final documents, and offering terms.</p>
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
        <div className="grid gap-3 md:grid-cols-2">
          {fundingMethods.map((method) => (
            <button type="button" key={method} onClick={() => setFundingMethod(method)} className={`border px-4 py-4 text-xs font-black uppercase ${fundingMethod === method ? "border-[#d5ad62] bg-[#d5ad62] text-[#11100b]" : "border-white/10 bg-white/5 text-white/65"}`}>
              {method}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-white/50">Bank funding details are not displayed publicly. Wire instructions are released through a private Funding Instructions document in the investor portal only after New Vine Capital review and approval.</p>
      </Panel>

      <Panel eyebrow="Step 4" title="Review Summary">
        <div className="grid gap-3 text-sm">
          <p><strong className="text-white">Opportunity:</strong> {deal.name}</p>
          <p><strong className="text-white">Requested commitment:</strong> {currency(numericAmount)}</p>
          <p><strong className="text-white">Funding method:</strong> {fundingMethod}</p>
          <p><strong className="text-white">Important:</strong> All commitments remain subject to approval, suitability review, allocation availability, and offering documents. No payment is processed by this form.</p>
        </div>
      </Panel>

      {error && <div className="border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}

      <button disabled={!accredited || processing} className="w-full bg-[#d5ad62] px-6 py-4 text-sm font-black uppercase text-[#11100b] disabled:opacity-40">
        {processing ? "Submitting..." : "Submit Commitment Request"}
      </button>
    </form>
  );
}
