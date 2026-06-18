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

// Four escalating horizons, laid out left-to-right. YEAR 1 is the payoff card,
// rendered with the orange accent so the eye lands on it last.
type Horizon = { tag: string; title: string; body: string; accent?: boolean };
const HORIZONS: Horizon[] = [
  {
    tag: "Week 1",
    title: "Your first cheaper label",
    body:
      "Sign up free, compare every carrier on one screen, and ship the cheapest qualified label the same day. No contract, no platform fee.",
  },
  {
    tag: "Month 1",
    title: "One source of truth",
    body:
      "Bring your own negotiated rates alongside ShipTime's and connect UPS, FedEx, Purolator and Canada Post in one place. Pickups scheduled, courier spreadsheets gone.",
  },
  {
    tag: "Quarter 1",
    title: "Money flowing back",
    body:
      "Automatic rate and invoice audit runs on every shipment, flagging and recovering carrier overcharges you'd never have caught. Add LTL and freight — all on a single invoice.",
  },
  {
    tag: "Year 1",
    title: "You're operating one dashboard",
    body:
      "No more chasing rates and tracking numbers across tabs. Live tracking, audit recovery, freight and analytics across every shipment, scaling from your first label to enterprise volume.",
    accent: true,
  },
];

export default function ShipTimeRoadmap({ background = ds.white }: { background?: string }) {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div className="text-center mb-14 md:mb-20" style={{ maxWidth: 660, marginLeft: "auto", marginRight: "auto" }}>
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full mb-5"
            style={{ background: "#FAF0EB", color: ds.orange, ...sora }}
          >
            Roadmap
          </span>
          <h2 style={{ ...heading, fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: 18 }}>
            Your Roadmap to a Fully<br className="hidden md:block" /> Optimized Shipping Operation
          </h2>
          <p style={{ ...inter, color: ds.muted, fontSize: 16, lineHeight: 1.6, maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
            Start by printing one cheaper label this week. End the year running every shipment, carrier, and freight
            invoice from a single source of truth — no platform fees, no rip-and-replace.
          </p>
        </div>

        {/* Roadmap rail */}
        <div className="relative">
          {/* threaded progress line behind the dots (desktop) */}
          <div
            className="hidden md:block absolute"
            style={{ left: "12.5%", right: "12.5%", top: 7, height: 2, background: ds.border }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-4">
            {HORIZONS.map((h, i) => (
              <Reveal key={h.tag} delay={i * 120}>
                <div className="flex flex-col items-stretch h-full">
                  {/* dot on the rail */}
                  <div className="hidden md:flex justify-center" style={{ marginBottom: 22 }}>
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 999,
                        background: ds.white,
                        border: `3px solid ${ds.orange}`,
                        boxShadow: h.accent
                          ? "0 0 0 5px rgba(236,90,38,0.18)"
                          : "0 0 0 4px rgba(236,90,38,0.10)",
                      }}
                    />
                  </div>

                  {/* card */}
                  <div
                    className="flex flex-col h-full p-6 md:p-7"
                    style={{
                      background: h.accent ? ds.navy : ds.surface,
                      borderRadius: 24,
                      border: h.accent ? "1px solid transparent" : `1px solid ${ds.border}`,
                      boxShadow: h.accent
                        ? "0 30px 80px -40px rgba(236,90,38,0.55)"
                        : "0 30px 80px -40px rgba(28,30,61,0.3)",
                      ...(h.accent
                        ? { backgroundImage: `linear-gradient(165deg, ${ds.navy} 0%, #2A1B22 100%)` }
                        : {}),
                    }}
                  >
                    {/* horizon pill */}
                    <span
                      className="inline-flex self-start items-center px-2.5 py-1 rounded-full mb-5 uppercase"
                      style={{
                        ...sora,
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: "0.14em",
                        color: h.accent ? ds.orangeSoft : ds.orange,
                        border: `1px solid ${h.accent ? "rgba(240,132,91,0.4)" : "rgba(236,90,38,0.3)"}`,
                        background: h.accent ? "rgba(236,90,38,0.12)" : ds.white,
                      }}
                    >
                      {h.tag}
                    </span>

                    {/* title */}
                    <h3
                      className="mb-3"
                      style={{
                        ...heading,
                        fontSize: "clamp(1.15rem, 2vw, 1.35rem)",
                        fontWeight: 700,
                        color: h.accent ? ds.white : ds.navy,
                      }}
                    >
                      {h.title}
                    </h3>

                    {/* body */}
                    <p
                      style={{
                        ...inter,
                        fontSize: 14.5,
                        lineHeight: 1.6,
                        color: h.accent ? "rgba(255,255,255,0.74)" : ds.muted,
                      }}
                    >
                      {h.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
