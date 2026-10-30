"use client";

import { C, K_ARROW, K_BAR, sans, useInView, useReducedMotion } from "./koherent-motion";

// ── NetworkLattice — Michael's network graphic ───────────────────────────────
// Michael (Oct 19): "the dots give it a tech feel and the idea of a network… a
// network graphic (lattice) depicting our network of carriers & warehouses
// that we use to implement our solution". It sits on /koherent/what-we-bring;
// the home page keeps the bento Matteo picked on Oct 23.
//
// Rebuilt from the Oct 23 NetworkLive (git 2d9a878) without its made-up
// "orders this week" counter. Labels stay generic, with no partner names or
// cities. Orders ride the lines into the K once the graphic is in view; with
// reduced motion it's a still picture.

// Two layouts for the same network. The wide one is the home-page-style
// band; the compact one is for the What we bring hero, where the drawing sits
// in half the page: a taller box, the K further left, nodes spread so every
// label has room at its normal size, and the right-hand labels flipped to the
// left of their marker so nothing runs off the edge.
type Node = { x: number; y: number; label: string; kind: "carrier" | "site" | "system" | "door"; left?: boolean };
const WIDE = {
  w: 1100, h: 440, hub: { x: 190, y: 220 },
  nodes: [
    { x: 430, y: 62, label: "National couriers", kind: "carrier" },
    { x: 560, y: 150, label: "Regional couriers", kind: "carrier" },
    { x: 470, y: 290, label: "LTL & FTL", kind: "carrier" },
    { x: 430, y: 392, label: "Last-mile partners", kind: "carrier" },
    { x: 745, y: 80, label: "Partner warehouses", kind: "site" },
    { x: 790, y: 222, label: "Your store & ERP", kind: "system" },
    { x: 690, y: 360, label: "Customs", kind: "system" },
    // set apart from the network, and reached by a dashed line: they're where it
    // all ends up, not a piece of it (Michael, Oct 27)
    { x: 930, y: 300, label: "Your customers", kind: "door" },
  ] as Node[],
};
const COMPACT = {
  w: 640, h: 520, hub: { x: 92, y: 260 },
  nodes: [
    { x: 250, y: 56, label: "National couriers", kind: "carrier" },
    { x: 300, y: 150, label: "Regional couriers", kind: "carrier" },
    { x: 250, y: 300, label: "LTL & FTL", kind: "carrier" },
    { x: 260, y: 440, label: "Last-mile partners", kind: "carrier" },
    { x: 606, y: 110, label: "Partner warehouses", kind: "site", left: true },
    { x: 606, y: 230, label: "Your store & ERP", kind: "system", left: true },
    { x: 560, y: 370, label: "Customs", kind: "system", left: true },
    { x: 606, y: 480, label: "Your customers", kind: "door", left: true },
  ] as Node[],
};
const LEGEND: [string, Node["kind"]][] = [
  ["Carriers", "carrier"],
  ["Warehouses", "site"],
  ["Your systems", "system"],
  ["Your customers", "door"],
];

const pathTo = (hub: { x: number; y: number }, n: { x: number; y: number }) => {
  const mx = (n.x + hub.x) / 2;
  return `M${n.x} ${n.y} C ${mx + 60} ${n.y}, ${mx - 60} ${hub.y}, ${hub.x + 46} ${hub.y}`;
};

function Mark({ kind, x, y }: { kind: Node["kind"]; x: number; y: number }) {
  if (kind === "site") return <rect x={x - 8} y={y - 8} width="16" height="16" fill={C.lilac} />;
  if (kind === "carrier") return <circle cx={x} cy={y} r="8" fill={C.violet} stroke={C.lilac} strokeWidth="2" />;
  if (kind === "system") return <rect x={x - 8} y={y - 8} width="16" height="16" rx="3" fill="none" stroke={C.lilac} strokeWidth="2" />;
  return <circle cx={x} cy={y} r="6" fill={C.onDark} />;
}

