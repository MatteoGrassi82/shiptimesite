import type React from "react";
import Image from "next/image";
import { Package, Check } from "lucide-react";
import { LeadCaptureButton } from "@/components/ui/lead-capture-form";

// ── Core homepage hero ────────────────────────────────────────────────────────
// Popup-style layout: left-aligned copy on a soft blue gradient, photo collage
// with floating stat cards on the right, navy banner strip below. One font
// (Manrope), one palette (navy / orange / light blue).

const ds = {
  navy:      "#1C1E3D",
  muted:     "#6E728A",
  orange:    "#EC5A26",
  border:    "#E8E8E8",
  surface:   "#F8FAFB",
  white:     "#FFFFFF",
  lightBlue: "#E3EEFC",
  peach:     "#FAF0EB",
  yellow:    "#FFE29A",
};

const sans: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
};

const cardShadow = "0 16px 40px rgba(28,30,61,0.12)";

const PHOTOS = {
  portrait: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&auto=format&fit=crop",
  warehouse: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop",
  counter: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=500&auto=format&fit=crop",
  packing: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=600&auto=format&fit=crop",
};

// ── Collage pieces ────────────────────────────────────────────────────────────

function OrdersChip() {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: ds.white, borderRadius: 12, boxShadow: cardShadow }}>
      <Package size={15} style={{ stroke: ds.navy }} />
      <span className="text-[13px] whitespace-nowrap" style={{ ...sans, color: ds.navy }}>
        <strong className="font-extrabold">82 shipments</strong> this week
      </span>
    </div>
  );
}

function RateCard() {
  return (
    <div className="px-5 py-4" style={{ background: ds.white, borderRadius: 16, boxShadow: cardShadow, width: 175 }}>
      <p className="text-[12px] font-bold mb-1.5" style={{ ...sans, color: ds.navy }}>Canada Post (CAD)</p>
      <p className="text-[28px] font-extrabold leading-none mb-2" style={{ ...sans, color: ds.navy }}>$8.42</p>
      <div className="flex items-center justify-between">
        <span className="text-[11px]" style={{ ...sans, color: ds.muted }}>vs. $14.10 retail</span>
        <span className="text-[11px] font-bold" style={{ ...sans, color: ds.orange }}>Best rate</span>
      </div>
    </div>
  );
}

function SavingsCard() {
  return (
    <div className="flex items-center gap-4 px-5 py-4" style={{ background: ds.white, borderRadius: 16, boxShadow: cardShadow }}>
      <div>
        <p className="text-[24px] font-extrabold leading-none" style={{ ...sans, color: ds.navy }}>70%</p>
        <p className="text-[11px] mt-1" style={{ ...sans, color: ds.muted }}>Savings</p>
      </div>
      <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: ds.navy }}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7" /><polyline points="8 7 17 7 17 16" />
        </svg>
      </span>
    </div>
  );
}

function Squiggles() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 520 560" fill="none" aria-hidden>
      <defs>
        <linearGradient id="st-squig-1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD98E" />
          <stop offset="55%" stopColor="#F0845B" />
          <stop offset="100%" stopColor="#EC5A26" />
        </linearGradient>
        <linearGradient id="st-squig-2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9CC4F5" />
          <stop offset="100%" stopColor="#E3EEFC" />
        </linearGradient>
      </defs>
      {/* big loop in the open space below the rate card */}
      <path
        d="M30 290 C 120 270, 170 330, 120 380 C 70 430, 10 390, 60 340 C 110 290, 210 330, 230 430 C 244 500, 320 530, 400 510"
        stroke="url(#st-squig-1)" strokeWidth="26" strokeLinecap="round" opacity="0.9"
      />
      {/* blue arc top-left of the portrait */}
      <path
        d="M60 150 C 40 90, 90 40, 150 40"
        stroke="url(#st-squig-2)" strokeWidth="24" strokeLinecap="round"
      />
    </svg>
  );
}

