import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

/* ============================================================================
   ShipTime — Shipping Flow (PORTRAIT 1080x1350, 4:5) — ANIMATED HERO
   ----------------------------------------------------------------------------
   MOTION layer over an already-approved STATIC layout. Positions, sizes,
   colors and composition are IDENTICAL to the approved still — this file only
   adds staggered entrance/timing animation that RESOLVES to that exact frame
   by ~f230, HOLDS f235-288, then runs the standard 12f loop-out fade
   (f288-300) so it loops seamlessly. Pure function of useCurrentFrame() — no
   Date, no random.

   The journey reads as a TALL VERTICAL FLOW that fills the 1350px frame
   top-to-bottom (NOT a thin horizontal rail):

     Title block ............................. top
     ┌ Station 1 — INTAKE / Order in
     │ Station 2 — COMPARE  (large hero card: 4 carrier rows + winning row)
     │ Station 3 — PRINT LABEL  (printed slip: barcode, wordmark, $8.90, code)
     └ Station 4 — DELIVERED  (parcel at destination pin + green Delivered pill)
     Caption ................................. bottom

   A vertical rail runs down the left, linking the four station dots with an
   orange progress fill. CSS divs + inline SVG only — no images, no randomness.
   ========================================================================== */

const SANS = "'Manrope', system-ui, sans-serif";
const BODY = "'Inter', system-ui, sans-serif";
const MONO = "ui-monospace, 'SF Mono', monospace";

const NAVY = "#1C1E3D";
const NAVY_2 = "#24264A";
const ORANGE = "#EC5A26";
const LIGHT_BLUE = "#E3EEFC";
const MUTED = "#6E728A";
const BORDER = "#E8E8E8";
const WHITE = "#FFFFFF";
const GREEN = "#3FA864";

// ----------------------------------------------------------------------------
// Layout geometry. ~64px page padding. The rail spine sits at RAIL_X; each
// station occupies a horizontal band that fills the frame vertically.
// ----------------------------------------------------------------------------
const PAD = 64;
const RAIL_X = PAD + 22; // spine x — dots sit on it, content flows to its right
const TITLE_BOTTOM = 250; // title block reserves the top ~250px
const CAPTION_TOP = 1262; // caption baseline area
// Four station-dot centers, spread to fill the vertical band between title and
// caption. Station 2 (Compare) owns the large central zone — its hero card
// extends downward from its dot, so stations 3 & 4 sit well below the card.
const STATION_Y = [300, 452, 1006, 1216];

// ----------------------------------------------------------------------------
// Motion helpers (shared project conventions). Pure functions of frame.
// ----------------------------------------------------------------------------
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Eased 0->1 ramp over [delay, delay+duration]. */
function easeOut(frame: number, delay: number, duration: number): number {
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
}

/** A staggered reveal: opacity 0->1 with a small upward translateY drift. */
function reveal(
  frame: number,
  delay: number,
  duration = 26,
  drift = 14
): { opacity: number; translateY: number } {
  const t = easeOut(frame, delay, duration);
  return { opacity: t, translateY: (1 - t) * drift };
}

/** Cosine ease-in-out used for the graceful loop hand-off (no hard pop). */
function smoothPulse(t: number): number {
  return 0.5 - 0.5 * Math.cos(clamp01(t) * Math.PI);
}

