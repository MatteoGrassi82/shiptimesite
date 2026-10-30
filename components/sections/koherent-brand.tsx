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

// The site map. Revision 2 (Oct 30) follows Jenny's navigation ("Koherent
// Website Solutions Architecture", Oct 29): three doors (who it's for), four
// solutions (what it does), then Platform, Network, Integrations, Pricing and
// Resources. The first revision's pages stay up (What we bring, How we work)
// and the new pages link to them, so none of Michael's or Chris's asks drop.
export const PAGES = {
  home: "/koherent",
  los: "/koherent/logistics-operating-system",
  growing: "/koherent/growing-brands",
  enterprise: "/koherent/enterprise-brands",
  partners: "/koherent/partners",
  ship: "/koherent/ship",
  fulfill: "/koherent/fulfill",
  optimize: "/koherent/optimize",
  manage: "/koherent/manage",
  platform: "/koherent/platform",
  network: "/koherent/network",
  integrations: "/koherent/integrations",
  pricing: "/koherent/pricing",
  review: "/koherent/review",
  bring: "/koherent/what-we-bring",
  how: "/koherent/how-we-work",
  cases: "/koherent/case-studies",
  score: "/koherent/score",
  contact: "/koherent/contact",
};

// Review build: Jenny's bracketed "Confirm…" notes show as tags on the pages,
// with a switch to hide them, and /koherent/review lists them all. Set to
// false before launch and the tags, the switch and the review page go.
export const REVIEW = true;

// Jenny's menus, in her order. `line` is the one sentence under an item in
// the open menu, taken from her copy; `soon` marks a Resources item that has
// no page yet (shown, not linked).
export type NavItem = { name: string; href?: string; line?: string; soon?: boolean };
export type NavMenu = { name: string; href?: string; groups: { title?: string; items: NavItem[] }[]; foot?: NavItem };
export const NAV: NavMenu[] = [
  {
    name: "Solutions",
    groups: [
      {
        title: "Who we help",
        items: [
          { name: "Growing brands", href: PAGES.growing, line: "Shipping 50 to 1,000 orders a month and outgrowing the tools you started with." },
          { name: "Enterprise brands", href: PAGES.enterprise, line: "More than one location, your own carrier contracts, one partner accountable." },
          { name: "3PL and fulfillment partners", href: PAGES.partners, line: "More merchants, better shipping margins and a network that sends work your way." },
        ],
      },
      {
        title: "What we do",
        items: [
          { name: "Ship", href: PAGES.ship, line: "Every parcel and pallet through the best carrier at the best rate." },
          { name: "Fulfill", href: PAGES.fulfill, line: "Inventory in the right warehouses, without owning a building." },
          { name: "Optimize", href: PAGES.optimize, line: "The money and time hiding in your shipping data." },
          { name: "Manage", href: PAGES.manage, line: "Your systems connected, and one team responsible for the outcome." },
        ],
      },
    ],
    foot: { name: "What is a logistics operating system?", href: PAGES.los },
  },
  {
    name: "Platform",
    href: PAGES.platform,
    groups: [
      {
        items: [
          { name: "Rate shopping", href: `${PAGES.platform}#rate-shopping` },
          { name: "Labels", href: `${PAGES.platform}#labels` },
          { name: "Automation", href: `${PAGES.platform}#automation` },
          { name: "Freight", href: `${PAGES.ship}#inside` },
          { name: "Returns", href: `${PAGES.platform}#returns` },
          { name: "Analytics", href: `${PAGES.platform}#analytics` },
          { name: "Custom shipping applets", href: `${PAGES.manage}#applets` },
          { name: "API and developer hub", href: `${PAGES.platform}#api` },
        ],
      },
    ],
  },
  {
    name: "Network",
    href: PAGES.network,
    groups: [
      {
        items: [
          { name: "Carriers", href: `${PAGES.network}#carriers` },
          { name: "Warehouse locations", href: `${PAGES.network}#warehouses` },
          { name: "Final mile", href: `${PAGES.network}#carriers` },
          { name: "Partner 3PL program", href: PAGES.partners },
        ],
      },
    ],
  },
  {
    name: "Integrations",
    href: PAGES.integrations,
    groups: [
      {
        items: [
          { name: "Carriers", href: `${PAGES.integrations}#carriers` },
          { name: "Marketplaces", href: `${PAGES.integrations}#marketplaces` },
          { name: "Online stores", href: `${PAGES.integrations}#stores` },
          { name: "WMS and ERP", href: `${PAGES.integrations}#systems` },
          { name: "APIs", href: `${PAGES.integrations}#api` },
        ],
      },
    ],
  },
  { name: "Pricing", href: PAGES.pricing, groups: [] },
  {
    name: "Resources",
    groups: [
      {
        items: [
          { name: "Customer stories", href: PAGES.cases },
          { name: "Logistics Performance Score", href: PAGES.score },
          { name: "Benchmark report", soon: true },
          { name: "Blog", soon: true },
          { name: "Podcast", soon: true },
          { name: "Guides", soon: true },
        ],
      },
    ],
  },
];

// The story, in order. Detail pages show where they sit in it and hand on to
// the next one, so a visitor who goes deeper still gets the whole story.
export const CHAPTERS: { href: string; name: string }[] = [
  { href: PAGES.bring, name: "What we bring" },
  { href: PAGES.how, name: "How we work" },
  { href: PAGES.cases, name: "Case studies" },
  { href: PAGES.score, name: "Your logistics score" },
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
