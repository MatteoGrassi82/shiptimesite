#!/usr/bin/env node
// Builds the Google Ads offline-conversion upload for "First Shipment".
//
// Why this exists: Ads only ever hears about signups, so it bids for form fills.
// 62% of signups never ship. This tells Ads which of them became customers, by
// email, so Smart Bidding can chase shippers instead. It's the second half of
// Enhanced Conversions for Leads — the first half is the signup form sending
// Google the hashed email at submit (components/ui/lead-capture-form.tsx,
// trackAdsSignupConversion). Same normalisation + hash on both sides, or the
// two never join. See lib/ads.ts.
//
// Reads Metabase (bi.shiptime.com), writes a CSV in Google's upload format.
// Upload it at Ads → Goals → Conversions → Uploads, or feed it to the Ads API.
//
//   npm run ads:export                      # yesterday's first shipments
//   npm run ads:export -- --days 7          # the last 7 days
//   npm run ads:export -- --from 2026-09-01 --to 2026-09-04
//   npm run ads:export -- --days 7 --value 12 --out first-shipments.csv
//
// Env: METABASE_URL, METABASE_SESSION (or METABASE_USER + METABASE_PASSWORD),
// METABASE_DB_ID. See .env.example. Nothing is persisted; the token is not
// written anywhere.
//
// Google only accepts a conversion within 90 days of the click, and 84% of
// shippers ship within 7 days of signup, so a daily or weekly run is plenty.
//
// Those two figures come from the corrected cohort: accounts opened 3-15 months
// ago, so every one had at least 90 days to ship. 20,706 signups, 7,781 of which
// ever shipped -> 62.4% never shipped, and of those that did, 84.1% started
// within 7 days (93.3% within 30). They supersede an earlier 55%/81% read taken
// over a window that hadn't given recent signups time to ship.

import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";

const args = parseArgs(process.argv.slice(2));
const TZ = "America/Toronto";
const CONVERSION_NAME = args.name ?? "First Shipment";
const CURRENCY = args.currency ?? "CAD";
const VALUE = args.value ?? ""; // blank → the action's default value in Ads
const HASH = !args.plain;      // --plain sends raw emails (Google hashes them)

const { from, to } = dateWindow(args);
const base = (process.env.METABASE_URL ?? "https://bi.shiptime.com").replace(/\/+$/, "");
const dbId = Number(process.env.METABASE_DB_ID ?? 2);

const token = await session(base);
const rows = await query(base, token, dbId, sql(from, to));

const lines = [
  `Parameters:TimeZone=${TZ}`,
  csv(["Email", "Conversion Name", "Conversion Time", "Conversion Value", "Conversion Currency", "Order ID"]),
];
for (const [accountId, email, firstShip] of rows) {
  const day = String(firstShip).slice(0, 10); // SHIP_DATE is a date; use midday
  lines.push(csv([
    HASH ? sha256(normalizeEmail(email)) : normalizeEmail(email),
    CONVERSION_NAME,
    `${day} 12:00:00`,
    VALUE,
    VALUE === "" ? "" : CURRENCY,
    `first-ship-${accountId}`,
  ]));
}
const out = lines.join("\n") + "\n";

if (args.out) {
  writeFileSync(args.out, out);
  process.stderr.write(`${rows.length} conversions (${from} → ${to}) → ${args.out}\n`);
} else {
  process.stdout.write(out);
  process.stderr.write(`${rows.length} conversions (${from} → ${to})\n`);
}

// ── SQL ──────────────────────────────────────────────────────────────────────
function sql(from, to) {
  // Dates are validated to YYYY-MM-DD before they get here.
  return `
WITH fs AS (
  SELECT ACCOUNT_ID, MIN(SHIP_DATE) AS first_ship
  FROM shipment GROUP BY ACCOUNT_ID
),
em AS (
  SELECT ua.ACCOUNT_ID, MIN(u.email) AS email
  FROM user_account ua JOIN app_user u ON u.ID = ua.USER_ID
  WHERE u.email IS NOT NULL AND u.email <> ''
  GROUP BY ua.ACCOUNT_ID
)
SELECT fs.ACCOUNT_ID, em.email, fs.first_ship
FROM fs JOIN em ON em.ACCOUNT_ID = fs.ACCOUNT_ID
WHERE fs.first_ship >= '${from}' AND fs.first_ship <= '${to}'
ORDER BY fs.first_ship, fs.ACCOUNT_ID`;
}

// ── Metabase ─────────────────────────────────────────────────────────────────
async function session(base) {
  if (process.env.METABASE_SESSION) return process.env.METABASE_SESSION;
  const username = process.env.METABASE_USER, password = process.env.METABASE_PASSWORD;
  if (!username || !password) die("Set METABASE_SESSION, or METABASE_USER + METABASE_PASSWORD.");
  const res = await fetch(`${base}/api/session`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) die(`Metabase login failed: ${res.status} ${await res.text()}`);
  return (await res.json()).id;
}

async function query(base, token, database, nativeSql) {
  const res = await fetch(`${base}/api/dataset`, {
    method: "POST",
    headers: { "content-type": "application/json", "X-Metabase-Session": token },
    body: JSON.stringify({ database, type: "native", native: { query: nativeSql } }),
  });
  if (!res.ok) die(`Metabase query failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  if (data.status === "failed") die(`Metabase query error: ${data.error}`);
  if (data.data.rows_truncated) die(`Result truncated at ${data.data.rows_truncated} rows — narrow the window.`);
  return data.data.rows;
}

// ── Email hashing — MUST match lib/ads.ts ────────────────────────────────────
function normalizeEmail(raw) {
  let e = String(raw).trim().toLowerCase();
  const at = e.lastIndexOf("@");
  if (at > 0) {
    const local = e.slice(0, at), domain = e.slice(at + 1);
    if (domain === "gmail.com" || domain === "googlemail.com") e = `${local.replace(/\./g, "")}@${domain}`;
  }
  return e;
}
function sha256(s) { return createHash("sha256").update(s, "utf8").digest("hex"); }

// ── Plumbing ─────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const k = a.slice(2);
    if (k === "plain") { o.plain = true; continue; }
    o[k] = argv[++i];
  }
  return o;
}
function dateWindow(a) {
  const iso = (d) => d.toISOString().slice(0, 10);
  const ok = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
  if (a.from || a.to) {
    if (!a.from || !a.to || !ok(a.from) || !ok(a.to)) die("--from and --to must both be YYYY-MM-DD.");
    return { from: a.from, to: a.to };
  }
  const days = Math.max(1, Number(a.days ?? 1));
  const end = new Date(); end.setUTCDate(end.getUTCDate() - 1);        // yesterday
  const start = new Date(end); start.setUTCDate(start.getUTCDate() - (days - 1));
  return { from: iso(start), to: iso(end) };
}
function csv(fields) {
  return fields.map((f) => {
    const s = String(f ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(",");
}
function die(msg) { process.stderr.write(`ads-first-shipment-export: ${msg}\n`); process.exit(1); }
