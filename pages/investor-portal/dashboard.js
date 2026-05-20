import PortalLayout from "../../components/PortalLayout";
import { requirePortalSession } from "../../lib/portalAuth";

export async function getServerSideProps(context) {
  return requirePortalSession(context);
}

export default function Dashboard({ user }) {
  const cards = [
    ["Investor Status", user.status],
    ["Documents Available", user.status === "Approved Investor" || user.role === "Admin" ? "Assigned materials ready" : "Pending approval"],
    ["Latest Monthly Update", "May market and portfolio update"],
    ["Investor Relations", "deals@newvinecapital.com"],
  ];
  return (
    <PortalLayout user={user} title="Investor Dashboard">
      <section className="border border-white/10 bg-[#111613] p-7"><p className="text-lg leading-8 text-white/75">Welcome to the New Vine Capital Investor Portal. This private portal provides access to investor materials, updates, and documents made available to approved investors.</p></section>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{cards.map(([label, value]) => <article key={label} className="border border-white/10 bg-white/5 p-6"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{label}</p><h3 className="mt-4 text-xl font-black">{value}</h3></article>)}</div>
      <section className="mt-8 grid gap-5 lg:grid-cols-2"><article className="border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Important Notices</h3><p className="mt-4 text-white/65">Portal materials are confidential and may only be viewed by approved investors and authorized representatives. Do not forward, publish, or distribute portal documents.</p></article><article className="border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Compliance Disclaimer</h3><p className="mt-4 text-white/65">No self-service investing, wire instructions, payment processing, or public offering materials are available through this portal.</p></article></section>
    </PortalLayout>
  );
}
