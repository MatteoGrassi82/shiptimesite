import type React from "react";
import { ArrowUpRight } from "lucide-react";

// ── Plus self-select lane (Core homepage §3.3) ────────────────────────────────
// Sits high on the page so high-volume / enterprise visitors self-select out of
// the Core funnel without ever feeling the site "isn't for them." Small shippers
// skim past it — which itself signals "they scale" and builds trust.

const ds = {
  navy:   "#1C1E3D",
  orange: "#EC5A26",
  lightBlue: "#E3EEFC",
  white:  "#FFFFFF",
};

const sans: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
};

export default function ShipTimePlusCallout({
  href = "/plus",
  background = "#F8FAFB",
}: {
  href?: string;
  background?: string;
}) {
  return (
    <section className="px-5 md:px-10 py-16 md:py-20" style={{ background }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <a
          href={href}
          className="group relative block overflow-hidden transition-transform hover:-translate-y-0.5"
          style={{ background: ds.navy, borderRadius: 28 }}
        >
          {/* decorative rings */}
          <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full pointer-events-none" style={{ border: "1.5px solid rgba(236,90,38,0.18)" }} />
          <div className="absolute -right-10 -top-14 w-56 h-56 rounded-full pointer-events-none" style={{ border: "1.5px solid rgba(236,90,38,0.28)" }} />

          <div className="relative flex flex-col lg:flex-row lg:items-center gap-8 p-8 md:p-12">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] mb-5" style={{ ...sans, background: "rgba(236,90,38,0.16)", color: ds.orange }}>
                ShipTime Plus
              </span>
              <h2 className="mb-3" style={{ ...sans, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, color: ds.white, fontSize: "clamp(1.7rem, 3.6vw, 2.5rem)" }}>
                Shipping thousands of parcels a month?
              </h2>
              <p style={{ ...sans, fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.66)", maxWidth: 560 }}>
                High-volume, multi-warehouse, or cross-border at scale? ShipTime Plus is our
                enterprise lane — a custom-built logistics operation with an embedded team,
                not a standard interface.
              </p>
            </div>

            <div className="flex-shrink-0">
              <span
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-bold transition-colors"
                style={{ ...sans, background: ds.white, color: ds.navy }}
              >
                Explore ShipTime Plus
                <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
