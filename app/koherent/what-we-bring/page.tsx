import type { Metadata } from "next";
import { Reveal } from "@/components/ui/reveal";
import { ScrollIndex } from "@/components/sections/koherent-index";
import { NetworkLattice } from "@/components/sections/koherent-lattice";
import { CountUp } from "@/components/sections/koherent-fx";
import { LogoRow } from "@/components/sections/koherent-logos";
import { inner, K, KoherentShell, Label, PAGES, PageHead, ScoreClose, Sect, mono, sans, title } from "@/components/sections/koherent-ui";

// /koherent/what-we-bring — Michael's six building blocks (email "New
// website", Oct 19), in his order, each with what it means for the customer.
// The detail is what the old Plus pages said (platform, fulfillment,
// technology, shiplets), so this one page replaces four of them, and nothing
// here is new as a claim. The three numbers are the ones in the home bento.
// Each block leads with one fact (Shiplets has none worth showing yet), said
// once: the bullets add to it rather than repeat it. A sticky index
// (ScrollIndex) keeps the long page readable: where you are, and how much is
// left. Bullets are plain dashes, so the chevron steps only ever show progress.

export const metadata: Metadata = {
  title: "What we bring",
  description: "Carriers, rates, warehouses, integrations, Shiplets and people: the building blocks we design with, already connected.",
};

const STATS: [string, string][] = [
  ["2M+", "shipments managed a year"],
  ["1,000+", "businesses on the platform"],
  ["20 years", "in shipping and logistics, and hundreds more across our team"],
];

// The live /dashboard mockup, where the Koherent example account (Alder &
// Stone) shows Shiplets at work: Michael (Aug 6) wanted the custom dashboard
// with Shiplets shown as a deliverable, with an example.
const EXAMPLE_ACCOUNT = "https://lp.shiptime.com/dashboard";

const BLOCKS: { id: string; name: string; line: string; fact?: [string, string, string]; points: string[]; tag?: string; link?: { href: string; label: string } }[] = [
  {
    id: "carriers",
    name: "Integrated carriers",
    fact: ["3", "modes", "parcel, LTL and FTL, in one place"],
    line: "National and regional couriers, last-mile partners, LTL and FTL, compared on every shipment for cost and speed.",
    points: [
      "Nothing goes out on a default carrier by habit.",
      "Last-mile partners and direct injection into local markets, so parcels enter the local network close to the customer.",
      "Freight can go to the spot market: carriers bid, and you book the price that wins.",
      "Customs across the Canada–US border, both ways.",
    ],
  },
  {
    id: "rates",
    name: "Discounted rates",
    fact: ["1", "invoice", "for parcel and freight, with the landed cost up front"],
    line: "Our buying power, passed through to you.",
    points: [
      "Bring your own rates: we compare your contracts and ours on every shipment, and the best value wins.",
    ],
  },
  {
    id: "warehouses",
    name: "A warehouse network",
    fact: ["800", "warehouses", "in our network, to design your solution with"],
    line: "Certified partner warehouses in Canada and the US. We don't own them, so we pick the right ones for you, and we answer for their results.",
    points: [
      "We watch each site's performance every day, from receiving to pick-and-pack to on-time dispatch, and we're accountable to you for it.",
      "Inventory placed by where your customers are, not by where a warehouse has space.",
      "Each order shipped from the site that wins on cost and speed.",
      "One item, every location: allocation and restocking across sites without spreadsheets.",
    ],
  },
  {
    id: "integrations",
    name: "The integration library",
    fact: ["30+", "connections", "from Shopify to NetSuite and the tools in between"],
    line: "Shopify, Amazon, NetSuite, QuickBooks and 30 more.",
    points: [
      "Connects to what you already run: your stores, ERP, warehouse system, carrier accounts and finance tools.",
      "Nothing gets ripped out. What you have starts talking to each other.",
      "A full API for teams that build: rating, booking, tracking and documents.",
      "Analytics on every shipment: cost per lane, carrier performance and exceptions, each scored against what it should have cost.",
      "AI helps with carrier choice, exception alerts and the written reports. It suggests, your team approves, and every action is logged.",
      "Your data is yours. It's used only to run and improve your own network, and it's never shared with other customers.",
    ],
  },
  {
    id: "shiplets",
    name: "Shiplets",
    line: "Small custom apps for the one workflow that's yours alone, built in days on the same platform.",
    tag: "Rolling out",
    points: [
      "They read the same data as everything else, so switching one on never means another integration.",
      "They follow the rules your team set, everywhere at once.",
      "Each one starts by suggesting. It acts on its own only once it has proven right, and every action is logged.",
      "Labels and shipments generated from any system or form, including ones that aren't integrated.",
      "One example: a “send a job” page that lets the store counters of two national retail chains ship to one workshop in a few clicks.",
    ],
    link: { href: EXAMPLE_ACCOUNT, label: "See Shiplets in the example account" },
  },
  {
    id: "people",
    name: "People and support",
    fact: ["1", "accountable partner", "for the whole network: carriers, warehouses, technology and people"],
    line: "A named account manager who owns the relationship, with direct access to the people behind them.",
    // from the Strategic Account Support & Service Overview (Michael, Oct 27)
    points: [
      "One point of accountability: you never chase carriers, warehouses or technology providers yourself. We take the issue, own it and keep you informed until it's resolved.",
      "Direct lines to customer service, technical support and logistics operations, and a critical-incident channel for the big ones.",
      "Typical response targets by priority: a person on a critical issue within 30 minutes, with updates every hour until it's fixed.",
      "Regular reviews of delivery performance, costs, recurring issues and seasonal readiness, on a cadence we agree together.",
      "Experts on the ground at your sites, and a daily rhythm with your team.",
      "Behind them, logistics engineers who model your operation and design your network.",
    ],
  },
];

