import type { Metadata } from "next";
import type React from "react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ShipTime — Choose a page",
  description: "Pick a page to preview.",
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

type Box = { href: string; title: string; desc: string; external?: boolean };

const boxes: Box[] = [
  { href: "/plus/v2", title: "Plus v2",       desc: "The ShipTime Plus (managed logistics) experience." },
  { href: "/home-2",  title: "Core v2",       desc: "The ShipTime Core homepage." },
  { href: "/landing", title: "Landing Pages", desc: "Index of comparison and alternative landing pages." },
];

export default function ChoosePage() {
  return (
    <div style={{ minHeight: "100vh", background: ds.surface, fontFamily: "var(--font-inter), system-ui, sans-serif", color: ds.navy, display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{ background: ds.white, borderBottom: `1px solid ${ds.border}`, padding: "18px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Image src="/shiptime-logo.svg" alt="ShipTime" width={120} height={28} style={{ height: 28, width: "auto" }} />
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: ds.muted }}>
            Choose a page
          </span>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 960, width: "100%", margin: "0 auto", padding: "64px 32px 88px" }}>
        <div style={{ marginBottom: 44 }}>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", fontFamily: "var(--font-manrope), sans-serif" }}>
            Where to?
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: 15, color: ds.muted }}>
            Select a page to preview.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}>
          {boxes.map((box, i) => {
            const inner = (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 17, fontWeight: 800, color: ds.navy, fontFamily: "var(--font-manrope), sans-serif", lineHeight: 1.25 }}>
                    {box.title}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: ds.muted, lineHeight: 1.55, flex: 1 }}>
                  {box.desc}
                </p>
                <div style={{ marginTop: 18, fontSize: 12, fontWeight: 700, color: ds.orange, display: "flex", alignItems: "center", gap: 4 }}>
                  Open
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ width: 13, height: 13 }}>
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </>
            );
            const cardStyle: React.CSSProperties = {
              display: "flex",
              flexDirection: "column",
              background: ds.white,
              border: `1px solid ${ds.border}`,
              borderRadius: 16,
              padding: "26px 26px 22px",
              textDecoration: "none",
              color: "inherit",
              minHeight: 150,
              transition: "box-shadow 0.15s, border-color 0.15s, transform 0.15s",
            };
            return box.external ? (
              <a key={i} href={box.href} target="_blank" rel="noopener noreferrer" style={cardStyle} className="hub-card">
                {inner}
              </a>
            ) : (
              <Link key={i} href={box.href} style={cardStyle} className="hub-card">
                {inner}
              </Link>
            );
          })}
        </div>
      </main>

      <style>{`
        .hub-card:hover {
          box-shadow: 0 10px 28px rgba(28,30,61,0.10);
          border-color: #D0D3DF;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
