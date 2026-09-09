import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { DEFAULT_FILTERS, buildScope, computeKpis, type Filters, type Kpis, type Scope } from "@/data/analytics";

interface FiltersContextValue {
  filters: Filters;
  setFilter: (key: keyof Filters, value: string) => void;
  reset: () => void;
  scope: Scope;
  kpis: Kpis;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const value = useMemo<FiltersContextValue>(() => {
    const scope = buildScope(filters);
    return {
      filters,
      setFilter: (key, val) =>
        setFilters((prev) => ({
          ...prev,
          [key]: val,
          ...(key === "programme" ? { project: "all" } : {}),
        })),
      reset: () => setFilters(DEFAULT_FILTERS),
      scope,
      kpis: computeKpis(scope),
    };
  }, [filters]);

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters(): FiltersContextValue {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used inside FiltersProvider");
  return ctx;
}
