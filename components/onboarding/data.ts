// Sample data for the onboarding mockup (the classic SaaS play: pricing →
// signup → a few questions → recommended plan → app home with a checklist).
// Plans map to the staircase: ShipTime (step 1), Team (step 2), One (step 3).
// Prices and the advisor are illustrative.

export type PlanId = "free" | "team" | "one";

export const plans: {
  id: PlanId;
  name: string;
  forWho: string;
  price: { monthly: string; annual: string; note: string };
  cta: string;
  features: string[];
}[] = [
  {
    id: "free",
    name: "ShipTime",
    forWho: "For getting started",
    price: { monthly: "Free", annual: "Free", note: "You only pay for the labels you print" },
    cta: "Start free",
    features: [
      "Every carrier's rates side by side",
      "Labels, tracking and one bill",
      "Invoice audits and refunds",
      "Shopify and WooCommerce plugins",
      "1 user",
    ],
  },
  {
    id: "team",
    name: "ShipTime Team",
    forWho: "For growing businesses",
    price: { monthly: "$399", annual: "$349", note: "per month, plus shipping at our rates" },
    cta: "Start 14-day free trial",
    features: [
      "Everything in ShipTime",
      "Your own logistics advisor",
      "Customs done with the label",
      "Stuck parcels chased for you",
      "Monthly report: what you shipped, what it cost",
      "Up to 10 users and several locations",
      "Shiplets: a screen built for how you ship (add-on)",
    ],
  },
  {
    id: "one",
    name: "ShipTime One",
    forWho: "For businesses with several warehouses",
    price: { monthly: "Custom", annual: "Custom", note: "Setup, monthly fee and shipping" },
    cta: "Talk to sales",
    features: [
      "Everything in Team",
      "Your network designed and run with you",
      "Partner warehouses where your customers are",
      "Final mile for big and bulky",
      "NetSuite, EDI and API connections",
      "Control tower: answers, not dashboards",
    ],
  },
];

export type Option = { id: string; label: string; hint?: string };
export type Question = { id: "role" | "volume" | "ships" | "sources"; title: string; why: string; multi: boolean; options: Option[] };

export const questions: Question[] = [
  {
    id: "role",
    title: "What best describes you?",
    why: "So we show you the right setup, not every feature at once.",
    multi: false,
    options: [
      { id: "personal", label: "Just me", hint: "I ship now and then" },
      { id: "small", label: "A small business", hint: "One person does the shipping" },
      { id: "team", label: "A growing business", hint: "A few people ship, every day" },
      { id: "locations", label: "A company with several locations", hint: "Warehouses or stores in more than one place" },
    ],
  },
  {
    id: "volume",
    title: "How many parcels do you ship a month?",
    why: "We use this to get you the right rates and the right plan.",
    multi: false,
    options: [
      { id: "lt20", label: "Fewer than 20" },
      { id: "20-100", label: "20 to 100" },
      { id: "100-500", label: "100 to 500" },
      { id: "500-2000", label: "500 to 2,000" },
      { id: "2000+", label: "More than 2,000" },
    ],
  },
  {
    id: "ships",
    title: "What do you ship, and where?",
    why: "Cross-border and pallets change your setup: customs, duties, freight quotes.",
    multi: true,
    options: [
      { id: "ca", label: "Parcels in Canada" },
      { id: "us", label: "Parcels to the US" },
      { id: "intl", label: "Parcels overseas" },
      { id: "pallets", label: "Pallets or freight" },
    ],
  },
  {
    id: "sources",
    title: "Where do your orders come from?",
    why: "So we can bring your orders in for you, instead of you typing them.",
    multi: true,
    options: [
      { id: "shopify", label: "Shopify" },
      { id: "woo", label: "WooCommerce" },
      { id: "amazon", label: "Amazon" },
      { id: "manual", label: "Phone, email or in person" },
      { id: "erp", label: "An ERP (NetSuite, SAP…)" },
    ],
  },
];

export type Answers = { role?: string; volume?: string; ships: string[]; sources: string[] };

// Parcels a month at the middle of each band, for the savings estimate.
const MID: Record<string, number> = { lt20: 10, "20-100": 60, "100-500": 300, "500-2000": 1200, "2000+": 3000 };
// About $3.30 saved per parcel, from the Shipping Check sample. Illustrative.
export const savingsEstimate = (a: Answers) => {
  const n = MID[a.volume ?? ""] ?? 0;
  return Math.round((n * 12 * 3.3) / 100) * 100;
};

export function recommend(a: Answers): { plan: PlanId; reasons: string[] } {
  const reasons: string[] = [];
  const crossBorder = a.ships.includes("us") || a.ships.includes("intl");
  const pallets = a.ships.includes("pallets");
  if (a.role === "locations" || a.volume === "2000+" || a.sources.includes("erp")) {
    if (a.role === "locations") reasons.push("You ship from several locations");
    if (a.volume === "2000+") reasons.push("You ship more than 2,000 parcels a month");
    if (a.sources.includes("erp")) reasons.push("Your orders come from an ERP");
    reasons.push("A network built around where your customers are usually pays for itself");
    return { plan: "one", reasons };
  }
  const bigEnough = a.volume === "100-500" || a.volume === "500-2000";
  if (bigEnough || a.role === "team" || ((crossBorder || pallets) && a.volume === "20-100")) {
    if (bigEnough) reasons.push(`You ship ${a.volume === "100-500" ? "100 to 500" : "500 to 2,000"} parcels a month`);
    if (crossBorder) reasons.push("You ship across the border: we do the customs with every label");
    if (pallets) reasons.push("You ship pallets too: one advisor for parcels and freight");
    if (a.role === "team") reasons.push("Several people ship: shared access and locations");
    return { plan: "team", reasons };
  }
  reasons.push("You can start shipping in minutes, for free");
  reasons.push("When you grow, we'll tell you when Team is worth it");
  return { plan: "free", reasons };
}

export const slots = [
  { day: "Mon Oct 19", time: "10:00" },
  { day: "Mon Oct 19", time: "14:30" },
  { day: "Tue Oct 20", time: "9:30" },
  { day: "Tue Oct 20", time: "13:00" },
  { day: "Wed Oct 21", time: "11:00" },
  { day: "Thu Oct 22", time: "15:00" },
];

export const money = (n: number) => "$" + n.toLocaleString("en-US");
