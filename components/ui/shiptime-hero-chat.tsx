"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import createGlobe, { type COBEOptions } from "cobe";
import {
  ArrowUpIcon,
  Paperclip,
  Package,
  TruckIcon,
  BarChart2,
  Warehouse,
  Globe,
  Clock,
  DollarSign,
  Layers,
} from "lucide-react";

// ── Globe ────────────────────────────────────────────────────────────────────

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.28,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [236 / 255, 90 / 255, 38 / 255],
  glowColor: [0.92, 0.94, 0.98],
  markers: [
    { location: [43.65, -79.38],  size: 0.05 }, // Toronto
    { location: [45.50, -73.57],  size: 0.04 }, // Montreal
    { location: [49.28, -123.12], size: 0.04 }, // Vancouver
    { location: [51.04, -114.07], size: 0.03 }, // Calgary
    { location: [40.71, -74.01],  size: 0.06 }, // New York
    { location: [34.05, -118.24], size: 0.06 }, // Los Angeles
    { location: [41.88, -87.63],  size: 0.05 }, // Chicago
    { location: [29.76, -95.37],  size: 0.04 }, // Houston
    { location: [47.61, -122.33], size: 0.03 }, // Seattle
    { location: [25.76, -80.19],  size: 0.03 }, // Miami
  ],
};

function HeroGlobe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const dragOffset = useRef(0);
  const phiRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getSize = () => canvas.parentElement?.offsetWidth ?? canvas.offsetWidth ?? 600;
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
      if (pointerInteracting.current === null) phiRef.current += 0.003;
      globe.update({ phi: phiRef.current + dragOffset.current, width: size * 2, height: size * 2 });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    setTimeout(() => { if (canvas) canvas.style.opacity = "1"; });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      globe.destroy();
    };
  }, []);

  return (
    <div className={cn("absolute inset-0 mx-auto aspect-square w-full max-w-[700px]", className)}>
      <canvas
        ref={canvasRef}
        className="size-full opacity-0 transition-opacity duration-700 [contain:layout_paint_size]"
        style={{ cursor: "grab" }}
        onPointerDown={e => {
          pointerInteracting.current = e.clientX - dragOffset.current * 200;
          (e.target as HTMLElement).style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          (canvasRef.current as HTMLElement | null)?.style && (canvasRef.current!.style.cursor = "grab");
        }}
        onPointerOut={() => { pointerInteracting.current = null; }}
        onMouseMove={e => {
          if (pointerInteracting.current !== null)
            dragOffset.current = (e.clientX - pointerInteracting.current) / 200;
        }}
        onTouchMove={e => {
          if (e.touches[0] && pointerInteracting.current !== null)
            dragOffset.current = (e.touches[0].clientX - pointerInteracting.current) / 200;
        }}
      />
    </div>
  );
}

// ── Auto-resize textarea ──────────────────────────────────────────────────────

