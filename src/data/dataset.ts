/**
 * Synthetic, fully relational demo dataset for the FCA Uganda Data Hub prototype.
 *
 * IMPORTANT: every figure here is SYNTHETIC DEMO DATA. No real FCA statistics are
 * used, and no figures from the UNHCR reference dashboards are reproduced as FCA data.
 *
 * The generator is deterministic (seeded PRNG) so server-rendered and client-rendered
 * output match, and every dashboard number in the app is computed from these records.
 */
import {
  ACTIVITY_TYPES,
  BENEFICIARY_TYPES,
  DONORS,
  EDUCATION_STATUS,
  HOUSEHOLD_TYPES,
  NATIONALITIES,
  OCCUPATIONS,
  OUTCOME_TYPES,
  SECTORS,
  SERVICE_TYPES,
  VULNERABILITY_CATEGORIES,
  ageGroupFor,
} from "./config";
import type {
  Activity,
  AuditLog,
  Beneficiary,
  Dataset,
  DuplicateCandidate,
  Feedback,
  FormSubmission,
  FormTemplate,
  Household,
  Indicator,
  Location,
  MonitoringVisit,
  Outcome,
  Participation,
  Programme,
  Project,
  Service,
  Sex,
  User,
} from "./types";

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260430);
const rnd = () => rand();
const int = (min: number, max: number) => Math.floor(rnd() * (max - min + 1)) + min;
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)] as T;
const chance = (p: number) => rnd() < p;
const pad = (n: number, w = 3) => String(n).padStart(w, "0");

const END = new Date("2026-04-30T00:00:00Z");
const MONTHS: string[] = [];
for (let i = 11; i >= 0; i--) {
  const d = new Date(Date.UTC(END.getUTCFullYear(), END.getUTCMonth() - i, 1));
  MONTHS.push(`${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1, 2)}`);
}

function dateInMonth(month: string) {
  const [y, m] = month.split("-").map(Number) as [number, number];
  const day = int(1, 27);
  return `${y}-${pad(m, 2)}-${pad(day, 2)}`;
}
function randomMonth(weightRecent = true) {
  if (!weightRecent) return pick(MONTHS);
  const i = Math.min(11, Math.floor(Math.pow(rnd(), 0.7) * 12));
  return MONTHS[11 - i] as string;
}

/* ---------------------------------------------------------------- locations */

const SETTLEMENTS: Array<[string, string, string, number, number]> = [
  ["Adjumani", "West Nile", "Adjumani", 3.377, 31.79],
  ["Bidibidi", "West Nile", "Yumbe", 3.46, 31.24],
  ["Palorinya", "West Nile", "Obongi", 3.42, 31.6],
  ["Imvepi", "West Nile", "Terego", 3.13, 31.28],
  ["Rhino", "West Nile", "Madi Okollo", 2.97, 31.3],
  ["Lobule", "West Nile", "Koboko", 3.42, 30.98],
  ["Palabek", "Acholi", "Lamwo", 3.44, 32.72],
  ["Kiryandongo", "Bunyoro", "Kiryandongo", 2.04, 32.09],
  ["Kyangwali", "Bunyoro", "Kikuube", 1.3, 30.8],
  ["Kyaka II", "Toro", "Kyegegwa", 0.6, 31.05],
  ["Rwamwanja", "Toro", "Kamwenge", 0.3, 30.6],
  ["Nakivale", "Ankole", "Isingiro", -0.79, 30.66],
  ["Oruchinga", "Ankole", "Isingiro", -0.86, 30.53],
  ["Kampala", "Central", "Kampala", 0.3476, 32.5825],
];

const SUBCOUNTY_SUFFIX = ["Central", "East", "West", "North", "South"];
const PARISH_SUFFIX = ["A", "B", "C"];

const locations: Location[] = [];
SETTLEMENTS.forEach(([settlement, region, district, lat, lng], si) => {
  const zones = settlement === "Kampala" ? ["Urban Division 1", "Urban Division 2"] : ["Zone 1", "Zone 2"];
  zones.forEach((zone, zi) => {
    locations.push({
      location_id: `LOC-${pad(locations.length + 1)}`,
      region,
      district,
      sub_county: `${district} ${SUBCOUNTY_SUFFIX[(si + zi) % SUBCOUNTY_SUFFIX.length]}`,
      parish: `${settlement} Parish ${PARISH_SUFFIX[zi % PARISH_SUFFIX.length]}`,
      village: `${settlement} Village ${zi + 1}`,
      settlement,
      zone,
      latitude: lat + (zi === 0 ? 0.03 : -0.03),
      longitude: lng + (zi === 0 ? -0.03 : 0.03),
      operational: !(settlement === "Lobule" && zi === 1) && !(settlement === "Oruchinga" && zi === 1),
    });
  });
});

