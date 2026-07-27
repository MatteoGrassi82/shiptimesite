import { PlusHero } from "./plus-home-client";
import { ProofStats } from "@/components/plus-home/ProofStats";
import { ClientFeedback } from "@/components/plus-home/testimonial";
import { FeatureCarousel } from "@/components/plus-home/FeatureCarousel";
import { PlusCapabilities } from "@/components/plus-home/PlusCapabilities";
import { CompassDashboard } from "@/components/plus-home/CompassDashboard";
import { Workflows } from "@/components/plus-home/Workflows";
import { Integrations } from "@/components/plus-home/Integrations";
import { SafetyStack } from "@/components/plus-home/safety-stack";
import { AskAiAboutShipTime } from "@/components/plus-home/AskAiAboutShipTime";
import { FinalCTA } from "@/components/plus-home/FinalCTA";

// The Plus homepage — the proven section arc from the old shiptime-plus repo
// (Hana design), ported into the zone as components/plus-home/*. Only the hero
// is local (same globe/stat-card composition, master-doc copy) and the film
// carousel replaces the old dark "three films" dev preview so the whole page
// speaks one style. An editor can still override via a Sanity "home" page.
export async function PlusHome() {
  return (
    <>
      {/* §1 — HERO (globe + proof stats, "Your logistics, on autopilot.") */}
      <PlusHero />

      {/* §2 — THE MOAT (20 years / $85M callout) */}
      <ProofStats />

      {/* §3 — PROOF (testimonial bento) */}
      <ClientFeedback />

      {/* §4 — FEATURE VIDEOS (Remotion: workflow / ShipAudit / order context) */}
      <FeatureCarousel />

      {/* §5 — THE PLUS CAPABILITIES (sticky-scroll) */}
      <PlusCapabilities />

      {/* §6 — THE DASHBOARD (Compass shipping-ops dashboard) */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              One system
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Your whole network, <span className="italic">on one screen.</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Shipments, carriers, freight, and recovered spend — the operating
              picture a dedicated account lead runs with you.
            </p>
          </div>
          <CompassDashboard />
        </div>
      </section>

      {/* §7 — WORKFLOWS */}
      <Workflows />

      {/* §8 — INTEGRATIONS */}
      <Integrations />

      {/* §9 — MARGIN PROTECTION (layered stack) */}
      <SafetyStack />

      {/* §10 — ASK AI ABOUT SHIPTIME */}
      <AskAiAboutShipTime />

      {/* §11 — FINAL CTA (book a call) */}
      <FinalCTA />
    </>
  );
}
