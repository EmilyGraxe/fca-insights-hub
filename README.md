# FCA Insights Hub

BUILD AN ADVANCED FCA UGANDA PROGRAMME INFORMATION, BENEFICIARY & ANALYTICS PLATFORM

1. IMPORTANT — READ THE UPLOADED DOCUMENTS FIRST

I am uploading several reference documents, including UNHCR Uganda population dashboard/report PDFs.

Before designing or coding anything, carefully study all uploaded documents.

Treat the uploaded UNHCR dashboards as a reference for information architecture, analytical depth, dashboard behaviour, visual hierarchy, filtering, geographic analysis, demographic breakdowns, tables, charts, indicators and user experience.

Do NOT simply copy UNHCR branding or recreate a refugee-only dashboard.

Instead:

Understand how the reference dashboards organize complex humanitarian information and build a significantly richer FCA Uganda system using the same level of analytical thinking, but adapted to FCA's programmes, beneficiaries, projects, activities, services, outcomes, locations, monitoring and MEAL requirements.

The uploaded documents should directly influence the structure and analytical capabilities of the prototype.

Where the uploaded documents contain specific terminology, categories, dimensions, tables, indicators or dashboard patterns, use them as inspiration/reference.

Do not invent factual FCA statistics.

All data shown in the prototype must clearly be synthetic/demo data unless actual FCA data is supplied.

2. PRODUCT NAME

Create:

FCA Uganda Data Hub

Subtitle:

Integrated Programme Information, Beneficiary & Analytics System

Position the product as:

A central programme intelligence platform for Finn Church Aid Uganda that connects beneficiaries, households, projects, activities, services, locations, monitoring data and outcomes into one system.

The system should feel like a serious humanitarian information-management platform rather than a generic CRM, spreadsheet application or simple dashboard.

3. CORE IDEA

The platform should answer questions such as:

WHO are we reaching?

How many unique beneficiaries?

How many households?

Who are they?

What are their age groups?

What is their gender distribution?

What beneficiary categories do they belong to?

Where are they located?

What vulnerabilities or inclusion characteristics are recorded?

WHERE are we working?

Region

District

Settlement

Sub-county

Parish

Village

Zone

Programme location

Project location

Activity location

WHAT are we doing?

Programmes

Projects

Activities

Trainings

Distributions

Assessments

Protection activities

Livelihood interventions

Education activities

Cash assistance

Community engagement

Referrals

Monitoring visits

Other configurable interventions

WHO is participating?

Beneficiary

Household

Community

Staff/implementer

Partner

WHAT changed?

Outputs

Outcomes

Indicators

Participation

Completion

Referrals

Follow-up results

Monitoring findings

Beneficiary feedback

Outcome measurements

WHERE are the gaps?

Underserved locations

Low participation

Low completion

Demographic gaps

Unreached beneficiaries

Project underperformance

Data-quality problems

Overlapping interventions

Emerging needs

The system must connect all of these.

4. LEARN FROM THE REFERENCE DASHBOARDS

The uploaded UNHCR dashboards demonstrate a useful analytical pattern.

For example, the reference overview presents headline totals, refugee/asylum-seeker breakdowns, households, women and children, elderly, youth, female/male distribution, settlement population, age/gender, country of origin/legal status, specific needs and registration trends.

The settlement-level reference goes considerably deeper, including:

total population

households

female/male

legal status

country of origin

age groups

youth

elderly

women and children

occupation

specific needs

new registrations

hosting locations/zones

For example, the reference settlement profiles include occupation, countries of origin, specific needs, age/gender breakdowns, youth, elderly, women and children, new registrations and hosting locations.
The FCA system should adopt this depth of analysis, but replace the refugee-population perspective with an FCA programme intelligence perspective.

5. DO NOT MAKE THIS A CLONE OF UNHCR

This distinction is critical.

UNHCR's reference system primarily answers:

"Who is the refugee and asylum-seeker population, where are they located, and what are their demographic characteristics?"

FCA's system must answer:

"Who is FCA reaching, where, through which programmes and activities, with what services, at what scale, for whom, with what results, and where are the remaining gaps?"

Therefore, the FCA system must connect:

Population → Beneficiary → Household → Programme → Project → Activity → Service → Participation → Indicator → Outcome → Location → Report

6. MAIN APPLICATION STRUCTURE

Create the following main navigation:

Executive Dashboard