const operationalLocations = locations.filter((l) => l.operational);

/* ------------------------------------------------------------------- people */

const FIRST_F = ["Aisha", "Grace", "Mary", "Betty", "Nyalong", "Josephine", "Sarah", "Rehema", "Kavuma", "Zainab", "Christine", "Akello", "Nakato", "Amina", "Furaha", "Immaculate", "Adau", "Winnie", "Esther", "Nyandeng"];
const FIRST_M = ["Joseph", "Peter", "Emmanuel", "Deng", "Moses", "Bosco", "Ibrahim", "Okello", "Simon", "Patrick", "Ayen", "Kizito", "Sunday", "Julius", "Baraka", "Isaac", "Ronald", "Fred", "Lokeris", "Chol"];
const LAST = ["Anyeko", "Wani", "Deng", "Okumu", "Nabirye", "Achola", "Mugisha", "Kamara", "Byaruhanga", "Lomoro", "Amule", "Tumusiime", "Nyakato", "Ochan", "Kabila", "Habimana", "Ssentongo", "Lubega", "Odong", "Chandia"];

const STAFF = ["A. Nakamya", "J. Oketch", "R. Aleper", "S. Kirunda", "M. Adiru", "T. Wanyama", "P. Namara", "L. Achieng"];

/* --------------------------------------------------------------- households */

const households: Household[] = [];
const beneficiaries: Beneficiary[] = [];
const TARGET_BENEFICIARIES = 312;
const HOUSEHOLD_COUNT = 78;

for (let h = 0; h < HOUSEHOLD_COUNT; h++) {
  const loc = pick(operationalLocations);
  households.push({
    household_id: `HH-${pad(h + 1)}`,
    household_size: int(2, 7),
    household_head_id: "",
    location_id: loc.location_id,
    household_type: pick(HOUSEHOLD_TYPES),
    vulnerability_status: chance(0.42) ? pick(VULNERABILITY_CATEGORIES) : "None recorded",
    registration_date: dateInMonth(randomMonth()),
  });
}

let bIndex = 0;
function makeBeneficiary(hh: Household, isHead: boolean): Beneficiary {
  bIndex += 1;
  const sexRoll = rnd();
  const sex: Sex | null =
    sexRoll < 0.51 ? "Female" : sexRoll < 0.975 ? "Male" : bIndex % 37 === 0 ? null : "Other/Prefer not to say";
  const first = sex === "Male" ? pick(FIRST_M) : pick(FIRST_F);
  const name = `${first} ${pick(LAST)}`;
  const age = isHead ? int(24, 68) : chance(0.55) ? int(0, 17) : int(18, 72);
  const missingDob = !isHead && bIndex % 29 === 0;
  const dob = missingDob
    ? null
    : `${END.getUTCFullYear() - age}-${pad(int(1, 12), 2)}-${pad(int(1, 28), 2)}`;
  const type = (() => {
    const r = rnd();
    if (r < 0.52) return "Refugee";
    if (r < 0.62) return "Asylum seeker";
    if (r < 0.85) return "Host community";
    if (r < 0.91) return "Internally displaced person";
    if (r < 0.96) return "Returnee";
    return "Other";
  })();
  const nationality =
    type === "Host community" || type === "Internally displaced person" || type === "Returnee"
      ? "Uganda"
      : pick(NATIONALITIES.filter((n) => n !== "Uganda"));
  const vulnerability: string[] = [];
  if (chance(0.19)) vulnerability.push("Person with disability");
  if (chance(0.12)) vulnerability.push(pick(VULNERABILITY_CATEGORIES));
  const missingLocation = bIndex % 17 === 0;
  const registration = dateInMonth(randomMonth());
  return {
    beneficiary_id: `FCA-UG-${pad(bIndex, 5)}`,
    household_id: hh.household_id,
    name,
    sex,
    date_of_birth: dob,
    age: missingDob ? null : age,
    age_group: missingDob ? null : ageGroupFor(age),
    beneficiary_type: type,
    nationality,
    location_id: missingLocation ? null : hh.location_id,
    disability_status: vulnerability.includes("Person with disability") ? "Yes" : chance(0.04) ? "Not recorded" : "No",
    vulnerability: Array.from(new Set(vulnerability)),
    occupation: age !== null && age < 18 ? (age >= 5 ? "Student" : "Not economically active") : chance(0.06) ? "" : pick(OCCUPATIONS),
    education_status: chance(0.08) ? "" : pick(EDUCATION_STATUS),
    phone: chance(0.55) ? `+2567${int(10, 99)}${int(100000, 999999)}` : null,
    registration_date: registration,
    status: chance(0.86) ? "Active" : "Inactive",
    created_by: pick(STAFF),
    updated_at: dateInMonth(randomMonth()),
  };
}

