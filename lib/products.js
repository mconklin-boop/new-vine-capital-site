// Single source for product copy used on the homepage and product pages.
// Add current terms to `highlights` only after they are verified.

export const realEstateProducts = [
  {
    id: "dscr",
    kicker: "Rental",
    title: "DSCR Rental Loans",
    summary: "Purchase or refinance rental properties qualified on the property's cash flow, not personal income.",
    bestFor: "Buy-and-hold investors growing a rental portfolio.",
    highlights: ["Purchase, rate-term and cash-out refinance", "Qualified on property income", "Single properties or portfolios"],
  },
  {
    id: "fix-and-flip",
    kicker: "Value-Add",
    title: "Fix & Flip",
    summary: "Short-term acquisition and rehab capital for operators buying, renovating and selling.",
    bestFor: "Flippers and value-add operators with a defined scope and exit.",
    highlights: ["Purchase and rehab financing", "Draws tied to the rehab budget", "Underwritten to the after-repair value and exit"],
  },
  {
    id: "bridge",
    kicker: "Short-Term",
    title: "Bridge Loans",
    summary: "Fast capital for acquisitions, payoffs and time-sensitive closings while longer-term financing is arranged.",
    bestFor: "Deals with a tight deadline or a property that is not yet bankable.",
    highlights: ["Acquisitions, payoffs and refinances", "Built around a documented exit", "Structured for speed"],
  },
  {
    id: "gap",
    kicker: "Creative",
    title: "Gap & Second-Position",
    summary: "Second-position capital that covers the shortfall between your senior loan and what the deal needs.",
    bestFor: "Investors whose first-position lender leaves a gap at closing.",
    highlights: ["Works alongside your senior lender", "Senior terms and title reviewed up front", "Funds only when conditions and title are clear"],
  },
  {
    id: "transactional",
    kicker: "Same-Day",
    title: "Transactional Funding",
    summary: "Short-duration capital for double closings and back-to-back transactions.",
    bestFor: "Wholesalers closing an A-to-B and B-to-C on the same day or close together.",
    highlights: ["Double-close support", "Very short duration", "Coordinated with title"],
  },
  {
    id: "emd",
    kicker: "Contracts",
    title: "EMD Financing",
    summary: "Earnest money deposit funding so you can lock up contracts without tying up your own cash.",
    bestFor: "Wholesalers and investors who need to put down earnest money quickly.",
    highlights: ["Deposit funded to escrow", "Short-term structure", "Simple documentation"],
  },
  {
    id: "first-position",
    kicker: "Select",
    title: "Select First-Position Loans",
    summary: "First-position private loans on select investment properties where the collateral and exit are strong.",
    bestFor: "Borrowers who need a direct private lender in first position.",
    highlights: ["Asset-based underwriting", "Investment property only", "Reviewed case by case"],
  },
];

export const businessProducts = [
  {
    id: "equipment",
    kicker: "Equipment",
    title: "Equipment Financing",
    summary: "Finance trucks, trailers, machinery and other business equipment without a large upfront outlay.",
    bestFor: "Operators adding or replacing revenue-producing equipment.",
    highlights: ["New and used equipment", "Preserves working capital", "Terms matched to the equipment"],
  },
  {
    id: "loc",
    kicker: "Working Capital",
    title: "Business Lines of Credit",
    summary: "Revolving access to capital for operating costs, payroll timing, inventory and growth.",
    bestFor: "Established businesses smoothing cash flow.",
    highlights: ["Draw only what you need", "Revolving access", "Business-purpose use"],
  },
  {
    id: "fuel",
    kicker: "Fleet",
    title: "Fuel Accounts",
    summary: "Fuel purchasing accounts for trucking companies and fleets that need reliable fuel access and better cash flow.",
    bestFor: "Owner-operators, carriers and fleets.",
    highlights: ["Built for trucking and fleets", "Helps manage fuel cash flow", "Account-based purchasing"],
    href: "/business-financing/fuel-cards",
  },
  {
    id: "credit-stacking",
    kicker: "Unsecured",
    title: "Credit Stacking",
    summary: "A structured approach to opening multiple unsecured business credit lines for larger total access.",
    bestFor: "Business owners with strong credit who want capital without pledging collateral.",
    highlights: ["Multiple unsecured lines", "No collateral required", "Strategy and sequencing guidance"],
    href: "/business-financing/credit-stacking",
  },
];

export const dealChecklist = [
  "Property address and type",
  "Purchase price or current value, and contract status",
  "Loan amount requested",
  "Rehab budget and scope, if applicable",
  "Exit strategy (sale, refinance or hold)",
  "Closing date and timeline",
  "Borrowing entity and investor experience",
  "Senior lender terms, for gap or second-position requests",
];

export const fundingSteps = [
  ["Submit the deal", "Send the property, loan request, timeline and exit through our deal form."],
  ["Preliminary terms", "We review collateral, leverage and exit, then send preliminary terms subject to underwriting."],
  ["Valuation & diligence", "Once you accept terms, we order the valuation and review title, entity, budget and insurance."],
  ["Approval", "Files are presented for final approval at our weekly Friday review."],
  ["Closing & funding", "Docs go out after approval, and funds are released once every condition and title are clear."],
];
