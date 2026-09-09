import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Inbox } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("shadow-panel", className)}>
      <CardHeader className="gap-1 pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description ? (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  progress,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  progress?: number;
  tone?: "default" | "positive" | "warning" | "risk";
}) {
  const toneClass =
    tone === "positive"
      ? "text-success"
      : tone === "warning"
        ? "text-warning"
        : tone === "risk"
          ? "text-destructive"
          : "text-foreground";
  return (
    <Card className="shadow-panel">
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={cn("mt-2 text-2xl font-semibold tabular-nums tracking-tight", toneClass)}>{value}</p>
        {typeof progress === "number" ? (
          <Progress value={Math.min(100, Math.max(0, progress))} className="mt-3 h-1.5" />
        ) : null}
        {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

const statusTones: Record<string, string> = {
  Active: "bg-success/12 text-success border-success/25",
  Completed: "bg-success/12 text-success border-success/25",
  Delivered: "bg-success/12 text-success border-success/25",
  Achieved: "bg-success/12 text-success border-success/25",
  Present: "bg-success/12 text-success border-success/25",
  Approved: "bg-success/12 text-success border-success/25",
  Resolved: "bg-success/12 text-success border-success/25",
  Published: "bg-success/12 text-success border-success/25",
  "On track": "bg-success/12 text-success border-success/25",
  Closed: "bg-muted text-muted-foreground border-border",
  Inactive: "bg-muted text-muted-foreground border-border",
  Draft: "bg-muted text-muted-foreground border-border",
  "Not required": "bg-muted text-muted-foreground border-border",
  Planned: "bg-info/12 text-info border-info/25",
  Referred: "bg-info/12 text-info border-info/25",
  "In progress": "bg-info/12 text-info border-info/25",
  Neutral: "bg-info/12 text-info border-info/25",
  Watch: "bg-warning/15 text-warning border-warning/30",
  Pending: "bg-warning/15 text-warning border-warning/30",
  Partial: "bg-warning/15 text-warning border-warning/30",
  "Pending approval": "bg-warning/15 text-warning border-warning/30",
  "Pending review": "bg-warning/15 text-warning border-warning/30",
  "Partially achieved": "bg-warning/15 text-warning border-warning/30",
  Open: "bg-warning/15 text-warning border-warning/30",
  Concern: "bg-warning/15 text-warning border-warning/30",
  "Off track": "bg-destructive/12 text-destructive border-destructive/25",
  "Not achieved": "bg-destructive/12 text-destructive border-destructive/25",
  Absent: "bg-destructive/12 text-destructive border-destructive/25",
  Dropped: "bg-destructive/12 text-destructive border-destructive/25",
  Rejected: "bg-destructive/12 text-destructive border-destructive/25",
  Cancelled: "bg-destructive/12 text-destructive border-destructive/25",
  Suspended: "bg-destructive/12 text-destructive border-destructive/25",
  Positive: "bg-success/12 text-success border-success/25",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", statusTones[status] ?? "bg-secondary text-secondary-foreground border-border")}
    >
      {status}
    </Badge>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
      <Inbox className="size-5 text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? <p className="max-w-md text-xs text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function DefinitionList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</dt>
          <dd className="mt-1 text-sm text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SectionLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
    >
      {label}
      <ArrowRight className="size-3.5" aria-hidden />
    </Link>
  );
}
