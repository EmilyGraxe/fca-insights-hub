import { createFileRoute, Link } from "@tanstack/react-router";

import { pageMeta } from "@/lib/seo";
import { FilterBar } from "@/components/app/filter-bar";
import { useFilters } from "@/components/app/filters-context";
import { DataTable, type Column } from "@/components/app/data-table";
import { PageHeader } from "@/components/app/ui-bits";
import { beneficiaryName, locationLabel } from "@/data/analytics";
import type { Household } from "@/data/types";

export const Route = createFileRoute("/households/")({
  head: () => pageMeta("Household registry", "Households, their heads, size, type and vulnerability status."),
  component: HouseholdsPage,
});

const columns: Column<Household>[] = [
  {
    id: "id",
    header: "Household ID",
    sortValue: (h) => h.household_id,
    cell: (h) => (
      <Link to="/households/$id" params={{ id: h.household_id }} className="font-mono text-xs font-medium text-primary hover:underline">
        {h.household_id}
      </Link>
    ),
  },
  { id: "head", header: "Head of household", sortValue: (h) => beneficiaryName(h.household_head_id), cell: (h) => beneficiaryName(h.household_head_id) },
  { id: "size", header: "Size", align: "right", sortValue: (h) => h.household_size, cell: (h) => h.household_size },
  { id: "type", header: "Type", sortValue: (h) => h.household_type, cell: (h) => h.household_type },
  { id: "vuln", header: "Vulnerability", sortValue: (h) => h.vulnerability_status, cell: (h) => h.vulnerability_status },
  { id: "loc", header: "Location", sortValue: (h) => locationLabel(h.location_id), cell: (h) => locationLabel(h.location_id) },
  { id: "reg", header: "Registered", sortValue: (h) => h.registration_date, cell: (h) => h.registration_date },
];

function HouseholdsPage() {
  const { scope } = useFilters();
  return (
    <>
      <PageHeader eyebrow="Registries" title="Household registry" description="Households group people who live and share resources together; every member links back to one household record." />
      <FilterBar />
      <DataTable
        rows={scope.households}
        columns={columns}
        searchKeys={(h) => `${h.household_id} ${beneficiaryName(h.household_head_id)} ${locationLabel(h.location_id)}`}
        searchPlaceholder="Search households"
      />
    </>
  );
}
