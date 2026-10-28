import type { BrandId } from "./scenarios";

// ── Shiplets: templates first, then each account's one app ───────────────────
// How Eugene's Shiplet.ai works (demo, Oct 27): invite-only, one app per
// account, built on the ShipTime API in steps the client can always see, from
// a locked template repo. In that call we agreed the client starts from a
// template ("you pick a template first, or I start from anything I want"), and
// that templates can be made for markets worth targeting (dental labs,
// printing). So a template here is a working app with starting points: what it
// always does, plus the settings a client changes to make it theirs. The app
// remembers what they changed; whatever they left at the starting point is
// what they confirm on the prototype. ShipTime's gates stay behind the scenes,
// and the app runs on its own address in the client's brand.

// The client's steps, named as in Shiplet.ai's own portal (Oct 28 read of the
// live app), in Koherent's voice ("we", not "ShipTime"). "live" is the end of
// the last step, not a step of its own.
export type AppStage = "describe" | "check" | "prepare" | "preview" | "build" | "test" | "signoff" | "live";
export const STAGES: { id: AppStage; label: string }[] = [
  { id: "describe", label: "Describe it" },
  { id: "check", label: "We review it" },
  { id: "prepare", label: "We prepare a prototype" },
  { id: "preview", label: "You review the prototype" },
  { id: "build", label: "We build it" },
  { id: "test", label: "You try it in a sandbox" },
  { id: "signoff", label: "You sign off, it goes live" },
];

export type Value = number | string | string[];
export type Setting = {
  id: string;
  label: string; // the question, short
  kind: "money" | "number" | "choice" | "multi";
  prefix?: string;
  unit?: string;
  options?: string[];
  start: Value; // the template's starting point
  say: (v: Value) => string; // the same setting as a sentence, for the spec and the review
};
export type Use = "rates" | "rules" | "tracking" | "labels" | "warehouses" | "customs";
export type TemplateId = "returns" | "customs" | "counter" | "quote" | "today" | "splitter" | "dental" | "print";
export type Template = {
  id: TemplateId;
  name: string;
  tagline: string;
  for: string;
  group: "Customers" | "Warehouse" | "Stores" | "Industry";
  industry?: string;
  tabs: string[]; // the app's own menu, one per screen
  flow: { title: string; text: string }[]; // how it works, one step per screen
  roles: { name: string; does: string }[];
  signIn: string[]; // the roles you can view the screens as
  always: string[];
  settings: Setting[];
  uses: Use[];
  build: string;
  questions: string[]; // what the account manager usually needs to ask
  leftOut: string[]; // what the template deliberately doesn't do, shown at sign-off
};

const n = (v: Value) => (v as number).toLocaleString("en-US");
const s = (v: Value) => v as string;
const or = (v: Value) => { const a = v as string[]; return a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} or ${a[a.length - 1]}`; };
const and = (v: Value) => { const a = v as string[]; return a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a[a.length - 1]}`; };
const lower = (x: string) => x.charAt(0).toLowerCase() + x.slice(1);

