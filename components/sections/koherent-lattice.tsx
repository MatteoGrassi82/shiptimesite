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

const W = 1000;
const H = 440;
const HUB = { x: 190, y: 220 };
const NODES: { x: number; y: number; label: string; kind: "carrier" | "site" | "system" | "door" }[] = [
  { x: 430, y: 62, label: "Couriers", kind: "carrier" },
  { x: 560, y: 150, label: "Regional carriers", kind: "carrier" },
  { x: 470, y: 290, label: "LTL & FTL", kind: "carrier" },
  { x: 430, y: 392, label: "Last-mile partners", kind: "carrier" },
  { x: 745, y: 80, label: "Partner warehouses", kind: "site" },
  { x: 790, y: 222, label: "Your store & ERP", kind: "system" },
  { x: 690, y: 360, label: "Customs & borders", kind: "system" },
  { x: 830, y: 296, label: "Your customers", kind: "door" },
];
const LEGEND: [string, (typeof NODES)[number]["kind"]][] = [
  ["Carriers", "carrier"],
  ["Warehouses", "site"],
  ["Your systems", "system"],
  ["Your customers", "door"],
];

const path = (n: { x: number; y: number }) => {
  const mx = (n.x + HUB.x) / 2;
  return `M${n.x} ${n.y} C ${mx + 60} ${n.y}, ${mx - 60} ${HUB.y}, ${HUB.x + 46} ${HUB.y}`;
};

function Mark({ kind, x, y }: { kind: (typeof NODES)[number]["kind"]; x: number; y: number }) {
  if (kind === "site") return <rect x={x - 8} y={y - 8} width="16" height="16" fill={C.lilac} />;
  if (kind === "carrier") return <circle cx={x} cy={y} r="8" fill={C.violet} stroke={C.lilac} strokeWidth="2" />;
  if (kind === "system") return <rect x={x - 8} y={y - 8} width="16" height="16" rx="3" fill="none" stroke={C.lilac} strokeWidth="2" />;
  return <circle cx={x} cy={y} r="6" fill={C.onDark} />;
}

export function NetworkLattice() {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const moving = inView && !reduced;
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
          <radialGradient id="kl-glow" cx="19%" cy="50%" r="55%">
            <stop offset="0%" stopColor={C.plum} stopOpacity="0.95" />
            <stop offset="100%" stopColor={C.ink} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#kl-dots)" />
        <rect width={W} height={H} fill="url(#kl-glow)" />
        {NODES.map((n) => (
          <path key={`p${n.label}`} d={path(n)} stroke="rgba(199,174,230,0.32)" strokeWidth="1.5" fill="none" />
        ))}
        {moving &&
          NODES.map((n, i) => (
            <circle key={`d${n.label}`} r="4.5" fill={C.lilac}>
              <animateMotion dur={`${2.4 + (i % 4) * 0.5}s`} begin={`${(i * 0.41) % 2}s`} repeatCount="indefinite" path={path(n)} />
            </circle>
          ))}
        {NODES.map((n) => {
          const w = n.label.length * 7.9 + 24;
          return (
            <g key={`n${n.label}`}>
              <Mark kind={n.kind} x={n.x} y={n.y} />
              <g className="kl-label">
                <rect x={n.x + 16} y={n.y - 15} width={w} height="30" rx="15" fill="rgba(246,243,238,0.08)" stroke="rgba(199,174,230,0.28)" />
                <text x={n.x + 27} y={n.y} dominantBaseline="central" style={sans} fontSize="14.5" fontWeight="600" fill={C.onDark}>
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
