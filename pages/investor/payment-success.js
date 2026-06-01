import Link from "next/link";
import PortalLayout from "../../components/PortalLayout";
import { Panel } from "../../components/InvestorPortalCards";
import { requirePortalSession } from "../../lib/portalAuth";

export async function getServerSideProps(context) {
  const auth = await requirePortalSession(context);
  if (!auth.props?.user) return auth;
  return { props: { user: auth.props.user, sessionId: context.query.session_id || "" } };
}

export default function InvestorPaymentSuccess({ user, sessionId }) {
  return (
    <PortalLayout user={user} title="Payment Submitted">
      <Panel eyebrow="Stripe Checkout" title="Your payment submission has been received.">
        <p className="leading-8">Thank you. Stripe has received your payment submission for New Vine Capital review. Your portal record will be reconciled against Stripe reporting and final investment status remains subject to approval, suitability review, allocation availability, and offering documents.</p>
        {sessionId && <p className="mt-4 break-all text-sm text-white/45">Stripe session reference: {sessionId}</p>}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/investor/dashboard" className="bg-[#d5ad62] px-6 py-4 text-center text-sm font-black uppercase text-[#11100b]">Return to Dashboard</Link>
          <Link href="/investor/opportunities" className="border border-[#d5ad62]/60 px-6 py-4 text-center text-sm font-black uppercase text-[#d5ad62]">View Opportunities</Link>
        </div>
      </Panel>
    </PortalLayout>
  );
}