export const TEMPLATES: Template[] = [
  {
    id: "returns", name: "Returns desk", group: "Customers", for: "Customer service teams",
    tagline: "Start a return from the original shipment, let the customer say why, and send the label at your rates.",
    tabs: ["Returns", "New return", "Customer page"],
    flow: [
      { title: "See every return", text: "Pending, in process and done, with the ones waiting on a manager marked." },
      { title: "Start one from the shipment", text: "Type the original shipment number and the customer and items fill in." },
      { title: "The customer says why", text: "They get a one-time link to tell you why and choose what they'd like." },
    ],
    roles: [
      { name: "Staff", does: "Start returns and send the customer the link" },
      { name: "Manager", does: "Approve the expensive ones" },
      { name: "Customer", does: "Say why, choose an option, follow the return" },
      { name: "Admin", does: "Add and remove people" },
    ],
    signIn: ["Staff", "Manager"],
    always: [
      "Starts every return from the original shipment.",
      "Lists returns as Pending, In process or Done.",
      "Makes the return label with your ShipTime rates.",
      "Lets the customer follow the return from the same link.",
    ],
    settings: [
      { id: "approve", label: "A manager approves returns worth over", kind: "money", prefix: "$", start: 200, say: (v) => `Returns worth over $${n(v)} need a manager's approval before the label is made.` },
      { id: "choices", label: "The customer can choose", kind: "multi", options: ["Refund", "Replacement", "Store credit"], start: ["Refund", "Replacement"], say: (v) => `The customer can choose ${or((v as string[]).map((x) => (x === "Store credit" ? "store credit" : `a ${x.toLowerCase()}`)))}.` },
      { id: "window", label: "Returns are accepted for", kind: "number", unit: "days", start: 30, say: (v) => `Returns are accepted for ${n(v)} days after delivery.` },
      { id: "pays", label: "Return shipping is paid by", kind: "choice", options: ["You", "The customer"], start: "You", say: (v) => (v === "You" ? "You pay for return shipping." : "The customer pays for return shipping; it comes off the refund.") },
      { id: "link", label: "The customer gets the link by", kind: "multi", options: ["Email", "Text"], start: ["Email"], say: (v) => `The customer gets the return link by ${and(v).toLowerCase()}.` },
    ],
    uses: ["rates", "rules", "tracking"],
    build: "About a week",
    questions: ["Can customers start a return themselves, or only your team?", "Should a damaged item need a photo before anyone approves it?"],
    leftOut: ["Exchanges for a different product", "Paying out refunds (your team refunds in your store's system)"],
  },
  {
    id: "customs", name: "Customs check", group: "Warehouse", for: "Teams shipping to Canada",
    tagline: "Check cross-border orders before they leave: HS codes, duties, and the commercial invoice printed with the label.",
    tabs: ["Check an order", "Fix", "Ready to ship"],
    flow: [
      { title: "Look up the order", text: "Items with no HS code or country of origin are flagged before anything ships." },
      { title: "Fix what's missing", text: "Add the code and the duties estimate updates." },
      { title: "Print the paperwork with the label", text: "The commercial invoice and the label come out together." },
    ],
    roles: [
      { name: "Staff", does: "Check orders and fix what's missing" },
      { name: "Manager", does: "Approve new HS codes and big orders" },
    ],
    signIn: ["Staff", "Manager"],
    always: [
      "Looks up an order by its order number.",
      "Shows each item's HS code and country of origin.",
      "Flags items with no HS code before anything ships.",
      "Makes the commercial invoice as a PDF with the label.",
      "Emails the customer the tracking link.",
    ],
    settings: [
      { id: "duties", label: "Duties and taxes are paid by", kind: "choice", options: ["You", "The customer"], start: "You", say: (v) => (v === "You" ? "You pay duties and taxes, so customers pay nothing at the door." : "The customer pays duties and taxes at the door.") },
      { id: "codes", label: "New HS codes are approved by", kind: "choice", options: ["A manager", "Anyone on the team"], start: "A manager", say: (v) => (v === "A manager" ? "Staff can add a missing HS code; a manager approves new ones." : "Anyone on the team can add a new HS code.") },
      { id: "hold", label: "Orders wait for a manager when worth over", kind: "money", prefix: "CA$", start: 2500, say: (v) => `Orders worth over CA$${n(v)} wait for a manager.` },
      { id: "service", label: "The service, unless your rules say otherwise", kind: "choice", options: ["Canada Post Expedited", "UPS Standard", "The cheapest in 5 days"], start: "Canada Post Expedited", say: (v) => `Orders go by ${v === "The cheapest in 5 days" ? "the cheapest service that arrives in 5 days" : s(v)} unless your rules say otherwise.` },
      { id: "currency", label: "Duties are shown in", kind: "choice", options: ["CA$", "US$"], start: "CA$", say: (v) => `Duties and taxes are estimated in ${v === "CA$" ? "Canadian" : "US"} dollars.` },
    ],
    uses: ["rates", "customs", "tracking"],
    build: "About a week",
    questions: ["When an item has no country of origin either, can staff still ship it?", "Should orders to Quebec get a French commercial invoice?"],
    leftOut: ["Filing with Canada's border agency for you (the carrier's broker still does that)"],
  },
  {
    id: "counter", name: "Store counter", group: "Stores", for: "Retail stores",
    tagline: "Ship from the store: find the order, pick from the best options, print the label and text the customer.",
    tabs: ["Ship", "Options", "Done"],
    flow: [
      { title: "Find the order", text: "By order number or customer name, at the counter." },
      { title: "Pick from the best options", text: "Your rates, sorted the way your stores want." },
      { title: "Print and tell the customer", text: "The label prints at the counter and the customer gets the tracking link." },
    ],
    roles: [
      { name: "Staff", does: "Ship orders from their store" },
      { name: "Manager", does: "See every store and the spend by store" },
      { name: "Admin", does: "Add stores and staff" },
    ],
    signIn: ["Staff", "Manager"],
    always: [
      "Finds an order by number or customer name.",
      "Prints the label on the store's counter printer.",
      "Shows each store only its own shipments.",
      "Shows managers every store and the spend by store.",
    ],
    settings: [
      { id: "count", label: "Options shown at the counter", kind: "choice", options: ["2", "3", "5"], start: "3", say: (v) => `The app shows the ${s(v)} best options.` },
      { id: "sort", label: "Options are sorted by", kind: "choice", options: ["Price", "Arrival day"], start: "Price", say: (v) => `Options are sorted by ${lower(s(v))}.` },
      { id: "freight", label: "Goes as freight when heavier than", kind: "number", unit: "lb", start: 70, say: (v) => `Items over ${n(v)} lb go as freight, the same as your rules.` },
      { id: "notify", label: "The customer gets tracking by", kind: "multi", options: ["Text", "Email"], start: ["Text"], say: (v) => `The customer gets the tracking link by ${and(v).toLowerCase()}.` },
    ],
    uses: ["rates", "rules", "labels", "tracking"],
    build: "About a week",
    questions: ["Can staff ship from another store's stock?", "Do orders over a set amount need a signature on delivery?"],
    leftOut: ["Booking a delivery time slot with the customer", "Shipping from another store's stock"],
  },
  // The next three are the "Ideas to get you started" in Shiplet.ai's own
  // portal (a sales cost calculator, today's shipments, a wholesale order
  // splitter), made into templates. Its returns board is our Returns desk.
  {
    id: "quote", name: "Sales quote calculator", group: "Customers", for: "Sales teams",
    tagline: "Reps quote shipping on the spot: enter the address and the boxes, and see your rates side by side, cheapest and fastest first.",
    tabs: ["New quote", "Rates", "Quotes"],
    flow: [
      { title: "Enter the address and the boxes", text: "While the customer is still on the phone." },
      { title: "See your rates side by side", text: "Cheapest and fastest first, from your ShipTime rates." },
      { title: "Send the quote", text: "Every quote is saved, so you can see which became orders." },
    ],
    roles: [
      { name: "Sales rep", does: "Quote shipping before the customer orders" },
      { name: "Sales manager", does: "See every quote and which became orders" },
      { name: "Admin", does: "Add and remove reps" },
    ],
    signIn: ["Sales rep", "Sales manager"],
    always: [
      "Quotes from your ShipTime rates, not list prices.",
      "Shows the cheapest and the fastest first.",
      "Saves every quote with the customer's name.",
      "Never buys a label: it only quotes.",
    ],
    settings: [
      { id: "markup", label: "Add to every quote", kind: "number", unit: "%", start: 0, say: (v) => (v ? `Quotes add ${n(v)}% on top of your rates.` : "Quotes show your rates as they are.") },
      { id: "show", label: "Rates shown", kind: "choice", options: ["Cheapest and fastest", "Every carrier"], start: "Cheapest and fastest", say: (v) => (v === "Every carrier" ? "Reps see every carrier's rate." : "Reps see the cheapest and fastest options.") },
      { id: "valid", label: "Quotes are good for", kind: "choice", options: ["7 days", "14 days", "30 days"], start: "14 days", say: (v) => `Quotes are good for ${s(v)}.` },
      { id: "send", label: "Reps send the quote as", kind: "multi", options: ["Email", "PDF"], start: ["Email"], say: (v) => `Reps send quotes as ${and(v).replace("Email", "an email").replace("PDF", "a PDF")}.` },
    ],
    uses: ["rates", "rules"],
    build: "About a week",
    questions: ["Should reps see your cost, or only the price with any markup?", "Do freight quotes over 150 lb need a manager?"],
    leftOut: ["Booking the shipment from the quote (quotes only, for now)"],
  },
  {
    id: "today", name: "Today's shipments", group: "Warehouse", for: "Operations leads",
    tagline: "One page each morning: what shipped today and this week, with anything not delivered after three days at the top.",
    tabs: ["Today", "This week", "Follow up"],
    flow: [
      { title: "See what shipped today", text: "Carrier, tracking number and status for every shipment." },
      { title: "Look back over the week", text: "By day and by carrier, with how many arrived on time." },
      { title: "Follow up before the customer calls", text: "Anything late is at the top, with who's on it." },
    ],
    roles: [
      { name: "Operations lead", does: "Checks it every morning" },
      { name: "Customer service", does: "Follows up on the late ones" },
    ],
    signIn: ["Operations lead", "Customer service"],
    always: [
      "Lists every shipment with its carrier, tracking number and status.",
      "Updates through the day from carrier scans.",
      "Shows only your account's shipments.",
    ],
    settings: [
      { id: "late", label: "Late when not delivered after", kind: "number", unit: "days", start: 3, say: (v) => `A shipment counts as late when it isn't delivered after ${n(v)} days.` },
      { id: "order", label: "The list starts with", kind: "choice", options: ["Late ones", "Newest"], start: "Late ones", say: (v) => (v === "Newest" ? "The newest shipments are listed first." : "Late shipments are listed first.") },
      { id: "email", label: "Morning summary by email", kind: "choice", options: ["Off", "8:00 am", "9:00 am"], start: "Off", say: (v) => (v === "Off" ? "No morning email." : `A summary is emailed at ${s(v)} each weekday.`) },
    ],
    uses: ["tracking"],
    build: "About a week",
    questions: ["Do weekends count toward the days before a shipment is late?", "Should returns be on the page too, or only outgoing shipments?"],
    leftOut: ["Messaging the customer from the page"],
  },
  {
    id: "splitter", name: "Wholesale order splitter", group: "Warehouse", for: "Wholesale packing teams",
    tagline: "Big wholesale orders go out in cartons: the app splits the order, keeps fragile and heavy apart, and buys one label per carton.",
    tabs: ["Orders to split", "Cartons", "Labels"],
    flow: [
      { title: "Orders to split", text: "Wholesale orders over the limit, not yet labelled." },
      { title: "How each order was divided", text: "Cartons within your limit, fragile and heavy kept apart." },
      { title: "One label per carton", text: "A label and a packing slip for each, on one pickup per store." },
    ],
    roles: [
      { name: "Packer", does: "Split, pack and label orders" },
      { name: "Manager", does: "Set the carton limits" },
    ],
    signIn: ["Packer", "Manager"],
    always: [
      "Keeps fragile items and heavy items in separate cartons.",
      "Buys one ShipTime label per carton.",
      "Prints a packing slip per carton with only that carton's items.",
      "Lets a packer undo the split before labels are bought.",
    ],
    settings: [
      { id: "max", label: "Most units in one carton", kind: "number", unit: "units", start: 30, say: (v) => `Orders are split into cartons of ${n(v)} units or fewer.` },
      { id: "heavy", label: "An item counts as heavy over", kind: "number", unit: "lb", start: 40, say: (v) => `Items over ${n(v)} lb count as heavy.` },
      { id: "pickup", label: "Pickups", kind: "choice", options: ["One per store", "One per carton"], start: "One per store", say: (v) => (v === "One per store" ? "Cartons for the same store go on one pickup." : "Each carton is picked up on its own.") },
    ],
    uses: ["rates", "labels", "rules"],
    build: "About a week",
    questions: ["When an order doesn't split evenly, should the last carton be the small one, or should cartons be balanced?", "Does glassware count as fragile even when it's double-boxed?"],
    leftOut: ["Automatic reorder of cartons by weight", "Importing last year's wholesale orders"],
  },
  {
    id: "dental", name: "Dental lab cases", group: "Industry", industry: "Dental labs", for: "Dental labs and their clinics",
    tagline: "Clinics book case pickups, and finished cases go back before the patient's appointment.",
    tabs: ["Book a pickup", "Cases", "Send back"],
    flow: [
      { title: "A clinic books a pickup", text: "Case number and appointment date, and a courier is on the way." },
      { title: "Every case in and out", text: "The lab sees what's arriving, in work and due back." },
      { title: "Back before the appointment", text: "The service is picked so the case arrives early." },
    ],
    roles: [
      { name: "Clinic", does: "Book pickups and follow their cases" },
      { name: "Lab staff", does: "Receive cases and send them back" },
      { name: "Manager", does: "See every clinic and the cost per case" },
    ],
    signIn: ["Clinic", "Lab staff"],
    always: [
      "Clinics book a pickup with the case number and the appointment date.",
      "Shows the lab every case arriving, in work and due back.",
      "Makes the return label when a case is finished.",
      "Keeps patient names out: cases go by number.",
    ],
    settings: [
      { id: "cutoff", label: "Same-day pickup when booked by", kind: "choice", options: ["12:00 pm", "2:00 pm", "4:00 pm"], start: "2:00 pm", say: (v) => `Pickups booked by ${s(v)} are collected the same day.` },
      { id: "early", label: "Cases arrive before the appointment by", kind: "choice", options: ["1 business day", "2 business days"], start: "1 business day", say: (v) => `Finished cases arrive ${s(v)} before the appointment.` },
      { id: "box", label: "Packaging", kind: "choice", options: ["The lab sends prepaid boxes", "Clinics use their own"], start: "The lab sends prepaid boxes", say: (v) => (v === "The lab sends prepaid boxes" ? "The lab sends clinics prepaid boxes." : "Clinics pack cases in their own boxes.") },
      { id: "notify", label: "Clinics hear by", kind: "multi", options: ["Email", "Text"], start: ["Email"], say: (v) => `Clinics get updates by ${and(v).toLowerCase()}.` },
    ],
    uses: ["rates", "labels", "tracking"],
    build: "About a week",
    questions: ["Do some clinics need a pickup every day, booked or not?", "Should a case due back tomorrow go overnight even when it costs more?"],
    leftOut: ["Billing clinics for the cases"],
  },
  {
    id: "print", name: "Print shop jobs", group: "Industry", industry: "Print shops", for: "Print shops",
    tagline: "A finished job ships the day it's printed, to one address or a hundred, on a service picked by its due date.",
    tabs: ["Ready to ship", "Split", "Customer page"],
    flow: [
      { title: "Jobs ready to ship", text: "Everything off the press today, with its due date." },
      { title: "Split to many addresses", text: "Upload the list and get one label per address, priced in one go." },
      { title: "The customer follows the job", text: "One page with every parcel in it." },
    ],
    roles: [
      { name: "Staff", does: "Ship finished jobs" },
      { name: "Customer", does: "Send address lists and follow deliveries" },
      { name: "Manager", does: "See shipping cost per job" },
    ],
    signIn: ["Staff", "Customer"],
    always: [
      "Lists every job ready to ship, with its due date.",
      "Ships one job to many addresses from an uploaded list.",
      "Gives the customer one tracking page for the whole job.",
    ],
    settings: [
      { id: "pick", label: "Each job goes by", kind: "choice", options: ["The cheapest on time", "The fastest"], start: "The cheapest on time", say: (v) => (v === "The fastest" ? "Each job goes by the fastest service." : "Each job goes by the cheapest service that arrives by its due date.") },
      { id: "lists", label: "Address lists", kind: "choice", options: ["CSV or Excel", "CSV only"], start: "CSV or Excel", say: (v) => `Address lists can be ${v === "CSV only" ? "a CSV file" : "a CSV or Excel file"}.` },
      { id: "photo", label: "A photo of the job before it ships", kind: "choice", options: ["Off", "On"], start: "Off", say: (v) => (v === "On" ? "Staff photograph each job before it ships." : "No photo is taken before shipping.") },
      { id: "cost", label: "Shipping is", kind: "choice", options: ["Added to the invoice", "In the price"], start: "Added to the invoice", say: (v) => (v === "In the price" ? "Shipping is included in the job's price." : "Shipping is added to the customer's invoice.") },
    ],
    uses: ["rates", "labels", "tracking"],
    build: "About a week",
    questions: ["Can a customer change an address after the labels are made?", "Should a job split across addresses ship on one day, or as parts are ready?"],
    leftOut: ["Proof approval before printing"],
  },
];

