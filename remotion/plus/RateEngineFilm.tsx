import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { ds, display, mono } from "./theme";

// Film 02 — Bring-your-own rates. A lane types in, carriers rank, and the
// customer's own negotiated account drops into the ranking and wins.
const SEARCH = "Toronto → Vancouver · 5 kg";

type Rate = { co: string; eta: string; price: string; best: boolean; yours: boolean };
const RATES: Rate[] = [
  { co: "Canada Post", eta: "3–5 days", price: "$14.20", best: false, yours: false },
  { co: "UPS", eta: "2–3 days", price: "$11.85", best: true, yours: true },
  { co: "FedEx", eta: "2–4 days", price: "$13.10", best: false, yours: false },
];

function PulseRing() {
  const frame = useCurrentFrame();
  const starts = [104, 134];
  return (
    <>
      {starts.map((s, idx) => {
        const e = frame - s;
        if (e < 0 || e > 30) return null;
        const t = e / 30;
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              inset: -3,
              borderRadius: 20,
              border: `2px solid ${ds.teal}`,
              transform: `scale(${interpolate(t, [0, 1], [1, 1.06])})`,
              opacity: interpolate(t, [0, 0.1, 1], [0, 0.5, 0]),
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
}

function RateRow({ i, data }: { i: number; data: Rate }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - (44 + i * 8), fps, config: { damping: 22, stiffness: 200, mass: 0.7 } });
  const y = interpolate(enter, [0, 1], [26, 0]);
  const hl = data.best ? interpolate(frame, [88, 104], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const tag = data.best ? spring({ frame: frame - 96, fps, config: { damping: 16, stiffness: 240, mass: 0.6 } }) : 0;

  return (
    <div style={{ position: "relative", transform: `translateY(${y}px)`, opacity: enter, marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "30px 34px",
          borderRadius: 18,
          background: hl > 0 ? "linear-gradient(0deg, rgba(51,168,156,0.15), transparent 82%)" : "rgba(255,255,255,0.025)",
          border: `${1.5 + hl}px solid ${hl > 0.5 ? ds.teal : ds.line}`,
          boxShadow: hl > 0 ? `0 0 ${40 * hl}px -10px ${ds.teal}` : "none",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <span style={{ fontFamily: display, fontWeight: 600, fontSize: 40, color: ds.text }}>{data.co}</span>
            {data.yours && (
              <span style={{ fontFamily: mono, fontSize: 20, letterSpacing: "0.06em", textTransform: "uppercase", color: ds.teal, border: `1px solid ${ds.teal}`, borderRadius: 999, padding: "6px 16px" }}>
                Your account
              </span>
            )}
          </div>
          <div style={{ fontFamily: mono, fontSize: 24, color: ds.muted2, marginTop: 8 }}>{data.eta}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {data.best && tag > 0.05 && (
            <span style={{ fontFamily: display, fontWeight: 700, fontSize: 22, letterSpacing: "0.06em", textTransform: "uppercase", color: "#04110F", background: ds.teal, borderRadius: 999, padding: "8px 18px", transform: `scale(${tag})` }}>
              Best
            </span>
          )}
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 50, color: hl > 0.5 ? ds.tealBr : ds.text, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
            {data.price}
          </span>
        </div>
      </div>
      {data.best && <PulseRing />}
    </div>
  );
}

export const RateEngineFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEnter = spring({ frame, fps, config: { damping: 24, stiffness: 160, mass: 0.9 } });
  const titleY = interpolate(titleEnter, [0, 1], [-18, 0]);

  const chars = Math.floor(interpolate(frame, [12, 42], [0, SEARCH.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const typed = SEARCH.slice(0, chars);
  const cursorOn = chars < SEARCH.length ? true : Math.floor(frame / 15) % 2 === 0;
  const chip = spring({ frame: frame - 6, fps, config: { damping: 22, stiffness: 180 } });

  const savingsOp = interpolate(frame, [132, 152], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(900px 520px at 15% -8%, rgba(51,168,156,0.10), transparent 60%), ${ds.bg}` }}>
      <AbsoluteFill style={{ padding: 76, display: "flex", flexDirection: "column" }}>
        <div style={{ transform: `translateY(${titleY}px)`, opacity: titleEnter }}>
          <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.18em", textTransform: "uppercase", color: ds.teal, marginBottom: 18 }}>
            Bring-your-own rates
          </div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 66, lineHeight: 1.03, letterSpacing: "-0.03em", color: ds.text }}>
            Your contracts.
            <br />
            Our engine.
          </div>
        </div>

        <div
          style={{
            opacity: chip,
            transform: `translateY(${interpolate(chip, [0, 1], [-10, 0])}px)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "rgba(255,255,255,0.03)",
            border: `1.5px solid ${ds.line}`,
            borderRadius: 16,
            padding: "22px 28px",
            marginTop: 44,
            marginBottom: 40,
          }}
        >
          <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
            <circle cx="8.5" cy="8.5" r="5.5" stroke={ds.muted} strokeWidth="1.8" />
            <path d="M13 13L17 17" stroke={ds.muted} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: mono, fontSize: 28, color: ds.text }}>
            {typed}
            {cursorOn && <span style={{ color: ds.teal }}>|</span>}
          </span>
        </div>

        <div>
          {RATES.map((d, i) => (
            <RateRow key={i} i={i} data={d} />
          ))}
        </div>

        <div style={{ marginTop: "auto", fontFamily: display, fontSize: 32, color: ds.muted, opacity: savingsOp }}>
          Best of 6 carriers · <span style={{ color: ds.tealBr, fontWeight: 700 }}>save 34%</span> vs walk-in
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
