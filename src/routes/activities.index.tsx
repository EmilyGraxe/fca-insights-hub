import { createFileRoute, Link } from "@tanstack/react-router";

import { pageMeta } from "@/lib/seo";
import { FilterBar } from "@/components/app/filter-bar";
import { useFilters } from "@/components/app/filters-context";
import { DataTable, type Column } from "@/components/app/data-table";
import { PageHeader, StatusBadge } from "@/components/app/ui-bits";
import { locationLabel, projectName } from "@/data/analytics";
import type { Activity } from "@/data/types";

export const Route = createFileRoute("/activities/")({
  head: () => pageMeta("Activities", "Trainings, distributions, sessions and meetings with attendance against target."),
  component: ActivitiesPage,
});

const columns: Column<Activity>[] = [
  {
    id: "name",
    header: "Activity",
    sortValue: (a) => a.activity_name,
    cell: (a) => (
      <div>
        <Link to="/activities/$id" params={{ id: a.activity_id }} className="font-medium text-primary hover:underline">{a.activity_name}</Link>
        <span className="block text-xs text-muted-foreground">{a.activity_type}</span>
      </div>
    ),
  },
  { id: "date", header: "Date", sortValue: (a) => a.date, cell: (a) => a.date },
  { id: "proj", header: "Project", sortValue: (a) => projectName(a.project_id), cell: (a) => projectName(a.project_id) },
  { id: "loc", header: "Location", sortValue: (a) => locationLabel(a.location_id), cell: (a) => locationLabel(a.location_id) },
  { id: "part", header: "Participants", align: "right", sortValue: (a) => a.actual_participants, cell: (a) => `${a.actual_participants} / ${a.target_participants}` },
  { id: "status", header: "Status", sortValue: (a) => a.status, cell: (a) => <StatusBadge status={a.status} /> },
];

function ActivitiesPage() {
  const { scope } = useFilters();
  return (
    <>
      <PageHeader eyebrow="Registries" title="Activities & participation" description="Every activity records who attended, linked through their FCA Beneficiary ID." />
      <FilterBar />
      <DataTable rows={scope.activities} columns={columns} searchKeys={(a) => `${a.activity_name} ${a.activity_type} ${a.facilitator}`} searchPlaceholder="Search activities" />
    </>
  );
}
