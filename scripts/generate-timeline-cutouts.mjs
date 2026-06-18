#!/usr/bin/env node
/**
 * Regenerates timeline step images with transparent backgrounds using gpt-image-2.
 * Output: public/generated/timeline-step-N-cutout.png (RGBA PNG)
 *
 *   OPENAI_API_KEY=sk-... node scripts/generate-timeline-cutouts.mjs
 */

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/generated");

async function loadEnvLocal() {
  const envPath = resolve(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  const raw = await readFile(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (!(key in process.env)) process.env[key] = val;
  }
}

// Transparent-background style: person only, no scene/environment
const CUTOUT_STYLE =
  "Professional studio photograph, pure transparent background (no backdrop, no floor, no shadow), " +
  "person centred in frame, clean edges for compositing. No background objects, no environment. " +
  "Warm natural skin tones, soft studio lighting. PNG with alpha transparency.";

const PHOTOS = [
  { key: "timeline-step-1-cutout", prompt: "A smiling small business owner woman in casual clothing, looking at camera, relaxed confident pose, waist-up portrait." },
  { key: "timeline-step-2-cutout", prompt: "A warehouse or logistics professional man in smart-casual clothing, confident expression, arms lightly crossed, waist-up portrait." },
  { key: "timeline-step-3-cutout", prompt: "A person's hands and upper body holding a shipping label over a cardboard box, focused downward, business casual top." },
  { key: "timeline-step-4-cutout", prompt: "A business owner woman smiling at camera, leaning slightly back, relaxed and satisfied expression, smart casual outfit, waist-up portrait." },
];

const only = (process.env.GEN_ONLY || "").split(",").map(s => s.trim()).filter(Boolean);
const queue = only.length ? PHOTOS.filter(p => only.includes(p.key)) : PHOTOS;

async function generateOne({ key, prompt }) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: "gpt-image-2",
      prompt: `${CUTOUT_STYLE}\n\n${prompt}`,
      size: "1024x1024",
      quality: "high",
      background: "transparent",
      n: 1,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error for "${key}" (${res.status}): ${err}`);
  }

  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error(`No image returned for "${key}"`);

  await writeFile(resolve(OUT_DIR, `${key}.png`), Buffer.from(b64, "base64"));
  console.log(`  ✓ ${key}.png`);
}

async function main() {
  await loadEnvLocal();
  if (!process.env.OPENAI_API_KEY) { console.error("✗ OPENAI_API_KEY not set"); process.exit(1); }
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`\nGenerating ${queue.length} cutout image(s) with transparent backgrounds...\n`);
  for (const p of queue) {
    try { await generateOne(p); }
    catch (e) { console.error(`  ✗ ${p.key}: ${e.message}`); }
  }
  console.log("\nDone.\n");
}

main().catch(e => { console.error(e); process.exit(1); });
