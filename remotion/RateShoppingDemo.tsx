import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";

// ShipTime brand palette
const ds = {
  navy: "#1C1E3D",
  orange: "#EC5A26",
  lightBlue: "#E3EEFC",
  surface: "#F8FAFB",
  border: "#E8E8E8",
  muted: "#6E728A",
  white: "#FFFFFF",
};

const manrope = "Manrope, system-ui, sans-serif";
const inter = "Inter, system-ui, sans-serif";

const CARRIERS = [
  { name: "Canada Post", price: "$14.20", days: "3-5 days", best: false },
  { name: "UPS", price: "$11.85", days: "2-3 days", best: true },
  { name: "Purolator", price: "$16.40", days: "1-2 days", best: false },
  { name: "FedEx", price: "$13.10", days: "2-4 days", best: false },
];

const SEARCH_TEXT = "Toronto → Vancouver, 5kg";

// Dot-grid SVG background (small dots every 32px, opacity 0.04)
function DotGrid() {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="dotgrid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill={ds.navy} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotgrid)" opacity="0.04" />
    </svg>
  );
}

// Shimmer scan line: animates top→bottom during frames 10–40
function ShimmerLine({ totalHeight }: { totalHeight: number }) {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [10, 20, 35, 40], [0, 0.85, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = progress * totalHeight;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        height: 72,
        pointerEvents: "none",
        background:
          "linear-gradient(180deg, transparent 0%, rgba(227,238,252,0.7) 40%, rgba(227,238,252,0.9) 50%, rgba(227,238,252,0.7) 60%, transparent 100%)",
        opacity,
        zIndex: 10,
      }}
    />
  );
}

