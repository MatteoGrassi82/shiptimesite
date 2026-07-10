import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { ds, display, mono } from "./theme";

// Film 03 — Smart routing, told as an animated flowchart. Orders flow into the
// routing rules, each auto-routes to the right carrier and on to a label, and a
// single exception peels off to a human (the account lead). Shipment "tokens"
// travel the graph so it reads as an operating system routing work, not a mock.

type Node = { id: string; x: number; y: number; w: number; h: number; label: string; sub?: string; start: number; accent?: boolean };

const NODES: Node[] = [
  { id: "orders", x: 540, y: 420, w: 260, h: 78, label: "Orders", sub: "3 in", start: 16 },
  { id: "rules", x: 540, y: 590, w: 322, h: 86, label: "Routing rules", sub: "weight · dest · service", start: 24, accent: true },
  { id: "ups", x: 250, y: 785, w: 198, h: 70, label: "UPS Ground", start: 34 },
  { id: "cp", x: 540, y: 785, w: 198, h: 70, label: "Canada Post", start: 39 },
  { id: "fedex", x: 830, y: 785, w: 198, h: 70, label: "FedEx Intl", start: 44 },
  { id: "label", x: 540, y: 960, w: 300, h: 78, label: "Label + tracking", start: 54 },
  { id: "done", x: 385, y: 1140, w: 200, h: 74, label: "Delivered", start: 62 },
  { id: "lead", x: 775, y: 1140, w: 236, h: 86, label: "Account lead", sub: "handles it", start: 62, accent: true },
];
const NODE = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<string, Node>;

type Link = { from: string; to: string; start: number; exception?: boolean };
const LINKS: Link[] = [
  { from: "orders", to: "rules", start: 22 },
  { from: "rules", to: "ups", start: 30 },
  { from: "rules", to: "cp", start: 34 },
  { from: "rules", to: "fedex", start: 38 },
  { from: "ups", to: "label", start: 50 },
  { from: "cp", to: "label", start: 52 },
  { from: "fedex", to: "label", start: 54 },
  { from: "label", to: "done", start: 60 },
  { from: "label", to: "lead", start: 60, exception: true },
];

type Tok = { nodes: string[]; frames: number[]; exception?: boolean };
const TOKENS: Tok[] = [
  { nodes: ["orders", "rules", "ups", "label", "done"], frames: [46, 64, 82, 104, 124] },
  { nodes: ["orders", "rules", "cp", "label", "done"], frames: [62, 80, 98, 120, 140] },
  { nodes: ["orders", "rules", "fedex", "label", "lead"], frames: [78, 96, 114, 136, 158], exception: true },
];

const appear = (frame: number, start: number) =>
  interpolate(frame, [start, start + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

function linkPath(a: Node, b: Node) {
  const sx = a.x, sy = a.y + a.h / 2, ex = b.x, ey = b.y - b.h / 2, my = (sy + ey) / 2;
  return `M ${sx} ${sy} C ${sx} ${my} ${ex} ${my} ${ex} ${ey}`;
}

function FlowNode({ n }: { n: Node }) {
  const frame = useCurrentFrame();
  const op = appear(frame, n.start);
  return (
    <g opacity={op}>
      <rect x={n.x - n.w / 2} y={n.y - n.h / 2} width={n.w} height={n.h} rx={16} fill="#12161A" stroke={n.accent ? ds.teal : ds.line2} strokeWidth={n.accent ? 2 : 1.4} />
      <text x={n.x} y={n.sub ? n.y - 3 : n.y + 9} textAnchor="middle" style={{ fontFamily: display, fontWeight: 700, fontSize: 27, fill: ds.text }}>{n.label}</text>
      {n.sub && <text x={n.x} y={n.y + 23} textAnchor="middle" style={{ fontFamily: mono, fontSize: 17, fill: ds.muted }}>{n.sub}</text>}
    </g>
  );
}

function LinkPath({ link }: { link: Link }) {
  const frame = useCurrentFrame();
  const d = linkPath(NODE[link.from], NODE[link.to]);
  const dash = 720;
  const off = interpolate(frame, [link.start, link.start + 18], [dash, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <path
      d={d}
      fill="none"
      stroke={link.exception ? ds.amber : ds.line2}
      strokeWidth={2}
      strokeDasharray={dash}
      strokeDashoffset={off}
      opacity={appear(frame, link.start) * 0.85}
      markerEnd={link.exception ? "url(#arrowA)" : "url(#arrow)"}
    />
  );
}

function Token({ tok }: { tok: Tok }) {
  const frame = useCurrentFrame();
  const xs = tok.nodes.map((id) => NODE[id].x);
  const ys = tok.nodes.map((id) => NODE[id].y);
  const x = interpolate(frame, tok.frames, xs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame, tok.frames, ys, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const f0 = tok.frames[0], fl = tok.frames[tok.frames.length - 1];
  const op = interpolate(frame, [f0 - 4, f0, fl, fl + 16], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const c = tok.exception ? ds.amber : ds.tealBr;
  return (
    <g opacity={op}>
      <circle cx={x} cy={y} r={20} fill={c} opacity={0.16} />
      <circle cx={x} cy={y} r={9} fill={c} />
    </g>
  );
}

export const SmartRoutingFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame, fps, config: { damping: 24, stiffness: 160, mass: 0.9 } });
  const ty = interpolate(t, [0, 1], [-18, 0]);
  const leadPulse = interpolate(frame, [150, 162, 178], [0, 1, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const footOp = interpolate(frame, [196, 218], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(900px 560px at 50% 30%, rgba(51,168,156,0.10), transparent 62%), ${ds.bg}` }}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1350">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={ds.line2} />
          </marker>
          <marker id="arrowA" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={ds.amber} />
          </marker>
        </defs>

        <g opacity={t} transform={`translate(0 ${ty})`}>
          <text x={76} y={140} style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.18em", fill: ds.teal }}>SMART ROUTING</text>
          <text x={74} y={220} style={{ fontFamily: display, fontWeight: 700, fontSize: 62, letterSpacing: "-0.02em", fill: ds.text }}>It routes itself.</text>
        </g>

        {LINKS.map((l, i) => (
          <LinkPath key={i} link={l} />
        ))}

        {/* lead-node highlight ring — pulses when the exception token arrives */}
        <rect x={NODE.lead.x - NODE.lead.w / 2 - 4} y={NODE.lead.y - NODE.lead.h / 2 - 4} width={NODE.lead.w + 8} height={NODE.lead.h + 8} rx={20} fill="none" stroke={ds.amber} strokeWidth={2} opacity={leadPulse} />

        {NODES.map((n) => (
          <FlowNode key={n.id} n={n} />
        ))}
        {TOKENS.map((tk, i) => (
          <Token key={i} tok={tk} />
        ))}

        <text x={540} y={1290} textAnchor="middle" opacity={footOp} style={{ fontFamily: display, fontSize: 30, fill: ds.muted }}>
          Set the rules once. We run the exceptions.
        </text>
      </svg>
    </AbsoluteFill>
  );
};
