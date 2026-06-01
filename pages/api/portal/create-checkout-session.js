import { getInvestorDeal } from "../../../lib/investorPortalDb";
import { canViewOfferingDocuments, getPortalSession, logPortalEvent } from "../../../lib/portalAuth";
import { createStripeCheckoutSession, getSiteUrl } from "../../../lib/stripeServer";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

const creditCardFeeRate = 0.035;

function toCents(amount) {
  return Math.round(Number(amount) * 100);
}

function appendMetadata(params, prefix, metadata) {
  Object.entries(metadata).forEach(([key, value]) => {
    const name = prefix ? `${prefix}[metadata][${key}]` : `metadata[${key}]`;
    params.append(name, String(value));
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await getPortalSession(req);
  if (!user) return res.status(403).json({ error: "Investor login required" });
  if (!canViewOfferingDocuments(user)) return res.status(403).json({ error: "Approved investor access required" });

  const { deal_id, amount, funding_method, accreditation_confirmed } = req.body || {};
  const numericAmount = Number(amount);
  const creditCardFee = numericAmount * creditCardFeeRate;
  const paymentTotal = numericAmount + creditCardFee;

  if (!deal_id || !numericAmount || numericAmount <= 0 || !funding_method || !accreditation_confirmed) {
    return res.status(400).json({ error: "Missing payment details" });
  }

  const deal = await getInvestorDeal(deal_id);
  if (!deal) return res.status(404).json({ error: "Opportunity not found" });
  if (numericAmount < Number(deal.minimumInvestment || 0)) {
    return res.status(400).json({ error: "Amount is below the minimum investment" });
  }

  const supabase = getSupabaseAdmin();
  const { data: commitment, error } = await supabase
    .from("investor_commitments")
    .insert({
      investor_id: user.id,
      deal_id,
      amount: numericAmount,
      funding_method,
      accreditation_confirmed: Boolean(accreditation_confirmed),
      status: "Received",
    })
    .select("*")
    .single();

  if (error) return res.status(500).json({ error: error.message });

  try {
    const siteUrl = getSiteUrl(req);
    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("customer_email", user.email);
    params.append("client_reference_id", commitment.id);
    params.append("success_url", `${siteUrl}/investor/payment-success?session_id={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${siteUrl}/investor/deals/${deal.id}?payment=cancelled`);
    params.append("submit_type", "pay");
    params.append("payment_method_types[0]", "card");
    params.append("line_items[0][quantity]", "1");
    params.append("line_items[0][price_data][currency]", "usd");
    params.append("line_items[0][price_data][unit_amount]", String(toCents(paymentTotal)));
    params.append("line_items[0][price_data][product_data][name]", `${deal.name} Commitment`);
    params.append("line_items[0][price_data][product_data][description]", "New Vine Capital investor commitment funding including 3.5% credit card processing fee");
    appendMetadata(params, "line_items[0][price_data][product_data]", {
      deal_id: deal.id,
      commitment_id: commitment.id,
    });
    appendMetadata(params, "", {
      commitment_id: commitment.id,
      investor_id: user.id,
      investor_email: user.email,
      deal_id: deal.id,
      deal_name: deal.name,
      commitment_amount: numericAmount,
      credit_card_fee: creditCardFee.toFixed(2),
      payment_total: paymentTotal.toFixed(2),
    });

    const checkoutSession = await createStripeCheckoutSession(params);

    await logPortalEvent({
      type: "stripe_checkout_created",
      userId: user.id,
      email: user.email,
      resourceType: "investor_commitment",
      resourceId: commitment.id,
      metadata: { deal_id, amount: numericAmount, credit_card_fee: creditCardFee, payment_total: paymentTotal, funding_method, stripe_checkout_session_id: checkoutSession.id },
    });

    return res.status(200).json({ url: checkoutSession.url });
  } catch (stripeError) {
    await logPortalEvent({
      type: "stripe_checkout_error",
      userId: user.id,
      email: user.email,
      resourceType: "investor_commitment",
      resourceId: commitment.id,
      metadata: { deal_id, amount: numericAmount, funding_method, error: stripeError.message },
    });

    return res.status(500).json({ error: stripeError.message });
  }
}