export const templateOf = (id: string) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
export const valueOf = (t: Template, settings: Record<string, Value>, id: string): Value => settings[id] ?? t.settings.find((x) => x.id === id)!.start;
export const same = (a: Value, b: Value) => JSON.stringify(a) === JSON.stringify(b);
export const changedIn = (t: Template, settings: Record<string, Value>) => t.settings.filter((x) => x.id in settings && !same(settings[x.id], x.start));

// ── An account's app ──

export type AppEvent = { when: string; who: string; text: string };
export type ShipletApp = {
  template: TemplateId;
  name: string;
  slug: string;
  described: string; // what the client wrote, quoted back ("" if they only changed settings)
  settings: Record<string, Value>; // only what they changed from the template
  stage: AppStage;
  since: string; // when it reached this step
  dates: Partial<Record<AppStage, string>>;
  events: AppEvent[];
  ready?: string; // when the sandbox will be ready (build step)
  logins?: { role: string; email: string }[];
  live?: { since: string; version: number; people: number; peopleNote: string; labels: number; labelsBefore: number; labelWord: string };
  change?: { text: string; when: string };
  justLive?: boolean;
  questions?: { q: string; a?: string }[]; // asked by the account manager while reviewing
  revision?: { text: string; when: string }; // changes asked to the prototype (version 2 on its way)
  checks?: Record<string, { ok: boolean; note?: string }>; // the client's marks in the sandbox
  signed?: { name: string; goLive: string }; // signed off; goes live then
};