Beneficiaries

Households

Programmes

Projects

Activities

Data Collection

Monitoring & MEAL

Analytics

Geographic Intelligence

Reports

Data Quality

Administration

Use a professional left-side navigation with icons and expandable sections.

7. EXECUTIVE DASHBOARD

The homepage should be a highly polished executive dashboard inspired by the analytical sophistication of the uploaded reference dashboards.

Do NOT overcrowd it.

Use a hierarchy:

TOP — HEADLINE KPIs

Create cards for:

Total Unique Beneficiaries

Total Households Reached

Active Projects

Active Programmes

Activities Delivered

Locations Reached

Services Delivered

Beneficiary Participation

Project Achievement %

Data Quality Score

Each card should have:

current value

comparison with previous period

small trend indicator

contextual tooltip

clickable drill-down

8. GLOBAL DASHBOARD FILTERS

Create a persistent filter bar.

Filters should include:

Reporting period

Year

Month

Programme

Project

Donor

Sector

Location

Region

District

Settlement

Beneficiary type

Gender

Age group

Disability/inclusion

Activity type

Project status

Allow users to:

apply filters

clear filters

save filter views

see active filters

drill into charts

All dashboard components should respond dynamically to the selected filters.

9. BENEFICIARY REACH ANALYTICS

Create a section called:

"Who We Reach"

Include:

Beneficiary totals

Unique beneficiaries

Total beneficiary participation

New beneficiaries

Returning beneficiaries

Active beneficiaries

Inactive beneficiaries

IMPORTANT:

Unique beneficiaries must be calculated using a unique FCA Beneficiary ID.

If one beneficiary participates in five projects, they remain one unique beneficiary.

However, their five programme participations should still be visible.

Clearly distinguish:

Unique Reach

from

Programme/Activity Participation

because these are not the same measure.

10. DEMOGRAPHIC PROFILE

Create an analytical section similar in depth to the demographic analysis in the uploaded dashboards.

Include:

Gender

Female

Male

Other/Prefer not to say where appropriate

Age groups

Use configurable age groups such as:

0–4

5–11

12–17

18–24

25–59

60+

Also calculate:

Children

Youth

Adults

Elderly

Allow age groups to be configurable.

Additional dimensions

Where data exists:

Disability/inclusion

Vulnerability

Beneficiary type

Nationality/country of origin

Household type

Occupation/livelihood category

Education status

Other configurable characteristics

11. BENEFICIARY TYPE

Do not assume that every FCA beneficiary is a refugee.

Create configurable beneficiary categories such as:

Refugee

Asylum seeker

Host community

Internally displaced person

Returnee

Other

Administrators should be able to configure these categories.

12. LOCATION INTELLIGENCE

Create a sophisticated location hierarchy.

Suggested structure:

Region → District → Sub-county → Parish → Village/Community → Settlement/Zone

Allow the actual FCA administrative/geographic structure to be configured.

A beneficiary should be associated with a location.

Projects should have one or more locations.

Activities should have one or more locations.

This allows geographic cross-analysis.

13. LOCATION DASHBOARD

Create a dedicated Geographic Intelligence page.

Use an interactive Uganda map.

The map should allow:

region selection

district selection

settlement selection

project location

beneficiary concentration

programme coverage

activity coverage

service delivery

project performance

When clicking a location, open a detailed location profile.

14. LOCATION PROFILE

The location profile should be one of the strongest parts of the system.

For each location show:

Population / Reach

Total FCA beneficiaries

Households reached

Female

Male

Children

Youth

Elderly

Persons with disabilities

Other inclusion dimensions

Programme presence

Show:

Active programmes

Active projects

Number of activities

Services delivered

Sector presence

For example:

Education

Livelihoods

Protection

Food security

Cash assistance

Skills development

Community engagement

Other configurable sectors

Project performance

Show:

| Project | Target | Actual | Achievement | Status |

Activity trends

Show monthly activity delivery.

Beneficiary trends

Show beneficiary reach over time.

Needs/inclusion profile

Show recorded vulnerability and inclusion categories.

Data quality

Show completeness and data-quality warnings for that location.

15. SETTLEMENT / COMMUNITY PROFILE CONCEPT

Inspired by the detailed settlement profiles in the uploaded UNHCR documents, create an FCA equivalent:

"Location Profile"

This should provide a one-page intelligence summary.

Example sections:

