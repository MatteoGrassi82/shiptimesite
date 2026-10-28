// The example accounts behind the /dashboard mockup (made-up companies, no
// real customer named). One small brand on ShipTime, and three ShipTime One
// accounts shaped like the US Network deals: a US brand selling into Canada, a
// retailer supplying its own stores, and a one-warehouse brand that needs
// 2-day reach. Same app for all of them; ShipTime One switches more on, the
// way Shopify Plus does on top of Shopify.

export type BrandId = "small" | "canada" | "stores" | "reach";
export type Tier = "ShipTime" | "Koherent"; // internally the second is "ShipTime One"

// A shipping rule, written by the account team from the customer's own orders
// and tested on last month before anyone turns it on (Stripe Radar's "test
// rule" pattern). Rules are checked top to bottom; the first match wins.
export type Rule = {
  id: string; name: string; when?: string; if: string[]; site: string; carrier: string;
  status: "Live" | "Shadow" | "Suggested"; monthly: number; matched: number; share: number; faster: string;
  why: string; by: string; since: string; // since = the day it went live, started its test run, or was suggested
};
// What the Sites map should say for this account: which sites were live before
// the latest one, which are live now, which are planned, and whether the story
// is next-day (1) or 2-day (2) reach. demand = share of orders by state (%);
// without it, orders follow US population.
export type MapStory = { days: 1 | 2; before: string[]; now: string[]; planned?: string[]; demand?: Record<string, number>; offMap?: string; region?: string };
// The control tower line on Home: what the team watched, caught and fixed today.
export type Tower = { watched: number; caught: number; fixed: number; saved: string; asOf: string; events: { time: string; who: string; text: string; impact: string }[]; warning?: string };
export type Site = { name: string; kind: string; status: string; orders: number; costPerOrder: string; onTime: string; days: string; problems: number };
export type Problem = { id: string; who: "you" | "us"; title: string; detail: string; site: string; due: string; cta?: string };
export type Rec = { id: string; title: string; body: string; cta: string; value: string; feature?: string; goLive?: boolean };
export type Line = { item: string; qty: string; unit: string; amount: number };
// How the account team works with a Koherent customer, and how it's going
// against what was agreed when they joined (Chris, Oct 22: the product is what
// we deliver plus how we work alongside them). The score's three parts are
// cost, operations and experience, weighted 42/34/24 as in the Koherent
// assessment. `margin` is internal: only the account team's view shows it.
export type Goal = { label: string; then: string; now: string; goal: string; progress: number }; // progress 0–1, 1 = met
export type JobMode = "do" | "tell" | "ask";
export type Job = { job: string; mode: JobMode; locked?: string };
export type Service = {
  joined: string;
  cost: { label: string; now: string; then: string };
  score: { now: number; then: number; parts: [number, number, number] };
  savedSince: number; feesSince: number;
  goals: Goal[];
  ground: { name: string; initials: string; role: string; detail: string };
  review: string;
  margin: number;
};
// What the team may do without asking. "Act without asking" = do + tell.
export const jobsAtStart: Job[] = [
  { job: "Fix incomplete addresses with your customer before pickup", mode: "do" },
  { job: "Switch carrier before pickup when one is running late, at no extra cost", mode: "do" },
  { job: "Reship lost or damaged parcels under $100", mode: "tell" },
  { job: "Move stock between your warehouses", mode: "ask" },
  { job: "Change your shipping rules", mode: "ask", locked: "Rules always need your approval." },
];

export type Scenario = {
  id: BrandId;
  tier: Tier;
  line: string; // one line for the sign-in screen
  account: { name: string; initials: string; user: { name: string; role: string; initials: string } };
  rules: Rule[]; // ShipTime One: routing rules, live, in shadow or suggested
  defaultRule?: { text: string; monthly: number }; // what happens when no rule matches
  nextSite?: { name: string; date: string; daysLeft: number; atRisk?: boolean }; // Koherent: the next site going live
  map?: MapStory;
  tower?: Tower;
  metrics: { label: string; value: string; delta: string }[];
  today: { shipments: number; labels: number; spend: string; problems: number };
  saved: string;
  sites: Site[];
  problems: Problem[];
  recs: Rec[];
  report?: { numbers: { label: string; value: string; change: string }[]; notes: string[] };
  warehouse?: { group: string; lines: Line[] };
  service?: Service;
  cities: { city: string; site: string }[];
};