export function NetworkLattice({ compact = false }: { compact?: boolean } = {}) {
  const L = compact ? COMPACT : WIDE;
  const { w: W, h: H, hub: HUB } = L;
  const path = (n: { x: number; y: number }) => pathTo(HUB, n);
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const moving = inView && !reduced;
  // The glow sits just right of the K and is sized to fade to nothing before
  // the drawing's edges, so it is never cut off; the dots fade out in an oval.
  // Together there's no box around the drawing on the dark section (Jenny at
  // the Oct 29 L10: "smooth that line out"; Matteo, Oct 30: "blended better").
  // Ids carry the layout, since the two layouts' gradients differ.
  const id = compact ? "klc" : "klw";
  const glowX = Math.round(HUB.x * 1.37);
  const glowY = Math.min(HUB.y, H - HUB.y);
  return (
    <div ref={ref} style={{ maxWidth: 1000, margin: "0 auto" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        role="img"
        aria-label="Our network: couriers, regional carriers, LTL and FTL, last-mile partners, partner warehouses, your store and ERP, customs and borders, and your customers, all connected into Koherent"
      >
        <defs>
          <pattern id="kl-dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="rgba(199,174,230,0.16)" />
          </pattern>
          <radialGradient id={`${id}-glow`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform={`translate(${glowX} ${HUB.y}) scale(${glowX} ${glowY})`}>
            <stop offset="0" stopColor={C.plum} stopOpacity="0.95" />
            <stop offset="0.35" stopColor={C.plum} stopOpacity="0.62" />
            <stop offset="0.7" stopColor={C.plum} stopOpacity="0.2" />
            <stop offset="1" stopColor={C.plum} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-fade`} cx="50%" cy="50%" r="50%">
            <stop offset="0.45" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.75" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id={`${id}-soft`}>
            <rect width={W} height={H} fill={`url(#${id}-fade)`} />
          </mask>
        </defs>
        <rect width={W} height={H} fill="url(#kl-dots)" mask={`url(#${id}-soft)`} />
        <rect width={W} height={H} fill={`url(#${id}-glow)`} />
        {L.nodes.map((n) => (
          <path key={`p${n.label}`} d={path(n)} stroke="rgba(199,174,230,0.32)" strokeWidth="1.5" fill="none" strokeDasharray={n.kind === "door" ? "6 7" : undefined} />
        ))}
        {moving &&
          L.nodes.map((n, i) => (
            <circle key={`d${n.label}`} r="4.5" fill={C.lilac}>
              <animateMotion dur={`${2.4 + (i % 4) * 0.5}s`} begin={`${(i * 0.41) % 2}s`} repeatCount="indefinite" path={path(n)} />
            </circle>
          ))}
        {L.nodes.map((n) => {
          const w = n.label.length * 7.9 + 24;
          const left = Boolean(n.left);
          return (
            <g key={`n${n.label}`}>
              <Mark kind={n.kind} x={n.x} y={n.y} />
              <g className="kl-label">
                <rect x={left ? n.x - 16 - w : n.x + 16} y={n.y - 15} width={w} height="30" rx="15" fill="rgba(246,243,238,0.08)" stroke="rgba(199,174,230,0.28)" />
                <text x={left ? n.x - 16 - w + 11 : n.x + 16 + 11} y={n.y} dominantBaseline="central" style={sans} fontSize="14.5" fontWeight="600" fill={C.onDark}>
                  {n.label}
                </text>
              </g>
            </g>
          );
        })}
        <g transform={`translate(${HUB.x - 42} ${HUB.y - 42})`}>
          <rect width="84" height="84" rx="6" fill={C.plum} stroke={C.lilac} strokeOpacity="0.45" />
          <g transform="translate(22 22) scale(3.33)">
            <path d={K_BAR} fill={C.paper} />
            <path d={K_ARROW} fill={C.paper} />
          </g>
        </g>
      </svg>
      {/* on a phone the labels are too small inside the drawing, so a legend
          names the four kinds of node instead */}
      <ul className="kl-legend" aria-hidden style={{ listStyle: "none", padding: 0, margin: "16px 0 0", display: "none", flexWrap: "wrap", justifyContent: "center", gap: "10px 18px" }}>
        {LEGEND.map(([label, kind]) => (
          <li key={label} style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.onDarkDim }}>
            <svg viewBox="0 0 20 20" style={{ width: 16, height: 16 }}>
              <Mark kind={kind} x={10} y={10} />
            </svg>
            {label}
          </li>
        ))}
      </ul>
      <style>{`
        @media (max-width: 640px) {
          .kl-label { display: none; }
          .kl-legend { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
