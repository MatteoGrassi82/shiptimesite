import type React from "react";
import { Reveal } from "@/components/ui/reveal";

const ds = {
  navy:   "#1C1E3D",
  orange: "#EC5A26",
  white:  "#FFFFFF",
};
const sora  = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };
const heading: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  fontWeight: 800,
};

function reportUrl(source: string) {
  return `https://form.typeform.com/to/logistics-report?utm_source=landing&utm_medium=cta&utm_campaign=${source}`;
}
function meetingUrl(source: string) {
  return `https://calendly.com/shiptime/logistics-expert?utm_source=landing&utm_medium=cta&utm_campaign=${source}`;
}

export default function ShipTimeCTAScene() {
  return (
    <section
      id="get-report"
      className="relative overflow-hidden"
      style={{ background: "#F0DFC0" }}
    >
      <div style={{ position: "relative", width: "100%" }}>
        {/* Illustrated landscape */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/generated/image.png"
          alt=""
          style={{ width: "100%", display: "block" }}
        />

        {/* Fade top for text readability, fade bottom into footer */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(240,223,192,0.96) 0%, rgba(240,223,192,0.82) 18%, rgba(240,223,192,0.15) 40%, transparent 58%, rgba(28,30,61,0.3) 82%, rgba(28,30,61,0.7) 94%, #1C1E3D 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Text + CTAs overlaid on the light sky area */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-start"
          style={{ paddingTop: "clamp(48px, 6vw, 80px)", zIndex: 10 }}
        >
          <div className="w-full px-5 md:px-10 text-center" style={{ maxWidth: 700, margin: "0 auto" }}>
            <Reveal>
              <h2
                className="mb-3"
                style={{ ...heading, fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)", color: ds.navy }}
              >
                Your Shipping Shouldn&apos;t Be<br />This Complicated.
              </h2>
              <p className="mb-8" style={{ ...inter, fontSize: 16, color: "rgba(28,30,61,0.6)", maxWidth: 420, margin: "0 auto 32px" }}>
                Most businesses are up and running in under five minutes.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={reportUrl("cta-scene")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 transition-all hover:opacity-90"
                  style={{ background: ds.orange, color: ds.white, borderRadius: 999, boxShadow: "0 4px 20px rgba(236,90,38,0.3)", ...sora }}
                >
                  Start the Free Assessment →
                </a>
                <a
                  id="book-meeting"
                  href={meetingUrl("cta-scene")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 transition-all hover:opacity-80"
                  style={{ background: "rgba(28,30,61,0.08)", color: ds.navy, borderRadius: 999, border: "1.5px solid rgba(28,30,61,0.2)", backdropFilter: "blur(4px)", ...sora }}
                >
                  Book a Meeting →
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
