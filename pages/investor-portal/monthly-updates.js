import PortalLayout from "../../components/PortalLayout";
import { requirePortalSession } from "../../lib/portalAuth";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

export async function getServerSideProps(context) {
  const result = await requirePortalSession(context);
  if (!result.props?.user) return result;

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("portal_monthly_updates")
    .select("id, title, update_date, summary, content, pdf_storage_path")
    .order("update_date", { ascending: false });

  return { props: { user: result.props.user, updates: data || [] } };
}

export default function MonthlyUpdates({ user, updates = [] }) {
  return (
    <PortalLayout user={user} title="Monthly Updates">
      {updates.length === 0 && <div className="mb-8 border border-white/10 bg-white/5 p-6 text-white/65">No monthly updates have been posted yet.</div>}
      <div className="grid gap-5">{updates.map((update) => <article key={update.id} className="border border-white/10 bg-[#111613] p-7"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{update.update_date}</p><h3 className="mt-3 text-2xl font-black">{update.title}</h3><p className="mt-3 text-white/65">{update.summary}</p><p className="mt-5 leading-7 text-white/55">{update.content}</p>{update.pdf_storage_path && <a href={`/api/portal/monthly-updates/${update.id}/pdf`} className="mt-6 inline-flex bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b]">Download PDF Attachment</a>}</article>)}</div>
    </PortalLayout>
  );
}
