"use client";

// ShipTime Plus home hero — the real thing from the shiptime-plus repo (Hana
// design): light canvas, orange/blue radial wash, the "Like steroids* for
// logistics" serif headline, dual CTA + star trust row, and the carrier-network
// globe with four proof-stat cards straddling its lower third.

import Link from "next/link";
import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";

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
  markerColor: [236 / 255, 90 / 255, 38 / 255], // ShipTime orange
  glowColor: [0.96, 0.96, 0.97],
  markers: [
    { location: [43.6532, -79.3832], size: 0.03 }, // Toronto
    { location: [45.5017, -73.5673], size: 0.03 }, // Montreal
    { location: [49.2827, -123.1207], size: 0.03 }, // Vancouver
    { location: [51.0447, -114.0719], size: 0.02 }, // Calgary
    { location: [40.7128, -74.006], size: 0.04 }, // New York
    { location: [34.0522, -118.2437], size: 0.04 }, // Los Angeles
    { location: [41.8781, -87.6298], size: 0.03 }, // Chicago
    { location: [29.7604, -95.3698], size: 0.03 }, // Houston
    { location: [47.6062, -122.3321], size: 0.02 }, // Seattle
    { location: [25.7617, -80.1918], size: 0.02 }, // Miami
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
      <canvas
        ref={canvasRef}
        className="size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
      />
    </div>
  );
}

const STATS = [
  { label: "Size of our platform", num: "1,000", suffix: "+", cap: "Businesses on the platform, and counting." },
  { label: "Shipping savings", num: "76", suffix: "%", cap: "Up to, off walk-in carrier rates." },
  { label: "Our reach", num: "220", suffix: "+", cap: "Countries reached worldwide." },
  { label: "Track record", num: "20", suffix: " yrs", cap: "Of carrier data and relationships." },
];

export function PlusHomeHero() {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "var(--page)", fontFamily: "var(--font-body)" }}>
      {/* soft dual wash — warm orange up top, a light-blue lift underneath */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(55% 45% at 50% -5%, rgba(236,90,38,0.10) 0%, transparent 60%), radial-gradient(50% 40% at 50% 8%, rgba(46,76,143,0.07) 0%, transparent 65%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 10, maxWidth: 1180, margin: "0 auto", padding: "96px 24px 56px", textAlign: "center" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 999,
            border: "1px solid var(--line)",
            background: "var(--card)",
            padding: "6px 16px",
            fontSize: 14,
            fontWeight: 500,
            color: "var(--ink-3)",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--brand)" }} />
          Built on the ShipTime carrier network
        </span>

        <h1
          className="st-display"
          style={{ maxWidth: 900, margin: "32px auto 0", fontSize: "clamp(3rem, 9vw, 6rem)", lineHeight: 0.95, color: "var(--ink)" }}
        >
          Like steroids
          <sup style={{ fontSize: "0.4em", color: "var(--brand)", verticalAlign: "super" }}>*</sup>
          <br />
          for logistics
        </h1>

        <p style={{ maxWidth: 620, margin: "24px auto 0", fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)", lineHeight: 1.6, color: "var(--ink-2)" }}>
          Scaling logistics is hard. ShipTime Plus makes it a whole lot easier — cheaper to
          ship, faster to deliver, and a lot less to worry about.
        </p>

        <div style={{ marginTop: 40, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          <Link
            href="/plus/network"
            className="st-cta"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, background: "var(--brand)", color: "var(--on-brand)", padding: "14px 28px", fontSize: 16, fontWeight: 500, textDecoration: "none" }}
          >
            Get started free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
          <Link
            href="/plus/network"
            className="st-cta"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, border: "1px solid var(--line)", background: "var(--card)", color: "var(--ink)", padding: "14px 28px", fontSize: 16, fontWeight: 500, textDecoration: "none" }}
          >
            Book a demo
          </Link>
        </div>

        <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", alignItems: "center", fontSize: 14, color: "var(--ink-3)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ letterSpacing: "-0.03em", color: "#F5A623" }}>★★★★★</span>
            4.8 stars from 1,000+ businesses
          </span>
          <span style={{ margin: "0 8px" }}>*Minus the side effects.</span>
        </div>

        {/* Globe + overlapping proof stats */}
        <div style={{ position: "relative", marginTop: 40 }}>
          <div style={{ position: "relative", margin: "0 auto", height: "clamp(300px, 42vw, 380px)", width: "100%", maxWidth: 620 }}>
            <Globe />
            <div
              aria-hidden
              style={{ position: "absolute", insetInline: 0, bottom: 0, height: "20%", background: "linear-gradient(to bottom, transparent, var(--page))" }}
            />
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 10,
              margin: "-112px auto 0",
              maxWidth: 1024,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
            }}
            className="plus-hero-stats"
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  borderRadius: 18,
                  border: "1px solid var(--line)",
                  background: "var(--card)",
                  padding: 24,
                  textAlign: "left",
                  boxShadow: "0 12px 44px -18px rgba(28,30,61,0.28)",
                }}
              >
                <div className="st-eyebrow" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                  {s.label}
                </div>
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
