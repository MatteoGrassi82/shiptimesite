import type React from "react";
import Image from "next/image";
import { LeadCaptureButton } from "@/components/ui/lead-capture-form";
import { HandwritingText } from "@/components/ui/handwriting-text";
import { Package, Check, Image as ImageIcon } from "lucide-react";

// ── /home-2 hero — Fluz-style ─────────────────────────────────────────────────
// Full-bleed painted dawn sky, centered pill badge, and a two-part headline:
// heavy tight Manrope over a handwritten line that draws itself. Below it, three
// staggered showcase cards (Fluz composition) with matte 3D props floating over
// their edges. Side card art is still placeholder pending real photography.

const ds = {
  navy:   "#1C1E3D",
  muted:  "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  surface:"#F8FAFB",
  white:  "#FFFFFF",
};

const sans: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
};

// Hero display face — the project's own Manrope at its heaviest, tracked tight.
// Deliberately neutral: the handwritten line below is what carries the character,
// so the headline stays a clean heavy grotesque rather than competing with it.
const display: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  fontWeight: 800,
  letterSpacing: "-0.035em",
  lineHeight: 1.02,
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

// ── Composition pieces ────────────────────────────────────────────────────────

// Placeholder tile — marks where final art goes without pretending to be it.
// Swap for real photography / product shots when the assets land.
function PlaceholderArt({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
      <div
        className="absolute inset-4 pointer-events-none"
        style={{ border: "2px dashed rgba(255,255,255,0.55)", borderRadius: 22 }}
      />
      <span
        className="flex items-center justify-center rounded-2xl"
        style={{ width: 62, height: 62, background: "rgba(255,255,255,0.28)", border: "1px solid rgba(255,255,255,0.5)" }}
      >
        <ImageIcon size={26} style={{ stroke: "#fff", strokeWidth: 1.8 }} />
      </span>
      <p className="text-[15px] font-extrabold text-white" style={sans}>{label}</p>
      <p className="text-[12px] leading-snug text-white/75" style={{ ...sans, maxWidth: 200 }}>{hint}</p>
    </div>
  );
}

// Floating prop — a matte 3D cut-out (generated, transparent PNG) that drifts
// over the gradients and overlaps card edges, Fluz-style. Deliberately matte
// rather than candy-gloss. A soft drop shadow seats it against the background.
type PropName = "parcel" | "coin" | "label" | "plane";

function FloatProp({
  prop,
  size = 96,
  rotate = 0,
  style,
}: {
  prop: PropName;
  size?: number;
  rotate?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ width: size, height: size, transform: `rotate(${rotate}deg)`, ...style }}
      aria-hidden
    >
      <Image
        src={`/generated/prop-${prop}.png`}
        alt=""
        width={size * 2}
        height={size * 2}
        className="w-full h-full object-contain"
        style={{ filter: "drop-shadow(0 14px 22px rgba(28,30,61,0.28))" }}
      />
    </div>
  );
}

// Soft painted cloud puff, used inside the centre card.
function CloudPuff({ w, style }: { w: number; style?: React.CSSProperties }) {
  return (
    <div className="absolute" style={{ width: w, height: w * 0.42, ...style }}>
      <div className="absolute inset-0" style={{ background: "#fff", borderRadius: 999, opacity: 0.95 }} />
      <div className="absolute" style={{ width: w * 0.5, height: w * 0.5, left: w * 0.16, top: -w * 0.2, background: "#fff", borderRadius: 999, opacity: 0.95 }} />
      <div className="absolute" style={{ width: w * 0.38, height: w * 0.38, left: w * 0.52, top: -w * 0.12, background: "#fff", borderRadius: 999, opacity: 0.95 }} />
    </div>
  );
}

// A rounded showcase card — the Fluz "floating tile". The interior is clipped so
// the gradient and art stay inside the radius; `props` renders OUTSIDE that clip
// so floating objects can overlap the card edge.
function ShowcaseCard({
  children,
  props: overlayProps,
  background,
  width,
  ratio,
  lift = 0,
  className = "",
}: {
  children: React.ReactNode;
  props?: React.ReactNode;
  background: string;
  width: number;
  ratio: string;
  /** px the card is raised above the row baseline */
  lift?: number;
  className?: string;
}) {
  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width, marginBottom: lift }}>
      <div
        className="relative overflow-hidden"
        style={{
          background,
          width: "100%",
          aspectRatio: ratio,
          borderRadius: 30,
          boxShadow: "0 40px 90px rgba(28,30,61,0.28)",
        }}
      >
        {children}
      </div>
      {overlayProps}
    </div>
  );
}

// ── Phone card mockup ─────────────────────────────────────────────────────────

