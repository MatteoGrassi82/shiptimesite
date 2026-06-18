import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

/* ----------------------------------------------------------------------------
   Hana — "Workflow Builder" demo  (300f / 10s @ 30fps, seamless loop)
   A modular "Confirm Appointment" workflow on the left runs live on the right.
   Apple-grade craft: layered light, restrained color, slow confident motion.
   Pacing derives from useVideoConfig() so the loop + choreography stay correct.
---------------------------------------------------------------------------- */

/* ---- Brand tokens ---------------------------------------------------------- */
const SERIF = "'Instrument Serif', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";
const MONO = "ui-monospace, 'SF Mono', 'JetBrains Mono', monospace";

const INK = "#0A0A0B";
const SLATE = "#3F3F46";
const SLATE_2 = "#52525B";
const MUTED = "#71717A";
const HAIRLINE = "rgba(0,0,0,0.06)";
const HAIRLINE_STRONG = "rgba(0,0,0,0.08)";
const CANVAS = "#F7F7F8";
const ACCENT = "#0A84FF";
const ACCENT_DEEP = "#0067D6";
const SUCCESS = "#30D158";
const SUCCESS_INK = "#1F9E4A";
const DANGER = "#FF453A";

/* Layered, realistic elevation — contact + ambient + glassy top edge. */
const CARD_SHADOW =
  "0 1px 2px rgba(10,10,11,0.04), 0 8px 22px -10px rgba(10,10,11,0.12), 0 26px 50px -28px rgba(10,10,11,0.16)";
const CARD_INSET = "inset 0 1px 0 rgba(255,255,255,0.72)";
const CARD_BG = "linear-gradient(180deg, #FFFFFF 0%, #FCFCFD 100%)";

/* ---- Motion helpers -------------------------------------------------------- */
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function easeOut(frame: number, delay: number, duration: number): number {
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
}

type Reveal = { opacity: number; translateY: number; blur: number };

/* A reveal: opacity + small upward drift + blur-to-sharp. */
function useReveal(
  frame: number,
  delay: number,
  opts: { drift?: number; blur?: number; dur?: number } = {}
): Reveal {
  const { drift = 10, blur = 0, dur = 26 } = opts;
  const t = easeOut(frame, delay, dur);
  return {
    opacity: t,
    translateY: (1 - t) * drift,
    blur: (1 - t) * blur,
  };
}

function useSoftSpring(frame: number, delay: number): number {
  const { fps } = useVideoConfig();
  return spring({
    fps,
    frame: frame - delay,
    config: { damping: 16, stiffness: 110, mass: 0.9 },
    durationInFrames: 34,
  });
}

/* Loop-safe fade applied to the whole stage so frame (durationInFrames-1) -> 0
   is seamless. Fade-out lands exactly on durationInFrames, starting 9f before. */
function loopGuard(frame: number, durationInFrames: number): number {
  const fadeIn = interpolate(frame, [0, 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 9, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.quad),
    }
  );
  return Math.min(fadeIn, fadeOut);
}

/* Mix two hex colors (#rrggbb) by t in [0,1]. */
function mix(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const pa = [
    parseInt(a.slice(1, 3), 16),
    parseInt(a.slice(3, 5), 16),
    parseInt(a.slice(5, 7), 16),
  ];
  const pb = [
    parseInt(b.slice(1, 3), 16),
    parseInt(b.slice(3, 5), 16),
    parseInt(b.slice(5, 7), 16),
  ];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * k));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/* ---- Component ------------------------------------------------------------- */
