"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { competitors } from "@/lib/competitors";
import { LeadCaptureButton } from "@/components/ui/lead-capture-form";

const ds = {
  navy: "#1C1E3D",
  muted: "#6E728A",
  orange: "#EC5A26",
  surface: "#F8FAFB",
  border: "#E8E8E8",
  white: "#FFFFFF",
};

const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };

// Comparison pages, one per competitor.
const versus = competitors;

type SiteNavProps = {
  // CTA on the right. Defaults to the ShipTime signup.
  ctaHref?: string;
  ctaLabel?: string;
  // When true, the CTA opens the on-page lead-capture modal instead of
  // redirecting to signup (used on the comparison/alternative landing pages,
  // where we capture the lead rather than push a high-commitment sign-up).
  leadCapture?: boolean;
  // Conversion-page chrome: logo + CTA only, no nav links or mobile menu, so
  // there's nothing competing with the one action we want.
  minimal?: boolean;
};

const SIGNUP =
  "https://app.shiptime.com/?utm_source=shiptimelandin&utm_medium=landing&utm_campaign=signup&utm_content=nav";

export default function SiteNav({ ctaHref = SIGNUP, ctaLabel = "Sign up free", leadCapture = false, minimal = false }: SiteNavProps) {
  const [open, setOpen] = useState(false);     // desktop dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // mobile menu

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-5 md:px-10 py-3.5"
      style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E8E8E8" }}
    >
      {/* Constrained so the logo lines up with page content instead of hugging
          the screen edge on wide displays. */}
      <div className="flex items-center justify-between" style={{ maxWidth: 1240, margin: "0 auto" }}>
        <Link href="/" className="flex-shrink-0">
          <Image src="/shiptime-logo.svg" alt="ShipTime" width={160} height={50} className="h-10 w-auto" priority />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {!minimal && (
          <a
            href="#how-it-works"
            className="text-sm font-semibold transition-colors hover:opacity-70"
            style={{ color: ds.navy, ...sora }}
          >
            How it works
          </a>
          )}
          {!minimal && (
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-70"
              style={{ color: ds.navy, ...sora }}
              aria-expanded={open}
              aria-haspopup="true"
            >
              Alternatives
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {open && (
              <div
                className="absolute right-0 pt-3"
                style={{ top: "100%", width: 440 }}
              >
                <div
                  className="grid grid-cols-2 gap-1 p-3"
                  style={{ background: ds.white, borderRadius: 16, border: `1px solid ${ds.border}`, boxShadow: "0 16px 50px rgba(28,30,61,0.14)" }}
                >
                  <div className="p-2">
                    <Link href="/vs" className="block px-2 py-1.5 text-[11px] font-bold uppercase tracking-widest mb-1 hover:opacity-70" style={{ color: ds.orange, ...sora }}>
                      Choose ShipTime
                    </Link>
                    {versus.map((c) => (
                      <Link key={c.slug} href={`/vs/${c.slug}`} className="block px-2 py-2 rounded-lg text-sm transition-colors hover:bg-[#F8FAFB]" style={{ color: ds.navy, ...inter }}>
                        vs. {c.name}
                      </Link>
                    ))}
                  </div>
                  <div className="p-2" style={{ borderLeft: `1px solid ${ds.border}` }}>
                    <Link href="/alternative" className="block px-2 py-1.5 text-[11px] font-bold uppercase tracking-widest mb-1 hover:opacity-70" style={{ color: ds.orange, ...sora }}>
                      Alternatives
                    </Link>
                    {versus.map((c) => (
                      <Link key={c.slug} href={`/alternative/${c.slug}`} className="block px-2 py-2 rounded-lg text-sm transition-colors hover:bg-[#F8FAFB]" style={{ color: ds.navy, ...inter }}>
                        {c.name} alternative
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          )}

          {leadCapture ? (
            <LeadCaptureButton
              source="nav"
              className="text-white text-sm font-semibold px-5 py-2 transition-colors hover:opacity-90 whitespace-nowrap"
              style={{ background: ds.orange, borderRadius: 999, ...sora }}
            >
              {ctaLabel}
            </LeadCaptureButton>
          ) : (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm font-semibold px-5 py-2 transition-colors hover:opacity-90 whitespace-nowrap"
              style={{ background: ds.orange, borderRadius: 999, ...sora }}
            >
              {ctaLabel}
            </a>
          )}
        </div>

        {/* Mobile: CTA + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {leadCapture ? (
            <LeadCaptureButton
              source="nav"
              className="text-white text-sm font-semibold px-4 py-2 transition-colors hover:opacity-90 whitespace-nowrap"
              style={{ background: ds.orange, borderRadius: 999, ...sora }}
            >
              {ctaLabel}
            </LeadCaptureButton>
          ) : (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm font-semibold px-4 py-2 transition-colors hover:opacity-90 whitespace-nowrap"
              style={{ background: ds.orange, borderRadius: 999, ...sora }}
            >
              {ctaLabel}
            </a>
          )}
          {!minimal && (
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ border: `1px solid ${ds.border}`, color: ds.navy }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {!minimal && mobileOpen && (
        <div className="md:hidden mt-3 pb-2">
          <div className="p-3" style={{ background: ds.white, borderRadius: 14, border: `1px solid ${ds.border}` }}>
            <Link href="/vs" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: ds.orange, ...sora }}>
              Choose ShipTime
            </Link>
            {versus.map((c) => (
              <Link key={c.slug} href={`/vs/${c.slug}`} onClick={() => setMobileOpen(false)} className="block px-2 py-2.5 rounded-lg text-sm" style={{ color: ds.navy, ...inter }}>
                vs. {c.name}
              </Link>
            ))}
            <Link href="/alternative" onClick={() => setMobileOpen(false)} className="block px-2 py-2 mt-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: ds.orange, ...sora }}>
              Alternatives
            </Link>
            {versus.map((c) => (
              <Link key={`alt-${c.slug}`} href={`/alternative/${c.slug}`} onClick={() => setMobileOpen(false)} className="block px-2 py-2.5 rounded-lg text-sm" style={{ color: ds.navy, ...inter }}>
                {c.name} alternative
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
