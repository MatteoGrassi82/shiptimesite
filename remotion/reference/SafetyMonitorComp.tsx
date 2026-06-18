import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

/* ============================================================================
   Hana — Safety Monitor
   A centered modal over softly blurred background cards. A live transcript is
   analyzed in real time, a critical medication-misuse risk is detected, and
   safety protocols auto-execute.

   Craft notes:
   - One accent (Apple-system blue #0A84FF) carries the brand; semantic colors
     (danger / warning / success) appear ONLY where they carry meaning.
   - Layered contact + ambient shadows; near-invisible hairlines; glassy inner
     top-highlights on cards.
   - Everything drifts in (translateY + opacity + blur->sharp) on spring/cubic
     easing, staggered ~40-80ms apart. Continuous micro-life: breathing live
     dot, waveform, typing cursor — all tuned to integer cycles over 300f so
     they never pop at the loop seam.
   - 300 frames @ 30fps (10s). A calm, unhurried Apple-like pace: the sequence
     plays out slowly, lands a long restful hold on the finished state, then
     gracefully cross-fades back to the entrance so the loop is seamless.
   ========================================================================== */

/* ----------------------------- Type scale & color -------------------------- */
const FONT_DISPLAY = "'Instrument Serif', Georgia, 'Times New Roman', serif";
const FONT_UI = "'DM Sans', system-ui, -apple-system, sans-serif";
const FONT_MONO =
  "ui-monospace, 'SF Mono', 'JetBrains Mono', 'Menlo', monospace";

const COLOR = {
  canvas: "#F5F5F4",
  canvasWarm: "#F7F7F6",
  ink: "#0A0A0B",
  ink2: "#030213",
  slate: "#3F3F46",
  slate2: "#52525B",
  muted: "#71717A",
  faint: "#A1A1AA",
  hairline: "rgba(0,0,0,0.06)",
  hairlineStrong: "rgba(0,0,0,0.08)",
  panel: "#FFFFFF",
  accent: "#0A84FF",
  accentDeep: "#0066CC",
  danger: "#FF3B30",
  dangerSoft: "#FF453A",
  warning: "#FF9F0A",
  success: "#30D158",
  successDeep: "#1E9E45",
};

/* Stacked, realistic elevation: tight contact shadow + soft ambient layers. */
const SHADOW_MODAL =
  "0 1px 2px rgba(0,0,0,0.05), 0 12px 32px -10px rgba(0,0,0,0.16), 0 36px 72px -28px rgba(0,0,0,0.18)";
const SHADOW_CARD =
  "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.10)";
const INNER_HIGHLIGHT = "inset 0 1px 0 rgba(255,255,255,0.75)";

const TAU = Math.PI * 2;

/* --------------------------------- Content --------------------------------- */
const TRANSCRIPT_PARTS = {
  before:
    "The pain is just unbearable today. I know the bottle says one pill, but ",
  danger: "I've already taken four this morning",
  after:
    " and I'm thinking about taking more just to make the world stop spinning.",
};

const TOTAL_CHARS =
  TRANSCRIPT_PARTS.before.length +
  TRANSCRIPT_PARTS.danger.length +
  TRANSCRIPT_PARTS.after.length;

const PROTOCOLS = [
  "Flag for Medication Reconciliation",
  "Notify Primary Physician (Urgent)",
  "Inject Overdose Risk Warning Script",
];

/* --------------------------------- Helpers --------------------------------- */

/** Eased fade — gentle, confident. */
function fade(frame: number, delay: number, duration: number): number {
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
}

/** A reveal: opacity, a small upward drift, and a blur-to-sharp pass. */
function reveal(
  frame: number,
  delay: number,
  duration = 22,
  drift = 10,
  blur = 6
): { opacity: number; translateY: number; blur: number } {
  const p = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  return {
    opacity: p,
    translateY: (1 - p) * drift,
    blur: (1 - p) * blur,
  };
}

