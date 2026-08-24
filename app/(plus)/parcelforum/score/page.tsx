import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LpsShiplet } from "@/components/sections/lps-shiplet";
import { P, serif, sans } from "@/components/sections/plus-v2-kit";

// ── /parcelforum/score — the assessment, on its own ──────────────────────────
// Deliberately not the landing page. Once someone commits to sixteen questions
// the page should stop selling: no nav, no footer, no sections underneath, one
// column, nothing to scroll to. It starts at question one (autoStart) because
// the pitch already happened on /parcelforum.
//
// Same unit as the landing page and /plus/assessment — only the framing and the
// report delivery differ: here the score lands on screen and the written report
// arrives by email an hour later (2026-08-20 call, reaffirmed on the 24th), so
// it reads as a letter rather than as a form that answered instantly.

export const metadata: Metadata = {
  title: "Your Logistics Performance Score — ShipTime Plus",
  description:
    "Sixteen questions, five minutes. Your Logistics Performance Score across cost, operational excellence and customer experience.",
  robots: "noindex",
};

export default function ParcelForumScorePage() {
  return (
    <main style={{ background: P.panelSoft, minHeight: "100svh", fontFamily: "var(--font-manrope), system-ui, sans-serif" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(24px, 4vw, 48px) clamp(18px, 4vw, 32px) clamp(60px, 8vw, 100px)" }}>
        {/* slim chrome — a way back, and who's asking. Nothing else. */}
        <div className="lps-noprint" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: "clamp(22px, 3vw, 36px)" }}>
          <Link
            href="/parcelforum"
            style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 600, color: P.sub, textDecoration: "none" }}
          >
            <ArrowLeft size={15} /> Back
          </Link>
          <Link href="/plus/v3" style={{ textDecoration: "none", display: "inline-flex", alignItems: "baseline", gap: 7 }}>
            <span style={{ ...serif, fontSize: 18, color: P.ink }}>ShipTime</span>
            <span style={{ ...sans, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: P.orange }}>Plus</span>
          </Link>
        </div>

        <LpsShiplet autoStart reportDelivery="email" />

        <p className="lps-noprint" style={{ ...sans, textAlign: "center", fontSize: 12.5, lineHeight: 1.6, color: P.faint, margin: "26px auto 0", maxWidth: "52ch" }}>
          Your answers contribute anonymously to the Logistics Performance Index — the benchmark behind our State of
          Logistics Performance Report.
        </p>
      </div>
    </main>
  );
}
