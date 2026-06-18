"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";

const ds = {
  navy:      "#1C1E3D",
  orange:    "#EC5A26",
  lightBlue: "#E3EEFC",
  surface:   "#F8FAFB",
  border:    "#E8E8E8",
  muted:     "#6E728A",
  white:     "#FFFFFF",
};

const manrope = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };
const inter   = { fontFamily: "var(--font-inter), system-ui, sans-serif" };

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

function Attribution({ name, role, img, light }: { name: string; role: string; img: string; light?: boolean }) {
  return (
    <div className="flex items-end justify-between pt-5">
      <div>
        <p className="font-semibold text-base" style={{ ...manrope, color: light ? ds.navy : ds.white }}>{name}</p>
        <p className="text-sm mt-0.5" style={{ ...inter, color: light ? ds.muted : "rgba(255,255,255,0.55)" }}>{role}</p>
      </div>
      <Image src={img} alt={name} width={200} height={200} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
    </div>
  );
}

export default function ShipTimeTestimonials() {
  const r0 = useReveal(0);
  const r1 = useReveal(120);
  const r2 = useReveal(80);
  const r3 = useReveal(200);
  const r4 = useReveal(320);
  const r5 = useReveal(160);
  const r6 = useReveal(280);

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
          <p className="mx-auto" style={{ ...inter, fontSize: 16, color: ds.muted, maxWidth: 480, lineHeight: 1.6 }}>
            From solo merchants to high-volume operations, ShipTime helps businesses ship smarter every day.
          </p>
        </div>

        {/* 3-column masonry */}
        <div className="lg:grid lg:grid-cols-3 gap-3 flex flex-col lg:py-4">

          {/* ── Column 1 ── */}
          <div className="flex flex-col gap-3 h-full">

            {/* Tall light card */}
            <div ref={r0.ref} style={{ ...r0.style, flex: 7 }} className="relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between min-h-[280px]">
              <div className="absolute inset-0 rounded-2xl" style={{ background: ds.lightBlue, border: `1px solid ${ds.border}` }} />
              <GridTexture />
              <div className="relative mt-auto">
                <p className="text-sm leading-relaxed mb-0" style={{ ...inter, color: ds.navy }}>
                  &ldquo;I was spending 90 minutes a day on shipping across four different tools. Now it&apos;s one platform and 10 minutes. ShipTime paid for itself in week one.&rdquo;
                </p>
                <Attribution name="Sarah K." role="Founder, Candle Co." img="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop" light />
              </div>
            </div>

            {/* Short navy card */}
            <div ref={r1.ref} style={{ ...r1.style, flex: 3 }} className="relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between">
              <div className="absolute inset-0 rounded-2xl" style={{ background: ds.navy }} />
              <div className="relative mt-auto">
                <p className="text-sm leading-relaxed" style={{ ...inter, color: "rgba(255,255,255,0.85)" }}>
                  &ldquo;The rate shopping alone saves us hundreds of dollars a week.&rdquo;
                </p>
                <Attribution name="Marcus T." role="Operations, Outdoor Gear Brand" img="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=687&auto=format&fit=crop" />
              </div>
            </div>

          </div>

          {/* ── Column 2 ── */}
          <div className="flex flex-col gap-3">
            {[
              { r: r2, quote: "ShipTime handles our LTL and parcel in one place. The visibility we get on every shipment has transformed how we manage customer expectations.", name: "Priya M.", role: "Head of Logistics, D2C Brand", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=761&auto=format&fit=crop" },
              { r: r3, quote: "Setup was under five minutes and we were printing labels the same day. The support team actually picks up the phone.", name: "James R.", role: "eCommerce Manager", img: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1021&auto=format&fit=crop" },
              { r: r4, quote: "We cut our carrier spend by 40% in the first month just by using ShipTime's rate comparison. Wish we'd switched sooner.", name: "Lena B.", role: "CEO, Wellness Brand", img: "https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=687&auto=format&fit=crop" },
            ].map(({ r, quote, name, role, img }) => (
              <div key={name} ref={r.ref} style={r.style} className="relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between">
                <div className="absolute inset-0 rounded-2xl" style={{ background: "#111827" }} />
                <div className="relative mt-auto">
                  <p className="text-sm leading-relaxed" style={{ ...inter, color: "rgba(255,255,255,0.85)" }}>
                    &ldquo;{quote}&rdquo;
                  </p>
                  <Attribution name={name} role={role} img={img} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Column 3 ── */}
          <div className="flex flex-col gap-3 h-full">

            {/* Short orange-accent card */}
            <div ref={r5.ref} style={{ ...r5.style, flex: 3 }} className="relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between">
              <div className="absolute inset-0 rounded-2xl" style={{ background: ds.orange }} />
              <div className="relative mt-auto">
                <p className="text-sm leading-relaxed" style={{ ...inter, color: "rgba(255,255,255,0.9)" }}>
                  &ldquo;Finally a platform that respects our time. ShipTime does what it says on the tin.&rdquo;
                </p>
                <Attribution name="Derek W." role="Owner, Electronics Retailer" img="https://images.unsplash.com/photo-1563237023-b1e970526dcb?q=80&w=765&auto=format&fit=crop" />
              </div>
            </div>

            {/* Tall light card */}
            <div ref={r6.ref} style={{ ...r6.style, flex: 7 }} className="relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between min-h-[280px]">
              <div className="absolute inset-0 rounded-2xl" style={{ background: ds.lightBlue, border: `1px solid ${ds.border}` }} />
              <GridTexture />
              <div className="relative mt-auto">
                <p className="text-sm leading-relaxed" style={{ ...inter, color: ds.navy }}>
                  &ldquo;We run a high-volume Shopify store and ShipTime has been bulletproof. Multi-carrier, automated rules, real support. It scales with us.&rdquo;
                </p>
                <Attribution name="Natalie C." role="CTO, Fashion Brand" img="https://images.unsplash.com/photo-1590086782957-93c06ef21604?q=80&w=687&auto=format&fit=crop" light />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