/** Cosine ease-in-out used for the graceful loop hand-off (no hard pop). */
function smoothPulse(t: number): number {
  return 0.5 - 0.5 * Math.cos(Math.min(1, Math.max(0, t)) * Math.PI);
}

/* ------------------------------ Inline glyphs ------------------------------ */

function ShieldGlyph({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21.5s7-3.6 7-9V5.2l-7-2.7-7 2.7V12.5c0 5.4 7 9 7 9z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
        fill={`${color}1A`}
      />
      <path
        d="M9 12.2l2.1 2.1L15 10.4"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function WarningGlyph({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M10.7 4.1L3 17.4a1.5 1.5 0 001.3 2.25h15.4A1.5 1.5 0 0021 17.4L13.3 4.1a1.5 1.5 0 00-2.6 0z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
        fill={`${color}1A`}
      />
      <line
        x1="12"
        y1="9.5"
        x2="12"
        y2="13.5"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.6" r="0.95" fill={color} />
    </svg>
  );
}

function CheckGlyph({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <polyline
        points="2.5,6.4 4.9,8.8 9.5,3.4"
        stroke="#FFFFFF"
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================================
   Component
   ========================================================================== */
export function SafetyMonitorComp() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const LOOP = durationInFrames; // 300

  /* ---- Choreography (frames @ 300f / 10s) ----
     0    backdrop + blurred cards settle
     10   modal springs in (blur->sharp)
     36   transcript card reveals; typing begins
     ~95  danger phrase reached -> red sweep highlight
     160  analysis row reveals
     176  risk badge pops (overshoot)
     192  protocol 1
     210  protocol 2
     228  protocol 3 (settles ~246)
     256  closing summary footer drifts in
     ~256-288  calm steady state, long restful hold
     288  begin graceful 12f exit (drift up + soft blur) so frame 299->0 is seamless
  */

  // Graceful loop hand-off: in the last 12 frames the whole modal drifts up and
  // blurs out, meeting the entrance state so the seam is invisible. Rebased to
  // the real duration so it always ends exactly at durationInFrames.
  const exitStart = durationInFrames - 12;
  const exit = smoothPulse((frame - exitStart) / 12); // 0 -> 1 over final 12f
  const exitOpacity = 1 - exit;
  const exitY = -exit * 12;
  const exitBlur = exit * 6;

  // Backdrop / blurred context cards (fade in, fade out for the loop).
  const backdrop = fade(frame, 0, 14) * (1 - exit * 0.6);

  // Modal entrance — spring with a touch of overshoot, plus blur-to-sharp.
  const modalSpring = spring({
    fps,
    frame: frame - 10,
    config: { damping: 18, stiffness: 110, mass: 0.9 },
    durationInFrames: 40,
  });
  const modalScale = interpolate(modalSpring, [0, 1], [0.965, 1]);
  const modalY = interpolate(modalSpring, [0, 1], [14, 0]) + exitY;
  const modalOpacity = fade(frame, 10, 18) * exitOpacity;
  const entranceBlur = interpolate(frame, [10, 32], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const modalBlur = entranceBlur + exitBlur;

  // Typing — confident but unhurried; a long reading window so the transcript
  // feels calm and human at 10s.
  const typeStart = 40;
  const typeEnd = 150;
  const charsToShow = Math.floor(
    interpolate(frame, [typeStart, typeEnd], [0, TOTAL_CHARS], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.linear,
    })
  );
  const typingDone = charsToShow >= TOTAL_CHARS;

  // Position within the danger phrase for the red sweep + cursor.
  const dangerStartChar = TRANSCRIPT_PARTS.before.length;
  const dangerEndChar = dangerStartChar + TRANSCRIPT_PARTS.danger.length;
  const dangerProgress = interpolate(
    charsToShow,
    [dangerStartChar, dangerEndChar],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Reveals — spread out across the longer runtime for breathing room.
  const transcript = reveal(frame, 36, 24, 10, 6);
  const analysis = reveal(frame, 160, 22, 10, 6);

  // Risk badge — subtle overshoot pop.
  const badgeSpring = spring({
    fps,
    frame: frame - 176,
    config: { damping: 13, stiffness: 170, mass: 0.7 },
    durationInFrames: 30,
  });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.82, 1]);
  const badgeOpacity = fade(frame, 176, 14);

  // Protocol rows, staggered ~18f (600ms) apart for a calm, deliberate cascade.
  const protocolReveals = [
    reveal(frame, 192, 18, 9, 5),
    reveal(frame, 210, 18, 9, 5),
    reveal(frame, 228, 18, 9, 5),
  ];

  // Closing beat: a summary/confirmation footer drifts in once all protocols
  // have settled, then rests calmly through the long hold (covered by exit).
  const summary = reveal(frame, 256, 22, 10, 6);

  // ---- Continuous micro-life (all tuned to integer cycles over 300f) ----
  // Breathing live dot: 4 full cycles over the loop (auto-adapts to duration).
  const breathePhase = Math.sin((frame / LOOP) * TAU * 4);
  const breathe = 0.6 + 0.4 * (0.5 + 0.5 * breathePhase);
  const breatheScale = 1 + 0.1 * (0.5 + 0.5 * breathePhase);
  // Live-dot halo ring expands & fades. Period 20f divides 300 (15 cycles) -> no seam.
  const ringPhase = (frame % 20) / 20;
  const ringScale = 1 + ringPhase * 1.7;
  const ringOpacity = (1 - ringPhase) * 0.5 * (1 - exit);
  // Typing cursor blink. Period 20f divides 300 (15 cycles) -> clean at the seam.
  const cursorBlink = frame % 20 < 10 ? 1 : 0.18;
  // Header waveform.
  const waveBars = 9;

  /* ----------------------------- Transcript render --------------------------- */
  function renderTranscript() {
    let remaining = charsToShow;
    const beforeShown = TRANSCRIPT_PARTS.before.slice(
      0,
      Math.max(0, Math.min(remaining, TRANSCRIPT_PARTS.before.length))
    );
    remaining -= TRANSCRIPT_PARTS.before.length;
    const dangerShown =
      remaining > 0
        ? TRANSCRIPT_PARTS.danger.slice(
            0,
            Math.min(remaining, TRANSCRIPT_PARTS.danger.length)
          )
        : "";
    remaining -= TRANSCRIPT_PARTS.danger.length;
    const afterShown =
      remaining > 0
        ? TRANSCRIPT_PARTS.after.slice(
            0,
            Math.min(remaining, TRANSCRIPT_PARTS.after.length)
          )
        : "";

    // Cursor sits at the live edge while typing.
    const inBefore = charsToShow < dangerStartChar;
    const inDanger =
      charsToShow >= dangerStartChar && charsToShow < dangerEndChar;
    const inAfter = charsToShow >= dangerEndChar;

    const cursor = !typingDone ? (
      <span
        style={{
          display: "inline-block",
          width: 2,
          height: "1.05em",
          marginLeft: 1.5,
          transform: "translateY(2px)",
          borderRadius: 1,
          background: inDanger ? COLOR.danger : COLOR.accent,
          opacity: cursorBlink,
        }}
      />
    ) : null;

    return (
      <>
        {beforeShown}
        {inBefore && cursor}
        {dangerShown && (
          <span
            style={{
              color: COLOR.danger,
              fontWeight: 600,
              padding: "1px 3px",
              margin: "0 -3px",
              borderRadius: 5,
              background: `linear-gradient(90deg, rgba(255,59,48,0.13) ${dangerProgress}%, rgba(255,59,48,0) ${dangerProgress}%)`,
              boxShadow:
                dangerProgress > 4
                  ? `inset 0 -1.5px 0 rgba(255,59,48,${(
                      0.4 *
                      (dangerProgress / 100)
                    ).toFixed(3)})`
                  : "none",
            }}
          >
            {dangerShown}
            {inDanger && cursor}
          </span>
        )}
        {afterShown}
        {inAfter && cursor}
      </>
    );
  }

  /* -------------------------------- Backdrop cards --------------------------- */
  const ghostCard = (extra: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    background: COLOR.panel,
    borderRadius: 16,
    border: `1px solid ${COLOR.hairline}`,
    boxShadow: SHADOW_CARD,
    ...extra,
  });

  return (
    <AbsoluteFill
      style={{
        background: COLOR.canvas,
        fontFamily: FONT_UI,
        // Subtle radial glow + faint dot grid so the canvas isn't dead-flat.
        backgroundImage: `
          radial-gradient(130% 95% at 50% -12%, rgba(10,132,255,0.045), rgba(10,132,255,0) 56%),
          radial-gradient(rgba(0,0,0,0.022) 1px, transparent 1px)
        `,
        backgroundSize: "auto, 24px 24px",
        backgroundPosition: "center, center",
      }}
    >
      {/* ---- Blurred background context (the "session" behind the modal) ---- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: backdrop * 0.85,
          // Static blur (no per-loop animation -> no seam); depth, not motion.
          filter: "blur(4px) saturate(0.97)",
        }}
      >
        <div style={ghostCard({ left: 52, top: 58, width: 228, height: 130 })} />
        <div style={ghostCard({ left: 52, top: 206, width: 228, height: 84 })} />
        <div style={ghostCard({ left: 52, top: 308, width: 228, height: 62 })} />
        <div
          style={ghostCard({
            right: 56,
            top: 66,
            width: 176,
            height: 44,
            borderRadius: 12,
          })}
        />
        <div
          style={ghostCard({
            left: 52,
            bottom: 92,
            width: 214,
            height: 64,
            borderRadius: 12,
            background: "rgba(255,59,48,0.05)",
            border: "1px solid rgba(255,59,48,0.13)",
            borderLeft: `3px solid ${COLOR.danger}`,
          })}
        />
        <div
          style={ghostCard({
            right: 56,
            bottom: 64,
            width: 214,
            height: 56,
            borderRadius: 12,
          })}
        />
      </div>

      {/* Vignette to focus attention on the modal. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(115% 85% at 50% 48%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.07) 100%)",
          opacity: backdrop,
        }}
      />

      {/* -------------------------------- Modal -------------------------------- */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 564,
          transform: `translate(-50%, calc(-50% + ${modalY}px)) scale(${modalScale})`,
          opacity: modalOpacity,
          filter: `blur(${modalBlur}px)`,
          background: "linear-gradient(180deg, #FFFFFF 0%, #FBFBFC 100%)",
          borderRadius: 20,
          border: `1px solid ${COLOR.hairline}`,
          boxShadow: `${SHADOW_MODAL}, ${INNER_HIGHLIGHT}`,
          overflow: "hidden",
        }}
      >
        {/* ------------------------------ Header ------------------------------ */}
        <div
          style={{
            padding: "16px 24px 14px",
            borderBottom: `1px solid ${COLOR.hairline}`,
            background:
              "linear-gradient(180deg, rgba(10,132,255,0.04), rgba(10,132,255,0))",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background:
                    "linear-gradient(180deg, rgba(10,132,255,0.16), rgba(10,132,255,0.06))",
                  border: "1px solid rgba(10,132,255,0.18)",
                  boxShadow: INNER_HIGHLIGHT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldGlyph color={COLOR.accent} size={19} />
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: -0.3,
                    color: COLOR.ink,
                  }}
                >
                  Safety Monitor
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: 10.5,
                    fontFamily: FONT_MONO,
                    letterSpacing: 0.3,
                    color: COLOR.muted,
                    fontFeatureSettings: "'tnum' 1",
                  }}
                >
                  SESSION ID: 8821-X
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Live waveform — 10 full integer cycles over the loop -> seamless. */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 2.5,
                  height: 18,
                }}
              >
                {Array.from({ length: waveBars }).map((_, i) => {
                  const env = 0.6 + 0.4 * Math.sin(i * 1.7); // per-bar shape
                  const osc =
                    0.5 +
                    0.5 * Math.sin((frame / LOOP) * TAU * 10 + i * 0.9);
                  const h = 4 + 8 * osc * env;
                  return (
                    <div
                      key={i}
                      style={{
                        width: 2.5,
                        height: Math.max(3, h),
                        borderRadius: 2,
                        background: COLOR.accent,
                        opacity: 0.35 + 0.4 * (h / 12),
                      }}
                    />
                  );
                })}
              </div>

              {/* Pulsing LIVE indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "4px 11px 4px 9px",
                  borderRadius: 999,
                  background: "rgba(48,209,88,0.10)",
                  border: "1px solid rgba(48,209,88,0.22)",
                }}
              >
                <div style={{ position: "relative", width: 8, height: 8 }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background: COLOR.success,
                      transform: `scale(${ringScale})`,
                      opacity: ringOpacity,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background: COLOR.success,
                      transform: `scale(${breatheScale})`,
                      opacity: breathe,
                      boxShadow: "0 0 6px rgba(48,209,88,0.6)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: 0.6,
                    color: COLOR.successDeep,
                  }}
                >
                  LIVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------- Transcript ---------------------------- */}
        <div
          style={{
            padding: "14px 24px 12px",
            opacity: transcript.opacity,
            transform: `translateY(${transcript.translateY}px)`,
            filter: `blur(${transcript.blur}px)`,
          }}
        >
          <SectionLabel>Live Transcript</SectionLabel>
          <div
            style={{
              background: "#FAFAF9",
              borderRadius: 14,
              border: `1px solid ${COLOR.hairline}`,
              boxShadow: INNER_HIGHLIGHT,
              padding: "14px 16px",
            }}
          >
            <p
              style={{
                fontSize: 13.5,
                color: COLOR.slate,
                lineHeight: 1.62,
                letterSpacing: -0.1,
                margin: 0,
                minHeight: 54,
              }}
            >
              {renderTranscript()}
            </p>
          </div>
        </div>

        {/* ----------------------------- Analysis ----------------------------- */}
        <div
          style={{
            padding: "2px 24px 12px",
            opacity: analysis.opacity,
            transform: `translateY(${analysis.translateY}px)`,
            filter: `blur(${analysis.blur}px)`,
          }}
        >
          <SectionLabel>Real-Time Analysis</SectionLabel>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background:
                "linear-gradient(180deg, rgba(255,159,10,0.07), rgba(255,159,10,0.025))",
              border: "1px solid rgba(255,159,10,0.22)",
              borderRadius: 14,
              boxShadow: INNER_HIGHLIGHT,
              padding: "13px 14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "rgba(255,159,10,0.12)",
                  border: "1px solid rgba(255,159,10,0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <WarningGlyph color={COLOR.warning} size={18} />
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    fontWeight: 600,
                    letterSpacing: -0.2,
                    color: COLOR.ink,
                  }}
                >
                  Medication Misuse Detected
                </p>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: 10.5,
                    fontFamily: FONT_MONO,
                    letterSpacing: 0.2,
                    color: COLOR.muted,
                  }}
                >
                  RULE-1C · Dose Escalation
                </p>
              </div>
            </div>

            <div
              style={{
                transform: `scale(${badgeScale})`,
                opacity: badgeOpacity,
                transformOrigin: "right center",
                background:
                  "linear-gradient(180deg, rgba(255,59,48,0.12), rgba(255,59,48,0.05))",
                border: "1px solid rgba(255,59,48,0.28)",
                boxShadow: "0 2px 8px -4px rgba(255,59,48,0.4)",
                borderRadius: 12,
                padding: "5px 13px 7px",
                textAlign: "right",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 8.5,
                  fontWeight: 600,
                  letterSpacing: 0.9,
                  color: COLOR.muted,
                }}
              >
                RISK LEVEL
              </p>
              <p
                style={{
                  margin: "1px 0 0",
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "flex-end",
                  gap: 5,
                  color: COLOR.danger,
                }}
              >
                {/* Instrument Serif carries the single focal number. */}
                <span
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 22,
                    lineHeight: 1,
                    fontWeight: 400,
                    letterSpacing: -0.2,
                  }}
                >
                  Critical
                </span>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 0.2,
                    fontFeatureSettings: "'tnum' 1",
                  }}
                >
                  L9
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* -------------------------- Protocol execution ---------------------- */}
        <div style={{ padding: "2px 24px 12px" }}>
          <SectionLabel>Protocol Execution</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {PROTOCOLS.map((p, i) => {
              const r = protocolReveals[i];
              return (
                <div
                  key={i}
                  style={{
                    opacity: r.opacity,
                    transform: `translateY(${r.translateY}px)`,
                    filter: `blur(${r.blur}px)`,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background:
                      "linear-gradient(180deg, rgba(48,209,88,0.07), rgba(48,209,88,0.025))",
                    border: "1px solid rgba(48,209,88,0.20)",
                    borderRadius: 12,
                    boxShadow: INNER_HIGHLIGHT,
                    padding: "8px 14px",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "linear-gradient(180deg, #34D862, #25A648)",
                      boxShadow:
                        "0 1px 2px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      // Tiny scale-in synced to the row reveal.
                      transform: `scale(${interpolate(
                        r.opacity,
                        [0, 1],
                        [0.6, 1]
                      )})`,
                    }}
                  >
                    <CheckGlyph size={11} />
                  </div>
                  <span
                    style={{
                      fontSize: 12.5,
                      color: COLOR.slate,
                      fontWeight: 500,
                      letterSpacing: -0.1,
                    }}
                  >
                    {p}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 9,
                      fontFamily: FONT_MONO,
                      letterSpacing: 0.5,
                      color: COLOR.successDeep,
                      opacity: 0.85,
                    }}
                  >
                    DONE
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ----------------------- Closing summary footer --------------------- */}
        {/* Final confirmation beat: drifts in after all protocols settle, then
            rests through the long calm hold. Covered by the modal exit fade. */}
        <div style={{ padding: "0 24px 14px" }}>
          <div
            style={{
              opacity: summary.opacity,
              transform: `translateY(${summary.translateY}px)`,
              filter: `blur(${summary.blur}px)`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              background:
                "linear-gradient(180deg, rgba(48,209,88,0.10), rgba(48,209,88,0.04))",
              border: "1px solid rgba(48,209,88,0.24)",
              borderRadius: 12,
              boxShadow: `${SHADOW_CARD}, ${INNER_HIGHLIGHT}`,
              padding: "9px 14px",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "linear-gradient(180deg, #34D862, #25A648)",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transform: `scale(${interpolate(
                  summary.opacity,
                  [0, 1],
                  [0.6, 1]
                )})`,
              }}
            >
              <CheckGlyph size={9} />
            </div>
            <span
              style={{
                fontSize: 12,
                color: COLOR.successDeep,
                fontWeight: 600,
                letterSpacing: -0.1,
              }}
            >
              All protocols dispatched
            </span>
            <span
              style={{
                margin: "0 2px",
                color: COLOR.faint,
                fontSize: 11,
              }}
            >
              ·
            </span>
            <span
              style={{
                fontSize: 11.5,
                color: COLOR.slate2,
                fontWeight: 500,
                letterSpacing: -0.1,
              }}
            >
              Care team notified
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 9,
                fontFamily: FONT_MONO,
                letterSpacing: 0.5,
                color: COLOR.successDeep,
                opacity: 0.85,
              }}
            >
              RESOLVED
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------ Section label ------------------------------ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 9.5,
        fontWeight: 600,
        textTransform: "uppercase",
        color: COLOR.faint,
        letterSpacing: 1.4,
        margin: "0 0 7px",
        fontFamily: FONT_UI,
      }}
    >
      {children}
    </p>
  );
}
