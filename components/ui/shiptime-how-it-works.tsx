"use client";

import type React from "react";
import { LeadCaptureButton } from "@/components/ui/lead-capture-form";

// ── How it works ──────────────────────────────────────────────────────────────
// shiptime.com's "Ship In Under A Minute" in this design language. /core carried
// a version of this inline; it lives here now so both Core pages share one.
//
// The steps answer the question the objection sections raise but never close:
// fine, but what do I actually do first? Four beats, no sales call in any of them.

const ds = {
  navy:   "#1C1E3D",
  muted:  "#6E728A",
  orange: "#EC5A26",
  white:  "#FFFFFF",
};

const sans: React.CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };
const display: React.CSSProperties = {
  fontFamily: "var(--font-anton), Impact, 'Arial Narrow', sans-serif",
  fontWeight: 400,
  textTransform: "uppercase",
  letterSpacing: "0.005em",
  lineHeight: 0.96,
};

const STEPS: [string, string][] = [
  ["Describe your shipment", "Where from, where to, how big. Address lookup fills the rest."],
  ["Compare every rate", "Each carrier's live price side by side. Pick cheapest, fastest, or the one in between."],
  ["Book a pickup or drop off", "Have it collected from your door, or drop it at a depot near you."],
  ["Print and stick the label", "Your label prints immediately. The parcel is on its way."],
];

export default function ShipTimeHowItWorks({
  background = ds.navy,
  ctaLabel = "Get started",
}: {
  background?: string;
  ctaLabel?: string;
}) {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div className="text-center mb-14 md:mb-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ ...sans, color: ds.orange }}>
            How it works
          </p>
          <h2 className="mx-auto" style={{ ...display, color: ds.white, fontSize: "clamp(1.8rem, 4.4vw, 2.8rem)", maxWidth: 620 }}>
            Ship in under a minute
          </h2>
          <p className="mt-5 mx-auto" style={{ ...sans, fontSize: 16.5, lineHeight: 1.6, color: "rgba(255,255,255,0.68)", maxWidth: 500 }}>
            No migration, no onboarding call, no contract to sign first. Four steps
            from a cold account to a label in your hand.
          </p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 list-none p-0 m-0">
          {STEPS.map(([title, body], i) => (
            <li
              key={title}
              className="relative flex flex-col px-6 py-7"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.11)", borderRadius: 18 }}
            >
              <span
                className="flex items-center justify-center mb-5 text-[13px] font-bold"
                style={{ ...sans, width: 34, height: 34, borderRadius: 999, background: ds.orange, color: ds.white }}
              >
                {i + 1}
              </span>
              <h3 className="mb-2.5" style={{ ...display, color: ds.white, fontSize: "1.12rem", lineHeight: 1.08 }}>{title}</h3>
              <p style={{ ...sans, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.62)" }}>{body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-center gap-3">
          <LeadCaptureButton
            source="how-it-works"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-7 py-3.5 transition-opacity hover:opacity-90"
            style={{ ...sans, background: ds.orange, borderRadius: 999, boxShadow: "0 10px 30px rgba(236,90,38,0.35)" }}
          >
            {ctaLabel} <span aria-hidden>→</span>
          </LeadCaptureButton>
          <p className="text-[12.5px]" style={{ ...sans, color: "rgba(255,255,255,0.45)" }}>
            Free account · no platform fee · no credit card
          </p>
        </div>
      </div>
    </section>
  );
}
