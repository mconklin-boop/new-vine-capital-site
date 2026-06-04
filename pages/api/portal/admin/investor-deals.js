import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { parseList, parsePairs } from "../../../../lib/investorPortalDb";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

function slugify(value) {
  return String(value || "deal").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

async function requireAdmin(req, res) {
  const user = await getPortalSession(req, res);
  if (!user || user.role !== "Admin") {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }
  return user;
}

function dealPayload(body) {
  return {
    id: body.id || slugify(body.name),
    name: body.name,
    location: body.location,
    investment_type: body.investment_type,
    target_return: body.target_return,
    minimum_investment: Number(body.minimum_investment || 0),
    total_raise: Number(body.total_raise || 0),
    amount_funded: Number(body.amount_funded || 0),
    status: body.status || "Open",
    term: body.term || null,
    preferred_return: body.preferred_return || null,
    ltv: body.ltv || null,
    equity_multiple: body.equity_multiple || null,
    summary: body.summary || null,
    business_plan: body.business_plan || null,
    sponsor_notes: body.sponsor_notes || null,
    timeline: parseList(body.timeline),
    capital_stack: parsePairs(body.capital_stack),
    sources_uses: parsePairs(body.sources_uses),
    sensitivity: body.sensitivity || null,
    updated_at: new Date().toISOString(),
  };
}

async function replaceDealAssignments(supabase, dealId, body) {
  const assignmentType = body.assignment_type || "all";
  const profileId = body.profile_id || null;

  const { error: deleteError } = await supabase.from("investor_deal_assignments").delete().eq("deal_id", dealId);
  if (deleteError) throw deleteError;

  const assignment = assignmentType === "specific"
    ? { deal_id: dealId, profile_id: profileId, role: null }
    : { deal_id: dealId, profile_id: null, role: "Approved Investor" };

  if (assignmentType === "specific" && !profileId) {
    throw new Error("Select a specific investor or choose All Approved Investors");
  }

  const { error } = await supabase.from("investor_deal_assignments").insert(assignment);
  if (error) throw error;
  return assignment;
}

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  const supabase = getSupabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await supabase.from("investor_deals").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ deals: data || [] });
  }

  if (req.method === "POST") {
    const payload = dealPayload(req.body || {});
    if (!payload.name || !payload.location || !payload.investment_type || !payload.target_return) return res.status(400).json({ error: "Missing required deal fields" });
    const { data, error } = await supabase.from("investor_deals").upsert(payload).select("*").single();
    if (error) return res.status(500).json({ error: error.message });

    try {
      const assignment = await replaceDealAssignments(supabase, data.id, req.body || {});
      await logPortalEvent({ type: "admin_investor_deal_upsert", userId: admin.id, email: admin.email, resourceType: "investor_deal", metadata: { id: data.id, name: data.name, assignment } });
      return res.status(201).json({ deal: data, assignment });
    } catch (assignmentError) {
      return res.status(500).json({ error: assignmentError.message });
    }
  }

  if (req.method === "PATCH") {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: "Missing deal id" });
    const payload = dealPayload(req.body || {});
    delete payload.id;
    const { data, error } = await supabase.from("investor_deals").update(payload).eq("id", id).select("*").single();
    if (error) return res.status(500).json({ error: error.message });

    try {
      const assignment = await replaceDealAssignments(supabase, id, req.body || {});
      await logPortalEvent({ type: "admin_investor_deal_update", userId: admin.id, email: admin.email, resourceType: "investor_deal", metadata: { id, assignment } });
      return res.status(200).json({ deal: data, assignment });
    } catch (assignmentError) {
      return res.status(500).json({ error: assignmentError.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
