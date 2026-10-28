import type { Metadata } from "next";
import { Reveal } from "@/components/ui/reveal";
import { NetworkLattice } from "@/components/sections/koherent-lattice";
import { CountUp } from "@/components/sections/koherent-fx";
import { BringHeroStack, BringScroller } from "@/components/sections/koherent-bring-page";
import { inner, K, KoherentShell, Label, PAGES, PageHead, ScoreClose, Sect, mono, sans, title } from "@/components/sections/koherent-ui";

// /koherent/what-we-bring — Michael's six building blocks (email "New
// website", Oct 19), each with what it means for the customer.
//   - Hero: the six blocks as a stack you can jump from (Matteo, Oct 28: the
//     lattice was better as a section, so it's the band under the hero).
//   - The network band: Michael's lattice, then the three numbers.
//   - The blocks: text on the left, a widget pinned on the right that changes
//     as you scroll (koherent-bring-page.tsx), the way ShipTime Core's did.
//     Each widget is the bento's, so the home page and this page agree.

export const metadata: Metadata = {
  title: "What we bring",
  description: "Carriers, rates, warehouses, integrations, Shiplets and people: the building blocks we design with, already connected.",
};

const STATS: [string, string][] = [
  ["2M+", "shipments managed a year"],
  ["1,000+", "businesses on the platform"],
  ["20 years", "in shipping and logistics, and hundreds more across our team"],
];

export default function KoherentWhatWeBringPage() {
  return (
    <KoherentShell>
      <PageHead
        chapter={1}
        label="What we bring"
        heading={<>Six building blocks. Use the ones you need.</>}
        lead="Not what we sell, but what we design and run with. We connect the blocks you need into a single network, and you see all of it in one place."
        aside={<BringHeroStack />}
      />

      {/* Michael's lattice (Oct 19): the network of carriers and warehouses we
          design with, then the three numbers behind it */}
      <Sect bg={K.ink}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(48px, 6vw, 80px) clamp(20px, 4vw, 56px) 0", textAlign: "center" }}>
          <Label onDark>Our network</Label>
          <p style={{ ...title, fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)", color: K.onDark, margin: "14px auto 0", maxWidth: "30ch" }}>
            Carriers, warehouses and your own systems, connected into one network.
          </p>
          <div style={{ marginTop: "clamp(24px, 3vw, 40px)" }}>
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
