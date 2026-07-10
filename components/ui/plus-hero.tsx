"use client";

// ShipTime Plus hero — same layout as the "Grow 10x" reference (heavy display
// headline → subtext → faded globe bleeding up behind → 4 stat cards → a
// scrolling network strip) but re-themed to the Plus system: teal on near-black.
// Numbers are sourced from the Plus films, not invented. Placeholder-ish values
// are captioned honestly so they're easy to confirm/swap.

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { Marquee } from "@/components/ui/marquee";

const ds = {
  bg: "#0A0C0D",
  frame: "#111517",
  line: "rgba(255,255,255,0.09)",
  line2: "rgba(255,255,255,0.14)",
  text: "#F2F6F5",
  muted: "#8C9699",
  muted2: "#596366",
  teal: "#33A89C",
  tealBr: "#4EC9BA",
};
const font = 'var(--font-inter), "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif';
const mono = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

// COBE globe, recoloured for the dark/teal system and dialled down so it reads
// as a faded backdrop rather than a foreground object.
const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.28,
  dark: 1,
  diffuse: 1.1,
  mapSamples: 16000,
  mapBrightness: 3.2,
  baseColor: [0.16, 0.19, 0.2],
  markerColor: [78 / 255, 201 / 255, 186 / 255],
  glowColor: [0.06, 0.08, 0.09],
  markers: [
    { location: [43.6532, -79.3832], size: 0.04 }, // Toronto
    { location: [40.7128, -74.006], size: 0.05 }, // New York
    { location: [51.5074, -0.1278], size: 0.04 }, // London
    { location: [1.3521, 103.8198], size: 0.04 }, // Singapore
    { location: [-33.8688, 151.2093], size: 0.03 }, // Sydney
    { location: [35.6762, 139.6503], size: 0.04 }, // Tokyo
    { location: [19.4326, -99.1332], size: 0.03 }, // Mexico City
    { location: [52.52, 13.405], size: 0.03 }, // Berlin
    { location: [25.2048, 55.2708], size: 0.03 }, // Dubai
  ],
};

function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const getSize = () => canvas.parentElement?.offsetWidth ?? 600;
    let size = getSize();

    const globe = createGlobe(canvas, {
      ...GLOBE_CONFIG,
      width: size * 2,
      height: size * 2,
    });

    const handleResize = () => { size = getSize(); };
    window.addEventListener("resize", handleResize);

    let raf: number;
    const animate = () => {
      phiRef.current += 0.0025;
      globe.update({ phi: phiRef.current, width: size * 2, height: size * 2 });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    setTimeout(() => { canvas.style.opacity = "1"; });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full opacity-0 transition-opacity duration-1000 [contain:layout_paint_size]"
      style={{ aspectRatio: "1/1" }}
    />
  );
}

type Stat = { label: string; value: string; caption: string };

// Sourced from the Plus films / product story — confirm or swap the two marked.
const STATS: Stat[] = [
  {
    label: "Global Reach",
    value: "220+",
    caption: "Parcel and freight to over 220 countries and territories, from one account.",
  },
  {
    label: "Done For You",
    value: "3",
    caption: "Workflows that run themselves — audit, cross-border, and smart routing.",
  },
  {
    label: "Invoices Audited",
    value: "100%",
    caption: "Every carrier invoice checked for overcharges, automatically.", // confirm
  },
  {
    label: "Logins To Manage",
    value: "1",
    caption: "Every carrier, parcel and freight, behind a single account.",
  },
];

const CARRIERS = [
  "UPS", "FedEx", "Purolator", "Canada Post", "DHL",
  "Canpar", "GLS", "USPS", "Loomis", "TForce",
];

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div
      style={{
        background: ds.frame,
        border: `1px solid ${ds.line}`,
        borderRadius: 16,
        padding: "22px 22px 24px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: ds.teal,
          paddingBottom: 12,
          marginBottom: 16,
          borderBottom: `1px solid ${ds.teal}`,
        }}
      >
        {stat.label}
      </div>
      <div
        style={{
          fontFamily: font,
          fontWeight: 700,
          fontSize: "clamp(2rem, 3.4vw, 2.9rem)",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: ds.text,
          marginBottom: 14,
        }}
      >
        {stat.value}
      </div>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: ds.muted }}>
        {stat.caption}
      </p>
    </div>
  );
}

export default function PlusHero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: ds.bg,
        color: ds.text,
        fontFamily: font,
      }}
    >
      {/* Faded globe, bleeding up behind the headline */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "clamp(180px, 26vw, 420px)",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(760px, 130vw)",
          opacity: 0.55,
          pointerEvents: "none",
          maskImage: "radial-gradient(closest-side, #000 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(closest-side, #000 55%, transparent 100%)",
        }}
      >
        <Globe />
      </div>

      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "72px 24px 64px" }}>
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: mono,
            fontSize: 12,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: ds.teal,
            textAlign: "center",
            margin: "0 0 22px",
          }}
        >
          ShipTime Plus · the network layer
        </p>

        {/* Heavy display headline */}
        <h1
          style={{
            fontFamily: font,
            fontWeight: 700,
            fontSize: "clamp(2.6rem, 8vw, 5.6rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.98,
            textAlign: "center",
            margin: "0 auto",
            maxWidth: "16ch",
            textTransform: "uppercase",
          }}
        >
          One network.<br />
          Every border.<br />
          <span style={{ color: ds.teal }}>Done for you.</span>
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: "clamp(1rem, 1.5vw, 1.18rem)",
            lineHeight: 1.6,
            color: ds.muted,
            textAlign: "center",
            maxWidth: "52ch",
            margin: "26px auto 0",
          }}
        >
          Skip the carrier contracts, the customs paperwork, and the manual routing.
          Plug into the shipping layer that audits every invoice, clears every border,
          and routes every order on its own — so you move faster,{" "}
          <span style={{ color: ds.text, fontWeight: 600 }}>for the very first time.</span>
        </p>

        {/* Globe spacer — pushes the stat cards below the visual, like the reference */}
        <div style={{ height: "clamp(200px, 30vw, 360px)" }} />

        {/* 4 stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {STATS.map((s) => (
            <StatCard key={s.label} stat={s} />
          ))}
        </div>
      </div>

      {/* Scrolling network strip (carriers instead of press logos) */}
      <div style={{ position: "relative", borderTop: `1px solid ${ds.line}`, padding: "34px 0 44px" }}>
        <p
          style={{
            fontFamily: mono,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: ds.muted2,
            textAlign: "center",
            margin: "0 0 24px",
          }}
        >
          One account · every major carrier
        </p>
        <Marquee pauseOnHover className="[--duration:32s]">
          {CARRIERS.map((name) => (
            <span
              key={name}
              style={{
                fontFamily: font,
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: "-0.01em",
                color: ds.muted2,
                padding: "0 26px",
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
