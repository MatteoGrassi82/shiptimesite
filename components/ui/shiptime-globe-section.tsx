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
    { location: [43.6532, -79.3832],  size: 0.03 }, // Toronto
    { location: [45.5017, -73.5673],  size: 0.03 }, // Montreal
    { location: [49.2827, -123.1207], size: 0.03 }, // Vancouver
    { location: [51.0447, -114.0719], size: 0.02 }, // Calgary
    { location: [40.7128, -74.006],   size: 0.04 }, // New York
    { location: [34.0522, -118.2437], size: 0.04 }, // Los Angeles
    { location: [41.8781, -87.6298],  size: 0.03 }, // Chicago
    { location: [29.7604, -95.3698],  size: 0.03 }, // Houston
    { location: [47.6062, -122.3321], size: 0.02 }, // Seattle
    { location: [25.7617, -80.1918],  size: 0.02 }, // Miami
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

    // Use the container's size, fall back to 600 before layout
    const getSize = () => canvas.parentElement?.offsetWidth ?? canvas.offsetWidth ?? 600;
    let size = getSize();

    const globe = createGlobe(canvas, {
      ...config,
      width: size * 2,
      height: size * 2,
    });

    const handleResize = () => {
      size = getSize();
    };
    window.addEventListener("resize", handleResize);

    let raf: number;
    const animate = () => {
      if (pointerInteracting.current === null) phiRef.current += 0.004;
      globe.update({ phi: phiRef.current + dragOffset.current, width: size * 2, height: size * 2 });
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
    <div className={cn("w-full h-full", className)} style={{ aspectRatio: "1/1" }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        style={{ cursor: "grab" }}
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
    <section className="px-5 md:px-10 py-10 md:py-16" style={{ background: ds.white }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div
          className="relative overflow-hidden"
          style={{
            background: ds.surface,
            borderRadius: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          {/* Mobile: stacked, no globe */}
          <div className="md:hidden px-7 py-10">
            <h2
              className="mb-5"
              style={{
                fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.4rem, 6vw, 1.9rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                color: ds.navy,
              }}
            >
              Ship with <span style={{ color: ds.orange }}>ShipTime</span>
              <span style={{ color: ds.muted, fontWeight: 400 }}>
                {" "}Access a growing network of courier, LTL, and FTL carriers across Canada and the US. Every shipment routed through the fastest, most cost-effective path. Automatically.
              </span>
            </h2>
          </div>

          {/* Desktop: side-by-side with globe */}
          <div className="hidden md:grid grid-cols-2" style={{ minHeight: 360 }}>
            <div className="flex flex-col justify-center px-14 py-14">
              <h2
                className="mb-5"
                style={{
                  fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  color: ds.navy,
                }}
              >
                Ship with <span style={{ color: ds.orange }}>ShipTime</span>
                <span style={{ color: ds.muted, fontWeight: 400 }}>
                  {" "}Access a growing network of courier, LTL, and FTL carriers across Canada and the US. Every shipment routed through the fastest, most cost-effective path. Automatically.
                </span>
              </h2>
            </div>

            {/* Globe — fixed square, bleeds right */}
            <div className="relative overflow-hidden">
              <div className="absolute" style={{ width: 520, height: 520, right: -100, top: "50%", transform: "translateY(-50%)" }}>
                <Globe className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
