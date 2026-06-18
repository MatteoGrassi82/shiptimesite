import type React from "react";
import { Reveal } from "@/components/ui/reveal";

const ds = {
  navy: "#1C1E3D",
  muted: "#6E728A",
  orange: "#EC5A26",
  orangeSoft: "#F0845B",
  lightBlue: "#E3EEFC",
  surface: "#F8FAFB",
  border: "#E8E8E8",
  white: "#FFFFFF",
  green: "#3FA864",
};
const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };
const heading: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  color: ds.navy,
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  fontWeight: 800,
};

// Humble-style "Today vs With ShipTime" edge cases. Each card pairs the painful
// status quo (muted, left) with the ShipTime fix (orange-tinted, right).
type EdgeCase = { category: string; today: string; fix: string };

const CASES: EdgeCase[] = [
  {
    category: "Rate shopping",
    today:
      "You bounce between four carrier websites and a rate spreadsheet that's already out of date, then guess which option is actually cheapest.",
    fix: "Every carrier's live rate — courier, LTL, and Canada Post — on one screen. Print the cheapest qualified label in seconds.",
  },
  {
    category: "Freight & LTL",
    today:
      "Booking a pallet means phone tag, emailed PDFs, and a freight bill that never matches the quote you were given.",
    fix: "Quote and book LTL the same way you book parcels. Total landed cost up front, one invoice at month end, no surprise surcharges.",
  },
  {
    category: "Invoice audit",
    today:
      "Late deliveries and incorrect surcharges quietly inflate every carrier invoice, and nobody on your team has time to dispute them.",
    fix: "Every shipment is audited automatically. We catch overcharges and missed service guarantees, then recover the refund — money you'd otherwise never see.",
  },
  {
    category: "Tracking",
    today:
      "'Where's my order?' emails pile up while you log into separate carrier portals to copy-paste tracking numbers one by one.",
    fix: "Live parcel and freight tracking for every shipment in one dashboard, so support questions get answered before customers even ask.",
  },
  {
    category: "Reporting",
    today:
      "Finance asks what you spent on shipping last quarter and you stitch together four exports and a manual spreadsheet to guess.",
    fix: "Carrier spend by date, channel, or cost centre in one click. One source of truth, finance-ready, no monthly fire drill.",
  },
  {
    category: "Pickups & support",
    today:
      "You drive parcels to the depot after close, and when something goes wrong you're stuck in a ticket queue waiting on a bot.",
    fix: "Schedule carrier pickups in two clicks and reach a real person who knows your account by phone, email, or chat.",
  },
];

const chip: React.CSSProperties = {
  ...sora,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

export default function ShipTimeEdgeCases({ background = ds.surface }: { background?: string }) {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        {/* Header */}
        <div className="text-center mx-auto" style={{ maxWidth: 820 }}>
          <Reveal>
            <p
              className="text-xs font-bold uppercase tracking-[0.12em] mb-3"
              style={{ color: ds.orange, ...sora }}
            >
              Where margin leaks
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 style={{ ...heading, fontSize: "clamp(1.8rem, 4.2vw, 2.7rem)" }}>
              Most shipping tools leave you fighting the 20% that breaks every week.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p
              className="mt-4 mx-auto"
              style={{ ...inter, color: ds.muted, fontSize: 17, lineHeight: 1.6, maxWidth: 680 }}
            >
              But that's where your margin leaks.{" "}
              <span style={{ color: ds.orange, fontWeight: 600 }}>
                ShipTime makes the messy edge cases standard, automatic work.
              </span>
            </p>
          </Reveal>
        </div>

        {/* Stack of cards */}
        <div className="mt-12 md:mt-16 flex flex-col gap-4">
          {CASES.map((c, i) => (
            <Reveal key={c.category} delay={i * 90}>
              <article
                style={{
                  background: ds.white,
                  borderRadius: 24,
                  border: `1px solid ${ds.border}`,
                  boxShadow: "0 30px 80px -40px rgba(28,30,61,0.3)",
                  overflow: "hidden",
                }}
              >
                <div className="p-6 md:p-8">
                  {/* Category label spanning both columns */}
                  <div
                    className="mb-5"
                    style={{
                      ...sora,
                      fontSize: 13,
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: ds.navy,
                    }}
                  >
                    {c.category}
                  </div>

                  {/* Two columns with center divider */}
                  <div className="grid gap-6 md:gap-0 md:[grid-template-columns:1fr_1fr]">
                    {/* Today */}
                    <div className="md:pr-8">
                      <div className="mb-2.5" style={{ ...chip, color: ds.muted }}>
                        Today
                      </div>
                      <p
                        style={{
                          ...inter,
                          color: ds.muted,
                          fontSize: 15,
                          lineHeight: 1.6,
                        }}
                      >
                        {c.today}
                      </p>
                    </div>

                    {/* With ShipTime */}
                    <div
                      className="md:pl-8"
                      style={{ borderLeft: `1px solid ${ds.border}` }}
                    >
                      <div
                        className="p-4 md:p-5"
                        style={{
                          background: "rgba(236,90,38,0.05)",
                          borderRadius: 16,
                        }}
                      >
                        <div className="mb-2.5" style={{ ...chip, color: ds.orange }}>
                          With ShipTime
                        </div>
                        <p
                          style={{
                            ...inter,
                            color: ds.navy,
                            fontSize: 15,
                            lineHeight: 1.6,
                          }}
                        >
                          {c.fix}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
