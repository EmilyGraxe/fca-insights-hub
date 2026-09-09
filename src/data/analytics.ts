import { dataset } from "./dataset";
import { AGE_GROUPS, BENCHMARKS } from "./config";
import type {
  Activity,
  Beneficiary,
  Household,
  Indicator,
  Location,
  Participation,
  Programme,
  Project,
  Service,
} from "./types";

/* ------------------------------------------------------------------ indexes */

export const byId = {
  location: new Map(dataset.locations.map((l) => [l.location_id, l])),
  household: new Map(dataset.households.map((h) => [h.household_id, h])),
  beneficiary: new Map(dataset.beneficiaries.map((b) => [b.beneficiary_id, b])),
  programme: new Map(dataset.programmes.map((p) => [p.programme_id, p])),
  project: new Map(dataset.projects.map((p) => [p.project_id, p])),
  activity: new Map(dataset.activities.map((a) => [a.activity_id, a])),
  indicator: new Map(dataset.indicators.map((i) => [i.indicator_id, i])),
};

export const districts = Array.from(
  new Set(dataset.locations.map((l) => l.district)),
).sort();

export const settlements = Array.from(
  new Set(dataset.locations.map((l) => l.settlement)),
).sort();

export function locationLabel(id: string | null | undefined): string {
  if (!id) return "Not recorded";
  const l = byId.location.get(id);
  return l ? `${l.settlement}, ${l.district}` : "Unknown";
}

export function programmeName(id: string | null | undefined): string {
  if (!id) return "—";
  return byId.programme.get(id)?.programme_name ?? "Unknown";
}

export function projectName(id: string | null | undefined): string {
  if (!id) return "—";
  return byId.project.get(id)?.project_name ?? "Unknown";
}

export function beneficiaryName(id: string | null | undefined): string {
  if (!id) return "—";
  return byId.beneficiary.get(id)?.name ?? "Unknown";
}

/* ------------------------------------------------------------------ filters */

export interface Filters {
  programme: string;
  project: string;
  district: string;
  sector: string;
  beneficiaryType: string;
  sex: string;
  period: string;
}

export const DEFAULT_FILTERS: Filters = {
  programme: "all",
  project: "all",
  district: "all",
  sector: "all",
  beneficiaryType: "all",
  sex: "all",
  period: "all",
};

export interface Scope {
  filters: Filters;
  projects: Project[];
  projectIds: Set<string>;
  activities: Activity[];
  activityIds: Set<string>;
  participations: Participation[];
  services: Service[];
  beneficiaries: Beneficiary[];
  beneficiaryIds: Set<string>;
  households: Household[];
  indicators: Indicator[];
  locations: Location[];
  months: string[];
  activeFilterCount: number;
}

function inPeriod(date: string, period: string): boolean {
  if (period === "all") return true;
  return date.slice(0, 7) === period;
}

