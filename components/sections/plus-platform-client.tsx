"use client";

import { useState } from "react";

// The freight-brokerage spot-market walkthrough from the master doc (C3,
// Section D): punch in a shipment, get an instant rate, then send it to the
// spot board for a market-tested price. Client-side demo — no real quoting
// happens here, it's illustrating the mechanic.
export function FreightSpotDemo() {
  const [stage, setStage] = useState<"initial" | "quoted" | "spot">("initial");

  return (
    <div
      style={{
        marginTop: 32,
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--line)",
        background: "var(--card)",
        padding: "28px 26px",
        maxWidth: 480,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span className="st-body" style={{ fontSize: 13, color: "var(--ink-3)" }}>LTL shipment, Toronto → Chicago, 4 pallets</span>
      </div>

      {stage === "initial" && (
        <button
          onClick={() => setStage("quoted")}
          className="st-cta"
          style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, border: "1px solid var(--line)", background: "var(--page)", color: "var(--ink)", padding: "11px 22px", fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}
        >
          Get instant rate
        </button>
      )}

      {stage !== "initial" && (
        <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 10 }}>
          <span className="st-body" style={{ fontSize: 13.5, color: "var(--ink-3)" }}>Your quote</span>
          <span className="st-display" style={{ fontSize: 26, color: "var(--ink)" }}>$450</span>
        </div>
      )}

      {stage === "quoted" && (
        <button
          onClick={() => setStage("spot")}
          className="st-cta"
          style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, background: "var(--brand)", color: "var(--on-brand)", padding: "11px 22px", fontSize: 14.5, fontWeight: 600, border: "none", cursor: "pointer" }}
        >
          Send to spot board
        </button>
      )}

      {stage === "spot" && (
        <>
          <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 10 }}>
            <span className="st-body" style={{ fontSize: 13.5, color: "var(--ink-3)" }}>Market&rsquo;s quote</span>
            <span className="st-display" style={{ fontSize: 26, color: "var(--brand)" }}>$375</span>
          </div>
          <p className="st-body" style={{ marginTop: 14, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55, margin: "14px 0 0" }}>
            Carriers bid on the spot board; within about an hour you have a market-tested price. Book whichever wins.
          </p>
        </>
      )}
    </div>
  );
}
