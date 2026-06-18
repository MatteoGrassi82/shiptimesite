import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

/* ============================================================================
   ShipTime — Live Tracking, Rates In Sync  (PORTRAIT 1080×1350, 4:5)
   ANIMATED build of the approved STATIC frame. The layout, positions, sizes,
   colors and composition are IDENTICAL to the static still — this file ONLY
   layers staggered entrance + live-loop motion on top, and RESOLVES to that
   exact still by ~frame 230, holds, then runs the standard 12-frame seamless
   fade-out (f288–300).

   Choreography (300f / 10s @ 30fps):
     f0–40    eyebrow + headline + #ST-48201 chip (green live-pulse ring keeps
              pulsing the whole loop) reveal.
     f22–52   white shipment-journey card reveals; 62% bar fills 0%→62%.
     f44–70   rail draws left→right; 5 nodes pop in sequence; orange fill grows
              to the live position.
     f120+    "Now" marker appears + breathes; shimmer travels the active
              orange segment (persistent).
     f128–185 docked dark rate strip reveals; 4 rows stagger in; SYNC BEAT — an
              orange connector flicks from Now up-right into the strip, the chip
              flips "syncing…"→"synced ✓", cheapest (UPS) row brightens to top.
     f185–288 hold resolved frame (= approved static); live-pulse + shimmer +
              slow scan-line on the dark strip keep cycling.
     f288–300 exitOpacity fade-out.
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
const SURFACE = "#F8FAFB";
const BORDER = "#E8E8E8";
const WHITE = "#FFFFFF";
const GREEN = "#3FA864";

/* ---- Motion helpers (project-standard) ----------------------------------- */
const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const TWO_PI = Math.PI * 2;

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Eased 0→1 ramp over [delay, delay+duration], clamped. */
function easeOut(frame: number, delay: number, duration: number): number {
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
}

/** Cosine ease-in-out used for the graceful loop hand-off (no hard pop). */
function smoothPulse(t: number): number {
  return 0.5 - 0.5 * Math.cos(clamp01(t) * Math.PI);
}

/** Staggered reveal: opacity 0→1 + small upward drift → 0. */
function reveal(
  frame: number,
  delay: number,
  drift = 14,
  dur = 26
): { opacity: number; translateY: number } {
  const t = easeOut(frame, delay, dur);
  return { opacity: t, translateY: (1 - t) * drift };
}

// One continuous timeline, five fixed milestones at 0/25/50/75/100%.
// `at` = fractional position along the rail (0..1); `side` = label placement.
type Node = { label: string; at: number; side: "above" | "below" };
const NODES: Node[] = [
  { label: "Label created", at: 0.0, side: "below" },
  { label: "Rate shopped", at: 0.25, side: "above" },
  { label: "Picked up", at: 0.5, side: "below" },
  { label: "In transit", at: 0.75, side: "above" },
  { label: "Delivered", at: 1.0, side: "below" },
];
// Live "Now" position sits at 62% of the route.
const NOW_AT = 0.62;

const RATES = [
  { c: "UPS", s: "Standard", p: "$11.85", best: true },
  { c: "FedEx", s: "Ground", p: "$13.10" },
  { c: "Canada Post", s: "Expedited", p: "$14.20" },
  { c: "Purolator", s: "Ground", p: "$16.40" },
];

