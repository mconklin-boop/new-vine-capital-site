// Automatic preliminary underwriting screen for submitted deals.
//
// This is an INTERNAL triage tool. Results are shown only to admins in the
// Deal Pipeline and are never sent to borrowers. Every deal still goes through
// full underwriting before any terms are issued.
//
// All thresholds live in UW_GUIDELINES below. Set them to New Vine Capital's
// current guidelines; the defaults are conservative placeholders.

export const UW_GUIDELINES = {
  global: {
    minCreditWarn: 660, // below this: Needs Review
    minCreditFail: 600, // below this: Does Not Fit
    maxLoanWarn: 3000000, // above this: Needs Review (larger than usual)
    rushDaysWarn: 5, // closing sooner than this: Needs Review (except transactional / EMD)
  },
  dscr: {
    minLoan: 75000,
    maxLtvPurchase: 0.8,
    maxLtvRateTerm: 0.75,
    maxLtvCashOut: 0.7,
    minDscrWarn: 1.0,
    minDscrFail: 0.75,
    assumedRate: 0.075, // assumption used only to estimate the payment for DSCR
    amortYears: 30,
  },
  fixAndFlip: {
    minLoan: 50000,
    maxLtc: 0.9, // loan / (purchase + rehab)
    maxArvLtv: 0.7, // loan / ARV
    sellingCostPct: 0.08, // assumed selling + holding costs as % of ARV
    minMarginWarn: 0.15, // projected profit / ARV
    minMarginFail: 0.05,
  },
  bridge: { minLoan: 50000, maxLtvWarn: 0.75, maxLtvFail: 0.8 },
  firstPosition: { minLoan: 50000, maxLtvWarn: 0.65, maxLtvFail: 0.7 },
  gap: { minLoan: 10000, maxCltvWarn: 0.8, maxCltvFail: 0.9 },
  transactional: { minLoan: 25000, minSpreadWarn: 5000 },
  emd: { minAmount: 1000, maxPctWarn: 0.1, maxPctFail: 0.2, maxAmountWarn: 100000 },
  business: { minMonthsInBusinessWarn: 6, minCreditStackingWarn: 680 },
};

export const PRODUCTS = [
  { value: "dscr", label: "DSCR Rental Loan", group: "Real Estate" },
  { value: "fix-and-flip", label: "Fix & Flip", group: "Real Estate" },
  { value: "bridge", label: "Bridge Loan", group: "Real Estate" },
  { value: "gap", label: "Gap / Second-Position", group: "Real Estate" },
  { value: "transactional", label: "Transactional Funding", group: "Real Estate" },
  { value: "emd", label: "EMD Financing", group: "Real Estate" },
  { value: "first-position", label: "First-Position Loan", group: "Real Estate" },
  { value: "equipment", label: "Equipment Financing", group: "Business" },
  { value: "loc", label: "Business Line of Credit", group: "Business" },
  { value: "fuel", label: "Fuel Account", group: "Business" },
  { value: "credit-stacking", label: "Credit Stacking", group: "Business" },
];

export const BUSINESS_PRODUCTS = ["equipment", "loc", "fuel", "credit-stacking"];

export const CREDIT_BANDS = [
  { value: "760+", label: "760+", floor: 760 },
  { value: "720-759", label: "720-759", floor: 720 },
  { value: "680-719", label: "680-719", floor: 680 },
  { value: "640-679", label: "640-679", floor: 640 },
  { value: "600-639", label: "600-639", floor: 600 },
  { value: "under-600", label: "Under 600", floor: 0 },
  { value: "unknown", label: "Not sure", floor: null },
];

export const DECISIONS = {
  PASS: "Pre-Qualified",
  REVIEW: "Needs Review",
  FAIL: "Does Not Fit",
};

