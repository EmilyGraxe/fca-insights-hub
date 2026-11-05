import { createFileRoute, Link } from "@tanstack/react-router";

import { pageMeta } from "@/lib/seo";
import { FilterBar } from "@/components/app/filter-bar";
import { useFilters } from "@/components/app/filters-context";
import { DataTable, type Column } from "@/components/app/data-table";
import { PageHeader, StatusBadge } from "@/components/app/ui-bits";
import { locationLabel } from "@/data/analytics";
import type { Beneficiary } from "@/data/types";

export const Route = createFileRoute("/beneficiaries/")({
  head: () =>
    pageMeta(
      "Beneficiary registry",
      "Search every registered person by FCA Beneficiary ID, household, location and population group.",
    ),
  component: BeneficiariesPage,
});

const columns: Column<Beneficiary>[] = [
  {
    id: "id",
    header: "FCA ID",
    sortValue: (b) => b.beneficiary_id,
    cell: (b) => (
      <Link to="/beneficiaries/$id" params={{ id: b.beneficiary_id }} className="font-mono text-xs font-medium text-primary hover:underline">
        {b.beneficiary_id}
      </Link>
    ),
  },
  { id: "name", header: "Name", sortValue: (b) => b.name, cell: (b) => b.name },
  { id: "sex", header: "Sex", sortValue: (b) => b.sex ?? "", cell: (b) => b.sex ?? <span className="text-muted-foreground">Missing</span> },
  { id: "age", header: "Age", align: "right", sortValue: (b) => b.age ?? -1, cell: (b) => b.age ?? "—" },
  { id: "type", header: "Population group", sortValue: (b) => b.beneficiary_type, cell: (b) => b.beneficiary_type },
  {
    id: "hh",
    header: "Household",
    sortValue: (b) => b.household_id,
    cell: (b) => (
      <Link to="/households/$id" params={{ id: b.household_id }} className="font-mono text-xs text-primary hover:underline">
        {b.household_id}
      </Link>
    ),
  },
  { id: "loc", header: "Location", sortValue: (b) => locationLabel(b.location_id), cell: (b) => locationLabel(b.location_id) },
  { id: "status", header: "Status", sortValue: (b) => b.status, cell: (b) => <StatusBadge status={b.status} /> },
];

function BeneficiariesPage() {
  const { scope } = useFilters();
  return (
    <>
      <PageHeader
        eyebrow="Registries"
        title="Beneficiary registry"
        description="Each person holds one FCA Beneficiary ID that links every programme, project, activity, service and outcome they are part of."
      />
      <FilterBar />
      <DataTable
        rows={scope.beneficiaries}
        columns={columns}
        searchKeys={(b) => `${b.beneficiary_id} ${b.name} ${b.household_id} ${b.phone ?? ""}`}
        searchPlaceholder="Search by name, ID, household or phone"
        caption="Registered beneficiaries"
      />
    </>
  );
}
