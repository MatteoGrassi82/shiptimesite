import type React from "react";
import { LeadCaptureButton } from "@/components/ui/lead-capture-form";
import { Package, Search, Check } from "lucide-react";

// ── /home-2 hero — Fluz-style ─────────────────────────────────────────────────
// Full-bleed painted dawn sky, centered pill badge + big Anton uppercase
// headline, dark pill CTA, and a laptop dashboard + phone card bleeding off the
// bottom edge. Uses only the ShipTime palette; the sky is pure CSS/SVG (no
// generated image needed).

const ds = {
  navy:   "#1C1E3D",
  muted:  "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  surface:"#F8FAFB",
  white:  "#FFFFFF",
};

const anton: React.CSSProperties = {
  fontFamily: "var(--font-anton), var(--font-manrope), system-ui, sans-serif",
  fontWeight: 400,
  letterSpacing: "0.005em",
  textTransform: "uppercase",
  lineHeight: 0.98,
};

const sans: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
};

// ── Painted sky + clouds ──────────────────────────────────────────────────────

function PaintedSky() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {/* dawn gradient: blue top → warm peach mid → lavender base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #4E97F2 0%, #6E9BEB 26%, #A9A6DE 46%, #E7AE9C 62%, #F2B98E 71%, #D9A9C4 84%, #9E93DE 100%)",
        }}
      />
      {/* soft painted clouds hugging the bottom */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" style={{ height: "42%" }}>
        <defs>
          <linearGradient id="fluz-cloud-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B9A9E6" />
            <stop offset="100%" stopColor="#8E7FD6" />
          </linearGradient>
          <linearGradient id="fluz-cloud-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D9CFF2" />
            <stop offset="100%" stopColor="#A99EE2" />
          </linearGradient>
          <filter id="fluz-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <g filter="url(#fluz-soft)">
          <path fill="url(#fluz-cloud-b)" opacity="0.9" d="M-40 260 C 120 190, 260 250, 420 220 C 560 195, 700 250, 900 225 C 1080 205, 1240 255, 1480 220 L 1480 340 L -40 340 Z" />
          <path fill="url(#fluz-cloud-a)" d="M-40 300 C 140 250, 300 300, 520 285 C 720 272, 900 312, 1120 292 C 1280 278, 1400 305, 1480 292 L 1480 340 L -40 340 Z" />
          <ellipse cx="230" cy="270" rx="180" ry="70" fill="url(#fluz-cloud-b)" opacity="0.85" />
          <ellipse cx="1180" cy="262" rx="210" ry="78" fill="url(#fluz-cloud-b)" opacity="0.85" />
          <ellipse cx="720" cy="285" rx="240" ry="72" fill="url(#fluz-cloud-a)" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}

// ── Laptop dashboard mockup ───────────────────────────────────────────────────

const CARRIERS: [string, string][] = [
  ["Canada Post", "Save 42%"],
  ["UPS", "Save 38%"],
  ["FedEx", "Save 35%"],
  ["Purolator", "Save 40%"],
  ["DHL", "Save 33%"],
  ["Canpar", "Save 45%"],
  ["GLS", "Save 37%"],
  ["Loomis", "Save 31%"],
];

function LaptopMock() {
  return (
    <div className="relative w-full" style={{ maxWidth: 940 }}>
      {/* screen */}
      <div className="overflow-hidden" style={{ background: ds.navy, borderRadius: "18px 18px 0 0", padding: 10, boxShadow: "0 40px 90px rgba(28,30,61,0.35)" }}>
        <div className="overflow-hidden" style={{ background: ds.white, borderRadius: "10px 10px 0 0", minHeight: 360 }}>
          {/* top nav */}
          <div className="flex items-center gap-5 px-5 py-3" style={{ borderBottom: `1px solid ${ds.border}` }}>
            <span className="text-[15px] font-extrabold" style={{ ...sans, color: ds.navy }}>shiptime</span>
            <nav className="hidden sm:flex items-center gap-4">
              {["Rates", "Labels", "Tracking", "Billing", "Stores"].map((t, i) => (
                <span key={t} className="text-[12px] font-semibold" style={{ ...sans, color: i === 0 ? ds.orange : ds.muted }}>{t}</span>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ ...sans, background: ds.surface, border: `1px solid ${ds.border}`, color: ds.muted }}>
                <Search size={11} /> Search
              </span>
              <span className="w-6 h-6 rounded-full" style={{ background: ds.orange }} />
            </div>
          </div>

          {/* body */}
          <div className="px-5 py-4">
            <h3 className="mb-3" style={{ ...anton, color: ds.navy, fontSize: 30 }}>Rates</h3>
            <div className="flex items-center gap-2 mb-4">
              {["All carriers", "Parcel", "Freight"].map((t, i) => (
                <span key={t} className="px-3 py-1.5 rounded-full text-[11px] font-bold" style={{ ...sans, background: i === 0 ? ds.navy : ds.surface, color: i === 0 ? ds.white : ds.muted, border: `1px solid ${i === 0 ? ds.navy : ds.border}` }}>{t}</span>
              ))}
              <span className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px]" style={{ ...sans, background: ds.surface, border: `1px solid ${ds.border}`, color: ds.muted }}>
                <Search size={11} /> Toronto → Vancouver · 2.3 kg
              </span>
            </div>

            {/* carrier grid */}
            <div className="grid grid-cols-4 gap-3">
              {CARRIERS.map(([name, save], i) => (
                <div key={name} className="p-3 rounded-xl" style={{ background: ds.surface, border: `1px solid ${i === 0 ? ds.orange : ds.border}` }}>
                  <div className="w-full h-10 rounded-lg flex items-center justify-center mb-2" style={{ background: ds.navy }}>
                    <span className="text-[11px] font-extrabold text-white" style={sans}>{name}</span>
                  </div>
                  <p className="text-[11px] font-bold" style={{ ...sans, color: ds.navy }}>{name}</p>
                  <p className="text-[10.5px] font-semibold" style={{ ...sans, color: ds.orange }}>{save}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Phone card mockup ─────────────────────────────────────────────────────────

function PhoneMock() {
  return (
    <div className="relative w-[230px] rounded-[38px] p-[8px]" style={{ background: "#101226", boxShadow: "0 40px 80px rgba(28,30,61,0.35)" }}>
      <div className="absolute left-1/2 top-[14px] -translate-x-1/2 w-20 h-[18px] rounded-full z-10" style={{ background: "#101226" }} />
      <div className="rounded-[31px] overflow-hidden" style={{ background: ds.white, minHeight: 300 }}>
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <span className="text-[11px] font-bold" style={{ ...sans, color: ds.navy }}>9:41</span>
          <span className="text-[11px] font-semibold" style={{ ...sans, color: ds.muted }}>Done</span>
        </div>
        {/* colorful ShipTime card */}
        <div className="mx-4 rounded-2xl p-4 h-40 flex flex-col justify-between" style={{ background: "linear-gradient(135deg, #EC5A26 0%, #F0845B 40%, #E3EEFC 100%)" }}>
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-extrabold text-white" style={sans}>shiptime</span>
            <Package size={18} style={{ stroke: "#fff" }} />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-white/80" style={sans}>Shipment ready</p>
            <p className="text-[13px] font-bold text-white" style={sans}>#ST-48201 · $8.42</p>
          </div>
        </div>
        {/* notification */}
        <div className="mx-4 mt-3 flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: ds.surface, border: `1px solid ${ds.border}` }}>
          <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: ds.orange }}>
            <Check size={14} style={{ stroke: "#fff", strokeWidth: 3 }} />
          </span>
          <div>
            <p className="text-[11px] font-bold leading-tight" style={{ ...sans, color: ds.navy }}>From ShipTime</p>
            <p className="text-[10px] leading-tight" style={{ ...sans, color: ds.muted }}>Your label is ready to print.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

export default function ShipTimeHeroFluz({
  badge = "For your business",
  headline = ["Save More", "On Every Shipment"],
  subhead = "Compare live rates from every major carrier and save up to 70% on every shipment — labels, freight, and tracking in one place.",
  ctaLabel = "Get started",
  ctaHref,
}: {
  badge?: string;
  headline?: [string, string];
  subhead?: string;
  ctaLabel?: string;
  /** When set, the primary CTA links straight to sign-up; otherwise it opens the lead-capture modal. */
  ctaHref?: string;
}) {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "clamp(720px, 96vh, 1040px)" }}>
      <PaintedSky />

      {/* Copy */}
      <div className="relative z-10 px-5 md:px-10 pt-32 md:pt-40 text-center flex flex-col items-center">
        <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] mb-7" style={{ ...sans, background: ds.white, color: ds.navy }}>
          {badge}
        </span>
        <h1 style={{ ...anton, color: ds.white, fontSize: "clamp(2.8rem, 7vw, 5.4rem)", textShadow: "0 2px 30px rgba(28,30,61,0.15)" }}>
          {headline[0]}
          <br />
          {headline[1]}
        </h1>
        <p className="mt-6 mx-auto text-white/90" style={{ ...sans, fontSize: "clamp(1rem, 1.5vw, 1.15rem)", lineHeight: 1.55, maxWidth: 520, textShadow: "0 1px 12px rgba(28,30,61,0.18)" }}>
          {subhead}
        </p>
        <div className="mt-8">
          {ctaHref ? (
            <a
              href={ctaHref}
              className="inline-flex items-center px-8 py-3.5 rounded-full text-white text-[15px] font-bold transition-opacity hover:opacity-90"
              style={{ ...sans, background: ds.navy, boxShadow: "0 10px 30px rgba(28,30,61,0.30)" }}
            >
              {ctaLabel}
            </a>
          ) : (
            <LeadCaptureButton
              source="home-hero-v2"
              className="inline-flex items-center px-8 py-3.5 rounded-full text-white text-[15px] font-bold transition-opacity hover:opacity-90"
              style={{ ...sans, background: ds.navy, boxShadow: "0 10px 30px rgba(28,30,61,0.30)" }}
            >
              {ctaLabel}
            </LeadCaptureButton>
          )}
        </div>
      </div>

      {/* Product mockups — bleed off the bottom edge */}
      <div className="relative z-10 mx-auto mt-12 md:mt-16 flex justify-center items-end px-5" style={{ maxWidth: 1120 }}>
        <div className="relative flex justify-center w-full">
          <LaptopMock />
          {/* phone floats over the laptop's bottom-right */}
          <div className="absolute right-0 sm:right-6 -bottom-4 hidden sm:block" style={{ transform: "translateY(6%)" }}>
            <PhoneMock />
          </div>
        </div>
      </div>
    </section>
  );
}