function PhoneMock() {
  return (
    <div className="relative w-[214px] rounded-[36px] p-[7px]" style={{ background: "#101226", boxShadow: "0 40px 80px rgba(28,30,61,0.35)" }}>
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
  headline = "Save More",
  handwritten = ["on every shipment", "on every label", "on every pallet"],
  subhead = "Compare live rates from every major carrier and save up to 70% on every shipment — labels, freight, and tracking in one place.",
  ctaLabel = "Get started",
  ctaHref,
}: {
  badge?: string;
  /** First headline line, set in the heavy display face. */
  headline?: string;
  /** Second line, written out by hand and cycled. */
  handwritten?: string[];
  subhead?: string;
  ctaLabel?: string;
  /** When set, the primary CTA links straight to sign-up; otherwise it opens the lead-capture modal. */
  ctaHref?: string;
}) {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "clamp(720px, 96vh, 1040px)" }}>
      <PaintedSky />

      {/* Copy */}
      <div className="relative z-10 px-5 md:px-10 pt-24 md:pt-28 text-center flex flex-col items-center">
        <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] mb-7" style={{ ...sans, background: ds.white, color: ds.navy }}>
          {badge}
        </span>
        <h1 style={{ ...display, color: ds.white, fontSize: "clamp(2.6rem, 6.4vw, 5rem)", textShadow: "0 2px 30px rgba(28,30,61,0.15)" }}>
          {headline}
          <br />
          <HandwritingText words={handwritten} height="1.55em" strokeWidth={1.5} />
        </h1>
        <p className="mt-5 mx-auto text-white/90" style={{ ...sans, fontSize: "clamp(1rem, 1.5vw, 1.15rem)", lineHeight: 1.55, maxWidth: 520, textShadow: "0 1px 12px rgba(28,30,61,0.18)" }}>
          {subhead}
        </p>
        <div className="mt-7">
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

      {/* Three floating showcase cards, staggered (Fluz composition) */}
      <div className="relative z-10 mx-auto mt-10 md:mt-12 px-5" style={{ maxWidth: 1240 }}>
        <div className="relative flex items-end justify-center gap-4 md:gap-7">

          {/* LEFT — lifestyle art, lower */}
          <ShowcaseCard
            background="linear-gradient(170deg, #F2C36B 0%, #EFA07F 42%, #E2705A 78%, #C9482A 100%)"
            width={352}
            ratio="0.92"
            lift={0}
            className="hidden lg:block"
          >
            <PlaceholderArt label="Lifestyle shot" hint="Customer packing an order — warm, real, shot on the sunset gradient" />
          </ShowcaseCard>

          {/* CENTRE — phone against sky, raised and largest */}
          <ShowcaseCard
            background="linear-gradient(180deg, #4E97F2 0%, #7FB4F5 46%, #C9D9F2 78%, #E9D7E4 100%)"
            width={470}
            ratio="0.94"
            lift={64}
          >
            {/* props inside the sky, part of the scene (Fluz's floating gems) */}
            <FloatProp prop="coin" size={54} rotate={-20} style={{ left: 34, top: 62 }} />
            <FloatProp prop="parcel" size={62} rotate={16} style={{ right: 26, top: 116 }} />
            <CloudPuff w={120} style={{ left: 24, top: 128 }} />
            <CloudPuff w={92} style={{ right: 30, top: 196 }} />
            <CloudPuff w={140} style={{ left: 46, bottom: 54 }} />
            <CloudPuff w={104} style={{ right: 18, bottom: 96 }} />
            {/* rainbow arc */}
            <svg className="absolute" style={{ left: "-14%", bottom: "6%", width: "128%" }} viewBox="0 0 400 130" fill="none" aria-hidden>
              {([["#EC5A26", 0], ["#F0A64B", 7], ["#8FD16A", 14], ["#5FA8F0", 21]] as [string, number][]).map(([c, off]) => (
                <path key={c} d="M10 130 A 190 190 0 0 1 390 130" transform={`translate(0 ${off})`} stroke={c} strokeWidth="7" opacity="0.5" fill="none" />
              ))}
            </svg>
            <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 54 }}>
              <PhoneMock />
            </div>
            <p className="absolute left-0 right-0 bottom-5 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-white/70" style={sans}>
              Placeholder scene
            </p>
          </ShowcaseCard>

          {/* RIGHT — product art, lower */}
          <ShowcaseCard
            background="linear-gradient(180deg, #A9A6DE 0%, #E7AE9C 48%, #F2B98E 72%, #8FBF7E 100%)"
            width={352}
            ratio="0.92"
            lift={0}
            className="hidden md:block"
          >
            <PlaceholderArt label="Product shot" hint="Rates dashboard or a hands-on packing scene, bleeding off the edge" />
          </ShowcaseCard>

          {/* ── Props layer ──────────────────────────────────────────────────
              Scattered across the WHOLE composition rather than parked at each
              card's corner: some overlap card edges, some sit in the gaps, and
              sizes vary widely so the group reads with depth. This is what makes
              the Fluz arrangement feel strewn rather than decorated. */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {/* big, front-most — breaks the left card's top edge */}
            <FloatProp prop="parcel" size={124} rotate={14} style={{ left: "3%", top: -54 }} />
            {/* mid — tucked in the gap between left and centre */}
            <FloatProp prop="coin" size={78} rotate={-18} style={{ left: "26.5%", top: "34%" }} />
            {/* small, far — high above the gap, reads as distant */}
            <FloatProp prop="coin" size={44} rotate={24} style={{ left: "21%", top: "-9%" }} />
            {/* label breaks the right card's top-left corner */}
            <FloatProp prop="label" size={118} rotate={-16} style={{ right: "22%", top: -40 }} />
            {/* plane flying out of the right gap */}
            <FloatProp prop="plane" size={96} rotate={-12} style={{ right: "1%", top: "26%" }} />
            {/* low, small — anchors the bottom right */}
            <FloatProp prop="parcel" size={64} rotate={-10} style={{ right: "14%", bottom: "6%" }} />
            {/* low left, partially behind the card edge */}
            <FloatProp prop="coin" size={58} rotate={12} style={{ left: "-1%", bottom: "16%" }} />
          </div>

        </div>
      </div>
    </section>
  );
}
