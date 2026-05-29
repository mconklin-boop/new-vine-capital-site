import Link from "next/link";
import SiteHeader, { JOTFORM_URL } from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { siteLinks } from "../lib/siteLinks";

const partnerTypes = [
  {
    title: "Direct Lenders",
    description: "For lenders seeking additional deal flow, co-lending opportunities, borrower placements, or structured capital relationships.",
  },
  {
    title: "Mortgage Brokers & Loan Officers",
    description: "For brokers who need creative funding options when a deal does not fit traditional lending guidelines.",
  },
  {
    title: "Real Estate Agents & Wholesalers",
    description: "For professionals with investor clients who need acquisition, bridge, DSCR, fix-and-flip, or gap funding.",
  },
  {
    title: "Private Capital Relationships",
    description: "For capital partners, advisors, and relationship-driven deal sources with qualified borrower or investor relationships.",
  },
];

const portalFeatures = [
  "Submit borrower deals",
  "Upload transaction documents",
  "Track deal status",
  "View requested items",
  "Communicate with New Vine Capital",
  "Access approved partner resources",
  "Track referral activity where applicable",
];

const dealTypes = [
  "DSCR rental loans",
  "Fix & flip",
  "Bridge loans",
  "Gap funding",
  "Second-position lending",
  "Creative finance structures",
  "Appraisal funding",
  "Transactional funding",
];

export default function Partners() {
  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <SiteHeader />
      <main>
        <section className="nvc-page-bg px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl py-12">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Partner Network</p>
            <h1 className="mt-5 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">Partner With New Vine Capital</h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-white/75">Lending partnerships, broker relationships, and deal flow collaboration built around speed, structure, and execution.</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href={siteLinks.partnerAccess} className="bg-[#d5ad62] px-7 py-4 text-center text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Request Partner Access</Link>
              <a href={JOTFORM_URL} target="_blank" rel="noopener noreferrer" className="border border-white/35 px-7 py-4 text-center text-sm font-black uppercase text-white transition hover:border-[#d5ad62]">Submit a Deal</a>
            </div>
          </div>
        </section>

        <section className="bg-[#f4f1e9] px-5 py-24 text-[#050605] lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#1f5b3f]">Relationship-Driven Capital</p>
            <h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-6xl">Who We Partner With</h2>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {partnerTypes.map((partner) => (
                <article key={partner.title} className="border-t-4 border-[#d5ad62] bg-white p-7 shadow-xl shadow-black/5">
                  <h3 className="text-xl font-black">{partner.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#5e6962]">{partner.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Partner Portal</p>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">A dedicated portal for lending partners and broker relationships.</h2>
              <p className="mt-6 text-lg leading-8 text-white/70">Approved partners can submit borrower opportunities, upload documents, track deal status, communicate with New Vine Capital, and access approved partner resources through a dedicated partner portal.</p>
              <Link href={siteLinks.partnerPortal} className="mt-8 inline-flex border border-[#d5ad62]/70 px-7 py-4 text-sm font-black uppercase text-[#d5ad62] transition hover:bg-[#d5ad62] hover:text-[#11100b]">View Partner Portal</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {portalFeatures.map((feature) => (
                <article key={feature} className="border border-white/10 bg-[#111613] p-6 transition hover:-translate-y-1 hover:border-[#d5ad62]/70">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">Partner Tool</span>
                  <h3 className="mt-5 text-lg font-black">{feature}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#123827] px-5 py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Referral Relationships</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">Referral Opportunities</h2>
            </div>
            <p className="text-lg leading-8 text-white/75">Approved partners may be eligible for referral compensation on qualified introductions that result in successfully funded transactions. Referral eligibility, compensation, payment timing, and participation requirements are subject to approval, documentation, and New Vine Capital partner guidelines.</p>
          </div>
        </section>

        <section className="bg-[#f4f1e9] px-5 py-24 text-[#050605] lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#1f5b3f]">Deal Flow</p>
            <h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-6xl">Deal Types Partners Can Submit</h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {dealTypes.map((type) => (
                <article key={type} className="border border-black/10 bg-white p-6 shadow-xl shadow-black/5">
                  <h3 className="text-lg font-black">{type}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl border border-white/10 bg-[#111613] p-8 md:p-12">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Partner Approval & Compliance</p>
            <h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-5xl">Partnership approval is reviewed relationship by relationship.</h2>
            <p className="mt-6 max-w-5xl text-lg leading-8 text-white/70">Partnership approval is not automatic. Partner access, referral eligibility, and compensation participation are subject to review, written agreement, compliance guidelines, and New Vine Capital approval. Partners may not make investment recommendations, promise funding, quote unapproved terms, or represent themselves as employees of New Vine Capital unless separately authorized in writing.</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href={siteLinks.partnerAccess} className="bg-[#d5ad62] px-7 py-4 text-center text-sm font-black uppercase text-[#11100b] transition hover:bg-[#f0d99a]">Request Partner Access</Link>
              <a href={JOTFORM_URL} target="_blank" rel="noopener noreferrer" className="border border-white/30 px-7 py-4 text-center text-sm font-black uppercase text-white transition hover:border-[#d5ad62]">Submit a Deal</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
