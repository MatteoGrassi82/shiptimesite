import type React from "react";
import Image from "next/image";

// ── Floating prop ─────────────────────────────────────────────────────────────
// The matte 3D cut-outs (parcel, coin, label, paper plane) that drift over the
// gradients and break card edges. Lived inside the hero; shared now so every
// section can carry the same objects — which is what makes the page read as one
// world rather than a stack of unrelated blocks.

export type PropName = "parcel" | "coin" | "label" | "plane";

export default function FloatProp({
  prop,
  size = 96,
  rotate = 0,
  style,
}: {
  prop: PropName;
  size?: number;
  rotate?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ width: size, height: size, transform: `rotate(${rotate}deg)`, ...style }}
      aria-hidden
    >
      <Image
        src={`/generated/prop-${prop}.png`}
        alt=""
        width={size * 2}
        height={size * 2}
        className="w-full h-full object-contain"
        style={{ filter: "drop-shadow(0 14px 22px rgba(28,30,61,0.28))" }}
      />
    </div>
  );
}
