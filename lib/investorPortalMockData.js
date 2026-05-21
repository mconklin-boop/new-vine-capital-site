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

export const deals = [
  {
    id: "transactional-funding-fund",
    name: "Transactional Funding Fund",
    location: "Nationwide",
    investmentType: "Fund",
    targetReturn: "10% target annual return",
    minimumInvestment: 100,
    totalRaise: 1000000,
    amountFunded: 0,
    status: "Open",
    term: "Short-duration capital cycles",
    preferredReturn: "10% target annual return",
    ltv: "Asset-backed short-term transactions",
    equityMultiple: "N/A",
    summary: "A private capital strategy focused on short-duration transactional funding opportunities for real estate investors, wholesalers, and acquisition operators requiring reliable closing capital.",
    businessPlan: "Capital is intended to support approved transactional funding requests with defined entry, closing, and repayment mechanics. Each deployment is reviewed for exit certainty, documentation, counterparty strength, title coordination, and timing risk before funding.",
    sponsorNotes: "New Vine Capital reviews individual transactions before capital deployment and prioritizes clearly documented exits, direct communication, and controlled funding procedures.",
    timeline: ["Investor review open", "Capital partner qualification in progress", "Deal-by-deal deployment after approval", "Monthly portal updates planned"],
    capitalStack: [
      ["Investor capital", "$1,000,000 target fund capacity"],
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
    targetReturn: "12% target annual return",
    minimumInvestment: 100,
    totalRaise: 1000000,
    amountFunded: 0,
    status: "Open",
    term: "Short- to mid-duration private credit",
    preferredReturn: "12% target annual return",
    ltv: "Combined leverage reviewed per loan",
    equityMultiple: "N/A",
    summary: "A private lending strategy focused on second-position and gap capital opportunities secured by real estate collateral and structured for investors seeking private credit exposure.",
    businessPlan: "Capital is intended to support approved second-position lending opportunities where borrower equity, collateral value, senior debt terms, repayment plan, and exit strategy can be reviewed before funding.",
    sponsorNotes: "New Vine Capital emphasizes conservative structuring, borrower communication, lien review, exit analysis, and direct oversight on each second-position opportunity.",
    timeline: ["Investor review open", "Qualification and suitability review required", "Loan-by-loan underwriting before deployment", "Monthly reporting planned"],
    capitalStack: [
      ["Senior debt", "Reviewed per loan"],
      ["Second-position fund capital", "$1,000,000 target fund capacity"],
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
  { id: "tf-overview", dealId: "transactional-funding-fund", name: "Transactional Funding Fund Overview", type: "Investor Deck", date: "Pending" },
  { id: "tf-risk", dealId: "transactional-funding-fund", name: "Transactional Funding Risk Disclosures", type: "Risk Disclosures", date: "Pending" },
  { id: "tf-subscription", dealId: "transactional-funding-fund", name: "Transactional Funding Subscription Package", type: "Subscription Agreement", date: "Pending" },
  { id: "tf-underwriting", dealId: "transactional-funding-fund", name: "Transactional Funding Underwriting Summary", type: "Underwriting Summary", date: "Pending" },
  { id: "sp-overview", dealId: "second-position-lending-fund", name: "Second Position Lending Fund Overview", type: "Investor Deck", date: "Pending" },
  { id: "sp-risk", dealId: "second-position-lending-fund", name: "Second Position Lending Risk Disclosures", type: "Risk Disclosures", date: "Pending" },
  { id: "sp-subscription", dealId: "second-position-lending-fund", name: "Second Position Lending Subscription Package", type: "Subscription Agreement", date: "Pending" },
  { id: "sp-underwriting", dealId: "second-position-lending-fund", name: "Second Position Lending Underwriting Summary", type: "Underwriting Summary", date: "Pending" },
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
  return Math.min(100, Math.round((deal.amountFunded / deal.totalRaise) * 100));
}

export function findDeal(id) {
  return deals.find((deal) => deal.id === id);
}
