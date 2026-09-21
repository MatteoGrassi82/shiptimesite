"use client";

import type React from "react";
import { Check, ArrowDown } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import FloatProp from "@/components/ui/float-prop";

// ── Integrations ──────────────────────────────────────────────────────────────
// The spec is explicit that connecting a store is a MID-SIZE Core feature and
// deliberately NOT a Plus differentiator — Plus customers assume integration,
// their problem is bigger. So this stays one beat, not a centrepiece.
//
// What it shows rather than states: orders arriving on their own. A grid of
// platform names proves nothing a visitor doubted; a queue filling itself,
// against the labels those orders become, is the actual claim.

const ds = {
  navy:   "#1C1E3D",
  body:   "#4B4F66",
  muted:  "#6E728A",
  orange: "#EC5A26",
  green:  "#3FA864",
  border: "#E8E8E8",
  surface:"#F8FAFB",
  white:  "#FFFFFF",
  field:  "#ECEAE7",
};

const CARD_BG = "linear-gradient(180deg, #E8E2DA 0%, #DBD3C8 100%)";
const widgetShadow = "0 18px 44px rgba(28,30,61,0.20)";

const sans: React.CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };
const display: React.CSSProperties = {
  fontFamily: "var(--font-anton), Impact, 'Arial Narrow', sans-serif",
  fontWeight: 400,
  textTransform: "uppercase",
  letterSpacing: "0.005em",
  lineHeight: 0.96,
  color: ds.navy,
};

const STORES: [string, string, string][] = [
  ["Shopify",     "#5E8E3E", "24 orders today"],
  ["WooCommerce", "#7F54B3", "Synced 2m ago"],
  ["Amazon",      "#FF9900", "9 orders today"],
  ["Etsy",        "#F1641E", "Synced"],
];

const ALSO = ["eBay", "BigCommerce", "Magento", "Squarespace", "Wix", "PrestaShop"];

const POINTS = [
  "Orders arrive on their own — no export, no re-typing",
  "Batch a whole day of labels in one pass",
  "Tracking pushed back to the store automatically",
];

export default function ShipTimeIntegrations({
  background = ds.white,
  href = "https://www.shiptime.com/integrations",
}: {
  background?: string;
  href?: string;
}) {
  return (
    <section className="relative overflow-hidden px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div className="relative grid items-center gap-12 md:gap-16 md:grid-cols-2" style={{ maxWidth: 1080, margin: "0 auto" }}>
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ ...sans, color: ds.orange }}>
            Integrations
          </p>
          <h2 className="mb-5" style={{ ...display, fontSize: "clamp(1.8rem, 4.2vw, 2.7rem)" }}>
            Keep selling where you already sell
          </h2>
          <p className="mb-7" style={{ ...sans, fontSize: 16, lineHeight: 1.65, color: ds.body, maxWidth: 430 }}>
            Connect the store you already run. Orders flow in by themselves and
            leave as labels — you never open a second tab.
          </p>
          <ul className="flex flex-col gap-3 mb-8 list-none p-0 m-0" style={{ maxWidth: 420 }}>
            {POINTS.map((pt) => (
              <li key={pt} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(236,90,38,0.12)" }}>
                  <Check size={12} style={{ stroke: ds.orange, strokeWidth: 3 }} />
                </span>
                <span style={{ ...sans, fontSize: 15, lineHeight: 1.5, color: ds.navy, fontWeight: 600 }}>{pt}</span>
              </li>
            ))}
          </ul>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-70"
            style={{ ...sans, color: ds.navy }}
          >
            Browse every integration <span aria-hidden>→</span>
          </a>
        </Reveal>

        {/* the queue filling itself */}
        <div className="relative mx-auto w-full" style={{ maxWidth: 430 }}>
          <div className="relative flex items-center justify-center overflow-hidden" style={{ borderRadius: 28, background: CARD_BG, minHeight: 440, padding: 28 }}>
            <div className="w-full" style={{ maxWidth: 320 }}>
              <div className="p-4" style={{ background: ds.white, borderRadius: 20, boxShadow: widgetShadow, border: `1px solid ${ds.border}` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-extrabold" style={{ ...sans, color: ds.navy }}>Connected stores</span>
                  <span className="flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider" style={{ ...sans, color: ds.green }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: ds.green }} /> Live
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {STORES.map(([name, colour, sub]) => (
                    <div key={name} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl" style={{ background: ds.surface, border: `1px solid ${ds.border}` }}>
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[11px] font-extrabold flex-shrink-0" style={{ ...sans, background: colour }}>{name[0]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11.5px] font-bold leading-tight" style={{ ...sans, color: ds.navy }}>{name}</p>
                        <p className="text-[9.5px] leading-tight" style={{ ...sans, color: ds.muted }}>{sub}</p>
                      </div>
                      <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(63,168,100,0.14)" }}>
                        <Check size={10} style={{ stroke: ds.green, strokeWidth: 3.5 }} />
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 my-3">
                  <span className="flex-1 h-px" style={{ background: ds.border }} />
                  <ArrowDown size={13} style={{ stroke: ds.orange }} />
                  <span className="flex-1 h-px" style={{ background: ds.border }} />
                </div>

                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: "#FFF4EF", border: `1px solid ${ds.orange}` }}>
                  <span className="text-[11.5px] font-bold" style={{ ...sans, color: ds.navy }}>33 labels ready to print</span>
                  <span className="text-[11px] font-extrabold" style={{ ...sans, color: ds.orange }}>Batch</span>
                </div>
              </div>

              <div className="mt-3.5 flex flex-wrap justify-center gap-1.5">
                {ALSO.map((n) => (
                  <span key={n} className="px-2.5 py-1 text-[10.5px] font-semibold rounded-full" style={{ ...sans, background: "rgba(255,255,255,0.72)", color: "rgba(28,30,61,0.62)" }}>{n}</span>
                ))}
                <span className="px-2.5 py-1 text-[10.5px] font-bold rounded-full" style={{ ...sans, background: "rgba(28,30,61,0.08)", color: ds.navy }}>+ more</span>
              </div>
            </div>
          </div>
          <FloatProp prop="plane" size={88} rotate={-12} style={{ right: -34, top: "8%" }} />
        </div>
      </div>
    </section>
  );
}
