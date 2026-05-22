import PortalLayout from "../../components/PortalLayout";
import { requirePortalSession } from "../../lib/portalAuth";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

function formatDate(value) {
  if (!value) return "Not recorded";
  return new Date(value).toLocaleString("en-US", { timeZone: "America/Denver" });
}

function ErrorList({ errors }) {
  if (!Array.isArray(errors) || !errors.length) return <p className="text-sm text-white/45">No integration errors recorded.</p>;
  return (
    <div className="grid gap-2">
      {errors.map((error, index) => (
        <div key={`${error.key}-${index}`} className="border-l-4 border-[#8a2516] bg-[#8a2516]/10 p-3 text-sm text-white/75">
          <p className="font-black text-[#ffb6a9]">{error.key || "integration"}</p>
          <p className="mt-1 break-words text-white/65">{error.message || "No message provided"}</p>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps(context) {
  const result = await requirePortalSession(context, { roles: ["Admin"] });
  if (!result.props?.user) return result;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("investor_call_requests")
    .select("id, name, email, phone, entity_name, requested_slot, requested_start, status, google_event_id, hubspot_contact_id, hubspot_meeting_id, integration_errors, email_sent_at, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return { props: { user: result.props.user, requests: data || [], loadError: error?.message || "" } };
}

export default function AdminCallRequests({ user, requests = [], loadError = "" }) {
  const summary = [
    ["Total Requests", requests.length],
    ["Integrated", requests.filter((item) => item.status === "Integrated").length],
    ["Needs Review", requests.filter((item) => item.status === "Integration Review Needed").length],
    ["Email Sent", requests.filter((item) => item.email_sent_at).length],
  ];

  return (
    <PortalLayout user={user} title="Investor Call Requests">
      {loadError && <div className="mb-6 border border-[#8a2516]/50 bg-[#8a2516]/10 p-4 text-sm font-bold text-[#ffb6a9]">Could not load call requests: {loadError}</div>}
      <div className="grid gap-4 md:grid-cols-4">
        {summary.map(([label, value]) => <article key={label} className="border border-white/10 bg-[#111613] p-5"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></article>)}
      </div>

      <section className="mt-8 grid gap-5">
        {requests.length === 0 && <div className="border border-white/10 bg-[#111613] p-7 text-white/60">No investor call requests have been recorded yet.</div>}
        {requests.map((request) => (
          <article key={request.id} className="border border-white/10 bg-[#111613] p-5 md:p-7">
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-black">{request.name}</h3>
                  <span className={`px-3 py-1 text-xs font-black uppercase ${request.status === "Integrated" ? "bg-[#1f5b3f] text-white" : "bg-[#8a5b16]/20 text-[#f0d99a]"}`}>{request.status}</span>
                </div>
                <p className="mt-3 text-sm text-white/60">{request.email} / {request.phone}</p>
                <p className="mt-1 text-sm text-white/60">Entity: {request.entity_name || "Not provided"}</p>
                <p className="mt-1 text-sm text-white/60">Requested: {request.requested_slot}</p>
                <p className="mt-1 text-xs text-white/40">Submitted: {formatDate(request.created_at)}</p>
              </div>

              <div className="grid gap-3 text-sm">
                <div className="grid grid-cols-[160px_1fr] gap-2 border border-white/10 bg-white/5 p-3"><span className="font-black text-[#d5ad62]">Email</span><span>{request.email_sent_at ? `Sent ${formatDate(request.email_sent_at)}` : "Not sent"}</span></div>
                <div className="grid grid-cols-[160px_1fr] gap-2 border border-white/10 bg-white/5 p-3"><span className="font-black text-[#d5ad62]">Google Event</span><span className="break-words">{request.google_event_id || "Not created"}</span></div>
                <div className="grid grid-cols-[160px_1fr] gap-2 border border-white/10 bg-white/5 p-3"><span className="font-black text-[#d5ad62]">HubSpot Contact</span><span className="break-words">{request.hubspot_contact_id || "Not created"}</span></div>
                <div className="grid grid-cols-[160px_1fr] gap-2 border border-white/10 bg-white/5 p-3"><span className="font-black text-[#d5ad62]">HubSpot Meeting</span><span className="break-words">{request.hubspot_meeting_id || "Not created"}</span></div>
              </div>
            </div>

            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#d5ad62]">Integration Errors</p>
              <ErrorList errors={request.integration_errors} />
            </div>
          </article>
        ))}
      </section>
    </PortalLayout>
  );
}
