import { getPortalSession, logPortalEvent } from "../../../lib/portalAuth";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const user = await getPortalSession(req);
  if (!user) return res.status(403).json({ error: "Investor login required" });
  const { deal_id, amount, funding_method, accreditation_confirmed } = req.body || {};
  if (!deal_id || !amount || !funding_method || !accreditation_confirmed) return res.status(400).json({ error: "Missing commitment details" });
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("investor_commitments").insert({ investor_id: user.id, deal_id, amount: Number(amount), funding_method, accreditation_confirmed: Boolean(accreditation_confirmed), status: "Received" }).select("*").single();
  if (error) return res.status(500).json({ error: error.message });
  await logPortalEvent({ type: "investor_commitment_submit", userId: user.id, email: user.email, resourceType: "investor_commitment", resourceId: data.id, metadata: { deal_id, amount, funding_method } });
  return res.status(201).json({ commitment: data });
}
