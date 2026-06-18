import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/* ============================================================================
   ShipTime — Rate Audit / Invoice Audit  (ANIMATED)
   Portrait layout: 1080 x 1350 (4:5), 300 frames @ 30fps.

   MOTION ONLY. The approved STATIC layout (positions, sizes, colors,
   composition) is preserved exactly. Animation resolves TO that static frame
   by ~f230 and HOLDS, then a 12-frame exitOpacity fade (f288-300) loops it.

   Timeline:
     f0-40    eyebrow + headline + card reveal; status pill reads "SCANNING".
     f40-70   the 6 rows stagger in from left (12px); status cells neutral.
     f70-138  orange SCAN BEAM sweeps top->bottom; each crossed row resolves:
              4 stamp green "Match", 2 over-rows flip Billed -> red + pop a
              +$Δ delta + orange "FLAGGED". "lines checked 0/6 -> 6/6" ticks.
     f140-178 the two red deltas detach as orange coin-chips, travel DOWN/out
              (never across the price text) into the "Recovered" meter; meter
              counts $0 -> $214; status pill flips to green "RECOVERED".
     f160-200 the "2 overcharges recovered" payoff springs in.
     f200-288 hold resolved frame (= approved static).
     f288-300 exitOpacity fade-out (smoothPulse).
   ========================================================================== */

const SANS = "'Manrope', system-ui, sans-serif";
const BODY = "'Inter', system-ui, sans-serif";
const MONO = "ui-monospace, 'SF Mono', monospace";

const NAVY = "#1C1E3D";
const NAVY_DEEP = "#16182F";
const ORANGE = "#EC5A26";
const ORANGE_SOFT = "#F0845B";
const LIGHT_BLUE = "#E3EEFC";
const MUTED = "#6E728A";
const BORDER = "#E8E8E8";
const WHITE = "#FFFFFF";
const RED = "#E5484D";
const GREEN = "#3FA864";

/* ----------------------------------------------------------------------------
   Helpers — pure functions of frame. No Date/random.
   --------------------------------------------------------------------------- */
const EASE = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic

