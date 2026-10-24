// Sample data for the Shipping Check prototype. Maple & Co. Outdoor and Sarah
// Chen are made up; the numbers follow real BI patterns (a growing Shopify
// merchant, a third of orders cross-border) but describe no real customer.
// The four findings add up to the headline: 1,240 parcels a month × 12 ×
// $3.30 saved per parcel ≈ $49,100 a year. Prices are illustrative.

export const company = {
  name: "Maple & Co. Outdoor",
  store: "maple-and-co.myshopify.com",
  orders: 3720,
  period: "Jul–Sep 2026",
  parcelsPerMonth: 1240,
  carriers: 6,
  avgNow: 18.4,
  avgNew: 15.1,
  savingsYear: 49100,
  hoursPerMonth: 37,
};

export const advisor = {
  name: "Sarah Chen",
  initials: "SC",
  role: "Logistics advisor",
  bio: "8 years at a carrier and a 3PL",
  signedOff: "Oct 16",
};

export type Finding = {
  title: string;
  summary: string;
  save: number;
  saveNote: string;
  table: { head: string[]; rows: { cells: string[]; strong?: boolean }[] };
  note?: string;
};

export const findings: Finding[] = [
  {
    title: "Small parcels are on the wrong carrier",
    summary:
      "38% of your parcels weigh under 5 lb and go FedEx Ground at $16.90 each. A regional carrier delivers them for $12.40, in the same time.",
    save: 25400,
    saveNote: "a year",
    table: {
      head: ["Parcels under 5 lb", "Per month", "Avg cost", "Avg days"],
      rows: [
        { cells: ["Today · FedEx Ground", "471", "$16.90", "2.3"] },
        { cells: ["Recommended · regional carrier", "471", "$12.40", "2.2"], strong: true },
      ],
    },
    note: "Ontario and Quebec addresses only; the rest stay where they are.",
  },
  {
    title: "US orders: customs done by hand",
    summary:
      "30% of your orders go to the US. Your team fills in customs for each one, about 6 minutes a parcel. Our cross-border lane does the paperwork with the label and costs less.",
    save: 9400,
    saveNote: "+ 37 h a month",
    table: {
      head: ["US orders", "Per month", "Avg cost", "Time on customs"],
      rows: [
        { cells: ["Today · UPS Standard + forms by hand", "372", "$24.60", "37 h"] },
        { cells: ["Recommended · cross-border lane", "372", "$22.50", "0 h"], strong: true },
      ],
    },
    note: "Duties shown to your customer at checkout, so no surprise bills on delivery.",
  },
  {
    title: "Paying for express where ground arrives next day",
    summary:
      "About 210 Toronto-area orders a month go Purolator Express. On those lanes, ground arrives next day anyway.",
    save: 9200,
    saveNote: "a year",
    table: {
      head: ["Toronto-area orders", "Per month", "Avg cost", "Next day"],
      rows: [
        { cells: ["Today · Purolator Express", "210", "$14.85", "99%"] },
        { cells: ["Recommended · Purolator Ground", "210", "$11.20", "96%"], strong: true },
      ],
    },
    note: "We'd keep express for orders placed after 3 pm.",
  },
  {
    title: "Billing errors nobody checks",
    summary:
      "14 wrong charges last quarter: weights billed higher than shipped, and address corrections. We audit every invoice and claim them back for you.",
    save: 5100,
    saveNote: "a year",
    table: {
      head: ["Last quarter", "Charges", "Overbilled"],
      rows: [
        { cells: ["Billed weight above shipped weight", "9", "$790"] },
        { cells: ["Address corrections", "4", "$410"] },
        { cells: ["Duplicate charge", "1", "$75"] },
      ],
    },
  },
];

export const regions = [
  { name: "Ontario", share: 40, days: 1.4 },
  { name: "United States", share: 30, days: 3.6 },
  { name: "West (BC, AB)", share: 14, days: 4.1, flag: true },
  { name: "Quebec", share: 10, days: 2.1 },
  { name: "Rest of Canada", share: 6, days: 3.2 },
];

export const mixToday = [
  { label: "FedEx", share: 44, color: "#4D148C" },
  { label: "UPS", share: 30, color: "#5E3D1E" },
  { label: "Purolator", share: 17, color: "#B5121B" },
  { label: "Other", share: 9, color: "#9AA0B4" },
];

export const mixNew = [
  { label: "Regional", share: 38, color: "var(--brand)" },
  { label: "Cross-border", share: 30, color: "var(--ink)" },
  { label: "Purolator", share: 22, color: "#B5121B" },
  { label: "FedEx", share: 10, color: "#4D148C" },
];

export const analysisSteps = [
  { title: "Reading your orders", detail: "3,720 orders from Jul 1 to Sep 30, 2026" },
  { title: "Finding how you ship today", detail: "6 carriers, 3 separate invoices, 30% of orders to the US" },
  { title: "Pricing every order with 14 carriers", detail: "Same weight, same address, same delivery date" },
  { title: "Checking delivery times by region", detail: "From our own delivery data on millions of shipments" },
  { title: "Auditing your carrier invoices", detail: "Wrong weights, address corrections, duplicate charges" },
];

export const plan = {
  name: "ShipTime Team",
  monthly: 399,
  includes: [
    "Sarah, your named advisor, makes the four changes above in your first week",
    "Customs done with the label, duties shown at checkout",
    "Stuck parcels chased before your customers notice",
    "Every invoice audited, wrong charges claimed back",
    "A one-page report every month: what you shipped, what it cost, what we fixed",
  ],
};

export const slots = [
  { day: "Mon Oct 19", time: "10:00" },
  { day: "Mon Oct 19", time: "14:30" },
  { day: "Tue Oct 20", time: "9:30" },
  { day: "Tue Oct 20", time: "13:00" },
  { day: "Wed Oct 21", time: "11:00" },
  { day: "Wed Oct 21", time: "16:00" },
  { day: "Thu Oct 22", time: "10:30" },
  { day: "Thu Oct 22", time: "15:00" },
];

export const firstMonth = [
  { when: "The call", what: "Sarah goes through the four findings with you and answers questions." },
  { when: "Day 3", what: "Small parcels move to the regional carrier, Toronto orders to ground. Nothing changes in your store." },
  { when: "Week 1", what: "Customs switches to the label, duties show at checkout. Invoice audits start." },
  { when: "Month 1", what: "Your first one-page report: what you shipped, what it cost, what Sarah fixed." },
];

export const money = (n: number) => "$" + n.toLocaleString("en-US");
