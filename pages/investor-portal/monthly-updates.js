import PortalLayout from "../../components/PortalLayout";
import { requirePortalSession } from "../../lib/portalAuth";

export async function getServerSideProps(context) {
  return requirePortalSession(context);
}

const updates = [
  { title: "Monthly Portfolio Update", date: "May 2026", summary: "Operational notes, market observations, and investor communications for approved portal users.", content: "Full update content is published by admin and assigned to approved investors. PDF attachments can be added through secure document storage integration." },
  { title: "Investor Notice", date: "April 2026", summary: "General investor relations notice and document availability update.", content: "Notices are controlled materials and should not be distributed outside authorized portal users." },
];

export default function MonthlyUpdates({ user }) {
  return <PortalLayout user={user} title="Monthly Updates"><div className="grid gap-5">{updates.map((update) => <article key={update.title} className="border border-white/10 bg-[#111613] p-7"><p className="text-xs font-black uppercase tracking-wide text-[#d5ad62]">{update.date}</p><h3 className="mt-3 text-2xl font-black">{update.title}</h3><p className="mt-3 text-white/65">{update.summary}</p><p className="mt-5 leading-7 text-white/55">{update.content}</p><button className="mt-6 bg-[#d5ad62] px-5 py-3 text-xs font-black uppercase text-[#11100b]">Download PDF Attachment</button></article>)}</div></PortalLayout>;
}
