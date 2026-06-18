import type React from "react";
import { Reveal } from "@/components/ui/reveal";

// Local design tokens — mirrors components/ui/feature-showcase.tsx.
const ds = {
  navy: "#1C1E3D",
  muted: "#6E728A",
  orange: "#EC5A26",
  orangeSoft: "#F0845B",
  lightBlue: "#E3EEFC",
  surface: "#F8FAFB",
  border: "#E8E8E8",
  white: "#FFFFFF",
  green: "#3FA864",
};
const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };
const heading: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  color: ds.navy,
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  fontWeight: 800,
};

// Status of a single cell. "full" = capability present (orange for ShipTime,
// navy-muted for competitors), "partial" = limited/basic, "none" = absent.
type Status = "full" | "partial" | "none";
type Cell = { status: Status; caption: string };

type Row = {
  feature: string;
  shiptime: Cell;
  freightcom: Cell;
  shipstation: Cell;
  stallion: Cell;
};

// Columns in display order. ShipTime is the emphasized, raised column.
const COLS = [
  { key: "shiptime", name: "ShipTime" },
  { key: "freightcom", name: "Freightcom" },
  { key: "shipstation", name: "ShipStation" },
  { key: "stallion", name: "Stallion Express" },
] as const;

// Rows are mapped directly from lib/competitors.ts (per-competitor `rows`,
// plus the shared vsReasons mini tables). Where a competitor genuinely wins or
// ties, that is reflected — ShipTime does not sweep every row.
const ROWS: Row[] = [
  {
    feature: "Bring Your Own Rates (BYOR)",
    shiptime: { status: "full", caption: "Core differentiator" },
    freightcom: { status: "none", caption: "Not supported" },
    shipstation: { status: "partial", caption: "Limited" },
    stallion: { status: "none", caption: "Not supported" },
  },
  {
    feature: "Native Canada Post",
    shiptime: { status: "full", caption: "Yes, native" },
    freightcom: { status: "none", caption: "No support" },
    shipstation: { status: "full", caption: "Yes" },
    stallion: { status: "partial", caption: "Limited" },
  },
  {
    feature: "Courier + LTL in one platform",
    shiptime: { status: "full", caption: "Yes" },
    freightcom: { status: "full", caption: "Yes" },
    shipstation: { status: "partial", caption: "Limited" },
    stallion: { status: "partial", caption: "Primarily parcel" },
  },
  {
    feature: "No monthly platform fee",
    shiptime: { status: "full", caption: "Never a fee" },
    freightcom: { status: "full", caption: "No platform fee" },
    shipstation: { status: "none", caption: "Monthly subscription" },
    stallion: { status: "full", caption: "Low-cost model" },
  },
  {
    feature: "Automatic shipping audit",
    shiptime: { status: "full", caption: "Yes" },
    freightcom: { status: "partial", caption: "Limited" },
    shipstation: { status: "none", caption: "No" },
    stallion: { status: "none", caption: "No" },
  },
  {
    feature: "Single invoice across carriers",
    shiptime: { status: "full", caption: "Yes" },
    freightcom: { status: "partial", caption: "Partial" },
    shipstation: { status: "none", caption: "No" },
    stallion: { status: "none", caption: "No" },
  },
  {
    feature: "Cross-border duties & tax calculator",
    shiptime: { status: "full", caption: "Yes" },
    freightcom: { status: "none", caption: "No" },
    shipstation: { status: "none", caption: "No" },
    stallion: { status: "none", caption: "No" },
  },
  {
    feature: "Real human support",
    shiptime: { status: "full", caption: "Voice, email & chat" },
    freightcom: { status: "none", caption: "Often reported poor" },
    shipstation: { status: "partial", caption: "Variable" },
    stallion: { status: "partial", caption: "Variable" },
  },
];

// A small icon chip rendering ✓ / ~ / ✕. ShipTime full cells render in orange;
// competitor full cells render in navy-muted so the ShipTime column reads as
// the emphasized one.
function StatusChip({ status, emphasize }: { status: Status; emphasize?: boolean }) {
  const map: Record<Status, { glyph: string; bg: string; fg: string }> = {
    full: emphasize
      ? { glyph: "✓", bg: ds.orange, fg: ds.white }
      : { glyph: "✓", bg: ds.lightBlue, fg: ds.navy },
    partial: { glyph: "~", bg: ds.surface, fg: ds.muted },
    none: { glyph: "✕", bg: ds.surface, fg: "#B6B9C7" },
  };
  const s = map[status];
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center shrink-0"
      style={{
        width: 26,
        height: 26,
        borderRadius: 999,
        background: s.bg,
        color: s.fg,
        fontSize: 14,
        fontWeight: 800,
        lineHeight: 1,
        border: status === "none" || status === "partial" ? `1px solid ${ds.border}` : "none",
        ...sora,
      }}
    >
      {s.glyph}
    </span>
  );
}

function cellOf(row: Row, key: (typeof COLS)[number]["key"]): Cell {
  return row[key];
}

