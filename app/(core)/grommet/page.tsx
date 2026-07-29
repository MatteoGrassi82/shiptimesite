import type { Metadata } from "next";
import GrommetClient, { type OfferVariant } from "@/components/ui/grommet-client";

// ShipTime x Grommet co-marketing lander. Grommet's automated emails point here
// (pre-launch, post-launch, and Product of the Week winner). The winner emails
// append ?src=winner to swap the incentive block.
//
// noindex: this is a partner-only destination, not something we want competing
// with our own pages in search.
export const metadata: Metadata = {
  title: "The New Brand Shipping Readiness Checklist | ShipTime × Grommet",
  description:
    "10 questions to answer before your first order ships. A free checklist from ShipTime for Grommet brands, plus shipping credit when you sign up.",
  robots: "noindex",
};

export default async function GrommetPage({ searchParams }: PageProps<"/grommet">) {
  const { src } = await searchParams;
  // Resolved on the server so winners never see the default offer flash first.
  const variant: OfferVariant = src === "winner" ? "winner" : "default";
  return <GrommetClient variant={variant} />;
}
