import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dataset } from "@/data/dataset";
import { districts, monthLabel, type Filters } from "@/data/analytics";
import { BENEFICIARY_TYPES, SECTORS, SEXES } from "@/data/config";
import { useFilters } from "./filters-context";

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  allLabel: string;
}) {
  return (
    <label className="flex min-w-[9.5rem] flex-1 flex-col gap-1 sm:flex-none">
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 w-full sm:w-44" aria-label={label}>
          <SelectValue placeholder={allLabel} />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          <SelectItem value="all">{allLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

export function FilterBar() {
  const { filters, setFilter, reset, scope } = useFilters();

  const projectOptions = dataset.projects
    .filter((p) => filters.programme === "all" || p.programme_id === filters.programme)
    .map((p) => ({ value: p.project_id, label: `${p.project_code} — ${p.project_name}` }));

  const set = (key: keyof Filters) => (v: string) => setFilter(key, v);

  return (
    <section
      aria-label="Global filters"
      className="rounded-lg border border-border bg-card p-4 shadow-panel"
    >
      <div className="flex flex-wrap items-end gap-3">
        <FilterSelect
          label="Programme"
          value={filters.programme}
          onChange={set("programme")}
          allLabel="All programmes"
          options={dataset.programmes.map((p) => ({
            value: p.programme_id,
            label: p.programme_name,
          }))}
        />
        <FilterSelect
          label="Project"
          value={filters.project}
          onChange={set("project")}
          allLabel="All projects"
          options={projectOptions}
        />
        <FilterSelect
          label="District"
          value={filters.district}
          onChange={set("district")}
          allLabel="All districts"
          options={districts.map((d) => ({ value: d, label: d }))}
        />
        <FilterSelect
          label="Sector"
          value={filters.sector}
          onChange={set("sector")}
          allLabel="All sectors"
          options={SECTORS.map((s) => ({ value: s, label: s }))}
        />
        <FilterSelect
          label="Population group"
          value={filters.beneficiaryType}
          onChange={set("beneficiaryType")}
          allLabel="All population groups"
          options={BENEFICIARY_TYPES.map((s) => ({ value: s, label: s }))}
        />
        <FilterSelect
          label="Sex"
          value={filters.sex}
          onChange={set("sex")}
          allLabel="All"
          options={SEXES.map((s) => ({ value: s, label: s }))}
        />
        <FilterSelect
          label="Period"
          value={filters.period}
          onChange={set("period")}
          allLabel="Full period"
          options={dataset.months.map((m) => ({ value: m, label: monthLabel(m) }))}
        />
        <div className="flex items-center gap-2 pb-0.5">
          <Badge variant="secondary" className="whitespace-nowrap">
            {scope.activeFilterCount === 0
              ? "No filters applied"
              : `${scope.activeFilterCount} filter${scope.activeFilterCount === 1 ? "" : "s"} applied`}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            disabled={scope.activeFilterCount === 0}
            className="gap-1.5"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Reset
          </Button>
        </div>
      </div>
    </section>
  );
}