export function num(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).replace(/[$,%\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

const pct = (value) => `${(value * 100).toFixed(1)}%`;
const money = (value) => `$${Math.round(value).toLocaleString("en-US")}`;

export function monthlyPayment(principal, annualRate, years) {
  const r = annualRate / 12;
  const n = years * 12;
  if (!r) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

function daysUntil(dateString, now) {
  if (!dateString) return null;
  const target = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

export function screenDeal(input, { now = new Date(), guidelines = UW_GUIDELINES } = {}) {
  const g = guidelines;
  const flags = [];
  const metrics = [];
  const fail = (message) => flags.push({ level: "fail", message });
  const warn = (message) => flags.push({ level: "warn", message });
  const missing = (message) => flags.push({ level: "missing", message });
  const info = (message) => flags.push({ level: "info", message });
  const metric = (label, value) => metrics.push({ label, value });

  const product = input.product;
  const productInfo = PRODUCTS.find((item) => item.value === product);
  if (!productInfo) {
    return { decision: DECISIONS.REVIEW, score: 0, product, productLabel: "Unknown", metrics, flags: [{ level: "missing", message: "No product selected." }], guidelinesVersion: 1 };
  }

  const loan = num(input.loanAmount);
  const purchase = num(input.purchasePrice);
  const asIs = num(input.asIsValue);
  const rehab = num(input.rehabBudget) || 0;
  const arv = num(input.arv);
  const isBusiness = BUSINESS_PRODUCTS.includes(product);

  // Credit
  const band = CREDIT_BANDS.find((item) => item.value === input.creditBand);
  const creditMatters = !["transactional", "emd", "fuel"].includes(product);
  if (creditMatters) {
    if (!band || band.floor === null) missing("Credit score range not provided.");
    else if (band.floor < g.global.minCreditFail) fail(`Credit below ${g.global.minCreditFail}.`);
    else if (band.floor < g.global.minCreditWarn) warn(`Credit ${band.label} is below the ${g.global.minCreditWarn} preferred minimum.`);
  }

  // Real estate common checks
  if (!isBusiness) {
    if (input.occupancy === "owner-occupied") fail("Owner-occupied property. New Vine Capital makes business-purpose loans on investment property only.");
    if (!input.propertyAddress) missing("Property address not provided.");
    if (!input.exitStrategy && !["transactional", "emd"].includes(product)) missing("Exit strategy not provided.");
    const experience = num(input.experienceDeals);
    if (experience !== null) metric("Deals, last 3 years", String(experience));
    if (["fix-and-flip", "gap"].includes(product) && experience === 0) warn("First-time investor on a rehab project.");

    const days = daysUntil(input.closingDate, now);
    if (days !== null) {
      metric("Days to closing", String(days));
      if (days < 0) warn("Closing date is in the past.");
      else if (days < g.global.rushDaysWarn && !["transactional", "emd"].includes(product)) warn(`Rush closing: ${days} day(s) out.`);
    }
  }

  if (loan === null && product !== "emd") missing("Loan amount not provided.");
  if (loan !== null) {
    metric("Loan requested", money(loan));
    if (loan > g.global.maxLoanWarn) warn(`Loan amount above ${money(g.global.maxLoanWarn)}.`);
  }

  const minLoanCheck = (min) => { if (loan !== null && loan < min) fail(`Loan amount below the ${money(min)} program minimum.`); };

  // Value basis for LTV: lower of purchase price and as-is value on purchases.
  const transaction = input.transactionType || "purchase";
  const valueBasis = transaction === "purchase"
    ? [purchase, asIs].filter((v) => v).reduce((a, b) => Math.min(a, b), Infinity)
    : asIs;
  const hasValue = Number.isFinite(valueBasis) && valueBasis > 0;
  const ltv = hasValue && loan ? loan / valueBasis : null;

  switch (product) {
    case "dscr": {
      const c = g.dscr;
      minLoanCheck(c.minLoan);
      const maxLtv = transaction === "cash-out" ? c.maxLtvCashOut : transaction === "refinance" ? c.maxLtvRateTerm : c.maxLtvPurchase;
      if (ltv === null) missing(transaction === "purchase" ? "Purchase price or value not provided." : "As-is value not provided.");
      else {
        metric("LTV", pct(ltv));
        if (ltv > maxLtv) fail(`LTV ${pct(ltv)} exceeds the ${pct(maxLtv)} ${transaction} maximum.`);
      }
      const rent = num(input.monthlyRent);
      const taxes = num(input.annualTaxes);
      const insurance = num(input.annualInsurance);
      const hoa = num(input.monthlyHoa) || 0;
      if (rent === null) missing("Monthly rent not provided.");
      if (taxes === null) missing("Annual taxes not provided.");
      if (insurance === null) missing("Annual insurance not provided.");
      if (rent !== null && taxes !== null && insurance !== null && loan) {
        const pi = monthlyPayment(loan, c.assumedRate, c.amortYears);
        const pitia = pi + taxes / 12 + insurance / 12 + hoa;
        const dscr = rent / pitia;
        metric("Est. PITIA", `${money(pitia)}/mo`);
        metric("Est. DSCR", dscr.toFixed(2));
        if (dscr < c.minDscrFail) fail(`Estimated DSCR ${dscr.toFixed(2)} is below ${c.minDscrFail.toFixed(2)}.`);
        else if (dscr < c.minDscrWarn) warn(`Estimated DSCR ${dscr.toFixed(2)} is below ${c.minDscrWarn.toFixed(2)}.`);
        info(`DSCR estimated at an assumed ${pct(c.assumedRate)} rate, ${c.amortYears}-year amortization.`);
      }
      break;
    }
    case "fix-and-flip": {
      const c = g.fixAndFlip;
      minLoanCheck(c.minLoan);
      if (!purchase) missing("Purchase price not provided.");
      if (!rehab) missing("Rehab budget not provided.");
      if (!arv) missing("After-repair value (ARV) not provided.");
      if (purchase && loan) {
        const ltc = loan / (purchase + rehab);
        metric("LTC", pct(ltc));
        if (ltc > c.maxLtc) fail(`LTC ${pct(ltc)} exceeds the ${pct(c.maxLtc)} maximum.`);
      }
      if (arv && loan) {
        const arvLtv = loan / arv;
        metric("ARV LTV", pct(arvLtv));
        if (arvLtv > c.maxArvLtv) fail(`ARV LTV ${pct(arvLtv)} exceeds the ${pct(c.maxArvLtv)} maximum.`);
      }
      if (arv && purchase) {
        const profit = arv - purchase - rehab - arv * c.sellingCostPct;
        const margin = profit / arv;
        metric("Projected profit", money(profit));
        metric("Margin on ARV", pct(margin));
        if (margin < c.minMarginFail) fail(`Projected margin ${pct(margin)} is too thin.`);
        else if (margin < c.minMarginWarn) warn(`Projected margin ${pct(margin)} is below ${pct(c.minMarginWarn)}.`);
        if (arv < purchase + rehab) fail("ARV is less than purchase price plus rehab.");
      }
      break;
    }
    case "bridge":
    case "first-position": {
      const c = product === "bridge" ? g.bridge : g.firstPosition;
      minLoanCheck(c.minLoan);
      if (ltv === null) missing("Purchase price or value not provided.");
      else {
        metric("LTV", pct(ltv));
        if (ltv > c.maxLtvFail) fail(`LTV ${pct(ltv)} exceeds the ${pct(c.maxLtvFail)} maximum.`);
        else if (ltv > c.maxLtvWarn) warn(`LTV ${pct(ltv)} is above the ${pct(c.maxLtvWarn)} preferred maximum.`);
      }
      break;
    }
    case "gap": {
      const c = g.gap;
      minLoanCheck(c.minLoan);
      const senior = num(input.seniorLoanAmount);
      if (!senior) missing("Senior loan amount not provided.");
      if (!input.seniorLender) missing("Senior lender not identified.");
      const basis = rehab > 0 && arv ? arv : hasValue ? valueBasis : null;
      if (!basis) missing("Value (or ARV for rehab deals) not provided.");
      if (senior && loan && basis) {
        const cltv = (senior + loan) / basis;
        metric(rehab > 0 && arv ? "Combined LTV (ARV)" : "Combined LTV", pct(cltv));
        if (cltv > c.maxCltvFail) fail(`Combined LTV ${pct(cltv)} exceeds ${pct(c.maxCltvFail)}.`);
        else if (cltv > c.maxCltvWarn) warn(`Combined LTV ${pct(cltv)} is above the ${pct(c.maxCltvWarn)} preferred maximum.`);
      }
      if (senior && loan && purchase) {
        const totalCost = purchase + rehab;
        metric("Total financed / cost", pct((senior + loan) / totalCost));
        if (senior + loan > totalCost) warn("Senior plus gap exceeds total project cost (cash out at closing).");
      }
      break;
    }
    case "transactional": {
      const c = g.transactional;
      minLoanCheck(c.minLoan);
      const endPrice = num(input.endBuyerPrice);
      if (!purchase) missing("A-to-B purchase price not provided.");
      if (!endPrice) missing("B-to-C end buyer price not provided.");
      if (input.endBuyerUnderContract !== "yes") warn("End buyer is not yet under contract.");
      if (purchase && endPrice) {
        const spread = endPrice - purchase;
        metric("Spread", money(spread));
        if (spread <= 0) fail("End buyer price does not exceed the purchase price.");
        else if (spread < c.minSpreadWarn) warn(`Spread under ${money(c.minSpreadWarn)}.`);
      }
      if (purchase && loan && loan > purchase) fail("Requested funding exceeds the A-to-B purchase price.");
      break;
    }
    case "emd": {
      const c = g.emd;
      const emd = num(input.emdAmount) ?? loan;
      if (!emd) missing("EMD amount not provided.");
      if (!purchase) missing("Purchase price not provided.");
      if (input.underContract !== "yes") warn("Property is not yet under contract.");
      if (emd) {
        metric("EMD requested", money(emd));
        if (emd < c.minAmount) fail(`EMD below ${money(c.minAmount)}.`);
        if (emd > c.maxAmountWarn) warn(`EMD above ${money(c.maxAmountWarn)}.`);
      }
      if (emd && purchase) {
        const share = emd / purchase;
        metric("EMD / price", pct(share));
        if (share > c.maxPctFail) fail(`EMD is ${pct(share)} of the purchase price.`);
        else if (share > c.maxPctWarn) warn(`EMD is ${pct(share)} of the purchase price.`);
      }
      break;
    }
    default: {
      // Business products: capture and triage, no automatic approval.
      const c = g.business;
      const months = num(input.monthsInBusiness);
      const revenue = num(input.annualRevenue);
      if (!input.businessName) missing("Business name not provided.");
      if (months === null) missing("Time in business not provided.");
      else {
        metric("Months in business", String(months));
        if (months < c.minMonthsInBusinessWarn) warn(`Business is under ${c.minMonthsInBusinessWarn} months old.`);
      }
      if (revenue === null) missing("Annual revenue not provided.");
      else metric("Annual revenue", money(revenue));
      if (product === "credit-stacking" && band?.floor !== null && band?.floor !== undefined && band.floor < c.minCreditStackingWarn) {
        warn(`Credit stacking generally needs ${c.minCreditStackingWarn}+ credit.`);
      }
      info("Business financing is routed for manual review.");
    }
  }

  const fails = flags.filter((f) => f.level === "fail").length;
  const warns = flags.filter((f) => f.level === "warn").length;
  const missings = flags.filter((f) => f.level === "missing").length;
  const score = Math.max(0, 100 - fails * 40 - warns * 10 - missings * 5);

  let decision = DECISIONS.PASS;
  if (fails) decision = DECISIONS.FAIL;
  else if (warns || missings || isBusiness) decision = DECISIONS.REVIEW;

  return { decision, score, product, productLabel: productInfo.label, metrics, flags, guidelinesVersion: 1 };
}
