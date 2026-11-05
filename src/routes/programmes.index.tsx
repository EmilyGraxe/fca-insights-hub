import { createFileRoute, Link } from "@tanstack/react-router";

import { pageMeta } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, StatusBadge } from "@/components/app/ui-bits";
import { fmt, programmeProfile } from "@/data/analytics";
import { dataset } from "@/data/dataset";

export const Route = createFileRoute("/programmes/")({
  head: () => pageMeta("Programmes", "FCA Uganda programmes with their projects, reach and sector focus."),
  component: ProgrammesPage,
});

function ProgrammesPage() {
  return (
    <>
      <PageHeader eyebrow="Registries" title="Programmes" description="Programmes group related projects under one strategic objective." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dataset.programmes.map((p) => {
          const prof = programmeProfile(p.programme_id)!;
          return (
            <Link key={p.programme_id} to="/programmes/$id" params={{ id: p.programme_id }} className="group">
              <Card className="h-full shadow-panel transition-shadow group-hover:shadow-raised">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">{p.sector}</p>
                    <StatusBadge status={p.status} />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">{p.programme_name}</h2>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
                  <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                    <div><p className="text-lg font-semibold tabular-nums">{prof.projects.length}</p><p className="text-[11px] text-muted-foreground">Projects</p></div>
                    <div><p className="text-lg font-semibold tabular-nums">{prof.activities.length}</p><p className="text-[11px] text-muted-foreground">Activities</p></div>
                    <div><p className="text-lg font-semibold tabular-nums">{fmt(prof.reached.size)}</p><p className="text-[11px] text-muted-foreground">Reached</p></div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