export function buildScope(filters: Filters): Scope {
  const locations = dataset.locations.filter(
    (l) => filters.district === "all" || l.district === filters.district,
  );
  const locationIds = new Set(locations.map((l) => l.location_id));

  const projects = dataset.projects.filter(
    (p) =>
      (filters.programme === "all" || p.programme_id === filters.programme) &&
      (filters.project === "all" || p.project_id === filters.project) &&
      (filters.sector === "all" || p.sector === filters.sector) &&
      (filters.district === "all" ||
        p.location_ids.some((id) => locationIds.has(id))),
  );
  const projectIds = new Set(projects.map((p) => p.project_id));

  const activities = dataset.activities.filter(
    (a) =>
      projectIds.has(a.project_id) &&
      locationIds.has(a.location_id) &&
      inPeriod(a.date, filters.period),
  );
  const activityIds = new Set(activities.map((a) => a.activity_id));

  const matchesPerson = (b: Beneficiary | undefined): boolean => {
    if (!b) return false;
    if (filters.beneficiaryType !== "all" && b.beneficiary_type !== filters.beneficiaryType)
      return false;
    if (filters.sex !== "all" && b.sex !== filters.sex) return false;
    if (filters.district !== "all" && (!b.location_id || !locationIds.has(b.location_id)))
      return false;
    return true;
  };

  const participations = dataset.participations.filter(
    (p) => activityIds.has(p.activity_id) && matchesPerson(byId.beneficiary.get(p.beneficiary_id)),
  );

  const services = dataset.services.filter(
    (s) =>
      projectIds.has(s.project_id) &&
      inPeriod(s.date, filters.period) &&
      matchesPerson(byId.beneficiary.get(s.beneficiary_id)),
  );

  const reachedIds = new Set<string>([
    ...participations.map((p) => p.beneficiary_id),
    ...services.map((s) => s.beneficiary_id),
  ]);

  const noProgrammeScope =
    filters.programme === "all" &&
    filters.project === "all" &&
    filters.sector === "all" &&
    filters.period === "all";

  const beneficiaries = dataset.beneficiaries.filter(
    (b) => matchesPerson(b) && (noProgrammeScope || reachedIds.has(b.beneficiary_id)),
  );
  const beneficiaryIds = new Set(beneficiaries.map((b) => b.beneficiary_id));

  const householdIds = new Set(beneficiaries.map((b) => b.household_id));
  const households = dataset.households.filter((h) => householdIds.has(h.household_id));

  const indicators = dataset.indicators.filter((i) => projectIds.has(i.project_id));

  const activeFilterCount = (Object.keys(filters) as (keyof Filters)[]).filter(
    (k) => filters[k] !== "all",
  ).length;

  return {
    filters,
    projects,
    projectIds,
    activities,
    activityIds,
    participations,
    services,
    beneficiaries,
    beneficiaryIds,
    households,
    indicators,
    locations,
    months: dataset.months,
    activeFilterCount,
  };
}

/* -------------------------------------------------------------- aggregation */

export function countBy<T>(rows: T[], key: (row: T) => string | null): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    const k = key(row) ?? "Not recorded";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

export function pct(part: number, total: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 1000) / 10;
}

export function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