for (const hh of households) {
  const head = makeBeneficiary(hh, true);
  hh.household_head_id = head.beneficiary_id;
  beneficiaries.push(head);
  for (let i = 1; i < hh.household_size && beneficiaries.length < TARGET_BENEFICIARIES; i++) {
    beneficiaries.push(makeBeneficiary(hh, false));
  }
}
while (beneficiaries.length < TARGET_BENEFICIARIES) {
  const hh = households[beneficiaries.length % households.length] as Household;
  beneficiaries.push(makeBeneficiary(hh, false));
  hh.household_size += 1;
}
for (const hh of households) {
  hh.household_size = beneficiaries.filter((b) => b.household_id === hh.household_id).length;
}

/* --------------------------------------------------------------- programmes */

const PROGRAMME_SEED: Array<[string, string, string]> = [
  ["Quality Education & Learning Continuity", "Education", "Accredited learning, teacher development and safe learning environments in refugee-hosting districts."],
  ["Livelihoods & Economic Empowerment", "Livelihoods", "Enterprise development, agricultural production and market linkages for refugee and host households."],
  ["Protection & Community Safety", "Protection", "Community-based protection, case management and referral pathways for people at risk."],
  ["Skills Development & Youth Employment", "Skills Development", "Vocational and life-skills training linked to employment and self-employment pathways."],
  ["Cash & Basic Needs Assistance", "Cash Assistance", "Multi-purpose cash transfers and basic-needs support for the most vulnerable households."],
  ["Community Engagement & Accountability", "Community Engagement", "Participation structures, feedback mechanisms and community-led planning."],
];

const programmes: Programme[] = PROGRAMME_SEED.map(([programme_name, sector, description], i) => ({
  programme_id: `PRG-${pad(i + 1, 2)}`,
  programme_name,
  sector,
  description,
  lead: STAFF[i % STAFF.length]!,
  start_date: "2024-01-01",
  end_date: i === 5 ? "2026-12-31" : "2027-06-30",
  status: i === 5 ? "Active" : "Active",
  objectives: [
    `Expand equitable access to ${sector.toLowerCase()} services in FCA operational locations.`,
    "Strengthen inclusion of women, youth and persons with disabilities.",
  ],
  strategic_outcomes: [
    "Increased and more equitable coverage across operational locations",
    "Improved quality and measurable outcomes for participants",
  ],
}));

/* ------------------------------------------------------------------ projects */

const PROJECT_SEED: Array<[string, number, string, number]> = [
  ["Learning for All - West Nile", 0, "2025-01-01", 2],
  ["Accelerated Education Programme - Bidibidi", 0, "2025-04-01", 1],
  ["Agri-enterprise Growth - Bunyoro", 1, "2025-02-01", 2],
  ["Market Linkages & Cooperatives - Ankole", 1, "2025-06-01", 2],
  ["Community Protection Networks - Adjumani", 2, "2025-01-15", 2],
  ["Safe Spaces & Case Management - Nakivale", 2, "2025-09-01", 1],
  ["Youth TVET Pathways - Kampala & Kiryandongo", 3, "2025-03-01", 2],
  ["Green Skills for Young Women", 3, "2025-10-01", 2],
  ["Multi-purpose Cash for Vulnerable Households", 4, "2025-05-01", 3],
  ["Emergency Basic Needs Response - Palorinya", 4, "2026-01-01", 1],
  ["Community Feedback & Participation Systems", 5, "2025-02-01", 3],
  ["Inclusive Planning with Refugee & Host Leaders", 5, "2025-08-01", 2],
];

