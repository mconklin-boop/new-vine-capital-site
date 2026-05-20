import PortalLayout from "../../components/PortalLayout";
import { requirePortalSession } from "../../lib/portalAuth";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

export async function getServerSideProps(context) {
  const result = await requirePortalSession(context, { roles: ["Admin"] });
  if (!result.props?.user) return result;

  const supabase = getSupabaseAdmin();
  const [{ data: users }, { data: documents }, { data: logs }, { data: updates }] = await Promise.all([
    supabase.from("portal_profiles").select("id, name, email, role, status, deactivated, created_at").order("created_at", { ascending: false }).limit(25),
    supabase.from("portal_documents").select("id, name, category, upload_date").order("upload_date", { ascending: false }).limit(25),
    supabase.from("portal_activity_logs").select("id, email, event_type, created_at").order("created_at", { ascending: false }).limit(25),
    supabase.from("portal_monthly_updates").select("id, title, update_date").order("update_date", { ascending: false }).limit(10),
  ]);

  return { props: { user: result.props.user, users: users || [], documents: documents || [], logs: logs || [], updates: updates || [] } };
}

export default function AdminDashboard({ user, users = [], documents = [], logs = [], updates = [] }) {
  const summary = [
    ["Investor Users", users.length],
    ["Documents", documents.length],
    ["Monthly Updates", updates.length],
    ["Recent Access Logs", logs.length],
  ];

  return (
    <PortalLayout user={user} title="Admin Dashboard">
      <div className="grid gap-5 md:grid-cols-4">{summary.map(([label, value]) => <article key={label} className="border border-white/10 bg-[#111613] p-6"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{label}</p><h3 className="mt-3 text-3xl font-black">{value}</h3></article>)}</div>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Investor Users</h3><div className="mt-5 grid gap-3">{users.map((item) => <div key={item.id} className="border border-white/10 bg-white/5 p-4"><p className="font-black">{item.name || item.email}</p><p className="mt-1 text-sm text-white/55">{item.email} | {item.role} | {item.status}{item.deactivated ? " | Deactivated" : ""}</p></div>)}</div></article>
        <article className="border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Document Library</h3><div className="mt-5 grid gap-3">{documents.map((item) => <div key={item.id} className="border border-white/10 bg-white/5 p-4"><p className="font-black">{item.name}</p><p className="mt-1 text-sm text-white/55">{item.category} | {item.upload_date}</p></div>)}</div></article>
        <article className="border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Monthly Updates</h3><div className="mt-5 grid gap-3">{updates.map((item) => <div key={item.id} className="border border-white/10 bg-white/5 p-4"><p className="font-black">{item.title}</p><p className="mt-1 text-sm text-white/55">{item.update_date}</p></div>)}</div></article>
        <article className="border border-white/10 bg-[#111613] p-7"><h3 className="text-2xl font-black">Access Logs</h3><div className="mt-5 grid gap-3">{logs.map((item) => <div key={item.id} className="border border-white/10 bg-white/5 p-4"><p className="font-black">{item.event_type}</p><p className="mt-1 text-sm text-white/55">{item.email || "System"} | {item.created_at}</p></div>)}</div></article>
      </section>

      <section className="mt-8 border border-white/10 bg-white/5 p-7"><h3 className="text-2xl font-black">Admin Controls</h3><p className="mt-4 text-white/65">User approvals, role changes, document uploads, CSV exports, and CRM integrations are now ready to be connected to these Supabase tables through controlled admin API actions.</p></section>
    </PortalLayout>
  );
}
