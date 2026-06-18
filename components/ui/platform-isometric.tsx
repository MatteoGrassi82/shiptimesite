import type React from "react";

/* ============================================================================
   ShipTime — 3D isometric "platform" diagram (Humble-style).
   A top platform of module tiles floating above an orange integration base
   that holds the carrier pills. `highlight` lights one module tile orange so
   the persona tabs can emphasise the module that role cares about.
   Pure CSS 3D transforms — no images, no canvas.
   ========================================================================== */

const NAVY = "#1C1E3D";
const NAVY_2 = "#24264A";
const ORANGE = "#EC5A26";
const ORANGE_SOFT = "#F0845B";
const WHITE = "#FFFFFF";
const MUTED = "#6E728A";
const BORDER = "#E8E8E8";
const SANS = "var(--font-manrope), sans-serif";
const MONO = "ui-monospace, 'SF Mono', monospace";

export type ModuleKey = "rate" | "labels" | "tracking" | "pickups" | "billing";

// Flat (pre-transform) stage coordinates. The stage is rotated into isometric
// view as a whole, so children positioned here end up correctly foreshortened.
const STAGE = 620;
const NODE = { x: 250, y: 196 };
const TILES: { key: ModuleKey; label: string; x: number; y: number }[] = [
  { key: "rate", label: "Rate Shop", x: 250, y: 86 },
  { key: "labels", label: "Labels", x: 126, y: 190 },
  { key: "tracking", label: "Tracking", x: 374, y: 190 },
  { key: "pickups", label: "Pickups", x: 170, y: 300 },
  { key: "billing", label: "Billing", x: 330, y: 300 },
];
const TILE_W = 112;
const TILE_H = 82;

// Carrier pills cascade down the exposed bottom-right of the base slab.
const CARRIERS: { name: string; dot: string }[] = [
  { name: "UPS", dot: "#7B5E3B" },
  { name: "FedEx", dot: "#4D148C" },
  { name: "Canada Post", dot: "#D62828" },
  { name: "Purolator", dot: "#0E7C5A" },
  { name: "GLS", dot: "#F2B705" },
];
const PILL_W = 170;
const PILL_H = 40;

export default function PlatformIsometric({
  highlight = "rate",
  scale = 1,
}: {
  highlight?: ModuleKey;
  scale?: number;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 1700,
        perspectiveOrigin: "50% 38%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: STAGE,
          height: STAGE,
          transformStyle: "preserve-3d",
          transform: `scale(${scale}) rotateX(53deg) rotateZ(-43deg)`,
        }}
      >
        {/* ── BASE SLAB — orange integration layer (z = 0) ── */}
        <Slab
          left={104}
          top={150}
          w={460}
          h={350}
          z={0}
          style={{
            background:
              "linear-gradient(135deg, rgba(236,90,38,0.16) 0%, rgba(236,90,38,0.05) 100%)",
            border: "1px solid rgba(236,90,38,0.30)",
            borderRadius: 46,
            boxShadow: "0 0 0 1px rgba(236,90,38,0.05)",
          }}
        />

        {/* Base label running along the front edge, below the pills */}
        <div
          style={{
            position: "absolute",
            left: 214,
            top: 486,
            transform: "translateZ(6px)",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: "0.16em",
            color: ORANGE,
            opacity: 0.78,
            whiteSpace: "nowrap",
          }}
        >
          EVERY CARRIER · ONE PLATFORM
        </div>

        {/* Carrier pills cascade along the exposed front of the base (z = 10) */}
        {CARRIERS.map((c, i) => (
          <div
            key={c.name}
            style={{
              position: "absolute",
              left: 224 + i * 40,
              top: 350 + i * 22,
              width: PILL_W,
              height: PILL_H,
              transform: "translateZ(10px)",
              background: WHITE,
              border: `1px solid ${BORDER}`,
              borderRadius: 999,
              boxShadow: "0 10px 22px -12px rgba(28,30,61,0.30)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 16px",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: c.dot,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 16,
                color: NAVY,
                whiteSpace: "nowrap",
              }}
            >
              {c.name}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontFamily: MONO,
                fontSize: 12,
                color: "#3FA864",
                fontWeight: 700,
              }}
            >
              ✓
            </span>
          </div>
        ))}

        {/* ── TOP PLATFORM SLAB — modules float here (z = 54) ── */}
        <Slab
          left={36}
          top={36}
          w={388}
          h={312}
          z={54}
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #EEF1F7 100%)",
            border: `1px solid ${BORDER}`,
            borderRadius: 40,
            boxShadow:
              "0 40px 60px -30px rgba(28,30,61,0.35), inset 0 1px 0 rgba(255,255,255,0.7)",
          }}
        />

        {/* connector lines from the centre node to each tile (z = 70) */}
        <svg
          width={STAGE}
          height={STAGE}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: "translateZ(70px)",
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          {TILES.map((t) => (
            <line
              key={t.key}
              x1={NODE.x}
              y1={NODE.y}
              x2={t.x}
              y2={t.y}
              stroke={highlight === t.key ? ORANGE : "rgba(28,30,61,0.22)"}
              strokeWidth={highlight === t.key ? 3 : 2}
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
          ))}
        </svg>

        {/* centre node — the ShipTime hub (z = 74) */}
        <div
          style={{
            position: "absolute",
            left: NODE.x - 30,
            top: NODE.y - 30,
            width: 60,
            height: 60,
            transform: "translateZ(82px)",
            borderRadius: 18,
            background: `linear-gradient(150deg, ${ORANGE} 0%, ${ORANGE_SOFT} 100%)`,
            boxShadow: "0 18px 34px -14px rgba(236,90,38,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(255,255,255,0.5)",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 13l4-7h10l4 7-9 5-9-5z"
              fill={WHITE}
              opacity="0.95"
            />
            <path d="M3 13l9 5 9-5" stroke={ORANGE} strokeWidth="1.4" fill="none" />
          </svg>
        </div>

        {/* module tiles (z = 80, slightly popped above the platform) */}
        {TILES.map((t) => {
          const on = highlight === t.key;
          return (
            <div
              key={t.key}
              style={{
                position: "absolute",
                left: t.x - TILE_W / 2,
                top: t.y - TILE_H / 2,
                width: TILE_W,
                height: TILE_H,
                transform: `translateZ(${on ? 96 : 82}px)`,
                borderRadius: 18,
                background: on
                  ? `linear-gradient(150deg, ${ORANGE} 0%, ${ORANGE_SOFT} 100%)`
                  : `linear-gradient(150deg, ${NAVY} 0%, ${NAVY_2} 100%)`,
                boxShadow: on
                  ? "0 26px 44px -18px rgba(236,90,38,0.7)"
                  : "0 22px 38px -20px rgba(28,30,61,0.6)",
                border: on
                  ? "1px solid rgba(255,255,255,0.35)"
                  : "1px solid rgba(255,255,255,0.08)",
                transition:
                  "transform 0.45s cubic-bezier(0.22,1,0.36,1), background 0.4s ease, box-shadow 0.4s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 8px",
              }}
            >
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 17,
                  color: WHITE,
                  letterSpacing: "-0.01em",
                  textAlign: "center",
                  lineHeight: 1.1,
                }}
              >
                {t.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// A flat rounded slab lying in the stage plane, lifted to `z` along the
// pre-rotation Z axis (which becomes "up" after the isometric rotation).
function Slab({
  left,
  top,
  w,
  h,
  z,
  style,
}: {
  left: number;
  top: number;
  w: number;
  h: number;
  z: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: w,
        height: h,
        transform: `translateZ(${z}px)`,
        ...style,
      }}
    />
  );
}
