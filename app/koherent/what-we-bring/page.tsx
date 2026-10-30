import type { Metadata } from "next";
import { Reveal } from "@/components/ui/reveal";
import { NetworkLattice } from "@/components/sections/koherent-lattice";
import { CountUp } from "@/components/sections/koherent-fx";
import { BringScroller } from "@/components/sections/koherent-bring-page";
import { inner, K, KoherentShell, Label, PAGES, ScoreClose, Sect, Steps, display, mono, sans } from "@/components/sections/koherent-ui";

// /koherent/what-we-bring — Michael's six building blocks (email "New
// website", Oct 19), each with what it means for the customer.
//   - Hero: the network itself, Michael's lattice under the heading, then the
//     three numbers (Matteo, Oct 28: the network section was the good part).
//   - The blocks: text on the left, a widget pinned on the right that changes
//     as you scroll (koherent-bring-page.tsx), the way ShipTime Core's did.
//     Each widget is the bento's, so the home page and this page agree.

export const metadata: Metadata = {
  title: "What we bring",
  description: "Carriers, rates, warehouses, integrations, custom shipping applets and people: the building blocks we design with, already connected.",
};

const STATS: [string, string][] = [
  ["2M+", "shipments managed a year"],
  ["1,000+", "businesses on the platform"],
  ["20 years", "in shipping and logistics, and hundreds more across our team"],
];

export default function KoherentWhatWeBringPage() {
  return (
    <KoherentShell>
      {/* the hero is the network (Matteo, Oct 28: "Our network is good", the
          six-block stack wasn't): the heading over Michael's lattice, then the
          three numbers behind it */}
      <Sect bg={K.ink}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(48px, 6vw, 88px) clamp(20px, 4vw, 56px) 0", textAlign: "center" }}>
          <Reveal style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <Steps total={4} done={1} size={13} onDark />
            <Label onDark>What we bring</Label>
          </Reveal>
          <h1 className="k-fade" style={{ ...display, fontSize: "clamp(2.5rem, 5.4vw, 4.4rem)", color: K.onDark, margin: "20px auto 0", maxWidth: "18ch", animationDelay: "0.08s" }}>
            Six building blocks, one network.
          </h1>
          <p className="k-fade" style={{ ...sans, fontSize: "clamp(1.05rem, 1.35vw, 1.2rem)", lineHeight: 1.6, color: K.onDarkDim, margin: "20px auto 0", maxWidth: "52ch", animationDelay: "0.16s" }}>
            Carriers, warehouses and your own systems, connected. Not what we sell, but what we design and run with: you use the blocks you need, and see all of it in one place.
          </p>
          <div className="k-fade" style={{ marginTop: "clamp(24px, 3vw, 40px)", animationDelay: "0.24s" }}>
            <NetworkLattice />
          </div>
        </div>
        <Reveal className="k-three" style={{ maxWidth: 1000, margin: "0 auto", padding: "clamp(28px, 3.5vw, 44px) clamp(20px, 4vw, 56px) clamp(40px, 5vw, 60px)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, textAlign: "center" }}>
          {STATS.map(([v, l]) => (
            <div key={l}>
              <div style={{ ...mono, fontSize: "clamp(2rem, 3.6vw, 2.8rem)", fontWeight: 500, lineHeight: 1, color: K.onDark }}><CountUp value={v} /></div>
              <p style={{ ...sans, fontSize: 15, color: K.onDarkDim, margin: "10px 0 0" }}>{l}</p>
            </div>
          ))}
        </Reveal>
      </Sect>

      {/* overflow visible: a clipping section would stop the widget pinning */}
      <Sect style={{ overflow: "visible" }}>
        <div style={{ ...inner, paddingTop: "clamp(16px, 2vw, 32px)", paddingBottom: "clamp(40px, 5vw, 64px)" }}>
          <BringScroller />
        </div>
      </Sect>

      <ScoreClose next={{ href: PAGES.how, name: "How we work" }} />
    </KoherentShell>
  );
}
