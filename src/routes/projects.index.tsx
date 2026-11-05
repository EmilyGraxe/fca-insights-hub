import { createFileRoute, Link } from "@tanstack/react-router";

import { pageMeta } from "@/lib/seo";
import { FilterBar } from "@/components/app/filter-bar";
import { useFilters } from "@/components/app/filters-context";
import { DataTable, type Column } from "@/components/app/data-table";
import { PageHeader, StatusBadge } from "@/components/app/ui-bits";
import { fmt, money, programmeName, projectPerformance } from "@/data/analytics";

export const Route = createFileRoute("/projects/")({
  head: () => pageMeta("Project registry", "Projects with donors, budgets, targets, reach and indicator performance."),
  component: ProjectsPage,
});

type Row = ReturnType<typeof projectPerformance>[number];

const columns: Column<Row>[] = [
  {
    id: "code",
    header: "Project",
    sortValue: (r) => r.project.project_code,
    cell: (r) => (
      <div>
        <Link to="/projects/$id" params={{ id: r.project.project_id }} className="font-medium text-primary hover:underline">{r.project.project_code}</Link>
        <span className="block text-xs text-muted-foreground">{r.project.project_name}</span>
      </div>
    ),
  },
  { id: "prog", header: "Programme", sortValue: (r) => programmeName(r.project.programme_id), cell: (r) => programmeName(r.project.programme_id) },
  { id: "donor", header: "Donors", cell: (r) => r.project.donors.join(", ") },
  { id: "budget", header: "Budget", align: "right", sortValue: (r) => r.project.budget_usd, cell: (r) => money(r.project.budget_usd) },
  { id: "reached", header: "Reached / target", align: "right", sortValue: (r) => r.reached, cell: (r) => `${fmt(r.reached)} / ${fmt(r.project.target_beneficiaries)}` },
  { id: "ach", header: "Achievement", align: "right", sortValue: (r) => r.achievement, cell: (r) => `${r.achievement}%` },
  { id: "perf", header: "Performance", sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
  { id: "status", header: "Status", sortValue: (r) => r.project.status, cell: (r) => <StatusBadge status={r.project.status} /> },
];

function ProjectsPage() {
  const { scope } = useFilters();
  return (
    <>
      <PageHeader eyebrow="Registries" title="Project registry" description="Each project belongs to one programme and links its activities, services, indicators and monitoring." />
      <FilterBar />
      <DataTable rows={projectPerformance(scope)} columns={columns} searchKeys={(r) => `${r.project.project_code} ${r.project.project_name} ${r.project.donors.join(" ")}`} searchPlaceholder="Search projects or donors" />
    </>
  );
}
