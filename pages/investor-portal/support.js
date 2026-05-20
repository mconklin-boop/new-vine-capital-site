import PortalLayout from "../../components/PortalLayout";
import { requirePortalSession } from "../../lib/portalAuth";

export async function getServerSideProps(context) {
  return requirePortalSession(context);
}

export default function Support({ user }) {
  return <PortalLayout user={user} title="Support / Contact Investor Relations"><section className="grid gap-5 lg:grid-cols-2"><article className="border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Investor Relations</h3><p className="mt-4 text-white/65">For portal access, profile updates, document questions, or monthly reporting requests, contact New Vine Capital Investor Relations.</p><div className="mt-6 grid gap-3 text-white/75"><p><strong>Email:</strong> deals@newvinecapital.com</p><p><strong>Phone:</strong> 720-817-4277</p></div></article><article className="border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Security Notice</h3><p className="mt-4 text-white/65">Never send wire instructions, account credentials, or sensitive identity documents through unsecured email. Investor Relations will coordinate secure submission methods when needed.</p></article></section></PortalLayout>;
}
