import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { Eyebrow } from "../components/ProductSections";
import { BUSINESS_PRODUCTS, CREDIT_BANDS, PRODUCTS } from "../lib/underwriting";

const inputClass = "w-full border border-white/15 bg-[#050605] px-4 py-3 text-white placeholder:text-white/30 focus:border-[#d5ad62] focus:outline-none";

function Field({ label, name, value, onChange, type = "text", required = false, placeholder = "", hint = "", inputMode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-white/80">
      <span>{label}{required && <span className="text-[#d5ad62]"> *</span>}</span>
      <input name={name} type={type} value={value || ""} onChange={onChange} required={required} placeholder={placeholder} inputMode={inputMode} className={inputClass} />
      {hint && <span className="text-xs font-normal text-white/45">{hint}</span>}
    </label>
  );
}

function Money(props) {
  return <Field {...props} inputMode="decimal" placeholder={props.placeholder || "$"} />;
}

function Select({ label, name, value, onChange, options, required = false }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-white/80">
      <span>{label}{required && <span className="text-[#d5ad62]"> *</span>}</span>
      <select name={name} value={value || ""} onChange={onChange} required={required} className={inputClass}>
        <option value="">Select</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function TextArea({ label, name, value, onChange, placeholder }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-white/80 md:col-span-2">
      <span>{label}</span>
      <textarea name={name} value={value || ""} onChange={onChange} rows={4} placeholder={placeholder} className={inputClass} />
    </label>
  );
}

function Group({ title, children }) {
  return (
    <fieldset className="border border-white/10 bg-[#111613] p-5 md:p-7">
      <legend className="px-2 text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">{title}</legend>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}

const yesNo = [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }];

