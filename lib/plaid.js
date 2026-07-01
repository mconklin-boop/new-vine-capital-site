import crypto from "crypto";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

function splitEnvList(value, fallback) {
  return String(value || fallback)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getPlaidClient() {
  const clientId = process.env.PLAID_CLIENT_ID;
  const secret = process.env.PLAID_SECRET;
  const env = process.env.PLAID_ENV || "production";
  const basePath = PlaidEnvironments[env];

  if (!clientId || !secret || !basePath) {
    throw new Error("Missing Plaid environment variables.");
  }

  const configuration = new Configuration({
    basePath,
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": clientId,
        "PLAID-SECRET": secret,
      },
    },
  });

  return new PlaidApi(configuration);
}

export function getPlaidProducts() {
  return splitEnvList(process.env.PLAID_PRODUCTS, "auth");
}

export function getPlaidCountryCodes() {
  return splitEnvList(process.env.PLAID_COUNTRY_CODES, "US");
}

function getTokenEncryptionKey() {
  const secret = process.env.PLAID_TOKEN_ENCRYPTION_KEY;
  if (!secret || secret.length < 24) {
    throw new Error("Missing PLAID_TOKEN_ENCRYPTION_KEY. Use a long random secret stored only in Vercel environment variables.");
  }

  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptPlaidAccessToken(accessToken) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getTokenEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(accessToken, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Plaid access tokens are stored encrypted at rest and are never returned to the browser.
  return ["v1", iv.toString("base64"), tag.toString("base64"), ciphertext.toString("base64")].join(":");
}

export function decryptPlaidAccessToken(encryptedValue) {
  const [version, ivValue, tagValue, ciphertextValue] = String(encryptedValue || "").split(":");
  if (version !== "v1" || !ivValue || !tagValue || !ciphertextValue) {
    throw new Error("Invalid encrypted Plaid token format.");
  }

  const decipher = crypto.createDecipheriv("aes-256-gcm", getTokenEncryptionKey(), Buffer.from(ivValue, "base64"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextValue, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

export function safePlaidAccount(row) {
  return {
    id: row.id,
    institutionId: row.institution_id || "",
    institutionName: row.institution_name || "Connected Institution",
    institutionLogo: row.institution_logo || "",
    accountId: row.account_id,
    accountName: row.account_name || "Bank Account",
    accountMask: row.account_mask || "",
    accountType: row.account_type || "",
    accountSubtype: row.account_subtype || "",
    connectionStatus: row.connection_status || "connected",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
