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

// Calm typographic reset section after the hero — pure type, generous
// whitespace, centered. One orange accent (second headline line). No imagery.
export default function MeetShipTimeIntro({ background = ds.white }: { background?: string }) {
  const headlineLine: React.CSSProperties = {
    ...heading,
    display: "block",
    fontSize: "clamp(2.2rem, 6vw, 4rem)",
    lineHeight: 1.05,
  };

  return (
    <section className="px-5 md:px-10 py-24 md:py-32" style={{ background }}>
      <div className="text-center" style={{ maxWidth: 860, margin: "0 auto" }}>
        <Reveal delay={0}>
          <p
            className="text-xs font-bold uppercase tracking-[0.12em] mb-3"
            style={{ color: ds.orange, ...sora }}
          >
            MEET SHIPTIME
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h2 style={{ marginBottom: "clamp(1.5rem, 3vw, 2.25rem)" }}>
            <span style={headlineLine}>Every Carrier, Every Rate,</span>
            <span style={{ ...headlineLine, color: ds.orange }}>One Screen.</span>
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <p
            style={{
              ...inter,
              color: ds.muted,
              fontSize: 18,
              lineHeight: 1.6,
              maxWidth: 620,
              margin: "0 auto",
            }}
          >
            Compare UPS, FedEx, Canada Post, Purolator and LTL freight side by side, then print the
            cheapest qualified label in seconds. No phone calls, no spreadsheets, no logging into
            five different carrier sites.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <p
            style={{
              ...inter,
              color: ds.muted,
              fontSize: 16,
              lineHeight: 1.6,
              maxWidth: 580,
              margin: "1.25rem auto 0",
            }}
          >
            This isn&rsquo;t a rip-and-replace. Keep your own negotiated rates, connect the store you
            already sell on, and start with a single label today &mdash; then add freight, scheduled
            pickups, and automatic invoice audits whenever you&rsquo;re ready.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