FCA Reach

Unique beneficiaries

Households

Participation

New beneficiaries

Demographics

Gender

Age

Children

Youth

Elderly

Programme Portfolio

Number of programmes

Number of projects

Active projects

Completed projects

Activities

Activities conducted

Participants

Attendance

Completion

Services

Most delivered services

Service recipients

Inclusion

Disability

Vulnerability categories

Other configurable needs

Livelihoods / socioeconomic information

Where collected:

Occupation

Skills

Employment

Business activities

Training

Trends

Monthly beneficiary registrations

Monthly activities

Monthly participation

Monthly services

16. PROGRAMME MANAGEMENT

Create a Programme Registry.

Fields:

Programme ID

Programme name

Programme description

Sector

Programme lead

Start date

End date

Status

Locations

Donors

Projects

Objectives

Strategic outcomes

Programme detail page should show:

projects

beneficiaries

activities

locations

indicators

targets

achievements

outcomes

reports

17. PROJECT MANAGEMENT

Create a Project Registry.

Fields:

Project ID

Project code

Project name

Programme

Donor

Sector

Start date

End date

Status

Budget placeholder

Target beneficiaries

Target households

Geographic coverage

Project manager

Objectives

Project detail page should contain tabs:

Overview

Beneficiaries

Households

Activities

Indicators

Targets & Results

Locations

Monitoring

Outcomes

Reports

Data Quality

18. PROJECT PERFORMANCE

Every project should automatically calculate:

Target achievement

Actual ÷ Target × 100

Show:

Target

Actual

Variance

Achievement %

Status

Status examples:

On track

Watch

At risk

Achieved

Completed

Do not rely only on colour.

Always provide text labels and icons.

19. ACTIVITY MANAGEMENT

Create an Activity Registry.

Fields:

Activity ID

Activity name

Activity type

Programme

Project

Date

Location

Facilitator

Target participants

Actual participants

Status

Notes

Activity types should be configurable.

Example demo categories:

Training

Workshop

Distribution

Cash assistance

Protection session

Community meeting

Monitoring visit

Assessment

Livelihood support

Referral

Other

20. ACTIVITY DETAIL

Each activity should display:

activity information

location

project

programme

attendance

participants

gender breakdown

age breakdown

beneficiary type

inclusion/disability

completion

photos/files placeholder

notes

follow-up actions

21. BENEFICIARY REGISTRY

Create a powerful searchable beneficiary registry.

Columns:

FCA Beneficiary ID

Name

Sex

Age

Age group

Beneficiary type

Household

Location

Programme participation

Project participation

Last activity

Status

Features:

Search

Filter

Sort

Pagination

Export

View profile

Duplicate detection

Bulk import placeholder

22. BENEFICIARY PROFILE

Create a rich beneficiary profile.

Header:

FCA Beneficiary ID

Show:

name

gender

age

age group

beneficiary type

household

location

registration date

status

Then use tabs:

Profile

Household

Programmes

Projects

Activities

Services Received

Referrals

Monitoring

Outcomes

Feedback

Data History

Create a visual timeline.

Example:

Registered → Participated in Training → Received Livelihood Support → Referred → Follow-up → Outcome Recorded

This is essential.

The system should show the beneficiary's journey through FCA interventions.

23. HOUSEHOLD REGISTRY

Create household-level analysis.

Fields:

Household ID

Household size

Household head

Location

Household type

Vulnerability

Registration date

Household profile should show all linked members.

Analytics:

average household size

households reached

household vulnerability

household programme participation

household services

24. CROSS-PROGRAMME BENEFICIARY ANALYSIS

This is one of the most important analytical features.

Allow users to answer:

How many beneficiaries are in one programme?

How many are in multiple programmes?

Which beneficiaries receive multiple services?

Which programmes overlap?

Where are beneficiaries being served by multiple projects?

Which beneficiaries are not receiving follow-up?

Which locations have many programmes but low unique reach?

Create a visualization:

"Programme Overlap"

Example:

Livelihoods → 2,400 beneficiaries
Education → 3,100
Protection → 1,800

Then show overlaps:

Livelihoods + Education
Education + Protection
Livelihoods + Protection
All three

Use synthetic data.

25. SERVICE DELIVERY ANALYTICS

Create a service/intervention layer.

Track:

service type

beneficiary

household

project

programme

activity

location

date

quantity/value where appropriate