export default function KoherentWhatWeBringPage() {
  return (
    <KoherentShell>
      {/* Michael's lattice (Oct 19) is the hero object: the network of
          carriers, warehouses and the customer's systems we design with */}
      <PageHead
        chapter={1}
        label="What we bring"
        heading={<>Six building blocks. Use the ones you need.</>}
        lead="Carriers, warehouses and your own systems, connected into one network you can see in one place."
        aside={
          <div data-k-dark="" style={{ background: K.ink, borderRadius: 8, padding: "clamp(14px, 1.8vw, 22px) clamp(10px, 1.4vw, 18px)", overflow: "hidden" }}>
            <Label onDark style={{ fontSize: 11.5, paddingLeft: 8 }}>Our network</Label>
            <div style={{ marginTop: 6 }}>
              <NetworkLattice compact />
            </div>
          </div>
        }
      />

      {/* the three numbers behind the network */}
      <Sect bg={K.ink}>
        <Reveal className="k-three" style={{ maxWidth: 1000, margin: "0 auto", padding: "clamp(36px, 4.5vw, 52px) clamp(20px, 4vw, 56px)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, textAlign: "center" }}>
          {STATS.map(([v, l]) => (
            <div key={l}>
              <div style={{ ...mono, fontSize: "clamp(2rem, 3.6vw, 2.8rem)", fontWeight: 500, lineHeight: 1, color: K.onDark }}><CountUp value={v} /></div>
              <p style={{ ...sans, fontSize: 15, color: K.onDarkDim, margin: "10px 0 0" }}>{l}</p>
            </div>
          ))}
        </Reveal>
      </Sect>

      {/* overflow visible: a clipping section would stop the index sticking */}
      <Sect style={{ overflow: "visible" }}>
        <div className="k-indexed" style={{ ...inner, paddingTop: "clamp(56px, 7vw, 96px)", display: "grid", gridTemplateColumns: "240px 1fr", gap: "clamp(32px, 5vw, 72px)", alignItems: "start" }}>
          <ScrollIndex items={BLOCKS.map((b) => ({ id: b.id, label: b.name }))} />
          <div>
            {BLOCKS.map((b, i) => (
              <section key={b.id} id={b.id} style={{ scrollMarginTop: 96, padding: i ? "clamp(40px, 5vw, 64px) 0" : "0 0 clamp(40px, 5vw, 64px)", borderTop: i ? `1px solid ${K.line}` : "none" }}>
                <Reveal>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <Label>{String(i + 1).padStart(2, "0")} of 06</Label>
                    {b.tag && (
                      <span style={{ ...mono, fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: K.plum, background: K.mist, borderRadius: 3, padding: "3px 7px" }}>{b.tag}</span>
                    )}
                  </div>
                  <div className="k-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px, 4vw, 56px)", marginTop: 16, textAlign: "left" }}>
                    <div>
                      <h2 style={{ ...title, fontSize: "clamp(2rem, 3.4vw, 2.7rem)", color: K.ink, margin: 0 }}>{b.name}</h2>
                      <p style={{ ...sans, fontSize: "clamp(1.02rem, 1.3vw, 1.12rem)", lineHeight: 1.6, color: K.stone, margin: "12px 0 0", maxWidth: "36ch" }}>{b.line}</p>
                      {b.id === "integrations" && <LogoRow more="+ 30 more" style={{ marginTop: 18 }} />}
                      {b.fact && (
                        <div style={{ marginTop: 26, paddingTop: 18, borderTop: `2px solid ${K.plum}`, maxWidth: 300 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                            <CountUp value={b.fact[0]} style={{ ...mono, fontSize: "clamp(2.4rem, 3.9vw, 3.1rem)", fontWeight: 500, lineHeight: 1, color: K.plum }} />
                            <span style={{ ...title, fontSize: "clamp(1.15rem, 1.6vw, 1.35rem)", color: K.plum }}>{b.fact[1]}</span>
                          </div>
                          <p style={{ ...sans, fontSize: 14.5, lineHeight: 1.5, color: K.stone, margin: "8px 0 0" }}>{b.fact[2]}</p>
                        </div>
                      )}
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16, alignContent: "start" }}>
                      {b.points.map((p) => (
                        <li key={p} style={{ ...sans, display: "flex", gap: 12, fontSize: 16, lineHeight: 1.6, color: K.ink }}>
                          <span aria-hidden style={{ width: 10, height: 2, background: K.plum, flex: "none", marginTop: 12 }} />
                          {p}
                        </li>
                      ))}
                      {b.link && (
                        <li style={{ marginTop: 4 }}>
                          <a href={b.link.href} className="k-more" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 7, fontSize: 15, fontWeight: 700, color: K.plum, textDecoration: "none" }}>
                            {b.link.label} &rarr;
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </Reveal>
              </section>
            ))}
          </div>
        </div>
      </Sect>

      <ScoreClose next={{ href: PAGES.how, name: "How we work" }} />
      <style>{`@media (max-width: 960px) { .k-indexed { grid-template-columns: 1fr !important; } }`}</style>
    </KoherentShell>
  );
}
