#!/usr/bin/env node
/**
 * Removes backgrounds from timeline photos and auto-crops the transparent padding
 * so the subject fills the frame. Uses @imgly/background-removal-node + sharp.
 *
 *   node scripts/remove-bg.mjs
 */

import removeBackground from "@imgly/background-removal-node";
import sharp from "sharp";
import { writeFile, readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/generated");

const KEYS = ["timeline-step-1","timeline-step-2","timeline-step-3","timeline-step-4"];
const only = (process.env.GEN_ONLY || "").split(",").map(s => s.trim()).filter(Boolean);
const queue = only.length ? KEYS.filter(k => only.includes(k)) : KEYS;

async function removeBg(name) {
  const inPath  = resolve(OUT_DIR, `${name}.png`);
  const outPath = resolve(OUT_DIR, `${name}-cutout.png`);

  // Step 1: remove background
  const imgData = await readFile(inPath);
  const blob = new Blob([imgData], { type: "image/png" });
  const result = await removeBackground(blob, {
    model: "medium",
    output: { format: "image/png", quality: 1 },
  });
  const cutoutBuf = Buffer.from(await result.arrayBuffer());

  // Step 2: find bounding box of non-transparent pixels and crop tight
  const { data, info } = await sharp(cutoutBuf).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * channels + 3];
      if (alpha > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // 3% padding around subject so edges don't clip
  const pad    = Math.round(Math.max(width, height) * 0.03);
  const left   = Math.max(0,      minX - pad);
  const top    = Math.max(0,      minY - pad);
  const cropW  = Math.min(width,  maxX + pad) - left;
  const cropH  = Math.min(height, maxY + pad) - top;

  const cropped = await sharp(cutoutBuf)
    .extract({ left, top, width: cropW, height: cropH })
    .png()
    .toBuffer();

  await writeFile(outPath, cropped);
  console.log(`  ✓ ${name}-cutout.png  (${width}x${height} → ${cropW}x${cropH})`);
}

console.log(`\nRemoving backgrounds from ${queue.length} image(s) (model: medium + auto-crop)...\n`);
for (const name of queue) {
  try { await removeBg(name); }
  catch (e) { console.error(`  ✗ ${name}: ${e.message}`); }
}
console.log("\nDone.\n");
