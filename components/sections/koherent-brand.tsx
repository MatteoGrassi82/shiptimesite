import type { CSSProperties } from "react";

// ── Koherent brand basics ────────────────────────────────────────────────────
// Tokens, the site map and the K. Kept apart from koherent-ui.tsx so the
// client nav (koherent-nav.tsx) can use them without an import cycle. No
// "use client": server components read these plain values directly.

// deck slide 36
export const K = {
  ink: "#17101C",
  plum: "#461948",
  violet: "#6E3A80",
  lilac: "#C7AEE6",
  mist: "#EEE8F3",
  // Pure white since revision 2 (Jenny, Oct 29 L10: "get away from the
  // tan-ish white", it read as AI). Was paper #F6F3EE, card #FFFDFA.
  paper: "#FFFFFF",
  card: "#FFFFFF",
  // the faintest tint, for a panel inside a box or a hovered menu row
  wash: "#F8F6FA",
  stone: "#6A6272",
  line: "#DCD4E2",
  onDark: "#F6F3EE",
  onDarkDim: "rgba(246,243,238,0.74)",
  darkLine: "rgba(246,243,238,0.16)",
};

export const sans: CSSProperties = { fontFamily: "var(--font-schibsted), 'Schibsted Grotesk', system-ui, sans-serif" };
export const mono: CSSProperties = { fontFamily: "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, monospace" };
export const display: CSSProperties = { ...sans, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 0.98 };
export const title: CSSProperties = { ...sans, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.08 };

export const inner: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "clamp(76px, 9vw, 140px) clamp(20px, 4vw, 56px)",
};

// The site map. Revision 2 (Oct 30), "our story, her structure": Jenny's
// three doors and her four solutions (one How it works page), inside the
// first revision's story. What we bring and How we work fold into How it
// works and redirect there.
export const PAGES = {
  home: "/koherent",
  growing: "/koherent/growing-brands",
  enterprise: "/koherent/enterprise-brands",
  partners: "/koherent/partners",
  works: "/koherent/how-it-works",
  pricing: "/koherent/pricing",
  review: "/koherent/review",
  cases: "/koherent/case-studies",
  score: "/koherent/score",
  contact: "/koherent/contact",
};

// The checklist page for the review (/koherent/review): Jenny's notes, the
// decisions and where each ask lives. Off the site's menus; set to false
// before launch and the page goes.
export const REVIEW = true;

// The story, in order. Detail pages show where they sit in it and hand on to
// the next one, so a visitor who goes deeper still gets the whole story.
export const CHAPTERS: { href: string; name: string }[] = [
  { href: PAGES.works, name: "How it works" },
  { href: PAGES.cases, name: "Customer stories" },
  { href: PAGES.score, name: "Your logistics score" },
];

// The menu: one way to slice the offer (who it's for), then how it works,
// the proof and the price. `line` is the sentence under an item in the open
// menu.
export type NavItem = { name: string; href?: string; line?: string };
export type NavMenu = { name: string; href?: string; groups: { title?: string; items: NavItem[] }[]; foot?: NavItem };
export const NAV: NavMenu[] = [
  {
    name: "Who we help",
    groups: [
      {
        items: [
          { name: "Growing brands", href: PAGES.growing, line: "500 to 5,000 orders a month, outgrowing the tools you started with." },
          { name: "Enterprise brands", href: PAGES.enterprise, line: "More than one site and your own contracts. One partner accountable." },
          { name: "3PL and fulfillment partners", href: PAGES.partners, line: "You run the warehouse. We bring the merchants." },
        ],
      },
    ],
    foot: { name: "Not sure? Find your door", href: `${PAGES.home}#doors` },
  },
  { name: "How it works", href: PAGES.works, groups: [] },
  { name: "Customer stories", href: PAGES.cases, groups: [] },
  { name: "Pricing", href: PAGES.pricing, groups: [] },
];

// ── the K and the shapes cut from it (deck slides 16–17, 26) ─────────────────
// Drawn on a 12×12 grid: an upright bar, then an arrowhead whose tip stops
// short of the bar. The gap is the point ("where our people sit at your
// table"), so it never closes.
export const K_BAR = "M0 0 H3 V12 H0 Z";
export const K_ARROW = "M8.6 0 H12 L7.9 6 L12 12 H8.6 L4.5 6 Z";
export const CHEV = "M0 0 H3.4 L8 6 L3.4 12 H0 L4.6 6 Z";

export function KMark({ color = K.plum, style }: { color?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden style={{ display: "inline-block", ...style }}>
      <path d={K_BAR} fill={color} />
      <path d={K_ARROW} fill={color} />
    </svg>
  );
}

// The K is the first letter of the name (deck slide 18): one K, as tall as the
// capitals and as thick as the letters, never a K next to the word.
export function Logo({ size = 28, color = K.plum }: { size?: number | string; color?: string }) {
  return (
    <span
      aria-label="Koherent"
      role="img"
      style={{ ...sans, fontSize: size, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, color, whiteSpace: "nowrap" }}
    >
      <KMark color={color} style={{ height: "0.71em", width: "0.71em", marginRight: "0.035em", verticalAlign: "baseline" }} />
      <span aria-hidden>oherent</span>
    </span>
  );
}
