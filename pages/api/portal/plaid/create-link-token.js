import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { getPlaidClient, getPlaidCountryCodes, getPlaidProducts } from "../../../../lib/plaid";

const DEFAULT_PLAID_REDIRECT_URI = "https://www.newvinecapital.com/investor/profile";
const DEFAULT_PLAID_WEBHOOK_URL = "https://www.newvinecapital.com/api/plaid/webhook";

function plaidSetupError(error) {
  const plaidError = error?.response?.data;
  if (!plaidError) return "Unable to start secure bank connection. Please check Plaid environment variables in Vercel.";

  const code = plaidError.error_code || plaidError.error_type || "PLAID_ERROR";
  const message = plaidError.display_message || plaidError.error_message || "Plaid rejected the Link token setup.";
  return `Plaid setup error (${code}): ${message}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const user = await getPortalSession(req, res);
  if (!user) return res.status(401).json({ error: "Investor portal login required." });

  try {
    const plaid = getPlaidClient();
    const redirectUri = process.env.PLAID_REDIRECT_URI || DEFAULT_PLAID_REDIRECT_URI;
    const webhookUrl = process.env.PLAID_WEBHOOK_URL || DEFAULT_PLAID_WEBHOOK_URL;
    const response = await plaid.linkTokenCreate({
      user: { client_user_id: user.id },
      client_name: "New Vine Capital",
      products: getPlaidProducts(),
      country_codes: getPlaidCountryCodes(),
      language: "en",
      redirect_uri: redirectUri,
      webhook: webhookUrl,
      account_filters: {
        depository: {
          account_subtypes: ["checking", "savings"],
        },
      },
    });

    await logPortalEvent({ type: "plaid_link_token_created", userId: user.id, email: user.email, resourceType: "plaid_link", metadata: { redirectUri, webhookUrl } });
    return res.status(200).json({ linkToken: response.data.link_token, expiration: response.data.expiration, redirectUri });
  } catch (error) {
    const safeMessage = plaidSetupError(error);
    const plaidError = error?.response?.data;
    console.error("Plaid link token creation failed", plaidError || error);
    await logPortalEvent({
      type: "plaid_link_token_failed",
      userId: user.id,
      email: user.email,
      resourceType: "plaid_link",
      metadata: {
        message: error.message,
        plaidErrorCode: plaidError?.error_code || null,
        plaidErrorType: plaidError?.error_type || null,
        plaidRequestId: plaidError?.request_id || null,
      },
    });
    return res.status(500).json({ error: safeMessage });
  }
}
