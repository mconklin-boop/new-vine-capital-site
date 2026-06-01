import { getInvestorDeal } from "../../../lib/investorPortalDb";
import { canViewOfferingDocuments, getPortalSession, logPortalEvent } from "../../../lib/portalAuth";
import { getStripe, getSiteUrl } from "../../../lib/stripeServer";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

function toCents(amount) {
  return Math.round(Number(amount) * 100);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await getPortalSession(req);
  if (!user) return res.status(403).json({ error: "Investor login required" });
  if (!canViewOfferingDocuments(user)) return res.status(403).json({ error: "Approved investor access required" });

  const { deal_id, amount, funding_method, accreditation_confirmed } = req.body || {};
  const numericAmount = Number(amount);

  if (!deal_id || !numericAmount || numericAmount <= 0 || !funding_method || !accreditation_confirmed) {
    return res.status(400).json({ error: "Missing payment details" });
  }

  const deal = await getInvestorDeal(deal_id, { fallback: false });
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
      status: "Stripe Checkout Created",
      payment_status: "Pending",
    })
    .select("*")
    .single();

  if (error) return res.status(500).json({ error: error.message });

  const siteUrl = getSiteUrl(req);
  const stripe = getStripe();
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    client_reference_id: commitment.id,
    success_url: `${siteUrl}/investor/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/investor/deals/${deal.id}?payment=cancelled`,
    submit_type: "pay",
    payment_method_types: ["card", "us_bank_account"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: toCents(numericAmount),
          product_data: {
            name: `${deal.name} Commitment`,
            description: "New Vine Capital investor commitment funding",
            metadata: {
              deal_id: deal.id,
              commitment_id: commitment.id,
            },
          },
        },
      },
    ],
    metadata: {
      commitment_id: commitment.id,
      investor_id: user.id,
      investor_email: user.email,
      deal_id: deal.id,
      deal_name: deal.name,
    },
  });

  await supabase
    .from("investor_commitments")
    .update({ stripe_checkout_session_id: checkoutSession.id })
    .eq("id", commitment.id);

  await logPortalEvent({
    type: "stripe_checkout_created",
    userId: user.id,
    email: user.email,
    resourceType: "investor_commitment",
    resourceId: commitment.id,
    metadata: { deal_id, amount: numericAmount, funding_method, stripe_checkout_session_id: checkoutSession.id },
  });

  return res.status(200).json({ url: checkoutSession.url });
}
