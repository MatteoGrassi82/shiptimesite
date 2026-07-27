import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

// ShipTime Plus — ShipAudit demo. 900x506 (16:9), ShipTime brand: white ground,
// navy text, orange for the money moments, blue for the scan/accents. Instrument
// Serif for the recovered figure, DM Sans for everything else. No teal.
const c = {
  bg: "#FFFFFF",
  muted: "#F8FAFB",
  navy: "#1C1E3D",
  sub: "#6E728A",
  orange: "#EC5A26",
  orangeTint: "#FFF4EF",
  blue: "#2E4C8F",
  border: "#E8E8E8",
};
const serif = 'var(--font-instrument-serif), "Instrument Serif", Georgia, serif';
const sans = 'var(--font-dm-sans), "DM Sans", system-ui, sans-serif';

type Row = { label: string; amt: string; flag?: string; at: number };
const ROWS: Row[] = [
  { label: "Base rate", amt: "$128.00", at: 0 },
  { label: "Fuel surcharge", amt: "$22.40", at: 0 },
  { label: "Residential surcharge", amt: "$18.90", flag: "not applicable", at: 62 },
  { label: "Duplicate charge", amt: "$41.20", flag: "billed twice", at: 82 },
];

function InvoiceRow({ i, row, top }: { i: number; row: Row; top: number }) {
  const frame = useCurrentFrame();
  const enter = spring({ frame: frame - (24 + i * 6), fps: 30, config: { damping: 22, stiffness: 200, mass: 0.7 } });
  const flagT = row.flag ? interpolate(frame, [row.at, row.at + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const x = interpolate(enter, [0, 1], [16, 0]);
  return (
    <div
      style={{
        position: "absolute", left: 24, right: 24, top, height: 56,
        transform: `translateX(${x}px)`, opacity: enter,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", borderRadius: 10,
        background: flagT > 0 ? c.orangeTint : "transparent",
        borderLeft: `3px solid ${flagT > 0 ? c.orange : "transparent"}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <span style={{ fontFamily: sans, fontSize: 19, fontWeight: 500, color: c.navy }}>{row.label}</span>
        {row.flag && flagT > 0.3 && (
          <span style={{ fontFamily: sans, fontSize: 12.5, color: c.orange, background: "#fff", border: `1px solid ${c.orange}`, borderRadius: 999, padding: "2px 9px", opacity: flagT, whiteSpace: "nowrap" }}>
            {row.flag}
          </span>
        )}
      </div>
      <span style={{ fontFamily: sans, fontSize: 19, fontWeight: 600, color: flagT > 0 ? c.orange : c.navy, fontVariantNumeric: "tabular-nums" }}>
        {row.flag ? "−" : ""}{row.amt}
      </span>
    </div>
  );
}

export const PlusShipAuditComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanY = interpolate(frame, [28, 92], [92, 344], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scanOp = interpolate(frame, [28, 40, 84, 92], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const sumEnter = spring({ frame: frame - 12, fps, config: { damping: 22, stiffness: 180, mass: 0.8 } });
  const recOp = interpolate(frame, [100, 116], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rec = interpolate(frame, [116, 176], [0, 1240], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const money = "$" + Math.round(rec).toLocaleString("en-US");

  return (
    <AbsoluteFill style={{ background: c.bg, fontFamily: sans }}>
      {/* LEFT — invoice ledger */}
      <div style={{ position: "absolute", left: 44, top: 44, width: 440, height: 418, background: "#FFFFFF", border: `1px solid ${c.border}`, borderRadius: 16, boxShadow: "0 12px 32px -24px rgba(28,30,61,0.28)" }}>
        <div style={{ position: "absolute", left: 24, right: 24, top: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: c.blue }}>Carrier invoice</span>
          <span style={{ fontFamily: sans, fontSize: 15, color: c.sub, fontVariantNumeric: "tabular-nums" }}>UPS · #4471</span>
        </div>
        <div style={{ position: "absolute", left: 24, right: 24, top: 60, height: 1, background: c.border }} />
        {ROWS.map((r, i) => (
          <InvoiceRow key={i} i={i} row={r} top={88 + i * 64} />
        ))}
        <div style={{ position: "absolute", left: 12, right: 12, top: scanY, height: 40, opacity: scanOp, borderRadius: 8, pointerEvents: "none", background: "linear-gradient(180deg, transparent, rgba(46,76,143,0.14) 55%, rgba(46,76,143,0.22) 72%, transparent)", borderBottom: `2px solid ${c.blue}` }} />
      </div>

      {/* RIGHT — recovered summary */}
      <div style={{ position: "absolute", left: 516, top: 44, width: 340, height: 418, background: c.muted, border: `1px solid ${c.border}`, borderRadius: 16, padding: 34, display: "flex", flexDirection: "column", justifyContent: "center", opacity: sumEnter, transform: `translateY(${interpolate(sumEnter, [0, 1], [16, 0])}px)` }}>
        <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: c.blue, opacity: recOp }}>Recovered this month</span>
        <div style={{ position: "relative", marginTop: 8, opacity: recOp }}>
          <div style={{ position: "absolute", left: -12, top: 4, width: 240, height: 92, background: "radial-gradient(circle, rgba(236,90,38,0.16), transparent 70%)" }} />
          <span style={{ fontFamily: serif, fontSize: 86, lineHeight: 1, color: c.orange, fontVariantNumeric: "tabular-nums", position: "relative" }}>{money}</span>
        </div>
        <span style={{ fontFamily: sans, fontSize: 18, fontWeight: 500, color: c.navy, marginTop: 20, opacity: recOp }}>4 invoices flagged</span>
        <span style={{ fontFamily: sans, fontSize: 16, color: c.sub, marginTop: 4, opacity: recOp }}>Refund filed automatically.</span>
      </div>
    </AbsoluteFill>
  );
};
