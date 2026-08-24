#!/usr/bin/env node
/**
 * Creates the five HubSpot contact properties the Parcel Forum report email
 * reads from. Step 1 of PARCELFORUM-REPORT-EMAIL.md, done by API instead of by
 * hand — five properties with exact internal names and two distinct field types
 * is exactly the job a person gets subtly wrong once and then debugs for an
 * hour.
 *
 *   HUBSPOT_TOKEN=pat-... node scripts/hubspot-lps-properties.mjs --dry-run
 *   HUBSPOT_TOKEN=pat-... node scripts/hubspot-lps-properties.mjs
 *
 * The token is the same Private App token /api/lead uses. Easiest route:
 *   vercel env pull .env.local.production --environment=production
 *   HUBSPOT_TOKEN=$(grep HUBSPOT_TOKEN .env.local.production | cut -d= -f2- | tr -d '"') \
 *     node scripts/hubspot-lps-properties.mjs
 * or just drop HUBSPOT_TOKEN into .env.local, which this script also reads.
 *
 * Needs the Private App scopes `crm.schemas.contacts.write` and
 * `crm.schemas.contacts.read`. The first is already granted (it was used to
 * create the scorecard properties); if the read scope is missing the script
 * says so rather than guessing.
 *
 * Idempotent: run it as often as you like. Existing properties are left alone,
 * and a property whose field type doesn't match what the email needs is
 * reported rather than silently altered — changing a live property's type is a
 * decision, not a script's business.
 */

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const API = "https://api.hubapi.com/crm/v3/properties/contacts";
const DRY = process.argv.includes("--dry-run");

