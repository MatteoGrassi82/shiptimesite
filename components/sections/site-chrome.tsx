import Link from "next/link";
import { Container, CtaButton } from "./primitives";
import type { SiteSettings, Zone } from "./types";

// Shared nav + footer for Sanity-driven pages and the blog. Reads siteSettings
// (per-zone) and wears the zone brand via tokens. Hand-coded landing pages keep
// their own chrome; this is only for the composed/CMS pages.

// Plus's sitemap is structural (which pages exist under which group), not
// editorial copy, so it's hardcoded here rather than driven by
// siteSettings.nav — the same reasoning the blog/CMS routes use for URLs.
const PLUS_NAV: { label: string; href?: string; items?: { label: string; href: string }[] }[] = [
  { label: "LOS", href: "/plus/los" },
  {
    label: "Platform",
    items: [
      { label: "Platform", href: "/plus/platform" },
      { label: "Shiplets", href: "/plus/shiplets" },
      { label: "Fulfillment", href: "/plus/fulfillment" },
      { label: "Technology", href: "/plus/technology" },
    ],
  },
  { label: "Solutions", href: "/plus/solutions" },
  { label: "How We Work", href: "/plus/how-we-work" },
  // Design variant under review — sits in the nav so it's reachable from any
  // Plus page. Drop this entry once one of the two homepages wins.
  { label: "V2", href: "/plus/v2" },
  {
    label: "Resources",
    items: [
      { label: "Case Studies", href: "/plus/case-studies" },
      { label: "Guides", href: "/plus/resources" },
      { label: "Compare", href: "/plus/compare" },
      { label: "FAQ", href: "/plus/faq" },
    ],
  },
];

function PlusNavGroups() {
  return (
    <>
      {PLUS_NAV.map((group) =>
        group.items ? (
          <div key={group.label} className="st-nav-group" style={{ position: "relative" }}>
            <button
              type="button"
              className="st-body st-nav-trigger"
              style={{ fontSize: 14.5, color: "var(--ink-2)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              {group.label}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div
              className="st-nav-dropdown"
              style={{
                position: "absolute",
                top: "calc(100% + 14px)",
                left: "50%",
                transform: "translateX(-50%)",
                minWidth: 180,
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-card)",
                boxShadow: "0 16px 40px -16px rgba(28,30,61,0.25)",
                padding: 8,
                display: "flex",
                flexDirection: "column",
                opacity: 0,
                visibility: "hidden",
                transition: "opacity 0.15s ease",
              }}
            >
              {group.items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className="st-body"
                  style={{ fontSize: 14, color: "var(--ink-2)", textDecoration: "none", padding: "9px 12px", borderRadius: 8 }}
                >
                  {it.label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Link key={group.label} href={group.href!} className="st-body" style={{ fontSize: 14.5, color: "var(--ink-2)", textDecoration: "none" }}>
            {group.label}
          </Link>
        ),
      )}
      <style>{`
        .st-nav-group:hover .st-nav-dropdown,
        .st-nav-group:focus-within .st-nav-dropdown { opacity: 1 !important; visibility: visible !important; }
        .st-nav-dropdown a:hover { background: var(--surface); color: var(--ink) !important; }
      `}</style>
    </>
  );
}

export function ZoneNav({ zone, settings }: { zone: Zone; settings?: SiteSettings }) {
  const home = zone === "plus" ? "/plus" : "/";
  const primaryCta =
    zone === "plus" && !settings?.primaryCta?.label
      ? { label: "Book a call", href: "/plus/book-a-call", style: "primary" as const }
      : settings?.primaryCta;
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "color-mix(in oklab, var(--page) 86%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <Container style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {zone === "plus" && (
            <Link href="/" className="st-body" style={{ fontSize: 12.5, color: "var(--ink-3)", textDecoration: "none", whiteSpace: "nowrap" }}>
              ← ShipTime
            </Link>
          )}
          <Link href={home} style={{ textDecoration: "none", display: "inline-flex", alignItems: "baseline", gap: 8 }}>
            <span className="st-display" style={{ fontSize: 20, color: "var(--ink)", letterSpacing: "-0.02em" }}>
              ShipTime
            </span>
            {zone === "plus" && (
              <span className="st-eyebrow" style={{ fontSize: 11, color: "var(--brand)" }}>
                Plus
              </span>
            )}
          </Link>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: 26 }}>
          {zone === "plus" ? (
            <PlusNavGroups />
          ) : (
            (settings?.nav || []).map(
              (l, i) =>
                l?.label && (
                  <Link
                    key={i}
                    href={l.href || "#"}
                    className="st-body"
                    style={{ fontSize: 14.5, color: "var(--ink-2)", textDecoration: "none" }}
                  >
                    {l.label}
                  </Link>
                ),
            )
          )}
          {primaryCta?.label && <CtaButton cta={primaryCta} />}
        </nav>
      </Container>
    </header>
  );
}

export function ZoneFooter({ zone, settings }: { zone: Zone; settings?: SiteSettings }) {
  const year = new Date().getFullYear();
  const dim = (pct: number) => `color-mix(in oklab, var(--on-contrast) ${pct}%, transparent)`;
  return (
    <footer style={{ background: "var(--contrast)", color: "var(--on-contrast)", padding: "56px 0 40px" }}>
      <Container style={{ padding: "0 24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ maxWidth: "40ch" }}>
            <div className="st-display" style={{ fontSize: 22, marginBottom: 10 }}>
              ShipTime{zone === "plus" ? " Plus" : ""}
            </div>
            {settings?.tagline && (
              <p className="st-body" style={{ margin: 0, color: dim(72), fontSize: 14.5, lineHeight: 1.6 }}>
                {settings.tagline}
              </p>
            )}
          </div>
          <nav style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {(settings?.nav || []).map(
              (l, i) =>
                l?.label && (
                  <Link key={i} href={l.href || "#"} className="st-body" style={{ fontSize: 14, color: dim(72), textDecoration: "none" }}>
                    {l.label}
                  </Link>
                ),
            )}
          </nav>
        </div>
        {settings?.footerNote && (
          <p className="st-body" style={{ marginTop: 32, fontSize: 12.5, color: dim(55), lineHeight: 1.6 }}>
            {settings.footerNote}
          </p>
        )}
        <p className="st-body" style={{ marginTop: 16, fontSize: 12.5, color: dim(45) }}>
          © {year} ShipTime. Ship smarter.
        </p>
      </Container>
    </footer>
  );
}
