import React from "react";
import { Check, X } from "lucide-react";

// ── "Why choose ShipTime?" — light, highlighted-column comparison ─────────────
// ShipTime column is an elevated white card; "Other providers" is a muted flat
// column beside it. Sits on the warm grey field to match the rest of the page.

const ds = {
  navy:   "#1C1E3D",
  muted:  "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  surface:"#F8FAFB",
  white:  "#FFFFFF",
  field:  "#ECEAE7",
};

const sans: React.CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };

const ROWS: [string, string][] = [
  ["Every major carrier on one screen", "One carrier, or a handful"],
  ["Member rates up to 70% off walk-in", "Retail rates or small discounts"],
  ["No platform fee, no contract", "Monthly fees and lock-in"],
  ["Sign up free in minutes, no sales call", "A demo and sales call to start"],
  ["Overcharges caught & refunded for you", "You absorb carrier billing errors"],
  ["Parcel and LTL freight in one place", "Parcel only, or a separate broker"],
  ["Branded tracking & returns built in", "Plain carrier tracking"],
  ["Real people on support", "Chatbots and ticket queues"],
];

export default function ShipTimeWhyChoose({ background = ds.field }: { background?: string }) {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div className="text-center mb-14 md:mb-16">
          <h2 style={{ ...sans, fontFamily: "var(--font-bricolage), var(--font-manrope), system-ui, sans-serif", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05, color: ds.navy, fontSize: "clamp(2rem, 4.8vw, 3.2rem)" }}>
            Why choose ShipTime?
          </h2>
          <p className="mt-5 mx-auto" style={{ ...sans, fontSize: 16.5, lineHeight: 1.6, color: ds.muted, maxWidth: 460 }}>
            The honest side-by-side — what you get with ShipTime versus most shipping tools.
          </p>
        </div>

        <div className="relative mx-auto" style={{ maxWidth: 840 }}>
          {/* elevated highlight behind the ShipTime (left) column */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1/2 pointer-events-none"
            style={{ background: ds.white, borderRadius: 24, boxShadow: "0 30px 70px -30px rgba(28,30,61,0.30)", border: `1px solid ${ds.border}` }}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: ds.orange, borderRadius: "24px 24px 0 0" }} />
          </div>

          {/* "You're here" tab centered on the ShipTime card */}
          <div className="absolute left-1/4 -top-3.5 -translate-x-1/2 z-20">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] text-white" style={{ ...sans, background: ds.orange, boxShadow: "0 6px 16px rgba(236,90,38,0.35)" }}>
              You're here
            </span>
          </div>

          {/* grid */}
          <div className="relative z-10 grid grid-cols-2">
            {/* header row */}
            <div className="px-5 md:px-8 pt-8 pb-4">
              <span className="text-[13px] font-extrabold" style={{ ...sans, color: ds.orange }}>ShipTime</span>
            </div>
            <div className="px-5 md:px-8 pt-8 pb-4">
              <span className="text-[13px] font-bold" style={{ ...sans, color: ds.muted }}>Other providers</span>
            </div>

            {/* rows */}
            {ROWS.map(([pro, con], i) => (
              <React.Fragment key={pro}>
                <div className="flex items-center gap-2.5 px-5 md:px-8 py-3.5" style={{ borderTop: `1px solid ${ds.border}` }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: ds.orange }}>
                    <Check size={11} style={{ stroke: "#fff", strokeWidth: 3.5 }} />
                  </span>
                  <span className="text-[13.5px] font-semibold" style={{ ...sans, color: ds.navy }}>{pro}</span>
                </div>
                <div className="flex items-center gap-2.5 px-5 md:px-8 py-3.5" style={{ borderTop: `1px solid rgba(28,30,61,0.08)` }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: `1.5px solid rgba(28,30,61,0.18)` }}>
                    <X size={11} style={{ stroke: ds.muted, strokeWidth: 3 }} />
                  </span>
                  <span className="text-[13.5px]" style={{ ...sans, color: ds.muted }}>{con}</span>
                </div>
              </React.Fragment>
            ))}
            {/* bottom padding row for the white card */}
            <div className="pb-8" />
            <div className="pb-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