// Everything the app does, one line each: what the template always does, then
// each setting as it's set. The sandbox checklist and the sign-off use it.
export const itemsOf = (t: Template, settings: Record<string, Value>) => [
  ...t.always.map((text, i) => ({ id: `a${i}`, text })),
  ...t.settings.map((x) => ({ id: x.id, text: x.say(valueOf(t, settings, x.id)) })),
];

const returnsDesk: ShipletApp = {
  template: "returns", name: "Returns desk", slug: "returns",
  described: "Our customer service team handles returns by email and makes return labels by hand. Furniture comes back late, so we give people longer.",
  settings: { window: 60 },
  stage: "live", since: "Oct 12",
  dates: { describe: "Sep 29", check: "Oct 1", prepare: "Oct 1", preview: "Oct 3", build: "Oct 5", test: "Oct 9", signoff: "Oct 12", live: "Oct 12" },
  events: [
    { when: "Oct 12", who: "Jordan Reyes", text: "Signed off. Live at returns.alderandstone.com." },
    { when: "Oct 9", who: "ShipTime", text: "Made the sandbox. Security, quality and design checks passed." },
    { when: "Oct 5", who: "Jordan Reyes", text: "Approved the prototype after 2 changes." },
    { when: "Oct 1", who: "Matteo Grassi", text: "Read it back with you and answered your 3 questions." },
    { when: "Sep 29", who: "Jordan Reyes", text: "Started from the Returns desk template, with 1 change." },
  ],
  live: { since: "Oct 12", version: 1, people: 11, peopleNote: "9 staff, 2 managers", labels: 64, labelsBefore: 48, labelWord: "Return labels" },
};

