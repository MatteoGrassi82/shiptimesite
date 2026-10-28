import type { Metadata } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";

// /koherent — first revision of the enterprise site under the Koherent name,
// replacing ShipTime One (Oct 22 L10). Built from /plus/v3, Michael's notes on
// it (email "New website", Oct 19), the brand deck "Make it coherent." (Oct 22)
// and Chris's positioning (Oct 22). Noindexed: it's a review draft for Michael
// and Chris, not a launch.
//
// The deck's two fonts are scoped to these pages, so nothing else on the site
// changes: Schibsted Grotesk for everything, JetBrains Mono for numbers and
// labels.
const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Koherent · Your managed logistics network", template: "%s · Koherent" },
  description:
    "Koherent is the managed logistics network that brings carriers, warehouses and data into one coherent operation, run with you by people who know logistics.",
  robots: "noindex",
};

export default function KoherentLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${schibsted.variable} ${jetbrains.variable}`}>{children}</div>;
}
