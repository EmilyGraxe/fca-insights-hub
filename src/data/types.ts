export type Sex = "Female" | "Male" | "Other/Prefer not to say";

export type AgeGroupKey = "0-4" | "5-11" | "12-17" | "18-24" | "25-59" | "60+";

export interface Location {
  location_id: string;
  region: string;
  district: string;
  sub_county: string;
  parish: string;
  village: string;
  settlement: string;
  zone: string;
  latitude: number;
  longitude: number;
  operational: boolean;
}

export interface Household {
  household_id: string;
  household_size: number;
  household_head_id: string;
  location_id: string;
  household_type: string;
  vulnerability_status: string;
  registration_date: string;
}

export interface Beneficiary {
  beneficiary_id: string;
  household_id: string;
  name: string;
  sex: Sex | null;
  date_of_birth: string | null;
  age: number | null;
  age_group: AgeGroupKey | null;
  beneficiary_type: string;
  nationality: string;
  location_id: string | null;
  disability_status: string;
  vulnerability: string[];
  occupation: string;
  education_status: string;
  phone: string | null;
  registration_date: string;
  status: "Active" | "Inactive";
  created_by: string;
  updated_at: string;
}

export interface Programme {
  programme_id: string;
  programme_name: string;
  sector: string;
  description: string;
  lead: string;
  start_date: string;
  end_date: string;
  status: "Active" | "Closed" | "Planned";
  objectives: string[];
  strategic_outcomes: string[];
}

export interface Project {
  project_id: string;
  project_code: string;
  project_name: string;
  programme_id: string;
  donors: string[];
  sector: string;
  start_date: string;
  end_date: string;
  status: "Active" | "Completed" | "Planned" | "Closed";
  budget_usd: number;
  target_beneficiaries: number;
  target_households: number;
  location_ids: string[];
  manager: string;
  objectives: string[];
}

export interface Activity {
  activity_id: string;
  project_id: string;
  programme_id: string;
  activity_name: string;
  activity_type: string;
  date: string;
  location_id: string;
  facilitator: string;
  target_participants: number;
  actual_participants: number;
  status: "Completed" | "Planned" | "Cancelled" | "In progress";
  notes: string;
}

export interface Participation {
  participation_id: string;
  beneficiary_id: string;
  activity_id: string;
  attendance: "Present" | "Absent";
  completion_status: "Completed" | "Partial" | "Dropped";
}

export interface Service {
  service_id: string;
  beneficiary_id: string;
  household_id: string;
  activity_id: string;
  project_id: string;
  programme_id: string;
  service_type: string;
  date: string;
  quantity: number;
  unit: string;
  status: "Delivered" | "Pending" | "Referred";
  referral: boolean;
  follow_up: "Completed" | "Pending" | "Not required";
}

export interface Indicator {
  indicator_id: string;
  project_id: string;
  programme_id: string;
  indicator_name: string;
  definition: string;
  unit: string;
  baseline: number;
  target: number;
  actual: number | null;
  reporting_period: string;
  data_source: string;
}

export interface Outcome {
  outcome_id: string;
  beneficiary_id: string;
  project_id: string;
  indicator_id: string;
  date: string;
  outcome_type: string;
  result: "Achieved" | "Partially achieved" | "Not achieved";
}

export interface MonitoringVisit {
  visit_id: string;
  date: string;
  project_id: string;
  location_id: string;
  monitor: string;
  findings: string;
  recommendation: string;
  action_point: string;
  status: "Open" | "In progress" | "Closed";
}

export interface Feedback {
  feedback_id: string;
  beneficiary_id: string;
  project_id: string;
  date: string;
  channel: string;
  category: string;
  sentiment: "Positive" | "Neutral" | "Concern";
  status: "Open" | "Resolved";
  summary: string;
}

export interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  help?: string;
  section: string;
  conditionalOn?: { field: string; equals: string };
}

export interface FormTemplate {
  form_id: string;
  form_name: string;
  programme_id: string | null;
  project_id: string | null;
  version: string;
  status: "Published" | "Draft";
  description: string;
  submissions: number;
  fields: FormField[];
}

export interface FormSubmission {
  submission_id: string;
  form_id: string;
  beneficiary_id: string | null;
  household_id: string | null;
  submitted_by: string;
  submitted_at: string;
  status: "Approved" | "Pending approval" | "Draft" | "Rejected";
}

export interface User {
  user_id: string;
  name: string;
  email: string;
  role: string;
  location_scope: string;
  status: "Active" | "Suspended";
  last_active: string;
}

export interface AuditLog {
  log_id: string;
  user_id: string;
  action: string;
  entity: string;
  entity_id: string;
  timestamp: string;
}

export interface DuplicateCandidate {
  id: string;
  a: string;
  b: string;
  score: number;
  matched_on: string[];
  status: "Pending review" | "Reviewed";
}

export interface Dataset {
  locations: Location[];
  households: Household[];
  beneficiaries: Beneficiary[];
  programmes: Programme[];
  projects: Project[];
  activities: Activity[];
  participations: Participation[];
  services: Service[];
  indicators: Indicator[];
  outcomes: Outcome[];
  visits: MonitoringVisit[];
  feedback: Feedback[];
  forms: FormTemplate[];
  submissions: FormSubmission[];
  users: User[];
  audit: AuditLog[];
  duplicates: DuplicateCandidate[];
  months: string[];
}
