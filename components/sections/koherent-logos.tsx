import type { CSSProperties } from "react";
import { K } from "./koherent-brand";

// ── The integration library's logos ──────────────────────────────────────────
// The six integrations the copy names, as the brands' own marks (Matteo,
// Oct 28: "use real logos"). Files are the official SVGs from Wikimedia
// Commons, sanitized to plain vector; NetSuite only exists there as a PNG.
// Shown unaltered in their own colours on a paper chip, which is what the
// brands' guidelines ask for. No "use client": the bento (client) and the
// What we bring page (server) both use this.

export const INTEGRATIONS: { name: string; src: string; w: number; h: number }[] = [
  { name: "Shopify", src: "/logos/shopify.svg", w: 612, h: 192 },
  { name: "Amazon", src: "/logos/amazon.svg", w: 603, h: 182 },
  { name: "NetSuite", src: "/logos/netsuite.png", w: 417, h: 152 },
  { name: "QuickBooks", src: "/logos/quickbooks.svg", w: 270, h: 69 },
  { name: "WooCommerce", src: "/logos/woocommerce.svg", w: 184, h: 48 },
  { name: "BigCommerce", src: "/logos/bigcommerce.svg", w: 132, h: 30 },
];

export const chip: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  height: 36,
  padding: "0 14px",
  background: K.card,
  border: `1px solid ${K.line}`,
  borderRadius: 999,
};

export function LogoChip({ name, src, w, h, height = 18, className, style }: { name: string; src: string; w: number; h: number; height?: number; className?: string; style?: CSSProperties }) {
  return (
    <span className={className} style={{ ...chip, ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a small brand mark, sized by height */}
      <img src={src} alt={name} width={w} height={h} loading="lazy" style={{ height, width: "auto", display: "block" }} />
    </span>
  );
}

export function LogoRow({ style, more }: { style?: CSSProperties; more?: string }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, ...style }}>
      {INTEGRATIONS.map((l) => (
        <LogoChip key={l.name} {...l} />
      ))}
      {more && (
        <span style={{ ...chip, background: "transparent", border: `1px dashed ${K.lilac}`, fontSize: 13.5, fontWeight: 600, color: K.stone }}>{more}</span>
      )}
    </div>
  );
}
