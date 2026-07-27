import type React from "react";
import Image from "next/image";
import { Zap } from "lucide-react";

// ── "No strings attached" (Fluz "Tripwire free" adaptation) ───────────────────
// Objection-handler trust section for the self-serve Core audience: no fees,
// fast self-serve setup, real human support. Three tall panels, heading + blurb
// below each.

const ds = {
  navy:   "#1C1E3D",
  muted:  "#6E728A",
  orange: "#EC5A26",
  green:  "#39C07A",
  border: "#E8E8E8",
  lightBlue: "#E3EEFC",
  peach:  "#FAF0EB",
  white:  "#FFFFFF",
};

const sans: React.CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };
const heading: React.CSSProperties = { ...sans, fontFamily: "var(--font-bricolage), var(--font-manrope), system-ui, sans-serif", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.08, color: ds.navy };

const PANEL = "relative w-full overflow-hidden";
const panelStyle: React.CSSProperties = { borderRadius: 22, aspectRatio: "4 / 5" };

export default function ShipTimeNoStrings({ background = ds.white }: { background?: string }) {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        {/* header */}
        <div className="text-center mb-14 md:mb-20">
          <h2 className="mx-auto" style={{ ...heading, fontSize: "clamp(2rem, 4.8vw, 3.2rem)", maxWidth: 640 }}>
            No strings attached
          </h2>
          <p className="mt-5 mx-auto" style={{ ...sans, fontSize: 16.5, lineHeight: 1.6, color: ds.muted, maxWidth: 540 }}>
            No setup fees, no lock-in, no sales calls. Start free and grow at your own
            pace — we'll never make you switch what already works.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">

          {/* 1 — No platform fees (dark panel + glowing pill) */}
          <div>
            <div className={PANEL} style={{ ...panelStyle, background: "linear-gradient(160deg, #2C2E3A 0%, #1C1E2B 60%, #14151F 100%)" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="px-6 py-3 rounded-full text-[19px] font-extrabold text-white"
                  style={{ ...sans, border: `2px solid ${ds.green}`, boxShadow: `0 0 28px rgba(57,192,122,0.5)` }}
                >
                  No hidden fees
                </span>
              </div>
            </div>
            <h3 className="mt-6 mb-2" style={{ ...heading, fontSize: "1.35rem" }}>No platform fees</h3>
            <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: ds.muted }}>
              No monthly fee, no contract, no per-seat pricing. Start free and only pay for what you ship.
            </p>
          </div>

          {/* 2 — Set up in minutes (illustration panel) */}
          <div>
            <div className={PANEL} style={{ ...panelStyle, background: "linear-gradient(160deg, #E3EEFC 0%, #EFE6F5 50%, #FAF0EB 100%)" }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <span className="flex items-center justify-center rounded-full" style={{ width: 96, height: 96, background: ds.white, boxShadow: "0 18px 40px rgba(28,30,61,0.12)" }}>
                  <Zap size={40} style={{ stroke: ds.orange, fill: ds.orange }} />
                </span>
                <span className="px-4 py-2 rounded-full text-[15px] font-extrabold" style={{ ...sans, background: ds.white, color: ds.navy, boxShadow: "0 10px 26px rgba(28,30,61,0.10)" }}>
                  Live in under 5 min
                </span>
              </div>
            </div>
            <h3 className="mt-6 mb-2" style={{ ...heading, fontSize: "1.35rem" }}>Set up in minutes</h3>
            <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: ds.muted }}>
              Connect the store you already sell on and print your first label in under five minutes. No migration, no IT project.
            </p>
          </div>

          {/* 3 — Real human support (photo panel) */}
          <div>
            <div className={PANEL} style={panelStyle}>
              <Image src="/generated/core-include-pickup.png" alt="ShipTime support specialist" fill className="object-cover" sizes="(max-width: 768px) 90vw, 360px" />
            </div>
            <h3 className="mt-6 mb-2" style={{ ...heading, fontSize: "1.35rem" }}>Real humans to support you</h3>
            <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: ds.muted }}>
              Reach real specialists who know shipping — by phone, email, or live chat. No bots, no ticket black holes.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
