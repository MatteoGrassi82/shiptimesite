// The example accounts behind the /dashboard mockup (made-up companies, no
// real customer named). One small brand on ShipTime, and three ShipTime One
// accounts shaped like the US Network deals: a US brand selling into Canada, a
// retailer supplying its own stores, and a one-warehouse brand that needs
// 2-day reach. Same app for all of them; ShipTime One switches more on, the
// way Shopify Plus does on top of Shopify.

export type BrandId = "small" | "canada" | "stores" | "reach";
export type Tier = "ShipTime" | "ShipTime One";

// A shipping rule, written by the account team from the customer's own orders
// and tested on last month before anyone turns it on (Stripe Radar's "test
// rule" pattern). Rules are checked top to bottom; the first match wins.
export type Rule = {
  id: string; name: string; when?: string; if: string[]; site: string; carrier: string;
  status: "Live" | "Shadow" | "Suggested"; monthly: number; matched: number; share: number; faster: string;
  why: string; by: string;
};
// What the Sites map should say for this account: which sites were live before
// the latest one, which are live now, which are planned, and whether the story
// is next-day (1) or 2-day (2) reach. demand = share of orders by state (%);
// without it, orders follow US population.
export type MapStory = { days: 1 | 2; before: string[]; now: string[]; planned?: string[]; demand?: Record<string, number>; offMap?: string };
// The control tower line on Home: what the team watched, caught and fixed today.
export type Tower = { watched: number; caught: number; fixed: number; saved: string; asOf: string; events: { time: string; who: string; text: string; impact: string }[]; warning?: string };
export type Site = { name: string; kind: string; status: string; orders: number; costPerOrder: string; onTime: string; days: string; problems: number };
export type Problem = { id: string; who: "you" | "us"; title: string; detail: string; site: string; due: string; cta?: string };
export type Rec = { id: string; title: string; body: string; cta: string; value: string; shiplet?: string };
export type Line = { item: string; qty: string; unit: string; amount: number };

