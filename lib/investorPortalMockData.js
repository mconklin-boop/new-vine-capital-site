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
  { type: "Document Alert", message: "Subscription package available for review in Maple Bridge Note.", date: "May 20, 2026" },
  { type: "Funding Status", message: "Capital call pending for Denver Gap Funding Note.", date: "May 18, 2026" },
  { type: "Monthly Update", message: "April portfolio update posted to the reporting center.", date: "May 12, 2026" },
];

export const deals = [
  {
    id: "maple-bridge-note",
    name: "Maple Bridge Note",
    location: "Charlotte, NC",
    investmentType: "Debt",
    targetReturn: "11.25% target annualized",
    minimumInvestment: 25000,
    totalRaise: 750000,
    amountFunded: 510000,
    status: "Open",
    term: "12 months",
    preferredReturn: "N/A",
    ltv: "62% estimated LTV",
    equityMultiple: "N/A",
    summary: "Short-duration bridge note secured by a stabilized residential rental portfolio with refinance exit planned after seasoning and lease optimization.",
    businessPlan: "Capital supports acquisition payoff, minor reserves, and refinance preparation. Sponsor expects to transition to long-term DSCR financing after stabilization.",
    sponsorNotes: "Repeat borrower with operating history in the Carolinas and prior successful private credit takeouts.",
    timeline: ["Initial diligence complete", "Investor review open", "Target close: June 14, 2026", "Projected maturity: June 2027"],
    capitalStack: [
      ["Senior private note", "$750,000"],
      ["Sponsor equity", "$365,000"],
      ["Total project basis", "$1,115,000"],
    ],
    sourcesUses: [
      ["Acquisition payoff", "$640,000"],
      ["Reserves and closing", "$70,000"],
      ["Origination and diligence", "$40,000"],
    ],
    sensitivity: "Exit remains dependent on rental performance, appraisal support, rate environment, and borrower execution. Downside protection is evaluated through collateral value and borrower equity contribution.",
  },
  {
    id: "denver-gap-funding-note",
    name: "Denver Gap Funding Note",
    location: "Denver, CO",
    investmentType: "Gap Funding",
    targetReturn: "13.00% target annualized",
    minimumInvestment: 10000,
    totalRaise: 285000,
    amountFunded: 228000,
    status: "Closing Soon",
    term: "6 months",
    preferredReturn: "N/A",
    ltv: "71% combined estimated LTV",
    equityMultiple: "N/A",
    summary: "Gap funding position supporting a time-sensitive acquisition with identified takeout financing and borrower capital already committed.",
    businessPlan: "Capital fills a short-term closing requirement while senior lender conditions are finalized. Exit is expected through refinance or asset sale.",
    sponsorNotes: "Experienced local operator with broker relationships and a documented transaction pipeline.",
    timeline: ["Purchase contract active", "Funding window open", "Target close: May 31, 2026", "Expected payoff within 180 days"],
    capitalStack: [["Senior lender", "$940,000"], ["Gap note", "$285,000"], ["Borrower equity", "$500,000"]],
    sourcesUses: [["Purchase closing", "$1,545,000"], ["Reserves", "$105,000"], ["Transaction costs", "$75,000"]],
    sensitivity: "Returns and timing are subject to closing execution, payoff timing, lien priority, valuation, and legal documentation.",
  },
  {
    id: "southeast-preferred-equity",
    name: "Southeast Preferred Equity Series",
    location: "Atlanta, GA",
    investmentType: "Preferred Equity",
    targetReturn: "12.00% target preferred return",
    minimumInvestment: 50000,
    totalRaise: 1200000,
    amountFunded: 1200000,
    status: "Fully Subscribed",
    term: "18 to 24 months",
    preferredReturn: "12.00% target preferred return",
    ltv: "N/A",
    equityMultiple: "1.24x target equity multiple",
    summary: "Preferred equity allocation supporting a small-balance multifamily repositioning strategy across select Southeast markets.",
    businessPlan: "Capital is used for property improvements, lease-up support, reserves, and operating stabilization before refinance or disposition.",
    sponsorNotes: "Sponsor team has prior multifamily repositioning experience and regional property management support.",
    timeline: ["Series fully subscribed", "Renovation plan active", "Quarterly updates scheduled", "Projected exit: Q4 2027"],
    capitalStack: [["Senior debt", "$3,800,000"], ["Preferred equity", "$1,200,000"], ["Sponsor equity", "$850,000"]],
    sourcesUses: [["Acquisition", "$4,750,000"], ["Renovation budget", "$760,000"], ["Reserves and costs", "$340,000"]],
    sensitivity: "Performance depends on leasing, renovation costs, operating expenses, capitalization rates, financing availability, and market conditions.",
  },
];

export const dealDocuments = [
  { id: "ppm", dealId: "maple-bridge-note", name: "Private Placement Memorandum", type: "PPM", date: "May 15, 2026" },
  { id: "sub-maple", dealId: "maple-bridge-note", name: "Subscription Agreement", type: "Subscription Agreement", date: "May 15, 2026" },
  { id: "deck-maple", dealId: "maple-bridge-note", name: "Investor Deck", type: "Investor Deck", date: "May 16, 2026" },
  { id: "underwriting-maple", dealId: "maple-bridge-note", name: "Underwriting Summary", type: "Underwriting Summary", date: "May 17, 2026" },
  { id: "valuation-maple", dealId: "maple-bridge-note", name: "Appraisal / Valuation Placeholder", type: "Appraisal / Valuation", date: "Pending" },
  { id: "oa-gap", dealId: "denver-gap-funding-note", name: "Operating Agreement", type: "Operating Agreement", date: "May 18, 2026" },
  { id: "funding-gap", dealId: "denver-gap-funding-note", name: "Funding Instructions", type: "Funding Instructions", date: "May 19, 2026" },
  { id: "k1-series", dealId: "southeast-preferred-equity", name: "2025 K-1 Placeholder", type: "K-1", date: "Pending" },
  { id: "qstatement-series", dealId: "southeast-preferred-equity", name: "Quarterly Statement", type: "Quarterly Statement", date: "April 30, 2026" },
];

export const dealUpdates = [
  { dealId: "maple-bridge-note", title: "Diligence package posted", date: "May 20, 2026", summary: "Initial underwriting package, sponsor notes, and draft subscription materials are available for investor review." },
  { dealId: "maple-bridge-note", title: "Funding progress update", date: "May 18, 2026", summary: "Commitments received to date represent approximately 68% of the current target raise." },
  { dealId: "denver-gap-funding-note", title: "Closing coordination", date: "May 19, 2026", summary: "Title, lien position, and funding logistics are being coordinated ahead of target close." },
  { dealId: "southeast-preferred-equity", title: "Renovation update", date: "May 12, 2026", summary: "Initial unit turns are underway. Full monthly progress photos will be posted after sponsor reporting review." },
];

export const distributions = [
  { investment: "Southeast Preferred Equity Series", date: "April 30, 2026", amount: 1850, type: "Preferred return", status: "Paid" },
  { investment: "Maple Bridge Note", date: "June 30, 2026", amount: 0, type: "Interest reserve", status: "Projected" },
  { investment: "Denver Gap Funding Note", date: "July 15, 2026", amount: 0, type: "Payoff distribution", status: "Projected" },
];

export const investorSummary = {
  totalCommittedCapital: 185000,
  totalFundedCapital: 135000,
  activeInvestments: 3,
  projectedAnnualReturn: "11.8% target blended",
  upcomingDistributions: "$4,250 projected next 90 days",
  pendingFundingStatus: "$50,000 pending funding",
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
