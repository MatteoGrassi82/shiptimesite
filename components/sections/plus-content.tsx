import type { FeatureRow } from "./plus-blocks";
import { ImageSlot } from "./plus-mocks";

// Shared content data for the coded Plus pages — the feature-row copy paired
// with its product mock. Kept out of the page files so the homepage and the
// deeper pages can draw from the same source and stay consistent.

// Homepage: platform breadth at a glance.
export const PLATFORM_ROWS: FeatureRow[] = [
  {
    eyebrow: "Every mode, every carrier",
    title: "One brain deciding what moves how.",
    subhead: "Courier to ocean, parcel to full truckload.",
    body: "Every carrier and every mode — rate-shopped automatically on one screen. Bring your own negotiated rates and we shop them against ours on every shipment, so you always pay the lowest qualified price.",
    visual: <ImageSlot src="/generated/plus-iso-rateshop.png" label="Multi-carrier rate shop" />,
  },
  {
    eyebrow: "Freight brokerage",
    title: "The spot market, one button away.",
    subhead: "Your quote: $450. The market's quote: $375.",
    body: "Punch in an LTL shipment for an instant rate, then send it to the spot board. Carriers bid, and within about an hour you have a market-tested price. Book whichever wins.",
    visual: <ImageSlot src="/generated/plus-iso-spot.png" label="Spot-market bidding" />,
  },
  {
    eyebrow: "Fulfillment",
    title: "Fulfilled from the node that wins.",
    subhead: "Inventory placed by demand, not warehouse capacity.",
    body: "Your inventory lives in our certified partner network. Every order ships from the location that wins on end-to-end cost and speed — from our Toronto node alone, 7 million people are reachable same-day.",
    visual: <ImageSlot src="/generated/plus-iso-inventory.png" label="Fulfillment node network" />,
  },
];

// LOS page: the three-phase story as full feature rows.
export const LOS_ROWS: FeatureRow[] = [
  {
    eyebrow: "Phase 1 — Unify",
    title: "First, one source of truth.",
    body: "We connect your existing stack — ERP, e-commerce platforms, carrier accounts, warehouse systems — into a single data layer. We're not asking you to replace anything; we orchestrate what you have. Then the part no software does: we sit with the people who actually run your shipping and capture the intelligence that exists only in their heads.",
    visual: <ImageSlot src="/generated/plus-iso-unify.png" label="Unify — one data layer" />,
  },
  {
    eyebrow: "Phase 2 — Apply intelligence",
    title: "Then, your data starts working.",
    body: "With one foundational layer, we build custom AI on the context of your business and point it at the highest-pressure improvements first.",
    bullets: [
      "Lane and mode optimization — where LTL should be zone-skipped, where courier should be freight",
      "Exception prediction — the failures you'd otherwise discover from angry emails, flagged early",
      "Cost intelligence — every shipment scored against what it should have cost",
    ],
    visual: <ImageSlot src="/generated/plus-iso-intelligence.png" label="Intelligence — recommendations" />,
  },
  {
    eyebrow: "Phase 3 — Autopilot",
    title: "Finally, it runs itself.",
    body: "Workflow by workflow, decisions move from your team's plate to the system: booking, carrier selection, routing, documentation, exception handling. We don't hand over and disappear — your Logistics Success Manager stays embedded until every workflow is solid.",
    visual: <ImageSlot src="/generated/plus-iso-autopilot.png" label="Autopilot — running workflows" />,
  },
];

// Platform page: the capability rows.
export const PLATFORM_PAGE_ROWS: FeatureRow[] = [
  {
    eyebrow: "Multimodal",
    title: "Courier, LTL, FTL, ocean.",
    subhead: "Most platforms do parcels. Your business doesn't stop there.",
    body: "Plus runs every mode in one place — so a pallet, a container, and a box get the same rate discipline, the same visibility, the same system. Within each mode, every carrier you use (and the ones you should) is rate-shopped automatically.",
    visual: <ImageSlot src="/generated/plus-iso-rateshop.png" label="Multi-carrier rate shop" />,
  },
  {
    eyebrow: "Freight brokerage",
    title: "Your quote: $450. The market's: $375.",
    subhead: "When you have time, you have leverage. Now you have both.",
    body: "Punch in an LTL shipment and get an instant rate. Then hit one more button: your shipment goes to the spot board, carriers bid, and within about an hour you have a market-tested price. Book whichever wins.",
    visual: <ImageSlot src="/generated/plus-iso-spot.png" label="Spot-market bidding" />,
  },
  {
    eyebrow: "Intelligence",
    title: "Operational intelligence on your own data.",
    subhead: "The numbers your next negotiation needs.",
    body: "Cost per lane, mode mix, carrier performance, exception rates — scored against what each shipment should have cost. Every overcharge surfaced, every renegotiation backed by data.",
    visual: <ImageSlot src="/generated/plus-iso-intelligence.png" label="Intelligence — recommendations" />,
  },
];
