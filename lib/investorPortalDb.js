import { deals as mockDeals, dealDocuments as mockDocuments, dealUpdates as mockUpdates, distributions as mockDistributions, portalNotifications as mockNotifications, investorSummary as mockSummary, findDeal as findMockDeal } from "./investorPortalMockData";
import { getSupabaseAdmin } from "./supabaseAdmin";

const legacyPlaceholderDealIds = new Set(["maple-bridge-note", "denver-gap-funding-note", "southeast-preferred-equity"]);

function isLegacyPlaceholderDealId(id) {
  return legacyPlaceholderDealIds.has(id);
}

function normalizeDeal(row) {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    investmentType: row.investment_type,
    targetReturn: row.target_return,
    minimumInvestment: Number(row.minimum_investment || 0),
    totalRaise: Number(row.total_raise || 0),
    amountFunded: Number(row.amount_funded || 0),
    status: row.status,
    term: row.term || "",
    preferredReturn: row.preferred_return || "N/A",
    ltv: row.ltv || "N/A",
    equityMultiple: row.equity_multiple || "N/A",
    summary: row.summary || "",
    businessPlan: row.business_plan || "",
    sponsorNotes: row.sponsor_notes || "",
    timeline: Array.isArray(row.timeline) ? row.timeline : [],
    capitalStack: Array.isArray(row.capital_stack) ? row.capital_stack : [],
    sourcesUses: Array.isArray(row.sources_uses) ? row.sources_uses : [],
    sensitivity: row.sensitivity || "",
  };
}

function normalizeDocument(row) {
  return { id: row.id, dealId: row.deal_id || "All", name: row.name, type: row.type, date: row.display_date || "Pending", storagePath: row.storage_path || "" };
}

function normalizeUpdate(row) {
  return { id: row.id, dealId: row.deal_id, title: row.title, date: row.update_date, summary: row.summary };
}

function normalizeDistribution(row) {
  return { id: row.id, investment: row.investment, date: row.distribution_date, amount: Number(row.amount || 0), type: row.type, status: row.status, dealId: row.deal_id };
}

export async function listInvestorDeals({ fallback = true } = {}) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("investor_deals").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    const normalizedDeals = (data || []).map(normalizeDeal).filter((deal) => !isLegacyPlaceholderDealId(deal.id));
    if (!normalizedDeals.length && fallback) return mockDeals;
    return normalizedDeals;
  } catch (error) {
    if (fallback) return mockDeals;
    throw error;
  }
}

export async function getInvestorDeal(id, { fallback = true } = {}) {
  if (isLegacyPlaceholderDealId(id)) return null;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("investor_deals").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!data && fallback) return findMockDeal(id);
    return data ? normalizeDeal(data) : null;
  } catch (error) {
    if (fallback) return findMockDeal(id);
    throw error;
  }
}

export async function listInvestorDocuments({ fallback = true } = {}) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("investor_deal_documents").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    const documents = (data || []).map(normalizeDocument).filter((doc) => !isLegacyPlaceholderDealId(doc.dealId));
    if (!documents.length && fallback) return mockDocuments;
    return documents;
  } catch (error) {
    if (fallback) return mockDocuments;
    throw error;
  }
}

export async function listInvestorUpdates({ fallback = true } = {}) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("investor_deal_updates").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    const updates = (data || []).map(normalizeUpdate).filter((update) => !isLegacyPlaceholderDealId(update.dealId));
    if (!updates.length && fallback) return mockUpdates;
    return updates;
  } catch (error) {
    if (fallback) return mockUpdates;
    throw error;
  }
}

export async function listInvestorDistributions({ fallback = true } = {}) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("investor_distributions").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    const distributions = (data || []).map(normalizeDistribution).filter((distribution) => !isLegacyPlaceholderDealId(distribution.dealId));
    if (!distributions.length && fallback) return mockDistributions;
    return distributions;
  } catch (error) {
    if (fallback) return mockDistributions;
    throw error;
  }
}

export async function getInvestorDashboardData() {
  const [deals, documents, updates, distributions] = await Promise.all([
    listInvestorDeals(),
    listInvestorDocuments(),
    listInvestorUpdates(),
    listInvestorDistributions(),
  ]);
  const totalCommittedCapital = deals.reduce((sum, deal) => sum + Math.min(deal.amountFunded, deal.totalRaise), 0);
  const totalFundedCapital = Math.round(totalCommittedCapital * 0.72);
  return {
    deals,
    documents,
    updates,
    distributions,
    notifications: mockNotifications,
    summary: deals.length ? {
      totalCommittedCapital,
      totalFundedCapital,
      activeInvestments: deals.length,
      projectedAnnualReturn: "Target returns vary by deal",
      upcomingDistributions: "Projected distributions shown in reporting",
      pendingFundingStatus: "Commitments managed by admin review",
    } : mockSummary,
  };
}

export function parseList(value) {
  if (!value) return [];
  return String(value).split("\n").map((item) => item.trim()).filter(Boolean);
}

export function parsePairs(value) {
  return parseList(value).map((line) => {
    const [label, ...rest] = line.split("|");
    return [label?.trim() || "Item", rest.join("|").trim() || "TBD"];
  });
}
