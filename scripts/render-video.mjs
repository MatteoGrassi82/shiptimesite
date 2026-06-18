#!/usr/bin/env node
/**
 * Render the ShipTime Remotion composition(s) to MP4 in public/generated/.
 *
 *   npm run gen:video
 *
 * This is a BUILD-TIME tool. The output MP4 is a static asset you commit and
 * reference with a normal <video> tag — nothing renders at runtime.
 *
 * Pass a composition id to render just one (defaults to RateShoppingDemo):
 *   node scripts/render-video.mjs RateShoppingDemo
 */

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { resolve, dirname } from "node:path";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/generated");

const compositionId = process.argv[2] || "RateShoppingDemo";

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  console.log("\nBundling Remotion project ...");
  const serveUrl = await bundle({
    entryPoint: resolve(ROOT, "remotion/index.ts"),
    // Inherit the project's webpack/Tailwind setup is not needed here; the
    // compositions are self-contained with inline styles.
  });

  console.log(`Selecting composition "${compositionId}" ...`);
  const composition = await selectComposition({ serveUrl, id: compositionId });

  const outPath = resolve(OUT_DIR, `${compositionId}.mp4`);
  console.log(`Rendering -> public/generated/${compositionId}.mp4 ...`);

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: outPath,
    onProgress: ({ progress }) => {
      process.stdout.write(`\r  ${Math.round(progress * 100)}%   `);
    },
  });

  console.log(`\n\nDone. Commit public/generated/${compositionId}.mp4 to use it.\n`);
}

main().catch((e) => {
  console.error("\n✗ Render failed:", e);
  process.exit(1);
});