const storeCounter: ShipletApp = {
  template: "counter", name: "Store counter", slug: "counter",
  described: "Customers buy heavy items in store and want them delivered. Staff call the warehouse or guess a carrier.",
  settings: { notify: ["Text", "Email"] },
  stage: "test", since: "Oct 20",
  dates: { describe: "Oct 6", check: "Oct 8", prepare: "Oct 8", preview: "Oct 9", build: "Oct 15", test: "Oct 20" },
  events: [
    { when: "Oct 20", who: "ShipTime", text: "Made the sandbox. Security, quality and design checks passed." },
    { when: "Oct 15", who: "Dana Kim", text: "Approved the prototype." },
    { when: "Oct 8", who: "Matteo Grassi", text: "Read it back with you on the weekly call." },
    { when: "Oct 6", who: "Dana Kim", text: "Started from the Store counter template, with 1 change." },
  ],
  logins: [
    { role: "Staff", email: "staff@sunbelt.test" },
    { role: "Manager", email: "manager@sunbelt.test" },
    { role: "Admin", email: "admin@sunbelt.test" },
  ],
};

// Only Koherent accounts are invited for now; ShipTime accounts don't see
// Shiplets at all (Eugene: vetted accounts only). Northpeak hasn't started
// one, so it shows the way in: templates first.
export const appsAtStart: Record<BrandId, ShipletApp | null> = {
  small: null,
  canada: null,
  stores: storeCounter,
  reach: returnsDesk,
};

