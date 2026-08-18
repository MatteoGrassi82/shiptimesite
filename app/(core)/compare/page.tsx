import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import ComparePage from "@/components/ui/compare-page";

export const metadata: Metadata = {
  title: "Compare ShipTime vs Freightcom, eShipper & ShipStation | ShipTime",
  description:
    "Freightcom, eShipper, ShipStation, or ShipTime: platform fees, whose rates you can use, courier + LTL coverage, and who answers the phone. All four side by side.",
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "Compare ShipTime vs Freightcom, eShipper & ShipStation | ShipTime",
    description:
      "The differences that lower your true cost of shipping: no platform fee, your own rates in every quote, courier + LTL in one place, and support that answers in 26 seconds.",
    type: "website",
  },
};

// Same portrait hero photo used on the /vs and /alternative pages, so the
// hub reads as one family rather than a one-off.
function resolveImages(): Record<string, string | null> {
  const hero = "generated/alt-hero.png";
  return {
    hero: existsSync(join(process.cwd(), "public", hero)) ? `/${hero}` : null,
  };
}

export default function Page() {
  return <ComparePage images={resolveImages()} />;
}
