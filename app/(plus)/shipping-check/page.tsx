import type { Metadata } from "next";
import ShippingCheck from "@/components/shipping-check/ShippingCheck";

// ── /shipping-check — the Shipping Check prototype ───────────────────────────
// The onboarding product from the product strategy (connect your data → AI
// first pass → a person signs off → a report that recommends the right step).
// Clickable, sample company, illustrative numbers. Lives in the ShipTime One
// zone for its tokens; noindex until it's a real product.

export const metadata: Metadata = {
  title: "Shipping Check | ShipTime",
  description: "See what your shipping should cost: connect your store or invoices and get a report on what you pay, what you could save, and the setup we'd recommend.",
  robots: "noindex",
};

export default function ShippingCheckPage() {
  return <ShippingCheck />;
}
