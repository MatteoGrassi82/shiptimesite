import type { Metadata } from "next";
import { HeroLab } from "@/components/sections/koherent-hero-lab";
import { KoherentShell } from "@/components/sections/koherent-ui";

// /koherent/lab — three hero directions for Matteo to pick from (Oct 28).
// Temporary: removed once a direction is chosen, like the Oct 23 lab. The
// layout's noindex covers it.

export const metadata: Metadata = { title: "Hero lab", robots: "noindex" };

const IMAGES = [
  { src: "/generated/koherent-hero-a.webp", name: "Fulfillment aisle at dusk (new)" },
  { src: "/generated/koherent-hero-b.webp", name: "Sorting floor from above (new)" },
  { src: "/generated/koherent-bring-carriers-a.webp", name: "Loading dock (from the bento)" },
  { src: "/generated/pf-proof-campaign.webp", name: "Packing line (Parcel Forum)" },
];

export default function KoherentLabPage() {
  return (
    <KoherentShell>
      <HeroLab images={IMAGES} />
    </KoherentShell>
  );
}