const projects: Project[] = PROJECT_SEED.map(([project_name, pIdx, start, locCount], i) => {
  const programme = programmes[pIdx] as Programme;
  const locs: string[] = [];
  while (locs.length < locCount) {
    const l = pick(operationalLocations).location_id;
    if (!locs.includes(l)) locs.push(l);
  }
  const donors = [pick(DONORS)];
  if (chance(0.4)) {
    const d = pick(DONORS);
    if (!donors.includes(d)) donors.push(d);
  }
  const status: Project["status"] = i === 9 ? "Active" : i === 1 ? "Completed" : chance(0.15) ? "Planned" : "Active";
  return {
    project_id: `PRJ-${pad(i + 1, 2)}`,
    project_code: `FCA-UG-${programme.sector.slice(0, 3).toUpperCase()}-${2025 + (i % 2)}-${pad(i + 1, 2)}`,
    project_name,
    programme_id: programme.programme_id,
    donors,
    sector: programme.sector,
    start_date: start,
    end_date: i % 3 === 0 ? "2026-12-31" : "2027-03-31",
    status,
    budget_usd: int(180, 1450) * 1000,
    target_beneficiaries: int(45, 160),
    target_households: int(20, 70),
    location_ids: locs,
    manager: STAFF[(i + 2) % STAFF.length]!,
    objectives: [
      `Deliver ${programme.sector.toLowerCase()} interventions to targeted beneficiaries and households.`,
      "Track participation, completion and outcome results disaggregated by sex, age and disability.",
    ],
  };
});

/* ---------------------------------------------------------------- activities */

const activities: Activity[] = [];
let aIdx = 0;
for (const project of projects) {
  const count = project.status === "Planned" ? 2 : int(4, 7);
  for (let i = 0; i < count; i++) {
    aIdx += 1;
    const type = pick(ACTIVITY_TYPES);
    const month = randomMonth();
    const target = int(15, 60);
    const planned = chance(0.14);
    const cancelled = chance(0.04);
    const actual = planned || cancelled ? 0 : Math.max(4, Math.round(target * (0.55 + rnd() * 0.6)));
    activities.push({
      activity_id: `ACT-${pad(aIdx, 3)}`,
      project_id: aIdx % 23 === 0 ? "" : project.project_id,
      programme_id: project.programme_id,
      activity_name: `${type} - ${project.project_name.split(" - ")[0] as string} (${month})`,
      activity_type: type,
      date: dateInMonth(month),
      location_id: pick(project.location_ids),
      facilitator: pick(STAFF),
      target_participants: target,
      actual_participants: Math.min(actual, target + 12),
      status: cancelled ? "Cancelled" : planned ? "Planned" : chance(0.06) ? "In progress" : "Completed",
      notes:
        cancelled
          ? "Cancelled due to access constraints; rescheduling requested by field team."
          : "Session delivered as planned. Attendance register digitised in the mobile form.",
    });
  }
}

/* ------------------------------------------------------- participation layer */

const participations: Participation[] = [];
let pIdx = 0;
const eligible = beneficiaries.filter((b) => (b.age ?? 20) >= 4);

for (const act of activities) {
  if (act.status === "Planned" || act.status === "Cancelled") continue;
  const locBeneficiaries = eligible.filter((b) => b.location_id === act.location_id);
  const pool = locBeneficiaries.length > 8 ? locBeneficiaries : eligible;
  const n = Math.min(act.actual_participants, pool.length);
  const chosen = new Set<string>();
  let guard = 0;
  while (chosen.size < n && guard < n * 12) {
    chosen.add(pick(pool).beneficiary_id);
    guard++;
  }
  for (const id of chosen) {
    pIdx += 1;
    const absent = chance(0.07);
    participations.push({
      participation_id: `PAR-${pad(pIdx, 5)}`,
      beneficiary_id: id,
      activity_id: act.activity_id,
      attendance: absent ? "Absent" : "Present",
      completion_status: absent ? "Dropped" : chance(0.82) ? "Completed" : "Partial",
    });
  }
  act.actual_participants = participations.filter((p) => p.activity_id === act.activity_id && p.attendance === "Present").length;
}

/* -------------------------------------------------------------------- services */

const services: Service[] = [];
let sIdx = 0;
for (const par of participations) {
  if (!chance(0.42)) continue;
  const act = activities.find((a) => a.activity_id === par.activity_id)!;
  const ben = beneficiaries.find((b) => b.beneficiary_id === par.beneficiary_id)!;
  sIdx += 1;
  const referral = chance(0.11);
  services.push({
    service_id: `SRV-${pad(sIdx, 5)}`,
    beneficiary_id: ben.beneficiary_id,
    household_id: ben.household_id,
    activity_id: act.activity_id,
    project_id: act.project_id,
    programme_id: act.programme_id,
    service_type: pick(SERVICE_TYPES),
    date: act.date,
    quantity: int(1, 3),
    unit: chance(0.3) ? "Kits" : "Sessions",
    status: referral ? "Referred" : chance(0.94) ? "Delivered" : "Pending",
    referral,
    follow_up: referral ? (chance(0.55) ? "Completed" : "Pending") : chance(0.35) ? "Completed" : "Not required",
  });
}

