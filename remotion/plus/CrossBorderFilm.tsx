import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { ds, display, mono } from "./theme";

// Film 03 — Cross-border. A slow-turning globe with lanes arcing between
// countries, then a landed-cost readout resolves (duty + tax → total).
function Globe() {
  const frame = useCurrentFrame();
  const rot = frame * 0.35;
  const arc = (start: number) =>
    interpolate(frame, [start, start + 45], [140, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pin = (delay: number) => 0.55 + 0.45 * Math.sin((frame - delay) / 7);

  return (
    <svg width={620} height={620} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <circle cx={50} cy={50} r={34} stroke={ds.line2} strokeWidth={0.5} fill="none" />
      <g stroke={ds.line} strokeWidth={0.4} fill="none" transform={`rotate(${rot} 50 50)`}>
        <ellipse cx={50} cy={50} rx={12} ry={34} />
        <ellipse cx={50} cy={50} rx={24} ry={34} />
        <line x1={16} y1={50} x2={84} y2={50} />
      </g>
      <path d="M18 34 Q50 40 82 34" stroke={ds.line} strokeWidth={0.4} fill="none" />
      <path d="M18 66 Q50 60 82 66" stroke={ds.line} strokeWidth={0.4} fill="none" />
      <path d="M32 60 Q50 18 70 40" stroke={ds.tealBr} strokeWidth={0.9} fill="none" strokeLinecap="round" strokeDasharray={140} strokeDashoffset={arc(50)} />
      <path d="M38 66 Q66 52 74 30" stroke={ds.teal} strokeWidth={0.9} fill="none" strokeLinecap="round" strokeDasharray={140} strokeDashoffset={arc(66)} />
      <path d="M30 44 Q44 66 66 64" stroke={ds.tealBr} strokeWidth={0.8} fill="none" strokeLinecap="round" strokeDasharray={140} strokeDashoffset={arc(82)} />
      <circle cx={32} cy={60} r={1.7} fill={ds.tealBr} opacity={pin(0)} />
      <circle cx={70} cy={40} r={1.7} fill={ds.tealBr} opacity={pin(20)} />
      <circle cx={74} cy={30} r={1.7} fill={ds.tealBr} opacity={pin(40)} />
      <circle cx={66} cy={64} r={1.5} fill={ds.teal} opacity={pin(60)} />
    </svg>
  );
}

function CostRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
      <span style={{ fontFamily: mono, fontSize: 26, color: ds.muted }}>{label}</span>
      <span style={{ fontFamily: mono, fontSize: 26, color: ds.text }}>{value}</span>
    </div>
  );
}

export const CrossBorderFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEnter = spring({ frame, fps, config: { damping: 24, stiffness: 160, mass: 0.9 } });
  const titleY = interpolate(titleEnter, [0, 1], [-18, 0]);

  const card = spring({ frame: frame - 150, fps, config: { damping: 22, stiffness: 170, mass: 0.8 } });
  const cardY = interpolate(card, [0, 1], [40, 0]);
  const total = interpolate(frame, [162, 214], [0, 164.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const footOp = interpolate(frame, [200, 220], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(900px 600px at 50% 42%, rgba(51,168,156,0.10), transparent 62%), ${ds.bg}` }}>
      <AbsoluteFill style={{ padding: 76, display: "flex", flexDirection: "column" }}>
        <div style={{ transform: `translateY(${titleY}px)`, opacity: titleEnter }}>
          <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.18em", textTransform: "uppercase", color: ds.teal, marginBottom: 18 }}>
            Cross-border
          </div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 66, lineHeight: 1.03, letterSpacing: "-0.03em", color: ds.text }}>
            One account.
            <br />
            220+ countries.
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
          <Globe />
        </div>

        <div
          style={{
            transform: `translateY(${cardY}px)`,
            opacity: card,
            background: "rgba(10,13,14,0.72)",
            border: `1.5px solid ${ds.line}`,
            borderRadius: 18,
            padding: "28px 34px",
          }}
        >
          <CostRow label="Duty" value="$12.40" />
          <CostRow label="Tax" value="$9.85" />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${ds.line}`, marginTop: 14, paddingTop: 20 }}>
            <span style={{ fontFamily: display, fontSize: 30, color: ds.text }}>Landed cost</span>
            <span style={{ fontFamily: display, fontWeight: 700, fontSize: 44, color: ds.tealBr, fontVariantNumeric: "tabular-nums" }}>${total.toFixed(2)}</span>
          </div>
        </div>
        <div style={{ fontFamily: display, fontSize: 30, color: ds.muted, marginTop: 26, opacity: footOp }}>
          Parcel and freight, every border. One report.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
