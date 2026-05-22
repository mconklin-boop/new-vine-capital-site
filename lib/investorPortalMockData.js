export const mockInvestor = {
  name: "Michael Conklin",
  entityName: "Conklin Capital Holdings LLC",
  email: "investor@example.com",
  phone: "720-460-0337",
  accreditationStatus: "Verified accredited investor",
  preferredInvestmentType: "Private credit and short-duration real estate debt",
  riskTolerance: "Moderate",
  fundingMethod: "Wire / Manual instructions",
  taxDeliveryPreference: "Electronic delivery",
};

export const portalNotifications = [
  { type: "Opportunity", message: "Transactional Funding Fund is open for approved investor review.", date: "May 21, 2026" },
  { type: "Opportunity", message: "Second Position Lending Fund is open for approved investor review.", date: "May 21, 2026" },
  { type: "Portal Notice", message: "All opportunities remain subject to qualification, suitability review, allocation availability, and offering documents.", date: "May 21, 2026" },
];

export const portalActivity = [
  { date: "May 21, 2026", status: "New", title: "New fund opportunity added", description: "Transactional Funding Fund and Second Position Lending Fund are available for approved investor review." },
  { date: "May 21, 2026", status: "Action", title: "Subscription package pending review", description: "Subscription documents will be released after investor suitability and allocation review." },
  { date: "May 21, 2026", status: "Funding", title: "Funding instructions available after approval", description: "Commitments are reviewed by New Vine Capital before funding instructions are released." },
  { date: "May 20, 2026", status: "Update", title: "Monthly portal update posted", description: "Portal reporting and notices will be updated as approved materials are released." },
];

const sharedReviewProcess = [
  "Borrower or sponsor review",
  "Collateral and value review",
  "Title and lien review",
  "Senior lender review where applicable",
  "Exit strategy review",
  "Final admin approval before capital deployment",
];

const sharedRiskNotes = [
  "Target returns are not guaranteed.",
  "Investments may lose principal.",
  "Liquidity may be limited.",
  "Final terms are controlled by offering documents.",
  "Investor eligibility and suitability review required.",
];

export const deals = [
  {
    id: "transactional-funding-fund",
    name: "Transactional Funding Fund",
    location: "Nationwide",
    investmentType: "Fund",
    categories: ["Managed Funds", "Private Credit"],
    status: "Open",
    targetReturn: "10% target annual return",
    minimumInvestment: 100,
    totalRaise: 5000000,
    amountFunded: 0,
    term: "Short-duration capital cycles",
    distributionFrequency: "Monthly target reporting",
    preferredReturn: "10% target annual return",
    ltv: "Asset-backed short-term transactions",
    equityMultiple: "N/A",
    visualType: "capital-stack",
    summary: "A private capital strategy designed to support very short-term real estate closings where an investor needs reliable capital to complete a purchase, assignment, double close, or other time-sensitive transaction.",
    strategyDescription: "The fund provides short-duration capital for approved transactional funding requests, typically where the exit is already identified and the capital is needed to bridge a closing window. New Vine reviews title, contracts, payoff path, buyer/seller documentation, timing, and exit certainty before capital is deployed.",
    whyInvestorsLikeThis: [
      "Short-duration private credit exposure",
      "Defined underwriting and closing review process",
      "Exit strategy reviewed before funding",
      "Asset-backed transaction review before deployment",
      "Admin-reviewed investor commitments",
    ],
    reviewProcess: sharedReviewProcess,
    riskNotes: sharedRiskNotes,
    exclusivityNotes: ["Private investor access", "Available only to approved investors", "Allocation subject to availability"],
    businessPlan: "Capital is intended to support approved transactional funding requests with defined entry, closing, and repayment mechanics. Each deployment is reviewed for exit certainty, documentation, counterparty strength, title coordination, and timing risk before funding.",
    sponsorNotes: "New Vine Capital reviews individual transactions before capital deployment and prioritizes clearly documented exits, direct communication, and controlled funding procedures.",
    timeline: ["Investor review open", "Capital partner qualification in progress", "Deal-by-deal deployment after approval", "Monthly portal updates planned"],
    capitalStack: [
      ["Investor capital", "$5,000,000 target fund capacity"],
      ["Borrower / sponsor contribution", "Reviewed per transaction"],
      ["Transaction collateral", "Real estate-backed closing activity"],
    ],
    sourcesUses: [
      ["Transactional funding deployments", "Primary use"],
      ["Reserves and closing coordination", "As needed"],
      ["Diligence and servicing", "Reviewed per transaction"],
    ],
    sensitivity: "Target returns are not guaranteed. Performance depends on transaction volume, closing execution, repayment timing, documentation quality, counterparty performance, and market conditions.",
  },
  {
    id: "second-position-lending-fund",
    name: "Second Position Lending Fund",
    location: "Nationwide",
    investmentType: "Debt",
    categories: ["Managed Funds", "Private Credit"],
    status: "Open",
    targetReturn: "12% target annual return",
    minimumInvestment: 100,
    totalRaise: 5000000,
    amountFunded: 0,
    term: "Short- to mid-duration private credit",
    distributionFrequency: "Monthly target reporting",
    preferredReturn: "12% target annual return",
    ltv: "Combined leverage reviewed per loan",
    equityMultiple: "N/A",
    visualType: "lending-diagram",
    summary: "A private credit strategy focused on second-position and gap lending opportunities where borrowers need flexible capital behind a senior lender or alongside an existing real estate financing structure.",
    strategyDescription: "The fund provides subordinate private lending capital for approved real estate-backed transactions. New Vine reviews the senior debt, lien position, combined leverage, borrower equity, collateral value, repayment plan, title status, and exit strategy before approving any loan deployment.",
    whyInvestorsLikeThis: [
      "Asset-backed private credit exposure",
      "Conservative combined leverage review before deployment",
      "Senior lender and lien position reviewed where applicable",
      "Exit strategy reviewed before funding",
      "Admin-reviewed investor commitments",
    ],
    reviewProcess: sharedReviewProcess,
    riskNotes: sharedRiskNotes,
    exclusivityNotes: ["Private investor access", "Available only to approved investors", "Allocation subject to availability"],
    businessPlan: "Capital is intended to support approved second-position lending opportunities where borrower equity, collateral value, senior debt terms, repayment plan, and exit strategy can be reviewed before funding.",
    sponsorNotes: "New Vine Capital emphasizes conservative structuring, borrower communication, lien review, exit analysis, and direct oversight on each second-position opportunity.",
    timeline: ["Investor review open", "Qualification and suitability review required", "Loan-by-loan underwriting before deployment", "Monthly reporting planned"],
    capitalStack: [
      ["Senior debt", "Reviewed per loan"],
      ["Second-position fund capital", "$5,000,000 target fund capacity"],
      ["Borrower equity", "Reviewed per loan"],
    ],
    sourcesUses: [
      ["Second-position loans", "Primary use"],
      ["Gap funding and reserves", "As approved"],
      ["Legal, title, and servicing", "Reviewed per loan"],
    ],
    sensitivity: "Target returns are not guaranteed. Performance depends on collateral value, lien priority, borrower performance, senior lender terms, repayment timing, legal documentation, and market conditions.",
  },
];