// Typing search bar
function SearchBar() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Characters revealed from frame 5 to frame 45
  const charCount = Math.floor(interpolate(frame, [5, 45], [0, SEARCH_TEXT.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  const displayText = SEARCH_TEXT.slice(0, charCount);

  // Cursor blink: visible every other ~15 frames
  const cursorVisible = charCount < SEARCH_TEXT.length ? true : Math.floor(frame / 15) % 2 === 0;

  const barEnter = spring({ frame, fps, config: { damping: 24, stiffness: 180, mass: 0.8 } });
  const barOpacity = interpolate(barEnter, [0, 1], [0, 1]);
  const barY = interpolate(barEnter, [0, 1], [-12, 0]);

  return (
    <div
      style={{
        transform: `translateY(${barY}px)`,
        opacity: barOpacity,
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: ds.white,
        border: `1.5px solid ${ds.border}`,
        borderRadius: 18,
        padding: "22px 30px",
        marginBottom: 48,
        width: "100%",
        boxShadow: "0 4px 18px rgba(28,30,61,0.08)",
      }}
    >
      {/* Search icon */}
      <svg width="28" height="28" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8.5" cy="8.5" r="5.5" stroke={ds.muted} strokeWidth="1.8" />
        <path d="M13 13L17 17" stroke={ds.muted} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <div style={{ fontFamily: inter, fontSize: 26, color: ds.navy, flex: 1, letterSpacing: "0.01em" }}>
        {displayText}
        {cursorVisible && (
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: 26,
              background: ds.orange,
              marginLeft: 3,
              verticalAlign: "middle",
              borderRadius: 1,
            }}
          />
        )}
      </div>
      <div
        style={{
          fontFamily: manrope,
          fontWeight: 700,
          fontSize: 20,
          color: ds.white,
          background: ds.orange,
          padding: "12px 26px",
          borderRadius: 999,
          opacity: charCount > 0 ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      >
        Search rates
      </div>
    </div>
  );
}

// Pulse ring expanding from the best row
function PulseRing({ startFrame }: { startFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Two pulses, each 30 frames apart
  const pulses = [startFrame, startFrame + 30];

  return (
    <>
      {pulses.map((start, idx) => {
        const elapsed = frame - start;
        if (elapsed < 0 || elapsed > 30) return null;

        const t = elapsed / 30;
        const scale = interpolate(t, [0, 0.4, 1], [1, 1.05, 1.08]);
        const ringOpacity = interpolate(t, [0, 0.1, 1], [0, 0.6, 0]);

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: 24,
              border: `2.5px solid ${ds.orange}`,
              transform: `scale(${scale})`,
              opacity: ringOpacity,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
}

// Savings badge that springs in
function SavingsBadge() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({
    frame: frame - 130,
    fps,
    config: { damping: 18, stiffness: 260, mass: 0.6 },
  });
  const scale = interpolate(badgeSpring, [0, 1], [0.5, 1]);
  const opacity = interpolate(badgeSpring, [0, 0.3, 1], [0, 1, 1]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        transform: `scale(${scale})`,
        transformOrigin: "bottom right",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: manrope,
          fontWeight: 800,
          fontSize: 20,
          color: ds.white,
          background: ds.orange,
          padding: "12px 22px",
          borderRadius: 999,
          letterSpacing: "0.03em",
          boxShadow: "0 6px 22px rgba(236,90,38,0.35)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 22 }}>★</span>
        Save 34% vs walk-in
      </div>
    </div>
  );
}

function RateRow({ index, carrier }: { index: number; carrier: (typeof CARRIERS)[number] }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappier spring: damping 22, stiffness 200, mass 0.7
  // Rows start appearing after shimmer (frame ~42), staggered by 10 frames each
  const rowStartFrame = 42 + index * 10;
  const enter = spring({
    frame: frame - rowStartFrame,
    fps,
    config: { damping: 22, stiffness: 200, mass: 0.7 },
  });
  const y = interpolate(enter, [0, 1], [28, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  // Highlight the best row after all rows are in (~frame 90)
  const highlight = carrier.best
    ? interpolate(frame, [90, 108], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <div style={{ position: "relative", transform: `translateY(${y}px)`, opacity, marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "32px 40px",
          borderRadius: 20,
          background: ds.white,
          border: `${1 + highlight * 1.5}px solid ${highlight > 0.5 ? ds.orange : ds.border}`,
          boxShadow: highlight
            ? `0 ${10 * highlight}px ${30 * highlight}px rgba(236,90,38,${0.18 * highlight})`
            : "0 1px 3px rgba(0,0,0,0.04)",
          transform: `scale(${1 + highlight * 0.015})`,
          position: "relative",
          overflow: "visible",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: highlight > 0.5 ? ds.orange : ds.lightBlue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 30,
                height: 21,
                borderRadius: 4,
                background: highlight > 0.5 ? ds.white : ds.navy,
                opacity: 0.85,
              }}
            />
          </div>
          <div>
            <div style={{ fontFamily: manrope, fontWeight: 700, fontSize: 34, color: ds.navy }}>
              {carrier.name}
            </div>
            <div style={{ fontFamily: inter, fontSize: 22, color: ds.muted, marginTop: 4 }}>
              {carrier.days}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              fontFamily: manrope,
              fontWeight: 800,
              fontSize: 40,
              color: highlight > 0.5 ? ds.orange : ds.navy,
            }}
          >
            {carrier.price}
          </div>
          {highlight > 0.5 && (
            <div
              style={{
                fontFamily: manrope,
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: ds.white,
                background: ds.orange,
                padding: "9px 18px",
                borderRadius: 999,
              }}
            >
              Best rate
            </div>
          )}
        </div>

        {/* Pulse ring on highlight */}
        {carrier.best && <PulseRing startFrame={90} />}

        {/* Savings badge */}
        {carrier.best && <SavingsBadge />}
      </div>
    </div>
  );
}

export const RateShoppingDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEnter = spring({ frame, fps, config: { damping: 22, stiffness: 180, mass: 0.8 } });
  const titleY = interpolate(titleEnter, [0, 1], [-20, 0]);
  const titleOpacity = interpolate(titleEnter, [0, 1], [0, 1]);

  const outroOpacity = interpolate(frame, [160, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Height of the rate list area for shimmer reference
  // 4 rows: each ~129px row body + 24px margin ≈ 612px of scannable area
  const listHeight = 612;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #FFFFFF 0%, #E3EEFC 55%, #F8FAFB 100%)" }}>
      {/* Dot-grid background */}
      <DotGrid />

      <AbsoluteFill style={{ padding: 64, justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 952, display: "flex", flexDirection: "column" }}>
          {/* Title */}
          <div style={{ transform: `translateY(${titleY}px)`, opacity: titleOpacity, marginBottom: 40 }}>
            <div
              style={{
                fontFamily: manrope,
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: ds.orange,
                marginBottom: 16,
              }}
            >
              Rate shopping
            </div>
            <div
              style={{
                fontFamily: manrope,
                fontWeight: 800,
                fontSize: 58,
                lineHeight: 1.08,
                color: ds.navy,
                letterSpacing: "-0.02em",
              }}
            >
              Every carrier, compared in seconds
            </div>
          </div>

          {/* Search bar typing animation */}
          <SearchBar />

          {/* Rate rows with shimmer overlay */}
          <div style={{ width: "100%", position: "relative" }}>
            {/* Shimmer scan line */}
            <ShimmerLine totalHeight={listHeight} />

            {CARRIERS.map((c, i) => (
              <RateRow key={c.name} index={i} carrier={c} />
            ))}
          </div>

          {/* Outro line */}
          <div
            style={{
              opacity: outroOpacity,
              fontFamily: inter,
              fontSize: 30,
              color: ds.muted,
              marginTop: 32,
              textAlign: "center",
            }}
          >
            Up to{" "}
            <span style={{ color: ds.orange, fontFamily: manrope, fontWeight: 700 }}>70% off</span>{" "}
            walk-in carrier prices.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
