import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { ds, display, mono, money } from "./theme";

// Film 01 — ShipAudit. Invoices stream in, a scan line sweeps the ledger, two
// lines flag with the reason, and the recovered figure counts up.
type Invoice = { car: string; amt: string; flag: boolean; reason: string; flagAt: number };

const INVOICES: Invoice[] = [
  { car: "UPS · #4471", amt: "$182.40", flag: false, reason: "", flagAt: 0 },
  { car: "FedEx · #4472", amt: "−$18.90", flag: true, reason: "Residential surcharge — not applicable", flagAt: 66 },
  { car: "Purolator · #4473", amt: "$94.10", flag: false, reason: "", flagAt: 0 },
  { car: "UPS · #4474", amt: "−$41.20", flag: true, reason: "DIM weight mismatch", flagAt: 90 },
];

function InvoiceRow({ i, data }: { i: number; data: Invoice }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - (18 + i * 7), fps, config: { damping: 22, stiffness: 200, mass: 0.7 } });
  const y = interpolate(enter, [0, 1], [24, 0]);
  const flagT = data.flag
    ? interpolate(frame, [data.flagAt, data.flagAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <div
      style={{
        transform: `translateY(${y}px)`,
        opacity: enter,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        background: flagT > 0 ? ds.amberDim : "rgba(255,255,255,0.025)",
        border: `1.5px solid ${flagT > 0 ? ds.amber : ds.line}`,
        borderRadius: 16,
        padding: "26px 32px",
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
        <span style={{ fontFamily: display, fontWeight: 600, fontSize: 34, color: ds.text }}>{data.car}</span>
        {data.flag && flagT > 0.25 && (
          <span style={{ fontFamily: display, fontWeight: 500, fontSize: 24, color: ds.amber, opacity: flagT }}>{data.reason}</span>
        )}
      </div>
      <span style={{ fontFamily: mono, fontSize: 34, color: flagT > 0 ? ds.amber : ds.text, whiteSpace: "nowrap" }}>{data.amt}</span>
    </div>
  );
}

export const ShipAuditFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEnter = spring({ frame, fps, config: { damping: 24, stiffness: 160, mass: 0.9 } });
  const titleY = interpolate(titleEnter, [0, 1], [-18, 0]);

  const scanPct = interpolate(frame, [40, 100], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scanOp = interpolate(frame, [40, 50, 92, 100], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const recLabelOp = interpolate(frame, [100, 116], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rec = interpolate(frame, [116, 182], [0, 1240], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const footOp = interpolate(frame, [156, 176], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(900px 520px at 85% -8%, rgba(51,168,156,0.10), transparent 60%), ${ds.bg}` }}>
      <AbsoluteFill style={{ padding: 76, display: "flex", flexDirection: "column" }}>
        <div style={{ transform: `translateY(${titleY}px)`, opacity: titleEnter }}>
          <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.18em", textTransform: "uppercase", color: ds.teal, marginBottom: 18 }}>
            ShipAudit
          </div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 66, lineHeight: 1.03, letterSpacing: "-0.03em", color: ds.text }}>
            We catch what
            <br />
            {"you'd never spot."}
          </div>
        </div>

        <div style={{ position: "relative", marginTop: 52 }}>
          {INVOICES.map((d, i) => (
            <InvoiceRow key={i} i={i} data={d} />
          ))}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${scanPct}%`,
              height: 90,
              opacity: scanOp,
              pointerEvents: "none",
              background: "linear-gradient(180deg, transparent, rgba(78,201,186,0.18) 55%, rgba(78,201,186,0.30) 72%, transparent)",
              borderBottom: "2px solid rgba(78,201,186,0.6)",
            }}
          />
        </div>

        <div style={{ marginTop: "auto" }}>
          <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.16em", textTransform: "uppercase", color: ds.muted2, opacity: recLabelOp, marginBottom: 10 }}>
            Recovered this month
          </div>
          <div
            style={{
              fontFamily: display,
              fontWeight: 700,
              fontSize: 122,
              letterSpacing: "-0.04em",
              color: ds.tealBr,
              opacity: recLabelOp,
              lineHeight: 1,
              textShadow: "0 0 40px rgba(78,201,186,0.35)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {money(rec)}
          </div>
          <div style={{ fontFamily: display, fontSize: 30, color: ds.muted, marginTop: 26, opacity: footOp }}>
            Every carrier invoice, audited automatically.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
