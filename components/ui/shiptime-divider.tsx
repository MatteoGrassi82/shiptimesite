import type React from "react";
import { Reveal } from "@/components/ui/reveal";

const ds = {
  navy: "#1C1E3D",
  muted: "#6E728A",
  orange: "#EC5A26",
  orangeSoft: "#F0845B",
  lightBlue: "#E3EEFC",
  surface: "#F8FAFB",
  border: "#E8E8E8",
  white: "#FFFFFF",
  green: "#3FA864",
};
const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };
const heading: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  color: ds.navy,
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  fontWeight: 800,
};

type Stat = { big: string; label: string; caption: string };

const STATS: Stat[] = [
  {
    big: "7+",
    label: "Carriers",
    caption: "UPS, FedEx, Canada Post, Purolator & LTL freight — one screen",
  },
  {
    big: "1,000+",
    label: "5-star reviews",
    caption: "from Canadian & US small businesses",
  },
  {
    big: "$0",
    label: "Platform fee",
    caption: "free to start — the discounts you see are yours to keep",
  },
];

// Full-bleed navy chapter break: one bold claim + 3 supporting stats, with
// decorative concentric orange route-rings tucked into a corner.
export default function ShipTimeDivider({ background = ds.navy }: { background?: string }) {
  return (
    <section
      className="relative overflow-hidden px-5 md:px-10 py-24 md:py-32"
      style={{ background }}
    >
      {/* Decorative concentric route-rings, bottom-right corner */}
      <div
        aria-hidden
        className="pointer-events-none"
        style={{ position: "absolute", right: "-160px", bottom: "-200px", zIndex: 0 }}
      >
        {[640, 480, 320, 180].map((size, i) => (
          <div
            key={size}
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: size,
              height: size,
              borderRadius: 999,
              border: `1.5px solid rgba(236,90,38,${i % 2 === 0 ? 0.15 : 0.25})`,
              transform: "translate(50%, 50%)",
            }}
          />
        ))}
      </div>

      <div className="relative" style={{ maxWidth: 1040, margin: "0 auto", zIndex: 1 }}>
        {/* Center claim */}
        <div className="text-center">
          <Reveal>
            <p
              className="text-xs font-bold uppercase tracking-[0.12em] mb-3"
              style={{ color: ds.orangeSoft, ...sora }}
            >
              Ship Smarter
            </p>
          </Reveal>
          <Reveal delay={90}>
            <h2
              style={{
                ...heading,
                color: ds.white,
                fontSize: "clamp(1.8rem, 4.6vw, 3rem)",
                maxWidth: 860,
                margin: "0 auto",
              }}
            >
              Compare every carrier. Print the cheapest qualified label in seconds.
            </h2>
          </Reveal>
        </div>

        {/* Stat row — thin top dividers when stacked on mobile, thin left
            dividers between columns on desktop */}
        <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={180 + i * 90}>
              <div
                className={[
                  "px-0 md:px-8 py-6 md:py-0 text-center",
                  i === 0 ? "" : "border-t md:border-t-0 md:border-l",
                ].join(" ")}
                style={{ borderColor: "rgba(255,255,255,0.12)" }}
              >
                <div
                  style={{
                    ...sora,
                    color: ds.orangeSoft,
                    fontWeight: 800,
                    fontSize: "clamp(2.6rem, 6vw, 3.6rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.big}
                </div>
                <div
                  className="mt-2"
                  style={{
                    ...sora,
                    color: ds.white,
                    fontWeight: 700,
                    fontSize: 17,
                  }}
                >
                  {s.label}
                </div>
                <p
                  className="mt-2 mx-auto"
                  style={{
                    ...inter,
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    maxWidth: 240,
                  }}
                >
                  {s.caption}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
