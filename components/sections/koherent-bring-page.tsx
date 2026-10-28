"use client";

import type { ReactNode } from "react";
import { INTEGRATIONS, LogoChip } from "./koherent-logos";
import { KB_CSS, NetworkMap, RateCard, RateSwitches, ShipletScreen } from "./koherent-bring";
import { BlockScroller, type Block } from "./koherent-scroller";
import { K, K_ARROW, K_BAR, mono, sans, title } from "./koherent-brand";

// ── The What we bring page's scroller: six blocks, a widget each ─────────────
// Matteo (Oct 28): the page read like a blog; make it text one side, a widget
// the other, scrolling like ShipTime Core's. The widgets are the bento's,
// exported from koherent-bring.tsx, so the home page and this page show the
// same things. Copy is the page's as before (Michael's six blocks, the
// Strategic Account Support overview for people).

// The live /dashboard mockup, where the Koherent example account (Alder &
// Stone) shows Shiplets at work: Michael (Aug 6) wanted the custom dashboard
// with Shiplets shown as a deliverable, with an example.
const EXAMPLE_ACCOUNT = "https://lp.shiptime.com/dashboard";

function Panel({ children, dark = false, pad = 22 }: { children: ReactNode; dark?: boolean; pad?: number }) {
  return (
    <div data-k-dark={dark ? "" : undefined} style={{ background: dark ? K.ink : K.card, border: `1px solid ${dark ? K.ink : K.line}`, borderRadius: 8, padding: pad, boxShadow: "0 30px 60px -36px rgba(23,16,28,0.45)" }}>
      {children}
    </div>
  );
}

// The integrations as a wall of the real marks, the API as the last chip.
function IntegrationsWall() {
  return (
    <Panel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {INTEGRATIONS.map((l, i) => (
          <LogoChip key={l.name} {...l} height={22} className="kb-step" style={{ height: 46, padding: "0 18px", ["--i" as string]: `${i * 110}ms` }} />
        ))}
        {["+ 30 more", "Open API"].map((t, i) => (
          <span key={t} className="kb-step" style={{ ...sans, display: "inline-flex", alignItems: "center", height: 46, fontSize: 14, fontWeight: 600, color: t === "Open API" ? K.paper : K.stone, background: t === "Open API" ? K.plum : "transparent", border: t === "Open API" ? `1px solid ${K.plum}` : `1px dashed ${K.lilac}`, borderRadius: 999, padding: "0 18px", ["--i" as string]: `${(INTEGRATIONS.length + i) * 110}ms` }}>
            {t}
          </span>
        ))}
      </div>
      <p style={{ ...mono, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: K.stone, margin: "18px 0 0" }}>Your stores, ERP, warehouse system, carriers and finance tools, talking to each other</p>
    </Panel>
  );
}

