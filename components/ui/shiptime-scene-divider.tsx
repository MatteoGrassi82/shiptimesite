import type React from "react";
import { Reveal } from "@/components/ui/reveal";

const ds = {
  navy:   "#1C1E3D",
  orange: "#EC5A26",
  white:  "#FFFFFF",
  muted:  "#6E728A",
};
const sora  = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };
const heading: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  fontWeight: 800,
};

const STATS = [
  { big: "7+",     label: "Carriers",       caption: "UPS, FedEx, Canada Post, Purolator & LTL freight — one screen" },
  { big: "1,000+", label: "5-star reviews",  caption: "from Canadian & US small businesses" },
  { big: "$0",     label: "Platform fee",    caption: "free to start — the discounts you see are yours to keep" },
];

export default function ShipTimeSceneDivider() {
  return (
    <section className="relative overflow-hidden" style={{ background: "#111327", paddingTop: "clamp(60px, 8vw, 100px)" }}>

      {/* Headline + stats */}
      <div className="relative px-5 md:px-10" style={{ zIndex: 10, maxWidth: 1040, margin: "0 auto" }}>
        <div className="text-center">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>
              Ship Smarter
            </p>
          </Reveal>
          <Reveal delay={90}>
            <h2 style={{ ...heading, color: ds.white, fontSize: "clamp(1.8rem, 4.6vw, 3rem)", maxWidth: 860, margin: "0 auto" }}>
              Compare every carrier. Print the cheapest qualified label in seconds.
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 pb-6 md:pb-14">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={180 + i * 90}>
              <div
                className={["px-0 md:px-8 py-6 md:py-0 text-center", i === 0 ? "" : "border-t md:border-t-0 md:border-l"].join(" ")}
                style={{ borderColor: "rgba(255,255,255,0.10)" }}
              >
                <div style={{ ...sora, color: ds.orange, fontWeight: 800, fontSize: "clamp(2.6rem, 6vw, 3.6rem)", lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {s.big}
                </div>
                <div className="mt-2" style={{ ...sora, color: ds.white, fontWeight: 700, fontSize: 17 }}>
                  {s.label}
                </div>
                <p className="mt-2 mx-auto" style={{ ...inter, color: "rgba(255,255,255,0.55)", fontSize: 13.5, lineHeight: 1.55, maxWidth: 240 }}>
                  {s.caption}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Illustrated landscape */}
      <div style={{ position: "relative", width: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/generated/scene-divider.png" alt="" style={{ width: "100%", display: "block" }} />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, #111327 0%, rgba(17,19,39,0.55) 20%, transparent 42%, transparent 70%, rgba(17,19,39,0.7) 88%, #111327 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </section>
  );
}
