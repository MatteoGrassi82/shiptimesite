"use client";

import { useRef, useEffect, useState } from "react";

const ds = {
  navy:      "#1C1E3D",
  orange:    "#EC5A26",
  lightBlue: "#E3EEFC",
  surface:   "#F8FAFB",
  border:    "#E8E8E8",
  muted:     "#52566C",
  white:     "#FFFFFF",
};

const manrope = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };
const inter   = { fontFamily: "var(--font-inter), system-ui, sans-serif" };

// Real reviews scraped from shiptime.com/all-ecommerce (verbatim). Tone controls
// each card's look in the masonry. Several are business names rather than a
// person, so attribution uses an initial monogram — no stock photos.
type Tone = "light" | "navy" | "dark" | "orange";
const REVIEWS: { name: string; role?: string; text: string; tone: Tone }[] = [
  { name: "Paul V.", role: "Operations Manager", tone: "light",
    text: "So happy we switched to ShipTime! The local rates are way cheaper than the courier we were using and seeing all the options on one page (without signing into 5 different portals) is such a time saver." },
  { name: "Sugarbomb Printing", tone: "navy",
    text: "Good rates, simple process. ShipTime saves us money and time. It simplifies shipping processes and is key during our busy season as we get critical parts out to customers on time and at reasonable rates." },
  { name: "Freaktography Photography", tone: "dark",
    text: "ShipTime's Shopify integration has been a game-changer for our business. We now offer fair shipping rates for heavy items across Canada, and customers get instant carrier options at checkout. Tracking and fulfillment updates are automatic, and the invoicing is clear and easy to manage. Setup was quick, and Heroic Support made sure everything was done right." },
  { name: "Mary", role: "Business Owner", tone: "dark",
    text: "I recently started using ShipTime for my business and the platform is extremely user friendly. Comparing courier rates, delivery times, and pickup options all on one screen makes shipping simple, and the tracking tools are excellent. The rates are far better than what we previously received as a shipping agent." },
  { name: "Liquid Assets of Nova Scotia", tone: "orange",
    text: "I love it! I've tried using other platforms, but I just couldn't figure it out over there. Scheduling a courier pick up on that platform? Forget it. ShipTime is quick, easy, and so user-friendly." },
  { name: "Annalisa V.", role: "Operations Manager", tone: "light",
    text: "Our customers love having the option to choose their shipping method, and ShipTime makes it easy for carriers to pick up from our remote location. The team is dedicated, quick to help, and always responsive." },
  { name: "Great West Auctions & Realty", tone: "navy",
    text: "I've used ShipTime for years to ship photography prints and calendars, and every order has arrived safely and on time. Having all courier options, service times, and pricing on one screen makes shipping simple. The rates are always much better than shipping directly with the couriers." },
  { name: "Canoehound Adventures", tone: "dark",
    text: "The two things we like most are getting quotes on shipping times and the cost relative to those times, and being able to send shipping labels to our suppliers." },
];

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, style: {
    transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms, filter 0.55s ease ${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(-18px)",
    filter: visible ? "blur(0px)" : "blur(8px)",
  }};
}

// Grid texture overlay used on light cards
function GridTexture() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: "linear-gradient(to right,rgba(28,30,61,0.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(28,30,61,0.06) 1px,transparent 1px)",
      backgroundSize: "48px 54px",
      maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%,#000 60%,transparent 100%)",
      WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 0%,#000 60%,transparent 100%)",
    }} />
  );
}

function Stars({ color }: { color: string }) {
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={15} height={15} viewBox="0 0 24 24" fill={color}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function Attribution({ name, role, light }: { name: string; role?: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span
        className="flex items-center justify-center flex-shrink-0 text-[12px] font-bold"
        style={{
          width: 38, height: 38, borderRadius: 10, ...manrope,
          background: light ? ds.orange : "rgba(255,255,255,0.16)",
          color: ds.white,
        }}
      >
        {initials(name)}
      </span>
      <div>
        <p className="font-semibold text-[15px] leading-tight" style={{ ...manrope, color: light ? ds.navy : ds.white }}>{name}</p>
        {role && <p className="text-[13px] mt-0.5" style={{ ...inter, color: light ? ds.muted : "rgba(255,255,255,0.6)" }}>{role}</p>}
      </div>
    </div>
  );
}

function ReviewCard({ review, delay }: { review: (typeof REVIEWS)[number]; delay: number }) {
  const { ref, style } = useReveal(delay);
  const light = review.tone === "light";
  const bg = { light: ds.lightBlue, navy: ds.navy, dark: "#111827", orange: ds.orange }[review.tone];
  const textColor = light ? ds.navy : review.tone === "orange" ? "#FFFFFF" : "rgba(255,255,255,0.88)";
  const starColor = review.tone === "orange" ? "#FFFFFF" : ds.orange;
  return (
    <div ref={ref} style={style} className="relative overflow-hidden rounded-2xl p-6">
      <div className="absolute inset-0 rounded-2xl" style={{ background: bg, border: light ? `1px solid ${ds.border}` : undefined }} />
      {light && <GridTexture />}
      <div className="relative flex flex-col gap-4">
        <Stars color={starColor} />
        <p className="text-sm leading-relaxed" style={{ ...inter, color: textColor }}>&ldquo;{review.text}&rdquo;</p>
        <Attribution name={review.name} role={review.role} light={light} />
      </div>
    </div>
  );
}

export default function ShipTimeTestimonials() {
  // Round-robin into 3 columns so mixed card heights balance out.
  const cols: (typeof REVIEWS)[number][][] = [[], [], []];
  REVIEWS.forEach((r, i) => cols[i % 3].push(r));

  return (
    <section className="w-full py-20 md:py-28" style={{ background: ds.white }}>
      <div className="container mx-auto px-5 md:px-10" style={{ maxWidth: 1240 }}>

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: ds.orange, ...manrope }}>
            What Customers Say
          </p>
          <h2 className="mb-4" style={{ ...manrope, fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", letterSpacing: "-0.02em", lineHeight: 1.1, color: ds.navy }}>
            Trusted by thousands of businesses
          </h2>
          <div className="flex items-center justify-center gap-2.5">
            <Stars color={ds.orange} />
            <span style={{ ...inter, fontSize: 14.5, color: ds.muted }}>
              <strong style={{ color: ds.navy }}>4.5</strong> average across <strong style={{ color: ds.navy }}>1,000+</strong> reviews
            </span>
          </div>
        </div>

        {/* 3-column masonry */}
        <div className="lg:grid lg:grid-cols-3 gap-3 flex flex-col lg:py-4 items-start">
          {cols.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-3 w-full">
              {col.map((review, ri) => (
                <ReviewCard key={review.name} review={review} delay={(ci * 90) + (ri * 120)} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
