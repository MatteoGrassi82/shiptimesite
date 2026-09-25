#!/usr/bin/env node
// Creates the eleven custom contact properties that /api/lps writes.
//
// Until they exist HubSpot rejects them, /api/lead strips them and retries, and
// the score survives only in the contact's timeline note — readable by a human,
// but not filterable, not segmentable, not reportable.
//
// Run it once:
//
//   HUBSPOT_TOKEN=pat-na1-… node scripts/hubspot-props.mjs
//
// Additive and idempotent: it creates properties and never edits or deletes
// anything that already exists, and a property that's already there comes back
// 409 and is counted as "existed". Safe to re-run.
//
// The Private App behind the token needs the scope crm.schemas.contacts.write
// (the same app already has crm.objects.contacts.write for the lead writes).
// Without it every call returns 403 and nothing is created.

const BASE = "https://api.hubapi.com/crm/v3/properties/contacts";
const GROUP = "lps_scorecard";

const BANDS = ["Optimized", "Advancing", "Developing", "Reactive", "Foundational"];
const PILLARS = ["Logistics Costs", "Operational Excellence", "Customer Experience"];

const enumOf = (values) => values.map((v, i) => ({ label: v, value: v, displayOrder: i, hidden: false }));

// Order here is the order they appear in HubSpot. Types follow what
// app/api/lps/route.ts actually sends: everything goes over the wire as a
// string, and HubSpot coerces numeric strings and ISO timestamps itself.
const PROPS = [
  {
    name: "scorecard_total",
    label: "LPS Total",
    type: "number",
    fieldType: "number",
    description: "Logistics Performance Score, 0-100, weighted across the three dimensions.",
  },
  {
    name: "scorecard_band",
    label: "LPS Band",
    type: "enumeration",
    fieldType: "select",
    options: enumOf(BANDS),
    description:
      "Which band the total falls in: Foundational 0-19, Reactive 20-39, Developing 40-59, Advancing 60-79, Optimized 80-100.",
  },
  {
    name: "scorecard_weakest",
    label: "LPS Weakest Dimension",
    type: "enumeration",
    fieldType: "select",
    options: enumOf(PILLARS),
    description: "The lowest-scoring of the three dimensions — where the conversation should start.",
  },
  {
    name: "scorecard_answered",
    label: "LPS Questions Answered",
    type: "number",
    fieldType: "number",
    description: "How many of the sixteen questions they answered. Below sixteen the total is partial.",
  },
  {
    name: "scorecard_areas",
    label: "LPS Dimension Scores",
    type: "string",
    fieldType: "text",
    description: "The three dimension scores in one line, e.g. CPS 30 · OES 61 · CES 41.",
  },
  {
    name: "scorecard_detail",
    label: "LPS Detail",
    type: "string",
    fieldType: "textarea",
    description: "Full breakdown: total, band, per-dimension scores and the biggest gaps.",
  },
  {
    name: "lps_report_headline",
    label: "LPS Report Headline",
    type: "string",
    fieldType: "text",
    description: "Headline of the written report generated from their answers.",
  },
  {
    name: "lps_report_read",
    label: "LPS Report — The Read",
    type: "string",
    fieldType: "textarea",
    description: "Report section: what their answers say about the operation. HTML.",
  },
  {
    name: "lps_report_priorities",
    label: "LPS Report — Priorities",
    type: "string",
    fieldType: "textarea",
    description: "Report section: what to fix first, in order. HTML.",
  },
  {
    name: "lps_report_closing",
    label: "LPS Report — Closing",
    type: "string",
    fieldType: "textarea",
    description: "Report section: closing note. HTML.",
  },
  {
    name: "lps_report_ready_at",
    label: "LPS Report Ready At",
    type: "datetime",
    fieldType: "date",
    description: "When the written report finished generating.",
  },
];

const token = process.env.HUBSPOT_TOKEN;
if (!token) {
  console.error("HUBSPOT_TOKEN is not set.\n\n  HUBSPOT_TOKEN=pat-na1-… node scripts/hubspot-props.mjs\n");
  process.exit(1);
}

const auth = { authorization: `Bearer ${token}`, "content-type": "application/json" };

const post = async (url, body) => {
  const r = await fetch(url, { method: "POST", headers: auth, body: JSON.stringify(body) });
  return { status: r.status, text: await r.text() };
};

// Group first — a property naming a group that doesn't exist is rejected.
const g = await post(`${BASE}/groups`, {
  name: GROUP,
  label: "Logistics Performance Score",
  displayOrder: -1,
});

if (g.status === 201) console.log("group  lps_scorecard  created");
else if (g.status === 409) console.log("group  lps_scorecard  already there");
else {
  // A missing scope or bad token fails every property the same way, so stop
  // here rather than print eleven copies of one error.
  console.error(`\ngroup creation failed (${g.status}):\n${g.text.slice(0, 500)}\n`);
  if (g.status === 401) console.error("→ the token is not valid for this portal.");
  if (g.status === 403) console.error("→ the Private App is missing the scope crm.schemas.contacts.write.");
  process.exit(1);
}

let created = 0;
let existed = 0;
const failed = [];

for (const p of PROPS) {
  const r = await post(BASE, { ...p, groupName: GROUP, hasUniqueValue: false, hidden: false, formField: false });
  if (r.status === 201) {
    created++;
    console.log(`  created  ${p.name}`);
  } else if (r.status === 409) {
    existed++;
    console.log(`  existed  ${p.name}`);
  } else {
    failed.push({ name: p.name, status: r.status, detail: r.text.slice(0, 300) });
    console.log(`  FAILED   ${p.name}  (${r.status})`);
  }
}

console.log(`\n${created} created, ${existed} already there, ${failed.length} failed`);
if (failed.length) {
  for (const f of failed) console.error(`\n${f.name} (${f.status}): ${f.detail}`);
  process.exit(1);
}
console.log("\nScores are now filterable and reportable. Existing contacts keep the timeline note;");
console.log("the properties fill in from the next assessment onward.");
