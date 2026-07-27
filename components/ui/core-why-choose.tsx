import type React from "react";
import { LeadCaptureButton } from "@/components/ui/lead-capture-form";

// ── "Why choose ShipTime?" — landing-page comparison table ───────────────────
// Core 2's why-choose content rendered in the /vs & /alternative comparison
// table language: white card, orange circle checks vs grey crosses, ShipTime
// column vs a generic "Other providers" column, footer CTA row.

const ds = {
  navy:   "#1C1E3D",
  muted:  "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  surface:"#F8FAFB",
  white:  "#FFFFFF",
};

const sans = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };
const heading: React.CSSProperties = { ...sans, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, color: ds.navy };

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="#EC5A26" />
      <path d="M5 9l2.5 2.5L13 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CrossIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="#F3F4F6" />
      <path d="M6 6l6 6M12 6l-6 6" stroke="#CBD5E1" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// [feature, shiptime note, other-providers note]
const ROWS: [string, string | null, string | null][] = [
  ["Every major carrier on one screen", null, "One carrier, or a handful"],
  ["Member rates up to 70% off walk-in", null, "Retail rates or small discounts"],
  ["No platform fee, no contract", null, "Monthly fees and lock-in"],
  ["Sign up free, no sales call", null, "A demo call to get started"],
  ["Overcharges caught & refunded for you", null, "You absorb billing errors"],
  ["Parcel and LTL freight in one place", null, "Parcel only, or a separate broker"],
  ["Branded tracking & returns built in", null, "Plain carrier tracking"],
  ["Real people on support", null, "Chatbots and ticket queues"],
];

export default function CoreWhyChoose({ background = ds.white }: { background?: string }) {
  return (
    <section className="px-5 md:px-10 py-16 md:py-24" style={{ background }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div className="text-center mb-10">
          <h2 className="mb-3" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.3rem)" }}>
            Why choose ShipTime?
          </h2>
          <p className="mx-auto" style={{ ...inter, maxWidth: 440, fontSize: 15, color: ds.muted, lineHeight: 1.6 }}>
            The honest side-by-side — what you get with ShipTime versus most shipping tools.
          </p>
        </div>

        <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${ds.border}`, background: ds.white, boxShadow: "0 2px 20px rgba(28,30,61,0.06)" }}>
          {/* Header */}
          <div className="grid" style={{ gridTemplateColumns: "1fr 150px 150px", background: ds.surface, borderBottom: `1px solid ${ds.border}` }}>
            <div className="px-6 py-4" />
            <div className="py-4 flex flex-col items-center gap-1" style={{ borderLeft: `1px solid ${ds.border}` }}>
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full" style={{ background: ds.orange, color: ds.white, ...sans }}>ShipTime</span>
              <span className="text-[10px] font-semibold" style={{ color: ds.orange, ...inter }}>Free forever</span>
            </div>
            <div className="py-4 flex flex-col items-center justify-center gap-1" style={{ borderLeft: `1px solid ${ds.border}` }}>
              <span className="text-[11px] font-semibold" style={{ color: ds.muted, ...sans }}>Other providers</span>
              <span className="text-[10px]" style={{ color: ds.muted, ...inter }}>Fees vary</span>
            </div>
          </div>

          {/* Rows */}
          {ROWS.map(([feature, shipNote, otherNote], i) => (
            <div
              key={feature}
              className="grid items-center"
              style={{ gridTemplateColumns: "1fr 150px 150px", borderTop: `1px solid ${ds.border}`, background: i % 2 === 0 ? ds.white : ds.surface }}
            >
              <div className="px-6 py-3.5">
                <span style={{ ...inter, fontSize: 13.5, color: ds.navy, fontWeight: 500 }}>{feature}</span>
              </div>
              <div className="py-3.5 flex flex-col items-center justify-center gap-1" style={{ borderLeft: `1px solid ${ds.border}` }}>
                <CheckIcon />
                {shipNote && <span style={{ ...inter, fontSize: 11, color: ds.orange, fontWeight: 600, textAlign: "center", lineHeight: 1.3, padding: "0 8px" }}>{shipNote}</span>}
              </div>
              <div className="py-3.5 flex flex-col items-center justify-center gap-1" style={{ borderLeft: `1px solid ${ds.border}` }}>
                <CrossIcon />
                {otherNote && <span style={{ ...inter, fontSize: 11, color: ds.muted, fontWeight: 500, textAlign: "center", lineHeight: 1.3, padding: "0 8px" }}>{otherNote}</span>}
              </div>
            </div>
          ))}

          {/* Footer CTA */}
          <div className="grid items-center" style={{ gridTemplateColumns: "1fr 150px 150px", borderTop: `1px solid ${ds.border}`, background: ds.surface }}>
            <div className="px-6 py-4">
              <span style={{ ...sans, fontSize: 13, fontWeight: 700, color: ds.navy }}>Ready to ship smarter?</span>
            </div>
            <div className="py-4 flex justify-center" style={{ borderLeft: `1px solid ${ds.border}` }}>
              <LeadCaptureButton source="why-choose-table" className="text-white text-[12px] font-semibold px-4 py-2 transition-opacity hover:opacity-90 whitespace-nowrap" style={{ background: ds.orange, borderRadius: 999, ...sans }}>
                Get in touch
              </LeadCaptureButton>
            </div>
            <div className="py-4" style={{ borderLeft: `1px solid ${ds.border}` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