export type Scenario = {
  id: BrandId;
  tier: Tier;
  line: string; // one line for the sign-in screen
  account: { name: string; initials: string; user: { name: string; role: string; initials: string } };
  rules: Rule[]; // ShipTime One: routing rules, live, in shadow or suggested
  defaultRule?: { text: string; monthly: number }; // what happens when no rule matches
  nextSite?: { name: string; date: string; daysLeft: number }; // ShipTime One: the next site going live
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
      { id: "r3", title: "Turn on your returns page", body: "Customers start a return themselves instead of emailing you.", cta: "Set it up", value: "Shiplet", shiplet: "returns" },
    ],
    cities: [{ city: "Seattle, WA", site: "Portland" }, { city: "Austin, TX", site: "Portland" }, { city: "Brooklyn, NY", site: "Portland" }, { city: "Denver, CO", site: "Portland" }, { city: "Chicago, IL", site: "Portland" }, { city: "Los Angeles, CA", site: "Portland" }, { city: "Boston, MA", site: "Portland" }, { city: "Atlanta, GA", site: "Portland" }],
  },
  canada: {
    id: "canada",
    tier: "ShipTime One",
    line: "Ships from Texas. Canadian orders cost $30+ each and take a week.",
    account: { name: "Northpeak Outdoor", initials: "NO", user: { name: "Sam Ortiz", role: "VP Operations", initials: "SO" } },
    rules: [
      { id: "c1", name: "Texas and the South on a regional carrier", if: ["Ship-to state is TX, OK, LA, AR or NM"], site: "Austin", carrier: "Regional carrier, ground", status: "Live", monthly: 3100, matched: 2600, share: 38, faster: "Same days", why: "38% of your orders stay in Texas and the South. A regional carrier is cheaper for the same days.", by: "Priya Shah" },
      { id: "c2", name: "Eastern Canada through Toronto", if: ["Ship-to country is Canada", "Province is ON, QC or Atlantic Canada"], site: "Toronto", carrier: "Canada Post or Purolator", status: "Live", monthly: 4900, matched: 640, share: 9, faster: "5 days faster", why: "Canada was 29% of your shipping spend, at $31.20 an order and 6–8 days.", by: "Marc Leblanc" },
      { id: "c3", name: "Western Canada through Vancouver", if: ["Ship-to country is Canada", "Province is BC, AB, SK or MB"], site: "Vancouver", carrier: "Canada Post, expedited", status: "Shadow", monthly: 2200, matched: 410, share: 5, faster: "2 days faster", why: "Runs in shadow until Vancouver goes live on Dec 2: it reports what it would have done, and changes nothing.", by: "Marc Leblanc" },
      { id: "c4", name: "Heavy Canadian orders on the weekly truck", if: ["Ship-to country is Canada", "Weight over 15 lb"], site: "Austin", carrier: "Consolidated truck to Toronto", status: "Suggested", monthly: 900, matched: 120, share: 2, faster: "Same days", why: "Heavy Canadian parcels cost $58 each by courier. They fit on the truck that already goes to Toronto twice a week.", by: "Priya Shah" },
    ],
    defaultRule: { text: "Cheapest rate from Austin, comparing your UPS account and ours on every label", monthly: 2400 },
    nextSite: { name: "Vancouver, BC", date: "Dec 2", daysLeft: 41 },
    map: { days: 2, before: ["Austin"], now: ["Austin"], demand: { TX: 24, OK: 4, LA: 4, AR: 3, NM: 3, CA: 12, AZ: 4, CO: 3, WA: 2, OR: 1, NY: 7, PA: 4, NJ: 4, MA: 3, IL: 3, MO: 2, OH: 2, MN: 1 }, offMap: "14% of your orders go to Canada. Toronto has delivered them in 1.7 days since July; Vancouver goes live on Dec 2." },
    tower: { watched: 1380, caught: 9, fixed: 7, saved: "$610", asOf: "9:14 am", warning: "1 check couldn't run: the Purolator feed is late this morning.", events: [
      { time: "08:47", who: "Marc Leblanc", text: "Moved 4 Toronto orders to Canada Post after a Purolator pickup was missed", impact: "$0 extra" },
      { time: "08:12", who: "ShipTime", text: "Re-rated 3 labels after a weight audit", impact: "−$96" },
      { time: "07:30", who: "Priya Shah", text: "Filed a claim for a damaged parcel to Ottawa", impact: "Credit due Nov 5" },
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
      { name: "Vancouver, BC", kind: "Partner warehouse", status: "Going live Dec 2", orders: 0, costPerOrder: "—", onTime: "—", days: "—", problems: 0 },
    ],
    problems: [
      { id: "p1", who: "you", title: "Approve which SKUs go to Vancouver", detail: "We suggest 25 SKUs, 81% of Western Canada orders.", site: "Vancouver", due: "Oct 28", cta: "Approve" },
      { id: "p2", who: "you", title: "Renew your Canadian customs bond", detail: "It expires in 3 weeks. We've filled in the form.", site: "Toronto", due: "Nov 12", cta: "Review" },
      { id: "p3", who: "us", title: "Toronto truck held a day at the border", detail: "Orders ship from Toronto tomorrow. Customers already notified.", site: "Toronto", due: "Oct 23" },
      { id: "p4", who: "us", title: "3 parcels with no scan for 2 days", detail: "Traced with the carrier. Reshipping if not found by Friday.", site: "Austin", due: "Oct 24" },
    ],
    recs: [
      { id: "r1", title: "Ship Western Canada from Vancouver", body: "1,100 Canadian orders a month go west of Winnipeg. They'd arrive 2 days sooner.", cta: "See the numbers", value: "−2 days" },
      { id: "r2", title: "Add duties to your checkout", body: "Canadian customers see the full price before they pay. Fewer refused parcels.", cta: "Review the change", value: "−41% refusals" },
      { id: "r3", title: "Turn on your branded tracking page", body: "Your logo and delivery date instead of the carrier's page.", cta: "Set it up", value: "Shiplet", shiplet: "tracking" },
    ],
    report: {
      numbers: [{ label: "Cost per order", value: "$13.27", change: "−$1.53" }, { label: "Delivered on time", value: "96.1%", change: "+1.2 pts" }, { label: "Canada, days to deliver", value: "1.7", change: "was 6.8" }, { label: "Problems solved by us", value: "96", change: "of 101" }],
      notes: ["Toronto's first full quarter: Canadian orders cost $17.40 instead of $31.20, and arrive in 1.7 days.", "Southern orders moved to a regional carrier: same days, 9% cheaper.", "Next: Vancouver goes live Dec 2 for Western Canada."],
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
    tier: "ShipTime One",
    line: "24 stores and a busy online shop. Heavy items, and no room left in the back.",
    account: { name: "Sunbelt Home & Garden", initials: "SH", user: { name: "Dana Kim", role: "Director of Supply Chain", initials: "DK" } },
    rules: [
      { id: "s1", name: "Heavy parcels on a regional carrier", if: ["Ship-to state is AZ, CA or NV", "Weight 20 to 70 lb"], site: "Phoenix", carrier: "Regional carrier, heavy ground", status: "Live", monthly: 4300, matched: 2500, share: 81, faster: "Same days", why: "81% of your online orders go to AZ, CA and NV, and most pay heavy-package fees with the national carriers.", by: "Priya Shah" },
      { id: "s2", name: "Orders over 70 lb as freight", if: ["Weight over 70 lb"], site: "Phoenix", carrier: "LTL freight", status: "Live", monthly: 2800, matched: 190, share: 6, faster: "Same days", why: "Parcels over 70 lb paid $35 or more in fees each.", by: "Priya Shah" },
      { id: "s3", name: "California stores from Riverside", if: ["Destination is one of your California stores"], site: "Riverside", carrier: "Weekly store route", status: "Live", monthly: 3600, matched: 96, share: 3, faster: "1 day faster", why: "California stores were supplied from Phoenix, two days away, with no frozen space on the way.", by: "Marc Leblanc" },
      { id: "s4", name: "Nevada stores from Las Vegas", if: ["Destination is one of your Nevada stores"], site: "Las Vegas", carrier: "Same-day store route", status: "Shadow", monthly: 900, matched: 22, share: 1, faster: "1 day faster", why: "Runs in shadow until Las Vegas goes live on Dec 15: it reports what it would have done, and changes nothing.", by: "Marc Leblanc" },
      { id: "s5", name: "Store deliveries planned by route and day", if: ["Destination is any store", "Order placed before Tuesday noon"], site: "Riverside", carrier: "Wednesday to Friday routes", status: "Suggested", monthly: 1500, matched: 52, share: 2, faster: "Same days", why: "Today a truck goes out whenever a store orders. Grouping stores by route fills each truck.", by: "Priya Shah" },
    ],
    defaultRule: { text: "Cheapest rate from Phoenix, comparing every carrier on every label", monthly: 0 },
    nextSite: { name: "Las Vegas, NV", date: "Dec 15", daysLeft: 54 },
    map: { days: 1, before: ["Phoenix"], now: ["Phoenix", "Riverside"], planned: ["Las Vegas"], demand: { AZ: 41, CA: 33, NV: 7, TX: 6, CO: 2, UT: 2, NM: 2, OR: 1.5, WA: 1.5, FL: 1, IL: 1, NY: 1, GA: 1 } },
    tower: { watched: 640, caught: 6, fixed: 5, saved: "$420", asOf: "9:14 am", events: [
      { time: "08:55", who: "Marc Leblanc", text: "Rebooked a refused 84 lb delivery with the final-mile team for tomorrow", impact: "$0 extra" },
      { time: "08:20", who: "ShipTime", text: "Caught 2 orders over 70 lb sent as parcels and moved them to freight", impact: "−$71" },
      { time: "07:40", who: "Priya Shah", text: "Confirmed Thursday's Riverside freezer service with the warehouse", impact: "No orders affected" },
    ] },
    metrics: [
      { label: "Shipping & delivery spend", value: "$54,800", delta: "−16.3%" },
      { label: "Saved vs your old rates", value: "$11,100", delta: "+$1,250" },
      { label: "Store deliveries on time", value: "98.2%", delta: "+2.1 pts" },
    ],
    today: { shipments: 128, labels: 131, spend: "$2,160", problems: 2 },
    saved: "$11,100",
    sites: [
      { name: "Phoenix, AZ", kind: "Your distribution centre", status: "Live", orders: 2050, costPerOrder: "$13.40", onTime: "96.8%", days: "1.9", problems: 1 },
      { name: "Riverside, CA", kind: "Partner warehouse · stores + frozen", status: "Live", orders: 1200, costPerOrder: "$12.20", onTime: "98.2%", days: "1.2", problems: 1 },
      { name: "Las Vegas, NV", kind: "Partner warehouse", status: "Going live Dec 15", orders: 0, costPerOrder: "—", onTime: "—", days: "—", problems: 0 },
    ],
    problems: [
      { id: "p1", who: "you", title: "Confirm next week's store order for Riverside", detail: "Holiday range, 14 pallets. We've pre-filled it from last year.", site: "Riverside", due: "Tomorrow", cta: "Confirm" },
      { id: "p2", who: "you", title: "Approve which SKUs go to Las Vegas", detail: "We suggest 60 SKUs for your 3 Nevada stores and online orders.", site: "Las Vegas", due: "Nov 20", cta: "Approve" },
      { id: "p3", who: "us", title: "Freezer at Riverside serviced Thursday", detail: "Frozen stock moves to the backup unit for 4 hours. No orders affected.", site: "Riverside", due: "Oct 24" },
      { id: "p4", who: "us", title: "One heavy order refused at the door", detail: "Customer wanted room-of-choice delivery. Rebooked with the final-mile team.", site: "Phoenix", due: "Oct 22" },
    ],
    recs: [
      { id: "r1", title: "Offer room-of-choice delivery on items over 70 lb", body: "Customers asked for it 31 times last month. Our final-mile partners cover Phoenix and LA.", cta: "See the numbers", value: "New" },
      { id: "r2", title: "Serve your Nevada stores from Las Vegas", body: "Store deliveries in Nevada would drop from 2 days to same day.", cta: "Review the change", value: "−1 day" },
      { id: "r3", title: "Turn on your returns page", body: "Customers start a return and drop it at their nearest store.", cta: "Set it up", value: "Shiplet", shiplet: "returns" },
    ],
    report: {
      numbers: [{ label: "Cost per online order", value: "$12.95", change: "−$3.45" }, { label: "Store deliveries on time", value: "98.2%", change: "+2.1 pts" }, { label: "Heavy-package fees", value: "$1,240", change: "was $9,870" }, { label: "Problems solved by us", value: "47", change: "of 49" }],
      notes: ["Riverside's first full quarter: California stores get weekly deliveries from one place, frozen included.", "Orders over 70 lb now go as freight: heavy-package fees down 87%.", "Next: Las Vegas goes live Dec 15 for your Nevada stores."],
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
    tier: "ShipTime One",
    line: "One warehouse in Ohio. West Coast customers wait 5 days.",
    account: { name: "Alder & Stone", initials: "AS", user: { name: "Jordan Reyes", role: "Director of Operations", initials: "JR" } },
    rules: [
      { id: "a1", name: "Midwest orders on a regional carrier", if: ["Ship-to state is OH, IN, MI, IL, KY, PA or WV", "Weight under 20 lb"], site: "Columbus", carrier: "Regional carrier, ground", status: "Live", monthly: 6700, matched: 5600, share: 31, faster: "Same days", why: "31% of your orders go to seven states next door. A regional carrier gets them there in the same days for less.", by: "Priya Shah" },
      { id: "a2", name: "West orders from Reno", if: ["Ship-to state is WA, OR, CA, NV, ID, UT or AZ", "Weight under 5 lb"], site: "Reno", carrier: "Cheapest 2-day", status: "Live", monthly: 6400, matched: 4312, share: 24, faster: "2.4 days faster", why: "24% of your orders go west, and from Columbus they took 4.8 days.", by: "Marc Leblanc" },
      { id: "a3", name: "Southeast orders through Atlanta", if: ["Ship-to state is GA, FL, SC, NC, AL or TN"], site: "Atlanta", carrier: "Local carrier, next day", status: "Shadow", monthly: 2700, matched: 2100, share: 12, faster: "1 day faster", why: "Runs in shadow until Atlanta goes live on Nov 25: it reports what it would have done, and changes nothing.", by: "Marc Leblanc" },
      { id: "a4", name: "Parcels under 1 lb with USPS Ground Advantage", if: ["Weight under 1 lb", "Not an express order"], site: "Nearest site", carrier: "USPS Ground Advantage", status: "Suggested", monthly: 1900, matched: 3880, share: 22, faster: "Same days", why: "22% of your orders weigh under a pound. USPS is the cheapest for them, with the same delivery days.", by: "Priya Shah" },
    ],
    defaultRule: { text: "Cheapest rate from the nearest site, comparing your UPS account and ours on every label", monthly: 6500 },
    nextSite: { name: "Atlanta, GA", date: "Nov 25", daysLeft: 34 },
    map: { days: 2, before: ["Columbus"], now: ["Columbus", "Reno"], planned: ["Atlanta"] },
    tower: { watched: 3412, caught: 14, fixed: 12, saved: "$1,840", asOf: "9:14 am", warning: "1 check couldn't run: the FedEx feed is late this morning.", events: [
      { time: "08:52", who: "Marc Leblanc", text: "Moved 6 parcels off a delayed hub in Memphis to UPS", impact: "$0 extra" },
      { time: "08:10", who: "ShipTime", text: "Re-rated 3 labels after a weight audit", impact: "−$212" },
      { time: "07:30", who: "Priya Shah", text: "Filed a claim for 2 damaged parcels to Denver", impact: "Credit due Nov 5" },
      { time: "07:05", who: "ShipTime", text: "Fixed 4 addresses missing a unit number before pickup", impact: "4 failed deliveries avoided" },
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
      { name: "Atlanta, GA", kind: "Partner hub", status: "Going live Nov 25", orders: 0, costPerOrder: "—", onTime: "—", days: "—", problems: 0 },
    ],
    problems: [
      { id: "p1", who: "you", title: "Approve the Atlanta delivery zones", detail: "We suggest 7 states from Atlanta, 2,100 orders a month.", site: "Atlanta", due: "Oct 30", cta: "Approve" },
      { id: "p2", who: "you", title: "Re-stock 4 SKUs running low in Reno", detail: "Out in 9 days at today's pace. Suggested transfer ready.", site: "Reno", due: "Today", cta: "Approve" },
      { id: "p3", who: "us", title: "Reno receiving 1 day behind", detail: "A truck arrived late. Back on schedule Thursday.", site: "Reno", due: "Oct 23" },
      { id: "p4", who: "us", title: "2 parcels with no scan for 3 days", detail: "Traced with UPS. Reshipping if not found by tomorrow.", site: "Columbus", due: "Oct 22" },
    ],
    recs: [
      { id: "r1", title: "Truck Southeast orders to Atlanta", body: "The last step of your plan: 2,100 orders a month, about $2,700 less and a day faster.", cta: "See the numbers", value: "$2,700/mo" },
      { id: "r2", title: "Show delivery dates at checkout", body: "With Reno live, 74% of your customers can be promised 2 days.", cta: "See the numbers", value: "2-day promise" },
      { id: "r3", title: "Turn on your branded tracking page", body: "Customers see your logo and delivery date instead of the carrier's page.", cta: "Set it up", value: "Shiplet", shiplet: "tracking" },
    ],
    report: {
      numbers: [{ label: "Cost per order", value: "$11.21", change: "−$1.09" }, { label: "Delivered on time", value: "96.4%", change: "+0.8 pts" }, { label: "Customers within 2 days", value: "74%", change: "+20 pts" }, { label: "Problems solved by us", value: "311", change: "of 326" }],
      notes: ["Reno's first full quarter: West Coast orders arrive in 1.6 days instead of 4.8.", "Midwest orders moved to a regional carrier: same days, 11% cheaper.", "Next: Atlanta goes live Nov 25 for the Southeast."],
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
