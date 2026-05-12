"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { cn } from "@/lib/utils";

const ds = {
  navy:   "#0F1B2D",
  body:   "#4A5468",
  muted:  "#8A94A6",
  orange: "#FF6B35",
  peach:  "#FFE8DD",
  surface:"#F4F5F7",
  border: "#E5E7EB",
  white:  "#FFFFFF",
};

const BASE_CONFIG: COBEOptions = {
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
  markerColor: [255 / 255, 107 / 255, 53 / 255],
  glowColor: [0.96, 0.96, 0.97],
  markers: [
    { location: [43.6532, -79.3832],  size: 0.08 }, // Toronto
    { location: [45.5017, -73.5673],  size: 0.07 }, // Montreal
    { location: [49.2827, -123.1207], size: 0.06 }, // Vancouver
    { location: [51.0447, -114.0719], size: 0.05 }, // Calgary
    { location: [40.7128, -74.006],   size: 0.09 }, // New York
    { location: [34.0522, -118.2437], size: 0.09 }, // Los Angeles
    { location: [41.8781, -87.6298],  size: 0.08 }, // Chicago
    { location: [29.7604, -95.3698],  size: 0.07 }, // Houston
    { location: [47.6062, -122.3321], size: 0.06 }, // Seattle
    { location: [25.7617, -80.1918],  size: 0.06 }, // Miami
  ],
};

function Globe({ className, config = BASE_CONFIG }: { className?: string; config?: COBEOptions }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const dragOffset = useRef(0);
  const phiRef = useRef(0);

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      dragOffset.current = (clientX - pointerInteracting.current) / 200;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = canvas.offsetWidth;
    const handleResize = () => { width = canvas.offsetWidth; };
    window.addEventListener("resize", handleResize);

    const globe = createGlobe(canvas, {
      ...config,
      width: width * 2,
      height: width * 2,
    });

    let raf: number;
    const animate = () => {
      if (pointerInteracting.current === null) phiRef.current += 0.004;
      globe.update({ phi: phiRef.current + dragOffset.current, width: width * 2, height: width * 2 });
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
    <div className={cn("absolute inset-0 mx-auto aspect-square w-full max-w-[600px]", className)}>
      <canvas
        ref={canvasRef}
        className="size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        onPointerDown={e => updatePointerInteraction(e.clientX - dragOffset.current * 200)}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={e => updateMovement(e.clientX)}
        onTouchMove={e => e.touches[0] && updateMovement(e.touches[0].clientX)}
      />
    </div>
  );
}

export default function ShipTimeGlobeSection() {
  return (
    <section className="px-6 md:px-10 py-16" style={{ background: ds.white }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        {/* Card with light surface, globe bleeding off the right */}
        <div
          className="relative overflow-hidden flex flex-col md:flex-row items-center"
          style={{
            background: ds.surface,
            borderRadius: 28,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            minHeight: 320,
          }}
        >
          {/* Left — copy */}
          <div className="relative z-10 flex-1 px-10 py-12 md:px-14 md:py-14 max-w-xl">
            <h2
              className="mb-4"
              style={{
                fontFamily: "var(--font-sora), system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                color: ds.navy,
              }}
            >
              Ship with{" "}
              <span style={{ color: ds.orange }}>ShipTime</span>{" "}
              <span style={{ color: ds.muted, fontWeight: 400 }}>
                Connect to 25+ carriers across Canada and the US. Every package
                routed through the fastest, most cost-effective path —
                automatically.
              </span>
            </h2>

            <a
              href="#get-report"
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 mt-2 transition-all hover:opacity-90"
              style={{
                background: ds.navy,
                borderRadius: 999,
                fontFamily: "var(--font-sora), sans-serif",
              }}
            >
              See Carrier Options →
            </a>
          </div>

          {/* Right — globe cropped, bleeding off edge */}
          <div
            className="relative flex-shrink-0 w-full md:w-[480px] h-[240px] md:h-[340px]"
            style={{ overflow: "hidden" }}
          >
            <Globe className="absolute -right-24 -bottom-10 md:-right-32 md:-bottom-16 scale-[1.15]" />
          </div>
        </div>
      </div>
    </section>
  );
}
