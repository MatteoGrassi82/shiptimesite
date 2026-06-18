import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

/* ------------------------------------------------------------------ */
/*  Hana — Patient Context demo. Apple-grade redesign.                 */
/*  Canvas 900x506 @ 30fps, 300-frame graceful loop (10s).             */
/*  Narrative preserved: every interaction enriches a persistent       */
/*  patient-context record (timeline -> chat -> dark synced panel).    */
/* ------------------------------------------------------------------ */

/* ---- Brand tokens -------------------------------------------------- */
const INK = "#0A0A0B";
const INK_DEEP = "#030213";
const SLATE = "#3F3F46";
const SLATE_2 = "#52525B";
const MUTED = "#71717A";
const CANVAS = "#F7F7F8";
const HAIRLINE = "rgba(0,0,0,0.06)";
const HAIRLINE_2 = "rgba(0,0,0,0.08)";
const BLUE = "#0A84FF";
const SUCCESS = "#30D158";
const DANGER = "#FF453A";

const SERIF = "'Instrument Serif', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";
const MONO = "ui-monospace, 'SF Mono', 'JetBrains Mono', monospace";

/* Layered, realistic shadows ---------------------------------------- */
const CARD_SHADOW =
  "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -10px rgba(0,0,0,0.12), 0 24px 48px -28px rgba(0,0,0,0.12)";
const CARD_SHADOW_SOFT =
  "0 1px 2px rgba(0,0,0,0.03), 0 6px 18px -10px rgba(0,0,0,0.10), 0 18px 40px -28px rgba(0,0,0,0.10)";
const PANEL_SHADOW =
  "0 1px 2px rgba(0,0,0,0.06), 0 12px 34px -12px rgba(0,0,0,0.30), 0 30px 60px -30px rgba(0,0,0,0.35)";
const TOP_INNER_HIGHLIGHT = "inset 0 1px 0 rgba(255,255,255,0.75)";

/* ---- Motion helpers ------------------------------------------------ */
/*  NOTE: these are PURE functions, not hooks. spring()/interpolate()  */
/*  are not React hooks, so it is safe (and rules-of-hooks-clean) to   */
/*  call these inside .map() callbacks. `frame` and `fps` are threaded */
/*  through as plain arguments.                                        */
type RevealOpts = { delay?: number; drift?: number; blur?: number; dur?: number };
type Reveal = { opacity: number; translateY: number; blur: number; t: number };

function reveal(
  frame: number,
  fps: number,
  { delay = 0, drift = 10, blur = 0, dur = 26 }: RevealOpts = {}
): Reveal {
  const s = spring({
    fps,
    frame: frame - delay,
    config: { damping: 22, stiffness: 130, mass: 0.9 },
    durationInFrames: dur,
  });
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(s, [0, 1], [drift, 0]);
  const blurPx =
    blur > 0 ? interpolate(s, [0, 1], [blur, 0], { extrapolateRight: "clamp" }) : 0;
  return { opacity, translateY, blur: blurPx, t: s };
}

/* gentle overshoot spring used for hero scale-ins */
function overshoot(frame: number, fps: number, delay: number, dur = 30): number {
  return spring({
    fps,
    frame: frame - delay,
    config: { damping: 14, stiffness: 140, mass: 0.85 },
    durationInFrames: dur,
  });
}

/* clamp helper */
const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

/* ---- Iconography (consistent 1.6px stroke) ------------------------ */
function CheckBadge({ size = 14, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9.25" stroke={color} strokeWidth="1.6" />
      <path
        d="M8 12.2l2.6 2.6L16 9.2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function DocIcon({ size = 12, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="3" width="16" height="18" rx="3" stroke={color} strokeWidth="1.6" />
      <path d="M8 9h8M8 13h8M8 17h5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function WhatsAppGlyph({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9 8.6c-.3 0-.6.1-.8.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.8 2.1.8 2.5.6 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.1l-.6-.3-1.6-.8c-.2-.1-.4-.1-.6.1l-.6.8c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3.2-.5 0-.2 0-.3 0-.5l-.7-1.7c-.2-.5-.4-.5-.6-.5H9z"
        fill="#fff"
      />
    </svg>
  );
}

/* ---- Static data (defined once, outside render) ------------------- */
type Card = {
  month: string;
  day: string;
  label: string;
  bullets: string[];
  active: boolean;
};

