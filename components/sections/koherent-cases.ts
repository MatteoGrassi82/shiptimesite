// ── The three cases on /koherent and /koherent/case-studies ──────────────────
// Anonymized (Oct 25): none of these is signed or live, and Michael asked for
// them "less specific" until we've proven the work (email "New website",
// Oct 19). Behind them, for us only: the golf brand is PG Golf, the
// promotional company is InnoWave, the dental lab is Plak-IT.
//
// The detail follows Michael's case format (email "Case study – proof",
// Sep 15): the business, the demand, what we designed, where it stands, how
// it grows, what's tracked. Where things moved on since (InnoWave now starts
// at its own dock, Oct), the latest plan wins. Only the golf brand shows a
// figure, as v3 always did: $25.00 → $13.22 per shipment, from the proposal,
// labelled proposed. PG Golf's "~$600K a year" stays out: its real volume is a
// fraction of the model behind it. The promotional company's "5× in a year"
// stays out too, because its volume has come down since.

export type Case = {
  id: string;
  sector: string;
  shape: string;
  short: string;
  figure?: { from: string; to: string; unit: string };
  status: string;
  detail: [string, string][];
};

export const CASES: Case[] = [
  {
    id: "entering-canada",
    sector: "US golf brand",
    shape: "Entering Canada",
    short: "Every order shipped from Texas at cross-border rates, with customs delays customers felt. We designed a phased entry, starting with bulk shipping into Canada.",
    figure: { from: "$25.00", to: "$13.22", unit: "delivered cost per shipment" },
    status: "Proposed, not yet realized",
    detail: [
      ["The business", "A US golf brand with a growing base of customers in Canada."],
      ["The goal", "Sell into Canada at a delivered cost that works. Every order was shipping from Texas at cross-border parcel rates, with customs delays reaching the customer."],
      ["What we designed", "A phased entry: bulk shipments into Canada first, then fulfillment from inside the country, then last-mile delivery, then the rest of our network as demand grows."],
      ["Where it stands", "Starting with bulk shipping into Canada. Every figure here is from our proposal."],
      ["What we'll track", "Delivered cost per shipment, days to the customer and customs holds, month by month."],
    ],
  },
  {
    id: "campaigns-to-consumers",
    sector: "Promotional company",
    shape: "Campaigns to consumers",
    short: "Gift boxes for its clients' campaigns, shipped to people's homes, each campaign with its own rules. We start at their own dock, then add a warehouse where the customers are.",
    status: "In design",
    detail: [
      ["The business", "A large promotional company running campaigns for its clients, with gift boxes shipped straight to consumers. Not an e-commerce brand, but a lot of orders going to people's homes."],
      ["The goal", "Deliver each client's campaign to people's homes at the lowest cost and time, with every campaign's own distribution rules met."],
      ["What we designed", "The right location and the right carriers, chosen to cut both the cost and the time to deliver."],
      ["Where it stands", "We start at their own dock on our platform, then add a warehouse from our partner network at the location we designed."],
      ["How it grows", "As the program grows, it becomes a multi-warehouse network that keeps lowering cost and delivery time. New campaigns get the same design work."],
      ["What we'll track", "One dashboard: cost per order, time in transit including processing and pick-and-pack, and exceptions, over time so the trend shows."],
    ],
  },
  {
    id: "cases-from-every-office",
    sector: "Dental lab",
    shape: "Cases from every office",
    short: "Dental offices send cases to the lab every day. We're building a simple “send a case” page on our network, so any office can ship in a few clicks.",
    status: "In design",
    detail: [
      ["The business", "A dental lab that receives cases from dental offices every day."],
      ["The goal", "Let any office send a case to the lab in a few clicks, without arranging its own shipping."],
      ["What we're building", "A “send a case” page on our network: an office opens a link or scans a code, and the label is ready in a few clicks."],
      ["Why it matters", "It's a Shiplet: a small app for the one workflow that's this lab's alone, built on the same platform as everything else."],
      ["What we'll track", "Cases sent by each office, and the days from office to lab."],
    ],
  },
];