export default function SubmitDeal() {
  const router = useRouter();
  const [form, setForm] = useState({ occupancy: "investment", transactionType: "purchase" });
  const [state, setState] = useState({ status: "idle", error: "" });

  useEffect(() => {
    const preset = router.query.product;
    if (preset && PRODUCTS.some((p) => p.value === preset)) setForm((current) => ({ ...current, product: current.product || preset }));
  }, [router.query.product]);

  const onChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const p = form.product;
  const isBusiness = BUSINESS_PRODUCTS.includes(p);
  const isRealEstate = p && !isBusiness;
  const f = { onChange };
  const v = (name) => ({ name, value: form[name], ...f });

  async function onSubmit(event) {
    event.preventDefault();
    setState({ status: "sending", error: "" });
    try {
      const response = await fetch("/api/deal-submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setState({ status: "sent", error: "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setState({ status: "idle", error: error.message });
    }
  }

  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <Head><title>Submit a Deal | New Vine Capital</title><meta name="description" content="Submit a real estate or business financing request to New Vine Capital." /></Head>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        {state.status === "sent" ? (
          <section className="border border-[#d5ad62]/40 bg-[#111613] p-8 md:p-12">
            <Eyebrow>Submission received</Eyebrow>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">Thanks. Your deal is in.</h1>
            <p className="mt-5 text-lg leading-8 text-white/70">We sent a confirmation to {form.contactEmail}. Our team reviews every submission and will follow up with next steps or questions. Need us sooner? Call 720-817-4277.</p>
            <p className="mt-6 text-xs leading-6 text-white/45">Receipt of a submission is not a loan approval or commitment. All financing is subject to underwriting and final approval.</p>
          </section>
        ) : (
          <>
            <Eyebrow>Submit a Deal</Eyebrow>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">Tell us about the deal.</h1>
            <p className="mt-5 text-lg leading-8 text-white/70">Takes about five minutes. Fill in what you know; we will follow up on anything missing.</p>

            <form onSubmit={onSubmit} className="mt-10 grid gap-6">
              <input type="text" name="website" value={form.website || ""} onChange={onChange} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              <Group title="Program">
                <label className="grid gap-2 text-sm font-bold text-white/80 md:col-span-2">
                  <span>What do you need? <span className="text-[#d5ad62]">*</span></span>
                  <select name="product" value={p || ""} onChange={onChange} required className={inputClass}>
                    <option value="">Select a program</option>
                    {["Real Estate", "Business"].map((group) => (
                      <optgroup key={group} label={`${group} Financing`}>
                        {PRODUCTS.filter((item) => item.group === group).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </label>
              </Group>

              <Group title="Your Information">
                <Field label="Full name" required {...v("contactName")} />
                <Field label="Email" type="email" required {...v("contactEmail")} />
                <Field label="Phone" type="tel" required {...v("contactPhone")} />
                <Field label="Company / entity" {...v("companyName")} />
                <Select label="I am the" {...v("submitterRole")} options={[{ value: "borrower", label: "Borrower" }, { value: "broker", label: "Broker" }, { value: "wholesaler", label: "Wholesaler" }, { value: "other", label: "Other" }]} />
                <Select label="Credit score range (borrower)" {...v("creditBand")} options={CREDIT_BANDS} />
              </Group>

              {isRealEstate && (
                <Group title="Property">
                  <div className="md:col-span-2"><Field label="Property address" {...v("propertyAddress")} /></div>
                  <Field label="City" {...v("propertyCity")} />
                  <div className="grid grid-cols-2 gap-5"><Field label="State" {...v("propertyState")} placeholder="CO" /><Field label="ZIP" {...v("propertyZip")} inputMode="numeric" /></div>
                  <Select label="Property type" {...v("propertyType")} options={[{ value: "sfr", label: "Single family" }, { value: "2-4", label: "2-4 units" }, { value: "multifamily", label: "Multifamily 5+" }, { value: "condo", label: "Condo / townhome" }, { value: "mixed-use", label: "Mixed use" }, { value: "commercial", label: "Commercial" }, { value: "land", label: "Land" }]} />
                  <Select label="Occupancy" required {...v("occupancy")} options={[{ value: "investment", label: "Investment property" }, { value: "owner-occupied", label: "I will live in it" }]} />
                  {["dscr", "bridge", "first-position"].includes(p) && (
                    <Select label="Transaction" {...v("transactionType")} options={[{ value: "purchase", label: "Purchase" }, { value: "refinance", label: "Rate / term refinance" }, { value: "cash-out", label: "Cash-out refinance" }]} />
                  )}
                  <Field label="Target closing date" type="date" {...v("closingDate")} />
                </Group>
              )}

              {isRealEstate && (
                <Group title="Numbers">
                  <Money label={p === "transactional" ? "A-to-B purchase price" : "Purchase price"} {...v("purchasePrice")} />
                  {!["transactional", "emd"].includes(p) && <Money label="As-is value" {...v("asIsValue")} />}
                  {["fix-and-flip", "gap", "bridge"].includes(p) && <Money label="Rehab budget" {...v("rehabBudget")} />}
                  {["fix-and-flip", "gap", "bridge"].includes(p) && <Money label="After-repair value (ARV)" {...v("arv")} />}
                  {p === "emd" ? <Money label="EMD amount needed" {...v("emdAmount")} /> : <Money label={p === "gap" ? "Gap amount requested" : "Loan amount requested"} {...v("loanAmount")} />}
                  {p === "gap" && <Money label="Senior loan amount" {...v("seniorLoanAmount")} />}
                  {p === "gap" && <Field label="Senior lender" {...v("seniorLender")} />}
                  {p === "dscr" && <Money label="Monthly rent (actual or market)" {...v("monthlyRent")} />}
                  {p === "dscr" && <Money label="Annual property taxes" {...v("annualTaxes")} />}
                  {p === "dscr" && <Money label="Annual insurance" {...v("annualInsurance")} />}
                  {p === "dscr" && <Money label="Monthly HOA (if any)" {...v("monthlyHoa")} />}
                  {p === "transactional" && <Money label="B-to-C end buyer price" {...v("endBuyerPrice")} />}
                  {p === "transactional" && <Select label="End buyer under contract?" {...v("endBuyerUnderContract")} options={yesNo} />}
                  {p === "emd" && <Select label="Property under contract?" {...v("underContract")} options={yesNo} />}
                  <Field label="Deals completed in the last 3 years" {...v("experienceDeals")} inputMode="numeric" />
                  {!["transactional", "emd"].includes(p) && <TextArea label="Exit strategy" {...v("exitStrategy")} placeholder="Sell after rehab, refinance into DSCR, hold, etc." />}
                </Group>
              )}

              {isBusiness && (
                <Group title="Business">
                  <Field label="Business name" {...v("businessName")} />
                  <Field label="Months in business" {...v("monthsInBusiness")} inputMode="numeric" />
                  <Money label="Annual revenue" {...v("annualRevenue")} />
                  <Money label="Amount requested" {...v("loanAmount")} />
                  <TextArea label="Use of funds" {...v("useOfFunds")} placeholder="Equipment purchase, working capital, fuel, expansion, etc." />
                </Group>
              )}

              {p && (
                <Group title="Anything Else">
                  <Field label="How did you hear about us?" {...v("referralSource")} />
                  <div className="hidden md:block" />
                  <TextArea label="Notes" {...v("notes")} placeholder="Anything that helps us understand the deal." />
                </Group>
              )}

              {state.error && <p className="border border-[#8a2516]/60 bg-[#8a2516]/15 p-4 text-sm font-bold text-[#ffb6a9]">{state.error}</p>}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button type="submit" disabled={state.status === "sending"} className="bg-[#d5ad62] px-8 py-4 text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a] disabled:opacity-60">
                  {state.status === "sending" ? "Submitting..." : "Submit Deal"}
                </button>
                <p className="text-xs leading-5 text-white/45">By submitting, you agree New Vine Capital may contact you about this request. Submitting is not an application for consumer credit and is not a loan approval.</p>
              </div>
            </form>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
