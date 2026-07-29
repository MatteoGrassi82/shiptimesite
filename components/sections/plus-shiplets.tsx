"use client";

import type { CSSProperties, ReactNode } from "react";
import { HeroParallax, type ParallaxItem } from "@/components/ui/hero-parallax";

// ── Shiplets — the micro-apps inside ShipTime Plus ───────────────────────────
// Presented through the Aceternity hero-parallax (components/ui/hero-parallax),
// but every card face is a BRANDED CONCEPTUAL TILE, not a screenshot or stock
// photo: the Plus negative list bans both, and a shiplet is a capability, not a
// product shot. Each tile carries a glyph, a name, a one-line job, and a small
// abstract "what it does" visualisation.

const P = {
  paper: "#FFFFFF",
  panelSoft: "#F3F4F7",
  ink: "#1C1E3D",
  sub: "#5C6270",
  faint: "#9AA0AD",
  line: "#E3E5EA",
  darkLine: "rgba(255,255,255,0.14)",
  onDark: "#F4F5F8",
  onDarkDim: "rgba(244,245,248,0.66)",
  orange: "#EC5A26",
  orangeTint: "#FDEFE8",
};

const serif: CSSProperties = {
  fontFamily: 'var(--font-instrument-serif), "Instrument Serif", Georgia, serif',
  fontWeight: 400,
  letterSpacing: "-0.01em",
};
const sans: CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };

// Minimal inline glyph set — same approach as the Core feature grid, so no icon
// package version can break the tiles.
const GLYPH: Record<string, string> = {
  search: "M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-3.5-3.5",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",
  route: "M6 19a2 2 0 100-4 2 2 0 000 4zM18 9a2 2 0 100-4 2 2 0 000 4zM8 17h6a3 3 0 003-3V9",
  pin: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  printer: "M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v7H8z",
  radar: "M12 12l6-4M4 12a8 8 0 108-8M7.5 12a4.5 4.5 0 104.5-4.5",
  refresh: "M4 12a8 8 0 0114-5l2 2M20 12a8 8 0 01-14 5l-2-2M18 5v4h-4M6 19v-4h4",
  globe: "M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18",
  boxes: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
  alert: "M12 3l9 16H3zM12 9v4M12 16.5h.01",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  star: "M12 3l2.6 6.1 6.4.6-4.8 4.3 1.4 6.3L12 17l-5.6 3.3 1.4-6.3L3 9.7l6.4-.6z",
  clock: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2",
  lock: "M6 11V8a6 6 0 1112 0v3M5 11h14v10H5z",
  truck: "M3 7h11v8H3zM14 10h4l3 3v2h-7M6.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
};

function Glyph({ name, color }: { name: string; color: string }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={GLYPH[name] || GLYPH.boxes} />
    </svg>
  );
}

type Viz = "rows" | "bars" | "ring" | "chips" | "flow";

type Shiplet = {
  name: string;
  job: string;
  glyph: string;
  viz: Viz;
  /** dark tiles punctuate the rows so the wall doesn't read as one texture */
  dark?: boolean;
  tag?: string;
  href: string;
};

// Grounded in the real Plus capability set (master doc C3/C4/C9).
const SHIPLETS: Shiplet[] = [
  // row 1
  { name: "Rate Shopper", job: "Every carrier and mode priced on every shipment — cheapest qualified label wins.", glyph: "search", viz: "rows", href: "/plus/platform" },
  { name: "Spot Board", job: "Push an LTL load to the market and let carriers bid it down within the hour.", glyph: "truck", viz: "bars", dark: true, href: "/plus/platform" },
  { name: "ShipAudit", job: "Every carrier invoice checked line by line; overcharges clawed back automatically.", glyph: "receipt", viz: "rows", href: "/plus/platform" },
  { name: "Zone Skipper", job: "Consolidate volume, line-haul it, and inject close to the customer.", glyph: "route", viz: "flow", href: "/plus/fulfillment" },
  { name: "Node Picker", job: "Every order fulfilled from the location that wins on end-to-end cost and speed.", glyph: "pin", viz: "ring", dark: true, href: "/plus/fulfillment" },
  // row 2
  { name: "Label Run", job: "Hundreds of labels in one pass — pick, pack, and manifest without leaving the screen.", glyph: "printer", viz: "chips", href: "/plus/platform" },
  { name: "Tracking Hub", job: "Every parcel and pallet on one timeline, synced back to your storefront.", glyph: "radar", viz: "flow", dark: true, href: "/plus/technology" },
  { name: "Returns Desk", job: "Prepaid and scan-based returns at the same rate advantage as outbound.", glyph: "refresh", viz: "rows", href: "/plus/fulfillment" },
  { name: "Customs Desk", job: "Landed cost, duties, and clearance resolved before the shipment moves.", glyph: "globe", viz: "chips", tag: "Rolling out", href: "/plus/platform" },
  { name: "Inventory Sync", job: "One SKU across every location — allocation and replenishment without spreadsheets.", glyph: "boxes", viz: "bars", dark: true, href: "/plus/fulfillment" },
  // row 3
  { name: "Exception Radar", job: "The failures you'd otherwise learn about from an angry email, flagged early.", glyph: "alert", viz: "ring", href: "/plus/technology" },
  { name: "Lane Analyzer", job: "What every lane should cost, scored against what you actually paid.", glyph: "chart", viz: "bars", href: "/plus/platform" },
  { name: "Carrier Scorecard", job: "Performance and spend by carrier — the data your next negotiation needs.", glyph: "star", viz: "rows", dark: true, href: "/plus/platform" },
  { name: "Pickup Scheduler", job: "Book carrier pickups in two clicks. Parcel or freight, no phone tag.", glyph: "clock", viz: "chips", href: "/plus/platform" },
  { name: "BYOR Vault", job: "Your negotiated contracts, shopped side by side with ours on every shipment.", glyph: "lock", viz: "rows", href: "/plus/platform" },
];