const CARDS: Card[] = [
  {
    month: "JUN",
    day: "01",
    label: "PREFERENCE CAPTURE",
    bullets: ["Consent + channel", "Explanation level"],
    active: true,
  },
  {
    month: "JUN",
    day: "02",
    label: "CHECK-IN CALL",
    bullets: ["Run protocol", "Baseline delta check"],
    active: false,
  },
  {
    month: "JUN",
    day: "07",
    label: "FOLLOW-UP",
    bullets: ["Review + adherence", "Adjust cadence"],
    active: false,
  },
];

type Row = { label: string; value: string; delay: number; mono?: boolean };
const ROWS: Row[] = [
  { label: "Preferred channel:", value: "WhatsApp", delay: 118 },
  { label: "Explanation level:", value: "Simple", delay: 138 },
  { label: "Best time:", value: "Tue 6–7pm", delay: 158, mono: true },
];

const WAVE_BARS = 5;

/* ================================================================== */

export function PatientContextComp() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  /* Normalized loop phase [0,1). Used for all continuous micro-life so
     every cyclic value returns exactly to its frame-0 state on wrap. */
  const loop = frame / durationInFrames;
  const TWO_PI = Math.PI * 2;

  /* Global intro: soft blur-to-sharp on the whole stage. On loop the
     frame resets to 0, so this replays cleanly. The stage rests fully
     opaque at the wrap point (no 0.985 dip → no pop on the seam). */
  const stageIn = reveal(frame, fps, { delay: 0, drift: 0, blur: 8, dur: 20 });

  /* Chrome (top bar / footer) */
  const topBar = reveal(frame, fps, { delay: 4, drift: -6, dur: 24 });
  const footer = reveal(frame, fps, { delay: 10, drift: 6, dur: 24 });

  /* Chat snippet + dark panel reveals */
  const chat = reveal(frame, fps, { delay: 60, drift: 10, blur: 4, dur: 28 });
  const panelOver = overshoot(frame, fps, 92, 36);
  const panelOpacity = interpolate(panelOver, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const panelScale = interpolate(panelOver, [0, 1], [0.94, 1]);
  const panelLift = interpolate(panelOver, [0, 1], [12, 0]);

  const syncedReveal = reveal(frame, fps, { delay: 182, drift: 6, dur: 24 });

  /* Closing beat: a small "saved to record" confirmation row drifts in
     below SYNCED, after everything else has settled. Lands by ~frame 236,
     leaving a calm restful hold before the loop wraps at 300. */
  const savedReveal = reveal(frame, fps, { delay: 210, drift: 8, blur: 3, dur: 26 });

  /* Pre-compute per-item reveals OUTSIDE of JSX .map() so no hook is
     ever (even pure-function-style) tangled with conditional iteration.
     These are plain values now, but keeping them flat keeps render
     order obvious and stable. */
  const cardReveals = CARDS.map((_, i) =>
    reveal(frame, fps, { delay: 18 + i * 14, drift: 14, blur: 5, dur: 32 })
  );
  const bulletReveals = CARDS.map((card, i) =>
    card.bullets.map((_, j) =>
      reveal(frame, fps, { delay: 30 + i * 14 + j * 9, drift: 5, dur: 22 })
    )
  );
  const rowReveals = ROWS.map((row) =>
    reveal(frame, fps, { delay: row.delay, drift: 7, dur: 22 })
  );

  /* Continuous micro-life ------------------------------------------- */
  // breathing pulse for live dots — 3 integer cycles over the loop.
  const breathe = 0.5 + 0.5 * Math.sin(loop * TWO_PI * 3);
  const dotPulse = 0.55 + 0.45 * breathe;
  const ringScale = 1 + 0.9 * breathe;
  const ringOpacity = 0.35 * (1 - breathe);

  // cursor blink — softened square wave, 9 integer cycles over the loop.
  // smoothstep on the sine keeps the on/off transition from hard-popping
  // while still reading as a blink, and returns to frame-0 state on wrap.
  const blinkRaw = Math.sin(loop * TWO_PI * 9);
  const cursorOn = clamp01(blinkRaw * 6 + 0.5);

  return (
    <AbsoluteFill
      style={{
        background: CANVAS,
        fontFamily: SANS,
        opacity: stageIn.opacity,
        filter: stageIn.blur > 0.05 ? `blur(${stageIn.blur}px)` : "none",
      }}
    >
      {/* ---- Ambient canvas texture: dot grid + soft radial glow ---- */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(10,10,11,0.035) 1px, transparent 1.2px)",
          backgroundSize: "22px 22px",
          backgroundPosition: "0 0",
          opacity: 0.6,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(620px 360px at 22% 14%, rgba(10,132,255,0.07), transparent 70%), radial-gradient(560px 420px at 86% 88%, rgba(10,132,255,0.045), transparent 72%)",
        }}
      />
      {/* subtle vignette so the canvas isn't dead-flat */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 140px rgba(0,0,0,0.05)",
          pointerEvents: "none",
        }}
      />

      {/* ================= TOP BAR ================= */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: `1px solid ${HAIRLINE}`,
          boxShadow: TOP_INNER_HIGHLIGHT,
          display: "flex",
          alignItems: "center",
          padding: "0 26px",
          gap: 12,
          opacity: topBar.opacity,
          transform: `translateY(${topBar.translateY}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 9, flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: 11,
              fontFamily: MONO,
              color: MUTED,
              letterSpacing: 0.2,
              textTransform: "uppercase",
            }}
          >
            To
          </span>
          <span
            style={{
              fontSize: 14.5,
              color: INK,
              letterSpacing: -0.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Hi Ms. Johnson, this is Hana confirming your appointment
            <span
              style={{
                display: "inline-block",
                width: 1.5,
                height: 14,
                marginLeft: 3,
                transform: "translateY(2px)",
                background: BLUE,
                opacity: cursorOn,
              }}
            />
          </span>
        </div>

        {/* WhatsApp channel chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "linear-gradient(180deg, #2BD46A 0%, #20BD5A 100%)",
            borderRadius: 9,
            padding: "6px 12px 6px 10px",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.10), 0 6px 14px -8px rgba(32,189,90,0.55), inset 0 1px 0 rgba(255,255,255,0.35)",
          }}
        >
          <WhatsAppGlyph size={14} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", letterSpacing: 0.1 }}>
            WhatsApp
          </span>
        </div>

        {/* Avatar + online dot */}
        <div style={{ position: "relative", width: 34, height: 34 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(180deg, #FFFFFF 0%, #ECECEE 100%)",
              border: `1px solid ${HAIRLINE_2}`,
              boxShadow: "0 1px 2px rgba(0,0,0,0.06), " + TOP_INNER_HIGHLIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8.5" r="3.6" stroke={MUTED} strokeWidth="1.6" />
              <path
                d="M5 19.5c0-3.7 3.2-6 7-6s7 2.3 7 6"
                stroke={MUTED}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          {/* pulsing ring */}
          <div
            style={{
              position: "absolute",
              right: -1,
              bottom: -1,
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: SUCCESS,
              transform: `scale(${ringScale})`,
              opacity: ringOpacity,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: -1,
              bottom: -1,
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: SUCCESS,
              border: "2px solid #fff",
              boxShadow: "0 0 0 0.5px rgba(0,0,0,0.04)",
            }}
          />
        </div>
      </div>

      {/* ================= TIMELINE CARDS ================= */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 92,
          display: "flex",
          gap: 16,
        }}
      >
        {CARDS.map((card, i) => {
          const r = cardReveals[i];
          const accent = card.active;
          return (
            <div
              key={i}
              style={{
                opacity: r.opacity * (accent ? 1 : 0.82),
                transform: `translateY(${r.translateY}px)`,
                filter: r.blur > 0.05 ? `blur(${r.blur}px)` : "none",
                width: 152,
                background: "#FFFFFF",
                borderRadius: 18,
                boxShadow: accent ? CARD_SHADOW : CARD_SHADOW_SOFT,
                border: `1px solid ${HAIRLINE}`,
                overflow: "hidden",
              }}
            >
              {/* calendar header */}
              <div
                style={{
                  position: "relative",
                  background: accent
                    ? "linear-gradient(180deg, #2A93FF 0%, #0A84FF 100%)"
                    : "linear-gradient(180deg, #F4F4F5 0%, #ECECEE 100%)",
                  padding: "13px 12px 11px",
                  textAlign: "center",
                  boxShadow: accent
                    ? "inset 0 1px 0 rgba(255,255,255,0.30)"
                    : "inset 0 1px 0 rgba(255,255,255,0.6)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 10,
                    fontFamily: MONO,
                    fontWeight: 600,
                    color: accent ? "rgba(255,255,255,0.92)" : MUTED,
                    letterSpacing: 2,
                  }}
                >
                  {card.month}
                </p>
                <p
                  style={{
                    margin: "1px 0 0",
                    fontSize: 32,
                    fontFamily: SERIF,
                    fontWeight: 400,
                    color: accent ? "#fff" : SLATE_2,
                    lineHeight: 1.05,
                    letterSpacing: -0.5,
                    fontFeatureSettings: "'tnum' 1",
                  }}
                >
                  {card.day}
                </p>
                {/* active indicator dot in header */}
                {accent && (
                  <div
                    style={{
                      position: "absolute",
                      top: 11,
                      right: 11,
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#fff",
                      opacity: dotPulse,
                      boxShadow: "0 0 8px rgba(255,255,255,0.8)",
                    }}
                  />
                )}
              </div>

              {/* body */}
              <div style={{ padding: "12px 13px 14px" }}>
                <p
                  style={{
                    margin: "0 0 9px",
                    fontSize: 9,
                    fontFamily: MONO,
                    fontWeight: 600,
                    color: accent ? BLUE : MUTED,
                    letterSpacing: 0.8,
                  }}
                >
                  {card.label}
                </p>
                {card.bullets.map((b, j) => {
                  const br = bulletReveals[i][j];
                  return (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: j === card.bullets.length - 1 ? 0 : 6,
                        opacity: br.opacity,
                        transform: `translateY(${br.translateY}px)`,
                      }}
                    >
                      <CheckBadge size={13} color={SUCCESS} />
                      <span style={{ fontSize: 11, color: SLATE, letterSpacing: -0.1 }}>{b}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= RIGHT COLUMN ================= */}
      <div
        style={{
          position: "absolute",
          right: 30,
          top: 84,
          width: 286,
        }}
      >
        {/* Mini chat snippet */}
        <div
          style={{
            opacity: chat.opacity,
            transform: `translateY(${chat.translateY}px)`,
            filter: chat.blur > 0.05 ? `blur(${chat.blur}px)` : "none",
            background: "#FFFFFF",
            borderRadius: 16,
            border: `1px solid ${HAIRLINE}`,
            boxShadow: CARD_SHADOW_SOFT + ", " + TOP_INNER_HIGHLIGHT,
            padding: "13px 14px",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 9,
                background: "linear-gradient(180deg, #EAF4FF 0%, #DCEBFF 100%)",
                border: "1px solid rgba(10,132,255,0.16)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DocIcon size={13} color={BLUE} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: "0 0 3px",
                  fontSize: 9.5,
                  fontFamily: MONO,
                  fontWeight: 600,
                  color: MUTED,
                  letterSpacing: 0.6,
                }}
              >
                HANA
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: SLATE,
                  margin: 0,
                  lineHeight: 1.55,
                  letterSpacing: -0.1,
                }}
              >
                Noted your preferences — I’ll keep it simple next time.
              </p>
            </div>
          </div>
        </div>

        {/* Dark PATIENT CONTEXT panel */}
        <div
          style={{
            opacity: panelOpacity,
            transform: `translateY(${panelLift}px) scale(${panelScale})`,
            transformOrigin: "top right",
            background:
              "linear-gradient(180deg, #15151A 0%, " + INK_DEEP + " 100%)",
            borderRadius: 18,
            padding: "16px 18px 16px",
            boxShadow: PANEL_SHADOW + ", inset 0 1px 0 rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {/* header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <DocIcon size={13} color="#8E8E96" />
            <span
              style={{
                fontSize: 9.5,
                fontFamily: MONO,
                fontWeight: 600,
                color: "#9A9AA2",
                letterSpacing: 1.1,
              }}
            >
              PATIENT CONTEXT
            </span>
            <span
              style={{
                fontSize: 8.5,
                fontFamily: MONO,
                fontWeight: 600,
                color: SUCCESS,
                letterSpacing: 0.8,
                marginLeft: "auto",
                padding: "2px 7px",
                borderRadius: 6,
                background: "rgba(48,209,88,0.12)",
                border: "1px solid rgba(48,209,88,0.22)",
              }}
            >
              UPDATED
            </span>
          </div>

          {/* rows fill in one by one */}
          {ROWS.map((row, i) => {
            const rr = rowReveals[i];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 11,
                  opacity: rr.opacity,
                  transform: `translateY(${rr.translateY}px)`,
                }}
              >
                <CheckBadge size={14} color={SUCCESS} />
                <span style={{ fontSize: 11.5, color: "#9A9AA2", letterSpacing: -0.1 }}>
                  {row.label}
                </span>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: "#F5F5F7",
                    marginLeft: "auto",
                    letterSpacing: -0.1,
                    fontFamily: row.mono ? MONO : SANS,
                  }}
                >
                  {row.value}
                </span>
              </div>
            );
          })}

          {/* footer */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              marginTop: 4,
              paddingTop: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: syncedReveal.opacity,
              transform: `translateY(${syncedReveal.translateY}px)`,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontFamily: MONO,
                color: "#6B6B73",
                letterSpacing: 0.4,
              }}
            >
              ID&nbsp;RD8XG5
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span
                style={{
                  fontSize: 9.5,
                  fontFamily: MONO,
                  fontWeight: 600,
                  color: "#8E8E96",
                  letterSpacing: 1,
                }}
              >
                SYNCED
              </span>
              <div style={{ position: "relative", width: 8, height: 8 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: SUCCESS,
                    transform: `scale(${ringScale})`,
                    opacity: ringOpacity * 1.4,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: SUCCESS,
                    opacity: dotPulse,
                    boxShadow: "0 0 6px rgba(48,209,88,0.7)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* closing beat — saved-to-record confirmation row */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              marginTop: 10,
              paddingTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: savedReveal.opacity,
              transform: `translateY(${savedReveal.translateY}px)`,
              filter: savedReveal.blur > 0.05 ? `blur(${savedReveal.blur}px)` : "none",
            }}
          >
            <CheckBadge size={13} color={SUCCESS} />
            <span
              style={{
                fontSize: 10.5,
                color: "#9A9AA2",
                letterSpacing: -0.1,
                lineHeight: 1.3,
              }}
            >
              Saved to patient record
              <span style={{ color: "#6B6B73" }}> · </span>
              <span style={{ color: "#F5F5F7" }}>Ready for next touch</span>
            </span>
          </div>
        </div>
      </div>

      {/* ================= FOOTER BAR ================= */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 52,
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderTop: `1px solid ${HAIRLINE}`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
          display: "flex",
          alignItems: "center",
          padding: "0 26px",
          justifyContent: "space-between",
          opacity: footer.opacity,
          transform: `translateY(${footer.translateY}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative", width: 9, height: 9 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: DANGER,
                  transform: `scale(${ringScale})`,
                  opacity: ringOpacity * 1.3,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: DANGER,
                  opacity: dotPulse,
                  boxShadow: "0 0 6px rgba(255,69,58,0.6)",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                fontFamily: MONO,
                fontWeight: 600,
                color: SLATE,
                letterSpacing: 1,
              }}
            >
              VOICE CHANNEL ACTIVE
            </span>
          </div>

          {/* gentle live waveform — 4 integer cycles over the loop */}
          <div style={{ display: "flex", alignItems: "center", gap: 3, height: 18 }}>
            {Array.from({ length: WAVE_BARS }).map((_, i) => {
              const phase = loop * TWO_PI * 4 + i * 0.9;
              const h = 5 + (0.5 + 0.5 * Math.sin(phase)) * 11;
              return (
                <div
                  key={i}
                  style={{
                    width: 2.5,
                    height: h,
                    borderRadius: 2,
                    background: `rgba(63,63,70,${0.35 + 0.4 * clamp01(h / 16)})`,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* END CALL chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "linear-gradient(180deg, #FF5C52 0%, #FF3B30 100%)",
            borderRadius: 9,
            padding: "7px 15px",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.12), 0 6px 14px -8px rgba(255,59,48,0.55), inset 0 1px 0 rgba(255,255,255,0.30)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 4.5c1 0 1.8.7 2 1.6l.5 2c.1.6-.1 1.2-.6 1.6l-1.2.9c.9 1.8 2.4 3.3 4.2 4.2l.9-1.2c.4-.5 1-.7 1.6-.6l2 .5c.9.2 1.6 1 1.6 2v1.7c0 1.1-.9 2-2 2C9.6 19.7 4.3 14.4 4.3 7.2c0-1.1.9-2 2-2z"
              fill="#fff"
            />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", letterSpacing: 0.2 }}>
            End call
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