export default function ComparisonMatrix({ background = ds.white }: { background?: string }) {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Header */}
        <Reveal>
          <div className="text-center mx-auto" style={{ maxWidth: 760 }}>
            <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>
              Why ShipTime
            </p>
            <h2 style={{ ...heading, fontSize: "clamp(1.9rem, 4.4vw, 3rem)" }}>
              Why ShipTime Beats Every Other Way to Ship
            </h2>
            <p
              className="mt-5"
              style={{ ...inter, color: ds.muted, fontSize: 17, lineHeight: 1.62 }}
            >
              Going direct to carriers means juggling logins and missing the cheapest rate. Other
              apps lock you into their book of rates or charge a monthly fee. ShipTime gives you
              every carrier, your own rates too, and a system that audits the bill for you — on one
              screen.
            </p>
          </div>
        </Reveal>

        {/* ── Desktop: 5-column grid with the ShipTime column raised on a card ── */}
        <div className="relative mt-14 hidden md:block">
          {/* Emphasis card sitting behind the ShipTime column. The grid is
              [feature 1.4fr | 4 equal option columns]; the ShipTime column is
              the first option column, so the card starts after the label. */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: -18,
              bottom: -18,
              // label is 1.4 of (1.4 + 4) = 1.4/5.4 of the width.
              left: "calc((1.4 / 5.4) * 100%)",
              width: "calc((1 / 5.4) * 100%)",
              background: ds.white,
              borderRadius: 24,
              border: `1.5px solid ${ds.orange}`,
              boxShadow: "0 30px 80px -40px rgba(28,30,61,0.3)",
              zIndex: 0,
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Column header row */}
            <div
              className="grid items-end"
              style={{ gridTemplateColumns: "1.4fr repeat(4, 1fr)", paddingBottom: 18 }}
            >
              <div />
              {COLS.map((c, i) => {
                const isShip = c.key === "shiptime";
                return (
                  <div key={c.key} className="text-center px-3">
                    <span
                      style={{
                        ...sora,
                        fontWeight: 800,
                        fontSize: isShip ? 18 : 16,
                        color: isShip ? ds.orange : ds.navy,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {c.name}
                    </span>
                    {isShip && (
                      <div
                        className="mx-auto mt-2"
                        style={{ width: 30, height: 3, borderRadius: 3, background: ds.orange }}
                      />
                    )}
                    {/* keep header height aligned across columns */}
                    {!isShip && <div className="mt-2" style={{ height: 3 }} />}
                    <span className="sr-only">{i === 0 ? "(recommended)" : ""}</span>
                  </div>
                );
              })}
            </div>

            {/* Body rows */}
            {ROWS.map((row, ri) => (
              <Reveal key={row.feature} delay={ri * 40}>
                <div
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: "1.4fr repeat(4, 1fr)",
                    borderTop: `1px solid ${ds.border}`,
                    minHeight: 78,
                  }}
                >
                  <div className="pr-4 py-4">
                    <span style={{ ...sora, fontWeight: 700, fontSize: 15, color: ds.navy }}>
                      {row.feature}
                    </span>
                  </div>
                  {COLS.map((c) => {
                    const cell = cellOf(row, c.key);
                    const isShip = c.key === "shiptime";
                    return (
                      <div
                        key={c.key}
                        className="flex flex-col items-center justify-center text-center px-3 py-4 gap-1.5"
                      >
                        <StatusChip status={cell.status} emphasize={isShip} />
                        <span
                          style={{
                            ...inter,
                            fontSize: 12.5,
                            lineHeight: 1.3,
                            color: isShip && cell.status === "full" ? ds.navy : ds.muted,
                            fontWeight: isShip && cell.status === "full" ? 600 : 400,
                          }}
                        >
                          {cell.caption}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Mobile: per-competitor cards (no tiny horizontal-scroll table) ── */}
        <div className="mt-12 flex flex-col gap-5 md:hidden">
          {COLS.map((c, ci) => {
            const isShip = c.key === "shiptime";
            return (
              <Reveal key={c.key} delay={ci * 40}>
                <div
                  style={{
                    background: ds.white,
                    borderRadius: 22,
                    border: isShip ? `1.5px solid ${ds.orange}` : `1px solid ${ds.border}`,
                    boxShadow: isShip
                      ? "0 30px 80px -40px rgba(28,30,61,0.3)"
                      : "0 18px 50px -40px rgba(28,30,61,0.25)",
                    padding: "20px 18px",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      style={{
                        ...sora,
                        fontWeight: 800,
                        fontSize: 18,
                        color: isShip ? ds.orange : ds.navy,
                      }}
                    >
                      {c.name}
                    </span>
                    {isShip && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5"
                        style={{
                          ...sora,
                          color: ds.orange,
                          background: "rgba(236,90,38,0.1)",
                          borderRadius: 999,
                        }}
                      >
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    {ROWS.map((row, ri) => {
                      const cell = cellOf(row, c.key);
                      return (
                        <div
                          key={row.feature}
                          className="flex items-start gap-3 py-3"
                          style={{ borderTop: ri === 0 ? "none" : `1px solid ${ds.border}` }}
                        >
                          <StatusChip status={cell.status} emphasize={isShip} />
                          <div className="min-w-0">
                            <div style={{ ...sora, fontWeight: 700, fontSize: 14, color: ds.navy }}>
                              {row.feature}
                            </div>
                            <div style={{ ...inter, fontSize: 12.5, color: ds.muted, lineHeight: 1.35 }}>
                              {cell.caption}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Legend */}
        <Reveal>
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
            style={{ ...inter, fontSize: 13, color: ds.muted }}
          >
            <span className="inline-flex items-center gap-2">
              <StatusChip status="full" /> Full support
            </span>
            <span className="inline-flex items-center gap-2">
              <StatusChip status="partial" /> Partial or limited
            </span>
            <span className="inline-flex items-center gap-2">
              <StatusChip status="none" /> Not available
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
