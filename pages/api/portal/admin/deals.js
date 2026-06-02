import { getPortalSession, logPortalEvent } from "../../../../lib/portalAuth";
import { parseList, parsePairs } from "../../../../lib/investorPortalDb";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

async function requireAdmin(req, res) {
  const user = await getPortalSession(req);
  if (!user || user.role !== "Admin") {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }
  return user;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function money(value) {
  if (value === "" || value === null || value === undefined) return 0;
  return Number(String(value).replace(/[$,]/g, "")) || 0;
}

function categoryList(category) {
  const base = category ? [category] : ["Private Credit"];
  if (!base.includes("Private Credit")) base.push("Private Credit");
  return base;
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
    const body = req.body || {};
    const name = String(body.name || "").trim();
    if (!name) return res.status(400).json({ error: "Opportunity name is required" });

    const id = slugify(body.id || name);
    if (!id) return res.status(400).json({ error: "A valid opportunity name is required" });

    const deal = {
      id,
      name,
      location: body.location || "",
      investment_type: body.investment_type || "Private Credit",
      categories: categoryList(body.category),
      target_return: body.target_return || "Subject to offering documents",
      minimum_investment: money(body.minimum_investment),
      total_raise: money(body.total_raise),
      amount_funded: money(body.amount_funded),
      status: body.status || "Pending Review",
      term: body.term || "Subject to offering documents",
      distribution_frequency: body.distribution_frequency || "Subject to offering documents",
      preferred_return: body.preferred_return || "N/A",
      ltv: body.ltv || "N/A",
      equity_multiple: body.equity_multiple || "N/A",
      summary: body.summary || "",
      strategy_description: body.strategy_description || "",
      business_plan: body.business_plan || "",
      sponsor_notes: body.sponsor_notes || "",
      timeline: parseList(body.timeline),
      capital_stack: parsePairs(body.capital_stack),
      sources_uses: parsePairs(body.sources_uses),
      sensitivity: body.sensitivity || "",
      why_investors_like_this: parseList(body.why_investors_like_this),
      visual_type: body.visual_type || "capital-stack",
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("investor_deals").upsert(deal, { onConflict: "id" }).select("*").single();
    if (error) return res.status(500).json({ error: error.message });

    await supabase.from("investor_deal_assignments").delete().eq("deal_id", id);

    const assignmentType = body.assignment_type || "all";
    let assignment = null;
    if (assignmentType === "specific") {
      if (!body.profile_id) return res.status(400).json({ error: "Select an investor for a specific assignment" });
      assignment = { deal_id: id, profile_id: body.profile_id };
    } else {
      assignment = { deal_id: id, role: "Approved Investor" };
    }

    const { error: assignmentError } = await supabase.from("investor_deal_assignments").insert(assignment);
    if (assignmentError) return res.status(500).json({ error: assignmentError.message });

    await logPortalEvent({ type: "admin_deal_upsert", userId: admin.id, email: admin.email, resourceType: "investor_deal", metadata: { dealId: id, assignmentType } });
    return res.status(201).json({ deal: data, assignment });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
