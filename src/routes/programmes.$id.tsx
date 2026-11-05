import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { pageMeta } from "@/lib/seo";
import { DefinitionList, EmptyState, KpiCard, PageHeader, Panel, StatusBadge } from "@/components/app/ui-bits";
import { fmt, money, programmeProfile, sum } from "@/data/analytics";

export const Route = createFileRoute("/programmes/$id")({
  loader: ({ params }) => {
    if (!programmeProfile(params.id)) throw notFound();
    return { id: params.id };
  },
  head: () => pageMeta("Programme profile", "Programme objectives, projects, reach and indicators."),
  notFoundComponent: () => <EmptyState title="Programme not found" />,
  component: ProgrammePage,
});

function ProgrammePage() {
  const { id } = Route.useLoaderData();
  const p = programmeProfile(id)!;
  const prog = p.programme;
  return (
    <>
      <PageHeader eyebrow={`Programme · ${prog.sector}`} title={prog.programme_name} description={prog.description} actions={<StatusBadge status={prog.status} />} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Projects" value={String(p.projects.length)} />
        <KpiCard label="People reached" value={fmt(p.reached.size)} />
        <KpiCard label="Services" value={fmt(p.services.length)} />
        <KpiCard label="Budget" value={money(sum(p.projects.map((x) => x.budget_usd)))} />
      </div>
      <Panel title="Programme details">
        <DefinitionList
          items={[
            { label: "Lead", value: prog.lead },
            { label: "Period", value: `${prog.start_date} → ${prog.end_date}` },
            { label: "Objectives", value: <ul className="list-disc pl-4">{prog.objectives.map((o) => <li key={o}>{o}</li>)}</ul> },
            { label: "Strategic outcomes", value: <ul className="list-disc pl-4">{prog.strategic_outcomes.map((o) => <li key={o}>{o}</li>)}</ul> },
          ]}
        />
      </Panel>
      <Panel title="Projects">
        <ul className="divide-y divide-border">
          {p.projects.map((pr) => (
            <li key={pr.project_id} className="flex items-center justify-between gap-3 py-2">
              <div>
                <Link to="/projects/$id" params={{ id: pr.project_id }} className="text-sm font-medium text-primary hover:underline">{pr.project_code} — {pr.project_name}</Link>
                <p className="text-xs text-muted-foreground">{pr.donors.join(", ")} · {money(pr.budget_usd)}</p>
              </div>
              <StatusBadge status={pr.status} />
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
