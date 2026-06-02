import { getSupabaseAdmin } from "./supabaseAdmin";

const defaultReviewProcess = [
  "Borrower or sponsor review",
  "Collateral and value review",
  "Title and lien review",
  "Senior lender review where applicable",
  "Exit strategy review",
  "Final admin approval before capital deployment",
];

const defaultRiskNotes = [
  "Target returns are not guaranteed.",
  "Investments may lose principal.",
  "Liquidity may be limited.",
  "Final terms are controlled by offering documents.",
  "Investor eligibility and suitability review required.",
];

const emptySummary = {
  totalCommittedCapital: 0,
  totalFundedCapital: 0,
  activeInvestments: 0,
  pendingDocuments: 0,
  pendingCommitments: 0,
  projectedAnnualReturn: "Not available",
  upcomingDistributions: "No upcoming distributions",
  pendingFundingStatus: "No pending funding items",
};

function arrayValue(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}

function normalizeDeal(row) {
  return {
    id: row.id,
    name: row.name,
    location: row.location || "",
    investmentType: row.investment_type || "Private Credit",
    targetReturn: row.target_return || "Subject to offering documents",
    minimumInvestment: Number(row.minimum_investment || 0),
    totalRaise: Number(row.total_raise || 0),
    amountFunded: Number(row.amount_funded || 0),
    status: row.status || "Pending Review",
    term: row.term || "Subject to offering documents",
    distributionFrequency: row.distribution_frequency || "Subject to offering documents",
    preferredReturn: row.preferred_return || "N/A",
    ltv: row.ltv || "N/A",
    equityMultiple: row.equity_multiple || "N/A",
    summary: row.summary || "",
    strategyDescription: row.strategy_description || "",
    businessPlan: row.business_plan || "",
    sponsorNotes: row.sponsor_notes || "",
    timeline: arrayValue(row.timeline),
    capitalStack: arrayValue(row.capital_stack),
    sourcesUses: arrayValue(row.sources_uses),
    sensitivity: row.sensitivity || "",
    categories: arrayValue(row.categories, ["Private Credit"]),
    visualType: row.visual_type || "capital-stack",
    whyInvestorsLikeThis: arrayValue(row.why_investors_like_this),
    reviewProcess: arrayValue(row.review_process, defaultReviewProcess),
    riskNotes: arrayValue(row.risk_notes, defaultRiskNotes),
    exclusivityNotes: arrayValue(row.exclusivity_notes, ["Private investor access", "Available only to approved investors", "Allocation subject to availability"]),
  };
}

function normalizeDocument(row) {
  return { id: row.id, dealId: row.deal_id || "All", name: row.name, type: row.type, status: row.status || "Needs Review", date: row.display_date || "Pending", storagePath: row.storage_path || "" };
}

function normalizePortalDocument(row) {
  return { id: row.id, dealId: "All", name: row.name, type: row.category, status: "Needs Review", date: row.upload_date || "Pending", storagePath: row.storage_path || "" };
}

function normalizeUpdate(row) {
  return { id: row.id, dealId: row.deal_id, title: row.title, date: row.update_date, summary: row.summary };
}

function normalizeDistribution(row) {
  return { id: row.id, investment: row.investment, date: row.distribution_date, amount: Number(row.amount || 0), type: row.type, status: row.status, dealId: row.deal_id };
}

function dealIsAssignedToUser(assignments, user) {
  if (!user) return false;
  if (user.role === "Admin") return true;
  return assignments.some((assignment) => {
    return assignment.profile_id === user.id || assignment.role === user.role || assignment.role === user.status;
  });
}

async function getAssignedDealIds(supabase, dealIds, user) {
  const uniqueDealIds = [...new Set(dealIds.filter(Boolean))];
  if (!uniqueDealIds.length) return new Set();
  if (user?.role === "Admin") return new Set(uniqueDealIds);

  try {
    const { data, error } = await supabase
      .from("investor_deal_assignments")
      .select("deal_id, profile_id, role")
      .in("deal_id", uniqueDealIds);
    if (error) throw error;

    return new Set((data || []).filter((assignment) => dealIsAssignedToUser([assignment], user)).map((assignment) => assignment.deal_id));
  } catch (error) {
    return new Set();
  }
}

