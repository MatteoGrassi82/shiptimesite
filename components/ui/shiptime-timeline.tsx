"use client";

import type React from "react";

const ds = {
  navy:      "#1C1E3D",
  muted:     "#6E728A",
  orange:    "#EC5A26",
  green:     "#3FA864",
  surface:   "#F8FAFB",
  border:    "#E8E8E8",
  white:     "#FFFFFF",
  lightBlue: "#E3EEFC",
};
const manrope = { fontFamily: "var(--font-manrope), sans-serif" };
const inter   = { fontFamily: "var(--font-inter), sans-serif" };

// ── Small floating badge widgets ───────────────────────────────────────────────
function Badge1() {
  return (
    <div className="flex flex-col gap-1.5" style={{ background: ds.white, borderRadius: 12, padding: "10px 12px", boxShadow: "0 8px 24px rgba(28,30,61,0.14)", minWidth: 140 }}>
      <div className="text-[10px] font-bold" style={{ color: ds.navy, ...manrope }}>Account ready</div>
      {["No platform fee", "No contract", "Live in minutes"].map(l => (
        <div key={l} className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: ds.green }}>
            <svg width="6" height="5" viewBox="0 0 6 5" fill="none"><path d="M1 2.5l1.2 1.2L5 1" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <span className="text-[10px]" style={{ color: ds.navy, ...inter }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function Badge2() {
  return (
    <div style={{ background: ds.white, borderRadius: 12, padding: "10px 12px", boxShadow: "0 8px 24px rgba(28,30,61,0.14)", minWidth: 148 }}>
      <div className="text-[10px] font-bold mb-1.5" style={{ color: ds.navy, ...manrope }}>Carriers connected</div>
      {[
        { name: "Canada Post", dot: "#CC0000" },
        { name: "UPS",         dot: "#FFB500" },
        { name: "FedEx",       dot: "#FF6600" },
        { name: "Purolator",   dot: "#004990" },
      ].map(c => (
        <div key={c.name} className="flex items-center gap-1.5 py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }} />
          <span className="text-[10px]" style={{ color: ds.navy, ...inter }}>{c.name}</span>
          <span className="ml-auto w-3 h-3 rounded-full flex items-center justify-center" style={{ background: ds.green }}>
            <svg width="6" height="5" viewBox="0 0 6 5" fill="none"><path d="M1 2.5l1.2 1.2L5 1" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </div>
      ))}
    </div>
  );
}

function Badge3() {
  return (
    <div style={{ background: ds.white, borderRadius: 12, padding: "10px 12px", boxShadow: "0 8px 24px rgba(28,30,61,0.14)", minWidth: 148 }}>
      <div className="text-[10px] font-bold mb-1.5" style={{ color: ds.navy, ...manrope }}>Best rate</div>
      {[
        { name: "UPS Ground",  price: "$8.48",  best: true  },
        { name: "Canada Post", price: "$9.12",  best: false },
        { name: "Purolator",   price: "$9.72",  best: false },
      ].map(r => (
        <div key={r.name} className="flex items-center gap-1.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: r.best ? ds.orange : ds.border }} />
          <span className="flex-1 text-[10px]" style={{ color: r.best ? ds.navy : ds.muted, fontWeight: r.best ? 600 : 400, ...inter }}>{r.name}</span>
          <span className="text-[10px] font-bold" style={{ color: r.best ? ds.orange : ds.muted, ...manrope }}>{r.price}</span>
        </div>
      ))}
    </div>
  );
}

// ── Step data ──────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "1",
    eyebrow: "5 minutes",
    title: "Sign up free",
    body: "No credit card, no contract, no sales call. Start with a single label today.",
    image: "/generated/timeline-step-1.png",
    badge: <Badge1 />,
  },
  {
    num: "2",
    eyebrow: "Day 1",
    title: "Connect your carriers",
    body: "Bring your negotiated rates or use ShipTime's. Every major carrier, one place.",
    image: "/generated/timeline-step-2.png",
    badge: <Badge2 />,
  },
  {
    num: "3",
    eyebrow: "From then on",
    title: "Ship the cheapest label",
    body: "Every shipment shows all rates side by side. Pick the best, print, done.",
    image: "/generated/timeline-step-3.png",
    badge: <Badge3 />,
  },
];

// ── Section ────────────────────────────────────────────────────────────────────
export default function ShipTimeTimeline({ background = "#F8FAFB" }: { background?: string }) {
  return (
    <section id="how-it-works" className="px-5 md:px-10 py-20 md:py-24" style={{ background }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...manrope }}>
            How it works
          </p>
          <h2
            style={{
              ...manrope,
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)",
              color: ds.navy,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Up and running in under an hour
          </h2>
          <p className="mx-auto mt-4" style={{ ...inter, color: ds.muted, fontSize: 16, maxWidth: 440, lineHeight: 1.6 }}>
            No IT project, no rip-and-replace, no surprises.
          </p>
        </div>

        {/* 3-column steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="flex flex-col">

                {/* Photo card with floating badge */}
                <div className="relative mb-5 overflow-hidden" style={{ borderRadius: 20, aspectRatio: "4/3" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.image}
                    alt={step.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  {/* Small badge — bottom-left */}
                  <div style={{ position: "absolute", bottom: 12, left: 12, zIndex: 10 }}>
                    {step.badge}
                  </div>
                </div>

                {/* Step number + eyebrow */}
                <div className="flex items-center gap-2.5 mb-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: ds.orange, color: ds.white, ...manrope }}
                  >
                    {step.num}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: ds.muted, ...manrope }}>
                    {step.eyebrow}
                  </span>
                </div>

                <h3
                  className="mb-2"
                  style={{ ...manrope, fontWeight: 800, fontSize: "1.1rem", color: ds.navy, letterSpacing: "-0.01em", lineHeight: 1.25 }}
                >
                  {step.title}
                </h3>
                <p style={{ ...inter, fontSize: 14, color: ds.muted, lineHeight: 1.65 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://app.shiptime.com/?utm_source=shiptimelandin&utm_medium=landing&utm_campaign=how-it-works&utm_content=cta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-7 py-3.5 transition-all hover:opacity-90"
            style={{ background: ds.orange, borderRadius: 999, boxShadow: "0 4px 20px rgba(236,90,38,0.25)", ...manrope }}
          >
            Start for free — no credit card
          </a>
          <p className="mt-3 text-xs" style={{ color: ds.muted, ...inter }}>No platform fee. No contract. Cancel anytime.</p>
        </div>

      </div>
    </section>
  );
}