// Eased ramp from frame `start` over `dur` frames, clamped to [0,1].
const easeOut = (frame: number, start: number, dur: number) =>
  EASE(interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

// Gentle 0..1 pulse used for soft fades (e.g. exit). period in frames.
const smoothPulse = (frame: number, period: number) =>
  0.5 - 0.5 * Math.cos((frame / period) * Math.PI * 2);

// Subtle breathing oscillation around 1.0 for living, on-brand idle motion.
const breathe = (frame: number, period: number, amount: number) =>
  1 + Math.sin((frame / period) * Math.PI * 2) * amount;

/* ----------------------------------------------------------------------------
   Invoice line data. Exactly 2 of 6 rows exceed Quoted (the overcharges).
   --------------------------------------------------------------------------- */
type Row = {
  id: string;
  quoted: number;
  billed: number;
  over: boolean;
  delta: number; // billed - quoted (only meaningful when over)
};
const ROWS: Row[] = [
  { id: "ST-48201", quoted: 12.4, billed: 12.4, over: false, delta: 0 },
  { id: "ST-48207", quoted: 9.85, billed: 11.25, over: true, delta: 1.4 },
  { id: "ST-48214", quoted: 14.2, billed: 14.2, over: false, delta: 0 },
  { id: "ST-48219", quoted: 7.6, billed: 7.6, over: false, delta: 0 },
  { id: "ST-48226", quoted: 18.3, billed: 19.04, over: true, delta: 0.74 },
  { id: "ST-48231", quoted: 10.5, billed: 10.5, over: false, delta: 0 },
];
const RECOVERED_TOTAL = 214;
const greenCheckPath = "M20 6L9 17l-5-5";

/* ----------------------------------------------------------------------------
   Animation timing constants
   --------------------------------------------------------------------------- */
// Frame at which the scan beam crosses each row's centre (top -> bottom).
const BEAM_START = 70;
const BEAM_END = 138;
const rowResolveFrame = (i: number) =>
  BEAM_START + ((i + 0.5) / ROWS.length) * (BEAM_END - BEAM_START);

// Coin-chip travel window (deltas -> meter).
const COIN_START = 140;
const COIN_END = 178;

export const RateAuditComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ---- background dot grid ---------------------------------------------- */
  const DOT_SPACING = 28;

  /* ---- global entrance / exit ------------------------------------------- */
  const eyebrowEnter = easeOut(frame, 0, 18);
  const headlineEnter = easeOut(frame, 6, 22);
  const cardEnter = easeOut(frame, 14, 26);

  // Loop-out fade: hold at 1 until f288, smoothPulse down to 0 by f300.
  const exitOpacity =
    frame < 288
      ? 1
      : 1 - smoothPulse(interpolate(frame, [288, 300], [0, 0.5]), 1);

  // Beam crossing progress 0..1 over the rows region (top -> bottom).
  const beamProgress = interpolate(frame, [BEAM_START, BEAM_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const beamActive = frame >= BEAM_START - 2 && frame <= BEAM_END + 6;
  const beamFade = interpolate(
    frame,
    [BEAM_START - 2, BEAM_START + 4, BEAM_END, BEAM_END + 6],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Lines-checked counter ticks with the beam: 0/6 -> 6/6.
  const linesChecked = ROWS.reduce(
    (n, _r, i) => (frame >= rowResolveFrame(i) ? n + 1 : n),
    0
  );

  // Status pill state: SCANNING (orange) until the meter fills, then RECOVERED.
  const recoveredFlip = frame >= COIN_START + 6;

  // Recovered meter $ count-up (0 -> 214) and progress fill width.
  const meterT = interpolate(frame, [COIN_START + 4, COIN_END + 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const meterValue = Math.round(EASE(meterT) * RECOVERED_TOTAL);
  const meterFillWidth = EASE(meterT) * 100;

  // Payoff badge spring-in.
  const payoffSpring = spring({
    frame: frame - 160,
    fps,
    config: { damping: 18, stiffness: 170, mass: 0.9 },
  });
  const payoffOpacity = interpolate(payoffSpring, [0, 1], [0, 1]);
  const payoffY = interpolate(payoffSpring, [0, 1], [10, 0]);
  const payoffScale = interpolate(payoffSpring, [0, 1], [0.92, 1]);

  // Idle breathing glow on the meter check once resolved (subtle).
  const meterGlow = recoveredFlip ? breathe(frame, 70, 0.18) : 1;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #FFFFFF 0%, #F4F7FC 55%, #F8FAFB 100%)",
        opacity: exitOpacity,
      }}
    >
      {/* Subtle dot grid texture */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dotgrid"
              x="0"
              y="0"
              width={DOT_SPACING}
              height={DOT_SPACING}
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill={NAVY} opacity="0.03" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotgrid)" />
        </svg>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          padding: 64,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header removed — text shown in the outer UI, not the video */}

        {/* ====================== INVOICE AUDIT CARD ====================== */}
        <div
          style={{
            flex: 1,
            background: WHITE,
            borderRadius: 26,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 30px 70px -40px rgba(28,30,61,0.35)",
            padding: "26px 30px 26px",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            opacity: cardEnter,
            transform: `translateY(${(1 - cardEnter) * 16}px)`,
          }}
        >
          {/* ---------------- Invoice header strip ---------------- */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              paddingBottom: 18,
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* FedEx carrier chip */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#F4F6FB",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  padding: "9px 14px",
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: NAVY,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 7h13l-2 4H8l-1 2h6l-1.5 4H3z"
                      fill={ORANGE_SOFT}
                    />
                    <path
                      d="M17 7h4l-2 5 2 5h-4l-1-3-1 3h-4l2-5-2-5h4l1 3z"
                      fill={WHITE}
                    />
                  </svg>
                </span>
                <span
                  style={{
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: 19,
                    color: NAVY,
                    letterSpacing: "-0.01em",
                  }}
                >
                  FedEx
                </span>
              </div>
              {/* Invoice number */}
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 16,
                  fontWeight: 600,
                  color: MUTED,
                  letterSpacing: "0.02em",
                }}
              >
                Invoice #INV-4471
              </div>
            </div>

            {/* Status: N/6 checked + status pill (SCANNING -> RECOVERED) */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 15,
                  fontWeight: 600,
                  color: MUTED,
                  letterSpacing: "0.02em",
                }}
              >
                {linesChecked}/6 checked
              </span>

              {/* RECOVERED pill (green) — cross-fades in on flip */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* SCANNING pill (orange) — visible before the flip */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(236,90,38,0.12)",
                    border: "1px solid rgba(236,90,38,0.38)",
                    borderRadius: 999,
                    padding: "8px 14px",
                    opacity: recoveredFlip ? 0 : 1,
                    position: recoveredFlip ? "absolute" : "relative",
                    right: 0,
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 999,
                      background: ORANGE,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      opacity: 0.4 + 0.6 * smoothPulse(frame, 22),
                    }}
                  />
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 13,
                      fontWeight: 700,
                      color: ORANGE,
                      letterSpacing: "0.06em",
                    }}
                  >
                    SCANNING
                  </span>
                </div>

                {/* RECOVERED pill (green) — resolved state */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(63,168,100,0.12)",
                    border: "1px solid rgba(63,168,100,0.35)",
                    borderRadius: 999,
                    padding: "8px 14px",
                    opacity: recoveredFlip
                      ? easeOut(frame, COIN_START + 6, 14)
                      : 0,
                    position: recoveredFlip ? "relative" : "absolute",
                    right: 0,
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 999,
                      background: GREEN,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path
                        d={greenCheckPath}
                        stroke="#fff"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 13,
                      fontWeight: 700,
                      color: GREEN,
                      letterSpacing: "0.06em",
                    }}
                  >
                    RECOVERED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- Column header ---------------- */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 16px 10px",
              flexShrink: 0,
              opacity: easeOut(frame, 30, 16),
            }}
          >
            <div style={{ flex: "0 0 200px" }}>
              <ColLabel>Shipment</ColLabel>
            </div>
            <div style={{ flex: 1, textAlign: "right", paddingRight: 8 }}>
              <ColLabel>Quoted</ColLabel>
            </div>
            <div style={{ flex: 1, textAlign: "right", paddingRight: 8 }}>
              <ColLabel>Billed</ColLabel>
            </div>
            <div style={{ flex: "0 0 200px", textAlign: "right" }}>
              <ColLabel>Status</ColLabel>
            </div>
          </div>

          {/* ---------------- Invoice rows region ---------------- */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              position: "relative",
            }}
          >
            {/* ===== SCAN BEAM (orange) — sweeps top -> bottom across rows ===== */}
            {beamActive && (
              <div
                style={{
                  position: "absolute",
                  left: -8,
                  right: -8,
                  top: `${beamProgress * 100}%`,
                  height: 4,
                  transform: "translateY(-2px)",
                  background:
                    "linear-gradient(90deg, rgba(236,90,38,0) 0%, rgba(236,90,38,0.95) 50%, rgba(236,90,38,0) 100%)",
                  boxShadow: "0 0 18px rgba(236,90,38,0.6)",
                  opacity: beamFade,
                  pointerEvents: "none",
                  zIndex: 20,
                }}
              >
                {/* soft leading glow trailing above the beam */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 64,
                    background:
                      "linear-gradient(0deg, rgba(236,90,38,0.18) 0%, rgba(236,90,38,0) 100%)",
                  }}
                />
              </div>
            )}

            {ROWS.map((row, i) => {
              const resolveAt = rowResolveFrame(i);
              const resolved = frame >= resolveAt;

              // Row reveal (stagger in from left, 12px), f40-70.
              const rowEnter = easeOut(frame, 40 + i * 4, 22);

              // Resolve progress for this row (0 before beam, eases to 1 after).
              const rp = EASE(
                interpolate(frame, [resolveAt - 4, resolveAt + 10], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              );
              // Brief highlight kiss as the beam crosses.
              const kiss = interpolate(
                frame,
                [resolveAt - 4, resolveAt + 2, resolveAt + 14],
                [0, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );

              const redAccent = row.over && resolved;

              // Match-stamp pop scale for non-over rows.
              const matchPop = row.over
                ? 1
                : interpolate(rp, [0, 0.6, 1], [0.4, 1.12, 1]);

              // Background resolves to its final tint as the beam passes.
              const overBg = `rgba(229,72,77,${0.05 * rp})`;
              const zebraBg =
                i % 2 === 0 ? "rgba(28,30,61,0.015)" : "transparent";
              const kissBg = `rgba(236,90,38,${0.08 * kiss})`;

              return (
                <div
                  key={row.id}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 16px",
                    borderRadius: 14,
                    background: row.over
                      ? overBg
                      : kiss > 0.01
                      ? kissBg
                      : zebraBg,
                    borderLeft: `3px solid ${
                      redAccent
                        ? `rgba(229,72,77,${0.55 * rp})`
                        : "transparent"
                    }`,
                    opacity: rowEnter,
                    transform: `translateX(${(1 - rowEnter) * -12}px)`,
                  }}
                >
                  {/* Shipment id */}
                  <div
                    style={{
                      flex: "0 0 200px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9,
                        background: "#F1F4FA",
                        border: `1px solid ${BORDER}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"
                          stroke={MUTED}
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.5 7.5L12 12l8.5-4.5M12 12v9"
                          stroke={MUTED}
                          strokeWidth="1.6"
                        />
                      </svg>
                    </span>
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: 18,
                        fontWeight: 600,
                        color: NAVY,
                        letterSpacing: "0.01em",
                      }}
                    >
                      {row.id}
                    </span>
                  </div>

                  {/* Quoted */}
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      paddingRight: 8,
                      fontFamily: SANS,
                      fontWeight: 600,
                      fontSize: 19,
                      color: MUTED,
                    }}
                  >
                    ${row.quoted.toFixed(2)}
                  </div>

                  {/* Billed (flips to red for over-rows, with +$Δ delta badge) */}
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      paddingRight: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: SANS,
                        // Resolve weight/colour as the beam crosses (over rows).
                        fontWeight: redAccent ? 800 : 600,
                        fontSize: 19,
                        color: row.over
                          ? resolved
                            ? RED
                            : interpolateColor(rp, NAVY, RED)
                          : NAVY,
                      }}
                    >
                      ${row.billed.toFixed(2)}
                    </span>
                    {row.over && resolved && (
                      <span
                        style={{
                          fontFamily: SANS,
                          fontWeight: 800,
                          fontSize: 14,
                          color: WHITE,
                          background: RED,
                          borderRadius: 8,
                          padding: "3px 8px",
                          boxShadow: "0 4px 10px -4px rgba(229,72,77,0.6)",
                          // Pop in as it appears; fade as its coin detaches.
                          opacity: deltaBadgeOpacity(frame),
                          transform: `scale(${deltaBadgeScale(
                            frame,
                            resolveAt
                          )})`,
                        }}
                      >
                        +${row.delta.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Status cell: Match (green) or FLAGGED (orange) */}
                  <div
                    style={{
                      flex: "0 0 200px",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    {row.over ? (
                      resolved ? (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            background: "rgba(236,90,38,0.12)",
                            border: "1px solid rgba(236,90,38,0.4)",
                            borderRadius: 999,
                            padding: "6px 12px",
                            opacity: rp,
                            transform: `scale(${interpolate(
                              rp,
                              [0, 0.6, 1],
                              [0.5, 1.1, 1]
                            )})`,
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M5 3v18M5 4h11l-2 4 2 4H5"
                              stroke={ORANGE}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span
                            style={{
                              fontFamily: SANS,
                              fontWeight: 800,
                              fontSize: 14,
                              color: ORANGE,
                              letterSpacing: "0.04em",
                            }}
                          >
                            FLAGGED
                          </span>
                        </span>
                      ) : null
                    ) : resolved ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          opacity: rp,
                        }}
                      >
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 999,
                            background: GREEN,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transform: `scale(${matchPop})`,
                          }}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d={greenCheckPath}
                              stroke="#fff"
                              strokeWidth="3.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span
                          style={{
                            fontFamily: SANS,
                            fontWeight: 700,
                            fontSize: 15,
                            color: GREEN,
                          }}
                        >
                          Match
                        </span>
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {/* ===== Flying coin-chips: deltas detach DOWNWARD into meter ===== */}
            {/* Rendered in the rows region (overflow visible) so they can travel
                down toward the docked footer without ever crossing the price
                text. Anchored to the right edge, they drop straight down. */}
            {ROWS.map((row, i) => {
              if (!row.over) return null;
              const ct = interpolate(frame, [COIN_START, COIN_END], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              if (ct <= 0 || ct >= 1) return null;

              const e = EASE(ct);
              // Start near this row's Billed cell (vertical %), end below the
              // rows region (heading into the docked meter).
              const startTopPct = ((i + 0.5) / ROWS.length) * 100;
              const startTop = `calc(${startTopPct}% - 14px)`;
              // Travel downward + slightly outward (right), never leftward
              // across the price numbers.
              const dropPx = e * 320 + i * 6;
              const driftX = e * 40;
              const coinOpacity = interpolate(
                ct,
                [0, 0.12, 0.82, 1],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const coinScale = interpolate(ct, [0, 0.15, 1], [0.6, 1, 0.7]);

              return (
                <div
                  key={`coin-${row.id}`}
                  style={{
                    position: "absolute",
                    right: 24,
                    top: startTop,
                    transform: `translate(${driftX}px, ${dropPx}px) scale(${coinScale})`,
                    opacity: coinOpacity,
                    pointerEvents: "none",
                    zIndex: 15,
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: 14,
                    color: WHITE,
                    background: ORANGE,
                    borderRadius: 999,
                    padding: "4px 10px",
                    boxShadow: "0 6px 16px -6px rgba(236,90,38,0.7)",
                    whiteSpace: "nowrap",
                  }}
                >
                  +${row.delta.toFixed(2)}
                </div>
              );
            })}
          </div>

          {/* ================= DOCKED FOOTER: Recovered meter ================= */}
          <div
            style={{
              flexShrink: 0,
              marginTop: 18,
              background: NAVY,
              borderRadius: 18,
              padding: "18px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow:
                "0 16px 36px -22px rgba(28,30,61,0.55), 0 0 18px rgba(63,168,100,0.28)",
              position: "relative",
              overflow: "hidden",
              opacity: easeOut(frame, 60, 24),
            }}
          >
            {/* green progress fill — counts up with the meter (0% -> 100%) */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${meterFillWidth}%`,
                background:
                  "linear-gradient(90deg, rgba(63,168,100,0.10) 0%, rgba(63,168,100,0.28) 100%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: GREEN,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 0 12px rgba(63,168,100,0.6)",
                  // check appears on flip; subtle living glow once settled
                  transform: `scale(${
                    recoveredFlip
                      ? interpolate(
                          easeOut(frame, COIN_START + 6, 14),
                          [0, 1],
                          [0.6, 1]
                        ) * meterGlow
                      : 0.6
                  })`,
                  opacity: recoveredFlip ? 1 : 0.4,
                }}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                  <path
                    d={greenCheckPath}
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: recoveredFlip ? 1 : 0 }}
                  />
                </svg>
              </span>
              <div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  Recovered
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: 36,
                    color: "#7CE0A6",
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                  }}
                >
                  ${meterValue}
                </div>
              </div>
            </div>

            {/* Payoff line — springs in */}
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 6,
                textAlign: "right",
                opacity: payoffOpacity,
                transform: `translateY(${payoffY}px)`,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(236,90,38,0.16)",
                  border: "1px solid rgba(240,132,91,0.45)",
                  borderRadius: 999,
                  padding: "6px 12px",
                  transform: `scale(${payoffScale})`,
                  transformOrigin: "right center",
                }}
              >
                <span
                  style={{
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: 14,
                    color: ORANGE_SOFT,
                    letterSpacing: "0.02em",
                  }}
                >
                  2 overcharges recovered
                </span>
              </span>
              <span
                style={{
                  fontFamily: BODY,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.4,
                }}
              >
                Disputed &amp; refunded automatically
              </span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------------------------
   Delta badge timing: pops in when the row resolves, then fades out as its
   coin-chip detaches and travels to the meter. By the hold (f>=COIN_END) it is
   back to full opacity / scale 1 (= approved static frame).
   --------------------------------------------------------------------------- */
function deltaBadgeOpacity(frame: number) {
  // Visible after resolve; dip while the coin flies; full again at settle.
  if (frame < COIN_START) return 1;
  return interpolate(
    frame,
    [COIN_START, COIN_START + 10, COIN_END - 4, COIN_END + 2],
    [1, 0.25, 0.25, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}
function deltaBadgeScale(frame: number, resolveAt: number) {
  const pop = interpolate(
    frame,
    [resolveAt, resolveAt + 6, resolveAt + 12],
    [0.4, 1.18, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return pop;
}

/* Linear blend between two hex colors (used for the Billed text NAVY->RED). */
function interpolateColor(t: number, from: string, to: string) {
  const c = Math.max(0, Math.min(1, t));
  const f = hexToRgb(from);
  const s = hexToRgb(to);
  const r = Math.round(f.r + (s.r - f.r) * c);
  const g = Math.round(f.g + (s.g - f.g) * c);
  const b = Math.round(f.b + (s.b - f.b) * c);
  return `rgb(${r}, ${g}, ${b})`;
}
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/* small helper for column header labels */
const ColLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "#A2A6B6",
    }}
  >
    {children}
  </span>
);