/* ------------------------------------------------------------------ indicators */

const indicators: Indicator[] = [];
let iIdx = 0;
for (const project of projects) {
  const set = [
    ["# of individuals reached with programme services", "Individuals"],
    ["# of households supported", "Households"],
    ["% of participants completing the intervention", "Percentage"],
  ] as const;
  set.forEach(([indicator_name, unit], k) => {
    iIdx += 1;
    const target = unit === "Percentage" ? 80 : unit === "Households" ? project.target_households : project.target_beneficiaries;
    const missing = iIdx % 13 === 0;
    indicators.push({
      indicator_id: `IND-${pad(iIdx, 3)}`,
      project_id: project.project_id,
      programme_id: project.programme_id,
      indicator_name,
      definition: `${indicator_name} as recorded in the FCA Uganda Data Hub for ${project.project_code}. Disaggregated by sex, age group and disability.`,
      unit,
      baseline: k === 2 ? int(35, 55) : 0,
      target,
      actual: missing ? null : Math.round(target * (0.55 + rnd() * 0.62)),
      reporting_period: k === 2 ? "Q1 2026" : "FY 2026",
      data_source: k === 2 ? "Attendance registers" : "Beneficiary registry",
    });
  });
}

/* -------------------------------------------------------------------- outcomes */

const outcomes: Outcome[] = [];
let oIdx = 0;
for (const par of participations) {
  if (par.completion_status !== "Completed" || !chance(0.28)) continue;
  const act = activities.find((a) => a.activity_id === par.activity_id)!;
  const projIndicators = indicators.filter((i) => i.project_id === act.project_id);
  if (!projIndicators.length) continue;
  oIdx += 1;
  outcomes.push({
    outcome_id: `OUT-${pad(oIdx, 4)}`,
    beneficiary_id: par.beneficiary_id,
    project_id: act.project_id,
    indicator_id: pick(projIndicators).indicator_id,
    date: act.date,
    outcome_type: pick(OUTCOME_TYPES),
    result: chance(0.62) ? "Achieved" : chance(0.7) ? "Partially achieved" : "Not achieved",
  });
}

/* ----------------------------------------------------------- monitoring visits */

const FINDINGS = [
  "Attendance registers complete; two sessions lacked disability disaggregation.",
  "Community members report improved access but request sessions closer to Zone 2.",
  "Training materials delivered late, affecting the first cohort schedule.",
  "Referral pathway understood by facilitators; follow-up documentation incomplete.",
  "Female participation below the programme benchmark in this location.",
  "Distribution list verified against the beneficiary registry with no discrepancies.",
];
const RECOMMENDATIONS = [
  "Retrain facilitators on inclusion disaggregation fields.",
  "Add an outreach session in the underserved zone next cycle.",
  "Adjust procurement timeline and confirm delivery two weeks before cohort start.",
  "Introduce a mandatory follow-up form for all referrals.",
  "Run a targeted mobilisation activity with women's groups.",
  "Maintain current verification practice and document it as a standard.",
];

const visits: MonitoringVisit[] = [];
for (let v = 0; v < 34; v++) {
  const project = pick(projects);
  const k = v % FINDINGS.length;
  visits.push({
    visit_id: `MON-${pad(v + 1, 3)}`,
    date: dateInMonth(randomMonth()),
    project_id: project.project_id,
    location_id: pick(project.location_ids),
    monitor: pick(STAFF),
    findings: FINDINGS[k]!,
    recommendation: RECOMMENDATIONS[k]!,
    action_point: RECOMMENDATIONS[k]!,
    status: chance(0.45) ? "Closed" : chance(0.6) ? "In progress" : "Open",
  });
}

/* --------------------------------------------------------------------- feedback */

const FEEDBACK_SUMMARY = [
  "Requests more frequent sessions in the home village.",
  "Appreciates the facilitator support and clarity of the training.",
  "Concerned about distance to the distribution point.",
  "Asks for information about the next selection cycle.",
  "Reports that the referral was completed successfully.",
];
const feedback: Feedback[] = [];
for (let f = 0; f < 46; f++) {
  const ben = pick(beneficiaries);
  const project = pick(projects);
  feedback.push({
    feedback_id: `FB-${pad(f + 1, 3)}`,
    beneficiary_id: ben.beneficiary_id,
    project_id: project.project_id,
    date: dateInMonth(randomMonth()),
    channel: pick(["Help desk", "Toll-free line", "Suggestion box", "Community meeting", "Field officer"]),
    category: pick(["Information request", "Service quality", "Access", "Selection criteria", "Appreciation"]),
    sentiment: chance(0.45) ? "Positive" : chance(0.6) ? "Neutral" : "Concern",
    status: chance(0.68) ? "Resolved" : "Open",
    summary: FEEDBACK_SUMMARY[f % FEEDBACK_SUMMARY.length]!,
  });
}