export function WorkflowBuilderComp() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  /* Choreography — wider stagger for a calm, Apple-like build over 300f.
     Begins like before, but spaced out so the build-up feels relaxed. */
  const leftCard = useReveal(frame, 6, { drift: 14, blur: 8, dur: 36 });
  const leftCardScale = interpolate(easeOut(frame, 6, 36), [0, 1], [0.97, 1]);

  const scriptReveal = useReveal(frame, 30, { drift: 8, dur: 30 });
  const branch0 = useReveal(frame, 46, { drift: 8, dur: 28 });
  const branch1 = useReveal(frame, 56, { drift: 8, dur: 28 });

  const arrowDraw = easeOut(frame, 62, 40);

  const panel = useReveal(frame, 74, { drift: 16, blur: 8, dur: 40 });
  const panelScale = interpolate(easeOut(frame, 74, 40), [0, 1], [0.97, 1]);

  const bubbleSpring = useSoftSpring(frame, 100);
  const actionCard = useReveal(frame, 150, { drift: 12, blur: 6, dur: 34 });

  /* Closing beat — a calm success chip resting under the action card.
     Reveals AFTER the action card (~frame 210+), brand easing. */
  const confirmChip = useReveal(frame, 214, { drift: 8, dur: 32 });

  /* Continuous, perfectly periodic micro-life (loop-safe over 300f).
     A single radar ping that expands AND fades together (physical).
     Period 60 divides 300 cleanly => 5 pings across the loop. */
  const pingPhase = (frame % 60) / 60;
  const pingScale = 1 + pingPhase * 1.4;
  const pingOpacity = (1 - pingPhase) * 0.28;
  /* Core pulse period 60 => 5 whole cycles over 300f. */
  const corePulse = 0.62 + 0.38 * (0.5 + 0.5 * Math.sin((frame / 60) * Math.PI * 2));

  /* Typing — slower, calmer cadence; completes ~frame 178, then rests full
     for a long, restful hold before the graceful loop-out fade. */
  const fullText =
    "Hi Ms. Johnson, I'm calling to confirm your appointment with Dr. Ramirez on Thursday, Jun 11th at 10:30am. Does that still work for you?";
  const namePrefix = "Hi Ms. Johnson";
  const typeStart = 108;
  const typeEnd = 178;
  const charCount = Math.round(
    interpolate(frame, [typeStart, typeEnd], [0, fullText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.33, 0, 0.2, 1),
    })
  );
  const typed = fullText.slice(0, charCount);
  const isTyping = frame >= typeStart && frame < typeEnd;
  /* Blink period = 12f, divides 300 cleanly (25 cycles); phase form is
     unambiguous at the loop seam (frame 0 and frame 300 both read "on"). */
  const cursorBlink = frame % 12 < 6;

  /* Highlight name only once it's been typed. */
  const nameTyped = typed.slice(0, Math.min(typed.length, namePrefix.length));
  const restTyped =
    typed.length > namePrefix.length ? typed.slice(namePrefix.length) : "";

  const stageOpacity = loopGuard(frame, durationInFrames);

  return (
    <AbsoluteFill
      style={{
        background: CANVAS,
        fontFamily: SANS,
        opacity: stageOpacity,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* --- Background: dot grid + soft radial accent glow + vignette --- */}
      <BackgroundTexture />

      {/* ===================== LEFT: Workflow card ===================== */}
      <div
        style={{
          position: "absolute",
          left: 56,
          top: 92,
          width: 366,
          opacity: leftCard.opacity,
          transform: `translateY(${leftCard.translateY}px) scale(${leftCardScale})`,
          transformOrigin: "top left",
          filter: leftCard.blur > 0.05 ? `blur(${leftCard.blur}px)` : "none",
          willChange: "transform, opacity, filter",
        }}
      >
        {/* Section eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 11,
            paddingLeft: 2,
          }}
        >
          <BuilderGlyph />
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "1.4px",
              color: MUTED,
              fontFamily: SANS,
            }}
          >
            WORKFLOW
          </span>
        </div>

        <div
          style={{
            background: CARD_BG,
            borderRadius: 18,
            border: `1px solid ${HAIRLINE}`,
            boxShadow: `${CARD_SHADOW}, ${CARD_INSET}`,
            overflow: "hidden",
          }}
        >
          {/* Header pill bar — accent gradient with top highlight */}
          <div
            style={{
              background: `linear-gradient(180deg, ${ACCENT} 0%, ${ACCENT_DEEP} 100%)`,
              padding: "13px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.24)",
            }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontSize: 13.5,
                fontWeight: 600,
                letterSpacing: "-0.2px",
                fontFamily: SANS,
              }}
            >
              Confirm Appointment
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontFamily: MONO,
                fontSize: 9.5,
                fontWeight: 500,
                letterSpacing: "0.6px",
                color: "rgba(255,255,255,0.82)",
                background: "rgba(255,255,255,0.16)",
                borderRadius: 6,
                padding: "3px 7px",
              }}
            >
              v2.1
            </span>
          </div>

          {/* Templated script */}
          <div style={{ padding: "18px 18px 8px" }}>
            <SectionLabel>SCRIPT</SectionLabel>
            <p
              style={{
                fontSize: 12,
                color: SLATE,
                lineHeight: 1.62,
                fontFamily: MONO,
                margin: 0,
                opacity: scriptReveal.opacity,
                transform: `translateY(${scriptReveal.translateY}px)`,
              }}
            >
              Hi <Token>[customer_name]</Token>, calling to confirm appointment
              with <Token>[doctor_name]</Token> on{" "}
              <Token>[appointment_time]</Token>. Does that still work for you?
            </p>
          </div>

          {/* Branch options */}
          <div style={{ padding: "12px 18px 18px" }}>
            <SectionLabel>BRANCHES</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <BranchRow
                label="Yes, confirm"
                color={SUCCESS}
                reveal={branch0}
              />
              <BranchRow
                label="No, reschedule"
                color={DANGER}
                reveal={branch1}
                active
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===================== Dashed connector arrow ===================== */}
      <ConnectorArrow progress={arrowDraw} frame={frame} />

      {/* ===================== RIGHT: Live Simulation ===================== */}
      <div
        style={{
          position: "absolute",
          right: 48,
          top: 52,
          width: 318,
          opacity: panel.opacity,
          transform: `translateY(${panel.translateY}px) scale(${panelScale})`,
          transformOrigin: "top right",
          filter: panel.blur > 0.05 ? `blur(${panel.blur}px)` : "none",
          willChange: "transform, opacity, filter",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 11,
            justifyContent: "flex-end",
            paddingRight: 2,
          }}
        >
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "1.4px",
              color: MUTED,
            }}
          >
            RUNTIME
          </span>
          <PlayGlyph />
        </div>

        {/* Main simulation card */}
        <div
          style={{
            background: CARD_BG,
            borderRadius: 18,
            border: `1px solid ${HAIRLINE}`,
            boxShadow: `${CARD_SHADOW}, ${CARD_INSET}`,
            overflow: "hidden",
          }}
        >
          {/* Header: LIVE dot + title + END CALL */}
          <div
            style={{
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ position: "relative", width: 9, height: 9 }}>
                {/* radar ping: expands AND fades together */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: SUCCESS,
                    transform: `scale(${pingScale})`,
                    opacity: pingOpacity,
                  }}
                />
                {/* steady breathing core */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: SUCCESS,
                    opacity: corePulse,
                    boxShadow: `0 0 7px ${SUCCESS}88`,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "-0.2px",
                  color: INK,
                }}
              >
                Live Simulation
              </span>
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.2px",
                color: DANGER,
                border: `1px solid ${DANGER}33`,
                background: `${DANGER}0D`,
                borderRadius: 8,
                padding: "4px 9px",
              }}
            >
              End Call
            </div>
          </div>

          {/* Waveform + AGENT SPEAKING */}
          <div style={{ padding: "18px 0 4px" }}>
            <Waveform
              frame={frame}
              durationInFrames={durationInFrames}
              active={panel.opacity > 0.6}
            />
            <div
              style={{
                textAlign: "center",
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9.5,
                  letterSpacing: "1.8px",
                  color: MUTED,
                  fontWeight: 500,
                }}
              >
                AGENT SPEAKING
              </span>
            </div>
          </div>

          {/* Typing chat bubble */}
          <div
            style={{
              margin: "10px 16px 16px",
              transform: `translateY(${(1 - bubbleSpring) * 10}px) scale(${interpolate(
                bubbleSpring,
                [0, 1],
                [0.96, 1]
              )})`,
              transformOrigin: "top left",
              opacity: clamp01(bubbleSpring * 1.4),
            }}
          >
            <div
              style={{
                background: "linear-gradient(180deg, #FBFBFD 0%, #F6F6F8 100%)",
                border: `1px solid ${HAIRLINE_STRONG}`,
                borderRadius: 14,
                padding: "12px 14px",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(10,10,11,0.03)",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: SLATE,
                  lineHeight: 1.6,
                  margin: 0,
                  minHeight: 48,
                  fontFamily: SANS,
                }}
              >
                <span style={{ color: ACCENT, fontWeight: 600 }}>
                  {nameTyped}
                </span>
                {restTyped}
                <span
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 12,
                    marginLeft: 1,
                    marginBottom: -1.5,
                    borderRadius: 1,
                    background: ACCENT,
                    opacity: isTyping ? (cursorBlink ? 1 : 0.25) : 0,
                    verticalAlign: "baseline",
                  }}
                />
              </p>
            </div>
          </div>
        </div>

        {/* Action: Follow-up card */}
        <div
          style={{
            marginTop: 12,
            background: CARD_BG,
            borderRadius: 16,
            border: `1px solid ${HAIRLINE}`,
            boxShadow: `0 1px 2px rgba(10,10,11,0.04), 0 10px 26px -14px rgba(10,10,11,0.14), ${CARD_INSET}`,
            padding: "13px 16px",
            opacity: actionCard.opacity,
            transform: `translateY(${actionCard.translateY}px)`,
            filter:
              actionCard.blur > 0.05 ? `blur(${actionCard.blur}px)` : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 7,
            }}
          >
            <BoltGlyph />
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                letterSpacing: "-0.1px",
                color: INK,
              }}
            >
              Action — Follow-up
            </span>
          </div>
          <p
            style={{
              fontSize: 11,
              color: SLATE_2,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            On reschedule, a silent{" "}
            <span style={{ fontFamily: MONO, color: SLATE, fontSize: 10.5 }}>
              get_slots
            </span>{" "}
            query to the EHR presents open availability.
          </p>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: `${SUCCESS}14`,
                border: `1px solid ${SUCCESS}33`,
                borderRadius: 9,
                padding: "4px 9px",
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: SUCCESS,
                  boxShadow: `0 0 5px ${SUCCESS}aa`,
                }}
              />
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: SUCCESS_INK,
                  letterSpacing: "-0.1px",
                }}
              >
                Slots Available
              </span>
            </div>
          </div>
        </div>

        {/* Closing beat — calm confirmation chip, rests after the action card.
           Brand SUCCESS tokens, layered shadow; covered by loopGuard fade.
           Kept compact + tight margin so the right column stays within 506px. */}
        <div
          style={{
            marginTop: 8,
            display: "flex",
            justifyContent: "flex-end",
            opacity: confirmChip.opacity,
            transform: `translateY(${confirmChip.translateY}px)`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: `${SUCCESS}14`,
              border: `1px solid ${SUCCESS}33`,
              borderRadius: 10,
              padding: "6px 11px",
              boxShadow: `0 1px 2px rgba(10,10,11,0.04), 0 8px 18px -12px rgba(31,158,74,0.30), ${CARD_INSET}`,
            }}
          >
            <CheckGlyph />
            <span
              style={{
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 600,
                color: SUCCESS_INK,
                letterSpacing: "-0.1px",
              }}
            >
              Caller confirmed
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 10,
                fontWeight: 500,
                color: SUCCESS_INK,
                opacity: 0.85,
                letterSpacing: "0.2px",
              }}
            >
              · Wed booked
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ============================================================================
   Sub-components
