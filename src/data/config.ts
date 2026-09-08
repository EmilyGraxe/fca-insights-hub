/**
 * System configuration. In production these would live in Administration tables
 * (Lovable Cloud / Postgres) — here they are a single configurable source so no
 * category is hard-coded across the UI.
 */

export const REFERENCE_DATE = "2026-04-30";

export const AGE_GROUPS = [
  { key: "0-4", label: "0-4", min: 0, max: 4, band: "Children" },
  { key: "5-11", label: "5-11", min: 5, max: 11, band: "Children" },
  { key: "12-17", label: "12-17", min: 12, max: 17, band: "Children" },
  { key: "18-24", label: "18-24", min: 18, max: 24, band: "Youth" },
  { key: "25-59", label: "25-59", min: 25, max: 59, band: "Adults" },
  { key: "60+", label: "60+", min: 60, max: 120, band: "Elderly" },
] as const;

export const SEXES = ["Female", "Male", "Other/Prefer not to say"] as const;

export const BENEFICIARY_TYPES = [
  "Refugee",
  "Asylum seeker",
  "Host community",
  "Internally displaced person",
  "Returnee",
  "Other",
] as const;

export const SECTORS = [
  "Education",
  "Livelihoods",
  "Protection",
  "Food Security",
  "Cash Assistance",
  "Skills Development",
  "Community Engagement",
  "WASH",
] as const;

export const ACTIVITY_TYPES = [
  "Training",
  "Workshop",
  "Distribution",
  "Cash assistance",
  "Protection session",
  "Community meeting",
  "Monitoring visit",
  "Assessment",
  "Livelihood support",
  "Referral",
  "Other",
] as const;

export const SERVICE_TYPES = [
  "Vocational training place",
  "Scholastic materials",
  "Multi-purpose cash grant",
  "Business start-up kit",
  "Psychosocial support session",
  "Case management",
  "Agricultural input package",
  "Life-skills session",
  "Legal aid referral",
  "Safe-space participation",
] as const;

export const VULNERABILITY_CATEGORIES = [
  "Person with disability",
  "Serious medical condition",
  "Woman at risk",
  "Single parent",
  "Child at risk",
  "Older person at risk",
  "Unaccompanied or separated child",
  "Survivor of violence",
] as const;

export const NATIONALITIES = [
  "Uganda",
  "South Sudan",
  "DR Congo",
  "Sudan",
  "Burundi",
  "Somalia",
  "Eritrea",
  "Rwanda",
] as const;

export const OCCUPATIONS = [
  "Farming and fishing",
  "Business and administration",
  "Sales work",
  "Personal care work",
  "Construction and crafts",
  "Teaching and education",
  "Casual labour",
  "Student",
  "Not economically active",
] as const;

export const EDUCATION_STATUS = [
  "No formal education",
  "Primary (incomplete)",
  "Primary (complete)",
  "Secondary",
  "Vocational / TVET",
  "Tertiary",
] as const;

export const HOUSEHOLD_TYPES = [
  "Female-headed",
  "Male-headed",
  "Child-headed",
  "Elderly-headed",
  "Single-parent",
] as const;

export const DONORS = [
  "MFA Finland",
  "ECHO",
  "EU / DG INTPA",
  "UNHCR",
  "Education Cannot Wait",
  "FCA Private Donors",
  "SIDA",
] as const;

export const OUTCOME_TYPES = [
  "Knowledge improved",
  "Skills acquired",
  "Employment started",
  "Business started",
  "Service access improved",
  "Referral completed",
  "Protection risk reduced",
  "Learning continuity maintained",
] as const;

export const INDICATOR_UNITS = ["Individuals", "Households", "Percentage", "Sessions", "Kits"] as const;

export const REPORTING_PERIODS = ["Q1 2026", "Q2 2026", "FY 2025", "FY 2026", "Apr 2026"] as const;

export const ROLES = [
  { role: "Administrator", access: "Full system access, configuration and user management" },
  { role: "MEAL Manager", access: "Analytics, monitoring, indicators, data quality, reporting" },
  { role: "Programme Manager", access: "Programme, project and activity data plus analytics" },
  { role: "Field Officer", access: "Beneficiary, household and activity data in assigned locations" },
  { role: "Data Collector", access: "Assigned form submission only" },
  { role: "Viewer", access: "Read-only dashboards and reports" },
  { role: "Donor / External Viewer", access: "Aggregate reporting only, no personal data" },
] as const;

/** Programme benchmarks used by the rule-based insight engine. */
export const BENCHMARKS = {
  femaleParticipation: 50,
  youthParticipation: 30,
  achievementOnTrack: 90,
  achievementWatch: 75,
  dataCompleteness: 90,
};

export function ageGroupFor(age: number | null): (typeof AGE_GROUPS)[number]["key"] | null {
  if (age === null || Number.isNaN(age)) return null;
  const g = AGE_GROUPS.find((a) => age >= a.min && age <= a.max);
  return g ? g.key : null;
}

export function bandFor(age: number | null): string | null {
  if (age === null) return null;
  const g = AGE_GROUPS.find((a) => age >= a.min && age <= a.max);
  return g ? g.band : null;
}