/* ------------------------------------------------------------------------ forms */

function field(
  id: string,
  label: string,
  type: string,
  section: string,
  required = false,
  options?: string[],
  help?: string,
  conditionalOn?: { field: string; equals: string },
): FormTemplate["fields"][number] {
  return {
    id,
    label,
    type,
    section,
    required,
    ...(options ? { options } : {}),
    ...(help ? { help } : {}),
    ...(conditionalOn ? { conditionalOn } : {}),
  };
}

const forms: FormTemplate[] = [
  {
    form_id: "FRM-01",
    form_name: "Beneficiary Registration",
    programme_id: null,
    project_id: null,
    version: "v3.2",
    status: "Published",
    description: "Registers a person once and issues a unique FCA Beneficiary ID linked to a household and location.",
    submissions: 312,
    fields: [
      field("name", "Full name", "Short text", "Identity", true),
      field("sex", "Sex", "Gender", "Identity", true, ["Female", "Male", "Other/Prefer not to say"]),
      field("dob", "Date of birth", "Date", "Identity", true, undefined, "If unknown, record estimated year of birth."),
      field("age", "Age (estimated)", "Age", "Identity", false),
      field("type", "Beneficiary type", "Dropdown", "Identity", true, [...BENEFICIARY_TYPES]),
      field("nationality", "Nationality / country of origin", "Dropdown", "Identity", true, [...NATIONALITIES]),
      field("household", "Household", "Household lookup", "Household & location", true),
      field("location", "Location", "Location", "Household & location", true),
      field("gps", "GPS coordinates", "GPS/location", "Household & location", false, undefined, "Captured automatically on mobile devices."),
      field("disability", "Does the person have a disability?", "Yes/No", "Inclusion", true),
      field("washington", "Washington Group short-set responses", "Multiple choice", "Inclusion", false, ["Seeing", "Hearing", "Mobility", "Cognition", "Self-care", "Communication"], undefined, { field: "disability", equals: "Yes" }),
      field("vulnerability", "Vulnerability categories", "Multiple choice", "Inclusion", false, [...VULNERABILITY_CATEGORIES]),
      field("consent", "Informed consent given", "Yes/No", "Consent", true),
      field("signature", "Beneficiary signature", "Signature", "Consent", false),
    ],
  },
  {
    form_id: "FRM-02",
    form_name: "Training Attendance",
    programme_id: "PRG-04",
    project_id: "PRJ-07",
    version: "v2.0",
    status: "Published",
    description: "Captures attendance and completion per session, linked to activity and beneficiary IDs.",
    submissions: 128,
    fields: [
      field("activity", "Activity", "Activity lookup", "Session", true),
      field("date", "Session date", "Date", "Session", true),
      field("beneficiary", "Beneficiary", "Beneficiary lookup", "Participants", true),
      field("attendance", "Attendance", "Dropdown", "Participants", true, ["Present", "Absent"]),
      field("completion", "Completion status", "Dropdown", "Participants", true, ["Completed", "Partial", "Dropped"]),
      field("register", "Signed register photo", "File/photo", "Verification", false),
      field("notes", "Facilitator notes", "Long text", "Verification", false),
    ],
  },
  {
    form_id: "FRM-03",
    form_name: "Distribution Record",
    programme_id: "PRG-05",
    project_id: "PRJ-09",
    version: "v1.4",
    status: "Published",
    description: "Records items or cash delivered per household with verification and quantity fields.",
    submissions: 96,
    fields: [
      field("household", "Household", "Household lookup", "Recipient", true),
      field("project", "Project", "Project lookup", "Recipient", true),
      field("service", "Service type", "Dropdown", "Items", true, [...SERVICE_TYPES]),
      field("quantity", "Quantity", "Number", "Items", true),
      field("value", "Transfer value (UGX)", "Decimal", "Items", false),
      field("verified", "Identity verified", "Yes/No", "Verification", true),
      field("signature", "Recipient signature", "Signature", "Verification", true),
    ],
  },
  {
    form_id: "FRM-04",
    form_name: "Monitoring Visit",
    programme_id: null,
    project_id: null,
    version: "v2.1",
    status: "Published",
    description: "Structured field monitoring checklist producing findings, recommendations and action points.",
    submissions: 34,
    fields: [
      field("project", "Project", "Project lookup", "Visit", true),
      field("location", "Location", "Location", "Visit", true),
      field("datetime", "Visit date and time", "Date/time", "Visit", true),
      field("findings", "Key findings", "Long text", "Findings", true),
      field("score", "Quality score (1-5)", "Number", "Findings", true),
      field("recommendation", "Recommendation", "Long text", "Actions", true),
      field("owner", "Action owner", "Short text", "Actions", true),
      field("photos", "Supporting photos", "File/photo", "Actions", false),
    ],
  },
  {
    form_id: "FRM-05",
    form_name: "Post-Activity Monitoring",
    programme_id: null,
    project_id: null,
    version: "v1.1",
    status: "Published",
    description: "Short follow-up survey administered 4-6 weeks after an activity.",
    submissions: 71,
    fields: [
      field("beneficiary", "Beneficiary", "Beneficiary lookup", "Respondent", true),
      field("activity", "Activity attended", "Activity lookup", "Respondent", true),
      field("useful", "Was the support useful?", "Dropdown", "Results", true, ["Very useful", "Useful", "Somewhat", "Not useful"]),
      field("applied", "Has the knowledge or support been applied?", "Yes/No", "Results", true),
      field("how", "How has it been applied?", "Long text", "Results", false, undefined, undefined, { field: "applied", equals: "Yes" }),
    ],
  },
  {
    form_id: "FRM-06",
    form_name: "Referral Tracking",
    programme_id: "PRG-03",
    project_id: null,
    version: "v1.0",
    status: "Published",
    description: "Tracks referrals made to partners and their completion status.",
    submissions: 58,
    fields: [
      field("beneficiary", "Beneficiary", "Beneficiary lookup", "Referral", true),
      field("service", "Referred for", "Dropdown", "Referral", true, [...SERVICE_TYPES]),
      field("partner", "Receiving partner", "Short text", "Referral", true),
      field("date", "Referral date", "Date", "Referral", true),
      field("status", "Referral status", "Dropdown", "Follow-up", true, ["Pending", "Completed", "Declined"]),
      field("followup", "Follow-up date", "Date", "Follow-up", false),
    ],
  },
  {
    form_id: "FRM-07",
    form_name: "Outcome Follow-up",
    programme_id: null,
    project_id: null,
    version: "v1.2",
    status: "Published",
    description: "Records configurable outcome results per beneficiary against project indicators.",
    submissions: 64,
    fields: [
      field("beneficiary", "Beneficiary", "Beneficiary lookup", "Respondent", true),
      field("project", "Project", "Project lookup", "Respondent", true),
      field("outcome", "Outcome type", "Dropdown", "Outcome", true, [...OUTCOME_TYPES]),
      field("result", "Result", "Dropdown", "Outcome", true, ["Achieved", "Partially achieved", "Not achieved"]),
      field("evidence", "Evidence note", "Long text", "Outcome", false),
    ],
  },
  {
    form_id: "FRM-08",
    form_name: "Community Feedback",
    programme_id: "PRG-06",
    project_id: null,
    version: "v2.3",
    status: "Published",
    description: "Community feedback and complaints intake across all channels.",
    submissions: 46,
    fields: [
      field("channel", "Channel", "Dropdown", "Intake", true, ["Help desk", "Toll-free line", "Suggestion box", "Community meeting", "Field officer"]),
      field("anonymous", "Anonymous submission", "Yes/No", "Intake", true),
      field("beneficiary", "Beneficiary", "Beneficiary lookup", "Intake", false, undefined, undefined, { field: "anonymous", equals: "No" }),
      field("category", "Category", "Dropdown", "Feedback", true, ["Information request", "Service quality", "Access", "Selection criteria", "Appreciation"]),
      field("summary", "Summary", "Long text", "Feedback", true),
    ],
  },
  {
    form_id: "FRM-09",
    form_name: "Project Progress Update",
    programme_id: null,
    project_id: null,
    version: "v1.0",
    status: "Draft",
    description: "Monthly project progress narrative and indicator update with approval workflow.",
    submissions: 12,
    fields: [
      field("project", "Project", "Project lookup", "Reporting", true),
      field("period", "Reporting period", "Dropdown", "Reporting", true, ["Q1 2026", "Q2 2026", "Apr 2026"]),
      field("indicator", "Indicator actuals (repeating group)", "Number", "Indicators", true, undefined, "Repeating group: one row per project indicator."),
      field("narrative", "Progress narrative", "Long text", "Narrative", true),
      field("risks", "Risks and mitigation", "Long text", "Narrative", false),
    ],
  },
];

