import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LpsShiplet } from "@/components/sections/lps-shiplet";

// ── /parcelforum/score — the assessment, on its own ──────────────────────────
// Deliberately not the landing page. Once someone commits to sixteen questions
// the page should stop selling: no nav, no footer, no sections underneath, one
// column, nothing to scroll to. It starts at question one (autoStart) because
// the pitch already happened on /parcelforum.
//
// Same unit as the landing page — only the framing and the report delivery
// differ: here the score lands on screen and the written report arrives by
// email an hour later (2026-08-20 call, reaffirmed on the 24th).
//
// Palette and type follow the printed banner like the landing page does
// (#07225B / #E55021, Manrope), and the shiplet's serif is remapped to Manrope
// via the .pf-flow scope for the same reason.

export const metadata: Metadata = {
  title: "Your Logistics Performance Score | ShipTime One",
  description:
    "Sixteen questions, five minutes. Your Logistics Performance Score across cost, operational excellence and customer experience.",
  robots: "noindex",
};

const body = { fontFamily: "var(--font-manrope), system-ui, sans-serif" } as const;

export default function ParcelForumScorePage() {
  return (
    <main className="pf-flow" style={{ ...body, background: "#F7F8FB", minHeight: "100svh" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(22px, 4vw, 44px) clamp(18px, 4vw, 32px) clamp(60px, 8vw, 100px)" }}>
        <div className="lps-noprint" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: "clamp(22px, 3vw, 36px)" }}>
          <Link href="/parcelforum" style={{ ...body, display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 600, color: "#4A5470", textDecoration: "none" }}>
            <ArrowLeft size={15} /> Back
          </Link>
          <Link href="/parcelforum" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/shiptime-logo.svg" alt="ShipTime" width={163} height={50} style={{ height: 30, width: "auto", display: "block" }} />
          </Link>
        </div>

        <LpsShiplet autoStart reportDelivery="email" />

        <p className="lps-noprint" style={{ ...body, textAlign: "center", fontSize: 12.5, lineHeight: 1.6, color: "#8B94AD", margin: "26px auto 0", maxWidth: "52ch" }}>
          Your answers contribute anonymously to the Logistics Performance Index, the benchmark behind our State of
          Logistics Performance Report.
        </p>
      </div>
      <style>{`.pf-flow { --font-instrument-serif: var(--font-manrope); } .pf-flow [style*="font-style:italic"] { font-style: normal !important; }`}</style>
    </main>
  );
}