export function money(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n}`;
}

export function monthLabel(month: string): string {
  const [y, m] = month.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const idx = Number(m) - 1;
  return `${names[idx] ?? m} ${String(y).slice(2)}`;
}

/* --------------------------------------------------------------------- KPIs */

export interface Kpis {
  beneficiaries: number;
  households: number;
  reached: number;
  activities: number;
  services: number;
  femaleShare: number;
  childShare: number;
  youthShare: number;
  disabilityShare: number;
  attendanceRate: number;
  completionRate: number;
  achievement: number;
  budget: number;
  targetReach: number;
  reachVsTarget: number;
  completeness: number;
}

export function computeKpis(scope: Scope): Kpis {
  const b = scope.beneficiaries;
  const reached = new Set<string>([
    ...scope.participations.map((p) => p.beneficiary_id),
    ...scope.services.map((s) => s.beneficiary_id),
  ]).size;
  const present = scope.participations.filter((p) => p.attendance === "Present").length;
  const completed = scope.participations.filter((p) => p.completion_status === "Completed").length;
  const achievement =
    scope.indicators.length === 0
      ? 0
      : Math.round(
          (sum(scope.indicators.map((i) => Math.min(i.actual ?? 0, i.target * 1.5)))
            / Math.max(1, sum(scope.indicators.map((i) => i.target)))) * 100,
        );
  const targetReach = sum(scope.projects.map((p) => p.target_beneficiaries));

  return {
    beneficiaries: b.length,
    households: scope.households.length,
    reached,
    activities: scope.activities.length,
    services: scope.services.length,
    femaleShare: pct(b.filter((x) => x.sex === "Female").length, b.length),
    childShare: pct(b.filter((x) => x.age !== null && x.age < 18).length, b.length),
    youthShare: pct(
      b.filter((x) => x.age !== null && x.age >= 18 && x.age <= 24).length,
      b.length,
    ),
    disabilityShare: pct(b.filter((x) => x.disability_status !== "None").length, b.length),
    attendanceRate: pct(present, scope.participations.length),
    completionRate: pct(completed, scope.participations.length),
    achievement,
    budget: sum(scope.projects.map((p) => p.budget_usd)),
    targetReach,
    reachVsTarget: pct(reached, targetReach),
    completeness: completenessScore(b),
  };
}

/* ------------------------------------------------------------ data quality */

const REQUIRED_FIELDS: { key: keyof Beneficiary; label: string }[] = [
  { key: "sex", label: "Sex" },
  { key: "date_of_birth", label: "Date of birth" },
  { key: "location_id", label: "Location" },
  { key: "phone", label: "Contact phone" },
  { key: "occupation", label: "Occupation" },
  { key: "education_status", label: "Education status" },
];

export function fieldCompleteness(rows: Beneficiary[]) {
  return REQUIRED_FIELDS.map((f) => {
    const filled = rows.filter((r) => {
      const v = r[f.key];
      return v !== null && v !== "" && v !== undefined;
    }).length;
    return { field: f.label, filled, missing: rows.length - filled, rate: pct(filled, rows.length) };
  });
}

export function completenessScore(rows: Beneficiary[]): number {
  const per = fieldCompleteness(rows);
  if (per.length === 0 || rows.length === 0) return 0;
  return Math.round((sum(per.map((p) => p.rate)) / per.length) * 10) / 10;
}

export function incompleteRecords(rows: Beneficiary[]) {
  return rows
    .map((r) => {
      const missing = REQUIRED_FIELDS.filter((f) => {
        const v = r[f.key];
        return v === null || v === "" || v === undefined;
      }).map((f) => f.label);
      return { record: r, missing };
    })
    .filter((r) => r.missing.length > 0);
}

/* -------------------------------------------------------------- age / trend */

export function demographicPyramid(rows: Beneficiary[]) {
  return AGE_GROUPS.map((g) => {
    const inGroup = rows.filter((r) => r.age_group === g.key);
    return {
      group: g.label,
      Female: inGroup.filter((r) => r.sex === "Female").length,
      Male: inGroup.filter((r) => r.sex === "Male").length,
      total: inGroup.length,
    };
  });
}

export function monthlyTrend(scope: Scope) {
  return scope.months.map((m) => {
    const acts = scope.activities.filter((a) => a.date.slice(0, 7) === m);
    const actIds = new Set(acts.map((a) => a.activity_id));
    const parts = scope.participations.filter((p) => actIds.has(p.activity_id));
    const svcs = scope.services.filter((s) => s.date.slice(0, 7) === m);
    return {
      month: monthLabel(m),
      key: m,
      Participants: new Set(parts.map((p) => p.beneficiary_id)).size,
      Services: svcs.length,
      Activities: acts.length,
    };
  });
}

export function geographyRollup(scope: Scope) {
  const map = new Map<
    string,
    { district: string; beneficiaries: number; households: number; activities: number; services: number; lat: number; lng: number }
  >();
  for (const l of scope.locations) {
    if (!map.has(l.district))
      map.set(l.district, {
        district: l.district,
        beneficiaries: 0,
        households: 0,
        activities: 0,
        services: 0,
        lat: l.latitude,
        lng: l.longitude,
      });
  }
  for (const b of scope.beneficiaries) {
    const l = b.location_id ? byId.location.get(b.location_id) : undefined;
    const row = l ? map.get(l.district) : undefined;
    if (row) row.beneficiaries += 1;
  }
  for (const h of scope.households) {
    const l = byId.location.get(h.location_id);
    const row = l ? map.get(l.district) : undefined;
    if (row) row.households += 1;
  }
  for (const a of scope.activities) {
    const l = byId.location.get(a.location_id);
    const row = l ? map.get(l.district) : undefined;
    if (row) row.activities += 1;
  }
  for (const s of scope.services) {
    const act = byId.activity.get(s.activity_id);
    const l = act ? byId.location.get(act.location_id) : undefined;
    const row = l ? map.get(l.district) : undefined;
    if (row) row.services += 1;
  }
  return Array.from(map.values()).sort((a, b) => b.beneficiaries - a.beneficiaries);
}

/* ---------------------------------------------------------- project scoring */

export function projectPerformance(scope: Scope) {
  return scope.projects.map((p) => {
    const acts = scope.activities.filter((a) => a.project_id === p.project_id);
    const actIds = new Set(acts.map((a) => a.activity_id));
    const parts = scope.participations.filter((x) => actIds.has(x.activity_id));
    const reached = new Set([
      ...parts.map((x) => x.beneficiary_id),
      ...scope.services.filter((s) => s.project_id === p.project_id).map((s) => s.beneficiary_id),
    ]).size;
    const inds = scope.indicators.filter((i) => i.project_id === p.project_id);
    const achievement =
      inds.length === 0
        ? 0
        : Math.round(
            (sum(inds.map((i) => Math.min(i.actual ?? 0, i.target * 1.5))) /
              Math.max(1, sum(inds.map((i) => i.target)))) * 100,
          );
    return {
      project: p,
      activities: acts.length,
      reached,
      coverage: pct(reached, p.target_beneficiaries),
      achievement,
      services: scope.services.filter((s) => s.project_id === p.project_id).length,
      status: achievement >= BENCHMARKS.achievementOnTrack
        ? "On track"
        : achievement >= BENCHMARKS.achievementWatch
          ? "Watch"
          : "Off track",
    };
  });
}

/* ------------------------------------------------------------- insights */

export interface Insight {
  tone: "positive" | "watch" | "risk" | "neutral";
  title: string;
  detail: string;
}

export function generateInsights(scope: Scope, kpis: Kpis): Insight[] {
  const out: Insight[] = [];
  const perf = projectPerformance(scope);

  if (kpis.femaleShare >= BENCHMARKS.femaleParticipation)
    out.push({
      tone: "positive",
      title: "Gender balance met",
      detail: `Women and girls are ${kpis.femaleShare}% of people in scope, at or above the ${BENCHMARKS.femaleParticipation}% programme benchmark.`,
    });
  else
    out.push({
      tone: "watch",
      title: "Female participation below benchmark",
      detail: `Women and girls are ${kpis.femaleShare}% of people in scope against a ${BENCHMARKS.femaleParticipation}% benchmark. Review outreach in the lowest-coverage districts.`,
    });

  const off = perf.filter((p) => p.status === "Off track");
  if (off.length)
    out.push({
      tone: "risk",
      title: `${off.length} project${off.length > 1 ? "s" : ""} off track on indicators`,
      detail: `${off.map((p) => p.project.project_code).join(", ")} report indicator achievement under ${BENCHMARKS.achievementWatch}%. Verify reporting completeness before escalating.`,
    });

  if (kpis.completeness < BENCHMARKS.dataCompleteness)
    out.push({
      tone: "watch",
      title: "Registration data completeness below target",
      detail: `Required beneficiary fields are ${kpis.completeness}% complete against a ${BENCHMARKS.dataCompleteness}% target. See Data Quality for the affected records.`,
    });

  const geo = geographyRollup(scope);
  const top = geo[0];
  if (top && kpis.beneficiaries)
    out.push({
      tone: "neutral",
      title: `${top.district} carries the largest caseload`,
      detail: `${fmt(top.beneficiaries)} people (${pct(top.beneficiaries, kpis.beneficiaries)}% of scope) and ${fmt(top.activities)} activities are recorded in ${top.district}.`,
    });

  if (kpis.attendanceRate)
    out.push({
      tone: kpis.attendanceRate >= 85 ? "positive" : "watch",
      title: `Attendance at ${kpis.attendanceRate}%`,
      detail: `${fmt(scope.participations.length)} participation records in scope, with ${kpis.completionRate}% recorded as fully completed.`,
    });

  if (dataset.duplicates.length)
    out.push({
      tone: "watch",
      title: `${dataset.duplicates.filter((d) => d.status === "Pending review").length} possible duplicate identities pending review`,
      detail: "Identity matching flagged records sharing name, date of birth or household. Resolve before donor reporting.",
    });

  return out;
}

/* --------------------------------------------------------- person profile */

export function beneficiaryProfile(id: string) {
  const person = byId.beneficiary.get(id);
  if (!person) return null;
  const household = byId.household.get(person.household_id) ?? null;
  const members = dataset.beneficiaries.filter((b) => b.household_id === person.household_id);
  const parts = dataset.participations.filter((p) => p.beneficiary_id === id);
  const activities = parts
    .map((p) => ({ participation: p, activity: byId.activity.get(p.activity_id) }))
    .filter((r): r is { participation: Participation; activity: Activity } => Boolean(r.activity));
  const services = dataset.services.filter((s) => s.beneficiary_id === id);
  const outcomes = dataset.outcomes.filter((o) => o.beneficiary_id === id);
  const feedback = dataset.feedback.filter((f) => f.beneficiary_id === id);
  const programmes = Array.from(new Set(activities.map((a) => a.activity.programme_id)));
  const projects = Array.from(new Set(activities.map((a) => a.activity.project_id)));
  return { person, household, members, activities, services, outcomes, feedback, programmes, projects };
}

export function householdProfile(id: string) {
  const household = byId.household.get(id);
  if (!household) return null;
  const members = dataset.beneficiaries.filter((b) => b.household_id === id);
  const head = byId.beneficiary.get(household.household_head_id) ?? null;
  const services = dataset.services.filter((s) => s.household_id === id);
  return { household, members, head, services };
}

export function projectProfile(id: string) {
  const project = byId.project.get(id);
  if (!project) return null;
  const programme = byId.programme.get(project.programme_id) ?? null;
  const activities = dataset.activities.filter((a) => a.project_id === id);
  const actIds = new Set(activities.map((a) => a.activity_id));
  const participations = dataset.participations.filter((p) => actIds.has(p.activity_id));
  const services = dataset.services.filter((s) => s.project_id === id);
  const indicators = dataset.indicators.filter((i) => i.project_id === id);
  const outcomes = dataset.outcomes.filter((o) => o.project_id === id);
  const visits = dataset.visits.filter((v) => v.project_id === id);
  const feedback = dataset.feedback.filter((f) => f.project_id === id);
  const reached = new Set([
    ...participations.map((p) => p.beneficiary_id),
    ...services.map((s) => s.beneficiary_id),
  ]);
  return {
    project,
    programme,
    activities,
    participations,
    services,
    indicators,
    outcomes,
    visits,
    feedback,
    reached,
  };
}

export function programmeProfile(id: string) {
  const programme: Programme | undefined = byId.programme.get(id);
  if (!programme) return null;
  const projects = dataset.projects.filter((p) => p.programme_id === id);
  const projectIds = new Set(projects.map((p) => p.project_id));
  const activities = dataset.activities.filter((a) => projectIds.has(a.project_id));
  const services = dataset.services.filter((s) => projectIds.has(s.project_id));
  const indicators = dataset.indicators.filter((i) => projectIds.has(i.project_id));
  const actIds = new Set(activities.map((a) => a.activity_id));
  const participations = dataset.participations.filter((p) => actIds.has(p.activity_id));
  const reached = new Set([
    ...participations.map((p) => p.beneficiary_id),
    ...services.map((s) => s.beneficiary_id),
  ]);
  return { programme, projects, activities, services, indicators, participations, reached };
}

export function activityProfile(id: string) {
  const activity = byId.activity.get(id);
  if (!activity) return null;
  const participations = dataset.participations.filter((p) => p.activity_id === id);
  const services = dataset.services.filter((s) => s.activity_id === id);
  return {
    activity,
    participations,
    services,
    project: byId.project.get(activity.project_id) ?? null,
    programme: byId.programme.get(activity.programme_id) ?? null,
  };
}