export const TrackingContextComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── Seamless loop hand-off: last 12 frames fade + lift the whole frame so the
  //    299→0 seam is invisible. Rebased to real duration so it always lands.
  const exitStart = durationInFrames - 12; // 288
  const exit = smoothPulse((frame - exitStart) / 12); // 0→1 over final 12f
  const exitOpacity = 1 - exit;
  const exitY = -exit * 12;

  // ── Continuous micro-life — a single loop phase (0..1) across the whole comp.
  const loop = frame / durationInFrames;
  // Green live-dot breathing — 4 integer cycles over the loop (returns to f0).
  const liveBreathe = 0.5 + 0.5 * Math.sin(loop * TWO_PI * 4);
  const liveDotPulse = 0.6 + 0.4 * liveBreathe; // dot opacity
  const liveRingScale = 1.7 + 0.9 * liveBreathe; // chip ring expand (settles ~1.7)
  const liveRingOpacity = 0.28 * (1 - liveBreathe); // chip ring fade

  // ── Rail card geometry — the SVG fills the left ~72% of the hero card.
  const RW = 760, RH = 360;              // rail SVG viewBox — taller band to fill the card
  const railPadL = 70, railPadR = 70;
  const railY = 180;                      // rail at the vertical center of the taller band
  const x0 = railPadL;
  const x1 = RW - railPadR;
  const railLen = x1 - x0;
  const xAt = (f: number) => x0 + railLen * f;

  const nowX = xAt(NOW_AT);
  const progPct = Math.round(NOW_AT * 100); // 62

  /* ── Header reveals (f0–40) ──────────────────────────────────────────── */
  const eyebrowR = reveal(frame, 0, 12, 22);
  const headlineR = reveal(frame, 8, 16, 26);
  const chipR = reveal(frame, 18, 14, 24);
  const chipSpring = spring({
    fps,
    frame: frame - 18,
    config: { damping: 18, stiffness: 160, mass: 0.7 },
    durationInFrames: 32,
  });
  const chipScale = interpolate(chipSpring, [0, 1], [0.92, 1]);

  /* ── Journey card reveal (f22–52) ────────────────────────────────────── */
  const cardR = reveal(frame, 22, 16, 28);
  const cardScale = interpolate(easeOut(frame, 22, 30), [0, 1], [0.985, 1]);

  /* ── Progress readout + bar fill (f22–52: 0%→62%) ───────────────────── */
  const barT = easeOut(frame, 26, 26);          // 0→1
  const barFillPct = NOW_AT * 100 * barT;        // 0 → 62
  const countPct = Math.round(progPct * barT);   // 0 → 62 number

  /* ── Rail draw + fill (f44–70) ──────────────────────────────────────── */
  // Base grey track draws left→right.
  const trackDraw = easeOut(frame, 44, 24);      // 0→1
  // Orange completed fill grows to the live position (resolves to nowX).
  const fillT = easeOut(frame, 50, 22);          // 0→1
  const fillX = x0 + (nowX - x0) * fillT;

  /* ── "Now" marker appears + breathes (f120+) ────────────────────────── */
  const nowAppear = easeOut(frame, 120, 22);     // 0→1
  const nowSpring = spring({
    fps,
    frame: frame - 120,
    config: { damping: 16, stiffness: 170, mass: 0.7 },
    durationInFrames: 30,
  });
  const nowPop = interpolate(nowSpring, [0, 1], [0.4, 1]);
  // Marker breathing — outer ring expands/contracts; 4 integer cycles.
  const nowBreathe = 0.5 + 0.5 * Math.sin(loop * TWO_PI * 4);
  const nowRingScale = nowAppear * (1 + 0.18 * nowBreathe);
  const nowRingOpacity = nowAppear * (0.4 - 0.18 * nowBreathe);

  /* ── Shimmer travelling the active orange segment (persistent, f120+) ── */
  const shimmerOn = easeOut(frame, 120, 16);
  // travels x0→nowX continuously, 2.5 cycles over the loop (phase resets at 0/1).
  const shimmerPhase = (loop * 2.5) % 1;
  const shimmerX = x0 + (nowX - x0) * shimmerPhase;
  const shimmerEdgeFade =
    clamp01(Math.sin(shimmerPhase * Math.PI)); // fade in/out at the ends

  /* ── Docked dark rate strip reveal (f128–185) ──────────────────────── */
  const stripR = reveal(frame, 128, 16, 28);

  /* ── SYNC BEAT (f150–185) ──────────────────────────────────────────── */
  // Orange connector flicks from the Now marker up-right into the strip, then
  // fully fades out before the hold so the resolved frame == the static still.
  const connectorT = easeOut(frame, 150, 16);     // 0→1 draw
  const connectorFlick = interpolate(
    frame,
    [150, 158, 168, 180, 188],
    [0, 1, 0.85, 0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ); // a quick "flick" brighten that lands the beat, then vanishes
  // Chip flips "syncing…" → "synced ✓" at the beat (~f168).
  const synced = frame >= 168;
  const syncFlip = easeOut(frame, 162, 14);        // cross-fade
  // Cheapest (UPS) row brightens/settles to top emphasis.
  const bestSettle = easeOut(frame, 168, 22);      // 0→1

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #FFFFFF 0%, #F4F7FC 55%, #F8FAFB 100%)",
        opacity: exitOpacity,
      }}
    >
      <AbsoluteFill
        style={{
          padding: 64,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          transform: `translateY(${exitY}px)`,
        }}
      >
        {/* Header/headline removed — text shown in the outer UI, not the video */}
        {/* #ST-48201 chip kept as a UI element */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: WHITE,
              border: `1px solid ${BORDER}`,
              borderRadius: 999,
              padding: "9px 16px 9px 14px",
              boxShadow: "0 8px 24px -16px rgba(28,30,61,0.3)",
              flexShrink: 0,
              opacity: chipR.opacity,
              transform: `translateY(${chipR.translateY}px) scale(${chipScale})`,
              transformOrigin: "right center",
            }}
          >
            <div style={{ position: "relative", width: 12, height: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div
                style={{
                  position: "absolute",
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  border: `1.5px solid ${GREEN}`,
                  transform: `scale(${liveRingScale})`,
                  opacity: liveRingOpacity,
                }}
              />
              <div style={{ width: 8, height: 8, borderRadius: 999, background: GREEN }} />
            </div>
            <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: NAVY, letterSpacing: "-0.01em" }}>#ST-48201</span>
          </div>
        </div>

        {/* ───────── Shipment journey card (the hero) ───────── */}
        <div
          style={{
            flex: 1,
            background: WHITE,
            borderRadius: 22,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 24px 60px -36px rgba(28,30,61,0.3)",
            display: "flex",
            overflow: "hidden",
            position: "relative",
            minHeight: 0,
            opacity: cardR.opacity,
            transform: `translateY(${cardR.translateY}px) scale(${cardScale})`,
            transformOrigin: "center top",
          }}
        >
          {/* LEFT ~72% — the timeline rail */}
          <div style={{ flex: "0 0 72%", padding: "24px 8px 24px 4px", display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 26px", marginBottom: 4 }}>
              <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 19, color: NAVY }}>Shipment journey</span>
              <span style={{ fontFamily: BODY, fontSize: 14, color: MUTED }}>label created → delivered</span>
            </div>

            {/* Progress readout — the live fill as a big % + bar above the rail */}
            <div style={{ padding: "10px 26px 0" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, lineHeight: 1, color: NAVY, letterSpacing: "-0.03em" }}>{countPct}%</span>
                  <span style={{ fontFamily: BODY, fontSize: 15, color: MUTED }}>of route complete</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: SANS, fontWeight: 700, fontSize: 14, color: ORANGE }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: ORANGE, boxShadow: "0 0 6px rgba(236,90,38,0.6)", opacity: 0.55 + 0.45 * liveBreathe }} />
                  En route · In transit
                </div>
              </div>
              <div style={{ height: 7, borderRadius: 999, background: "#EEF1F6", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${barFillPct}%`, borderRadius: 999, background: `linear-gradient(90deg, ${ORANGE} 0%, ${ORANGE_SOFT} 100%)` }} />
              </div>
            </div>

            {/* rail SVG — vertically centered in the remaining column so header +
                readout + rail read as one connected block with balanced whitespace */}
            <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center" }}>
            <svg viewBox={`0 0 ${RW} ${RH}`} style={{ width: "100%", display: "block" }}>
              {/* Base track — full grey rail (draws left→right) */}
              <line
                x1={x0} y1={railY} x2={x1} y2={railY}
                stroke="#E2E6EF" strokeWidth={10} strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - trackDraw}
              />

              {/* Completed segment — orange fill up to the live position */}
              <line x1={x0} y1={railY} x2={fillX} y2={railY} stroke={ORANGE} strokeWidth={10} strokeLinecap="round" />

              {/* Persistent shimmer travelling the active orange segment */}
              {shimmerOn > 0.01 && fillT > 0.6 && (
                <g
                  clipPath="url(#railClip)"
                  opacity={shimmerOn * shimmerEdgeFade}
                >
                  <line
                    x1={shimmerX - 26}
                    y1={railY}
                    x2={shimmerX + 26}
                    y2={railY}
                    stroke="#FFD9C7"
                    strokeWidth={10}
                    strokeLinecap="round"
                    opacity={0.85}
                  />
                </g>
              )}
              <defs>
                <clipPath id="railClip">
                  <rect x={x0 - 6} y={railY - 7} width={Math.max(0, fillX - x0 + 12)} height={14} rx={7} />
                </clipPath>
              </defs>

              {/* Milestone nodes — pop in sequence left→right */}
              {NODES.map((n, i) => {
                const nx = xAt(n.at);
                const passed = nx <= fillX + 0.5;             // node the fill has reached
                const isEndStart = i === 0;
                const isEndDelivered = i === NODES.length - 1;
                const labelY = n.side === "above" ? railY - 46 : railY + 58;
                const labelColor = passed ? NAVY : MUTED;
                const labelWeight = passed ? 700 : 600;

                // Sequenced pop: nodes appear left→right starting ~f48.
                const nodeDelay = 48 + i * 5;
                const nodeSpring = spring({
                  fps,
                  frame: frame - nodeDelay,
                  config: { damping: 15, stiffness: 200, mass: 0.6 },
                  durationInFrames: 26,
                });
                const nodeScale = interpolate(nodeSpring, [0, 1], [0, 1]);
                const nodeOpacity = easeOut(frame, nodeDelay, 16);
                const labelOpacity = easeOut(frame, nodeDelay + 4, 18);

                return (
                  <g key={n.label}>
                    {/* connector tick from rail to label */}
                    <line
                      x1={nx} y1={n.side === "above" ? railY - 12 : railY + 12}
                      x2={nx} y2={n.side === "above" ? railY - 30 : railY + 30}
                      stroke={passed ? "rgba(236,90,38,0.4)" : BORDER} strokeWidth={1.4}
                      opacity={nodeOpacity}
                    />
                    {/* node body */}
                    <g transform={`translate(${nx} ${railY}) scale(${nodeScale}) translate(${-nx} ${-railY})`} opacity={nodeOpacity}>
                    {isEndDelivered ? (
                      // outlined target node at far right
                      <g>
                        <circle cx={nx} cy={railY} r={13} fill={WHITE} stroke={passed ? ORANGE : "#C7CCD8"} strokeWidth={3} />
                        <circle cx={nx} cy={railY} r={5} fill={passed ? ORANGE : "#C7CCD8"} />
                      </g>
                    ) : isEndStart ? (
                      // emphasized orange ring node at far left
                      <g>
                        <circle cx={nx} cy={railY} r={12} fill={ORANGE} opacity={0.16} />
                        <circle cx={nx} cy={railY} r={8} fill={WHITE} stroke={ORANGE} strokeWidth={3} />
                        <circle cx={nx} cy={railY} r={4} fill={ORANGE} />
                      </g>
                    ) : passed ? (
                      // filled orange check-dot
                      <g transform={`translate(${nx} ${railY})`}>
                        <circle cx={0} cy={0} r={11} fill={ORANGE} />
                        <path d="M -4.5 0 L -1.5 3 L 4.5 -3.5" fill="none" stroke={WHITE} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    ) : (
                      // future node — hollow grey
                      <circle cx={nx} cy={railY} r={8} fill={WHITE} stroke="#C7CCD8" strokeWidth={2.5} />
                    )}
                    </g>
                    {/* label */}
                    <text
                      x={nx} y={labelY} textAnchor="middle"
                      fontFamily="var(--font-inter)" fontWeight={labelWeight} fontSize={16} fill={labelColor}
                      opacity={labelOpacity}
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}

              {/* Live "Now" marker — white-cored orange pulse on the rail (f120+) */}
              <g opacity={nowAppear}>
                {/* breathing outer ring */}
                <circle
                  cx={nowX} cy={railY}
                  r={14 * nowRingScale}
                  fill="none" stroke={ORANGE} strokeWidth={2}
                  opacity={nowRingOpacity}
                />
                <g transform={`translate(${nowX} ${railY}) scale(${nowPop}) translate(${-nowX} ${-railY})`}>
                  <circle cx={nowX} cy={railY} r={9} fill={WHITE} stroke={ORANGE} strokeWidth={3.5} opacity={0.85} />
                  <circle cx={nowX} cy={railY} r={4} fill={ORANGE} />
                  {/* "Now" pill above */}
                  <g transform={`translate(${nowX - 26}, ${railY - 80})`}>
                    <rect x={0} y={-15} width={52} height={26} rx={13} fill={ORANGE} />
                    <text x={26} y={3} textAnchor="middle" fontFamily="var(--font-manrope)" fontWeight={800} fontSize={14} fill={WHITE}>Now</text>
                    <path d="M 22 11 L 26 18 L 30 11 Z" fill={ORANGE} />
                  </g>
                </g>
              </g>

              {/* SYNC BEAT — orange connector flicks from Now up-right toward
                  the docked strip (lives inside the rail SVG, clipped to its
                  right edge so it reads as "shooting into" the strip). */}
              {connectorT > 0.01 && (
                <g opacity={connectorT * connectorFlick}>
                  <line
                    x1={nowX}
                    y1={railY}
                    x2={nowX + (x1 + 30 - nowX) * connectorT}
                    y2={railY - (railY - 24) * connectorT}
                    stroke={ORANGE}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeDasharray="6 5"
                  />
                  <circle
                    cx={nowX + (x1 + 30 - nowX) * connectorT}
                    cy={railY - (railY - 24) * connectorT}
                    r={4}
                    fill={ORANGE_SOFT}
                  />
                </g>
              )}
            </svg>
            </div>
          </div>

          {/* hairline divider so rail + strip read as one fused unit */}
          <div style={{ width: 1, background: BORDER, flexShrink: 0 }} />

          {/* RIGHT ~28% — docked synced-rate strip (NAVY_DEEP) */}
          <div
            style={{
              flex: "1 1 0%",
              minWidth: 0,
              position: "relative",
              overflow: "hidden",
              background: NAVY_DEEP,
              display: "flex",
              flexDirection: "column",
              padding: "22px 20px",
              opacity: stripR.opacity,
              transform: `translateY(${stripR.translateY}px)`,
            }}
          >
            {/* slow scan-line cycling down the dark strip (steady-state life) */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${((loop * 1.0) % 1) * 100}%`,
                height: 90,
                marginTop: -45,
                pointerEvents: "none",
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(240,132,91,0.10) 45%, rgba(240,132,91,0.14) 50%, rgba(240,132,91,0.10) 55%, transparent 100%)",
                opacity: stripR.opacity * 0.9,
                zIndex: 0,
              }}
            />

            {/* faint vertical hairline + 3 short tie-lines connecting to the rail */}
            <svg viewBox="0 0 40 460" preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: 0, width: 40, height: "100%", zIndex: 0 }}>
              <line x1={1} y1={20} x2={1} y2={440} stroke="rgba(236,90,38,0.25)" strokeWidth={1.5} />
              {[150, 230, 310].map((ty, k) => (
                <line
                  key={k}
                  x1={1}
                  y1={ty}
                  x2={18}
                  y2={ty}
                  stroke="rgba(236,90,38,0.35)"
                  strokeWidth={1.5}
                  opacity={0.8 * easeOut(frame, 150 + k * 4, 16)}
                />
              ))}
            </svg>

            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
              {/* strip header: title + syncing…/synced ✓ chip */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 8 }}>
                <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 16, color: WHITE }}>Synced rate</span>
                {/* The chip flips syncing… → synced ✓ at the sync beat. The two
                    states are stacked + cross-faded so the box never reflows. */}
                <span style={{ position: "relative", display: "inline-flex" }}>
                  {/* synced ✓ (resolved state) */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: BODY,
                      fontWeight: 600,
                      fontSize: 12,
                      padding: "4px 9px",
                      borderRadius: 999,
                      color: "#5BD08A",
                      background: "rgba(91,208,138,0.14)",
                      border: "1px solid rgba(91,208,138,0.4)",
                      opacity: synced ? syncFlip : 0,
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: "#5BD08A", boxShadow: "0 0 5px rgba(91,208,138,0.7)" }} />
                    synced ✓
                  </span>
                  {/* syncing… (pre-beat state) */}
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: BODY,
                      fontWeight: 600,
                      fontSize: 12,
                      padding: "4px 9px",
                      borderRadius: 999,
                      color: ORANGE_SOFT,
                      background: "rgba(236,90,38,0.14)",
                      border: "1px solid rgba(236,90,38,0.4)",
                      whiteSpace: "nowrap",
                      opacity: synced ? 1 - syncFlip : stripR.opacity,
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 999,
                        background: ORANGE_SOFT,
                        boxShadow: "0 0 5px rgba(236,90,38,0.7)",
                        opacity: 0.5 + 0.5 * liveBreathe,
                      }}
                    />
                    syncing…
                  </span>
                </span>
              </div>

              {/* carrier rows — sized so ALL FOUR fit the docked strip */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, justifyContent: "center" }}>
                {RATES.map((rt, i) => {
                  // Rows stagger in after the strip reveals.
                  const rowDelay = 138 + i * 9;
                  const rowR = reveal(frame, rowDelay, 12, 22);
                  // Best (UPS) row brightens/settles to top emphasis on the beat.
                  const bestNow = rt.best ? bestSettle : 1;
                  const baseBg = rt.best
                    ? `rgba(236,90,38,${0.16 * bestNow})`
                    : "rgba(255,255,255,0.05)";
                  const bestBorder = rt.best
                    ? `rgba(236,90,38,${0.5 * bestNow})`
                    : "rgba(255,255,255,0.07)";
                  // transient settle-glow that decays to 0 so the resolved row
                  // == the static still (background + border only).
                  const bestGlow = rt.best
                    ? interpolate(frame, [168, 185, 205], [0, 1, 0], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })
                    : 0;
                  return (
                    <div
                      key={rt.c}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 14px",
                        borderRadius: 13,
                        background: baseBg,
                        border: `1px solid ${bestBorder}`,
                        opacity: rowR.opacity,
                        transform: `translateY(${rowR.translateY}px)`,
                        boxShadow:
                          bestGlow > 0.001
                            ? `0 8px 22px -14px rgba(236,90,38,${0.6 * bestGlow})`
                            : "none",
                      }}
                    >
                      <span style={{ width: 10, height: 10, borderRadius: 999, flexShrink: 0, background: rt.best ? ORANGE : "rgba(255,255,255,0.3)" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                          <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, color: WHITE, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rt.c}</span>
                          {rt.best && (
                            <span
                              style={{
                                flexShrink: 0,
                                fontFamily: SANS,
                                fontSize: 9,
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: WHITE,
                                background: ORANGE,
                                padding: "2px 7px",
                                borderRadius: 999,
                                opacity: bestSettle,
                              }}
                            >
                              Best
                            </span>
                          )}
                        </div>
                        <div style={{ fontFamily: BODY, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{rt.s}</div>
                      </div>
                      <div style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: rt.best ? ORANGE_SOFT : "rgba(255,255,255,0.85)", flexShrink: 0 }}>{rt.p}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ───────── Footer ticker (always in sync) ───────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: WHITE,
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            padding: "14px 20px",
            boxShadow: "0 10px 30px -22px rgba(28,30,61,0.25)",
            opacity: reveal(frame, 200, 12, 24).opacity,
            transform: `translateY(${reveal(frame, 200, 12, 24).translateY}px)`,
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: 999, flexShrink: 0, background: GREEN, boxShadow: "0 0 6px rgba(63,168,100,0.7)", opacity: liveDotPulse }} />
          <span style={{ fontFamily: BODY, fontSize: 16, color: NAVY }}>
            Cheapest qualified rate locked to this shipment —{" "}
            <span style={{ fontFamily: SANS, fontWeight: 800, color: ORANGE }}>UPS $11.85</span>
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