const submissions: FormSubmission[] = [];
let subIdx = 0;
for (const form of forms) {
  const n = form.status === "Draft" ? 4 : int(6, 12);
  for (let i = 0; i < n; i++) {
    subIdx += 1;
    const ben = pick(beneficiaries);
    submissions.push({
      submission_id: `SUB-${pad(subIdx, 4)}`,
      form_id: form.form_id,
      beneficiary_id: chance(0.75) ? ben.beneficiary_id : null,
      household_id: chance(0.5) ? ben.household_id : null,
      submitted_by: pick(STAFF),
      submitted_at: dateInMonth(randomMonth()),
      status: chance(0.6) ? "Approved" : chance(0.6) ? "Pending approval" : chance(0.6) ? "Draft" : "Rejected",
    });
  }
}

/* ------------------------------------------------------------------ users/audit */

const users: User[] = [
  ["Sarah Nakamya", "Administrator", "All Uganda"],
  ["Joseph Oketch", "MEAL Manager", "All Uganda"],
  ["Rachel Aleper", "Programme Manager", "West Nile"],
  ["Simon Kirunda", "Programme Manager", "South West"],
  ["Mary Adiru", "Field Officer", "Bidibidi, Palorinya"],
  ["Tom Wanyama", "Field Officer", "Nakivale, Oruchinga"],
  ["Peace Namara", "Data Collector", "Kyangwali"],
  ["Lydia Achieng", "Data Collector", "Adjumani"],
  ["Country Office Viewer", "Viewer", "All Uganda"],
  ["MFA Finland Reporting", "Donor / External Viewer", "Aggregate only"],
].map(([name, role, scope], i) => ({
  user_id: `USR-${pad(i + 1, 2)}`,
  name: name as string,
  email: `${(name as string).toLowerCase().replace(/[^a-z]+/g, ".")}@demo.fca-datahub.org`,
  role: role as string,
  location_scope: scope as string,
  status: i === 8 ? "Active" : chance(0.92) ? "Active" : "Suspended",
  last_active: dateInMonth(MONTHS[11]!),
}));