// Each customer's app is in their own colours, not Koherent's.
export const appColor: Record<BrandId, string> = { small: "#1A1B25", canada: "#1F4E79", stores: "#A8481A", reach: "#3B5A4A" };

// The app's own address, on the client's domain.
export const appUrl = (account: string, slug: string) => `${slug}.${account.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "")}.com`;

// Questions the client hasn't answered yet.
export const openQuestions = (a: ShipletApp) => (a.questions ?? []).filter((q) => !q.a);
// Every line marked "Works" in the sandbox.
export const allChecked = (a: ShipletApp) => itemsOf(templateOf(a.template), a.settings).every((i) => a.checks?.[i.id]?.ok);

// Whose turn it is: "you", "Matteo" (the account manager) or "ShipTime" (the apps team).
export const waitingOn = (a: ShipletApp): "you" | "Matteo" | "ShipTime" | "" =>
  a.change ? "Matteo"
    : a.stage === "check" ? (openQuestions(a).length ? "you" : "Matteo")
      : a.stage === "preview" || a.stage === "test" || a.stage === "describe" || (a.stage === "signoff" && !a.signed) ? "you"
      : a.revision ? "ShipTime"
        : a.stage === "build" || a.stage === "prepare" ? "ShipTime" : "";

// A new app from a template, sent to the account manager.
export function startApp(t: Template, settings: Record<string, Value>, described: string, who: string, when: string): ShipletApp {
  const changed = changedIn(t, settings).length;
  return {
    template: t.id, name: t.name, slug: t.id, described, settings,
    stage: "check", since: when, dates: { describe: "Today", check: "Today" },
    events: [{ when, who, text: `Started from the ${t.name} template${changed ? `, with ${changed} change${changed > 1 ? "s" : ""}` : ""}.` }],
  };
}
