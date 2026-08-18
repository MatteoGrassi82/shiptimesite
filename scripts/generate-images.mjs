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

// ── Grommet co-marketing lander (/grommet) ─────────────────────
// Bespoke set so the page doesn't reuse the timeline photos that already appear
// on the comparison pages. Audience is deliberately earlier-stage than our own
// pages: Grommet brands are sub-$2M, shipping their first orders, often from a
// spare room or small studio rather than a warehouse.
const GROMMET_PHOTOS = [
  {
    key: "grommet-hero",
    size: "1024x1536",
    prompt:
      "A young founder of a brand-new small product company packing their very first customer orders " +
      "at a table in a bright home studio, a modest stack of small cardboard boxes and a roll of " +
      "packing tape beside them, quietly proud and excited. Vertical portrait composition, person " +
      "centered, warm morning light.",
  },
  {
    key: "grommet-step-1",
    size: "1024x1024",
    prompt:
      "A founder sitting on the floor of a sunlit living room with a laptop on a low table, thinking " +
      "carefully while answering a few short questions, two or three small parcels nearby, calm and unhurried.",
  },
  {
    key: "grommet-step-2",
    size: "1024x1024",
    prompt:
      "Close-up over the shoulder of a person reading a printed checklist on paper beside a laptop at a " +
      "wooden table, pen in hand, ticking items off, a small stack of shipping boxes at the edge of frame.",
  },
  {
    key: "grommet-step-3",
    size: "1024x1024",
    prompt:
      "Close-up of hands smoothing a freshly printed shipping label onto a small cardboard box on a table, " +
      "a few more finished parcels lined up ready for pickup, bright natural side light.",
  },
  {
    key: "grommet-why",
    size: "1024x1024",
    prompt:
      "A small brand owner standing beside a neat stack of outgoing parcels by a front door, arms relaxed, " +
      "smiling at the camera, looking like someone whose shipping is finally under control. Bright airy home setting.",
  },
];
for (const p of GROMMET_PHOTOS) {
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

// ── ShipTime Plus assets ────────────────────────────────────────────
// Same flat-vector STYLE (navy/orange/light-blue) as Core — the Plus zone
// evolves the current light theme rather than introducing a new palette, so
// these placeholders reuse STYLE/PHOTO_STYLE directly. Swap for on-brand
// photography later; the image fields (mediaSplit, solutionPage.heroImage,
// caseStudy.coverImage) are the same either way.
ASSETS.push(
  {
    name: "plus-hero-network",
    size: "1536x1024",
    prompt:
      "An abstract illustration of a network of connected nodes — parcels, a warehouse icon, a ship, a truck, and a document icon — all linked by clean flowing lines converging toward a single glowing central point, conveying many logistics modes orchestrated into one system.",
  },
  {
    name: "plus-phase-unify",
    size: "1024x1024",
    prompt:
      "An abstract illustration of scattered, disconnected data streams and icons (spreadsheet, warehouse, truck, document) flowing together and merging into a single unified stream, conveying fragmented systems becoming one data layer.",
  },
  {
    name: "plus-phase-intelligence",
    size: "1024x1024",
    prompt:
      "An abstract illustration of a single stream of data passing through a stylized geometric processing node that highlights and sorts specific glowing elements, conveying custom intelligence analyzing an operation and surfacing priorities.",
  },
  {
    name: "plus-phase-autopilot",
    size: "1024x1024",
    prompt:
      "An abstract illustration of parcels and documents moving smoothly along an automated conveyor-like path with no hands or people, gears subtly integrated into the line, conveying logistics workflows running by themselves in the background.",
  },
  {
    name: "plus-embedded-team",
    size: "1024x1024",
    photo: true,
    prompt:
      "Two professionals — one visiting consultant with a laptop, one warehouse operations manager — reviewing a logistics dashboard together at a warehouse office desk, collaborative and warm, shelves of parcels visible in the background.",
  },
  {
    name: "plus-fulfillment-warehouse",
    size: "1024x1024",
    prompt:
      "An abstract illustration of a warehouse cross-section showing organized shelving with parcels, a small forklift, and an outgoing conveyor belt leading to a delivery truck, conveying orchestrated fulfillment and distribution.",
  },
  {
    name: "plus-market-entry",
    size: "1024x1024",
    prompt:
      "An abstract illustration of parcels flowing along a route line that crosses a simple stylized border marker between two shaded regions, one representing the US and one Canada, conveying smooth cross-border market entry.",
  },
  {
    name: "plus-platform-multimodal",
    size: "1536x1024",
    prompt:
      "An abstract illustration showing four transport modes in one clean composition: a small parcel, an LTL pallet, a truck, and a cargo ship, arranged along a single connecting route line, conveying one platform spanning every shipping mode.",
  },
);

// ── ShipTime Plus — isometric IoT/AI logistics set ───────────────────
// The real imagery for the Plus interior-page split sections. Style derived
// from the reference isometric logistics diagram Matteo shared: 30° axonometric
// flat-vector look, ShipTime palette (light blues + navy + sparing orange),
// white ground with a faint iso grid, small orange IoT wifi arcs + dashed
// orange network lines. One asset per ImageSlot label (see plus-content.tsx /
// the coded pages). These fill public/generated/ and get wired into ImageSlot.
const ISO_STYLE =
  "Isometric vector illustration in true 30-degree axonometric projection. Flat design with smooth subtle shading on faces and soft ambient occlusion, clean thin dark-navy outline strokes — an editable-vector look, NOT a 3D render and NOT photorealistic. Pure white background with a faint light-blue isometric grid on the ground plane. Color palette STRICTLY limited to: pale sky blue #D6E6F5, light blue #8FB4DD, medium steel blue #4A6FA5, deep navy #12294A, and warm orange #EC5A26 used ONLY as a sparing accent — small orange wifi/IoT signal arcs above smart objects, thin dashed orange lines linking things into a network, and the occasional box strap or highlight. Logistics and supply-chain subject with Internet-of-Things and AI motifs. Modern, clean, trustworthy enterprise aesthetic, generous negative space, centered composition. No text, no words, no numbers, no logos, no watermark.";

const ISO = [
  { name: "plus-iso-multimodal", prompt: "A wide supply-chain network scene arranged around one central modern distribution warehouse with solar panels: a container ship, a cargo plane, a freight train, and two box trucks positioned around it, all linked by thin dashed orange network lines with small orange wifi signal arcs above them — conveying every shipping mode connected on one platform." },
  { name: "plus-iso-unify", prompt: "One central distribution warehouse hub with a small rooftop antenna emitting orange wifi arcs, surrounded by several separate source systems shown as small isometric objects — a server stack, a laptop, a delivery van, a forklift, a shopping cart — each linked to the central hub by thin dashed orange lines converging inward, conveying many fragmented systems unified into one data layer." },
  { name: "plus-iso-intelligence", prompt: "A glowing central node shaped like a small stacked server with an orange AI signal arc above it, connected by thin dashed orange lines to three alternate routes drawn between miniature warehouses, with one route clearly highlighted in orange as the best option — conveying custom AI analyzing an operation and recommending the optimal lane." },
  { name: "plus-iso-autopilot", prompt: "A scene of autonomous logistics running by itself with no human operators: two self-driving AGV robot carts carrying orange-strapped pallets, a small delivery drone with an orange signal arc above it, and a short conveyor belt moving boxes, with faint dashed orange guide lines on the floor — conveying workflows running on autopilot." },
  { name: "plus-iso-rateshop", prompt: "Four shipping options lined up left to right — a small parcel box, a stacked LTL pallet, a box truck, and a small container ship — each with a simple blank floating price-tag shape above it, the lowest tag highlighted in orange, conveying multi-carrier multimodal rate shopping." },
  { name: "plus-iso-spot", prompt: "Three delivery trucks lined up in front of a small warehouse, each with a blank floating price-tag panel above it and thin dashed orange lines connecting them to the warehouse, the lowest tag highlighted orange — conveying a freight spot-market bidding board." },
  { name: "plus-iso-analytics", prompt: "A small warehouse beside a large floating dashboard panel showing simple blank bar-chart and line-chart shapes and a small route map, with one key metric block accented in orange — conveying operational cost and lane analytics on your own data. No readable text or numbers, only abstract chart shapes." },
  { name: "plus-iso-orchestration", prompt: "A central hub server on a small platform connected by thin dashed orange lines to a surrounding ring of small isometric systems — an ERP server, a shopping-cart icon, a warehouse, a box truck, a barcode scanner, a cloud — conveying up to thirty existing systems orchestrated into one operational layer." },
  { name: "plus-iso-techlayer", prompt: "A horizontal glowing platform plane floating in the middle, with small orange AI signal nodes and abstract data-flow lines above it, and miniature warehouses and box trucks on the ground below connected up to the plane by thin dashed orange lines — conveying an intelligence layer sitting under the whole logistics operation." },
  { name: "plus-iso-dock", prompt: "A modern distribution-center building exterior with several loading-dock doors, two box trucks backed into the docks, solar panels on the flat roof, a few orange-strapped pallets on the concrete apron, and small orange wifi arcs above it — conveying a fulfillment network node." },
  { name: "plus-iso-fulfillment", prompt: "A cutaway view of a fulfillment warehouse interior: tall storage racks filled with orange-strapped boxes, a forklift lifting a pallet, a conveyor belt of boxes, and an outbound box truck at a loading dock — conveying orchestrated warehousing and fulfillment." },
  { name: "plus-iso-inventory", prompt: "Three separate warehouse buildings of different sizes connected to each other by thin dashed orange lines, each containing a visible stack of orange-strapped boxes, with a small orange circular badge floating above one — conveying one SKU tracked in sync across every location." },
];
for (const a of ISO) ASSETS.push({ ...a, size: "1536x1024", iso: true });

// ── Core "Every ShipTime Account Includes" — retro painted-backdrop portraits ──
// Style analyzed from Matteo's reference set: hyperreal studio-photo subject in
// crisp beauty lighting, composited against an OBVIOUSLY hand-painted theatrical
// backdrop (vintage photo-studio scenic canvas): airbrushed pastel gradient sky,
// flat stylized painted clouds, a thin strip of painted scenery along the bottom
// edge, tiny four-point sparkle stars. Playful, warm, kitsch-retro editorial —
// modern brand campaign meets vintage painted backdrop.
const PORTRAIT_STYLE =
  "Editorial studio close-up portrait photograph of a real person against a soft hand-painted " +
  "airbrushed pastel gradient backdrop, like a vintage photo-studio scenic canvas. The person is " +
  "photorealistic and sharp with crisp, flattering studio beauty lighting; the background is clearly " +
  "a smooth retro airbrushed painting with soft pastel color bands, optionally a faint flat painted " +
  "cloud or a tiny four-point sparkle star. Playful, warm, slightly kitsch retro editorial vibe. " +
  "Subject wears solid-colored wardrobe that complements the backdrop. Relaxed head-and-shoulders / " +
  "chest-up medium portrait with comfortable headroom above the head and visible shoulders — NOT a " +
  "tight face-filling crop; leave calm negative space around the subject so the painted backdrop reads. " +
  "Shot on a short portrait lens, shallow depth of field. Vertical portrait orientation. No text, no logos, no watermarks.";

const INCLUDE_PORTRAITS = [
  {
    name: "core-include-rate",
    prompt:
      "Tight face-filling close-up of a confident woman small-business owner in a rust-orange blouse, warm " +
      "genuine smile. Backdrop: airbrushed sunset gradient from soft sky blue at the top through candy pink " +
      "to a warm orange-yellow glow.",
  },
  {
    name: "core-include-byor",
    prompt:
      "Close-up of a bearded man in a navy denim work apron over a white tee, relaxed proud expression. " +
      "Backdrop: airbrushed gradient from pale light blue at the top to soft peach at the bottom, one faint " +
      "flat painted cloud.",
  },
  {
    name: "core-include-pickup",
    prompt:
      "Close-up of a friendly courier in a mustard-yellow tee and matching mustard canvas cap, cheerful open " +
      "smile. Backdrop: airbrushed gradient from minty green at the top through soft pink to pale yellow, one " +
      "tiny four-point sparkle star.",
  },
  {
    name: "core-include-audit",
    prompt:
      "Close-up of a woman in a bold red turtleneck looking pleasantly surprised, eyebrows raised with a " +
      "slight smile. Backdrop: saturated periwinkle-purple airbrushed sky with one flat white stylized " +
      "painted cloud and a tiny sparkle star.",
  },
  {
    name: "core-include-tracking",
    prompt:
      "Tight face-filling close-up of a person in a fuchsia-magenta shirt with a satisfied smile. Backdrop: " +
      "airbrushed dawn gradient from soft blue at the top through pink bands to pale yellow.",
  },
  {
    name: "core-include-freight",
    prompt:
      "Close-up of a warehouse worker in a clean orange hi-vis vest over a navy tee, confident easy smile. " +
      "Backdrop: airbrushed dusk gradient from deep navy blue at the top through violet to a warm " +
      "amber-orange glow, one tiny sparkle star.",
  },
];
for (const p of INCLUDE_PORTRAITS) ASSETS.push({ ...p, size: "1024x1536", portrait: true });

// ── ShipTime Plus v3 — humanity pass (Retell-inspired sections) ─────────────
// Two photo moments for /plus/v3: the "Designed by people" serif interlude tile
// and the photo-backed LPS closing card. plus-embedded-team.png (already
// generated) covers the operators split band.
ASSETS.push(
  {
    name: "plus-people-portrait",
    size: "1024x1024",
    raw: true,
    prompt:
      "Bright abstract editorial portrait photograph, light and airy: the soft-focus blurred silhouette of " +
      "a person in profile, no identifiable facial features, against a warm off-white and pale sky-blue " +
      "gradient background, a gentle glow of warm orange light falling across one side of the figure, " +
      "dreamy high-key look, light film grain, quiet and human, high-end brand campaign aesthetic. " +
      "Square composition, figure centered. No text, no logos, no watermarks.",
  },
  {
    name: "plus-cta-operator",
    size: "1536x1024",
    raw: true,
    prompt:
      "Bright editorial photograph, light and airy, in the style of a modern tech company website hero: " +
      "a logistics operations manager on a phone call standing by a large window in a daylight warehouse " +
      "office, relaxed and candid, soft warm morning light, muted natural palette with a gentle warm orange " +
      "accent, light film grain, shallow depth of field, real person, not posed at camera. Subject occupies " +
      "the LEFT half of the frame; the right half is bright, soft, out-of-focus calm negative space. " +
      "No text, no logos, no watermarks.",
  },
  {
    name: "plus-ops-team",
    size: "1024x1024",
    raw: true,
    prompt:
      "Bright editorial photograph, light and airy: two logistics colleagues leaning over a laptop at a desk " +
      "by a large window in a modern warehouse office, morning daylight, reviewing a plan together, one " +
      "pointing at the screen, candid and warm, real people, not posed at camera, soft natural tones with " +
      "warm highlights, light film grain, shallow depth of field. High-end brand campaign aesthetic. " +
      "Square composition. No text, no logos, no watermarks.",
  },
);

// ── ShipTime Plus v3 — "Who we're for" Shopify-style audience cards ─────────
// One light editorial photo per customer type from Michael's brief.
ASSETS.push(
  {
    name: "plus-aud-growing",
    size: "1536x1024",
    raw: true,
    prompt:
      "Bright editorial photograph, light and airy: a small e-commerce team in a sunlit packing studio " +
      "working through a surge of orders — one person taping a box, stacks of plain kraft cardboard boxes " +
      "on a long table, soft morning light, candid motion, warm natural tones, light film grain, shallow " +
      "depth of field, real people, not posed. No text, no logos, no watermarks.",
  },
  {
    name: "plus-aud-growth",
    size: "1536x1024",
    raw: true,
    prompt:
      "Bright editorial photograph, light and airy: a founder and an operations lead walking through a " +
      "large, mostly empty modern warehouse space they are about to expand into, one holding a tablet, " +
      "gesturing at the racking, big daylight windows, warm natural tones, light film grain, shallow depth " +
      "of field, candid, not posed. No text, no logos, no watermarks.",
  },
  {
    name: "plus-aud-profit",
    size: "1536x1024",
    raw: true,
    prompt:
      "Bright editorial photograph, light and airy: a business owner at a clean desk by a window reviewing " +
      "numbers on a laptop, calm and confident, a few parcels stacked neatly beside the desk, soft warm " +
      "daylight, muted natural palette, light film grain, shallow depth of field, candid, not posed at " +
      "camera. No text, no logos, no watermarks.",
  },
);

// Model + default quality. Default is gpt-image-1 at medium quality to keep
// costs down (Matteo's call, 2026-07-11). For hero/marketing shots that need
// better composition control, override per run:
//   GEN_MODEL=gpt-image-2 GEN_QUALITY=high npm run gen:images
const MODEL = process.env.GEN_MODEL || "gpt-image-1";
const DEFAULT_QUALITY = process.env.GEN_QUALITY || "medium";

async function generateOne({ name, size, prompt, photo, sceneStyle, iso, portrait, raw, quality }) {
  // raw: the prompt carries its own complete style — no shared prefix.
  const stylePrefix = raw ? "" : portrait ? PORTRAIT_STYLE : iso ? ISO_STYLE : sceneStyle ? SCENE_STYLE : photo ? PHOTO_STYLE : STYLE;
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