const AUDIT_ACTIONS = ["Created", "Updated", "Approved", "Exported", "Merged", "Viewed restricted record", "Deleted draft"];
const audit: AuditLog[] = [];
for (let i = 0; i < 80; i++) {
  const entity = pick(["Beneficiary", "Household", "Activity", "Project", "Indicator", "Form submission", "User"]);
  const entityId =
    entity === "Beneficiary"
      ? pick(beneficiaries).beneficiary_id
      : entity === "Household"
        ? pick(households).household_id
        : entity === "Activity"
          ? pick(activities).activity_id
          : entity === "Project"
            ? pick(projects).project_id
            : entity === "Indicator"
              ? pick(indicators).indicator_id
              : entity === "Form submission"
                ? pick(submissions).submission_id
                : pick(users).user_id;
  audit.push({
    log_id: `LOG-${pad(i + 1, 4)}`,
    user_id: pick(users).user_id,
    action: pick(AUDIT_ACTIONS),
    entity,
    entity_id: entityId,
    timestamp: `${dateInMonth(randomMonth())}T${pad(int(7, 19), 2)}:${pad(int(0, 59), 2)}:00Z`,
  });
}
audit.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

/* -------------------------------------------------------- duplicate candidates */

const duplicates: DuplicateCandidate[] = [];
for (let i = 0; i < 7; i++) {
  const a = beneficiaries[(i * 37 + 5) % beneficiaries.length]!;
  const b = beneficiaries[(i * 53 + 11) % beneficiaries.length]!;
  if (a.beneficiary_id === b.beneficiary_id) continue;
  duplicates.push({
    id: `DUP-${pad(i + 1, 2)}`,
    a: a.beneficiary_id,
    b: b.beneficiary_id,
    score: 72 + int(0, 24),
    matched_on: ["Name similarity", "Sex", i % 2 ? "Household" : "Location", i % 3 ? "Date of birth" : "Phone"],
    status: "Pending review",
  });
}

export const dataset: Dataset = {
  locations,
  households,
  beneficiaries,
  programmes,
  projects,
  activities,
  participations,
  services,
  indicators,
  outcomes,
  visits,
  feedback,
  forms,
  submissions,
  users,
  audit,
  duplicates,
  months: MONTHS,
};