function HeroCollage() {
  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: 520, height: 560 }}>
      <Squiggles />

      {/* yellow blob behind the main photo */}
      <div className="absolute rounded-[36px]" style={{ left: "24%", bottom: "8%", width: 240, height: 250, background: ds.yellow }} />

      {/* photos */}
      <div className="absolute overflow-hidden" style={{ left: "22%", top: 0, width: 150, height: 160, borderRadius: 24 }}>
        <Image src={PHOTOS.portrait} alt="Small business owner" fill style={{ objectFit: "cover" }} sizes="150px" />
      </div>
      <div className="absolute overflow-hidden" style={{ right: 0, top: "16%", width: 235, height: 155, borderRadius: 24 }}>
        <Image src={PHOTOS.warehouse} alt="Order being fulfilled in a warehouse" fill style={{ objectFit: "cover" }} sizes="235px" />
      </div>
      <div className="absolute overflow-hidden" style={{ right: "4%", top: "50%", width: 150, height: 125, borderRadius: 24 }}>
        <Image src={PHOTOS.counter} alt="Checkout at a small business" fill style={{ objectFit: "cover" }} sizes="150px" />
      </div>
      <div className="absolute overflow-hidden" style={{ left: "28%", bottom: "11%", width: 215, height: 235, borderRadius: 24 }}>
        <Image src={PHOTOS.packing} alt="Packing a shipment" fill style={{ objectFit: "cover" }} sizes="215px" />
      </div>

      {/* floating cards */}
      <div className="absolute" style={{ right: "6%", top: "6%" }}><OrdersChip /></div>
      <div className="absolute" style={{ left: "6%", top: "26%" }}><RateCard /></div>
      <div className="absolute" style={{ right: 0, bottom: "10%" }}><SavingsCard /></div>
    </div>
  );
}

// ── Navy banner strip ─────────────────────────────────────────────────────────

const BANNER_CHECKS = ["Up to 70% off carrier rates", "No platform fee", "Real human support"];

function BannerStrip() {
  return (
    <div
      className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 px-8 py-8 md:px-12"
      style={{ background: ds.navy, borderRadius: 24 }}
    >
      <p className="text-[14.5px] leading-relaxed lg:max-w-[340px]" style={{ ...sans, color: "rgba(255,255,255,0.85)" }}>
        <strong className="font-extrabold" style={{ color: ds.orange }}>Ship, save and scale your business</strong>{" "}
        alongside thousands of businesses across Canada and the US.
      </p>
      <div className="flex flex-col sm:flex-row flex-1 gap-4 sm:gap-8 lg:justify-end">
        {BANNER_CHECKS.map(label => (
          <div key={label} className="flex items-center gap-2.5">
            <Check size={16} style={{ stroke: "#fff", strokeWidth: 3 }} />
            <span className="text-[14px] font-bold whitespace-nowrap text-white" style={sans}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

export default function ShipTimeHeroReel({
  secondaryHref = "#compare",
  secondaryLabel = "Book a demo",
}: {
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section
      className="relative overflow-hidden px-5 md:px-10 pt-28 md:pt-36 pb-14 md:pb-20"
      style={{ background: "linear-gradient(180deg, #EAF2FA 0%, #F3F8FC 70%, #FBFDFE 100%)" }}
    >
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-8 items-center" style={{ maxWidth: 1140 }}>

        {/* ── LEFT: copy ── */}
        <div className="max-w-[540px]">
          <h1
            style={{
              ...sans,
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 5.2vw, 3.9rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              color: ds.navy,
            }}
          >
            Everything you need to ship smarter, for less
          </h1>
          <p className="mt-6" style={{ ...sans, fontSize: 16, lineHeight: 1.65, color: ds.muted, maxWidth: 440 }}>
            The shipping platform that puts every major carrier on one screen — compare
            live rates, print labels, and save up to 70% on every shipment.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-7">
            <LeadCaptureButton
              source="home-hero"
              className="inline-flex items-center px-7 py-3.5 rounded-full text-white text-[15px] font-bold transition-opacity hover:opacity-90"
              style={{ ...sans, background: ds.orange, boxShadow: "0 4px 20px rgba(236,90,38,0.30)" }}
            >
              Get started free
            </LeadCaptureButton>
            <a
              href={secondaryHref}
              {...(secondaryHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-[15px] font-bold transition-opacity hover:opacity-70"
              style={{ ...sans, color: ds.navy }}
            >
              {secondaryLabel}
            </a>
          </div>
        </div>

        {/* ── RIGHT: collage ── */}
        <div className="hidden sm:block">
          <HeroCollage />
        </div>
      </div>

      {/* ── Navy banner ── */}
      <div className="mx-auto mt-16 md:mt-24" style={{ maxWidth: 1140 }}>
        <BannerStrip />
      </div>
    </section>
  );
}
