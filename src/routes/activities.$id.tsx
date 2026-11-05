import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { pageMeta } from "@/lib/seo";
import { DefinitionList, EmptyState, KpiCard, PageHeader, Panel, StatusBadge } from "@/components/app/ui-bits";
import { activityProfile, beneficiaryName, locationLabel, pct } from "@/data/analytics";

export const Route = createFileRoute("/activities/$id")({
  loader: ({ params }) => {
    if (!activityProfile(params.id)) throw notFound();
    return { id: params.id };
  },
  head: () => pageMeta("Activity profile", "Attendance list, completion and services linked to one activity."),
  notFoundComponent: () => <EmptyState title="Activity not found" />,
  component: ActivityPage,
});

function ActivityPage() {
  const { id } = Route.useLoaderData();
  const p = activityProfile(id)!;
  const a = p.activity;
  const present = p.participations.filter((x) => x.attendance === "Present").length;
  return (
    <>
      <PageHeader eyebrow={a.activity_type} title={a.activity_name} description={`${a.date} · ${locationLabel(a.location_id)}`} actions={<StatusBadge status={a.status} />} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Participants" value={`${a.actual_participants}`} hint={`Target ${a.target_participants}`} progress={pct(a.actual_participants, a.target_participants)} />
        <KpiCard label="Registered attendance" value={String(p.participations.length)} />
        <KpiCard label="Attendance rate" value={`${pct(present, p.participations.length)}%`} />
        <KpiCard label="Services linked" value={String(p.services.length)} />
      </div>
      <Panel title="Details">
        <DefinitionList
          items={[
            { label: "Facilitator", value: a.facilitator },
            { label: "Project", value: p.project ? <Link to="/projects/$id" params={{ id: p.project.project_id }} className="text-primary hover:underline">{p.project.project_name}</Link> : "—" },
            { label: "Programme", value: p.programme?.programme_name ?? "—" },
            { label: "Notes", value: a.notes || "—" },
          ]}
        />
      </Panel>
      <Panel title="Attendance register">
        {p.participations.length === 0 ? <EmptyState title="No attendance recorded" /> : (
          <ul className="divide-y divide-border">
            {p.participations.map((x) => (
              <li key={x.participation_id} className="flex items-center justify-between gap-3 py-2">
                <Link to="/beneficiaries/$id" params={{ id: x.beneficiary_id }} className="text-sm text-primary hover:underline">
                  {beneficiaryName(x.beneficiary_id)} <span className="font-mono text-xs text-muted-foreground">{x.beneficiary_id}</span>
                </Link>
                <div className="flex gap-1"><StatusBadge status={x.attendance} /><StatusBadge status={x.completion_status} /></div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
