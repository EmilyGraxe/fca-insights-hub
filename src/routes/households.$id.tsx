import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { pageMeta } from "@/lib/seo";
import { DefinitionList, EmptyState, KpiCard, PageHeader, Panel, StatusBadge } from "@/components/app/ui-bits";
import { householdProfile, locationLabel, projectName } from "@/data/analytics";

export const Route = createFileRoute("/households/$id")({
  loader: ({ params }) => {
    if (!householdProfile(params.id)) throw notFound();
    return { id: params.id };
  },
  head: ({ params }) => pageMeta(`Household ${params.id}`, "Household members, head, location and services received."),
  notFoundComponent: () => <EmptyState title="Household not found" />,
  component: HouseholdPage,
});

function HouseholdPage() {
  const { id } = Route.useLoaderData();
  const p = householdProfile(id)!;
  const h = p.household;
  return (
    <>
      <PageHeader eyebrow="Household" title={h.household_id} description={`${h.household_type} · ${locationLabel(h.location_id)}`} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Household size" value={String(h.household_size)} />
        <KpiCard label="Registered members" value={String(p.members.length)} />
        <KpiCard label="Services received" value={String(p.services.length)} />
        <KpiCard label="Vulnerability" value={h.vulnerability_status} />
      </div>
      <Panel title="Household details">
        <DefinitionList
          items={[
            { label: "Head of household", value: p.head ? <Link to="/beneficiaries/$id" params={{ id: p.head.beneficiary_id }} className="text-primary hover:underline">{p.head.name}</Link> : "Not recorded" },
            { label: "Type", value: h.household_type },
            { label: "Registered", value: h.registration_date },
          ]}
        />
      </Panel>
      <Panel title="Members">
        <ul className="divide-y divide-border">
          {p.members.map((m) => (
            <li key={m.beneficiary_id} className="flex items-center justify-between gap-3 py-2">
              <div>
                <Link to="/beneficiaries/$id" params={{ id: m.beneficiary_id }} className="text-sm font-medium text-primary hover:underline">{m.name}</Link>
                <p className="text-xs text-muted-foreground">{m.beneficiary_id} · {m.sex ?? "Sex not recorded"} · {m.age ?? "?"} yrs</p>
              </div>
              <StatusBadge status={m.status} />
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Services to this household">
        {p.services.length === 0 ? <EmptyState title="No services recorded" /> : (
          <ul className="divide-y divide-border">
            {p.services.map((s) => (
              <li key={s.service_id} className="flex items-center justify-between gap-3 py-2">
                <div>
                  <p className="text-sm font-medium">{s.service_type}</p>
                  <p className="text-xs text-muted-foreground">{s.date} · {projectName(s.project_id)}</p>
                </div>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
