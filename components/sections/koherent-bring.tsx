"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { CITY_POINTS, US_STATES, VIEWBOX } from "@/components/console/geo-data";
import { C, CHEV, K_ARROW, K_BAR, mono, sans, title, useInView, useReducedMotion } from "./koherent-motion";

// ── BringBento — "What we bring" ─────────────────────────────────────────────
// Michael's six building blocks, in his order, as one grid. Matteo picked the
// bento on Oct 23 out of three ideas on /koherent/lab, then asked for a map, a
// discounted rate and photos with the chevrons. The arrowhead frame stays out
// of this section, because How we work right below has it.
//   - Warehouses: the /dashboard Sites map for its example account, with the
//     same reach calculation, so the numbers agree with the dashboard.
//   - Rates: the buying power behind them, the 2M+ shipments a year. No
//     discount percentages until we have real ones for this audience.
//   - The three stats sit in the tiles they prove.
// The two photos were made for these tiles (koherent-bring-* in
// scripts/generate-images.mjs, Oct 23) and are AI placeholders until our own
// shoot, like the hero's and People's. Carrier, integration and Shiplet names
// are the ones the Plus pages already use; the order and the messages are
// labelled as examples.

type Key = "carriers" | "rates" | "warehouses" | "integrations" | "shiplets" | "people";
const B: Record<Key, { title: string; body: string; tag?: string }> = {
  carriers: { title: "Integrated carriers", body: "Couriers, regional carriers, LTL, FTL and ocean, compared on every shipment for cost and speed." },
  rates: { title: "Discounted rates", body: "Our buying power, passed through to you. Or bring your own rates and we'll use those too." },
  warehouses: { title: "A warehouse network", body: "Certified partner warehouses in Canada and the US. We don't own them; we pick the right ones for you." },
  integrations: { title: "The integration library", body: "Shopify, Amazon, NetSuite, QuickBooks and 30 more. It plugs into what you already run." },
  shiplets: { title: "Shiplets", body: "Small custom apps for the one workflow that's yours alone, built in days on the same platform.", tag: "Rolling out" },
  people: { title: "People and support", body: "Experienced operators and a support team that knows your account. Calls, texts and email." },
};

// CSS custom properties in a style object
const vars = (o: Record<string, string>) => o as CSSProperties;