export const tasksFor = (site: string) => [
  { task: `Sign the ${site.split(",")[0]} warehouse agreement`, owner: "ShipTime", done: true, due: "" },
  { task: "Send 6 months of order history", owner: "You", done: true, due: "" },
  { task: `Approve which SKUs go to ${site.split(",")[0]}`, owner: "You", done: false, due: "In 3 days" },
  { task: `Connect ${site.split(",")[0]} to your order system`, owner: "ShipTime", done: false, due: "In 2 weeks" },
  { task: "First inbound truck received", owner: "Partner warehouse", done: false, due: "In 3 weeks" },
  { task: "Test labels and first live orders", owner: "Both", done: false, due: "Go-live week" },
];

export const method = ["Assess", "Plan", "Design", "Test", "Go live", "Improve"];

export const scenarios: Record<BrandId, Scenario> = {
  small: {
    id: "small",
    tier: "ShipTime",
    line: "Hand-poured candles. About 600 orders a month from one studio, on Shopify.",
    account: { name: "Tallowick Candle Co.", initials: "TC", user: { name: "Maya Brooks", role: "Owner", initials: "MB" } },
    rules: [],
    metrics: [
      { label: "Shipping spend", value: "$6,480", delta: "−4.1%" },
      { label: "Saved vs carrier retail rates", value: "$2,310", delta: "+$140" },
      { label: "Delivered on time", value: "95.2%", delta: "+0.6 pts" },
    ],
    today: { shipments: 22, labels: 23, spend: "$268", problems: 1 },
    saved: "$2,310",
    sites: [{ name: "Portland, OR", kind: "Your studio", status: "Live", orders: 610, costPerOrder: "$10.62", onTime: "95.2%", days: "3.1", problems: 1 }],
    problems: [],
    recs: [
      { id: "r1", title: "Ship parcels under 1 lb with USPS Ground Advantage", body: "68% of your orders weigh under a pound. Same delivery days, about $1.10 less each.", cta: "See the numbers", value: "−$450/mo" },
      { id: "r2", title: "Print labels in one batch", body: "Pick today's orders, print once. Most days that's 20 labels in one go.", cta: "Try it", value: "Saves time" },
      { id: "r3", title: "Turn on your returns page", body: "Customers start a return themselves instead of emailing you.", cta: "Set it up", value: "Included", feature: "returns" },
    ],
    cities: [{ city: "Seattle, WA", site: "Portland" }, { city: "Austin, TX", site: "Portland" }, { city: "Brooklyn, NY", site: "Portland" }, { city: "Denver, CO", site: "Portland" }, { city: "Chicago, IL", site: "Portland" }, { city: "Los Angeles, CA", site: "Portland" }, { city: "Boston, MA", site: "Portland" }, { city: "Atlanta, GA", site: "Portland" }],
  },
  canada: {
    id: "canada",
    tier: "Koherent",
    line: "Ships from Texas. Canadian orders cost $30+ each and take a week.",
    account: { name: "Northpeak Outdoor", initials: "NO", user: { name: "Sam Ortiz", role: "VP Operations", initials: "SO" } },
    rules: [
      { id: "c1", name: "Texas and the South on a regional carrier", if: ["Ship-to state is TX, OK, LA, AR or NM"], site: "Austin", carrier: "Regional carrier, ground", status: "Live", monthly: 3100, matched: 2600, share: 38, faster: "Same days", why: "38% of your orders stay in Texas and the South. A regional carrier is cheaper for the same days.", by: "Matteo Grassi", since: "Jun 9" },
      { id: "c2", name: "Eastern Canada through Toronto", if: ["Ship-to country is Canada", "Province is ON, QC or Atlantic Canada"], site: "Toronto", carrier: "Canada Post or Purolator", status: "Live", monthly: 4900, matched: 640, share: 9, faster: "5 days faster", why: "Canada was 29% of your shipping spend, at $31.20 an order and 6–8 days.", by: "Marc Leblanc", since: "Jul 7" },
      { id: "c3", name: "Western Canada through Vancouver", if: ["Ship-to country is Canada", "Province is BC, AB, SK or MB"], site: "Vancouver", carrier: "Canada Post, expedited", status: "Shadow", monthly: 2200, matched: 410, share: 5, faster: "2 days faster", why: "Runs as a test until Vancouver goes live on Jan 20. It shows what it would do and changes nothing.", by: "Marc Leblanc", since: "Oct 19" },
      { id: "c4", name: "Heavy Canadian orders on the weekly truck", if: ["Ship-to country is Canada", "Weight over 15 lb"], site: "Austin", carrier: "Consolidated truck to Toronto", status: "Suggested", monthly: 900, matched: 120, share: 2, faster: "Same days", why: "Heavy Canadian parcels cost $58 each by courier. They fit on the truck that already goes to Toronto twice a week.", by: "Matteo Grassi", since: "Oct 16" },
    ],
    defaultRule: { text: "Cheapest rate from Austin, comparing your UPS account and ours on every label", monthly: 2400 },
    nextSite: { name: "Vancouver, BC", date: "Jan 20", daysLeft: 90 },
    map: { days: 2, before: ["Austin"], now: ["Austin"], demand: { TX: 24, OK: 4, LA: 4, AR: 3, NM: 3, CA: 12, AZ: 4, CO: 3, WA: 2, OR: 1, NY: 7, PA: 4, NJ: 4, MA: 3, IL: 3, MO: 2, OH: 2, MN: 1 }, offMap: "Toronto and Vancouver are off this map. Vancouver goes live on Jan 20.", region: "Canada (14% of your orders): 6.8 days → 1.7 days since Toronto." },
    tower: { watched: 1380, caught: 9, fixed: 7, saved: "$610", asOf: "10:40 am", warning: "1 check couldn't run: the Purolator feed is late this morning.", events: [
      { time: "10:21 am", who: "Marc Leblanc", text: "Switched 4 Toronto labels to Canada Post after Purolator missed the pickup", impact: "$0 extra" },
      { time: "9:52 am", who: "ShipTime", text: "Got 3 labels repriced after weight overcharges", impact: "−$24" },
      { time: "9:10 am", who: "Matteo Grassi", text: "Filed a claim for a damaged parcel to Ottawa", impact: "Credit due Nov 5" },
    ] },
    metrics: [
      { label: "Shipping spend", value: "$94,200", delta: "−10.4%" },
      { label: "Saved vs your old rates", value: "$10,900", delta: "+$1,400" },
      { label: "Delivered on time", value: "96.1%", delta: "+1.2 pts" },
    ],
    today: { shipments: 268, labels: 271, spend: "$3,560", problems: 3 },
    saved: "$10,900",
    sites: [
      { name: "Austin, TX", kind: "Your warehouse", status: "Live", orders: 6050, costPerOrder: "$13.05", onTime: "96.6%", days: "2.4", problems: 1 },
      { name: "Toronto, ON", kind: "Partner warehouse", status: "Live", orders: 1050, costPerOrder: "$17.40", onTime: "95.4%", days: "1.7", problems: 2 },
      { name: "Vancouver, BC", kind: "Partner warehouse", status: "Going live Jan 20", orders: 0, costPerOrder: "—", onTime: "—", days: "—", problems: 0 },
    ],
    problems: [
      { id: "p1", who: "you", title: "Approve which SKUs go to Vancouver", detail: "We suggest 25 SKUs, 81% of Western Canada orders.", site: "Vancouver", due: "Oct 28", cta: "Approve" },
      { id: "p2", who: "you", title: "Renew your Canadian customs bond", detail: "It expires in 3 weeks. We've filled in the form.", site: "Toronto", due: "Nov 12", cta: "Review" },
      { id: "p3", who: "us", title: "Toronto truck held a day at the border", detail: "Orders ship from Toronto tomorrow. Customers already notified.", site: "Toronto", due: "Oct 23" },
      { id: "p4", who: "us", title: "3 parcels with no scan for 2 days", detail: "Traced with the carrier. Reshipping if not found by Friday.", site: "Austin", due: "Oct 23" },
    ],
    recs: [
      { id: "r1", title: "Ship Western Canada from Vancouver", body: "1,100 Canadian orders a month go west of Winnipeg. They'd arrive 2 days sooner.", cta: "See the numbers", value: "−2 days" },
      { id: "r2", title: "Add duties to your checkout", body: "Canadian customers see the full price before they pay. Fewer refused parcels.", cta: "Review the change", value: "Fewer refusals" },
      { id: "r3", title: "Turn on your branded tracking page", body: "Your logo and delivery date instead of the carrier's page.", cta: "Set it up", value: "Included", feature: "tracking" },
    ],
    report: {
      numbers: [{ label: "Cost per order", value: "$13.27", change: "−$1.53" }, { label: "Delivered on time", value: "96.1%", change: "+1.2 pts" }, { label: "Canada, days to deliver", value: "1.7", change: "was 6.8" }, { label: "Problems solved by us", value: "96", change: "of 101" }],
      notes: ["Toronto, three months in: Canadian orders cost $17.40 instead of $31.20, and arrive in 1.7 days.", "Southern orders moved to a regional carrier: same days, 9% cheaper.", "Next: Vancouver goes live Jan 20 for Western Canada, after peak season."],
    },
    service: {
      joined: "June",
      cost: { label: "Cost per order", now: "$13.27", then: "$14.80" },
      score: { now: 71, then: 57, parts: [70, 72, 71] },
      savedSince: 38500, feesSince: 11250,
      goals: [
        { label: "Canadian orders, days to deliver", then: "6.8", now: "1.7", goal: "2.0", progress: 1 },
        { label: "Cost per Canadian order", then: "$31.20", now: "$17.40", goal: "$20.00", progress: 1 },
        { label: "Delivered on time", then: "94.9%", now: "96.1%", goal: "97%", progress: 0.57 },
      ],
      ground: { name: "Aisha Rahman", initials: "AR", role: "Site lead, Toronto", detail: "On the floor in Toronto, weekdays 7 am to 3:30 pm ET." },
      review: "Dec 9",
      margin: 0.17,
    },
    warehouse: { group: "Warehouse · Toronto", lines: [
      { item: "Storage, pallets counted on the 1st", qty: "48", unit: "$19.00 / pallet", amount: 912 },
      { item: "Receiving", qty: "14", unit: "$9.00 / pallet", amount: 126 },
      { item: "Pick & pack", qty: "520", unit: "$2.40 / order", amount: 1248 },
      { item: "Linehaul, Austin → Toronto", qty: "4", unit: "$1,180 / truck", amount: 4720 },
    ] },
    cities: [{ city: "Dallas, TX", site: "Austin" }, { city: "Toronto, ON", site: "Toronto" }, { city: "Atlanta, GA", site: "Austin" }, { city: "Ottawa, ON", site: "Toronto" }, { city: "Denver, CO", site: "Austin" }, { city: "Montréal, QC", site: "Toronto" }, { city: "Brooklyn, NY", site: "Austin" }, { city: "Houston, TX", site: "Austin" }],
  },
  stores: {
    id: "stores",
    tier: "Koherent",
    line: "24 stores and a busy online shop. Heavy items, and no room left in the back.",
    account: { name: "Sunbelt Home & Garden", initials: "SH", user: { name: "Dana Kim", role: "Director of Supply Chain", initials: "DK" } },
    rules: [
      { id: "s1", name: "Heavy parcels on a regional carrier", if: ["Ship-to state is AZ, CA or NV", "Weight 20 to 70 lb"], site: "Phoenix", carrier: "Regional carrier, heavy ground", status: "Live", monthly: 4300, matched: 2500, share: 81, faster: "Same days", why: "81% of your online orders go to AZ, CA and NV, and most pay heavy-package fees with the national carriers.", by: "Matteo Grassi", since: "Jun 2" },
      { id: "s2", name: "Orders over 70 lb as freight", if: ["Weight over 70 lb"], site: "Phoenix", carrier: "LTL freight", status: "Live", monthly: 2800, matched: 190, share: 6, faster: "Same days", why: "Parcels over 70 lb paid $35 or more in fees each.", by: "Matteo Grassi", since: "Jun 2" },
      { id: "s3", name: "California stores from Riverside", if: ["Destination is one of your California stores"], site: "Riverside", carrier: "Weekly store route", status: "Live", monthly: 3600, matched: 96, share: 3, faster: "1 day faster", why: "California stores were supplied from Phoenix, two days away, with no frozen space on the way.", by: "Marc Leblanc", since: "Jul 14" },
      { id: "s4", name: "Nevada stores from Las Vegas", if: ["Destination is one of your Nevada stores"], site: "Las Vegas", carrier: "Same-day store route", status: "Shadow", monthly: 900, matched: 22, share: 1, faster: "1 day faster", why: "Runs as a test until Las Vegas goes live on Jan 27. It shows what it would do and changes nothing.", by: "Marc Leblanc", since: "Oct 19" },
      { id: "s5", name: "Store deliveries planned by route and day", if: ["Destination is any store", "Order placed before Tuesday noon"], site: "Riverside", carrier: "Wednesday to Friday routes", status: "Suggested", monthly: 1500, matched: 52, share: 2, faster: "Same days", why: "Today a truck goes out whenever a store orders. Grouping stores by route fills each truck.", by: "Matteo Grassi", since: "Oct 16" },
    ],
    defaultRule: { text: "Cheapest rate from Phoenix, comparing every carrier on every label", monthly: 0 },
    nextSite: { name: "Las Vegas, NV", date: "Jan 27", daysLeft: 97 },
    map: { days: 1, before: ["Phoenix"], now: ["Phoenix", "Riverside"], planned: ["Las Vegas"], region: "California stores: next day from Riverside, instead of 2 days from Phoenix.", demand: { AZ: 41, CA: 33, NV: 7, TX: 6, CO: 2, UT: 2, NM: 2, OR: 1.5, WA: 1.5, FL: 1, IL: 1, NY: 1, GA: 1 } },
    tower: { watched: 640, caught: 6, fixed: 5, saved: "$420", asOf: "10:40 am", events: [
      { time: "10:25 am", who: "Marc Leblanc", text: "Rebooked a refused 84 lb delivery with the final-mile team for tomorrow", impact: "$0 extra" },
      { time: "9:50 am", who: "ShipTime", text: "Caught 2 orders over 70 lb booked as parcels and moved them to freight before pickup", impact: "−$71" },
      { time: "9:12 am", who: "Matteo Grassi", text: "Confirmed Tuesday's Riverside freezer service with the warehouse", impact: "No orders affected" },
    ] },
    metrics: [
      { label: "Shipping & delivery spend", value: "$54,800", delta: "−16.3%" },
      { label: "Saved vs your old rates", value: "$11,100", delta: "+$1,250" },
      { label: "Store deliveries on time", value: "98.2%", delta: "+2.1 pts" },
    ],
    today: { shipments: 128, labels: 131, spend: "$2,160", problems: 2 },
    saved: "$11,100",
    sites: [
      { name: "Phoenix, AZ", kind: "Your distribution center", status: "Live", orders: 2050, costPerOrder: "$13.40", onTime: "96.8%", days: "1.9", problems: 1 },
      { name: "Riverside, CA", kind: "Partner warehouse · stores + frozen", status: "Live", orders: 1200, costPerOrder: "$12.20", onTime: "98.2%", days: "1.2", problems: 1 },
      { name: "Las Vegas, NV", kind: "Partner warehouse", status: "Going live Jan 27", orders: 0, costPerOrder: "—", onTime: "—", days: "—", problems: 0 },
    ],
    problems: [
      { id: "p1", who: "you", title: "Confirm next week's store order for Riverside", detail: "Holiday range, 14 pallets. We've pre-filled it from last year.", site: "Riverside", due: "Tomorrow", cta: "Confirm" },
      { id: "p2", who: "you", title: "Approve which SKUs go to Las Vegas", detail: "We suggest 60 SKUs for your 3 Nevada stores and online orders.", site: "Las Vegas", due: "Nov 20", cta: "Approve" },
      { id: "p3", who: "us", title: "Freezer at Riverside serviced Tuesday", detail: "Frozen stock moves to the backup unit for 4 hours. No orders affected.", site: "Riverside", due: "Oct 27" },
      { id: "p4", who: "us", title: "One heavy order refused at the door", detail: "Customer wanted room-of-choice delivery. Rebooked with the final-mile team.", site: "Phoenix", due: "Oct 22" },
    ],
    recs: [
      { id: "r1", title: "Offer room-of-choice delivery on items over 70 lb", body: "Customers asked for it 31 times last month. Our final-mile partners cover Phoenix and LA.", cta: "See the numbers", value: "New" },
      { id: "r2", title: "Serve your Nevada stores from Las Vegas", body: "Store deliveries in Nevada would drop from 2 days to same day.", cta: "Review the change", value: "−1 day" },
      { id: "r3", title: "Turn on your returns page", body: "Customers start a return and drop it at their nearest store.", cta: "Set it up", value: "Included", feature: "returns" },
    ],
    report: {
      numbers: [{ label: "Cost per online order", value: "$12.95", change: "−$3.45" }, { label: "Store deliveries on time", value: "98.2%", change: "+2.1 pts" }, { label: "Heavy-package fees", value: "$1,240", change: "was $9,870" }, { label: "Problems solved by us", value: "47", change: "of 49" }],
      notes: ["Riverside, three months in: California stores get weekly deliveries from one place, frozen included.", "Orders over 70 lb now go as freight: heavy-package fees down 87%.", "Next: Las Vegas goes live Jan 27 for your Nevada stores, after peak season."],
    },
    service: {
      joined: "June",
      cost: { label: "Cost per online order", now: "$12.95", then: "$16.40" },
      score: { now: 66, then: 52, parts: [69, 64, 63] },
      savedSince: 43700, feesSince: 11250,
      goals: [
        { label: "Store deliveries on time", then: "96.1%", now: "98.2%", goal: "98%", progress: 1 },
        { label: "Heavy-package fees a month", then: "$9,870", now: "$1,240", goal: "under $2,000", progress: 1 },
        { label: "Cost per online order", then: "$16.40", now: "$12.95", goal: "$12.50", progress: 0.88 },
      ],
      ground: { name: "Marco Díaz", initials: "MD", role: "Site lead, Riverside", detail: "On the floor in Riverside, weekdays 5 am to 1:30 pm PT." },
      review: "Dec 3",
      margin: 0.19,
    },
    warehouse: { group: "Warehouse · Riverside", lines: [
      { item: "Storage, ambient pallets counted on the 1st", qty: "310", unit: "$26.00 / pallet", amount: 8060 },
      { item: "Storage, frozen pallets", qty: "28", unit: "$48.00 / pallet", amount: 1344 },
      { item: "Receiving", qty: "95", unit: "$11.00 / pallet", amount: 1045 },
      { item: "Case picking for stores", qty: "9,200", unit: "$0.85 / line", amount: 7820 },
      { item: "Store delivery routes", qty: "13", unit: "$210 / route", amount: 2730 },
    ] },
    cities: [{ city: "Phoenix, AZ", site: "Phoenix" }, { city: "Los Angeles, CA", site: "Riverside" }, { city: "Tucson, AZ", site: "Phoenix" }, { city: "San Diego, CA", site: "Riverside" }, { city: "Scottsdale, AZ", site: "Phoenix" }, { city: "Store #14 · Irvine, CA", site: "Riverside" }, { city: "Mesa, AZ", site: "Phoenix" }, { city: "Store #7 · Pasadena, CA", site: "Riverside" }],
  },
  reach: {
    id: "reach",
    tier: "Koherent",
    line: "One warehouse in Ohio. West Coast customers wait 5 days.",
    account: { name: "Alder & Stone", initials: "AS", user: { name: "Jordan Reyes", role: "Director of Operations", initials: "JR" } },
    rules: [
      { id: "a1", name: "Midwest orders on a regional carrier", if: ["Ship-to state is OH, IN, MI, IL, KY, PA or WV", "Weight under 20 lb"], site: "Columbus", carrier: "Regional carrier, ground", status: "Live", monthly: 6700, matched: 5600, share: 31, faster: "Same days", why: "31% of your orders go to seven states next door. A regional carrier gets them there in the same days for less.", by: "Matteo Grassi", since: "Jul 14" },
      { id: "a2", name: "West orders from Reno", if: ["Ship-to state is WA, OR, CA, NV, ID, UT or AZ", "Weight under 5 lb"], site: "Reno", carrier: "Cheapest 2-day", status: "Live", monthly: 6400, matched: 4312, share: 24, faster: "3.2 days faster", why: "24% of your orders go west, and from Columbus they took 4.8 days.", by: "Marc Leblanc", since: "Jul 21" },
      { id: "a3", name: "Southeast orders from Memphis", if: ["Ship-to state is TN, AR, MS, AL, GA, LA or KY"], site: "Memphis", carrier: "Local carrier, next day", status: "Shadow", monthly: 2700, matched: 2100, share: 12, faster: "1 day faster", why: "Runs as a test until Memphis goes live on Jan 13. It shows what it would do and changes nothing.", by: "Marc Leblanc", since: "Oct 19" },
      { id: "a4", name: "Light parcels to the Northeast and South by USPS", if: ["Weight under 1 lb", "Ship-to state is NY, NJ, MA, TX or FL", "Not an express order"], site: "Columbus", carrier: "USPS Ground Advantage", status: "Suggested", monthly: 1900, matched: 620, share: 3, faster: "Same days", why: "620 parcels a month under a pound go to the Northeast and South by UPS. USPS is about $3 cheaper each, for the same days.", by: "Matteo Grassi", since: "Oct 16" },
    ],
    defaultRule: { text: "Cheapest rate from the nearest site, comparing your UPS account and ours on every label", monthly: 6500 },
    nextSite: { name: "Memphis, TN", date: "Jan 13", daysLeft: 83, atRisk: true },
    map: { days: 2, before: ["Columbus"], now: ["Columbus", "Reno"], planned: ["Memphis"], region: "West Coast (24% of your orders): 4.8 days → 1.6 days since Reno." },
    tower: { watched: 3412, caught: 14, fixed: 12, saved: "$1,840", asOf: "10:40 am", warning: "1 check couldn't run: the FedEx feed is late this morning.", events: [
      { time: "10:18 am", who: "Marc Leblanc", text: "Switched 6 labels from FedEx to UPS before pickup, after a hub delay in Memphis", impact: "$0 extra" },
      { time: "9:47 am", who: "ShipTime", text: "Got 3 labels repriced after weight overcharges", impact: "−$21" },
      { time: "9:05 am", who: "Matteo Grassi", text: "Filed a claim for 2 damaged parcels to Denver", impact: "Credit due Nov 5" },
      { time: "8:30 am", who: "ShipTime", text: "Caught 4 addresses with no unit number and asked the customers before pickup", impact: "4 failed deliveries avoided" },
    ] },
    metrics: [
      { label: "Shipping spend", value: "$204,500", delta: "−7.4%" },
      { label: "Saved vs your old rates", value: "$19,800", delta: "+$2,600" },
      { label: "Delivered on time", value: "96.4%", delta: "+0.8 pts" },
    ],
    today: { shipments: 698, labels: 704, spend: "$7,820", problems: 4 },
    saved: "$19,800",
    sites: [
      { name: "Columbus, OH", kind: "Your warehouse", status: "Live", orders: 14210, costPerOrder: "$11.42", onTime: "96.9%", days: "2.3", problems: 2 },
      { name: "Reno, NV", kind: "Partner warehouse", status: "Live", orders: 4030, costPerOrder: "$9.85", onTime: "95.1%", days: "1.6", problems: 2 },
      { name: "Memphis, TN", kind: "Partner warehouse", status: "Going live Jan 13", orders: 0, costPerOrder: "—", onTime: "—", days: "—", problems: 0 },
    ],
    problems: [
      { id: "p0", who: "you", title: "Approve which SKUs go to Memphis", detail: "We suggest 40 SKUs, 81% of the orders in the zone.", site: "Memphis", due: "Oct 26", cta: "Review" },
      { id: "p1", who: "you", title: "Approve the Memphis delivery zones", detail: "We suggest 7 states from Memphis, 2,100 orders a month.", site: "Memphis", due: "Oct 30", cta: "Review" },
      { id: "p2", who: "you", title: "Re-stock 4 SKUs running low in Reno", detail: "Out in 9 days at today's pace. Suggested transfer ready.", site: "Reno", due: "Today", cta: "Approve" },
      { id: "p3", who: "us", title: "Reno receiving 1 day behind", detail: "A truck arrived late. Back on schedule tomorrow.", site: "Reno", due: "Oct 23" },
      { id: "p4", who: "us", title: "2 parcels with no scan for 3 days", detail: "Traced with UPS. Reshipping if not found by tomorrow.", site: "Columbus", due: "Oct 22" },
    ],
    recs: [
      { id: "r1", title: "Memphis opens Jan 13", body: "Southeast orders a day sooner and about $2,700 a month less. Two things need you first.", cta: "Open the go-live", value: "Go-live", goLive: true },
      { id: "r2", title: "Show delivery dates at checkout", body: "With Reno live, 74% of your customers can be promised 2 days.", cta: "See the numbers", value: "Included", feature: "checkout" },
      { id: "r3", title: "Turn on your branded tracking page", body: "Customers see your logo and delivery date instead of the carrier's page.", cta: "Set it up", value: "Included", feature: "tracking" },
    ],
    report: {
      numbers: [{ label: "Cost per order", value: "$11.21", change: "−$1.09" }, { label: "Delivered on time", value: "96.4%", change: "+0.8 pts" }, { label: "Customers within 2 days (estimated)", value: "74%", change: "+20 pts" }, { label: "Problems solved by us", value: "311", change: "of 326" }],
      notes: ["Reno, three months in: West Coast orders arrive in 1.6 days instead of 4.8.", "Midwest orders moved to a regional carrier: same days, 11% cheaper.", "Next: Memphis goes live Jan 13 for the Southeast, after peak season."],
    },
    service: {
      joined: "July",
      cost: { label: "Cost per order", now: "$11.21", then: "$12.30" },
      score: { now: 68, then: 54, parts: [72, 66, 64] },
      savedSince: 57900, feesSince: 8750,
      goals: [
        { label: "Customers within 2 days", then: "54%", now: "74%", goal: "70%", progress: 1 },
        { label: "Cost per order", then: "$12.30", now: "$11.21", goal: "$11.00", progress: 0.84 },
        { label: "Delivered on time", then: "95.6%", now: "96.4%", goal: "97%", progress: 0.57 },
      ],
      ground: { name: "Luis Ortega", initials: "LO", role: "Site lead, Reno", detail: "On the floor in Reno, weekdays 6 am to 2:30 pm PT." },
      review: "Oct 29",
      margin: 0.14,
    },
    warehouse: { group: "Warehouse · Reno", lines: [
      { item: "Storage, pallets counted on the 1st", qty: "142", unit: "$18.50 / pallet", amount: 2627 },
      { item: "Receiving", qty: "36", unit: "$9.00 / pallet", amount: 324 },
      { item: "Pick & pack", qty: "2,120", unit: "$2.35 / order", amount: 4982 },
      { item: "Additional items", qty: "640", unit: "$0.45 / item", amount: 288 },
    ] },
    cities: [{ city: "Brooklyn, NY", site: "Columbus" }, { city: "Seattle, WA", site: "Reno" }, { city: "Chicago, IL", site: "Columbus" }, { city: "Los Angeles, CA", site: "Reno" }, { city: "Boston, MA", site: "Columbus" }, { city: "Portland, OR", site: "Reno" }, { city: "Atlanta, GA", site: "Columbus" }, { city: "Denver, CO", site: "Reno" }],
  },
};
