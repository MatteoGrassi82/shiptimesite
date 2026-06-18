"use client";

import type React from "react";
import { useState } from "react";
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

type QA = { q: string; a: string };

const FAQS: QA[] = [
  {
    q: "We've used shipping tools before and the 'discounts' never showed up. How is ShipTime different?",
    a: "You see real, all-in rates from every carrier before you book — fuel, residential, and area surcharges included, no asterisks. And our rate audit keeps watching after the label prints: when a carrier overcharges or misses a guaranteed delivery, we catch it and recover the money back to your account automatically.",
  },
  {
    q: "Do I need a contract, a setup fee, or a minimum number of shipments?",
    a: "None of the above. There's no contract, no setup fee, and no monthly minimum — you create an account and start comparing rates the same day. Pricing scales with what you actually ship, so it works whether you send 20 parcels a month or 2,000.",
  },
  {
    q: "I'm not technical. Do I need a developer to connect my store?",
    a: "No. ShipTime connects to Shopify, WooCommerce, and other major platforms in a few clicks — orders flow in, labels print, and tracking syncs back without anyone touching code. If you'd rather not integrate at all, you can paste in an order or key it manually and still get every rate.",
  },
  {
    q: "How does the automatic rate audit actually recover my money?",
    a: "Every carrier invoice you run through ShipTime is checked line by line against what you were quoted and the service you paid for. When we find a billing error, a duplicate charge, or a late guaranteed delivery, we file the claim and credit the recovery back to you — you don't lift a finger, and you keep money that would normally slip through.",
  },
  {
    q: "What if something goes sideways with a shipment — am I stuck with a chatbot?",
    a: "You get real people. Our Heroic Support team is one click away by phone, email, or chat to help with a stuck package, a freight claim, or a tracking question — no ticket-number runaround, no bots pretending to be agents.",
  },
  {
    q: "Can I bring the carrier rates I've already negotiated?",
    a: "Absolutely. With bring-your-own-rates, plug in the pricing you've already negotiated with UPS, FedEx, or Purolator and shop it side by side against ShipTime's rates on every shipment, so you always print the cheapest qualified label — yours or ours.",
  },
];

export default function ShipTimeFAQ({ background = ds.surface }: { background?: string }) {
  const [open, setOpen] = useState(0);

  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div
          className="relative overflow-hidden"
          style={{
            background: ds.navy,
            borderRadius: 28,
            border: `1px solid ${ds.navy}`,
            boxShadow: "0 30px 80px -40px rgba(28,30,61,0.6)",
          }}
        >
          {/* Faint grid texture, fading toward the bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right,rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.05) 1px,transparent 1px)",
              backgroundSize: "48px 54px",
              maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%,#000 50%,transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%,#000 50%,transparent 100%)",
            }}
          />

          <div className="relative px-6 py-12 md:px-14 md:py-16">
            {/* Header */}
            <Reveal className="text-center mb-9 md:mb-12">
              <p
                className="text-xs font-bold uppercase tracking-[0.12em] mb-3"
                style={{ color: ds.orange, ...sora }}
              >
                Got Questions
              </p>
              <h2
                className="mb-4"
                style={{ ...heading, color: ds.white, fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
              >
                Questions, answered
              </h2>
              <p
                className="mx-auto"
                style={{
                  ...inter,
                  fontSize: 16,
                  color: "rgba(255,255,255,0.6)",
                  maxWidth: 520,
                  lineHeight: 1.6,
                }}
              >
                Everything shippers ask before they make the switch — straight answers, no sales fluff.
              </p>
            </Reveal>

            {/* Accordion */}
            <div>
              {FAQS.map((item, i) => {
                const isOpen = i === open;
                return (
                  <div
                    key={i}
                    style={{
                      borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? -1 : i)}
                        aria-expanded={isOpen}
                        className="w-full flex items-start justify-between gap-5 text-left py-5 md:py-6 group"
                        style={{ cursor: "pointer", background: "transparent", border: "none" }}
                      >
                        <span
                          style={{
                            ...sora,
                            fontWeight: isOpen ? 700 : 600,
                            fontSize: "clamp(0.98rem, 1.7vw, 1.12rem)",
                            color: ds.white,
                            lineHeight: 1.4,
                            transition: "color 0.2s ease",
                          }}
                        >
                          {item.q}
                        </span>
                        <span
                          aria-hidden="true"
                          className="flex-shrink-0"
                          style={{
                            position: "relative",
                            width: 26,
                            height: 26,
                            marginTop: 2,
                            borderRadius: 999,
                            background: isOpen ? ds.orange : "rgba(255,255,255,0.08)",
                            border: `1px solid ${isOpen ? ds.orange : "rgba(255,255,255,0.15)"}`,
                            transition: "background 0.25s ease, border-color 0.25s ease, transform 0.3s ease",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        >
                          {/* horizontal bar */}
                          <span
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              width: 11,
                              height: 2,
                              borderRadius: 2,
                              background: isOpen ? ds.white : ds.orangeSoft,
                              transform: "translate(-50%,-50%)",
                              transition: "background 0.25s ease",
                            }}
                          />
                          {/* vertical bar — collapses when open to form a minus */}
                          <span
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              width: 2,
                              height: 11,
                              borderRadius: 2,
                              background: isOpen ? ds.white : ds.orangeSoft,
                              transform: `translate(-50%,-50%) scaleY(${isOpen ? 0 : 1})`,
                              transition: "transform 0.25s ease, background 0.25s ease",
                            }}
                          />
                        </span>
                      </button>
                    </h3>

                    {/* Collapsible answer */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        opacity: isOpen ? 1 : 0,
                        transition: "grid-template-rows 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease",
                      }}
                    >
                      <div style={{ overflow: "hidden" }}>
                        <p
                          style={{
                            ...inter,
                            fontSize: 15,
                            lineHeight: 1.65,
                            color: "rgba(255,255,255,0.7)",
                            paddingBottom: 24,
                            paddingRight: 36,
                            margin: 0,
                          }}
                        >
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
