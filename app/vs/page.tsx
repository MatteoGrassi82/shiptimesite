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
const body: React.CSSProperties = { fontFamily: "var(--font-inter), system-ui, sans-serif", color: ds.muted, lineHeight: 1.6 };
const sora = { fontFamily: "var(--font-manrope), sans-serif" };

export const metadata: Metadata = {
  title: "Choose ShipTime — Side-by-Side Comparisons | ShipTime",
  description:
    "See how ShipTime compares head-to-head with Freightcom, ShipStation, and Stallion Express. No platform fee, Bring Your Own Rates, Canada Post, and more.",
  alternates: { canonical: "/vs" },
};

export default function VsHub() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: ds.white, ...body }}>
      <SiteNav ctaHref="https://app.shiptime.com/?utm_source=shiptimelandin&utm_medium=landing&utm_campaign=signup&utm_content=vs-hub-nav" />

      <section className="px-5 md:px-10 pt-32 pb-14 md:pt-40 md:pb-20 text-center" style={{ background: ds.navy }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] mb-4" style={{ color: ds.orange, ...sora }}>Compare</p>
          <h1 className="mb-5" style={{ ...heading, color: ds.white, fontSize: "clamp(2.1rem, 5.5vw, 3.2rem)" }}>Choose ShipTime</h1>
          <p className="mx-auto" style={{ ...body, color: "rgba(255,255,255,0.72)", maxWidth: 540, fontSize: 18 }}>
            Head-to-head with the platforms you are weighing. Pick a comparison to see why teams switch.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-10 py-16 md:py-24" style={{ background: ds.white }}>
        <div className="grid gap-5 md:grid-cols-3" style={{ maxWidth: 1040, margin: "0 auto" }}>
          {competitors.map((c) => (
            <Link key={c.slug} href={`/vs/${c.slug}`} className="group flex flex-col lift" style={{ background: ds.white, borderRadius: 16, padding: 28, border: `1px solid ${ds.border}` }}>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: ds.orange, ...sora }}>Choose ShipTime over</p>
              <h2 className="mb-3" style={{ ...heading, fontSize: 26, fontWeight: 700 }}>{c.name}</h2>
              <p className="mb-6 flex-1" style={{ ...body, fontSize: 15 }}>{c.headline}</p>
              <span className="text-sm font-semibold inline-flex items-center gap-1.5 transition-transform group-hover:gap-2.5" style={{ color: ds.navy, ...sora }}>
                See the comparison <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="px-5 md:px-10 py-12" style={{ background: ds.navy }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4" style={{ maxWidth: 1040, margin: "0 auto" }}>
          <Image src="/shiptime-logo.svg" alt="ShipTime" width={140} height={44} className="h-9 w-auto opacity-90" />
          <p style={{ ...body, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Ship Smarter Today.</p>
        </div>
      </footer>
    </div>
  );
}