completion

referral

follow-up

Dashboard:

"What Services Are We Delivering?"

Show:

total services

services by programme

services by location

services by beneficiary group

services over time

repeat service recipients

26. MONITORING & MEAL

Create a dedicated MEAL module.

Include:

Indicators

Fields:

Indicator ID

Indicator name

Definition

Unit

Baseline

Target

Actual

Reporting period

Project

Programme

Data source

Monitoring visits

Track:

date

project

location

monitor

findings

recommendations

action points

status

Outcome tracking

Allow configurable outcome records.

Examples:

knowledge improved

skills acquired

employment started

business started

service access improved

referral completed

other programme-specific outcomes

Do not hard-code these as universal FCA outcomes.

Make them configurable.

27. DATA COLLECTION / FORM BUILDER

Create a configurable form-builder interface.

Users should be able to create forms without changing application code.

Field types:

Short text

Long text

Number

Decimal

Date

Date/time

Dropdown

Multiple choice

Yes/No

Gender

Age

Location

Beneficiary lookup

Household lookup

Programme lookup

Project lookup

Activity lookup

File/photo placeholder

Signature placeholder

GPS/location placeholder

Forms should support:

required fields

validation

conditional questions

sections

instructions

calculated fields

repeating groups

save draft

submit

approval workflow

28. EXAMPLE FORMS

Create demo forms:

Beneficiary Registration

Training Attendance

Distribution Record

Monitoring Visit

Post-Activity Monitoring

Referral Tracking

Outcome Follow-up

Community Feedback

Project Progress Update

These should demonstrate how the platform can collect different types of programme data.

29. ANALYTICS WORKSPACE

Create an advanced analytics builder.

Users should be able to select:

Dimensions

Programme

Project

Activity

Location

District

Settlement

Gender

Age group

Beneficiary type

Household

Disability

Vulnerability

Service type

Reporting period

Donor

Metrics

Unique beneficiaries

Households

Activities

Participation

Services

Target

Actual

Achievement %

Completion %

Coverage %

Attendance %

Outcome count

Allow:

chart type selection

filters

grouping

comparison

save analysis

export

drill-down

30. ANALYTICAL QUESTIONS

Include a section called:

"Ask the Data"

Provide intelligent predefined analytical questions such as:

Which project reached the most unique beneficiaries?

Which district has the highest FCA reach?

Which programme has the highest target achievement?

Where is beneficiary reach declining?

Which locations have the largest gender gap?

Which projects are below target?

Which beneficiaries participate in multiple programmes?

Which locations have high activity levels but low beneficiary reach?

Which demographic groups are underrepresented?

Which projects have poor data completeness?

Which programmes have the strongest growth?

Where are services concentrated?

For the prototype, this can be implemented using predefined analytical cards rather than a true AI engine.

31. AUTOMATED PROGRAMME INSIGHTS

Create a dashboard section:

"Programme Insights"

Generate simple rule-based insights from the demo data.

Examples:

"Livelihoods currently accounts for the largest share of unique beneficiary reach."

"Two locations show beneficiary growth below the previous reporting period."

"Project ABC has achieved 82% of its beneficiary target."

"Female participation is below the configured programme benchmark in one location."

"Three projects have incomplete indicator data."

These must be calculated from actual demo data.

Do NOT fabricate narrative statistics.

32. TREND ANALYSIS

Create time-series analysis for:

beneficiary registration

new beneficiaries

activities

participation

services

project achievement

referrals

outcomes

Default periods:

last 6 months

last 12 months

year-to-date

Allow custom date ranges.

The reference dashboards demonstrate the usefulness of six-month registration trends; reproduce this analytical pattern for FCA activities.

33. DATA QUALITY DASHBOARD

Create a serious Data Quality module.

Track:

missing beneficiary IDs

missing gender

missing DOB

missing location

duplicate candidates

incomplete households

incomplete activities

missing project links

invalid dates

inconsistent records

missing indicator values

Calculate:

Data Quality Score

Example formula:

Complete required fields ÷ total required fields × 100

Show:

overall score

beneficiary data score

household data score

activity data score

project data score

indicator data score

Use synthetic data to demonstrate warnings.

34. DUPLICATE DETECTION

Create a duplicate-candidate interface.

Potential matching fields:

name

date of birth

sex

household

location

phone placeholder

Do not automatically merge records.

Provide:

