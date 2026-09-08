import type React from "react";
import Image from "next/image";

// ── Statement band (Fluz "YOUR MONEY ON MAX." adaptation) ─────────────────────
// A full-bleed manifesto moment: enormous stacked caps on a two-stop gradient,
// with the matte 3D props strewn around — and over — the typography the way
// Fluz scatters gems and butterflies. Some props sit in front of the letters,
// some hug the edges half off-screen, sizes vary for depth.

const ds = {
  navy:  "#1C1E3D",
  white: "#FFFFFF",
};

const sans: React.CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };

type PropName = "parcel" | "coin" | "label" | "plane";

function FloatProp({
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
        style={{ filter: "drop-shadow(0 14px 22px rgba(28,30,61,0.25))" }}
      />
    </div>
  );
}

export default function ShipTimeStatement({
  lines = ["Your", "Shipping", "On Max."],
  subhead = "The whole platform works together — every rate compared, every invoice audited, every dollar saved goes back into growing your business.",
}: {
  lines?: string[];
  subhead?: string;
}) {
  return (
    <section
      className="relative overflow-hidden px-5 md:px-10 py-24 md:py-32"
      style={{ background: "linear-gradient(180deg, #F0845B 0%, #DE9A9C 42%, #96A8F0 100%)" }}
    >
      {/* ── Props behind the type ── */}
      <div className="absolute inset-0" aria-hidden>
        {/* big parcel half off the left edge */}
        <FloatProp prop="parcel" size={190} rotate={-14} style={{ left: -70, top: "44%" }} />
        {/* label drifting in the top-right corner */}
        <FloatProp prop="label" size={130} rotate={18} style={{ right: "6%", top: "7%" }} />
        {/* small distant coin upper-left */}
        <FloatProp prop="coin" size={56} rotate={-24} style={{ left: "9%", top: "10%" }} />
        {/* plane crossing the lower-right */}
        <FloatProp prop="plane" size={120} rotate={-10} style={{ right: -34, bottom: "18%" }} />
        {/* small parcel lower-left */}
        <FloatProp prop="coin" size={72} rotate={10} style={{ left: "16%", bottom: "9%" }} />
      </div>

      {/* ── The statement ── */}
      <div className="relative z-10 text-center" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2
          className="uppercase"
          style={{
            ...sans,
            fontWeight: 800,
            letterSpacing: "-0.025em",
            lineHeight: 0.96,
            color: "#FDF7F4",
            fontSize: "clamp(4rem, 12.5vw, 11rem)",
          }}
        >
          {lines.map((l) => (
            <span key={l} className="block">{l}</span>
          ))}
        </h2>
        <p
          className="mx-auto mt-8 md:mt-10"
          style={{ ...sans, fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)", lineHeight: 1.6, color: "rgba(255,255,255,0.85)", maxWidth: 480 }}
        >
          {subhead}
        </p>
      </div>

      {/* ── Props in front of the type (the Fluz trick that sells depth) ── */}
      <div className="absolute inset-0 z-20 pointer-events-none" aria-hidden>
        {/* small coin resting on the middle line */}
        <FloatProp prop="coin" size={64} rotate={22} style={{ left: "56%", top: "38%" }} />
        {/* tiny parcel over the last line */}
        <FloatProp prop="parcel" size={58} rotate={-12} style={{ left: "38%", bottom: "24%" }} />
      </div>
    </section>
  );
}
