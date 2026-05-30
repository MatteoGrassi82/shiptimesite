"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { InteractiveGlobe } from "@/components/ui/interactive-globe";
import { cn } from "@/lib/utils";
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

interface AutoResizeProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: AutoResizeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }
      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Infinity)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
}

function QuickAction({ icon, label }: QuickActionProps) {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 rounded-full border-white/20 bg-white/10 text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm text-xs"
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}

export default function ShipTimeHeroChat() {
  const [message, setMessage] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 48,
    maxHeight: 150,
  });

  return (
    <section
      className="relative w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        minHeight: "100svh",
        background: "linear-gradient(160deg, #0E1022 0%, #1C1E3D 50%, #0E1022 100%)",
      }}
    >
      {/* Globe background — full bleed, centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <InteractiveGlobe
          size={900}
          className="w-[900px] h-[900px] opacity-80"
          dotColor="rgba(200, 210, 255, ALPHA)"
          arcColor="rgba(236, 90, 38, 0.65)"
          markerColor="rgba(236, 90, 38, 1)"
          autoRotateSpeed={0.0012}
        />
      </div>

      {/* Radial fade overlay so content stays readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, rgba(14,16,34,0.75) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center px-5 pt-28 pb-16">

        {/* Eyebrow */}
        <p
          className="text-xs font-bold uppercase tracking-[0.14em] mb-4"
          style={{ color: "#EC5A26", fontFamily: "var(--font-manrope), sans-serif" }}
        >
          Get Your Free Logistics Performance Report
        </p>

        {/* Headline */}
        <h1
          className="text-center mb-5 max-w-[760px]"
          style={{
            fontFamily: "var(--font-manrope), system-ui, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.4rem, 6vw, 4.8rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#FFFFFF",
          }}
        >
          Your Logistics.<br />
          <span style={{ color: "#EC5A26" }}>Fully Optimized.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-center max-w-[480px] mb-10"
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "clamp(15px, 2vw, 17px)",
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.65)",
          }}
        >
          Identify cost savings, delivery improvements, and fulfillment opportunities in under 2 minutes.{" "}
          <strong style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>Confidential. No obligation.</strong>
        </p>

        {/* Chat input */}
        <div className="w-full max-w-2xl">
          <div
            className="relative rounded-2xl border"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              borderColor: "rgba(255,255,255,0.15)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
            }}
          >
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                adjustHeight();
              }}
              placeholder="Ask about carrier rates, fulfillment options, or shipping costs..."
              className={cn(
                "w-full px-5 py-4 resize-none border-none bg-transparent",
                "text-sm focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-white/35 min-h-[56px]"
              )}
              style={{
                color: "rgba(255,255,255,0.9)",
                fontFamily: "var(--font-inter), sans-serif",
                overflow: "hidden",
              }}
            />

            <div className="flex items-center justify-between px-4 pb-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/50 hover:bg-white/10 hover:text-white"
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              <Button
                disabled={!message.trim()}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all",
                  message.trim()
                    ? "bg-[#EC5A26] text-white hover:opacity-90"
                    : "bg-[#E8E8E8] text-[#8A94A6] cursor-not-allowed"
                )}
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                <ArrowUpIcon className="w-4 h-4" />
                <span>Send</span>
              </Button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-5">
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
        <div className="w-full max-w-2xl mt-12" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          <div className="grid grid-cols-3 gap-0">
            {[
              { n: "1", label: "Fill out the questionnaire", sub: "2 minutes, confidential" },
              { n: "2", label: "Get your performance report", sub: "Personalised to your business" },
              { n: "3", label: "Optional 20-min expert review", sub: "With a ShipTime logistics expert" },
            ].map((step, i) => (
              <div
                key={step.n}
                className="flex flex-col items-center text-center px-3 pt-6 pb-2 gap-1.5"
                style={{ borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.12)" : undefined }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1"
                  style={{
                    background: "#EC5A26",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-manrope), sans-serif",
                  }}
                >
                  {step.n}
                </div>
                <span
                  className="text-xs font-semibold leading-tight"
                  style={{ color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-manrope), sans-serif" }}
                >
                  {step.label}
                </span>
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>{step.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
