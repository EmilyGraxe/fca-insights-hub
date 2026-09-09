import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "./ui-bits";

export interface Column<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
  align?: "left" | "right";
}

export function DataTable<T>({
  rows,
  columns,
  searchKeys,
  searchPlaceholder = "Search records…",
  pageSize = 10,
  emptyTitle = "No records match the current filters",
  emptyDescription = "Adjust the filters or search terms to widen the selection.",
  caption,
  toolbar,
}: {
  rows: T[];
  columns: Column<T>[];
  searchKeys?: (row: T) => string;
  searchPlaceholder?: string;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  caption?: string;
  toolbar?: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ id: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q && searchKeys ? rows.filter((r) => searchKeys(r).toLowerCase().includes(q)) : rows;
    if (!sort) return base;
    const col = columns.find((c) => c.id === sort.id);
    if (!col?.sortValue) return base;
    const get = col.sortValue;
    return [...base].sort((a, b) => {
      const av = get(a);
      const bv = get(b);
      if (typeof av === "number" && typeof bv === "number")
        return sort.dir === "asc" ? av - bv : bv - av;
      return sort.dir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [rows, query, sort, columns, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize);

  const toggleSort = (id: string) =>
    setSort((prev) =>
      prev?.id === id ? { id, dir: prev.dir === "asc" ? "desc" : "asc" } : { id, dir: "asc" },
    );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {searchKeys ? (
          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="pl-8"
            />
          </div>
        ) : (
          <span />
        )}
        <div className="flex flex-wrap items-center gap-2">
          {toolbar}
          <span className="text-xs text-muted-foreground">
            {filtered.length.toLocaleString()} record{filtered.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <Table>
            {caption ? <caption className="sr-only">{caption}</caption> : null}
            <TableHeader>
              <TableRow className="bg-muted/60">
                {columns.map((col) => (
                  <TableHead
                    key={col.id}
                    scope="col"
                    className={cn("whitespace-nowrap text-xs uppercase tracking-wide", col.align === "right" && "text-right", col.className)}
                  >
                    {col.sortValue ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.id)}
                        className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
                        aria-label={`Sort by ${col.header}`}
                      >
                        {col.header}
                        {sort?.id === col.id ? (
                          sort.dir === "asc" ? (
                            <ArrowUp className="size-3" aria-hidden />
                          ) : (
                            <ArrowDown className="size-3" aria-hidden />
                          )
                        ) : (
                          <ChevronsUpDown className="size-3 opacity-40" aria-hidden />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      className={cn("text-sm", col.align === "right" && "text-right tabular-nums")}
                    >
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Page {current} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(current - 1)}
              disabled={current === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(current + 1)}
              disabled={current === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