// ── the map: same calculation as components/console/Sites.tsx ───────────────
// Ground days by distance from the nearest site (a planning estimate, not a
// carrier promise), reach weighted by where people live.
const rad = (x: number) => (x * Math.PI) / 180;
const miles = (a: [number, number], b: [number, number]) => {
  const h = Math.sin(rad(b[0] - a[0]) / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(rad(b[1] - a[1]) / 2) ** 2;
  return 2 * 3958.8 * Math.asin(Math.sqrt(h));
};
const groundDays = (mi: number) => (mi < 300 ? 1 : mi < 650 ? 2 : mi < 1100 ? 3 : mi < 1700 ? 4 : 5);
const daysFrom = (sites: string[]) =>
  Object.fromEntries(
    US_STATES.map((s) => [
      s.code,
      Math.min(...sites.map((n) => groundDays(miles([CITY_POINTS[n].lat, CITY_POINTS[n].lon], [s.lat, s.lon])))) + (s.code === "AK" || s.code === "HI" ? 2 : 0),
    ]),
  );
const POP = US_STATES.reduce((a, s) => a + s.pop, 0);
const MAP_STEPS = [
  { label: "Columbus", sites: ["Columbus"] },
  { label: "+ Reno", sites: ["Columbus", "Reno"] },
  { label: "+ Atlanta", sites: ["Columbus", "Reno", "Atlanta"] },
].map((m) => {
  const days = daysFrom(m.sites);
  return { ...m, days, reach: Math.round((US_STATES.reduce((a, s) => a + (days[s.code] <= 2 ? s.pop : 0), 0) / POP) * 100) };
});
// east: on a phone the label sits left of the pin, or it runs off the tile
const PINS = [
  { name: "Columbus", label: "Columbus, OH", kind: "own", east: true },
  { name: "Reno", label: "Reno, NV", kind: "partner", east: false },
  { name: "Atlanta", label: "Atlanta, GA · Nov 25", kind: "planned", east: true },
] as const;
const RAMP = [C.plum, C.violet, C.lilac, "#E2D6EE", C.mist]; // 1, 2, 3, 4, 5+ days
const [VB_W, VB_H] = VIEWBOX.split(" ").slice(2).map(Number);

// Eases a shown number toward its target whenever the target changes.
function useTween(target: number, ms = 650) {
  const [v, setV] = useState(target);
  const last = useRef(target);
  useEffect(() => {
    const from = last.current;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      last.current = from + (target - from) * (1 - Math.pow(1 - k, 3));
      setV(last.current);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function NetworkMap() {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const [step, setStep] = useState(1);
  const [auto, setAuto] = useState(true);

  // The first time it's on screen: one site, then two, then the planned third.
  useEffect(() => {
    if (reduced || !auto || !inView) return;
    const ids = [0, 1, 2].map((n) => window.setTimeout(() => setStep(n), 200 + n * 1600));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [reduced, auto, inView]);

  const m = MAP_STEPS[step];
  const reach = useTween(m.reach);
  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
        <div>
          <div style={{ ...mono, fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: C.stone }}>2-day reach · example network</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
            <span style={{ ...mono, fontSize: "clamp(2.2rem, 3.6vw, 2.9rem)", fontWeight: 500, lineHeight: 1, color: C.plum, fontVariantNumeric: "tabular-nums" }}>{Math.round(reach)}%</span>
            <span style={{ ...sans, fontSize: 14, color: C.stone }}>of US customers</span>
          </div>
        </div>
        <div role="group" aria-label="Sites in the network" style={{ display: "inline-flex", background: C.mist, borderRadius: 999, padding: 3 }}>
          {MAP_STEPS.map((s, i) => (
            <button
              key={s.label}
              type="button"
              aria-pressed={i === step}
              onClick={() => {
                setAuto(false);
                setStep(i);
              }}
              className="kb-seg"
              style={{ ...sans, cursor: "pointer", border: "none", borderRadius: 999, padding: "7px 13px", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", color: i === step ? C.paper : C.ink, background: i === step ? C.plum : "transparent", transition: "background .25s ease, color .25s ease" }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <svg viewBox={VIEWBOX} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label={`From ${m.sites.join(", ")}, ${m.reach}% of US customers are within 2 days by ground.`}>
          {US_STATES.map((s) => (
            <path key={s.code} d={s.d} fill={RAMP[Math.min(m.days[s.code], 5) - 1]} stroke={C.card} strokeWidth={1} style={{ transition: "fill .6s ease" }} />
          ))}
          {PINS.map((p) => {
            const [x, y] = CITY_POINTS[p.name].xy;
            const own = p.kind === "own";
            return (
              <g key={p.name} transform={`translate(${x} ${y})`} opacity={m.sites.includes(p.name) ? 1 : 0} style={{ transition: "opacity .4s ease" }}>
                <circle r={own ? 11 : 10} fill={own ? C.ink : C.card} stroke={own ? C.card : C.ink} strokeWidth={3} strokeDasharray={p.kind === "planned" ? "4 3" : undefined} />
              </g>
            );
          })}
        </svg>
        {/* labels in HTML, so they stay readable at phone size */}
        {PINS.map((p) => {
          const [x, y] = CITY_POINTS[p.name].xy;
          return (
            <span key={p.name} className={`kb-pin${p.east ? " kb-pin-east" : ""}`} aria-hidden style={{ ...sans, position: "absolute", left: `${(x / VB_W) * 100}%`, top: `${(y / VB_H) * 100}%`, transform: "translate(14px, -50%)", fontSize: 12.5, fontWeight: 700, color: C.ink, background: "rgba(255,253,250,0.92)", borderRadius: 4, padding: "2px 7px", whiteSpace: "nowrap", opacity: m.sites.includes(p.name) ? 1 : 0, transition: "opacity .4s ease" }}>
              {p.label}
            </span>
          );
        })}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px 16px" }}>
        <span style={{ display: "inline-flex", flexWrap: "wrap", gap: "6px 12px", ...mono, fontSize: 10.5, color: C.stone }}>
          {["1 day", "2 days", "3", "4", "5+"].map((l, i) => (
            <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: RAMP[i], border: i === 4 ? `1px solid ${C.line}` : "none" }} />
              {l}
            </span>
          ))}
        </span>
        <span style={{ ...mono, fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", color: C.stone }}>Alder &amp; Stone · days estimated from distance</span>
      </div>
    </div>
  );
}

// ── tiles ────────────────────────────────────────────────────────────────────
type Tone = "card" | "plum" | "ink" | "mist";
const TONE: Record<Tone, { bg: string; dark: boolean }> = {
  card: { bg: C.card, dark: false },
  plum: { bg: C.plum, dark: true },
  ink: { bg: C.ink, dark: true },
  mist: { bg: C.mist, dark: false },
};

function Tag({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span style={{ ...mono, fontSize: 10.5, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: dark ? C.ink : C.plum, background: dark ? C.lilac : C.card, border: dark ? "none" : `1px solid ${C.line}`, borderRadius: 999, padding: "4px 9px", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

// No tile numbers: on the grid they read 03, 01, 06…, right under the
// section's own label.
function TileHead({ k, dark = false }: { k: Key; dark?: boolean }) {
  const b = B[k];
  return (
    <div>
      <h3 style={{ ...title, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, fontSize: "1.35rem", color: dark ? C.onDark : C.ink, margin: 0 }}>
        {b.title}
        {b.tag && <Tag dark={dark}>{b.tag}</Tag>}
      </h3>
      <p style={{ ...sans, fontSize: 15, lineHeight: 1.55, color: dark ? C.onDarkDim : C.stone, margin: "6px 0 0", maxWidth: "44ch" }}>{b.body}</p>
    </div>
  );
}

function Stat({ value, label, dark = false }: { value: string; label: string; dark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
      <span style={{ ...mono, fontSize: "clamp(2rem, 3vw, 2.5rem)", fontWeight: 500, lineHeight: 1, color: dark ? C.onDark : C.plum }}>{value}</span>
      <span style={{ ...sans, fontSize: 14, lineHeight: 1.4, color: dark ? C.lilac : C.stone }}>{label}</span>
    </div>
  );
}

// Each tile plays when it reaches the screen, not when the grid does: the grid
// is taller than a screen.
function useTileIn() {
  const { ref, armed, inView } = useInView<HTMLDivElement>(0.25);
  return { ref, cls: `kb-tile${armed ? " armed" : ""}${inView ? " is-in" : ""}` };
}

function Tile({ area, tone = "card", delay, children, className = "" }: { area: string; tone?: Tone; delay: number; children: ReactNode; className?: string }) {
  const t = TONE[tone];
  const { ref, cls } = useTileIn();
  return (
    <div ref={ref} data-k-dark={t.dark ? "" : undefined} className={`${cls} ${className}`} style={{ gridArea: area, position: "relative", overflow: "hidden", background: t.bg, border: `1px solid ${t.dark ? t.bg : C.line}`, borderRadius: 8, padding: 24, display: "flex", flexDirection: "column", gap: 20, textAlign: "left", ...vars({ "--d": `${delay}ms` }) }}>
      {children}
    </div>
  );
}

// The brand's steps over a photo: they come in once, left to right, then stop.
function PhotoChevrons({ size, style }: { size: number; style: CSSProperties }) {
  return (
    <div aria-hidden style={{ position: "absolute", display: "flex", gap: size * 0.14, pointerEvents: "none", ...style }}>
      {[C.lilac, C.violet, C.plum].map((f, i) => (
        <svg key={f} className="kb-chev" viewBox="0 0 8 12" style={{ width: size * 0.67, height: size, ...vars({ "--i": `${i * 120}ms` }) }}>
          <path d={CHEV} fill={f} />
        </svg>
      ))}
    </div>
  );
}

// credit: the deck's rule for photos (slide 28): operators always with their
// name, partner sites always credited. Until our own shoot the photos are AI
// placeholders, so the credit says so instead of showing [brackets].
function PhotoTile({ area, delay, src, focus, shade, chevrons, credit, className = "", children }: { area: string; delay: number; src: string; focus: string; shade: string; chevrons: { size: number; style: CSSProperties }; credit: string; className?: string; children: ReactNode }) {
  const { ref, cls } = useTileIn();
  return (
    <div ref={ref} data-k-dark="" className={`${cls} kb-photo ${className}`} style={{ gridArea: area, position: "relative", overflow: "hidden", background: C.ink, borderRadius: 8, textAlign: "left", ...vars({ "--d": `${delay}ms` }) }}>
      <div className="kb-media" style={{ position: "absolute", inset: 0 }}>
        <img className="kb-img" src={src} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: focus }} />
        <div className="kb-shade" aria-hidden style={{ position: "absolute", inset: 0, background: shade }} />
        <PhotoChevrons {...chevrons} />
        <span style={{ ...mono, position: "absolute", left: 22, top: 24, maxWidth: "calc(100% - 180px)", fontSize: 10.5, lineHeight: 1.4, letterSpacing: "0.04em", color: C.onDark, background: "rgba(23,16,28,0.55)", borderRadius: 8, padding: "5px 10px" }}>
          {credit}
        </span>
      </div>
      <div className="kb-body" style={{ position: "relative", zIndex: 1, height: "100%", boxSizing: "border-box", padding: 24, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 18 }}>
        {children}
      </div>
    </div>
  );
}

// Cheapest service that still arrives in time wins; relative cost, no prices.
function RateCard() {
  const rows: { name: string; days: string; cost: number; note?: string; picked?: boolean; out?: boolean }[] = [
    { name: "Regional carrier", days: "2 days", cost: 58, note: "Picked", picked: true },
    { name: "National courier", days: "2 days", cost: 74 },
    { name: "National courier", days: "Next day", cost: 100 },
    { name: "Postal service", days: "4 days", cost: 49, note: "Too slow", out: true },
  ];
  return (
    <div style={{ background: C.card, borderRadius: 8, padding: "12px 14px 4px", boxShadow: "0 24px 48px -24px rgba(23,16,28,0.7)" }}>
      <div style={{ ...mono, display: "flex", justifyContent: "space-between", gap: 10, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: C.stone, paddingBottom: 8 }}>
        <span>One order to Seattle · due in 2 days</span>
        <span>Illustrative</span>
      </div>
      {rows.map((r, i) => (
        <div key={`${r.name}-${r.days}`} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)", alignItems: "center", gap: 12, padding: "8px 0", borderTop: `1px solid ${C.line}` }}>
          <span style={{ minWidth: 0 }}>
            <span style={{ ...sans, display: "block", fontSize: 13.5, fontWeight: r.picked ? 700 : 500, color: r.out ? C.stone : C.ink }}>{r.name}</span>
            <span style={{ ...mono, display: "block", fontSize: 10.5, color: C.stone, marginTop: 1 }}>{r.days}</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ flex: 1, height: 8, background: C.mist, borderRadius: 99, overflow: "hidden" }}>
              <span className="kb-bar" style={{ display: "block", height: "100%", width: `${r.cost}%`, background: r.picked ? C.plum : r.out ? C.line : C.lilac, borderRadius: 99, ...vars({ "--i": `${i * 110}ms` }) }} />
            </span>
            <span className={r.picked ? "kb-pick" : undefined} style={{ ...mono, width: 58, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: r.picked ? C.plum : C.stone, fontWeight: r.picked ? 700 : 400 }}>
              {r.note ?? ""}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

function Check({ color = C.paper }: { color?: string }) {
  return (
    <svg viewBox="0 0 12 12" style={{ width: 9, height: 9, display: "block" }} aria-hidden>
      <path d="M2.2 6.3 L4.8 8.8 L9.8 3.4" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Photo tiles keep the picture clear at the top and the words on a fade below.
const SHADE = "linear-gradient(180deg, rgba(23,16,28,0) 0%, rgba(23,16,28,0.1) 26%, rgba(23,16,28,0.78) 50%, rgba(23,16,28,0.96) 70%)";

// Names and jobs from the Shiplets page (plus-shiplets.tsx).
const APPS: [string, string][] = [
  ["Returns Desk", "Prepaid, scan-based returns"],
  ["ShipAudit", "Every carrier invoice checked"],
  ["Exception Radar", "Problems flagged early"],
];

// The six blocks in the "One network" tile, each a link to its own section of
// the detail page (the ids on /koherent/what-we-bring).
const BLOCKS: [string, string][] = [
  ["Carriers", "carriers"],
  ["Rates", "rates"],
  ["Warehouses", "warehouses"],
  ["Integrations", "integrations"],
  ["Shiplets", "shiplets"],
  ["People", "people"],
];

export function BringBento() {
  return (
    <div className="kb" style={{ maxWidth: 1120, margin: "clamp(36px, 5vw, 56px) auto 0" }}>
      {/* Two tall photo tiles on a diagonal (carriers top right, people bottom
          left), so photos never sit side by side. DOM order is Michael's
          order, which is also the phone order. */}
      <div className="kb-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gridTemplateAreas: `"map map map map map map map car car car car car" "map map map map map map map car car car car car" "ppl ppl ppl ppl rat rat rat rat int int int int" "ppl ppl ppl ppl shp shp shp shp one one one one"`, gap: 14 }}>
        {/* 01 · carriers: the comparison over a photo */}
        <PhotoTile area="car" delay={120} src="/generated/koherent-bring-carriers-a.webp" focus="50% 14%" shade={SHADE} chevrons={{ size: 58, style: { right: 22, top: 22 } }} credit="Illustrative photo">
          <TileHead k="carriers" dark />
          <RateCard />
        </PhotoTile>

        {/* 02 · rates: the buying power behind them. Best value, not
            cheapest: the carrier tile drops the cheapest option as too slow,
            and the entry point is cost out, not "cheaper rates" (Chris). */}
        <Tile area="rat" tone="plum" delay={120}>
          <TileHead k="rates" dark />
          <div style={{ marginTop: "auto", display: "grid", gap: 14 }}>
            <Stat value="2M+" label="shipments managed a year: the buying power behind your rates" dark />
            <p style={{ ...sans, fontSize: 15, fontWeight: 600, lineHeight: 1.5, color: C.onDark, margin: 0 }}>Our rates and your contracts, compared on every shipment. Best value wins.</p>
          </div>
        </Tile>

        {/* 03 · warehouses: the map */}
        <Tile area="map" delay={0}>
          <TileHead k="warehouses" />
          <NetworkMap />
        </Tile>

        {/* 04 · integrations */}
        <Tile area="int" delay={240}>
          <TileHead k="integrations" />
          <div style={{ marginTop: "auto", display: "grid", gap: 18 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Shopify", "Amazon", "NetSuite", "QuickBooks"].map((n, i) => (
                <span key={n} style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600, color: C.ink, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 999, padding: "6px 12px 6px 7px" }}>
                  <span className="kb-tick" style={{ width: 18, height: 18, borderRadius: 99, background: C.plum, display: "inline-flex", alignItems: "center", justifyContent: "center", ...vars({ "--i": `${i * 120}ms` }) }}>
                    <Check />
                  </span>
                  {n}
                </span>
              ))}
              <span style={{ ...sans, fontSize: 13.5, fontWeight: 600, color: C.stone, border: `1px dashed ${C.lilac}`, borderRadius: 999, padding: "6px 12px" }}>+ 30 more</span>
            </div>
            <Stat value="1,000+" label="businesses on the platform" />
          </div>
        </Tile>

        {/* 05 · Shiplets */}
        <Tile area="shp" tone="mist" delay={120}>
          <TileHead k="shiplets" />
          <div style={{ marginTop: "auto", background: C.card, border: `1px solid ${C.line}`, borderRadius: 8, padding: "2px 12px" }}>
            {APPS.map(([n, job], i) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderTop: i ? `1px solid ${C.line}` : "none" }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ ...sans, display: "block", fontSize: 13.5, fontWeight: 700, color: C.ink }}>{n}</span>
                  <span style={{ ...sans, display: "block", fontSize: 12, color: C.stone }}>{job}</span>
                </span>
                <span className="kb-sw" style={{ position: "relative", width: 32, height: 18, flex: "none", borderRadius: 99, background: C.plum, ...vars({ "--i": `${i * 160}ms` }) }}>
                  <span className="kb-knob" style={{ position: "absolute", top: 2, left: 16, width: 14, height: 14, borderRadius: 99, background: C.paper }} />
                </span>
              </div>
            ))}
          </div>
        </Tile>

        {/* 06 · people: a photo, the steps, one example message */}
        <PhotoTile area="ppl" delay={0} src="/generated/koherent-bring-people-b.webp" focus="60% 12%" shade={SHADE} chevrons={{ size: 58, style: { right: 22, top: 22 } }} credit="Illustrative photo">
          <TileHead k="people" dark />
          <div style={{ background: "rgba(246,243,238,0.1)", border: "1px solid rgba(199,174,230,0.25)", borderRadius: "4px 14px 14px 14px", padding: "10px 14px" }}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: C.lilac }}>Your account team · example message</div>
            <div style={{ ...sans, fontSize: 14, lineHeight: 1.5, color: C.onDark, marginTop: 4 }}>Reno receiving is a day behind: a truck arrived late. Back on schedule Thursday.</div>
          </div>
          <Stat value="20 yrs" label="in shipping and logistics" dark />
        </PhotoTile>

        {/* one network, one view: the six blocks, a step each, lit in order */}
        <Tile area="one" tone="ink" delay={240}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 44, height: 44, flex: "none", borderRadius: 9, background: C.plum, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 12 12" style={{ width: 20, height: 20 }} aria-hidden>
                <path d={K_BAR} fill={C.paper} />
                <path d={K_ARROW} fill={C.paper} />
              </svg>
            </span>
            <p style={{ ...title, fontSize: "clamp(1.35rem, 2vw, 1.6rem)", color: C.onDark, margin: 0 }}>
              One network.
              <br />
              One view.
            </p>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px 16px" }}>
            {BLOCKS.map(([name, id], i) => (
              <li key={id} className="kb-step" style={{ ...sans, display: "flex", alignItems: "center", gap: 9, fontSize: 14.5, fontWeight: 600, color: C.onDark, ...vars({ "--i": `${i * 140}ms` }) }}>
                <svg viewBox="0 0 8 12" style={{ width: 9, height: 13, flex: "none" }} aria-hidden>
                  <path d={CHEV} fill={C.lilac} />
                </svg>
                <Link href={`/koherent/what-we-bring#${id}`} className="kb-link" style={{ color: "inherit", textDecoration: "none" }}>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
          {/* the section's "Every block, in detail" link sits under the grid */}
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", borderTop: "1px solid rgba(246,243,238,0.14)", paddingTop: 16 }}>
            <span style={{ ...mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.lilac }}>6 of 6 connected</span>
          </div>
        </Tile>
      </div>

      <style>{`
        .kb-seg:focus-visible { outline: 2px solid ${C.violet}; outline-offset: 2px; }
        .kb-link:hover { text-decoration: underline !important; text-underline-offset: 4px; }
        .kb-img { transition: transform .6s cubic-bezier(.22,1,.36,1); }
        .kb-chev { transition: transform .4s cubic-bezier(.22,1,.36,1); }
        @media (hover: hover) {
          .kb-photo:hover .kb-img { transform: scale(1.04); }
          .kb-photo:hover .kb-chev { transform: translateX(6px); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .kb-tile.armed:not(.is-in) { opacity: 0; }
          @keyframes kb-in-kf { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
          .kb-tile.is-in { animation: kb-in-kf .65s cubic-bezier(.22,1,.36,1) backwards; animation-delay: var(--d); }
          @keyframes kb-chev-kf { from { opacity: 0; translate: -36px 0; } to { opacity: 1; translate: 0 0; } }
          .kb-tile.is-in .kb-chev { animation: kb-chev-kf .6s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--d) + 350ms + var(--i)); }
          @keyframes kb-bar-kf { from { width: 0; } }
          .kb-tile.is-in .kb-bar { animation: kb-bar-kf .8s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--d) + 300ms + var(--i)); }
          @keyframes kb-fade-kf { from { opacity: 0; } to { opacity: 1; } }
          .kb-tile.is-in .kb-pick { animation: kb-fade-kf .4s ease both; animation-delay: calc(var(--d) + 950ms); }
          @keyframes kb-pop-kf { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
          .kb-tile.is-in .kb-tick { animation: kb-pop-kf .4s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--d) + 350ms + var(--i)); }
          @keyframes kb-sw-kf { from { background: ${C.line}; } }
          @keyframes kb-knob-kf { from { transform: translateX(-14px); } }
          .kb-tile.is-in .kb-sw { animation: kb-sw-kf .3s ease both; animation-delay: calc(var(--d) + 500ms + var(--i)); }
          .kb-tile.is-in .kb-knob { animation: kb-knob-kf .3s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--d) + 500ms + var(--i)); }
          @keyframes kb-step-kf { from { opacity: .18; } to { opacity: 1; } }
          .kb-tile.is-in .kb-step { animation: kb-step-kf .3s ease both; animation-delay: calc(var(--d) + 300ms + var(--i)); }
        }
        @media (max-width: 1024px) {
          .kb-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; grid-template-areas: "map map" "car rat" "car int" "shp ppl" "one ppl" !important; }
        }
        @media (max-width: 760px) {
          .kb-grid { display: flex !important; flex-direction: column; }
          .kb-photo .kb-media { position: relative !important; height: 230px; }
          .kb-photo .kb-shade { background: linear-gradient(180deg, rgba(23,16,28,0) 50%, rgba(23,16,28,0.9) 100%) !important; }
          .kb-photo .kb-body { height: auto !important; }
          .kb-chev { width: 30px !important; height: 45px !important; }
          .kb-pin { font-size: 10px !important; padding: 1px 5px !important; transform: translate(9px, -50%) !important; }
          .kb-pin-east { transform: translate(calc(-100% - 9px), -50%) !important; }
        }
      `}</style>
    </div>
  );
}
