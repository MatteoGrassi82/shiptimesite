'use client'

import { Marquee } from "@/components/ui/marquee";
import { Icon } from "@/components/ui/icons";

const ds = {
  navy:   "#0F1B2D",
  body:   "#4A5468",
  muted:  "#8A94A6",
  orange: "#FF6B35",
  peach:  "#FFE8DD",
  bg:     "#FFF8F5",
  border: "#F0D9D0",
};

const marqueeData = [
  "How do I move from self-fulfillment without disrupting operations?",
  "How do I access multiple warehouse nodes without managing 5 partners?",
  "How do I get carrier buying power without platform lock-in?",
  "How do I grow without adding logistics headcount?",
  "How do I reduce total logistics cost, not just shipping rates?",
  "How do I increase delivery speed without added complexity?",
];

const features = [
  { Ico: Icon.Package,   title: "We make shipping simple",           description: "Real rates from every carrier in seconds. Compare, choose, and print — without picking up the phone." },
  { Ico: Icon.Dollar,    title: "We focus on saving you money",      description: "Every rate comparison is designed to cut your costs. Customers save up to **70% off walk-in carrier prices**." },
  { Ico: Icon.Layers,    title: "We know logistics inside out",      description: "With 25+ carrier integrations and years of experience, we bring the best rates and smartest tools to your business." },
  { Ico: Icon.Lightning, title: "Built to grow with your business",  description: "ShipTime scales from your first label to enterprise volume. Heroic Support is always one click away." },
];

export default function ShipTimeWhySection() {
  const m1 = marqueeData.slice(0, 2);
  const m2 = marqueeData.slice(2, 4);
  const m3 = marqueeData.slice(4, 6);

  return (
    <section style={{ background: ds.bg, color: ds.navy }}>

      {/* Header + marquee */}
      <div className="pt-24 pb-0 px-6 md:px-10">
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, fontFamily: "var(--font-sora), sans-serif" }}>
            Why ShipTime
          </p>
          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-sora), system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: ds.navy,
            }}
          >
            Removing the roadblocks<br />to your shipping
          </h2>
          <p style={{ color: ds.body, fontSize: 15, lineHeight: 1.65, maxWidth: 480, margin: "0 auto 40px" }}>
            It's easy to overpay, use the wrong carrier, or drown in manual processes.
            ShipTime filters out the complexity so you can focus on growing your business.
          </p>
        </div>

        {/* Marquee rows */}
        <div className="relative overflow-hidden" style={{ maxWidth: 820, margin: "0 auto" }}>
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: `linear-gradient(to right, ${ds.bg}, transparent)` }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: `linear-gradient(to left, ${ds.bg}, transparent)` }} />
          <div className="flex flex-col gap-2.5 py-2">
            <Marquee className="[--duration:45s] [--gap:0.6rem]" repeat={4}>
              {m1.map(q => (
                <span key={q} className="inline-flex items-center whitespace-nowrap px-4 py-1.5 text-[13px] font-medium" style={{ background: ds.peach, borderRadius: 999, color: ds.navy }}>
                  {q}
                </span>
              ))}
            </Marquee>
            <Marquee className="[--duration:50s] [--gap:0.6rem]" repeat={4} reverse>
              {m2.map(q => (
                <span key={q} className="inline-flex items-center whitespace-nowrap px-4 py-1.5 text-[13px] font-medium" style={{ background: ds.peach, borderRadius: 999, color: ds.navy }}>
                  {q}
                </span>
              ))}
            </Marquee>
            <Marquee className="[--duration:42s] [--gap:0.6rem]" repeat={4}>
              {m3.map(q => (
                <span key={q} className="inline-flex items-center whitespace-nowrap px-4 py-1.5 text-[13px] font-medium" style={{ background: ds.peach, borderRadius: 999, color: ds.navy }}>
                  {q}
                </span>
              ))}
            </Marquee>
          </div>
        </div>
      </div>

      {/* 4-col feature grid */}
      <div
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        style={{ borderTop: `1px solid ${ds.border}`, background: ds.bg }}
      >
        {features.map((f, i) => (
          <div
            key={f.title}
            className="flex flex-col gap-4 px-8 py-12"
            style={{
              borderLeft: i > 0 ? `1px solid ${ds.border}` : "none",
              background: ds.bg,
            }}
          >
            <div className="w-11 h-11 flex items-center justify-center" style={{ background: ds.peach, borderRadius: 12 }}>
              <f.Ico size={20} style={{ stroke: ds.orange }} />
            </div>
            <div className="flex flex-col gap-2 pt-8 lg:pt-16">
              <h3
                style={{
                  fontFamily: "var(--font-sora), system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.25,
                  color: ds.navy,
                }}
              >
                {f.title}
              </h3>
              <p style={{ color: ds.body, fontSize: 14, lineHeight: 1.6 }}>{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