============================================================================ */

function SectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: 9.5,
        fontWeight: 600,
        letterSpacing: "1.2px",
        color: MUTED,
        marginBottom: 9,
        fontFamily: SANS,
      }}
    >
      {children}
    </div>
  );
}

function BackgroundTexture() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(10,10,11,0.045) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          backgroundPosition: "-1px -1px",
          opacity: 0.7,
        }}
      />
      {/* Soft accent glow behind the runtime panel */}
      <div
        style={{
          position: "absolute",
          right: -60,
          top: -40,
          width: 460,
          height: 460,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(10,132,255,0.10) 0%, rgba(10,132,255,0.03) 40%, transparent 70%)",
          filter: "blur(4px)",
        }}
      />
      {/* Warm low-left wash */}
      <div
        style={{
          position: "absolute",
          left: -80,
          bottom: -120,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 65%)",
        }}
      />
      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 60%, rgba(10,10,11,0.035) 100%)",
        }}
      />
    </div>
  );
}

function Token({ children }: { children: string }) {
  return (
    <span
      style={{
        color: ACCENT_DEEP,
        background: "rgba(10,132,255,0.08)",
        borderRadius: 5,
        padding: "1px 4px",
        fontFamily: MONO,
        fontSize: 11.5,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function BranchRow({
  label,
  color,
  reveal,
  active = false,
}: {
  label: string;
  color: string;
  reveal: Reveal;
  active?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "9px 11px",
        borderRadius: 11,
        background: active ? "rgba(10,132,255,0.05)" : "rgba(10,10,11,0.018)",
        border: `1px solid ${active ? "rgba(10,132,255,0.16)" : HAIRLINE}`,
        opacity: reveal.opacity,
        transform: `translateY(${reveal.translateY}px)`,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 6px ${color}66`,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 12,
          color: SLATE,
          fontWeight: 500,
          letterSpacing: "-0.1px",
        }}
      >
        {label}
      </span>
      {/* connector node */}
      <div
        style={{
          marginLeft: "auto",
          width: 16,
          height: 16,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1.5px solid ${active ? ACCENT : "rgba(10,10,11,0.16)"}`,
          background: active ? ACCENT : "transparent",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: active ? "#fff" : "rgba(10,10,11,0.22)",
          }}
        />
      </div>
    </div>
  );
}

function ConnectorArrow({
  progress,
  frame,
}: {
  progress: number;
  frame: number;
}) {
  // The curve length for stroke-dash draw-in.
  const LEN = 120;
  const dashOffset = LEN * (1 - progress);
  // Flowing dashes once drawn. Period must divide the loop length for a clean
  // loop. dash cell = 9 (2 gap + 7), travel one cell every 6 frames; 6 divides
  // 300 => 50 whole cells across the loop, so it returns to phase at the end.
  const flow = -((frame / 6) % 1) * 9;
  const headOpacity = interpolate(progress, [0.7, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      style={{ position: "absolute", left: 416, top: 150, overflow: "visible" }}
      width="120"
      height="90"
      viewBox="0 0 120 90"
    >
      <defs>
        <linearGradient id="wf-arrow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.35" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* draw-in solid base (subtle) */}
      <path
        d="M 4 14 C 56 14, 50 60, 104 60"
        stroke="url(#wf-arrow)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={LEN}
        strokeDashoffset={dashOffset}
      />
      {/* flowing dotted overlay */}
      <path
        d="M 4 14 C 56 14, 50 60, 104 60"
        stroke={ACCENT}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="2 7"
        strokeDashoffset={flow}
        opacity={progress * 0.9}
      />
      {/* arrowhead — tip aligned to path end at (104, 60) */}
      <g opacity={headOpacity}>
        <path
          d="M 99 54.5 L 104 60 L 99 65.5"
          stroke={ACCENT}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

function Waveform({
  frame,
  durationInFrames,
  active,
}: {
  frame: number;
  durationInFrames: number;
  active: boolean;
}) {
  // 23 bars, smooth traveling envelope. Periodic over the full loop:
  // t advances exactly 2π across durationInFrames, and the oscillator
  // multipliers below are integers so every cycle closes cleanly.
  const bars = 23;
  const t = (frame / durationInFrames) * Math.PI * 2;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        height: 40,
      }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        const center = (bars - 1) / 2;
        const dist = Math.abs(i - center) / center; // 0 center -> 1 edges
        const envelope = 1 - dist * 0.55; // taller in the middle
        const wobble =
          Math.sin(t * 4 + i * 0.7) * 0.5 +
          Math.sin(t * 6 - i * 0.45) * 0.32 +
          Math.sin(t * 2 + i * 1.1) * 0.18;
        const norm = (wobble + 1) / 2; // 0..1
        const h = active ? 4 + envelope * norm * 30 : 4;
        // continuous color luminance instead of a hard on/off threshold
        const lit = clamp01((norm - 0.35) / 0.45);
        const barColor = mix("#9CC9FF", ACCENT, lit);
        return (
          <div
            key={i}
            style={{
              width: 3,
              height: h,
              borderRadius: 2,
              background: barColor,
              opacity: active ? 0.45 + envelope * 0.5 : 0.3,
            }}
          />
        );
      })}
    </div>
  );
}

