import PortalLayout from "../../components/PortalLayout";
import { canViewOfferingDocuments, logPortalEvent, requirePortalSession } from "../../lib/portalAuth";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

const categories = ["Company Overview", "Fund Materials", "Risk Disclosures", "Subscription Documents", "Tax Documents", "Monthly Reports", "Investor Notices"];

export async function getServerSideProps(context) {
  const result = await requirePortalSession(context);
  if (!result.props?.user) return result;

  const user = result.props.user;
  let documents = [];

  if (canViewOfferingDocuments(user)) {
    const supabase = getSupabaseAdmin();

    if (user.role === "Admin") {
      const { data } = await supabase.from("portal_documents").select("id, name, category, upload_date").order("upload_date", { ascending: false });
      documents = data || [];
    } else {
      const { data: assignments } = await supabase
        .from("portal_document_assignments")
        .select("document_id")
        .or(`profile_id.eq.${user.id},role.eq.${user.role}`);
      const ids = [...new Set((assignments || []).map((item) => item.document_id))];
      if (ids.length) {
        const { data } = await supabase.from("portal_documents").select("id, name, category, upload_date").in("id", ids).order("upload_date", { ascending: false });
        documents = data || [];
      }
    }
  }

  await logPortalEvent({ type: "documents_page_view", userId: user.id, email: user.email, metadata: { role: user.role } });
  return { props: { user, documents } };
}

export default function Documents({ user, documents = [] }) {
  const approved = canViewOfferingDocuments(user);
  const rows = approved && documents.length ? documents : categories.map((category) => ({ id: category, category, name: approved ? "No document assigned" : "Restricted Material", upload_date: null }));

  return (
    <PortalLayout user={user} title="Documents">
      {!approved && <div className="mb-8 border border-[#d5ad62]/40 bg-[#d5ad62]/10 p-6 text-[#f0d99a]">Your portal status is pending. Offering documents and restricted materials are not available until admin approval is complete.</div>}
      {approved && documents.length === 0 && <div className="mb-8 border border-white/10 bg-white/5 p-6 text-white/65">No documents have been assigned to your portal profile yet.</div>}
      <div className="grid gap-5">{rows.map((document) => <article key={document.id} className="grid gap-4 border border-white/10 bg-[#111613] p-6 lg:grid-cols-[1fr_180px_220px]"><div><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{document.category}</p><h3 className="mt-2 text-xl font-black">{document.name}</h3><p className="mt-2 text-sm text-white/55">Upload date: {document.upload_date || "Pending approval"}</p></div><div className="text-sm text-white/60">Category<br /><strong className="text-white">{document.category}</strong></div><div className="flex flex-wrap gap-3"><a aria-disabled={!approved || !document.upload_date} href={approved && document.upload_date ? `/api/portal/documents/${document.id}?action=view` : undefined} className="bg-white/10 px-4 py-3 text-xs font-black uppercase aria-disabled:opacity-35">View</a><a aria-disabled={!approved || !document.upload_date} href={approved && document.upload_date ? `/api/portal/documents/${document.id}?action=download` : undefined} className="bg-[#d5ad62] px-4 py-3 text-xs font-black uppercase text-[#11100b] aria-disabled:opacity-35">Download</a>{user.role === "Admin" && <span className="border border-white/15 px-4 py-3 text-xs font-black uppercase text-white/60">Admin Managed</span>}</div></article>)}</div>
    </PortalLayout>
  );
}
