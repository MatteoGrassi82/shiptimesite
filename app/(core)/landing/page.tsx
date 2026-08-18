import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { competitors } from "@/lib/competitors";

export const metadata: Metadata = {
  title: "ShipTime — Landing Pages",
  description: "Internal index of ShipTime landing pages for review and testing.",
  robots: "noindex",
};

const ds = {
  navy:   "#1C1E3D",
  muted:  "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  surface:"#F8FAFB",
  white:  "#FFFFFF",
};

type Section = {
  label: string;
  pages: { href: string; title: string; desc: string; tag?: string }[];
};

const sections: Section[] = [
  {
    label: "ShipTime Plus",
    pages: [
      {
        href: "/plus",
        title: "Plus — Homepage",
        desc: "The Hana build: globe hero, proof bento, Remotion feature films, capabilities scroll, ops dashboard.",
      },
      {
        href: "/plus/v2",
        title: "Plus — Homepage V2",
        desc: "Federato-style editorial build: centered hero over an ambient loop, conceptual shape art, maturity ladder, platform diagram.",
        tag: "V2",
      },
      {
        href: "/plus/v3",
        title: "Plus — Homepage V3",
        desc: "The 'first iteration' brief: who it's for → nine problems → the solution (three pillars, six differences) → measured proof.",
        tag: "V3",
      },
      { href: "/plus/los", title: "Logistics Operating System", desc: "The three-phase system story: unify, apply intelligence, autopilot." },
      { href: "/plus/platform", title: "Platform", desc: "Every mode and carrier, freight brokerage spot board, analytics." },
      { href: "/plus/shiplets", title: "Shiplets", desc: "The micro-app layer — 15 shiplets on a scrolling parallax wall.", tag: "New" },
      { href: "/plus/fulfillment", title: "Fulfillment", desc: "Warehousing, inventory, zone skipping, the certified partner network." },
      { href: "/plus/technology", title: "Technology", desc: "Orchestration, custom AI, earned autonomy, security posture." },
      { href: "/plus/solutions", title: "Solutions", desc: "Persona pages: DTC, 3PLs, enterprise shippers, US brands entering Canada." },
      { href: "/plus/case-studies", title: "Case Studies", desc: "Proof, not promises — the designed-system results." },
      { href: "/plus/compare", title: "Compare", desc: "Plus vs a 3PL vs a TMS vs a broker." },
      { href: "/plus/assessment", title: "Assessment", desc: "The 12-question logistics maturity quiz with scoring." },
      { href: "/plus/book-a-call", title: "Book a call", desc: "The conversion page every outbound sequence lands on." },
    ],
  },
  {
    label: "Comparison (vs)",
    pages: competitors.map((c) => ({
      href: `/vs/${c.slug}`,
      title: `ShipTime vs ${c.name}`,
      desc: c.headline,
    })),
  },
  {
    label: "Alternative",
    pages: competitors.map((c) => ({
      href: `/alternative/${c.slug}`,
      title: `${c.name} Alternative`,
      desc: c.headline,
    })),
  },
];

export default function IndexPage() {
  return (
    <div style={{ minHeight: "100vh", background: ds.surface, fontFamily: "var(--font-inter), system-ui, sans-serif", color: ds.navy }}>

      {/* Header */}
      <header style={{ background: ds.white, borderBottom: `1px solid ${ds.border}`, padding: "18px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Image src="/shiptime-logo.svg" alt="ShipTime" width={120} height={28} style={{ height: 28, width: "auto" }} />
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: ds.muted }}>
            Landing Pages
          </span>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 32px 80px" }}>

        <div style={{ marginBottom: 52 }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", fontFamily: "var(--font-manrope), sans-serif" }}>
            All landing pages
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: 15, color: ds.muted }}>
            Click any card to preview a landing page.
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.label} style={{ marginBottom: 52 }}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: ds.orange,
              marginBottom: 18,
            }}>
              {section.label}
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}>
              {section.pages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: ds.white,
                    border: `1px solid ${ds.border}`,
                    borderRadius: 14,
                    padding: "22px 24px",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "box-shadow 0.15s",
                  }}
                  className="page-card"
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                    <span style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: ds.navy,
                      fontFamily: "var(--font-manrope), sans-serif",
                      lineHeight: 1.3,
                    }}>
                      {page.title}
                    </span>
                    {page.tag && (
                      <span style={{
                        flexShrink: 0,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: ds.white,
                        background: ds.orange,
                        padding: "3px 8px",
                        borderRadius: 999,
                      }}>
                        {page.tag}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: ds.muted, lineHeight: 1.55, flex: 1 }}>
                    {page.desc}
                  </p>
                  <div style={{ marginTop: 16, fontSize: 12, fontWeight: 600, color: ds.orange, display: "flex", alignItems: "center", gap: 4 }}>
                    View page
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: 13, height: 13 }}>
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </main>

      <style>{`
        .page-card:hover {
          box-shadow: 0 8px 24px rgba(28,30,61,0.09);
          border-color: #D0D3DF;
        }
      `}</style>
    </div>
  );
}