/* ---- Micro-iconography (consistent 1.6px stroke) --------------------------- */

function BuilderGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <rect
        x="1.5"
        y="1.5"
        width="5"
        height="5"
        rx="1.4"
        stroke={MUTED}
        strokeWidth="1.6"
      />
      <rect
        x="9.5"
        y="1.5"
        width="5"
        height="5"
        rx="1.4"
        stroke={MUTED}
        strokeWidth="1.6"
      />
      <rect
        x="5.5"
        y="9.5"
        width="5"
        height="5"
        rx="1.4"
        stroke={MUTED}
        strokeWidth="1.6"
      />
      <path
        d="M4 6.5v1.2a1.5 1.5 0 0 0 1.5 1.5h.5M12 6.5v1.2a1.5 1.5 0 0 1-1.5 1.5H10"
        stroke={MUTED}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: `${SUCCESS}1F`,
        border: `1px solid ${SUCCESS}40`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
        <path
          d="M3.5 8.5 L6.5 11.5 L12.5 4.5"
          stroke={SUCCESS_INK}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function PlayGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={MUTED} strokeWidth="1.6" />
      <path
        d="M6.4 5.6 L10.6 8 L6.4 10.4 Z"
        fill={MUTED}
        stroke={MUTED}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoltGlyph() {
  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: 7,
        background: "rgba(10,132,255,0.10)",
        border: "1px solid rgba(10,132,255,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
        <path
          d="M9 1.5 L3.5 8.8 H7.5 L7 14.5 L12.5 7.2 H8.5 Z"
          fill={ACCENT}
          stroke={ACCENT}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
