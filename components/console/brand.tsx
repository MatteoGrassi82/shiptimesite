"use client";

import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { useScenario } from "./derive";
import type { Tier } from "./scenarios";

// ── Two brands, one platform ─────────────────────────────────────────────────
// Oct 22 L10: ShipTime One is only the internal name. Customers who have it
// switched on see Koherent, white-labelled on the same platform: "it goes from
// blue to purple, and you have a completely different experience" (the way a
// store looked different once Shopify Plus was activated). ShipTime accounts
// keep today's ShipTime look.
//
// Every colour in the app is a CSS variable set here, so one switch re-themes
// it. ShipTime's values are the Stripe-style neutrals with ShipTime orange;
// Koherent's come from the brand deck (Oct 22, slide 36): plum, violet, lilac,
// warm white, Schibsted Grotesk and JetBrains Mono. SVG and chart colours that
// can't read a variable use the hex palette from useBrand().

export type Brand = "shiptime" | "koherent";
export const brandOf = (tier: Tier): Brand => (tier === "Koherent" ? "koherent" : "shiptime");

const PALETTE = {
  shiptime: {
    ink: "#1A1B25", text: "#353A44", muted: "#6A7383", faint: "#8792A2",
    line: "#EBEEF1", border: "#D8DEE4", border2: "#C0C8D2",
    subtle: "#F5F6F8", hover: "#F6F8FA", track: "#F0F2F5",
    badgeBg: "#F4F7FA", badgeFg: "#50617A", badgeLine: "#D4DEE9",
    link: "#2E4C8F", accent: "#EC5A26", accentSoft: "#FFF4EF",
    action: "#C8461B", actionHover: "#B23C15", actionText: "#C2410C",
    toastAction: "#FDBA74",
    // Map fill for 1, 2, 3, 4 and 5+ ground days.
    ramp: ["#B93A12", "#EC5A26", "#F6AE8E", "#FBD9C9", "#EEF0F3"],
    font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    mono: 'Menlo, Consolas, "SFMono-Regular", monospace',
  },
  koherent: {
    ink: "#17101C", text: "#2F2635", muted: "#6A6272", faint: "#8E8496",
    line: "#ECE6EF", border: "#DCD4E2", border2: "#C9BFD1",
    subtle: "#F5F1F7", hover: "#F8F5F9", track: "#EEE8F3",
    badgeBg: "#F5F1F7", badgeFg: "#5E4F66", badgeLine: "#DCD4E2",
    link: "#6E3A80", accent: "#6E3A80", accentSoft: "#EEE8F3",
    action: "#461948", actionHover: "#5A2160", actionText: "#461948",
    toastAction: "#C7AEE6",
    ramp: ["#461948", "#6E3A80", "#B69AD6", "#E2D6EE", "#F1EDF3"],
    font: "var(--font-schibsted), 'Schibsted Grotesk', system-ui, sans-serif",
    mono: "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, monospace",
  },
};

export type Palette = (typeof PALETTE)["shiptime"];
export const paletteOf = (b: Brand): Palette => PALETTE[b];
export const useBrand = () => {
  const b = brandOf(useScenario().tier);
  return { brand: b, c: PALETTE[b] };
};