// ── the abstract "what it does" strip at the bottom of each tile ─────────────
function Viz({ kind, dark }: { kind: Viz; dark?: boolean }) {
  const bg = dark ? "rgba(255,255,255,0.09)" : "#EEF0F3";
  const bgHot = dark ? "rgba(236,90,38,0.30)" : P.orangeTint;
  const edge = dark ? P.darkLine : P.line;

  if (kind === "rows")
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "8px 11px",
              borderRadius: 8,
              background: i === 1 ? bgHot : bg,
              border: `1px solid ${i === 1 ? P.orange : edge}`,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: 999, background: i === 1 ? P.orange : dark ? P.onDarkDim : P.faint }} />
            <span style={{ height: 5, flex: 1, borderRadius: 3, background: i === 1 ? "rgba(236,90,38,0.45)" : dark ? "rgba(255,255,255,0.18)" : "#DDE0E6" }} />
            <span style={{ width: 34, height: 5, borderRadius: 3, background: i === 1 ? P.orange : dark ? "rgba(255,255,255,0.28)" : "#C9CDD6" }} />
          </div>
        ))}
      </div>
    );

  if (kind === "bars")
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 78 }}>
        {[38, 62, 46, 88, 54, 72].map((h, i) => (
          <span
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              borderRadius: "4px 4px 0 0",
              background: i === 3 ? P.orange : bg,
              border: `1px solid ${i === 3 ? P.orange : edge}`,
              borderBottom: "none",
            }}
          />
        ))}
      </div>
    );

  if (kind === "ring")
    return (
      <div style={{ position: "relative", height: 78, display: "grid", placeItems: "center" }}>
        <div style={{ position: "relative", width: 78, height: 78, borderRadius: "50%", border: `1.5px dashed ${dark ? P.darkLine : "#C9CDD6"}` }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
            return (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${Math.cos(a) * 39}px - 5px)`,
                  top: `calc(50% + ${Math.sin(a) * 39}px - 5px)`,
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: i === 0 ? P.orange : dark ? "rgba(255,255,255,0.35)" : "#C9CDD6",
                }}
              />
            );
          })}
          <span style={{ position: "absolute", inset: 0, margin: "auto", width: 22, height: 22, borderRadius: 7, background: P.orange, display: "grid", placeItems: "center" }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: "#fff" }} />
          </span>
        </div>
      </div>
    );

  if (kind === "chips")
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignContent: "flex-start", height: 78 }}>
        {[54, 78, 44, 96, 62, 70, 50].map((w, i) => (
          <span
            key={i}
            style={{
              width: w,
              height: 24,
              borderRadius: 999,
              background: i === 2 ? bgHot : bg,
              border: `1px solid ${i === 2 ? P.orange : edge}`,
            }}
          />
        ))}
      </div>
    );

  // flow
  return (
    <div style={{ position: "relative", height: 78, display: "flex", alignItems: "center" }}>
      <div style={{ position: "absolute", left: 0, right: 0, height: 2, backgroundImage: `repeating-linear-gradient(90deg, ${dark ? "rgba(255,255,255,0.28)" : "#C9CDD6"} 0 6px, transparent 6px 14px)` }} />
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            position: "relative",
            marginLeft: i === 0 ? 0 : "auto",
            width: i === 2 ? 16 : 12,
            height: i === 2 ? 16 : 12,
            borderRadius: 4,
            background: i === 2 ? P.orange : dark ? "rgba(255,255,255,0.30)" : "#D7DAE1",
            boxShadow: i === 2 ? "0 0 14px rgba(236,90,38,0.55)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

function ShipletTile({ s }: { s: Shiplet }) {
  const fg = s.dark ? P.onDark : P.ink;
  const dim = s.dark ? P.onDarkDim : P.sub;
  return (
    <div
      className="v2-shiplet"
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: s.dark ? P.ink : P.paper,
        border: `1px solid ${s.dark ? "transparent" : P.line}`,
        borderRadius: 18,
        padding: "26px 28px 28px",
        overflow: "hidden",
        boxShadow: s.dark ? "0 24px 60px -30px rgba(28,30,61,0.55)" : "0 18px 46px -28px rgba(28,30,61,0.35)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            flex: "none",
            display: "grid",
            placeItems: "center",
            background: s.dark ? "rgba(236,90,38,0.18)" : P.orangeTint,
          }}
        >
          <Glyph name={s.glyph} color={P.orange} />
        </span>
        <span style={{ ...sans, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: s.dark ? P.onDarkDim : P.faint }}>
          Shiplet
        </span>
        {s.tag && (
          <span
            style={{
              ...sans,
              marginLeft: "auto",
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: P.orange,
              background: s.dark ? "rgba(236,90,38,0.16)" : P.orangeTint,
              borderRadius: 999,
              padding: "4px 10px",
            }}
          >
            {s.tag}
          </span>
        )}
      </div>

      <h3 style={{ ...serif, fontSize: 32, lineHeight: 1.1, color: fg, margin: 0 }}>{s.name}</h3>
      <p style={{ ...sans, fontSize: 14, lineHeight: 1.6, color: dim, margin: "10px 0 0", maxWidth: "34ch" }}>{s.job}</p>

      <div style={{ marginTop: "auto", paddingTop: 22 }}>
        <Viz kind={s.viz} dark={s.dark} />
      </div>
    </div>
  );
}

export const SHIPLET_ITEMS: ParallaxItem[] = SHIPLETS.map((s) => ({
  title: s.name,
  link: s.href,
  render: <ShipletTile s={s} />,
}));

export function ShipletsHeader() {
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "clamp(48px, 8vw, 120px) clamp(20px, 4vw, 48px)", position: "relative", width: "100%" }}>
      <p style={{ ...sans, display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: P.sub, margin: 0 }}>
        <span style={{ width: 6, height: 6, background: P.orange }} />
        ShipTime Plus · Shiplets
      </p>
      <h1 style={{ ...serif, fontSize: "clamp(2.8rem, 7vw, 5.4rem)", lineHeight: 1.0, color: P.ink, margin: "22px 0 0", maxWidth: "15ch" }}>
        Small apps. <span style={{ fontStyle: "italic" }}>One operating layer.</span>
      </h1>
      <p style={{ ...sans, fontSize: "clamp(1.02rem, 1.4vw, 1.2rem)", lineHeight: 1.65, color: P.sub, margin: "22px 0 0", maxWidth: "58ch" }}>
        A shiplet is a micro-application that does one job inside your logistics operating system — rate shopping,
        invoice recovery, node selection, exception watch. They share your data, your rules, and your carriers, so
        turning one on never means bolting on another tool.
      </p>
    </div>
  );
}

export function ShipletsParallax() {
  return <HeroParallax products={SHIPLET_ITEMS} header={<ShipletsHeader />} scrollSpan="hero" />;
}

// ── Embeddable section variant ───────────────────────────────────────────────
// Same wall, shorter scroll span, and it ENDS at the wall — the copy runs from
// the eyebrow through the micro-application definition, then the tiles, then
// out. The deeper explainer / compose grid / CTA stay on /plus/shiplets.
function ShipletsSectionHeader() {
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px) clamp(24px, 4vw, 48px)", position: "relative", width: "100%" }}>
      <p style={{ ...sans, display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: P.sub, margin: 0 }}>
        <span style={{ width: 6, height: 6, background: P.orange }} />
        Shiplets
      </p>
      <h2 style={{ ...serif, fontSize: "clamp(2.2rem, 5vw, 3.8rem)", lineHeight: 1.04, color: P.ink, margin: "18px 0 0", maxWidth: "16ch" }}>
        Small apps. <span style={{ fontStyle: "italic" }}>One operating layer.</span>
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginTop: 18 }}>
        <p style={{ ...sans, fontSize: "clamp(1rem, 1.35vw, 1.15rem)", lineHeight: 1.65, color: P.sub, margin: 0, maxWidth: "56ch" }}>
          A shiplet is a micro-application that does one job inside your logistics operating system — rate shopping,
          invoice recovery, node selection, exception watch. They share your data, your rules, and your carriers.
        </p>
        <a
          href="/plus/shiplets"
          className="st-cta"
          style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: P.ink, textDecoration: "none", borderBottom: `1px solid ${P.line}`, paddingBottom: 3, whiteSpace: "nowrap" }}
        >
          Explore the shiplets
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export function ShipletsSection({ background = "#FBFBFC" }: { background?: string }) {
  return (
    <section style={{ background, paddingTop: "clamp(56px, 8vw, 104px)" }}>
      <HeroParallax products={SHIPLET_ITEMS} header={<ShipletsSectionHeader />} scrollSpan="section" />
    </section>
  );
}
