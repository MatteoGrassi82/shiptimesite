import type { Metadata } from "next";
import Console from "@/components/console/Console";

// ── /dashboard — the ShipTime app as one SaaS product ────────────────────────
// Ship, Shiplets and Network in one switcher, Developers in every sidebar.
// Structure from ElevenLabs, look from Stripe's dashboard. Made-up company,
// sample data.

export const metadata: Metadata = {
  title: "Dashboard | ShipTime",
  description: "ShipTime dashboard mockup.",
  robots: "noindex",
};

export default function DashboardPage() {
  return <Console />;
}