const KEYS: (keyof Omit<Palette, "ramp" | "font" | "mono">)[] = ["ink", "text", "muted", "faint", "line", "border", "border2", "subtle", "hover", "track", "badgeBg", "badgeFg", "badgeLine", "link", "accent", "accentSoft", "action", "actionHover", "actionText", "toastAction"];
const varName = (k: string) => `--c-${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;

// Koherent's headline numbers (the .k-num ones) are set in JetBrains Mono, as
// on the Koherent site. Everywhere else Schibsted keeps its normal figures,
// because its tabular ones widen the commas ("18 , 240").
// Koherent pages sit on the brand's warm white (the site's #F6F3EE, a shade
// lighter so white panels still read as panels), and headings take the site's
// display weight: 800 with tight tracking.
export const BRAND_CSS = `
[data-brand="koherent"] .tabular-nums { font-variant-numeric: normal; }
[data-brand="koherent"] .k-num { font-family: var(--c-mono); font-weight: 500; letter-spacing: -0.02em; }
[data-brand="koherent"] h1 { font-weight: 800; letter-spacing: -0.02em; }
[data-brand="koherent"] h2 { font-weight: 700; letter-spacing: -0.01em; }
`;

// The variables for a whole page. `surface` is what avatars and pins sit on.
export function themeVars(b: Brand): CSSProperties {
  const p = PALETTE[b];
  const v: Record<string, string> = { "--c-font": p.font, "--c-mono": p.mono, "--c-surface": "#FFFFFF", "--c-side": "#FFFFFF", "--c-page": b === "koherent" ? "#F9F7F4" : "#FFFFFF" };
  for (const k of KEYS) v[varName(k)] = p[k];
  return v as CSSProperties;
}

// Koherent's sidebar is plum, so the same components read light on dark there.
export const koherentSideVars = {
  "--c-side": "#461948", "--c-surface": "#461948",
  "--c-ink": "#F6F3EE", "--c-text": "rgba(246,243,238,0.86)", "--c-muted": "rgba(246,243,238,0.62)",
  "--c-line": "rgba(246,243,238,0.14)", "--c-border": "rgba(246,243,238,0.22)",
  "--c-subtle": "rgba(246,243,238,0.08)", "--c-hover": "rgba(246,243,238,0.08)",
  "--c-accent-soft": "rgba(199,174,230,0.2)", "--c-action-text": "#FFFFFF", "--c-link": "#C7AEE6",
} as CSSProperties;

// ── The K (deck slides 16–18) ─────────────────────────────────────────────────
// An upright bar and an arrowhead whose tip stops short of it. The gap is where
// our people sit at the customer's table, so it never closes.
const K_BAR = "M0 0 H3 V12 H0 Z";
const K_ARROW = "M8.6 0 H12 L7.9 6 L12 12 H8.6 L4.5 6 Z";

export function KMark({ color = "currentColor", size = 12 }: { color?: string; size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} aria-hidden style={{ display: "inline-block", flex: "none" }}>
      <path d={K_BAR} fill={color} />
      <path d={K_ARROW} fill={color} />
    </svg>
  );
}

// One K, as tall as the capitals, then "oherent"; never a K beside the word.
export function KoherentLogo({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <span role="img" aria-label="Koherent" style={{ fontFamily: PALETTE.koherent.font, fontSize: size, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, color, whiteSpace: "nowrap" }}>
      <svg viewBox="0 0 12 12" aria-hidden style={{ height: "0.71em", width: "0.71em", marginRight: "0.035em", verticalAlign: "baseline", display: "inline-block" }}>
        <path d={K_BAR} fill={color} />
        <path d={K_ARROW} fill={color} />
      </svg>
      <span aria-hidden>oherent</span>
    </span>
  );
}

export function BrandLogo({ brand, small }: { brand: Brand; small?: boolean }) {
  return brand === "koherent"
    ? <KoherentLogo size={small ? 18 : 22} color="var(--c-ink)" />
    // eslint-disable-next-line @next/next/no-img-element
    : <img src="/shiptime-logo.svg" alt="ShipTime" width={110} height={34} className={small ? "h-5 w-auto" : "h-6 w-auto"} />;
}

// The steps: the arrowhead turned and repeated. Only ever shows progress.
export function Chevrons({ total, done, size = 12 }: { total: number; done: number; size?: number }) {
  return (
    <span aria-hidden style={{ display: "inline-flex", gap: size * 0.28 }}>
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} viewBox="0 0 8 12" style={{ width: size * 0.67, height: size }}>
          <path d="M0 0 H3.4 L8 6 L3.4 12 H0 L4.6 6 Z" fill={i < done ? "var(--c-action)" : "var(--c-border)"} />
        </svg>
      ))}
    </span>
  );
}

// The performance score as Koherent's triangle (deck slide 22): cost at the
// top, operations bottom left, experience bottom right. Each corner of the
// filled shape sits as far out as that part scores, out of 100.
export function ScoreMark({ parts, size = 22 }: { parts: [number, number, number]; size?: number }) {
  const corners = [[30, 3], [3, 50], [57, 50]];
  const c = [30, 34.3];
  const inner = corners.map(([x, y], i) => `${c[0] + ((x - c[0]) * parts[i]) / 100},${c[1] + ((y - c[1]) * parts[i]) / 100}`).join(" ");
  return (
    <svg viewBox="0 0 60 54" width={size} height={(size * 54) / 60} aria-hidden style={{ flex: "none" }}>
      <polygon points={corners.map((p) => p.join(",")).join(" ")} fill="none" style={{ stroke: "var(--c-border)" }} strokeWidth={2.5} strokeLinejoin="round" />
      <polygon points={inner} style={{ fill: "var(--c-accent-soft)", stroke: "var(--c-action)" }} strokeWidth={2.5} strokeLinejoin="round" />
    </svg>
  );
}

// ── The ask ──────────────────────────────────────────────────────────────────
// ShipTime makes leads for Koherent (Oct 22 L10). At Shopify Plus the biggest
// source was support's "ask": when a merchant hit a problem Plus solves, they
// were shown it and passed to sales. Here a ShipTime account can look inside
// an example Koherent account before talking to anyone, as Rustam suggested.
export function KoherentAsk({ onPreview }: { onPreview: () => void }) {
  const k = PALETTE.koherent;
  return (
    <div className="mx-1 overflow-hidden rounded-lg" style={{ background: k.action, color: "#F6F3EE", fontFamily: k.font }}>
      <div className="p-3">
        <KoherentLogo size={15} color="#F6F3EE" />
        <p className="mt-2 text-[12.5px] leading-[1.45]" style={{ color: "rgba(246,243,238,0.8)" }}>Shipping from more than one place, or about to? Carriers, warehouses and a team, built around your orders.</p>
        <button type="button" onClick={onPreview} className="mt-2.5 inline-flex items-center gap-1 text-[13px] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7AEE6]" style={{ color: "#C7AEE6" }}>
          See an example account <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
