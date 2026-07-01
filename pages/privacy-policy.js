import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const sections = [
  [
    "Information We Collect",
    [
      "Contact and profile information you provide, such as name, email address, phone number, entity name, investor profile details, and relationship source.",
      "Deal submission, investor inquiry, and portal information submitted through New Vine Capital forms, JotForm, HubSpot, or the investor portal.",
      "Portal activity information, such as login activity, document access, commitment submissions, and account settings updates.",
      "Connected bank account information when you choose to connect an account through Plaid, including institution name, account name, account type, account subtype, last four digits, connection status, and related identifiers needed to maintain the connection.",
    ],
  ],
  [
    "How We Use Information",
    [
      "To review borrower, broker, partner, and investor inquiries.",
      "To operate the investor portal, manage approved investor access, provide documents, and support investor communications.",
      "To support future ACH readiness, account verification, investor deposits, borrower repayments, investor distributions, and related financial workflows. New Vine Capital does not currently enable money movement through Plaid unless separately implemented and authorized.",
      "To maintain security, audit logs, compliance records, and fraud-prevention controls.",
      "To communicate with you about submitted requests, portal access, investment opportunities, funding processes, and administrative updates.",
    ],
  ],
  [
    "Plaid and Connected Bank Accounts",
    [
      "New Vine Capital uses Plaid to allow authorized portal users to connect bank accounts securely. When you use Plaid, you may be asked to authenticate directly with your financial institution.",
      "New Vine Capital does not receive or store your online banking username or password.",
      "Plaid may provide New Vine Capital with account and institution information needed to display and maintain your connected account in the investor portal.",
      "You may disconnect a connected bank account from the investor portal. You may also manage Plaid connections through Plaid or your financial institution where available.",
    ],
  ],
  [
    "How We Share Information",
    [
      "We may share information with service providers that help operate our website, forms, CRM, investor portal, authentication, document storage, email, analytics, and connected account workflows.",
      "We may share information when required for compliance, legal obligations, security, fraud prevention, underwriting, transaction administration, or investor relations.",
      "We do not sell personal information as part of our normal business operations.",
    ],
  ],
  [
    "Security and Retention",
    [
      "We use administrative, technical, and organizational safeguards designed to protect information in our systems.",
      "Investor portal sessions, role-based permissions, private document access, audit logging, and server-side token handling are used to help protect portal information.",
      "Connected account access tokens are handled server-side and are not exposed in browser code.",
      "We retain information for as long as reasonably necessary to operate our business, maintain compliance records, resolve disputes, and support legal or administrative obligations.",
    ],
  ],
  [
    "Your Choices",
    [
      "You may request updates to your contact or profile information through the investor portal or by contacting New Vine Capital.",
      "You may disconnect a connected bank account from the investor portal where available.",
      "You may contact us with privacy questions or requests using the information below.",
    ],
  ],
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050605] text-white">
      <SiteHeader />
      <main>
        <section className="nvc-page-bg px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl py-12">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d5ad62]">Privacy Policy</p>
            <h1 className="mt-5 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">New Vine Capital Privacy Policy</h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-white/75">This policy explains how New Vine Capital collects, uses, shares, and protects information submitted through our website, forms, investor portal, and connected bank account workflows.</p>
            <p className="mt-5 text-sm font-bold uppercase tracking-wide text-white/55">Effective Date: July 1, 2026</p>
          </div>
        </section>

        <section className="bg-white px-5 py-20 text-[#050605] lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="border-l-4 border-[#d5ad62] bg-[#f4f1e9] p-6 text-sm leading-7 text-[#4d5a52]">
              This Privacy Policy is provided for informational purposes and may be updated as New Vine Capital's website, investor portal, integrations, and financial technology services evolve.
            </div>

            <div className="mt-12 grid gap-10">
              {sections.map(([title, items]) => (
                <section key={title}>
                  <h2 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h2>
                  <ul className="mt-5 grid gap-3 text-base leading-7 text-[#53615a]">
                    {items.map((item) => <li key={item} className="border border-[#d8d2c4] bg-[#fbfaf6] p-4">{item}</li>)}
                  </ul>
                </section>
              ))}
            </div>

            <section className="mt-12 border border-[#d8d2c4] bg-[#fbfaf6] p-7">
              <h2 className="font-serif text-3xl leading-tight md:text-4xl">Contact</h2>
              <p className="mt-4 leading-7 text-[#53615a]">For privacy questions or requests, contact New Vine Capital:</p>
              <div className="mt-5 grid gap-2 text-[#25342c]">
                <p><strong>Email:</strong> deals@newvinecapital.com</p>
                <p><strong>Phone:</strong> 720-460-0337</p>
                <p><strong>Website:</strong> newvinecapital.com</p>
              </div>
            </section>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
