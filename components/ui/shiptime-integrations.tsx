import type React from "react";

// ── Integrations ──────────────────────────────────────────────────────────────
// The spec is explicit that "connect your store" is a MID-SIZE Core feature and
// deliberately NOT a Plus differentiator — Plus customers assume integration,
// their problem is bigger. So this is a calm band, not a centrepiece: proof the
// store you already run is on the list, and a way through to the full directory.

const ds = {
  navy:   "#1C1E3D",
  muted:  "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  surface:"#F8FAFB",
  white:  "#FFFFFF",
};

const sans: React.CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };
const display: React.CSSProperties = {
  fontFamily: "var(--font-anton), Impact, 'Arial Narrow', sans-serif",
  fontWeight: 400,
  textTransform: "uppercase",
  letterSpacing: "0.005em",
  lineHeight: 0.96,
};

const PLATFORMS = [
  "Shopify", "WooCommerce", "Amazon", "eBay",
  "Etsy", "BigCommerce", "Magento", "Squarespace",
  "Wix", "PrestaShop", "Shift4Shop", "3dcart",
];

export default function ShipTimeIntegrations({
  background = ds.white,
  href = "https://www.shiptime.com/integrations",
}: {
  background?: string;
  href?: string;
}) {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div className="grid md:grid-cols-[minmax(0,420px)_1fr] gap-12 md:gap-16 items-center" style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ ...sans, color: ds.orange }}>
            Integrations
          </p>
          <h2 className="mb-5" style={{ ...display, color: ds.navy, fontSize: "clamp(1.7rem, 4vw, 2.5rem)" }}>
            Keep selling where you already sell
          </h2>
          <p className="mb-7" style={{ ...sans, fontSize: 16, lineHeight: 1.65, color: ds.muted }}>
            Connect your store once and orders arrive on their own — no exporting,
            no re-typing addresses, no second tab. Batch a whole day of labels in
            one pass.
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-70"
            style={{ ...sans, color: ds.navy }}
          >
            Browse every integration <span aria-hidden>→</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {PLATFORMS.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center px-4 py-3.5 text-[13px] font-semibold text-center"
              style={{ ...sans, background: ds.surface, border: `1px solid ${ds.border}`, borderRadius: 12, color: ds.navy }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