Review → Compare → Confirm Merge

for authorized users.

35. REPORTING CENTRE

Create a Reports page.

Report types:

Beneficiary Reach Report

Programme Performance Report

Project Performance Report

Gender & Age Report

Geographic Coverage Report

Activity Report

Service Delivery Report

Donor Indicator Report

MEAL Report

Data Quality Report

Location Profile Report

Each report should support:

date range

programme

project

location

export placeholder

print-friendly layout

36. DONOR REPORTING

Create a configurable donor reporting structure.

A project can have multiple donors.

Indicators can be mapped to donor requirements.

Do not hard-code a specific donor's framework.

Use:

Donor → Project → Indicator → Target → Actual → Reporting Period

37. DATA MODEL

Design the application around a relational data model.

Core entities:

Beneficiary

beneficiary_id

household_id

name

sex

date_of_birth

age_group

beneficiary_type

nationality

location_id

disability_status

registration_date

status

Household

household_id

household_size

household_head_id

location_id

household_type

vulnerability_status

Programme

programme_id

programme_name

sector

description

status

Project

project_id

project_code

project_name

programme_id

donor

start_date

end_date

status

target_beneficiaries

Activity

activity_id

project_id

programme_id

activity_name

activity_type

date

location_id

target_participants

actual_participants

status

Participation

participation_id

beneficiary_id

activity_id

attendance

completion_status

Service

service_id

beneficiary_id

household_id

activity_id

project_id

service_type

date

status

Outcome

outcome_id

beneficiary_id

project_id

indicator_id

date

result

Indicator

indicator_id

project_id

indicator_name

definition

unit

baseline

target

actual

reporting_period

Location

location_id

region

district

sub_county

parish

settlement

village

zone

latitude

longitude

Form

form_id

form_name

programme

project

version

status

FormSubmission

submission_id

form_id

beneficiary_id

household_id

submitted_by

submitted_at

status

User

user_id

name

email

role

location_scope

status

AuditLog

log_id

user_id

action

entity

entity_id

timestamp

Design relationships properly.

38. IMPORTANT DATA RELATIONSHIP

The most important relationship is:

ONE PERSON = ONE FCA BENEFICIARY ID

That same beneficiary may appear in:

multiple programmes

multiple projects

multiple activities

multiple services

multiple monitoring records

multiple outcome records

Do not create duplicate people simply because they participate in different programmes.

This is essential for calculating genuine unique reach.

39. SYNTHETIC DEMO DATA

Populate the prototype with realistic but completely synthetic data.

Create approximately:

300 beneficiaries

75 households

10 programmes/projects

40 activities

100+ participation records

100+ service records

indicator records

outcome records

multiple locations

multiple sectors

multiple beneficiary types

Make the data relational.

Do not use fake-looking random isolated numbers.

The dashboards must actually calculate from the underlying records.

40. DEMO LOCATIONS

Use representative Uganda locations, including examples inspired by the uploaded reference documents:

Adjumani

Yumbe

Bidibidi

Kyangwali

Nakivale

Kyaka II

Kiryandongo

Kampala

Rwamwanja

Palabek

Imvepi

Rhino

Oruchinga

Palorinya

Lobule

These should be clearly treated as prototype/configurable locations, not as claims about current FCA operational coverage.

41. IMPORTANT — DO NOT COPY UNHCR NUMBERS

The uploaded reference contains figures such as population totals, settlement populations and demographic statistics. For example, the reference reports 2,011,234 individuals and 548,356 households as of 30 April 2026.

Do NOT put these numbers into FCA's dashboard as FCA data.

They are reference figures only.

Use synthetic FCA numbers.

42. DASHBOARD VISUAL DESIGN

Use a visual style inspired by modern humanitarian information-management dashboards.

FCA branding

Use an FCA-inspired green visual identity.

Primary visual language:

FCA green

dark green

light green

white

neutral grey

charcoal text

Do not invent or reproduce an official FCA logo unless one is supplied.

Use a tasteful text-based FCA identity or simple placeholder.

The interface should feel:

humanitarian

trustworthy

modern

calm

analytical

professional

accessible

Avoid:

excessive gradients

giant decorative graphics

gaming-style dashboards

unnecessary animations

excessive cards

clutter

43. CHART DESIGN

Use a balanced mixture of:

KPI cards

horizontal bar charts

vertical bar charts

line charts