// ── Minimal .env.local loader (no dependency) ──────────────────
async function loadEnvLocal() {
  const envPath = resolve(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  const raw = await readFile(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

const GROUP = { name: "logistics_performance_score", label: "Logistics Performance Score" };

// The field types are load-bearing, not cosmetic. HubSpot collapses the
// newlines in a multi-line text property when it renders that property through
// a personalization token in an email, and it does not support HubL filters in
// email rendering — so there is no fixing it from the email side. `html` (rich
// text in the UI) renders its markup, which is why /api/lps writes those three
// sections as HTML paragraphs. Getting this wrong produces one run-on paragraph
// in every report we send, with no error anywhere.
const PROPERTIES = [
  {
    name: "lps_report_headline",
    label: "LPS report — headline",
    type: "string",
    fieldType: "text",
    description: "One sentence naming what the score means operationally. Written by /api/lps.",
  },
  {
    name: "lps_report_read",
    label: "LPS report — the read",
    type: "string",
    fieldType: "html",
    description: "Two or three sentences on what their answer pattern says. HTML, written by /api/lps.",
  },
  {
    name: "lps_report_priorities",
    label: "LPS report — priorities",
    type: "string",
    fieldType: "html",
    description: "The three weighted priorities as three paragraphs. HTML, written by /api/lps.",
  },
  {
    name: "lps_report_closing",
    label: "LPS report — closing",
    type: "string",
    fieldType: "html",
    description: "One sentence tying their stated priority to where the score says the leverage is. HTML, written by /api/lps.",
  },
  {
    name: "lps_report_ready_at",
    label: "LPS report ready at",
    type: "string",
    fieldType: "text",
    description:
      "ISO 8601 timestamp, written only once the report exists. This is the report email workflow's enrolment trigger — nothing else should write it.",
  },
];

function headers(token) {
  return { authorization: `Bearer ${token}`, "content-type": "application/json" };
}

async function hs(token, url, init = {}) {
  const res = await fetch(url, { ...init, headers: headers(token) });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

function explain(status, body) {
  const msg = body?.message || JSON.stringify(body);
  if (status === 401) return "token rejected — check HUBSPOT_TOKEN is the Private App token, not a form/portal id";
  if (status === 403) return `missing scope — add it to the Private App, then retry. HubSpot said: ${msg}`;
  return `HTTP ${status} — ${msg}`;
}

async function main() {
  await loadEnvLocal();
  const token = process.env.HUBSPOT_TOKEN;
  if (!token) {
    console.error("HUBSPOT_TOKEN is not set. See the header of this file for how to get it.");
    process.exit(1);
  }

  console.log(DRY ? "── dry run, nothing will be written ──\n" : "── writing to HubSpot ──\n");

  // ── the property group ───────────────────────────────────────
  const groups = await hs(token, `${API}/groups`);
  if (!groups.ok) {
    console.error(`Couldn't list property groups: ${explain(groups.status, groups.body)}`);
    process.exit(1);
  }
  const hasGroup = (groups.body.results || []).some((g) => g.name === GROUP.name);
  if (hasGroup) {
    console.log(`group   ${GROUP.name}  already there`);
  } else if (DRY) {
    console.log(`group   ${GROUP.name}  would create`);
  } else {
    const made = await hs(token, `${API}/groups`, {
      method: "POST",
      body: JSON.stringify({ name: GROUP.name, label: GROUP.label, displayOrder: -1 }),
    });
    console.log(
      made.ok
        ? `group   ${GROUP.name}  created`
        : `group   ${GROUP.name}  FAILED — ${explain(made.status, made.body)}`,
    );
    if (!made.ok) process.exit(1);
  }

  // ── the five properties ──────────────────────────────────────
  const existing = await hs(token, API);
  if (!existing.ok) {
    console.error(`Couldn't list properties: ${explain(existing.status, existing.body)}`);
    process.exit(1);
  }
  const byName = new Map((existing.body.results || []).map((p) => [p.name, p]));

  let created = 0;
  let mismatched = 0;
  let failed = 0;

  for (const prop of PROPERTIES) {
    const found = byName.get(prop.name);

    if (found) {
      if (found.fieldType === prop.fieldType) {
        console.log(`prop    ${prop.name.padEnd(24)} already there (${found.fieldType})`);
      } else {
        mismatched++;
        console.log(
          `prop    ${prop.name.padEnd(24)} WRONG TYPE — is "${found.fieldType}", needs "${prop.fieldType}". ` +
            `Change it in Settings → Properties, or the report will render as one paragraph.`,
        );
      }
      continue;
    }

    if (DRY) {
      console.log(`prop    ${prop.name.padEnd(24)} would create (${prop.fieldType})`);
      continue;
    }

    const made = await hs(token, API, {
      method: "POST",
      body: JSON.stringify({
        name: prop.name,
        label: prop.label,
        description: prop.description,
        groupName: GROUP.name,
        type: prop.type,
        fieldType: prop.fieldType,
        // Rich text properties can't appear on forms anyway, and none of these
        // should ever be typed by a human — /api/lps owns all five.
        formField: false,
      }),
    });

    if (made.ok) {
      created++;
      console.log(`prop    ${prop.name.padEnd(24)} created (${prop.fieldType})`);
    } else {
      failed++;
      console.log(`prop    ${prop.name.padEnd(24)} FAILED — ${explain(made.status, made.body)}`);
    }
  }

  // ── what's left, which is the part no API can do ─────────────
  console.log("");
  if (failed) {
    console.log(`${failed} propert${failed === 1 ? "y" : "ies"} failed. Fix the above and re-run — this script is idempotent.`);
    process.exit(1);
  }
  if (mismatched) {
    console.log(`${mismatched} propert${mismatched === 1 ? "y" : "ies"} exist with the wrong field type. Fix in the UI; nothing else to do here.`);
  }
  if (DRY) {
    console.log("Dry run only. Re-run without --dry-run to write.");
    return;
  }

  console.log(
    [
      created ? `Done — ${created} propert${created === 1 ? "y" : "ies"} created.` : "Done — nothing to create.",
      "",
      "Still to do by hand, in the portal (see PARCELFORUM-REPORT-EMAIL.md):",
      "  1. Automation → Workflows → contact-based, blank.",
      "     Enrol: lps_report_ready_at is known. Re-enrol when it changes.",
      "     Delay 1 hour → if lps_report_headline is known → send the email.",
      "     If the Delay action shows a padlock, the portal is on Starter and the",
      "     trigger has to change — the runbook covers that case.",
      "  2. Marketing → Email → Automated, one rich text module, the five tokens.",
      "     Send from a real person's address, not no-reply@.",
      "",
      "Then test: curl the /api/lps snippet at the bottom of the runbook and watch",
      "the contact fill in, with [lps/report] in the server log a few seconds later.",
    ].join("\n"),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
