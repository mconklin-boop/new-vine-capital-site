import { deals as mockDeals, dealDocuments as mockDocuments, dealUpdates as mockUpdates, distributions as mockDistributions, portalNotifications as mockNotifications, portalActivity as mockActivity, platformMetrics as mockPlatformMetrics, platformTimeline as mockPlatformTimeline, investorSummary as mockSummary, findDeal as findMockDeal } from "./investorPortalMockData";
import { getSupabaseAdmin } from "./supabaseAdmin";

const legacyPlaceholderDealIds = new Set(["maple-bridge-note", "denver-gap-funding-note", "southeast-preferred-equity"]);

function isLegacyPlaceholderDealId(id) {
  return legacyPlaceholderDealIds.has(id);
}

function fallbackDealFields(id) {
  const mock = findMockDeal(id);
  return mock || {};
}

function normalizeDeal(row) {
  const fallback = fallbackDealFields(row.id);
  return {
    ...fallback,
    id: row.id,
    name: row.name,
    location: row.location,
    investmentType: row.investment_type,
    targetReturn: row.target_return,
    minimumInvestment: Number(row.minimum_investment || 0),
    totalRaise: Number(row.total_raise || 0),
    amountFunded: Number(row.amount_funded || 0),
    status: row.status,
    term: row.term || fallback.term || "",
    distributionFrequency: row.distribution_frequency || fallback.distributionFrequency || "Subject to offering documents",
    preferredReturn: row.preferred_return || fallback.preferredReturn || "N/A",
    ltv: row.ltv || fallback.ltv || "N/A",
    equityMultiple: row.equity_multiple || fallback.equityMultiple || "N/A",
    summary: row.summary || fallback.summary || "",
    strategyDescription: row.strategy_description || fallback.strategyDescription || "",
    businessPlan: row.business_plan || fallback.businessPlan || "",
    sponsorNotes: row.sponsor_notes || fallback.sponsorNotes || "",
    timeline: Array.isArray(row.timeline) ? row.timeline : fallback.timeline || [],
    capitalStack: Array.isArray(row.capital_stack) ? row.capital_stack : fallback.capitalStack || [],
    sourcesUses: Array.isArray(row.sources_uses) ? row.sources_uses : fallback.sourcesUses || [],
    sensitivity: row.sensitivity || fallback.sensitivity || "",
    categories: fallback.categories || ["Private Credit"],
    visualType: fallback.visualType || "capital-stack",
    whyInvestorsLikeThis: fallback.whyInvestorsLikeThis || [],
    reviewProcess: fallback.reviewProcess || [],
    riskNotes: fallback.riskNotes || [],
    exclusivityNotes: fallback.exclusivityNotes || [],
  };
}

function normalizeDocument(row) {
  return { id: row.id, dealId: row.deal_id || "All", name: row.name, type: row.type, status: row.status || "Needs Review", date: row.display_date || "Pending", storagePath: row.storage_path || "" };
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
  const pendingDocuments = documents.filter((doc) => ["Needs Review", "Pending Upload"].includes(doc.status)).length;
  const pendingCommitments = deals.filter((deal) => deal.status === "Open" || deal.status === "Pending Review").length;
  return {
    deals,
    documents,
    updates,
    distributions,
    notifications: mockNotifications,
    activity: mockActivity,
    platformMetrics: mockPlatformMetrics,
    platformTimeline: mockPlatformTimeline,
    summary: deals.length ? {
      totalCommittedCapital,
      totalFundedCapital,
      activeInvestments: deals.length,
      pendingDocuments,
      pendingCommitments,
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
