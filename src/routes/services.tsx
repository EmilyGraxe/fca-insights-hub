import { createFileRoute, Link } from "@tanstack/react-router";

import { pageMeta } from "@/lib/seo";
import { FilterBar } from "@/components/app/filter-bar";
import { useFilters } from "@/components/app/filters-context";
import { DataTable, type Column } from "@/components/app/data-table";
import { HBarChart, DonutChart } from "@/components/app/charts";
import { PageHeader, Panel, StatusBadge } from "@/components/app/ui-bits";
import { beneficiaryName, countBy, projectName } from "@/data/analytics";
import type { Service } from "@/data/types";

export const Route = createFileRoute("/services")({
  head: () => pageMeta("Services delivered", "Every service, cash grant, kit, session and referral delivered to beneficiaries."),
  component: ServicesPage,
});

const columns: Column<Service>[] = [
  { id: "date", header: "Date", sortValue: (s) => s.date, cell: (s) => s.date },
  { id: "type", header: "Service", sortValue: (s) => s.service_type, cell: (s) => s.service_type },
  {
    id: "who",
    header: "Beneficiary",
    sortValue: (s) => beneficiaryName(s.beneficiary_id),
    cell: (s) => <Link to="/beneficiaries/$id" params={{ id: s.beneficiary_id }} className="text-primary hover:underline">{beneficiaryName(s.beneficiary_id)}</Link>,
  },
  { id: "proj", header: "Project", sortValue: (s) => projectName(s.project_id), cell: (s) => projectName(s.project_id) },
  { id: "qty", header: "Quantity", align: "right", sortValue: (s) => s.quantity, cell: (s) => `${s.quantity} ${s.unit}` },
  { id: "follow", header: "Follow-up", sortValue: (s) => s.follow_up, cell: (s) => <StatusBadge status={s.follow_up} /> },
  { id: "status", header: "Status", sortValue: (s) => s.status, cell: (s) => <StatusBadge status={s.status} /> },
];

function ServicesPage() {
  const { scope } = useFilters();
  return (
    <>
      <PageHeader eyebrow="Registries" title="Services delivered" description="Services are recorded against the person, household, activity and project that delivered them." />
      <FilterBar />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Services by type"><HBarChart data={countBy(scope.services, (s) => s.service_type)} colorIndex={2} /></Panel>
        <Panel title="Delivery status"><DonutChart data={countBy(scope.services, (s) => s.status)} /></Panel>
      </div>
      <DataTable rows={scope.services} columns={columns} searchKeys={(s) => `${s.service_type} ${beneficiaryName(s.beneficiary_id)} ${s.beneficiary_id}`} searchPlaceholder="Search services" />
    </>
  );
}