async function filterRowsByAssignedDeal(supabase, rows, user) {
  if (!user) return [];
  if (user.role === "Admin") return rows;
  const assignedIds = await getAssignedDealIds(supabase, rows.map((row) => row.deal_id), user);
  return rows.filter((row) => row.deal_id && assignedIds.has(row.deal_id));
}

async function listAssignedPortalDocuments(supabase, user) {
  if (!user) return [];
  try {
    if (user.role === "Admin") {
      const { data, error } = await supabase.from("portal_documents").select("*").order("upload_date", { ascending: false });
      if (error) throw error;
      return (data || []).map(normalizePortalDocument);
    }

    const { data: assignments, error: assignmentError } = await supabase
      .from("portal_document_assignments")
      .select("document_id, profile_id, role")
      .or(`profile_id.eq.${user.id},role.eq.${user.role},role.eq.${user.status}`);
    if (assignmentError) throw assignmentError;

    const documentIds = [...new Set((assignments || []).map((assignment) => assignment.document_id).filter(Boolean))];
    if (!documentIds.length) return [];

    const { data, error } = await supabase.from("portal_documents").select("*").in("id", documentIds).order("upload_date", { ascending: false });
    if (error) throw error;
    return (data || []).map(normalizePortalDocument);
  } catch (error) {
    return [];
  }
}

export async function listInvestorDeals({ user } = {}) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("investor_deals").select("*").order("created_at", { ascending: false });
    if (error) throw error;

    const rows = data || [];
    const assignedIds = await getAssignedDealIds(supabase, rows.map((row) => row.id), user);
    return rows.filter((row) => assignedIds.has(row.id)).map(normalizeDeal);
  } catch (error) {
    return [];
  }
}

export async function getInvestorDeal(id, { user } = {}) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("investor_deals").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!data) return null;

    if (user?.role !== "Admin") {
      const { data: assignments, error: assignmentError } = await supabase
        .from("investor_deal_assignments")
        .select("deal_id, profile_id, role")
        .eq("deal_id", id);
      if (assignmentError || !dealIsAssignedToUser(assignments || [], user)) return null;
    }

    return normalizeDeal(data);
  } catch (error) {
    return null;
  }
}

export async function listInvestorDocuments({ user } = {}) {
  try {
    const supabase = getSupabaseAdmin();
    const [{ data, error }, assignedPortalDocuments] = await Promise.all([
      supabase.from("investor_deal_documents").select("*").order("created_at", { ascending: false }),
      listAssignedPortalDocuments(supabase, user),
    ]);
    if (error) throw error;
    const rows = await filterRowsByAssignedDeal(supabase, data || [], user);
    return [...assignedPortalDocuments, ...rows.map(normalizeDocument)];
  } catch (error) {
    return [];
  }
}

export async function listInvestorUpdates({ user } = {}) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("investor_deal_updates").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    const rows = await filterRowsByAssignedDeal(supabase, data || [], user);
    return rows.map(normalizeUpdate);
  } catch (error) {
    return [];
  }
}

export async function listInvestorDistributions({ user } = {}) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("investor_distributions").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    const rows = await filterRowsByAssignedDeal(supabase, data || [], user);
    return rows.map(normalizeDistribution);
  } catch (error) {
    return [];
  }
}

export async function getInvestorDashboardData(user) {
  const [deals, documents, updates, distributions] = await Promise.all([
    listInvestorDeals({ user }),
    listInvestorDocuments({ user }),
    listInvestorUpdates({ user }),
    listInvestorDistributions({ user }),
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
    notifications: [],
    activity: [],
    platformMetrics: {},
    platformTimeline: [],
    summary: deals.length || documents.length || distributions.length ? {
      totalCommittedCapital,
      totalFundedCapital,
      activeInvestments: deals.length,
      pendingDocuments,
      pendingCommitments,
      projectedAnnualReturn: "Subject to offering documents",
      upcomingDistributions: "No upcoming distributions",
      pendingFundingStatus: pendingCommitments ? "Commitments managed by admin review" : "No pending funding items",
    } : emptySummary,
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
