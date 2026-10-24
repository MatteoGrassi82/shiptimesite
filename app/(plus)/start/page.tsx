import type { Metadata } from "next";
import Onboarding from "@/components/onboarding/Onboarding";

// ── /start — signup and onboarding mockup ────────────────────────────────────
// The classic SaaS play (pricing → signup → questions → recommended plan → app
// home with a setup checklist), copied from ShipStation, Shippo, Shopify and
// Pirate Ship, plus what none of them do. A side mockup on sample data; it
// doesn't touch the real ShipTime app. Try ?ref=cfib for the partner path.

export const metadata: Metadata = {
  title: "Get started | ShipTime",
  description: "Start free, answer a few questions, and get the setup that fits how you ship.",
  robots: "noindex",
};

export default async function StartPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  return <Onboarding partnerRef={ref} />;
}