// ----------------------------------------------------------------------------
// The parcel: navy rounded box with crossed orange tape + a corner label.
// `labelGlow` (0->1) animates the corner label's settle (dim -> bright + glow).
// At rest (1) it is byte-for-byte the approved static look.
// ----------------------------------------------------------------------------
function Parcel({ size = 120, labelGlow = 1 }: { size?: number; labelGlow?: number }) {
  const tape = "rgba(240,132,91,0.9)";
  const tapeW = size * 0.094;
  const labelW = size * 0.31;
  const labelH = size * 0.23;
  const pad = size * 0.094;
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: size * 0.19,
        background: `linear-gradient(150deg, ${NAVY} 0%, ${NAVY_2} 100%)`,
        boxShadow: "0 26px 44px -20px rgba(28,30,61,0.55)",
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
      }}
    >
      {/* crossed tape */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: tapeW,
          marginTop: -tapeW / 2,
          background: tape,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: tapeW,
          marginLeft: -tapeW / 2,
          background: tape,
        }}
      />
      {/* corner shipping-label rectangle (settled = bright + green glow) */}
      <div
        style={{
          position: "absolute",
          right: pad,
          bottom: pad,
          width: labelW,
          height: labelH,
          borderRadius: 4,
          background: WHITE,
          boxShadow: `0 0 ${9 * labelGlow}px rgba(63,168,100,${0.6 * labelGlow})`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 2,
          padding: "0 4px",
        }}
      >
        <span style={{ height: 2, borderRadius: 2, background: NAVY, opacity: 0.55, width: "85%" }} />
        <span style={{ height: 2, borderRadius: 2, background: NAVY, opacity: 0.4, width: "60%" }} />
        <span style={{ height: 2, borderRadius: 2, background: ORANGE, opacity: 0.7, width: "75%" }} />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Carrier rate-ladder rows for the Compare card (static, final values).
// ----------------------------------------------------------------------------
type Row = {
  carrier: string;
  service: "Courier" | "LTL" | "Parcel";
  price: number;
  own?: boolean;
  cheapest?: boolean;
};
const ROWS: Row[] = [
  { carrier: "UPS", service: "Courier", price: 11.85 },
  { carrier: "FedEx", service: "Courier", price: 13.1 },
  { carrier: "Canada Post", service: "Parcel", price: 9.4 },
  { carrier: "Estes", service: "LTL", price: 14.2 },
];
const OWN_ROW: Row = { carrier: "Your rate", service: "Courier", price: 8.9, own: true, cheapest: true };

// CSS-barcode bar widths (deterministic).
const BARCODE = [2, 4, 2, 6, 2, 3, 5, 2, 4, 2, 2, 6, 3, 2, 5, 2, 4, 2, 3, 6, 2, 4, 2, 5, 2, 3, 4, 2, 6, 2, 3, 2, 5, 2, 4, 2, 6, 2, 3, 4];

