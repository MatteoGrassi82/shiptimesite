"use client";

// Client-side pieces of the Plus homepage: the network globe hero (canvas
// animation) and the interactive three-phase walkthrough (tab state). Split
// out from plus-home.tsx so the rest of the homepage can stay a plain async
// server component that fetches case studies for the proof section.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { AutopilotMock, IntelligenceMock, UnifyMock } from "./plus-mocks";

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.25,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [0.96, 0.96, 0.97],
  markerColor: [236 / 255, 90 / 255, 38 / 255],
  glowColor: [0.96, 0.96, 0.97],
  markers: [
    { location: [43.6532, -79.3832], size: 0.03 },
    { location: [45.5017, -73.5673], size: 0.03 },
    { location: [49.2827, -123.1207], size: 0.03 },
    { location: [51.0447, -114.0719], size: 0.02 },
    { location: [40.7128, -74.006], size: 0.04 },
    { location: [34.0522, -118.2437], size: 0.04 },
    { location: [41.8781, -87.6298], size: 0.03 },
    { location: [29.7604, -95.3698], size: 0.03 },
    { location: [47.6062, -122.3321], size: 0.02 },
    { location: [25.7617, -80.1918], size: 0.02 },
  ],
};

function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onResize = () => {
      widthRef.current = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvas, {
      ...GLOBE_CONFIG,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
    });

    let frame: number;
    const render = () => {
      phiRef.current += 0.005;
      globe.update({ phi: phiRef.current, width: widthRef.current * 2, height: widthRef.current * 2 });
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    setTimeout(() => (canvas.style.opacity = "1"));

    return () => {
      cancelAnimationFrame(frame);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 mx-auto" style={{ maxWidth: 600, aspectRatio: "1 / 1" }}>
      <canvas ref={canvasRef} className="size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]" />
    </div>
  );
}

const PROOF_STATS = [
  { num: "2M", suffix: "+", label: "Shipments managed", cap: "Every year, across the network." },
  { num: "20", suffix: " yrs", label: "Track record", cap: "Of shipping and logistics experience." },
  { num: "1,000", suffix: "+", label: "Active merchants", cap: "Running on the platform today." },
  { num: "8", suffix: "", label: "In-house engineers", cap: "Full-stack ownership, 15 years running." },
];

export function PlusHero() {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "var(--page)", fontFamily: "var(--font-body)" }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(55% 45% at 50% -5%, rgba(236,90,38,0.10) 0%, transparent 60%), radial-gradient(50% 40% at 50% 8%, rgba(46,76,143,0.09) 0%, transparent 65%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 10, maxWidth: 1180, margin: "0 auto", padding: "96px 24px 56px", textAlign: "center" }}>
        <h1
          style={{
            maxWidth: 960,
            margin: "0 auto",
            fontFamily: "var(--font-anton), var(--font-manrope), system-ui, sans-serif",
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "0.005em",
            fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
            lineHeight: 0.98,
            color: "var(--ink)",
          }}
        >
          Your logistics,
          <br />
          on autopilot.
        </h1>

        <p style={{ maxWidth: 640, margin: "24px auto 0", fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)", lineHeight: 1.6, color: "var(--ink-2)" }}>
          ShipTime Plus is a logistics operating system designed around your operation —
          every mode, every carrier, every warehouse, orchestrated by embedded experts and AI
          built on your data.
        </p>

        <div style={{ marginTop: 36, display: "flex", justifyContent: "center" }}>
          <Link
            href="/plus/book-a-call"
            className="st-cta"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, background: "var(--brand)", color: "var(--on-brand)", padding: "14px 30px", fontSize: 16, fontWeight: 600, textDecoration: "none" }}
          >
            Book a call
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>

        <div style={{ position: "relative", marginTop: 48 }}>
          <div style={{ position: "relative", margin: "0 auto", height: "clamp(300px, 42vw, 380px)", width: "100%", maxWidth: 620 }}>
            <Globe />
            <div aria-hidden style={{ position: "absolute", insetInline: 0, bottom: 0, height: "20%", background: "linear-gradient(to bottom, transparent, var(--page))" }} />
          </div>

          <div
            style={{ position: "relative", zIndex: 10, margin: "-112px auto 0", maxWidth: 1024, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}
            className="plus-hero-stats"
          >
            {PROOF_STATS.map((s) => (
              <div
                key={s.label}
                style={{ borderRadius: 18, border: "1px solid var(--line)", background: "var(--card)", padding: 24, textAlign: "left", boxShadow: "0 12px 44px -18px rgba(28,30,61,0.28)" }}
              >
                <div className="st-eyebrow" style={{ fontSize: 11, color: "var(--ink-3)" }}>{s.label}</div>
                <div style={{ marginTop: 8, height: 3, width: 36, borderRadius: 2, background: "var(--brand)" }} />
                <div className="st-display" style={{ marginTop: 16, fontSize: "clamp(2rem, 3.4vw, 2.8rem)", lineHeight: 1, color: "var(--ink)" }}>
                  {s.num}
                  <span style={{ color: "var(--brand)" }}>{s.suffix}</span>
                </div>
                <p style={{ marginTop: 12, fontSize: 13.5, lineHeight: 1.5, color: "var(--ink-3)" }}>{s.cap}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media (min-width: 768px){ .plus-hero-stats{ grid-template-columns: repeat(4, 1fr) !important; margin-top: -128px !important; } }`}</style>
    </section>
  );
}

const PHASES = [
  {
    label: "Phase 1",
    title: "Unify",
    body: "We combine your fragmented data into one foundational layer. Your ERP, your stores, your carrier accounts, your WMS — up to 30 systems, orchestrated. Then we sit down with your team and capture what's never been written down.",
    visual: <UnifyMock />,
  },
  {
    label: "Phase 2",
    title: "Apply intelligence",
    body: "Custom AI built on the context of your operation — not generic software. We target your highest-pressure problems first: the lanes bleeding money, the mode decisions nobody's revisited, the exceptions that eat your team's week.",
    visual: <IntelligenceMock />,
  },
  {
    label: "Phase 3",
    title: "Autopilot",
    body: "Workflow by workflow, your logistics starts running itself in the background — booking, routing, exception handling. We stay embedded until every automation is solid.",
    visual: <AutopilotMock />,
  },
];

export function PlusPhaseWalkthrough() {
  const [active, setActive] = useState(0);
  const phase = PHASES[active];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1.15fr)", gap: 40, marginTop: 44, alignItems: "start" }} className="st-phase-grid">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {PHASES.map((p, i) => (
          <button
            key={p.title}
            onClick={() => setActive(i)}
            style={{
              textAlign: "left",
              border: "1px solid",
              borderColor: i === active ? "var(--brand)" : "var(--line)",
              background: i === active ? "color-mix(in oklab, var(--brand) 8%, var(--card))" : "var(--card)",
              borderRadius: "var(--radius-card)",
              padding: "18px 20px",
              cursor: "pointer",
              transition: "border-color 0.2s ease, background 0.2s ease",
            }}
          >
            <span className="st-eyebrow" style={{ fontSize: 11 }}>{p.label}</span>
            <span className="st-display" style={{ display: "block", marginTop: 4, fontSize: 18 }}>{p.title}</span>
          </button>
        ))}
      </div>
      <div>
        {phase.visual}
        <p className="st-body" style={{ marginTop: 22, fontSize: 16, lineHeight: 1.7, color: "var(--ink-2)" }}>{phase.body}</p>
      </div>
      <style>{`@media (max-width: 760px){ .st-phase-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
