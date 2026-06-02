export const mockInvestor = {
  name: "",
  entityName: "",
  email: "",
  phone: "",
  accreditationStatus: "Under review",
  preferredInvestmentType: "Not specified",
  riskTolerance: "Not specified",
  fundingMethod: "ACH / Wire instructions after approval",
  taxDeliveryPreference: "Electronic delivery",
};

export const portalNotifications = [];
export const portalActivity = [];
export const deals = [];
export const dealDocuments = [];
export const dealUpdates = [];
export const distributions = [];

export const platformMetrics = {
  totalCapitalDeployed: "$0",
  totalInvestorCommitments: "$0",
  transactionsFunded: "0",
  activeStrategies: "0",
  activeOpportunities: "0",
  marketsServed: "Nationwide",
  averageDealDuration: "Varies by strategy",
  capitalCurrentlyAllocated: "$0",
  distributionsProcessed: "$0",
};

export const platformTimeline = [];

export const investorSummary = {
  totalCommittedCapital: 0,
  totalFundedCapital: 0,
  activeInvestments: 0,
  pendingDocuments: 0,
  pendingCommitments: 0,
  projectedAnnualReturn: "Not available",
  upcomingDistributions: "No upcoming distributions",
  pendingFundingStatus: "No pending funding items",
};

export function currency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
}

export function fundedPercent(deal) {
  if (!deal?.totalRaise) return 0;
  return Math.min(100, Math.round(((deal.amountFunded || 0) / deal.totalRaise) * 100));
}

export function findDeal(id) {
  return deals.find((deal) => deal.id === id);
}