// The account team and the support lines, as the card a customer would see.
function TeamCard() {
  const roles: [string, string][] = [
    ["Account manager", "Owns the relationship. One call for anything."],
    ["Operator on the ground", "At your sites, in the daily rhythm."],
    ["Support lead", "Customer service, technical, logistics."],
  ];
  const lines: [string, string][] = [
    ["Critical issue", "A person within 30 minutes, updates hourly"],
    ["Daily note", "What we did yesterday, what needs you"],
    ["Reviews", "Performance, costs, seasonal readiness"],
  ];
  return (
    <Panel dark pad={0}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${K.darkLine}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 700, color: K.onDark }}>
          <span style={{ width: 22, height: 22, flex: "none", background: K.plum, borderRadius: 5, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 12 12" style={{ width: 11, height: 11 }} aria-hidden>
              <path d={K_BAR} fill={K.paper} />
              <path d={K_ARROW} fill={K.paper} />
            </svg>
          </span>
          Your account team
        </span>
        <span style={{ ...mono, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: K.lilac }}>Named when you join</span>
      </div>
      <div style={{ padding: "6px 20px" }}>
        {roles.map(([r, d], i) => (
          <div key={r} className="kb-step" style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderTop: i ? `1px solid ${K.darkLine}` : "none", ["--i" as string]: `${i * 140}ms` }}>
            <span aria-hidden style={{ width: 36, height: 36, flex: "none", borderRadius: "50%", background: "rgba(199,174,230,0.18)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 12 12" style={{ width: 14, height: 14 }}>
                <path d={K_BAR} fill={K.lilac} />
                <path d={K_ARROW} fill={K.lilac} />
              </svg>
            </span>
            <span style={{ minWidth: 0 }}>
              <span style={{ ...sans, display: "block", fontSize: 14.5, fontWeight: 700, color: K.onDark }}>{r}</span>
              <span style={{ ...sans, display: "block", fontSize: 13, color: K.onDarkDim }}>{d}</span>
            </span>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(246,243,238,0.06)", borderTop: `1px solid ${K.darkLine}`, padding: "12px 20px 14px", display: "grid", gap: 8 }}>
        {lines.map(([k, v], i) => (
          <div key={k} className="kb-step" style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 12, alignItems: "baseline", ["--i" as string]: `${(i + 3) * 140}ms` }}>
            <span style={{ ...mono, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: K.lilac }}>{k}</span>
            <span style={{ ...sans, fontSize: 13.5, color: K.onDark }}>{v}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

const BLOCKS: Block[] = [
  {
    id: "carriers",
    n: "01",
    name: "Integrated carriers",
    line: "National and regional couriers, last-mile partners, LTL and FTL, compared on every shipment for cost and speed.",
    points: [
      "Nothing goes out on a default carrier by habit.",
      "Last-mile partners and direct injection into local markets, so parcels enter the local network close to the customer.",
      "Freight can go to the spot market: carriers bid, and you book the price that wins.",
      "Customs across the Canada–US border, both ways.",
    ],
    widget: (
      <Panel dark>
        <p style={{ ...title, fontSize: "1.1rem", color: K.onDark, margin: "0 0 14px" }}>Every shipment, every carrier, compared.</p>
        <RateCard />
      </Panel>
    ),
  },
  {
    id: "rates",
    n: "02",
    name: "Discounted rates",
    line: "Our buying power, passed through to you. Bring your own contracts too: we compare yours and ours on every shipment, and the best value wins.",
    points: [
      "Rates backed by more than two million shipments a year.",
      "One invoice for parcel and freight, with the landed cost up front.",
    ],
    widget: (
      <div data-k-dark="" style={{ background: K.plum, borderRadius: 8, padding: 22, boxShadow: "0 30px 60px -36px rgba(23,16,28,0.6)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
          <span style={{ ...mono, fontSize: "clamp(2rem, 3vw, 2.6rem)", fontWeight: 500, lineHeight: 1, color: K.onDark }}>2M+</span>
          <span style={{ ...sans, fontSize: 14, color: K.lilac }}>shipments a year behind your rates</span>
        </div>
        <RateSwitches />
      </div>
    ),
  },
  {
    id: "warehouses",
    n: "03",
    name: "A warehouse network",
    line: "Certified partner warehouses in Canada and the US. We don't own them, so we pick the right ones for you, and we answer for their results.",
    points: [
      "800 warehouses in our network to design your solution with.",
      "We watch each site's performance every day, from receiving to pick-and-pack to on-time dispatch, and we're accountable to you for it.",
      "Inventory placed by where your customers are, not by where a warehouse has space.",
      "Each order shipped from the site that wins on cost and speed.",
    ],
    widget: (
      <Panel>
        <NetworkMap />
      </Panel>
    ),
  },
  {
    id: "integrations",
    n: "04",
    name: "The integration library",
    line: "Shopify, Amazon, NetSuite, QuickBooks and 30 more, plus an open API for anything else you run.",
    points: [
      "Nothing gets ripped out. What you have starts talking to each other.",
      "A full API for teams that build: rating, booking, tracking and documents.",
      "Analytics on every shipment: cost per lane, carrier performance and exceptions, each scored against what it should have cost.",
      "AI helps with carrier choice, exception alerts and the written reports. It suggests, your team approves, and every action is logged.",
      "Your data is yours. It's used only to run and improve your own network, and it's never shared with other customers.",
    ],
    widget: <IntegrationsWall />,
  },
  {
    id: "shiplets",
    n: "05",
    name: "Shiplets",
    tag: "Rolling out",
    line: "Small custom apps for the one workflow that's yours alone, built in days on the same platform.",
    points: [
      "They read the same data as everything else, so switching one on never means another integration.",
      "They follow the rules your team set, everywhere at once.",
      "Each one starts by suggesting. It acts on its own only once it has proven right, and every action is logged.",
      "Labels and shipments generated from any system or form, including ones that aren't integrated.",
      "One example: a “send a job” page that lets the store counters of two national retail chains ship to one workshop in a few clicks.",
    ],
    link: { href: EXAMPLE_ACCOUNT, label: "See Shiplets in the example account" },
    widget: (
      <div style={{ background: K.mist, borderRadius: 8, padding: 22 }}>
        <ShipletScreen />
      </div>
    ),
  },
  {
    id: "people",
    n: "06",
    name: "People and support",
    line: "A named account manager who owns the relationship, with direct access to the people behind them. One partner accountable for the whole network.",
    points: [
      "One point of accountability: you never chase carriers, warehouses or technology providers yourself. We take the issue, own it and keep you informed until it's resolved.",
      "Direct lines to customer service, technical support and logistics operations, and a critical-incident channel for the big ones.",
      "Regular reviews of delivery performance, costs, recurring issues and seasonal readiness, on a cadence we agree together.",
      "Behind them, logistics engineers who model your operation and design your network.",
    ],
    widget: <TeamCard />,
  },
];

export const BRING_INDEX = BLOCKS.map((b) => ({ id: b.id, label: b.name }));

export function BringScroller() {
  return (
    <>
      <BlockScroller blocks={BLOCKS} />
      <style>{KB_CSS}</style>
    </>
  );
}
