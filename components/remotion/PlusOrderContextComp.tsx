import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// ShipTime Plus — "Every order carries its full context forward." 900x506 (16:9).
// An order lands; destination, dimensions, weight and contents populate on the
// left, resolving to the right carrier + best rate on the right.
const c = {
  bg: "#FFFFFF",
  navy: "#1C1E3D",
  sub: "#6E728A",
  orange: "#EC5A26",
  orangeTint: "#FFF4EF",
  blue: "#2E4C8F",
  blueTint: "#E3EEFC",
  border: "#E8E8E8",
};
const serif = 'var(--font-instrument-serif), "Instrument Serif", Georgia, serif';
const sans = 'var(--font-dm-sans), "DM Sans", system-ui, sans-serif';

const FIELDS = [
  { label: "Destination", value: "Vancouver, BC", at: 26 },
  { label: "Dimensions", value: "30 × 20 × 15 cm", at: 44 },
  { label: "Weight", value: "2.4 kg", at: 62 },
  { label: "Contents", value: "Apparel", at: 80 },
];

function Field({ f, i }: { f: (typeof FIELDS)[number]; i: number }) {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [f.at, f.at + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 32, right: 32, top: 104 + i * 62, height: 50, opacity: t, transform: `translateX(${interpolate(t, [0, 1], [12, 0])}px)`, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${c.border}` }}>
      <span style={{ fontFamily: sans, fontSize: 16, color: c.sub }}>{f.label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: sans, fontSize: 19, fontWeight: 600, color: c.navy }}>{f.value}</span>
        <span style={{ width: 20, height: 20, borderRadius: "50%", background: c.blueTint, display: "grid", placeItems: "center" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4L19 6" /></svg>
        </span>
      </div>
    </div>
  );
}

export const PlusOrderContextComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardEnter = spring({ frame, fps, config: { damping: 22, stiffness: 180, mass: 0.8 } });
  const resEnter = spring({ frame: frame - 104, fps, config: { damping: 20, stiffness: 200, mass: 0.7 } });
  const arrowT = interpolate(frame, [94, 116], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: c.bg, fontFamily: sans }}>
      {/* LEFT — order card, context populating */}
      <div style={{ position: "absolute", left: 44, top: 44, width: 440, height: 418, opacity: cardEnter, transform: `translateY(${interpolate(cardEnter, [0, 1], [16, 0])}px)`, background: "#FFFFFF", border: `1px solid ${c.border}`, borderRadius: 16, boxShadow: "0 12px 32px -24px rgba(28,30,61,0.28)" }}>
        <div style={{ position: "absolute", left: 32, right: 32, top: 30, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: serif, fontSize: 30, color: c.navy }}>Order #A-1284</span>
          <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: c.orange, background: c.orangeTint, borderRadius: 999, padding: "4px 12px" }}>just landed</span>
        </div>
        {FIELDS.map((f, i) => <Field key={i} f={f} i={i} />)}
      </div>

      {/* arrow */}
      <div style={{ position: "absolute", left: 490, top: 236, opacity: arrowT }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={c.blue} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
      </div>

      {/* RIGHT — resolved carrier + best rate */}
      <div style={{ position: "absolute", left: 520, top: 130, width: 336, height: 246, opacity: resEnter, transform: `scale(${interpolate(resEnter, [0, 1], [0.92, 1])})`, transformOrigin: "center left", background: c.blueTint, border: `1px solid ${c.border}`, borderRadius: 16, padding: 30, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: c.blue }}>Best rate, matched</span>
        <span style={{ fontFamily: serif, fontSize: 46, color: c.navy, marginTop: 8, lineHeight: 1 }}>UPS Ground</span>
        <span style={{ fontFamily: sans, fontSize: 28, fontWeight: 600, color: c.orange, marginTop: 8 }}>$11.85</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18 }}>
          <span style={{ width: 22, height: 22, borderRadius: "50%", background: c.blue, display: "grid", placeItems: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4L19 6" /></svg>
          </span>
          <span style={{ fontFamily: sans, fontSize: 17, color: c.navy }}>Label ready</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