export const dealDocuments = [
  { id: "tf-overview", dealId: "transactional-funding-fund", name: "Transactional Funding Fund Overview", type: "Investor Deck", status: "Needs Review", date: "Pending" },
  { id: "tf-risk", dealId: "transactional-funding-fund", name: "Transactional Funding Risk Disclosures", type: "Risk Disclosures", status: "Needs Review", date: "Pending" },
  { id: "tf-subscription", dealId: "transactional-funding-fund", name: "Transactional Funding Subscription Package", type: "Subscription Agreement", status: "Pending Upload", date: "Pending" },
  { id: "tf-underwriting", dealId: "transactional-funding-fund", name: "Transactional Funding Underwriting Summary", type: "Underwriting Summary", status: "Pending Upload", date: "Pending" },
  { id: "sp-overview", dealId: "second-position-lending-fund", name: "Second Position Lending Fund Overview", type: "Investor Deck", status: "Needs Review", date: "Pending" },
  { id: "sp-risk", dealId: "second-position-lending-fund", name: "Second Position Lending Risk Disclosures", type: "Risk Disclosures", status: "Needs Review", date: "Pending" },
  { id: "sp-subscription", dealId: "second-position-lending-fund", name: "Second Position Lending Subscription Package", type: "Subscription Agreement", status: "Pending Upload", date: "Pending" },
  { id: "sp-underwriting", dealId: "second-position-lending-fund", name: "Second Position Lending Underwriting Summary", type: "Underwriting Summary", status: "Pending Upload", date: "Pending" },
];

export const dealUpdates = [
  { dealId: "transactional-funding-fund", title: "Fund opportunity added", date: "May 21, 2026", summary: "Transactional Funding Fund is available for approved investor review. Additional documents will be posted as they are approved for portal release." },
  { dealId: "second-position-lending-fund", title: "Fund opportunity added", date: "May 21, 2026", summary: "Second Position Lending Fund is available for approved investor review. Participation remains subject to qualification, suitability review, and offering documents." },
];

export const distributions = [
  { investment: "Transactional Funding Fund", date: "TBD", amount: 0, type: "Projected distribution", status: "Projected" },
  { investment: "Second Position Lending Fund", date: "TBD", amount: 0, type: "Projected distribution", status: "Projected" },
];

export const investorSummary = {
  totalCommittedCapital: 0,
  totalFundedCapital: 0,
  activeInvestments: 2,
  projectedAnnualReturn: "10%-12% target annual return",
  upcomingDistributions: "Projected distributions shown after funding",
  pendingFundingStatus: "Commitments managed by admin review",
};

export function currency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function fundedPercent(deal) {
  if (!deal.totalRaise) return 0;
  return Math.min(100, Math.round((deal.amountFunded / deal.totalRaise) * 100));
}

export function findDeal(id) {
  return deals.find((deal) => deal.id === id);
}
