import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

// Token-based product-UI mocks for the Plus zone — the "designed system" made
// visible. Same idea as Core's AlternatingFeatures mocks (a framed window with
// a small fake UI) but every color reads a CSS variable, so these wear the Plus
// brand (navy ink, orange + blue accent) automatically. No photos required.

export function MockFrame({ title, badge, children }: { title?: string; badge?: string; children: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        background: "var(--card)",
        borderRadius: 20,
        border: "1px solid var(--line)",
        boxShadow: "0 30px 80px -44px rgba(28,30,61,0.34)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, height: 38, padding: "0 14px", background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <span style={{ width: 9, height: 9, borderRadius: 999, background: "#E8B4A6" }} />
        <span style={{ width: 9, height: 9, borderRadius: 999, background: "#E8D9A6" }} />
        <span style={{ width: 9, height: 9, borderRadius: 999, background: "#A6D6B4" }} />
        {title && (
          <span className="st-body" style={{ marginLeft: 8, fontSize: 11.5, fontWeight: 600, color: "var(--ink-3)" }}>
            {title}
          </span>
        )}
        {badge && (
          <span className="st-eyebrow" style={{ marginLeft: "auto", fontSize: 9.5, color: "var(--brand)", background: "color-mix(in oklab, var(--brand) 12%, transparent)", padding: "3px 8px", borderRadius: 999 }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ padding: 18 }}>{children}</div>
    </div>
  );
}

const rowBase: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "11px 14px",
  borderRadius: 12,
  border: "1px solid var(--line)",
  background: "var(--surface)",
};

function Dot({ color }: { color: string }) {
  return <span style={{ width: 8, height: 8, borderRadius: 999, background: color, flex: "none" }} />;
}