// ----------------------------------------------------------------------------
// A small numbered station marker that sits on the rail spine.
// `pop` (0->1) scales/fades the dot in; at rest it is the static marker.
// ----------------------------------------------------------------------------
function StationDot({
  y,
  n,
  done = false,
  pop = 1,
}: {
  y: number;
  n: number;
  done?: boolean;
  pop?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: RAIL_X,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.4 + 0.6 * pop})`,
        opacity: pop,
        width: 44,
        height: 44,
        borderRadius: 999,
        background: WHITE,
        border: `2px solid ${done ? GREEN : ORANGE}`,
        boxShadow: done
          ? "0 8px 22px -8px rgba(63,168,100,0.55)"
          : "0 8px 22px -8px rgba(236,90,38,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 6,
      }}
    >
      {done ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 20, color: ORANGE }}>{n}</span>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Station header — eyebrow line that introduces each band (sits next to dot).
// `op`/`dy` drive the staggered reveal; at rest (1 / 0) it is the static head.
// ----------------------------------------------------------------------------
function StationHead({
  y,
  title,
  sub,
  op = 1,
  dy = 0,
}: {
  y: number;
  title: string;
  sub: string;
  op?: number;
  dy?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: RAIL_X + 44,
        top: y,
        transform: `translateY(calc(-50% + ${dy}px))`,
        opacity: op,
      }}
    >
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: NAVY, letterSpacing: "-0.015em", lineHeight: 1.05 }}>
        {title}
      </div>
      <div style={{ fontFamily: BODY, fontSize: 18, color: MUTED, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// One carrier rate row inside the Compare card.
// `priceVal` lets the price count up from $0.00; `winT` (0->1) snaps on the
// orange ring + green "Cheapest" tag for the winning row. At rest both equal
// their static values, so the row is byte-for-byte the approved layout.
// ----------------------------------------------------------------------------
function RateRow({
  row,
  priceVal,
  winT = 1,
}: {
  row: Row;
  priceVal?: number;
  winT?: number;
}) {
  const chipColor =
    row.service === "LTL" ? "#7C5CFF" : row.service === "Parcel" ? "#2E8FD6" : ORANGE;
  const win = !!row.cheapest;
  const shownPrice = priceVal === undefined ? row.price : priceVal;
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "13px 18px",
        marginBottom: 9,
        borderRadius: 14,
        background: win ? "rgba(236,90,38,0.07)" : "rgba(28,30,61,0.03)",
        border: row.own ? `2px dashed ${NAVY}` : "1.5px solid transparent",
        boxShadow: win ? `0 0 0 3px rgba(236,90,38,${0.3 * winT})` : "none",
        opacity: row.own ? 1 : win ? 1 : 0.92,
      }}
    >
      {/* leading glyph — key avatar for your-rate, else a status dot */}
      {row.own ? (
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            background: NAVY,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <circle cx="9" cy="9" r="4" stroke="#fff" strokeWidth="2" />
            <path d="M12 12l8 8M17 17l3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      ) : (
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            background: "rgba(28,30,61,0.26)",
            flexShrink: 0,
          }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 20, color: NAVY }}>
            {row.carrier}
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: chipColor,
              background: `${chipColor}1A`,
              padding: "3px 9px",
              borderRadius: 999,
            }}
          >
            {row.service}
          </span>
          {row.own && (
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: NAVY,
                background: LIGHT_BLUE,
                padding: "3px 9px",
                borderRadius: 999,
              }}
            >
              Negotiated
            </span>
          )}
        </div>
      </div>

      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: win ? ORANGE : NAVY }}>
        ${shownPrice.toFixed(2)}
      </span>

      {win && (
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 11,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: WHITE,
            background: GREEN,
            padding: "5px 11px",
            borderRadius: 999,
            flexShrink: 0,
            // snap on with the highlight; settles to the static pill
            opacity: winT,
            transform: `scale(${0.6 + 0.4 * winT})`,
            transformOrigin: "center",
          }}
        >
          Cheapest
        </span>
      )}
    </div>
  );
}

export const ShippingFlowComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- Loop-out fade: standard 12f smoothPulse over frames 288-300. --------
  const exitOpacity = 1 - smoothPulse((frame - 288) / 12);

  // ---- f0-40: eyebrow + headline reveal. -----------------------------------
  const tEy = reveal(frame, 0, 22, 12);
  const tH = reveal(frame, 8, 28, 16);

  // ---- f30-70: station markers + rail draw top-to-bottom. ------------------
  // Rail grows downward 0->full across the window; dots pop in sequence as the
  // fill passes them.
  const railGrow = easeOut(frame, 30, 205); // reaches bottom (green) ~f235
  const railTop = STATION_Y[0];
  const railSpan = STATION_Y[3] - STATION_Y[0];
  const railY2 = railTop + railSpan * railGrow;
  const dotPop = [
    easeOut(frame, 30, 16),
    easeOut(frame, 42, 16),
    easeOut(frame, 150, 16), // print-label station pops with its slip
    easeOut(frame, 200, 16), // delivered station pops at the end
  ];

  // ---- Station heads stagger in with the rail. -----------------------------
  const head1 = reveal(frame, 34, 24, 12);
  const head2 = reveal(frame, 52, 24, 12);
  const head3 = reveal(frame, 150, 24, 12);
  const head4 = reveal(frame, 198, 24, 12);

  // ---- Intake chip: drifts in just after station 1. ------------------------
  const intake = reveal(frame, 44, 26, 14);

  // ---- f60-120: Compare card springs in; rows stagger; prices count up. ----
  const cardSpring = spring({
    fps,
    frame: frame - 60,
    config: { damping: 18, stiffness: 120, mass: 1 },
    durationInFrames: 40,
  });
  const cardOpacity = easeOut(frame, 60, 20);
  const cardTranslate = (1 - cardSpring) * 26;
  const cardHeaderOp = easeOut(frame, 74, 18);

  // Winning own-row enters first (top of the card), then the 4 base rows.
  const ownRowDelay = 80;
  const rowDelays = [96, 108, 120, 132];
  const rowCountDur = 26; // count-up duration per row

  // Price count-up: 0.00 -> final, eased. Resolved well before f230.
  const ownPrice = OWN_ROW.price * easeOut(frame, ownRowDelay, rowCountDur);
  const rowPrices = ROWS.map((r, i) => r.price * easeOut(frame, rowDelays[i], rowCountDur));

  const ownRowReveal = reveal(frame, ownRowDelay, 22, 10);
  const rowReveals = rowDelays.map((d) => reveal(frame, d, 22, 10));
  const footnote = reveal(frame, 140, 22, 8);

  // ---- f120-150: winning row highlight — orange ring + green tag snap on. ---
  const winT = easeOut(frame, 124, 22);

  // ---- f150-195: print label slip prints in (reveal downward); check stamp.-
  // The slot fades in first, then the slip "prints" out (clip height + drift),
  // then the green check stamps with a soft overshoot.
  const slotOp = easeOut(frame, 148, 16);
  const slipPrint = easeOut(frame, 156, 30); // 0->1 print extent
  const slipOpacity = easeOut(frame, 156, 16);
  const stampSpring = spring({
    fps,
    frame: frame - 182,
    config: { damping: 12, stiffness: 180, mass: 0.7 },
    durationInFrames: 26,
  });

  // ---- f195-235: delivered parcel + pill stamp w/ soft pulse; rail->bottom. -
  const deliveredGroup = reveal(frame, 198, 28, 16);
  const parcelLabelGlow = easeOut(frame, 206, 20);
  const pillSpring = spring({
    fps,
    frame: frame - 210,
    config: { damping: 13, stiffness: 160, mass: 0.8 },
    durationInFrames: 28,
  });
  // soft settle pulse on the pill as it lands
  const pillPulse =
    1 + 0.05 * Math.sin(clamp01((frame - 210) / 24) * Math.PI) * (frame < 240 ? 1 : 0);

  // ---- Caption: drifts in near the end of the build. -----------------------
  const caption = reveal(frame, 214, 26, 14);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #FFFFFF 0%, #F4F7FC 55%, #F8FAFB 100%)",
        opacity: exitOpacity,
      }}
    >
      {/* Title block removed — text shown in the outer UI, not the video */}

      {/* ===================== VERTICAL RAIL SPINE ========================== */}
      <svg
        width={1080}
        height={1350}
        viewBox="0 0 1080 1350"
        style={{ position: "absolute", inset: 0, overflow: "visible", zIndex: 2 }}
      >
        <defs>
          <linearGradient id="railFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ORANGE} />
            <stop offset="78%" stopColor={ORANGE} />
            <stop offset="100%" stopColor={GREEN} />
          </linearGradient>
        </defs>

        {/* base track — full vertical extent of the journey */}
        <line
          x1={RAIL_X}
          y1={STATION_Y[0]}
          x2={RAIL_X}
          y2={STATION_Y[3]}
          stroke={NAVY}
          strokeOpacity={0.1}
          strokeWidth={8}
          strokeLinecap="round"
        />
        {/* orange→green progress fill — grows downward, reaches bottom ~f235 */}
        <line
          x1={RAIL_X}
          y1={STATION_Y[0]}
          x2={RAIL_X}
          y2={railY2}
          stroke="url(#railFill)"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* dashed inner guide for texture */}
        <line
          x1={RAIL_X}
          y1={STATION_Y[0]}
          x2={RAIL_X}
          y2={STATION_Y[3]}
          stroke={WHITE}
          strokeOpacity={0.5}
          strokeWidth={1.5}
          strokeDasharray="2 12"
          strokeLinecap="round"
        />
      </svg>

      {/* station dots */}
      <StationDot y={STATION_Y[0]} n={1} pop={dotPop[0]} />
      <StationDot y={STATION_Y[1]} n={2} pop={dotPop[1]} />
      <StationDot y={STATION_Y[2]} n={3} pop={dotPop[2]} />
      <StationDot y={STATION_Y[3]} n={4} done pop={dotPop[3]} />

      {/* ===================== STATION 1 — INTAKE ========================== */}
      {/* small parcel chip entering the flow, to the right of the header */}
      <div
        style={{
          position: "absolute",
          right: PAD,
          top: STATION_Y[0],
          transform: `translateY(calc(-50% + ${intake.translateY}px))`,
          opacity: intake.opacity,
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: WHITE,
          border: `1px solid ${BORDER}`,
          borderRadius: 16,
          padding: "12px 16px",
          boxShadow: "0 18px 40px -26px rgba(28,30,61,0.4)",
          zIndex: 5,
        }}
      >
        <Parcel size={58} />
        <div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 17, color: NAVY }}>New order</div>
          <div style={{ fontFamily: MONO, fontSize: 13, color: MUTED, marginTop: 2 }}>#ORD-2048</div>
        </div>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: ORANGE,
            background: "rgba(236,90,38,0.10)",
            padding: "5px 12px",
            borderRadius: 999,
          }}
        >
          In
        </span>
      </div>

      {/* ============== STATION 2 — COMPARE (HERO CARD) ==================== */}
      <div
        style={{
          position: "absolute",
          left: RAIL_X + 44,
          right: PAD,
          top: STATION_Y[1] + 56,
          background: WHITE,
          borderRadius: 24,
          border: `1px solid ${BORDER}`,
          boxShadow: "0 40px 80px -36px rgba(28,30,61,0.45)",
          padding: "24px 26px 26px",
          zIndex: 5,
          opacity: cardOpacity,
          transform: `translateY(${cardTranslate}px)`,
        }}
      >
        {/* card header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            opacity: cardHeaderOp,
          }}
        >
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 24, color: NAVY }}>
            Compare rates
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: BODY, fontSize: 15, color: GREEN, fontWeight: 600 }}>
            <span style={{ width: 9, height: 9, borderRadius: 999, background: GREEN }} />
            Picked
          </span>
        </div>

        {/* winning own-row sits at the top */}
        <div style={{ opacity: ownRowReveal.opacity, transform: `translateY(${ownRowReveal.translateY}px)` }}>
          <RateRow row={OWN_ROW} priceVal={ownPrice} winT={winT} />
        </div>

        {/* the four base carrier rows */}
        {ROWS.map((row, i) => (
          <div
            key={row.carrier}
            style={{
              opacity: rowReveals[i].opacity,
              transform: `translateY(${rowReveals[i].translateY}px)`,
            }}
          >
            <RateRow row={row} priceVal={rowPrices[i]} />
          </div>
        ))}

        {/* footnote */}
        <div
          style={{
            marginTop: 14,
            fontFamily: BODY,
            fontSize: 15,
            color: MUTED,
            opacity: footnote.opacity,
            transform: `translateY(${footnote.translateY}px)`,
          }}
        >
          Your negotiated rates, shopped against every carrier.
        </div>
      </div>

      {/* =============== STATION 3 — PRINT LABEL =========================== */}
      <div
        style={{
          position: "absolute",
          right: PAD,
          top: STATION_Y[2] - 92,
          zIndex: 5,
        }}
      >
        {/* printer slot */}
        <div
          style={{
            position: "relative",
            width: 280,
            height: 30,
            borderRadius: 8,
            background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_2} 100%)`,
            boxShadow: "0 14px 30px -16px rgba(28,30,61,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            opacity: slotOp,
          }}
        >
          <div style={{ width: 180, height: 5, borderRadius: 999, background: "rgba(255,255,255,0.18)" }} />
          <span
            style={{
              position: "absolute",
              left: 16,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            SHIPTIME
          </span>
        </div>

        {/* printed label slip — "prints" out of the slot: clipped reveal
            downward (height grows) + a small settle drift, ending exactly at
            the approved static position. */}
        <div
          style={{
            position: "relative",
            marginTop: 6,
            marginLeft: 12,
            // reveal downward from the slot: scaleY origin top + clip
            transformOrigin: "top center",
            opacity: slipOpacity,
          }}
        >
          <div
            style={{
              // clip-path reveals the slip top-to-bottom as it prints
              clipPath: `inset(0 0 ${(1 - slipPrint) * 100}% 0)`,
              transform: `translateY(${(1 - slipPrint) * -8}px)`,
            }}
          >
            <div
              style={{
                position: "relative",
                width: 256,
                background: WHITE,
                borderRadius: 12,
                border: `1px solid ${BORDER}`,
                boxShadow: "0 22px 44px -22px rgba(28,30,61,0.42)",
                padding: "18px 20px 20px",
              }}
            >
              {/* slip header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 17, color: NAVY, letterSpacing: "0.05em" }}>
                  SHIPTIME
                </span>
                <span style={{ fontFamily: MONO, fontSize: 13, color: MUTED }}>0.8s</span>
              </div>

              {/* CSS barcode */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 52, marginBottom: 14 }}>
                {BARCODE.map((w, bi) => (
                  <span
                    key={bi}
                    style={{
                      width: w,
                      height: "100%",
                      background: bi % 5 === 0 ? NAVY : "rgba(28,30,61,0.82)",
                      borderRadius: 1,
                    }}
                  />
                ))}
              </div>

              {/* winning carrier + price */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 16, color: NAVY }}>
                    Your rate · Courier
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 13, color: MUTED, marginTop: 3 }}>ST-48201</div>
                </div>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, color: ORANGE }}>$8.90</div>
              </div>
            </div>
          </div>

          {/* green check stamp (settled) — stamps on with a soft overshoot,
              sitting at the slip's top-right corner exactly as in the static. */}
          <div
            style={{
              position: "absolute",
              right: -12,
              top: -12,
              width: 44,
              height: 44,
              borderRadius: 999,
              background: GREEN,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 14px rgba(63,168,100,0.55)",
              opacity: clamp01(stampSpring * 1.4),
              transform: `scale(${0.5 + 0.5 * stampSpring})`,
              transformOrigin: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* =============== STATION 4 — DELIVERED ============================= */}
      <div
        style={{
          position: "absolute",
          right: PAD,
          top: STATION_Y[3],
          transform: `translateY(calc(-50% + ${deliveredGroup.translateY}px))`,
          opacity: deliveredGroup.opacity,
          display: "flex",
          alignItems: "center",
          gap: 22,
          zIndex: 5,
        }}
      >
        {/* parcel resting at destination */}
        <div style={{ position: "relative" }}>
          <Parcel size={92} labelGlow={parcelLabelGlow} />
          {/* contact shadow */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: -14,
              width: 84,
              height: 14,
              marginLeft: -42,
              borderRadius: 999,
              background: "rgba(28,30,61,0.16)",
              filter: "blur(6px)",
            }}
          />
        </div>

        {/* destination pin */}
        <svg width="50" height="58" viewBox="0 0 40 46" fill="none">
          <path
            d="M20 2C11.7 2 5 8.7 5 17c0 10.5 15 27 15 27s15-16.5 15-27C35 8.7 28.3 2 20 2z"
            fill={NAVY}
          />
          <path d="M20 9l8 7h-3v9h-10v-9h-3l8-7z" fill={WHITE} />
        </svg>

        {/* Delivered pill — springs/stamps in with a soft settle pulse. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            background: GREEN,
            borderRadius: 999,
            padding: "14px 24px",
            boxShadow: "0 16px 34px -16px rgba(63,168,100,0.6)",
            opacity: clamp01(pillSpring * 1.3),
            transform: `scale(${(0.7 + 0.3 * pillSpring) * pillPulse})`,
            transformOrigin: "left center",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 23, color: WHITE, letterSpacing: "0.01em" }}>
            Delivered
          </span>
        </div>
      </div>

      {/* Caption removed — text shown in the outer UI, not the video */}
    </AbsoluteFill>
  );
};
