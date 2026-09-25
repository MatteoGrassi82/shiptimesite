#!/usr/bin/env node
// Builds the static dotted map used on /parcelforum ("Find us at the show").
//
// A map, not a photograph, on purpose. The section answers "where is the show",
// and image models get geography and place labels wrong in ways that are hard to
// spot and embarrassing on a page a QR code points at. dotted-map draws from real
// coordinates, so Florida is where Florida is. It was already a dependency here
// and had never been used.
//
// Output is a committed .svg referenced with <img>, rather than inline markup:
// ~1,400 dots is a lot of DOM to put in the HTML of every request, and as a file
// it caches and stays out of the document.
//
// Venue: PARCEL Forum '26 is in Orlando — from the organiser's own email (Ken
// Waddell, RB Publishing, 2026-08-28: "PARCEL Forum '26 Orlando"). The specific
// hall was never named in any thread, so the map pins the city and the page says
// "Orlando, Florida" and nothing more precise than that.
//
//   node scripts/generate-map.mjs

import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import DottedMap from "dotted-map";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../public/generated/pf-map-orlando.svg");

const ORLANDO = { lat: 28.5384, lng: -81.3789 };
const DOT = "#C9CEDA";      // neutral land dots, reads on the #F3F4F7 panel
const ACCENT = "#EC5A26";   // ShipTime orange, the 10% accent

const map = new DottedMap({
  height: 30,               // ~1,400 dots: the coastline still reads, the file stays small
  grid: "diagonal",
  region: { lat: { min: 24.2, max: 49.8 }, lng: { min: -125.0, max: -66.5 } },
});

map.addPin({ lat: ORLANDO.lat, lng: ORLANDO.lng, svgOptions: { color: ACCENT, radius: 0.62 } });
const pin = map.getPin(ORLANDO);
if (!pin) throw new Error("Orlando fell outside the rendered region");

let svg = map.getSVG({ radius: 0.24, color: DOT, shape: "circle", backgroundColor: "transparent" });

// A halo behind the pin so the eye lands on it immediately. Injected after
// generation because dotted-map only draws the grid and its pins.
const halo =
  `<circle cx="${pin.x}" cy="${pin.y}" r="2.6" fill="${ACCENT}" opacity="0.13"/>` +
  `<circle cx="${pin.x}" cy="${pin.y}" r="1.5" fill="${ACCENT}" opacity="0.22"/>`;
const at = svg.indexOf(">", svg.indexOf("<svg")) + 1;
svg = svg.slice(0, at) + halo + svg.slice(at);

// dotted-map emits full float precision; two decimals is well under one device
// pixel at any size this renders at, and cuts the file by about a fifth.
svg = svg.replace(/\d+\.\d{3,}/g, (s) => String(+(+s).toFixed(2)));

await writeFile(OUT, svg);
const dots = (svg.match(/<circle/g) || []).length;
console.log(`✓ pf-map-orlando.svg  ${dots} dots  ${(svg.length / 1024).toFixed(0)}KB  pin at ${pin.x},${pin.y}`);