donut charts

stacked bars

tables

heatmaps

maps

progress bars

trend indicators

Every chart must have:

meaningful title

clear labels

tooltip

legend where needed

filter interaction

drill-down where useful

Avoid 3D charts.

44. EXECUTIVE DASHBOARD LAYOUT

Build approximately:

Row 1

10 KPI metrics

Row 2

Beneficiaries by Programme

Beneficiary Demographics

Row 3

Beneficiaries by Location

Programme Performance

Row 4

Beneficiary trend

Activity trend

Row 5

Geographic coverage map

Services delivered

Row 6

Programme Insights

Data Quality

The dashboard must remain readable.

45. INTERACTIVE DRILL-DOWNS

Users should be able to click:

Programme → Project → Activity → Beneficiary

and:

Region → District → Settlement → Project → Beneficiary

and:

Beneficiary → Household → Programmes → Activities → Services → Outcomes

This is a major requirement.

46. TABLES

Tables must support:

search

sorting

filters

pagination

column visibility

export button

row click

responsive design

For large tables, use pagination rather than displaying hundreds of rows at once.

47. USER ROLES

Create:

Administrator

Full access.

MEAL Manager

Analytics, monitoring, indicators, data quality and reporting.

Programme Manager

Programme/project/activity data and analytics.

Field Officer

Beneficiary, household and activity data.

Data Collector

Form submission and assigned data collection.

Viewer

Read-only dashboards and reports.

Donor/External Viewer

Restricted reporting access.

48. SECURITY

Even though this is a prototype, design with production security in mind.

Include:

authentication-ready architecture

role-based access

location-based access concept

audit logging

sensitive data protection

restricted beneficiary information

aggregate-only external dashboards

Do not expose sensitive personal information in public dashboards.

Use synthetic data only.

49. FUTURE ARCHITECTURE

Structure the prototype so it can later connect to:

Supabase/PostgreSQL

KoboToolbox

ODK

mobile data collection

offline data collection

Excel/CSV imports

Power BI

APIs

GIS systems

SMS/communications

donor reporting systems

Do not attempt to fully build every integration now.

Build the prototype architecture so these can be added later.

50. MOBILE / FIELD DATA COLLECTION

The system should be responsive.

Field officers may eventually use phones/tablets.

Make:

forms mobile-friendly

buttons touch-friendly

tables responsive

location fields usable on smaller screens

forms easy to complete

Create an offline-mode placeholder/state for future development.

51. AUDIT TRAIL

Every important record should support:

created by

created date

updated by

updated date

status

change history

Create an Administration → Audit Log page.

52. ADMINISTRATION

Create an administration area for:

users

roles

programmes

sectors

beneficiary types

locations

activity types

service types

vulnerability categories

indicator units

reporting periods

form templates

system settings

Make these configurable instead of hard-coded wherever practical.

53. EMPTY / LOADING / ERROR STATES

Build professional states for:

loading

no data

error

unauthorized

incomplete data

no search results

Do not leave blank white pages.

54. ACCESSIBILITY

Follow good accessibility practices:

readable font sizes

strong contrast

keyboard navigation

meaningful labels

tooltips

icons accompanied by text where necessary

do not rely only on colour to communicate status

55. DATA QUALITY WARNINGS

Where data is incomplete, show useful messages.

Example:

"18 beneficiary records are missing location information."

"4 activities have no linked project."

"7 duplicate beneficiary candidates require review."

Make these clickable so users can investigate.

56. SMART CALCULATIONS

Implement real calculations from the database.

Examples:

Unique beneficiaries

COUNT DISTINCT beneficiary_id

Households reached

COUNT DISTINCT household_id

Participation

COUNT participation records

Female participation

Female participants ÷ total participants × 100

Youth participation

Youth participants ÷ total participants × 100

Target achievement

Actual ÷ Target × 100

Activity completion

Completed activities ÷ planned activities × 100

Geographic coverage

Locations with active FCA projects ÷ total configured operational locations × 100

Data completeness

Completed required fields ÷ total required fields × 100

Do not hard-code dashboard statistics.

57. IMPORTANT ANALYTICAL DISTINCTION

Always distinguish between:

Beneficiary Reach

and

Beneficiary Participation

and

Services Delivered

and

Activities Delivered

These represent different concepts.

For example:

One beneficiary may attend five activities.

Therefore:

Unique beneficiaries = 1