// ── Phase 1 — Unify: fragmented systems converging into one layer ──────
export function UnifyMock() {
  const systems = ["ERP", "Shopify", "WMS", "UPS", "FedEx", "NetSuite", "Amazon", "Purolator"];
  return (
    <MockFrame title="Data layer" badge="Orchestrated">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
        {systems.map((s) => (
          <div key={s} className="st-body" style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-2)", textAlign: "center", padding: "9px 4px", borderRadius: 9, border: "1px solid var(--line)", background: "var(--card)" }}>
            {s}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 14px", borderRadius: 12, background: "var(--contrast)" }}>
        <Dot color="var(--brand)" />
        <span className="st-display" style={{ fontSize: 14, color: "var(--on-contrast)", letterSpacing: "0.01em" }}>
          One operating layer
        </span>
        <span className="st-body" style={{ marginLeft: "auto", fontSize: 11, color: "color-mix(in oklab, var(--on-contrast) 62%, transparent)" }}>
          up to 30 systems
        </span>
      </div>
    </MockFrame>
  );
}

// ── Phase 2 — Intelligence: ranked recommendations with $ impact ───────
export function IntelligenceMock() {
  const recs: [string, string, "save" | "flag"][] = [
    ["Reroute TOR → VAN to LTL", "+$412 / mo", "save"],
    ["Zone-skip GTA parcel density", "+$1,180 / mo", "save"],
    ["Exception risk — 3 shipments", "flagged early", "flag"],
    ["Carrier C invoice vs quote", "$1,240 recovered", "save"],
  ];
  return (
    <MockFrame title="Recommendations" badge="Custom AI">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {recs.map(([label, impact, kind]) => (
          <div key={label} style={rowBase}>
            <Dot color={kind === "flag" ? "var(--brand)" : "var(--brand-2)"} />
            <span className="st-body" style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {label}
            </span>
            <span className="st-body" style={{ fontSize: 12, fontWeight: 700, color: kind === "flag" ? "var(--brand)" : "var(--brand-2)" }}>
              {impact}
            </span>
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

// ── Phase 3 — Autopilot: workflows graduating recommend → autonomous ───
export function AutopilotMock() {
  const flows: [string, "auto" | "recommend"][] = [
    ["Rate shop & book", "auto"],
    ["Carrier selection", "auto"],
    ["Label & documents", "auto"],
    ["Exception handling", "recommend"],
  ];
  return (
    <MockFrame title="Workflows" badge="Autopilot">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {flows.map(([label, state]) => {
          const auto = state === "auto";
          return (
            <div key={label} style={rowBase}>
              <span className="st-body" style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: "var(--ink)" }}>{label}</span>
              <span className="st-eyebrow" style={{ fontSize: 9.5, color: auto ? "var(--on-brand)" : "var(--ink-3)", background: auto ? "var(--brand)" : "var(--surface-2)", padding: "3px 9px", borderRadius: 999 }}>
                {auto ? "Autonomous" : "Recommend"}
              </span>
              <span style={{ position: "relative", width: 34, height: 18, borderRadius: 999, background: auto ? "var(--brand)" : "var(--line)", flex: "none" }}>
                <span style={{ position: "absolute", top: 2, left: auto ? 18 : 2, width: 14, height: 14, borderRadius: 999, background: "#fff", transition: "left .2s" }} />
              </span>
            </div>
          );
        })}
      </div>
    </MockFrame>
  );
}

// ── Platform — spot-market bidding ─────────────────────────────────────
export function SpotMock() {
  return (
    <MockFrame title="Freight brokerage" badge="Spot board">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
        <span className="st-body" style={{ fontSize: 12, color: "var(--ink-3)" }}>Your instant quote</span>
        <span className="st-display" style={{ fontSize: 22, color: "var(--ink)" }}>$450</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
        {[["Carrier A", "$402"], ["Carrier B", "$388"], ["Carrier C", "$375"]].map(([c, p], i) => (
          <div key={c} style={{ ...rowBase, padding: "9px 13px", borderColor: i === 2 ? "var(--brand)" : "var(--line)", background: i === 2 ? "color-mix(in oklab, var(--brand) 8%, var(--surface))" : "var(--surface)" }}>
            <Dot color={i === 2 ? "var(--brand)" : "var(--ink-3)"} />
            <span className="st-body" style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "var(--ink-2)" }}>{c} bid</span>
            <span className="st-display" style={{ fontSize: 15, color: i === 2 ? "var(--brand)" : "var(--ink-2)" }}>{p}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: 12, background: "var(--contrast)" }}>
        <span className="st-body" style={{ fontSize: 11, color: "color-mix(in oklab, var(--on-contrast) 62%, transparent)" }}>Market-tested in ~1 hour</span>
        <span className="st-display" style={{ fontSize: 14, color: "var(--on-contrast)" }}>Save $75</span>
      </div>
    </MockFrame>
  );
}

// ── Multi-carrier rate shop (every mode, cheapest qualified) ───────────
export function RateShopMock() {
  const rows: [string, string, string, boolean][] = [
    ["Courier · UPS", "2-day", "$11.85", true],
    ["Courier · FedEx", "2-day", "$13.10", false],
    ["LTL · Day & Ross", "3-day", "$402.00", false],
    ["Your negotiated rate", "2-day", "$10.40", true],
  ];
  return (
    <MockFrame title="Rate shop" badge="BYOR + ours">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map(([name, eta, price, best]) => (
          <div key={name} style={{ ...rowBase, borderColor: best ? "var(--brand)" : "var(--line)", background: best ? "color-mix(in oklab, var(--brand) 8%, var(--surface))" : "var(--surface)" }}>
            <Dot color={best ? "var(--brand)" : "var(--ink-3)"} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="st-body" style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>{name}</div>
              <div className="st-body" style={{ fontSize: 10.5, color: "var(--ink-3)" }}>{eta}</div>
            </div>
            <span className="st-display" style={{ fontSize: 15, color: best ? "var(--brand)" : "var(--ink-2)" }}>{price}</span>
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

// ── Fulfillment — intelligent node selection ───────────────────────────
export function NodeMock() {
  const nodes: [string, string, boolean][] = [
    ["Toronto node", "$8.20 · same-day 7M", true],
    ["Calgary node", "$9.90 · 2-day", false],
    ["Vancouver node", "$10.40 · 2-day", false],
  ];
  return (
    <MockFrame title="Node selection" badge="Best end-to-end">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {nodes.map(([name, meta, best]) => (
          <div key={name} style={{ ...rowBase, borderColor: best ? "var(--brand)" : "var(--line)", background: best ? "color-mix(in oklab, var(--brand) 8%, var(--surface))" : "var(--surface)" }}>
            <span style={{ width: 26, height: 26, borderRadius: 8, background: best ? "var(--brand)" : "var(--surface-2)", flex: "none", display: "grid", placeItems: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={best ? "#fff" : "var(--ink-3)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" /><circle cx="12" cy="10" r="2.5" /></svg>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="st-body" style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>{name}</div>
              <div className="st-body" style={{ fontSize: 10.5, color: "var(--ink-3)" }}>{meta}</div>
            </div>
            {best && <span className="st-eyebrow" style={{ fontSize: 9.5, color: "var(--on-brand)", background: "var(--brand)", padding: "3px 9px", borderRadius: 999 }}>Chosen</span>}
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

// ── Image slot — renders the real image when `src` is set, otherwise a
// Hana-style empty state (dashed frame, faint stripes, labelled) so an unfilled
// slot still reads as an intentional placeholder rather than a broken box. The
// split sections on the Plus interior pages all use this.
export function ImageSlot({ src, label = "Image", ratio = "3 / 2" }: { src?: string; label?: string; ratio?: string }) {
  if (src) {
    // No container — the illustration floats on the page (like the reference
    // asset row). Fully contained (never cropped), no border/box/background.
    return (
      <div className="relative w-full" style={{ aspectRatio: ratio }}>
        <Image src={src} alt={label} fill sizes="(max-width: 800px) 100vw, 560px" style={{ objectFit: "contain" }} />
      </div>
    );
  }
  return (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-[#F8FAFB]"
      style={{
        aspectRatio: ratio,
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 14px, rgba(28,30,61,0.03) 14px 28px)",
      }}
    >
      <div className="flex flex-col items-center gap-2.5 px-6 text-center text-slate-400">
        <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </span>
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
}
