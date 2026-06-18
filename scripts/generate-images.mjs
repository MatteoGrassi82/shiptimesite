#!/usr/bin/env node
/**
 * One-off image generation for ShipTime landing assets.
 *
 *   OPENAI_API_KEY=sk-... node scripts/generate-images.mjs
 *   (or put the key in .env.local and run `npm run gen:images`)
 *
 * Writes PNGs to public/generated/. This is a BUILD-TIME tool — never call the
 * image API at runtime / per request. Re-run it only when you want to refresh
 * the assets, then commit the resulting PNGs.
 *
 * Uses the OpenAI Images API (gpt-image-1) over plain fetch, so there is no SDK
 * dependency to install.
 */

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/generated");

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

// ── Brand-consistent style prefix applied to every prompt ──────
// ShipTime palette: navy #1C1E3D, orange #EC5A26, light blue #E3EEFC, near-white #F8FAFB.
const STYLE =
  "Clean modern flat vector illustration, soft geometric shapes, generous negative space, " +
  "logistics and shipping theme. Color palette: deep navy #1C1E3D, warm orange #EC5A26 as a " +
  "sparing accent, soft light blue #E3EEFC, off-white #F8FAFB background. No text, no words, " +
  "no logos, no watermark. Subtle, professional, trustworthy SaaS aesthetic.";

// Edit this list to control what gets generated.
const ASSETS = [
  {
    name: "hero-illustration",
    size: "1536x1024",
    prompt:
      "A simple illustration of parcels and a delivery truck moving smoothly along a clean route line, " +
      "conveying effortless multi-carrier shipping on one platform.",
  },
  {
    name: "feature-rate-shopping",
    size: "1024x1024",
    prompt:
      "An abstract illustration of comparing shipping rates: a few stylized price tags or rate cards side by side " +
      "with one highlighted as the best option, suggesting smart rate comparison.",
  },
  {
    name: "feature-one-platform",
    size: "1024x1024",
    prompt:
      "An illustration of a single dashboard screen bringing together parcel, freight, and tracking, " +
      "conveying one unified shipping platform.",
  },
  {
    name: "feature-billing-visibility",
    size: "1024x1024",
    prompt:
      "An illustration of a single clean invoice document with a small upward analytics chart beside it, " +
      "conveying unified billing and clear shipping visibility.",
  },
];

// Photo-realistic style for the Deel-style /vs/ pages (lifestyle shots).
const PHOTO_STYLE =
  "Professional lifestyle photograph, bright natural lighting, warm and modern, shallow depth of field. " +
  "Small business / e-commerce setting. Subtle warm orange and soft blue tones in the scene. " +
  "No text, no logos, no watermarks, no screens with readable UI.";

// Per-competitor /vs/ photos. The component looks for files named
// `<slug>-vs-hero.png`, `<slug>-vs-reason-1.png`, `<slug>-vs-reason-2.png`.
const VS_SLUGS = ["freightcom", "shipstation", "stallion-express"];
const VS_PHOTOS = [
  { key: "vs-hero", size: "1536x1024", prompt: "A small business owner packing parcels at a tidy desk with a laptop, looking confident and relaxed." },
  { key: "vs-reason-1", size: "1024x1024", prompt: "A person at a home office reviewing shipping options on a laptop, calm and focused, parcels nearby." },
  { key: "vs-reason-2", size: "1024x1024", prompt: "Two coworkers in a bright warehouse-office reviewing shipping paperwork together, smiling." },
];

for (const slug of VS_SLUGS) {
  for (const p of VS_PHOTOS) {
    ASSETS.push({ name: `${slug}-${p.key}`, size: p.size, prompt: p.prompt, photo: true });
  }
}

// Timeline step photos — same photo style as vs-page reason images.
const TIMELINE_PHOTOS = [
  { key: "timeline-step-1", size: "1024x1024", prompt: "A small business owner sitting at a tidy desk smiling while setting up an account on a laptop, a few parcels stacked beside them, bright airy room." },
  { key: "timeline-step-2", size: "1024x1024", prompt: "A warehouse operations person at a desk connecting carrier accounts on a laptop, shelves of neatly stacked packages visible behind them, confident expression." },
  { key: "timeline-step-3", size: "1024x1024", prompt: "Close-up of a person's hands peeling a printed shipping label and applying it to a cardboard box on a table, more packages ready in the background." },
  { key: "timeline-step-4", size: "1024x1024", prompt: "A business owner leaning back in their chair smiling at a laptop showing a clean analytics dashboard, coffee cup nearby, organised home office setting." },
];
for (const p of TIMELINE_PHOTOS) {
  ASSETS.push({ name: p.key, size: p.size, prompt: p.prompt, photo: true });
}

// Hero photo for the /alternative pages (classic text-left / photo-right hero).
// Portrait orientation to suit the tall hero card.
ASSETS.push({
  name: "alt-hero",
  size: "1024x1536",
  photo: true,
  prompt:
    "A small business owner sitting at a clean white table working on a laptop in a bright, airy kitchen, " +
    "a potted green plant in the foreground, relaxed and focused, holding a card in one hand. " +
    "Vertical portrait composition with the person centered.",
});