Participation records = 5

Activities = potentially 5

Services = potentially multiple

Do not add these metrics together.

58. REFERENCE-DOCUMENT-INSPIRED ANALYTICS

Where useful, include analytical patterns demonstrated in the uploaded documents:

Population/Reach Overview

Location comparison

Age and gender breakdown

Country/nationality breakdown

Specific needs / inclusion

Registration trends

Occupation/livelihood

Location profile

Hosting/community/location breakdown

But adapt them to FCA.

For example:

UNHCR:

Country of Origin and Legal Status

FCA:

Beneficiary Type and Location

UNHCR:

Specific Needs

FCA:

Inclusion, Vulnerability & Programme Needs

UNHCR:

New Arrival Registration Trend

FCA:

New Beneficiary Registration / Programme Reach Trend

UNHCR:

Settlement Profile

FCA:

FCA Location / Programme Profile

This is the kind of transformation I want.

59. CREATE A "PROGRAMME INTELLIGENCE" EXPERIENCE

The dashboard should not merely show numbers.

It should help managers understand:

What is happening?

Where is it happening?

Who is being reached?

Who is not being reached?

Which programmes are performing well?

Where are targets not being met?

Where are beneficiaries participating in multiple interventions?

Where are data gaps?

What should programme teams investigate?

60. DESIGN THE SYSTEM AS A DATA PIPELINE

Think of the architecture as:

COLLECT

Forms and field data

↓

CONNECT

Beneficiaries + households + programmes + projects + activities + locations

↓

VALIDATE

Data quality + duplicate checks + approvals

↓

ANALYSE

Demographics + geography + participation + services + indicators

↓

UNDERSTAND

Trends + gaps + programme insights

↓

DECIDE

Reports + management decisions + programme actions

This should be the product philosophy.

61. PROTOTYPE PRIORITY

Do not spend the entire effort building backend infrastructure.

The first prototype must convincingly demonstrate:

PRIORITY 1

Executive dashboard

PRIORITY 2

Beneficiary registry and profiles

PRIORITY 3

Household registry

PRIORITY 4

Programme/project registry

PRIORITY 5

Activities and participation

PRIORITY 6

Data collection forms

PRIORITY 7

Analytics

PRIORITY 8

Location intelligence

PRIORITY 9

Reports

PRIORITY 10

Data quality

The prototype should feel coherent end-to-end.

62. BUILD REAL INTERACTIONS

Do not create static mockup screens.

Buttons should work.

Filters should update data.

Charts should respond to filters.

Tables should search.

Records should open.

Navigation should work.

Drill-downs should work.

Forms should be usable.

Create realistic demo records.

If a feature cannot be fully implemented, create a believable functional placeholder rather than a dead button.

63. STARTING DASHBOARD

When the application opens, show:

FCA Uganda Data Hub

Programme Intelligence at a Glance

Then:

"Who are we reaching?"

"Where are we working?"

"What are we delivering?"

"What results are we seeing?"

"Where are the gaps?"

Use the dashboard to answer these questions visually.

64. FINAL QUALITY STANDARD

The result should look like a platform that could eventually be presented to:

FCA Uganda leadership

Programme teams

MEAL teams

Country management

Regional management

Donors

Partners

It should NOT look like:

a school project

a generic admin template

a simple CRUD database

an ordinary CRM

a spreadsheet replacement

It should feel like a serious humanitarian programme information and decision-support system.

65. FINAL INSTRUCTION TO LOVABLE

Before coding:

Read all uploaded reference documents.

Identify their dashboard structure.

Identify their analytical dimensions.

Identify their geographic hierarchy.

Identify their demographic analysis.

Identify their use of trends, profiles, tables and KPIs.

Translate those concepts into FCA programme intelligence.

Design the data model.

Build the prototype around connected relational data.

Populate it with synthetic but coherent demo data.

Make all major dashboards dynamically calculated.

Make navigation and drill-downs functional.

Prioritize usability and analytical clarity over unnecessary features.

Do not merely reproduce the uploaded dashboards.

Use them as the analytical reference and build something broader, deeper and more useful for FCA Uganda.

The ultimate product principle is:

COLLECT → CONNECT → VALIDATE → ANALYSE → UNDERSTAND → DECIDE

Build the first prototype around this principle.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/28e0a222-a4a0-491f-a4e4-ddbe28a49eb8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
