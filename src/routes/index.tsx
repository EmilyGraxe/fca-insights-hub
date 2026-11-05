import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Info, TrendingUp } from "lucide-react";

import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { FilterBar } from "@/components/app/filter-bar";
import { useFilters } from "@/components/app/filters-context";
import { KpiCard, PageHeader, Panel, SectionLink, StatusBadge } from "@/components/app/ui-bits";
import { DonutChart, HBarChart, PyramidChart, TrendChart } from "@/components/app/charts";
import {
  countBy,
  demographicPyramid,
  fmt,
  generateInsights,
  geographyRollup,
  money,
  monthlyTrend,
  projectPerformance,
} from "@/data/analytics";

export const Route = createFileRoute("/")({
  head: () =>
    pageMeta(
      "Executive dashboard",
      "Reach, demographics, programme performance, geography and data quality across FCA Uganda programmes.",
    ),
  component: Dashboard,
});

const toneIcon = {
  positive: CheckCircle2,
  watch: AlertTriangle,
  risk: AlertTriangle,
  neutral: Info,
};
const toneClass = {
  positive: "text-success",
  watch: "text-warning",
  risk: "text-destructive",
  neutral: "text-info",
};

function Dashboard() {
  const { scope, kpis } = useFilters();
  const trend = monthlyTrend(scope);
  const pyramid = demographicPyramid(scope.beneficiaries);
  const insights = generateInsights(scope, kpis);
  const perf = projectPerformance(scope).sort((a, b) => b.reached - a.reached);
  const geo = geographyRollup(scope).filter((g) => g.beneficiaries > 0);
  const types = countBy(scope.beneficiaries, (b) => b.beneficiary_type);
  const services = countBy(scope.services, (s) => s.service_type).slice(0, 8);

  return (
    <>
      <PageHeader
        eyebrow="Understand · Decide"
        title="Executive dashboard"
        description="One view of who FCA Uganda reaches, where, through which programmes, and how well results are tracking. Every figure responds to the filters below."
      />
      <FilterBar />

      <section aria-label="Key figures" className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <KpiCard label="Registered people" value={fmt(kpis.beneficiaries)} hint={`${fmt(kpis.households)} households`} />
        <KpiCard
          label="Reached in scope"
          value={fmt(kpis.reached)}
          progress={kpis.reachVsTarget}
          hint={`${kpis.reachVsTarget}% of ${fmt(kpis.targetReach)} target`}
        />
        <KpiCard label="Activities" value={fmt(kpis.activities)} hint={`${fmt(kpis.services)} services delivered`} />
        <KpiCard
          label="Women & girls"
          value={`${kpis.femaleShare}%`}
          tone={kpis.femaleShare >= 50 ? "positive" : "warning"}
          hint={`Children ${kpis.childShare}% · Youth ${kpis.youthShare}%`}
        />
        <KpiCard
          label="Indicator achievement"
          value={`${kpis.achievement}%`}
          tone={kpis.achievement >= 90 ? "positive" : kpis.achievement >= 75 ? "warning" : "risk"}
          progress={kpis.achievement}
          hint={`Budget in scope ${money(kpis.budget)}`}
        />
        <KpiCard
          label="Data completeness"
          value={`${kpis.completeness}%`}
          tone={kpis.completeness >= 90 ? "positive" : "warning"}
          progress={kpis.completeness}
          hint={`Disability ${kpis.disabilityShare}% of people`}
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Reach over time"
          description="Unique participants and services recorded per month."
        >
          <TrendChart data={trend} keys={["Participants", "Services"]} />
        </Panel>
        <Panel title="Insights" description="Rule-based findings from the current selection.">
          <ul className="space-y-3">
            {insights.map((ins) => {
              const Icon = toneIcon[ins.tone];
              return (
                <li key={ins.title} className="flex gap-2.5">
                  <Icon className={cn("mt-0.5 size-4 shrink-0", toneClass[ins.tone])} aria-hidden />
                  <div>
                    <p className="text-sm font-medium text-foreground">{ins.title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{ins.detail}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Age and sex profile" description="Registered people by age group (female left, male right).">
          <PyramidChart data={pyramid} />
        </Panel>
        <Panel title="Population groups" description="Share of people by displacement status.">
          <DonutChart data={types} />
        </Panel>
      </div>

      <Panel
        title="Project performance"
        description="Reach against target and indicator achievement."
        actions={<SectionLink to="/projects" label="All projects" />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3 font-semibold">Project</th>
                <th className="py-2 pr-3 text-right font-semibold">Activities</th>
                <th className="py-2 pr-3 text-right font-semibold">Reached</th>
                <th className="py-2 pr-3 text-right font-semibold">Coverage</th>
                <th className="py-2 pr-3 text-right font-semibold">Achievement</th>
                <th className="py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {perf.map((p) => (
                <tr key={p.project.project_id} className="border-b border-border/60 last:border-0">
                  <td className="py-2 pr-3">
                    <Link
                      to="/projects/$id"
                      params={{ id: p.project.project_id }}
                      className="font-medium text-primary hover:underline"
                    >
                      {p.project.project_code}
                    </Link>
                    <span className="block text-xs text-muted-foreground">{p.project.project_name}</span>
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">{p.activities}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{fmt(p.reached)}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{p.coverage}%</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{p.achievement}%</td>
                  <td className="py-2">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="People by district"
          description="Where registered people live."
          actions={<SectionLink to="/geography" label="Geography" />}
        >
          <HBarChart data={geo.map((g) => ({ name: g.district, value: g.beneficiaries }))} />
        </Panel>
        <Panel
          title="Top services delivered"
          description="Service records in the current selection."
          actions={<SectionLink to="/services" label="Services" />}
        >
          <HBarChart data={services} colorIndex={2} />
        </Panel>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <TrendingUp className="size-3.5" aria-hidden />
        All figures are synthetic demonstration data and do not represent FCA programme results.
      </p>
    </>
  );
}
