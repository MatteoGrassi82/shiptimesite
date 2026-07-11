import Link from "next/link";
import { Container, CtaButton } from "./primitives";
import type { SiteSettings, Zone } from "./types";

// Shared nav + footer for Sanity-driven pages and the blog. Reads siteSettings
// (per-zone) and wears the zone brand via tokens. Hand-coded landing pages keep
// their own chrome; this is only for the composed/CMS pages.

export function ZoneNav({ zone, settings }: { zone: Zone; settings?: SiteSettings }) {
  const home = zone === "plus" ? "/plus" : "/";
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
        <nav style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {(settings?.nav || []).map(
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
          )}
          {settings?.primaryCta?.label && <CtaButton cta={settings.primaryCta} />}
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