// ── Illustrated landscape scenes (painterly, full-width) ──────────────────────
// Style matching the "illustrated building landscape" sections from the reference site:
// warm painterly illustration, flat but atmospheric, logistics/warehouse setting.
const SCENE_STYLE =
  "Painterly digital illustration in the style of a modern tech company hero background. " +
  "Rich layered landscape with atmospheric depth: distant mountains or hills, painterly sky with soft clouds, " +
  "lush stylized foliage and greenery in the foreground and midground, " +
  "a logistics warehouse or distribution center building sits centrally in the scene. " +
  "Artistic brushstroke textures on terrain and vegetation. Cinematic wide format. " +
  "Color palette: sky fades from near-white or very light at the very top to warm mid-tones, " +
  "navy #1C1E3D and orange #EC5A26 accents on the building, rich greens and earth tones for landscape. " +
  "Style references: Firewatch game art, Alto's Odyssey, modern SaaS hero illustrations. " +
  "No text, no logos, no watermarks. Very wide 3:2 panoramic landscape.";

ASSETS.push({
  name: "scene-divider",
  size: "1536x1024",
  prompt:
    "Painterly panoramic illustration. A large modern logistics warehouse building sits center-frame, " +
    "navy blue facade with an orange stripe accent along the roofline, solar panels on the flat roof, " +
    "several loading bay doors with warm interior glow visible. " +
    "Behind the building: dramatic layered hills or low mountains fading into a deep navy night sky with soft stars. " +
    "Foreground: stylized dark foliage, shrubs, and a wide concrete apron with two orange delivery trucks. " +
    "Midground: painted rolling hills in muted navy and indigo tones. " +
    "Sky: deep navy at top transitioning to dark indigo near horizon, soft atmospheric haze. " +
    "Art style: painterly digital illustration with visible brushstroke texture, layered atmospheric depth, " +
    "rich color gradients — like Firewatch or a modern startup hero illustration. Not photorealistic.",
  sceneStyle: true,
});

ASSETS.push({
  name: "scene-cta",
  size: "1536x1024",
  prompt:
    "Painterly panoramic illustration. A modern logistics distribution center building sits center-frame, " +
    "navy blue facade with orange accent stripes, solar panels on roof, loading bays open with warm amber glow inside. " +
    "Behind the building: lush painted green mountains or rolling hills under a soft daytime sky — " +
    "sky is very light, near-white or pale blue-white at the very top, fading to warm peach tones near horizon. " +
    "Foreground: rich stylized tropical or lush green foliage, cacti or shrubs, warm sandy ground. " +
    "A forklift and stacked boxes visible near the building entrance. " +
    "Overall palette: bright airy sky at top (light enough for dark text to sit above it), " +
    "vivid greens in landscape, navy and orange on building. " +
    "Art style: painterly digital illustration with brushstroke texture and layered depth — " +
    "like the Firewatch game poster or a modern SaaS website hero background. Not photorealistic.",
  sceneStyle: true,
});

// Model + default quality. gpt-image-2 is the latest (better composition control
// and quality). `quality` is the biggest lever: "high" for hero/marketing photos.
const MODEL = process.env.GEN_MODEL || "gpt-image-2";
const DEFAULT_QUALITY = process.env.GEN_QUALITY || "high";

async function generateOne({ name, size, prompt, photo, sceneStyle, quality }) {
  const stylePrefix = sceneStyle ? SCENE_STYLE : photo ? PHOTO_STYLE : STYLE;
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: `${stylePrefix}\n\n${prompt}`,
      size,
      quality: quality || DEFAULT_QUALITY,
      n: 1,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error for "${name}" (${res.status}): ${err}`);
  }

  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error(`No image returned for "${name}"`);

  const outPath = resolve(OUT_DIR, `${name}.png`);
  await writeFile(outPath, Buffer.from(b64, "base64"));
  console.log(`  ✓ ${name}.png  (${size})`);
}

async function main() {
  await loadEnvLocal();

  if (!process.env.OPENAI_API_KEY) {
    console.error(
      "\n✗ OPENAI_API_KEY is not set.\n" +
        "  Add it to .env.local (OPENAI_API_KEY=sk-...) or pass it inline:\n" +
        "  OPENAI_API_KEY=sk-... npm run gen:images\n"
    );
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });

  // Optional filter: GEN_ONLY=alt-hero,feature-rate-shopping limits generation
  // to those asset names (handy for trials or re-rendering a single image).
  const only = (process.env.GEN_ONLY || "").split(",").map((s) => s.trim()).filter(Boolean);
  const queue = only.length ? ASSETS.filter((a) => only.includes(a.name)) : ASSETS;

  if (only.length && queue.length === 0) {
    console.error(`\n✗ GEN_ONLY matched no assets. Known names:\n  ${ASSETS.map((a) => a.name).join("\n  ")}\n`);
    process.exit(1);
  }

  console.log(`\nGenerating ${queue.length} image(s) with ${MODEL} (quality: ${DEFAULT_QUALITY}) into public/generated/ ...`);

  for (const asset of queue) {
    try {
      await generateOne(asset);
    } catch (e) {
      console.error(`  ✗ ${asset.name}: ${e.message}`);
    }
  }

  console.log("\nDone. Commit the PNGs in public/generated/ to use them.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