function useAutoResizeTextarea({ minHeight, maxHeight }: { minHeight: number; maxHeight?: number }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = useCallback((reset?: boolean) => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = `${minHeight}px`;
    if (!reset) el.style.height = `${Math.max(minHeight, Math.min(el.scrollHeight, maxHeight ?? Infinity))}px`;
  }, [minHeight, maxHeight]);
  useEffect(() => { if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`; }, [minHeight]);
  return { textareaRef, adjustHeight };
}

// ── Quick action pill ─────────────────────────────────────────────────────────

function QuickAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 rounded-full text-xs"
      style={{
        border: "1px solid #E8E8E8",
        background: "rgba(255,255,255,0.8)",
        color: "#6E728A",
        backdropFilter: "blur(8px)",
      }}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

export default function ShipTimeHeroChat() {
  const [message, setMessage] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 48, maxHeight: 150 });

  return (
    <section
      className="relative w-full flex flex-col items-center justify-start overflow-hidden"
      style={{
        minHeight: "100svh",
        background: "linear-gradient(160deg, #FFFFFF 0%, #EEF4FD 55%, #F8FAFB 100%)",
      }}
    >
      {/* Globe — bottom-center, large, bleeds down */}
      <div className="absolute bottom-[-260px] left-1/2 -translate-x-1/2 w-[720px] h-[720px] pointer-events-none">
        <HeroGlobe className="opacity-90" />
      </div>

      {/* Soft fade over the bottom of the globe so it dissolves cleanly */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{ background: "linear-gradient(to top, #F8FAFB 10%, transparent 100%)" }}
      />

      {/* Content — sits above globe */}
      <div className="relative z-10 w-full flex flex-col items-center px-5 pt-28 pb-10">

        {/* Eyebrow */}
        <p
          className="text-xs font-bold uppercase tracking-[0.14em] mb-4"
          style={{ color: "#EC5A26", fontFamily: "var(--font-manrope), sans-serif" }}
        >
          Get Your Free Logistics Performance Report
        </p>

        {/* Headline */}
        <h1
          className="text-center mb-5 max-w-[820px]"
          style={{
            fontFamily: "var(--font-manrope), system-ui, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.2rem, 5.5vw, 4.4rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#1C1E3D",
          }}
        >
          Get Logistics Superpowers<br />
          <span style={{ color: "#EC5A26" }}>Without the Logistics Team</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-center max-w-[520px] mb-10"
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "clamp(15px, 2vw, 17px)",
            lineHeight: 1.65,
            color: "#6E728A",
          }}
        >
          Compare carriers, automate labels, manage freight, and track every package from one platform. Set up in under five minutes. Support that picks up in under two.
        </p>

        {/* Chat input */}
        <div className="w-full max-w-2xl">
          <div
            className="relative rounded-2xl border"
            style={{
              background: "rgba(255,255,255,0.90)",
              backdropFilter: "blur(12px)",
              borderColor: "#E8E8E8",
              boxShadow: "0 4px 24px rgba(28,30,61,0.07)",
            }}
          >
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={e => { setMessage(e.target.value); adjustHeight(); }}
              placeholder="Ask about carrier rates, fulfillment options, or shipping costs..."
              className={cn(
                "w-full px-5 py-4 resize-none border-none bg-transparent",
                "text-sm focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-[#B0B8C8] min-h-[56px]"
              )}
              style={{ color: "#1C1E3D", fontFamily: "var(--font-inter), sans-serif", overflow: "hidden" }}
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <Button variant="ghost" size="icon" className="text-[#B0B8C8] hover:bg-[#F8FAFB] hover:text-[#1C1E3D]">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                disabled={!message.trim()}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all",
                  message.trim() ? "bg-[#EC5A26] text-white hover:opacity-90" : "bg-[#F0F0F0] text-[#B0B8C8] cursor-not-allowed"
                )}
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                <ArrowUpIcon className="w-4 h-4" />
                <span>Send</span>
              </Button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-4">
            <QuickAction icon={<DollarSign className="w-3.5 h-3.5" />} label="Compare Rates" />
            <QuickAction icon={<TruckIcon className="w-3.5 h-3.5" />} label="Carrier Options" />
            <QuickAction icon={<Warehouse className="w-3.5 h-3.5" />} label="Fulfillment Nodes" />
            <QuickAction icon={<Package className="w-3.5 h-3.5" />} label="Parcel Shipping" />
            <QuickAction icon={<Layers className="w-3.5 h-3.5" />} label="LTL & FTL" />
            <QuickAction icon={<Globe className="w-3.5 h-3.5" />} label="Cross-Border" />
            <QuickAction icon={<BarChart2 className="w-3.5 h-3.5" />} label="Cost Analysis" />
            <QuickAction icon={<Clock className="w-3.5 h-3.5" />} label="Delivery Speed" />
          </div>
        </div>

        {/* 3-step strip */}
        <div className="w-full max-w-2xl mt-10" style={{ borderTop: "1px solid #E8E8E8" }}>
          <div className="grid grid-cols-3">
            {[
              { n: "1", label: "Fill out the questionnaire", sub: "2 minutes, confidential" },
              { n: "2", label: "Get your performance report", sub: "Personalised to your business" },
              { n: "3", label: "Optional 20-min expert review", sub: "With a ShipTime logistics expert" },
            ].map((step, i) => (
              <div
                key={step.n}
                className="flex flex-col items-center text-center px-3 pt-6 pb-2 gap-1.5"
                style={{ borderLeft: i > 0 ? "1px solid #E8E8E8" : undefined }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1"
                  style={{ background: "#EC5A26", color: "#FFFFFF", fontFamily: "var(--font-manrope), sans-serif" }}
                >
                  {step.n}
                </div>
                <span className="text-xs font-semibold leading-tight" style={{ color: "#1C1E3D", fontFamily: "var(--font-manrope), sans-serif" }}>{step.label}</span>
                <span className="text-[11px]" style={{ color: "#6E728A" }}>{step.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
