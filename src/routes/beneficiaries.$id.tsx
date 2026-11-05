import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { pageMeta } from "@/lib/seo";
import { DefinitionList, EmptyState, KpiCard, PageHeader, Panel, StatusBadge } from "@/components/app/ui-bits";
import { beneficiaryProfile, locationLabel, programmeName, projectName } from "@/data/analytics";
import { dataset } from "@/data/dataset";

export const Route = createFileRoute("/beneficiaries/$id")({
  loader: ({ params }) => {
    const p = beneficiaryProfile(params.id);
    if (!p) throw notFound();
    return { id: params.id };
  },
  head: ({ params }) => pageMeta(`Beneficiary ${params.id}`, "Full identity, household, participation, services and outcomes for one person."),
  notFoundComponent: () => <EmptyState title="Beneficiary not found" description="This FCA ID does not exist in the registry." />,
  component: BeneficiaryPage,
});

function BeneficiaryPage() {
  const { id } = Route.useLoaderData();
  const p = beneficiaryProfile(id)!;
  const { person } = p;
  const indicatorName = (iid: string) => dataset.indicators.find((i) => i.indicator_id === iid)?.indicator_name ?? iid;

  return (
    <>
      <PageHeader
        eyebrow={`FCA ID ${person.beneficiary_id}`}
        title={person.name}
        description={`${person.beneficiary_type} · ${locationLabel(person.location_id)}`}
        actions={<StatusBadge status={person.status} />}
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Programmes" value={String(p.programmes.length)} />
        <KpiCard label="Activities attended" value={String(p.activities.filter((a) => a.participation.attendance === "Present").length)} hint={`of ${p.activities.length} enrolled`} />
        <KpiCard label="Services received" value={String(p.services.length)} />
        <KpiCard label="Outcomes recorded" value={String(p.outcomes.length)} />
      </div>

      <Panel title="Identity and profile">
        <DefinitionList
          items={[
            { label: "Sex", value: person.sex ?? "Not recorded" },
            { label: "Age", value: person.age ?? "Not recorded" },
            { label: "Date of birth", value: person.date_of_birth ?? "Not recorded" },
            { label: "Nationality", value: person.nationality },
            { label: "Disability", value: person.disability_status },
            { label: "Vulnerabilities", value: person.vulnerability.length ? person.vulnerability.join(", ") : "None recorded" },
            { label: "Occupation", value: person.occupation || "Not recorded" },
            { label: "Education", value: person.education_status || "Not recorded" },
            { label: "Phone", value: person.phone ?? "Not recorded" },
            { label: "Registered", value: person.registration_date },
            {
              label: "Household",
              value: (
                <Link to="/households/$id" params={{ id: person.household_id }} className="text-primary hover:underline">
                  {person.household_id} ({p.members.length} members)
                </Link>
              ),
            },
            { label: "Projects", value: p.projects.map(projectName).join(", ") || "None" },
          ]}
        />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Activity participation">
          {p.activities.length === 0 ? (
            <EmptyState title="No activity participation recorded" />
          ) : (
            <ul className="divide-y divide-border">
              {p.activities.map(({ activity, participation }) => (
                <li key={participation.participation_id} className="flex items-start justify-between gap-3 py-2">
                  <div>
                    <Link to="/activities/$id" params={{ id: activity.activity_id }} className="text-sm font-medium text-primary hover:underline">
                      {activity.activity_name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{activity.date} · {programmeName(activity.programme_id)}</p>
                  </div>
                  <div className="flex gap-1">
                    <StatusBadge status={participation.attendance} />
                    <StatusBadge status={participation.completion_status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Services received">
          {p.services.length === 0 ? (
            <EmptyState title="No services recorded" />
          ) : (
            <ul className="divide-y divide-border">
              {p.services.map((s) => (
                <li key={s.service_id} className="flex items-start justify-between gap-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{s.service_type}</p>
                    <p className="text-xs text-muted-foreground">{s.date} · {s.quantity} {s.unit} · {projectName(s.project_id)}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Outcomes">
          {p.outcomes.length === 0 ? (
            <EmptyState title="No outcomes recorded yet" />
          ) : (
            <ul className="divide-y divide-border">
              {p.outcomes.map((o) => (
                <li key={o.outcome_id} className="flex items-start justify-between gap-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{o.outcome_type}</p>
                    <p className="text-xs text-muted-foreground">{o.date} · {indicatorName(o.indicator_id)}</p>
                  </div>
                  <StatusBadge status={o.result} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Feedback and complaints">
          {p.feedback.length === 0 ? (
            <EmptyState title="No feedback recorded" />
          ) : (
            <ul className="divide-y divide-border">
              {p.feedback.map((f) => (
                <li key={f.feedback_id} className="py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{f.category}</p>
                    <StatusBadge status={f.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{f.date} · {f.channel} — {f.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
