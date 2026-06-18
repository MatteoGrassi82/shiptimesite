// Dev screenshot helper. Usage:
//   node scripts/shoot.mjs <url> <outPath> [selector] [width] [height]
// Uses the playwright-core API with the puppeteer-cached Chromium.
import { chromium } from "playwright-core";

const [, , url, out, selector, w = "1440", h = "1600"] = process.argv;
const EXEC =
  "/Users/matteo/.cache/puppeteer/chrome/mac_arm-149.0.7827.22/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";

const browser = await chromium.launch({ executablePath: EXEC, headless: true });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1200); // let reveal/transitions settle

if (selector) {
  const el = await page.$(selector);
  if (el) {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await el.screenshot({ path: out });
  } else {
    console.error("selector not found:", selector);
    await page.screenshot({ path: out, fullPage: false });
  }
} else {
  await page.screenshot({ path: out, fullPage: false });
}
await browser.close();
console.log("shot ->", out);
