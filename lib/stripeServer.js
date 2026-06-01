export function getStripeSecretKey() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
  }

  return process.env.STRIPE_SECRET_KEY;
}

export function getSiteUrl(req) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${protocol}://${host}`;
}

export async function createStripeCheckoutSession(params) {
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getStripeSecretKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Unable to create Stripe Checkout session");
  }

  return data;
}
