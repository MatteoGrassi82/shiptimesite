import type React from "react";
import ShipTimeHeroFluz from "@/components/ui/shiptime-hero-fluz";
import ShipTimePlatformTrio from "@/components/ui/shiptime-platform-trio";
import ShipTimeCoreFeaturesSticky from "@/components/ui/shiptime-core-features-sticky";
import ShipTimeNoStrings from "@/components/ui/shiptime-no-strings";
import ShipTimeWhyChoose from "@/components/ui/shiptime-why-choose";
import ShipTimeTestimonials from "@/components/ui/shiptime-testimonials-columns";
import SiteNav from "@/components/ui/site-nav";

const ds = {
  navy:  "#1C1E3D",
  muted: "#6E728A",
  orange:"#EC5A26",
  white: "#FFFFFF",
};

const sora = { fontFamily: "var(--font-manrope), sans-serif" };

const utm = (campaign: string, content: string) =>
  `?utm_source=shiptimelandin&utm_medium=landing&utm_campaign=${campaign}&utm_content=${content}`;

const SHIPTIME = "https://docs.google.com/forms/d/e/1FAIpQLSeLZv90COHXyXqlijLX6Gls5SMAquTHc8POd8JO3ajmxSdiVA/viewform?usp=send_form";

// Variant B of the homepage (/home-2) — independent A/B test surface.
// UTM content is suffixed with "-v2" so analytics can separate the two pages.
const reportUrl = (content: string) => `${SHIPTIME}${utm("logistics-report", `${content}-v2`)}`;

export default function HomeVariantTwo() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: ds.white, fontFamily: "var(--font-manrope), system-ui, sans-serif", color: ds.muted, lineHeight: 1.6 }}>

      {/* ── NAV ── */}
      <SiteNav ctaHref={reportUrl("nav")} ctaLabel="Free Report" />

      {/* ── HERO ── */}
      <ShipTimeHeroFluz />

      {/* ── THREE WAYS IN (audience self-select · §3) ── */}
      <ShipTimePlatformTrio />

      {/* ── FEATURE STRIP (the toolkit · §3.2) ── */}
      <ShipTimeCoreFeaturesSticky />

      {/* ── WHY CHOOSE SHIPTIME (advantages vs others) ── */}
      <ShipTimeWhyChoose />

      {/* ── TESTIMONIALS ── */}
      <ShipTimeTestimonials background="#ECEAE7" />

      {/* ── NO STRINGS ATTACHED (objection handler) ── */}
      <ShipTimeNoStrings background={ds.white} />

      {/* ── FOOTER ── */}
      <footer className="px-5 md:px-10 py-10 md:py-14" style={{ background: ds.navy, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8" style={{ maxWidth: 1240, margin: "0 auto" }}>
          {/* Tagline */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)", ...sora }}>Ship Smarter Today</p>
          </div>

          {/* Address + phone */}
          <div className="flex flex-col gap-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            <p>700 Dorval Dr., Suite 700</p>
            <p>Oakville, ON L6K 3V3 Canada</p>
            <a href="tel:18777845744" className="mt-2 transition-colors hover:text-[#EC5A26]" style={{ color: "rgba(255,255,255,0.45)" }}>1-877-784-5744</a>
          </div>
        </div>
        <p className="mt-8 text-xs text-center md:text-left" style={{ color: "rgba(255,255,255,0.25)", maxWidth: 1240, margin: "32px auto 0" }}>© 2026 ShipTime Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
