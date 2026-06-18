import type { Metadata } from "next";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/ui/site-nav";
import { competitors } from "@/lib/competitors";

const ds = {
  navy: "#1C1E3D",
  muted: "#6E728A",
  orange: "#EC5A26",
  lightBlue: "#E3EEFC",
  surface: "#F8FAFB",
  border: "#E8E8E8",
  white: "#FFFFFF",
};

const heading: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  color: ds.navy,
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  fontWeight: 800,
};

const body: React.CSSProperties = {
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  color: ds.muted,
  lineHeight: 1.6,
};

const sora = { fontFamily: "var(--font-manrope), sans-serif" };

export const metadata: Metadata = {
  title: "ShipTime Alternatives — A Better Way to Ship | ShipTime",
  description:
    "Looking for an alternative to Freightcom, ShipStation, or Stallion Express? See why growing brands switch to ShipTime: no platform fee, Bring Your Own Rates, and Canada Post in one place.",
  alternates: { canonical: "/alternative" },
};

export default function AlternativeHub() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: ds.white, ...body }}>
      <SiteNav ctaHref="https://app.shiptime.com/?utm_source=shiptimelandin&utm_medium=landing&utm_campaign=signup&utm_content=alt-hub-nav" />

      {/* ── HERO ── */}
      <section
        className="px-5 md:px-10 pt-32 pb-14 md:pt-40 md:pb-20 text-center"
        style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #E3EEFC 55%, #F8FAFB 100%)" }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] mb-4" style={{ color: ds.orange, ...sora }}>
            Alternatives
          </p>
          <h1 className="mb-5" style={{ ...heading, fontSize: "clamp(2.1rem, 5.5vw, 3.2rem)" }}>
            A better way to ship
          </h1>
          <p className="mx-auto" style={{ ...body, maxWidth: 540, fontSize: 18 }}>
            Outgrowing your shipping tool? See why growing brands switch to ShipTime. Pick the platform you are leaving.
          </p>
        </div>
      </section>

      {/* ── CARDS ── */}
      <section className="px-5 md:px-10 py-16 md:py-24" style={{ background: ds.white }}>
        <div className="grid gap-5 md:grid-cols-3" style={{ maxWidth: 1040, margin: "0 auto" }}>
          {competitors.map((c) => (
            <Link
              key={c.slug}
              href={`/alternative/${c.slug}`}
              className="group flex flex-col lift"
              style={{ background: ds.white, borderRadius: 16, padding: 28, border: `1px solid ${ds.border}` }}
            >
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: ds.orange, ...sora }}>
                Alternative to
              </p>
              <h2 className="mb-3" style={{ ...heading, fontSize: 26, fontWeight: 700 }}>
                {c.name}
              </h2>
              <p className="mb-6 flex-1" style={{ ...body, fontSize: 15 }}>
                {c.headline}
              </p>
              <span
                className="text-sm font-semibold inline-flex items-center gap-1.5 transition-transform group-hover:gap-2.5"
                style={{ color: ds.navy, ...sora }}
              >
                Why teams switch <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 md:px-10 py-20 md:py-24 text-center" style={{ background: ds.navy }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 className="mb-4" style={{ ...heading, color: ds.white, fontSize: "clamp(1.7rem, 4.2vw, 2.4rem)" }}>
            Ready to ship smarter?
          </h2>
          <p className="mx-auto mb-8" style={{ ...body, color: "rgba(255,255,255,0.72)", fontSize: 17, maxWidth: 460 }}>
            No platform fee to start. Bring your own rates and run courier, LTL, and Canada Post from one place.
          </p>
          <a
            href="https://app.shiptime.com/?utm_source=shiptimelandin&utm_medium=landing&utm_campaign=signup&utm_content=alt-hub-cta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-white text-base font-semibold px-8 py-3.5 transition-colors hover:opacity-90"
            style={{ background: ds.orange, borderRadius: 999, ...sora }}
          >
            Sign up for ShipTime
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-5 md:px-10 py-12" style={{ background: ds.navy, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4" style={{ maxWidth: 1040, margin: "0 auto" }}>
          <Image src="/shiptime-logo.svg" alt="ShipTime" width={140} height={44} className="h-9 w-auto opacity-90" />
          <p style={{ ...body, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Ship Smarter Today.</p>
        </div>
      </footer>
    </div>
  );
}
