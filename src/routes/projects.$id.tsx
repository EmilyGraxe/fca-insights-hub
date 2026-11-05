import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { pageMeta } from "@/lib/seo";
import { Progress } from "@/components/ui/progress";
import { DefinitionList, EmptyState, KpiCard, PageHeader, Panel, StatusBadge } from "@/components/app/ui-bits";
import { fmt, locationLabel, money, pct, projectProfile } from "@/data/analytics";

export const Route = createFileRoute("/projects/$id")({
  loader: ({ params }) => {
    if (!projectProfile(params.id)) throw notFound();
    return { id: params.id };
  },
  head: () => pageMeta("Project profile", "Project reach, activities, indicators, monitoring and feedback."),
  notFoundComponent: () => <EmptyState title="Project not found" />,
  component: ProjectPage,
});

function ProjectPage() {
  const { id } = Route.useLoaderData();
  const p = projectProfile(id)!;
  const pr = p.project;
  const present = p.participations.filter((x) => x.attendance === "Present").length;
  return (
    <>
      <PageHeader eyebrow={`${pr.project_code} · ${pr.sector}`} title={pr.project_name} description={p.programme ? `Part of ${p.programme.programme_name}` : undefined} actions={<StatusBadge status={pr.status} />} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Reached" value={fmt(p.reached.size)} progress={pct(p.reached.size, pr.target_beneficiaries)} hint={`Target ${fmt(pr.target_beneficiaries)}`} />
        <KpiCard label="Activities" value={String(p.activities.length)} />
        <KpiCard label="Attendance" value={`${pct(present, p.participations.length)}%`} />
        <KpiCard label="Budget" value={money(pr.budget_usd)} hint={pr.donors.join(", ")} />
      </div>
      <Panel title="Project details">
        <DefinitionList
          items={[
            { label: "Manager", value: pr.manager },
            { label: "Period", value: `${pr.start_date} → ${pr.end_date}` },
            { label: "Target households", value: fmt(pr.target_households) },
            { label: "Locations", value: pr.location_ids.map(locationLabel).join("; ") },
            { label: "Objectives", value: <ul className="list-disc pl-4">{pr.objectives.map((o) => <li key={o}>{o}</li>)}</ul> },
          ]}
        />
      </Panel>
      <Panel title="Indicators" description="Baseline, target and latest actual.">
        {p.indicators.length === 0 ? <EmptyState title="No indicators defined" /> : (
          <ul className="space-y-4">
            {p.indicators.map((i) => {
              const ach = i.actual === null ? 0 : pct(i.actual, i.target);
              return (
                <li key={i.indicator_id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-medium">{i.indicator_name}</p>
                    <p className="text-xs tabular-nums text-muted-foreground">Baseline {i.baseline} · Target {i.target} · Actual {i.actual ?? "not reported"} {i.unit}</p>
                  </div>
                  <Progress value={Math.min(100, ach)} className="mt-1.5 h-1.5" aria-label={`${ach}% of target`} />
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Activities">
          <ul className="max-h-96 divide-y divide-border overflow-y-auto">
            {p.activities.map((a) => (
              <li key={a.activity_id} className="flex items-center justify-between gap-3 py-2">
                <div>
                  <Link to="/activities/$id" params={{ id: a.activity_id }} className="text-sm font-medium text-primary hover:underline">{a.activity_name}</Link>
                  <p className="text-xs text-muted-foreground">{a.date} · {a.actual_participants}/{a.target_participants} participants</p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Monitoring visits">
          {p.visits.length === 0 ? <EmptyState title="No monitoring visits recorded" /> : (
            <ul className="divide-y divide-border">
              {p.visits.map((v) => (
                <li key={v.visit_id} className="py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{v.date} · {v.monitor}</p>
                    <StatusBadge status={v.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{v.findings} Action: {v.action_point}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
