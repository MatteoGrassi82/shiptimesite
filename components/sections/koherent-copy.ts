import { PAGES } from "./koherent-brand";
import type { NoteData } from "./koherent-ui";

// ── Revision 2 copy (Oct 30) ─────────────────────────────────────────────────
// Jenny's "Koherent Website Copy – Draft v1" (Oct 29), page by page, in her
// words. What changes is the shape, not the wording: a sentence that lists
// things becomes a list, a paragraph of steps becomes steps. Her one naming
// rule from the same day's email applies everywhere: "custom shipping
// applet", never "Shiplet".
// Each bracketed "Confirm…" in her draft is a note on the block it belongs
// to. Who confirms is her name where she gave one (David, Peter's team) and
// otherwise a suggestion by role; /koherent/review says which is which.
// No "use client": server pages and the client nav both read this.

export type Widget =
  | "console"
  | "rateCard"
  | "rateSwitches"
  | "map"
  | "applet"
  | "team"
  | "integrations"
  | "logos"
  | "triangle"
  | "method"
  | "bento"
  | "cases"
  | "spectrum"
  | "pieces"
  | "score"
  | "audit"
  | "api"
  | "groups";

export type Card = { title: string; body?: string; href?: string; id?: string; logo?: string };

export type Block = {
  id?: string;
  label?: string;
  heading: string;
  body?: string[];
  intro?: string;
  items?: string[];
  cards?: Card[];
  steps?: Card[];
  layers?: { name: string; body: string; widget: Widget; notes?: NoteData[] }[];
  outro?: string;
  widget?: Widget;
  wide?: boolean;
  cols?: 2 | 3 | 4 | 5;
  notes?: NoteData[];
};

export type Cta = { label: string; href: string };

export type Page = {
  key: string;
  path: string;
  label: string;
  title: string;
  description: string;
  headline: string;
  subhead?: string;
  cta: Cta;
  secondary?: Cta;
  hero: Widget;
  heroNotes?: NoteData[];
  blocks: Block[];
  close: { heading: string; body?: string; cta: Cta; notes?: NoteData[] };
};

const advisor: Cta = { label: "Talk to a logistics advisor", href: PAGES.contact };

// The notes that recur: the 800 figure, the Five String earnout, the
// threshold between ShipTime and the Growing brands door.
const n800: NoteData = { who: "Michael", text: "Confirm the 800 figure. Michael gave 800 warehouses on Oct 27." };
const nThreshold: NoteData = {
  who: "Jenny and Michael",
  kind: "decide",
  text: "Growing brands starts at 50 orders a month in this draft. The live site sends anyone under 500 to ShipTime (tiers set Oct 28, for Michael to confirm). Pick one threshold for both.",
};

// ── Home ─────────────────────────────────────────────────────────────────────
export const HOME = {
  label: "Logistics, designed and run with you",
  headlines: [
    { key: "jenny", label: "Jenny’s draft", text: "Your logistics should run like one system, and now it does." },
    { key: "outcome", label: "The outcome line", text: "Shipping software sells you a label. A 3PL sells you a building. We sell you the outcome." },
    { key: "live", label: "Live site today", text: "Your managed logistics network." },
  ],
  subhead: "Koherent decides how every order should move, moves it through the right carriers and warehouses, and stands behind the result from label to doorstep.",
  cta: advisor,
  secondary: { label: "See how it works", href: PAGES.los },
  // three promises from the pages below, in her words
  ticks: ["Your carrier contracts or ours", "One team responsible for the result", "No sales deck until you ask for one"],
  heroNotes: [
    { who: "Jenny and Michael", kind: "decide", text: "Which headline leads? The switch above tries Jenny’s draft, her outcome line, or “Your managed logistics network.” from the live site (Michael, Oct 27)." },
    { who: "Jenny and Chris", kind: "decide", text: "Jenny’s copy leads with “Talk to a logistics advisor”; Chris (Aug 7) asked for the score as the main button. Both stay: the advisor here, the score in the nav and in every closing band." },
  ] as NoteData[],
  facts: [
    ["2M+", "shipments a year"],
    ["1,000+", "active merchants"],
    ["20 years", "of carrier relationships"],
    ["800+", "warehouse locations"],
  ] as [string, string][],
  factsNotes: [
    { who: "Michael", text: "Confirm all four figures against the current corporate deck before launch. 2M+, 1,000+ and 20 years are already on the live site; Michael gave 800 warehouses on Oct 27." },
  ] as NoteData[],
  outcome: {
    heading: "Shipping software sells you a label. A 3PL sells you a building. We sell you the outcome.",
    body: "Most growing brands end up running logistics out of four or five tools and two or three vendors, and nobody owns the whole thing. When a shipment goes wrong, the software points at the carrier, the carrier points at the warehouse, and you are the one on the phone. Koherent puts the platform, the carrier network, the warehouses and the support team under one roof, so there is one party responsible when it works and one party responsible when it does not.",
  },
  doors: {
    heading: "Start at the door that fits your business.",
    cards: [
      { title: "Growing brands.", href: PAGES.growing, body: "You are shipping somewhere between 50 and 1,000 orders a month, you have outgrown the tools you started with, and you are not ready to hand everything to a 3PL. We give you better rates, one platform and a team that answers the phone." },
      { title: "Enterprise brands.", href: PAGES.enterprise, body: "You ship from more than one location, you have your own carrier contracts, and you need one partner accountable for the whole flow. We run it for you, with your rates or ours." },
      { title: "3PL and fulfillment partners.", href: PAGES.partners, body: "You run a warehouse and want more merchants, better shipping margins and a network that sends work your way. We bring the demand and the technology, and you keep running the floor." },
    ] as Card[],
    notes: [nThreshold],
  },
  solutions: {
    heading: "Four solutions, bought together or one at a time.",
    cards: [
      { title: "Ship", href: PAGES.ship, body: "Ship moves every parcel and pallet through the best carrier at the best rate, across the border and to the door." },
      { title: "Fulfill", href: PAGES.fulfill, body: "Fulfill places your inventory in the right warehouses across North America without you owning a building." },
      { title: "Optimize", href: PAGES.optimize, body: "Optimize finds the money and time hiding in your shipping data and keeps finding it every day." },
      { title: "Manage", href: PAGES.manage, body: "Manage connects your systems to ours and gives you one team responsible for the result." },
    ] as Card[],
    outro: "Every brand starts with Ship, and most add the rest as they grow.",
  },
  proof: {
    heading: "We have been doing this for a while.",
    body: "The platform behind Koherent moves more than two million shipments a year for more than a thousand active merchants, backed by twenty years of carrier relationships and a network of more than 800 warehouse locations across the United States and Canada.",
    notes: [
      { who: "Michael", text: "Customer logo row: PG Golf, Kahoots and InnoWave are pending approval. Until then, the three cases below, anonymized as on the live site." },
    ] as NoteData[],
  },
  advisors: {
    heading: "Talk to someone who has run a logistics operation.",
    body: "Our advisors are shippers first. Tell us how many orders you move, where they go and what is slowing you down, and we will tell you plainly whether Koherent is a fit. There is no sales deck until you ask for one.",
    cta: advisor,
  },
};

// ── The pages ────────────────────────────────────────────────────────────────
export const PAGES_R2: Page[] = [
  {
    key: "los",
    path: PAGES.los,
    label: "How it fits together",
    title: "What is a logistics operating system?",
    description: "A logistics operating system is what you get when the software, the network and the team all answer to the same people.",
    headline: "A logistics operating system is what you get when the software, the network and the team all answer to the same people.",
    subhead: "It decides how every order should move, moves it, and owns the outcome. Here is what that means in practice.",
    cta: { label: "See the four solutions", href: `${PAGES.home}#solutions` },
    hero: "pieces",
    heroNotes: [
      { who: "Jenny", kind: "decide", text: "“Logistics operating system” is already used by software vendors (Orbit, Trenvar, CargoWise, Predictim), so it works as this explainer page rather than as the claim." },
    ],
    blocks: [
      {
        heading: "The problem is that your logistics has no operating system.",
        body: [
          "Your store talks to your shipping software. Your shipping software talks to six carriers. Your warehouse runs on something else. Your returns run on email. Each piece works on its own, and each piece optimizes for itself, which is why you can have the cheapest label on every shipment and still spend too much on shipping. Nobody is optimizing the whole system because nobody can see the whole system.",
        ],
      },
      {
        id: "layers",
        heading: "Koherent runs on three layers that were built to work together.",
        layers: [
          { name: "The platform", widget: "console", body: "The platform is the software layer. It shops rates across every carrier you use, prints the labels, automates the rules, connects to your cart, marketplace, WMS or ERP, and reports on all of it in one place." },
          {
            name: "The network",
            widget: "map",
            body: "The network is the physical layer. It includes carrier relationships built over twenty years, national and regional couriers, LTL and full-truckload freight, cross-border lanes, big and bulky final mile, and more than 800 warehouse locations where your inventory can sit closer to your customers.",
            notes: [
              { who: "Michael", text: "Confirm the 800 figure and whether final mile can be named before the Five String earnout ends. Michael gave 800 warehouses on Oct 27." },
            ],
          },
          {
            name: "The team",
            widget: "team",
            body: "The team is the managed layer. It includes onboarding, Heroic Support™, claims and adjustments handled for you, and for enterprise customers a single point of responsibility who owns your account and your numbers.",
            notes: [
              { who: "Jenny", kind: "decide", text: "The team is the difference, but it’s the only layer without a menu: Platform and Network have one. A “How it works” menu with all three, or a Team page?" },
            ],
          },
        ],
      },
      {
        heading: "What changes when the three layers work as one.",
        body: [
          "You stop optimizing one shipment at a time and start optimizing the whole flow. Inventory moves to where the orders are. Carrier selection happens on every order, against your rules, with your rates if you have them. The system watches its own performance every day instead of waiting for the annual rate review. And when something goes wrong, the people who fix it are the same people who built the system, so you make one call.",
        ],
        widget: "bento",
        wide: true,
      },
      {
        heading: "What it is not.",
        cards: [
          { title: "It is not a shipping app with a fulfillment partner bolted on." },
          { title: "It is not a 3PL that wrote some software." },
          { title: "And it is not an all-or-nothing contract." },
        ],
        cols: 3,
        outro: "Every solution works on its own, with our network or with yours, and you add the rest when it makes sense.",
      },
    ],
    close: { heading: "Four solutions, bought together or one at a time.", cta: { label: "See the four solutions", href: `${PAGES.home}#solutions` } },
  },

  {
    key: "growing",
    path: PAGES.growing,
    label: "Who we help",
    title: "Growing brands",
    description: "Koherent gives brands shipping 50 to 1,000 orders a month better rates, one platform and a team that answers the phone.",
    headline: "You have outgrown the tools you started with, and you are not ready to hand everything to a 3PL.",
    subhead: "Koherent gives brands shipping 50 to 1,000 orders a month better rates, one platform and a team that answers the phone, without a contract or a minimum.",
    cta: { label: "Get a 15-minute rate comparison", href: PAGES.contact },
    hero: "rateCard",
    heroNotes: [nThreshold],
    blocks: [
      {
        heading: "You know the signs.",
        cards: [
          { title: "Shipping is your second-biggest cost after the product itself, and it keeps growing faster than sales." },
          { title: "You are paying list rates or close to them because no carrier will negotiate at your volume." },
          { title: "Orders live in one tool, labels in another, tracking in a third, and the spreadsheet that ties them together is a week out of date." },
          { title: "Returns are handled over email." },
          { title: "And when a package goes missing, you spend an afternoon on hold." },
        ],
        cols: 5,
      },
      {
        heading: "Start with Ship, and keep your setup.",
        body: [
          "Ship gives you our negotiated rates across national and regional couriers, LTL freight when you need a pallet, and cross-border service with the customs paperwork done. You keep your store, your marketplace listings and your warehouse. We connect to them, and the labels print from one screen. Most brands are live in a day.",
        ],
        widget: "logos",
        notes: [{ who: "David", text: "Confirm the one-day onboarding claim with David." }],
      },
      {
        heading: "Add Optimize when you want to know where the money went.",
        body: [
          "Optimize audits every invoice against the rate you were quoted, flags adjustments before they hit your statement, and shows you by lane and by carrier where the savings are. It is the same data our advisors use, and it is yours to keep.",
        ],
        widget: "audit",
      },
      {
        heading: "Real people, under two minutes.",
        body: [
          "Heroic Support™ is staffed by people who ship, and they pick up the phone. If a carrier loses a package or charges you for a box that was the right size, we file the claim and we fight it. You should not have to learn the carrier’s claims process to get your money back.",
        ],
        widget: "team",
      },
      {
        heading: "When you are ready for a warehouse, the door is already open.",
        body: [
          "Brands that reach a few hundred orders a month usually start thinking about a 3PL. With Koherent, you do not switch vendors to get there. Fulfill adds warehouse space from our network, in the regions where your customers are, on the same platform and the same invoice.",
        ],
        widget: "map",
      },
      {
        heading: "Three things you will not find here.",
        cards: [{ title: "There is no monthly platform fee." }, { title: "There is no volume commitment." }, { title: "And there is no custom pricing you have to call about: you see our rates before you ship." }],
        cols: 3,
        notes: [{ who: "Michael", text: "Confirm that the no-fee, no-commitment model applies to the Business tier on the Koherent site." }],
      },
    ],
    close: {
      heading: "Get a 15-minute rate comparison.",
      body: "Send us your last carrier invoice and we will show you, line by line, what the same shipments cost on Koherent.",
      cta: { label: "Get a 15-minute rate comparison", href: PAGES.contact },
    },
  },

  {
    key: "enterprise",
    path: PAGES.enterprise,
    label: "Who we help",
    title: "Enterprise brands",
    description: "Koherent runs logistics for multi-location brands and high-volume shippers as a managed blend of technology, warehouses, carriers and support.",
    headline: "One partner is responsible for your whole logistics flow, and it is us.",
    subhead: "Koherent runs logistics for multi-location brands and high-volume shippers as a managed blend of technology, warehouses, carriers and support, with your carrier contracts or ours.",
    cta: { label: "Talk to an enterprise advisor", href: PAGES.contact },
    hero: "console",
    blocks: [
      {
        heading: "You have the volume and the contracts. What you do not have is one party that answers for all of it.",
        body: [
          "At your size the problem is rarely the rate. It is that your shipping software, your 3PL, your carriers and your returns provider each report to a different vendor, each one blames the next, and your team spends its time reconciling. You need one party that owns the flow end to end and brings you the numbers every month.",
        ],
        widget: "spectrum",
        wide: true,
      },
      {
        heading: "Bring your own rates. Keep your own carriers.",
        body: [
          "If you have negotiated carrier contracts, Koherent runs them. Our platform shops your rates alongside ours on every order and picks the service that meets your rules, so you keep your discounts and still get regional carriers and final mile options you do not have today.",
        ],
        widget: "rateSwitches",
      },
      {
        heading: "Ship from more than one place without running more than one system.",
        body: [
          "Fulfill places your inventory across our network of warehouses and routes each order from the location that gets it there fastest at the lowest cost. You see every location, every unit and every order in one view, and your WMS, OMS or ERP sees it too.",
        ],
        widget: "map",
      },
      {
        id: "applets",
        heading: "Manage is the layer that makes it one account.",
        body: [
          "Every enterprise customer gets a named account lead who owns onboarding, carrier escalations, claims, reporting and the quarterly review. Exception reports reach you before your customers notice. Branded tracking and notifications carry your name, not ours. And if you need a workflow that does not exist, our team builds it as a small purpose-built app on the platform, usually in days rather than quarters.",
        ],
        widget: "applet",
        notes: [
          { who: "Eugene", text: "Confirm how the custom shipping applet is described publicly and whether the build-time claim is safe. The name itself is settled: “custom shipping applet” (Jenny’s email, Oct 29)." },
        ],
      },
      {
        heading: "How a pilot works.",
        steps: [
          { title: "The audit", body: "We start with a shipping audit of your last ninety days of invoices to show where the savings and the service gaps are." },
          { title: "The pilot", body: "Then we run a pilot on one lane or one location, with your rates, measured against the numbers you already track." },
          { title: "Your call", body: "If the pilot does not beat your current setup, you have lost nothing but the audit, which you keep." },
        ],
        notes: [
          { who: "Michael", text: "Confirm the 90-day pilot structure." },
          { who: "David", text: "Confirm the security questionnaire or SOC 2 status before publishing." },
        ],
      },
      {
        label: "How we work",
        heading: "Alongside your team, as if it were our business. You stay in control.",
        body: ["We suggest, you approve. Start with one piece, like your shipping costs, or design the whole network. Either way it’s the same six steps."],
        widget: "method",
        wide: true,
      },
      {
        label: "Customer stories",
        heading: "What we’re designing right now.",
        body: ["Three businesses, three goals. Names stay private until the work is live, and every figure is from our proposals."],
        widget: "cases",
        wide: true,
        notes: [{ who: "Michael", text: "Customer proof block: a one-paragraph story each for PG Golf, Kahoots and InnoWave once approved. Until then, the three anonymized cases from the live site." }],
      },
    ],
    close: { heading: "One partner is responsible for your whole logistics flow.", cta: { label: "Talk to an enterprise advisor", href: PAGES.contact } },
  },

  {
    key: "partners",
    path: PAGES.partners,
    label: "Who we help",
    title: "3PL and fulfillment partners",
    description: "The Koherent partner network connects independent 3PLs with growing brands that need fulfillment in your region.",
    headline: "You run the warehouse. We bring the merchants, the technology and the shipping margin.",
    subhead: "The Koherent partner network connects independent 3PLs with growing brands that need fulfillment in your region, on a platform that makes shipping your most profitable line.",
    cta: { label: "Apply to join the network", href: PAGES.contact },
    hero: "map",
    blocks: [
      {
        heading: "This is an integrated network, not a referral list.",
        body: [
          "Most partner programs send you a lead and wish you luck. Koherent does the merchant acquisition, builds the integrations to the merchant’s store and your WMS, runs the carrier rate shopping, handles the billing and the audit, and brings you the merchant ready to ship. You focus on receiving, picking, packing and getting it out the door on time.",
        ],
        widget: "integrations",
      },
      {
        heading: "What you get.",
        cards: [
          { title: "Merchants in your region", body: "You get merchants shipping 50 to 1,000 orders a month in your region, with the volume growing as they grow." },
          { title: "Regional protection", body: "You get regional protection, which means we do not sign three partners on the same street and split the demand." },
          { title: "Shipping as margin", body: "You get our carrier rates and markup controls, so shipping becomes margin instead of a pass-through." },
          { title: "One invoice, one payment", body: "You get standardized rate cards and unified billing, which means one invoice to the merchant and one payment to you." },
          { title: "A weekly KPI review", body: "And you get a weekly KPI review with a partner lead who knows your numbers." },
        ],
        cols: 5,
        notes: [{ who: "Matteo", text: "Confirm the regional protection terms and the weekly review cadence." }],
      },
      {
        heading: "Onboarding takes 30 to 45 days.",
        steps: [
          { title: "Connect", body: "Connect is the first step, where we map your WMS and your service area." },
          { title: "Integrate", body: "Integrate is the second, where we link your systems to the platform and test with live orders." },
          { title: "Standardize", body: "Standardize is the third, where we set rate cards, packaging rules and service levels." },
          { title: "Go Live", body: "Go Live is the last, where your first merchant ships." },
        ],
        notes: [{ who: "Matteo", text: "Confirm the four-step onboarding names and the 30 to 45 day range." }],
      },
      {
        heading: "What it costs.",
        body: ["There is no cost to join the network. You earn on every order you fulfill and on every label you ship, and the shipping margin alone typically makes up the majority of partner revenue."],
        notes: [{ who: "Matteo", text: "Confirm whether the 75 percent shipping-margin figure can be stated publicly." }],
      },
      {
        heading: "Who we are looking for.",
        body: ["We partner with independent, fulfillment-capable 3PLs doing roughly $1 million to $10 million in revenue, with a WMS, a dock and room to grow. If you run one roof or several, in the United States or Canada, we want to talk."],
      },
    ],
    close: {
      heading: "Apply to join the network.",
      body: "It takes about ten minutes, and a partner lead will call you within two business days.",
      cta: { label: "Apply to join the network", href: PAGES.contact },
      notes: [
        { who: "Peter", text: "Confirm the response-time promise with Peter’s team." },
        { who: "Matteo", kind: "decide", text: "There’s no partner application form yet: the button goes to the contact form for now." },
      ],
    },
  },

  {
    key: "ship",
    path: PAGES.ship,
    label: "What we do",
    title: "Ship",
    description: "Ship moves every parcel and pallet through the best carrier at the best rate, across the border and to the door.",
    headline: "Ship moves every parcel and pallet through the best carrier at the best rate, across the border and to the door.",
    subhead: "One platform for courier, freight, cross-border and final mile, with twenty years of carrier relationships behind every rate.",
    cta: { label: "Get a rate comparison", href: PAGES.contact },
    hero: "rateCard",
    blocks: [
      {
        heading: "Every carrier you need, in one screen.",
        body: [
          "Ship compares rates across national and regional couriers, LTL and full-truckload freight, and cross-border lanes, and it does it on every order. You set the rules, such as cheapest, fastest, or a specific carrier for a specific customer, and the platform picks the service and prints the label. If you have your own carrier contracts, it shops those too.",
        ],
        widget: "rateSwitches",
      },
      {
        id: "inside",
        heading: "What is inside.",
        intro: "Ship includes:",
        items: [
          "Discounted courier rates on national and regional carriers",
          "LTL and FTL freight with bill of lading generation",
          "Cross-border and international shipping with customs documentation prepared for you",
          "Bring-your-own-rates on any carrier you already contract with",
          "Returns labels and a returns portal",
          "Big and bulky final mile for the items that do not fit in a box",
        ],
        notes: [
          { who: "David", text: "Confirm which regional carriers can be named and the returns portal status." },
          { who: "Michael", text: "Confirm whether final mile can be listed under Koherent before the Five String earnout ends. Also: on Oct 27 Michael said there’s no overseas customs brokerage yet, so check “international”." },
        ],
      },
      {
        heading: "Rates that hold up on the invoice.",
        body: ["A quoted rate is only as good as the bill that follows it. Ship audits every carrier invoice against the quote, and our team disputes adjustments on your behalf. You see the dispute, the outcome and the credit in your account."],
        widget: "audit",
      },
      {
        heading: "Who buys Ship on its own.",
        intro: "Every Koherent customer starts here.",
        cards: [
          { title: "Growing brands", href: PAGES.growing, body: "Growing brands use Ship to replace list-rate shipping and a pile of tools." },
          { title: "Enterprise brands", href: PAGES.enterprise, body: "Enterprise brands use it to run their own contracts alongside ours." },
          { title: "Partners", href: PAGES.partners, body: "Partners use it to turn shipping into margin." },
        ],
        cols: 3,
      },
    ],
    close: { heading: "Every parcel and pallet, the best carrier at the best rate.", cta: { label: "Get a rate comparison", href: PAGES.contact } },
  },

  {
    key: "fulfill",
    path: PAGES.fulfill,
    label: "What we do",
    title: "Fulfill",
    description: "Fulfill places your inventory in the right warehouses across North America without you owning a building.",
    headline: "Fulfill places your inventory in the right warehouses across North America without you owning a building.",
    subhead: "A network of more than 800 warehouse locations, run from the same platform and the same invoice as your shipping.",
    cta: { label: "Talk to a fulfillment advisor", href: PAGES.contact },
    hero: "map",
    heroNotes: [n800],
    blocks: [
      {
        heading: "Put the product where the orders are.",
        body: ["Shipping from one location means every order to the far coast travels across the country at the most expensive zone. Fulfill looks at where your orders go and places inventory in warehouses close to them, so more orders ship in one or two zones and arrive in one or two days."],
        widget: "console",
      },
      {
        heading: "What is inside.",
        intro: "Fulfill includes:",
        items: [
          "Storage",
          "Pick and pack",
          "Cross-dock",
          "Returns processing",
          "Zone skip",
          "Drop ship",
          "Overflow and peak-season capacity",
          "Location optimization that tells you where your next warehouse should be",
        ],
        outro: "Every location is a vetted partner in the Koherent network, and every one runs on the platform, so you see inventory and orders in one view.",
        notes: [{ who: "Michael", text: "Confirm the vetting criteria that can be stated publicly." }],
      },
      {
        heading: "Scale up for the season, scale back after.",
        cards: [
          { title: "You pay for the space and the labor you use." },
          { title: "When Q4 doubles your volume, you add capacity in the network." },
          { title: "When January arrives, you let it go." },
          { title: "There is no lease and no minimum." },
        ],
        cols: 4,
        notes: [{ who: "Michael", text: "Confirm commercial terms." }],
      },
      {
        heading: "Who buys Fulfill on its own.",
        cards: [
          { title: "Enterprise brands", href: PAGES.enterprise, body: "Enterprise brands that ship from more than one location use Fulfill to stop managing warehouses one at a time." },
          { title: "Growing brands", href: PAGES.growing, body: "Growing brands at the 3PL transition point, usually around 500 orders a month, use it as their first warehouse without switching platforms." },
          { title: "3PL partners", href: PAGES.partners, body: "And 3PLs join from the supply side as partners." },
        ],
        cols: 3,
      },
    ],
    close: { heading: "The right warehouses, without owning a building.", cta: { label: "Talk to a fulfillment advisor", href: PAGES.contact } },
  },

  {
    key: "optimize",
    path: PAGES.optimize,
    label: "What we do",
    title: "Optimize",
    description: "Optimize finds the money and time hiding in your shipping data and keeps finding it every day.",
    headline: "Optimize finds the money and time hiding in your shipping data and keeps finding it every day.",
    subhead: "Invoice audit, packaging rules, predictive analytics and a performance score, built on every shipment you move.",
    cta: { label: "Get your Logistics Performance Score", href: PAGES.score },
    hero: "score",
    blocks: [
      {
        heading: "The annual rate review leaves money on the table for the other eleven months.",
        body: ["Most brands look at shipping costs once a year, negotiate a new rate card and go back to work. Meanwhile carrier surcharges change monthly, dimensional weight rules shift, and the box your team reaches for costs you two dollars on every order. Optimize watches all of it continuously and tells you what to change this week, not next year."],
        widget: "console",
      },
      {
        heading: "What is inside.",
        intro: "Optimize includes:",
        items: [
          "A line-by-line audit of every carrier invoice against the quoted rate",
          "Automatic dispute of adjustments",
          "Packaging optimization that recommends the right box for each order",
          "Dashboards by lane, carrier, service and location",
          "Predictive analytics for volume and cost",
          "An AI assistant you can ask plain questions of",
          "The Logistics Performance Score, which benchmarks your cost, speed and customer experience against brands like yours",
        ],
        notes: [
          { who: "Eugene", text: "Confirm the AI assistant name and status." },
          { who: "Jenny", text: "Confirm whether the benchmark report is ready for Q1 2027." },
        ],
      },
      {
        heading: "Start with the score.",
        body: ["The Logistics Performance Score takes about ten minutes. Answer a short set of questions about your volume, lanes, carriers and service levels, and you get a score across cost, efficiency and customer experience, plus the two or three changes that would move it most. It is free, and it is the same first step our advisors take with every new customer."],
        widget: "triangle",
        wide: true,
        notes: [{ who: "Jenny", text: "The score on the site today is 16 questions, about five minutes, not ten (Michael’s fix, Oct 27)." }],
      },
      {
        heading: "Who buys Optimize on its own.",
        cards: [
          { title: "Growing brands", href: PAGES.growing, body: "Growing brands buy it to find out where the money went." },
          { title: "Enterprise brands", href: PAGES.enterprise, body: "Enterprise brands buy it to get one set of numbers across every location and carrier." },
          { title: "Happy elsewhere?", body: "It is also the most common reason a brand that is happy with its current provider ends up talking to us." },
        ],
        cols: 3,
      },
    ],
    close: { heading: "Start with the score.", cta: { label: "Get your Logistics Performance Score", href: PAGES.score } },
  },

  {
    key: "manage",
    path: PAGES.manage,
    label: "What we do",
    title: "Manage",
    description: "Manage connects your systems to ours and gives you one team responsible for the outcome.",
    headline: "Manage connects your systems to ours and gives you one team responsible for the outcome.",
    subhead: "Integrations, automation, branded tracking and Heroic Support™, with a named account lead for enterprise customers.",
    cta: { label: "Talk to an advisor", href: PAGES.contact },
    hero: "team",
    heroNotes: [{ who: "Jenny and Michael", kind: "decide", text: "Heroic Support™ is ShipTime’s support brand. Keep the name on Koherent pages?" }],
    blocks: [
      {
        heading: "The tools should talk to each other, and someone should answer the phone.",
        body: ["Manage is the connective layer. It plugs your cart, marketplace, WMS, OMS or ERP into the platform so orders flow in and tracking flows back without anyone retyping anything. And it is the human layer, the team that owns your account when the integration is live."],
        widget: "integrations",
      },
      {
        heading: "What is inside.",
        intro: "Manage includes:",
        items: [
          "Integrations with the major carts, marketplaces, warehouse systems and ERPs",
          "A REST API for anything custom",
          "Automation rules for carrier selection, packaging and exceptions",
          "Branded tracking pages and notifications in your name",
          "Exception reports that reach you before your customer notices",
          "A returns portal",
          "Purpose-built micro apps our team builds for workflows that do not exist off the shelf",
        ],
        outro: "For enterprise customers it adds a named account lead, a quarterly review and a single point of responsibility for carriers, warehouses, claims and support.",
        notes: [{ who: "David", text: "Confirm the list of integrations that can be shown at launch. The public name for the micro apps is settled: “custom shipping applet”." }],
      },
      {
        id: "applets",
        label: "From the live site",
        heading: "Custom shipping applets.",
        body: [
          "Small custom apps for the one workflow that’s yours alone, built in days on the same platform.",
          "Customers hand in orders at the counters of two national retail chains. We built a simple “send a job” page on our network, so any store can ship to the workshop in a few clicks.",
        ],
        widget: "applet",
        notes: [{ who: "Eugene", text: "Confirm how the custom shipping applet is described publicly and whether the build-time claim is safe." }],
      },
      {
        heading: "Heroic Support™ is part of the product.",
        body: ["Support here means a team of people who ship, reachable by phone, chat and email, who file claims for you, chase carriers for you and flag adjustments before they reach your statement. If something goes wrong on a Friday afternoon, you make one call."],
        widget: "team",
      },
      {
        heading: "Who buys Manage on its own.",
        cards: [
          { title: "Enterprise brands", href: PAGES.enterprise, body: "Enterprise brands buy Manage as the wrapper around everything else." },
          { title: "White-label partners, agents and buying groups", body: "White-label partners, agents and buying groups buy the integration and API layer to run their own shipping programs on our platform." },
        ],
        cols: 2,
        notes: [{ who: "Michael", text: "Confirm whether white-label is a public offer at launch." }],
      },
    ],
    close: { heading: "One team responsible for the outcome.", cta: { label: "Talk to an advisor", href: PAGES.contact } },
  },

  {
    key: "platform",
    path: PAGES.platform,
    label: "Platform",
    title: "Platform",
    description: "The software layer of the logistics operating system: rates, labels, rules and reports, in one place.",
    headline: "The software layer of the logistics operating system.",
    subhead: "Twenty years of shipping experience and fifteen years of owning our own codebase went into a platform that shops rates, prints labels, automates rules and reports on everything, in one place.",
    cta: { label: "See it in a demo", href: PAGES.contact },
    secondary: { label: "Open the example account", href: "https://lp.shiptime.com/dashboard" },
    hero: "console",
    heroNotes: [
      { who: "David", text: "Confirm the fifteen-year figure." },
      { who: "Matteo", kind: "decide", text: "The example account (lp.shiptime.com/dashboard) still says “Shiplets” throughout." },
    ],
    blocks: [
      {
        heading: "Capabilities.",
        cards: [
          { id: "rate-shopping", title: "Rate shopping", body: "Rate shopping compares every carrier and service you use on every order, including your own contracted rates." },
          { id: "labels", title: "Labels and documents", body: "Labels and documents print for parcel, freight and international, with customs paperwork generated." },
          { id: "automation", title: "Automation rules", body: "Automation rules handle carrier selection, packaging, handling fees and exceptions so your team touches fewer orders." },
          { id: "batch", title: "Batch shipping", body: "Batch shipping processes hundreds of orders in one pass." },
          { id: "orders", title: "Order and inventory management", body: "Order and inventory management shows every channel and every location in one view." },
          { id: "returns", title: "Returns", body: "Returns run through a portal your customers use without emailing you." },
          { id: "analytics", title: "Analytics and dashboards", body: "Analytics and dashboards cover cost, speed and service by any cut you need, and an AI assistant answers plain-language questions about your data." },
          { id: "api", title: "API and developer hub", body: "The API and developer hub let your engineers build on all of it." },
        ],
        cols: 4,
        notes: [{ who: "Eugene", text: "Confirm feature availability at launch, especially multi-warehouse, the returns portal and the AI assistant." }],
      },
      {
        heading: "Built on one codebase.",
        body: ["Every Koherent customer, from a growing brand to an enterprise with six locations, runs on the same platform. Enterprise features are switched on, not bolted on, which means upgrades reach everyone and nothing breaks when you grow."],
      },
    ],
    close: { heading: "See it in a demo.", cta: { label: "See it in a demo", href: PAGES.contact } },
  },

  {
    key: "network",
    path: PAGES.network,
    label: "Network",
    title: "Network",
    description: "Carriers, warehouses and final mile across the United States and Canada, built over twenty years and run from one platform.",
    headline: "The physical layer of the logistics operating system.",
    subhead: "Carriers, warehouses and final mile across the United States and Canada, built over twenty years and run from one platform.",
    cta: { label: "Check coverage in your region", href: PAGES.contact },
    hero: "map",
    blocks: [
      {
        id: "carriers",
        heading: "Carriers.",
        intro: "The network includes:",
        items: [
          "The national couriers",
          "A growing set of regional carriers that are faster and cheaper in the lanes they serve",
          "LTL and full-truckload freight providers",
          "Cross-border and international services with customs brokerage",
          "Big and bulky final mile with white-glove delivery",
        ],
        outro: "Rates, lanes and availability vary by origin, destination and service.",
        notes: [
          { who: "David", text: "Confirm which carriers can be named on the Koherent site and whether final mile can be listed." },
          { who: "Michael", text: "On Oct 27 Michael said there’s no overseas customs brokerage yet." },
        ],
      },
      {
        id: "warehouses",
        heading: "Warehouses.",
        body: ["More than 800 warehouse locations across North America, each a vetted partner running on the platform, give you storage and fulfillment where your customers are, without a lease."],
        widget: "map",
        notes: [{ who: "Michael", text: "Confirm the 800 figure and the vetting language. Michael gave 800 warehouses on Oct 27." }],
      },
      {
        id: "partners",
        heading: "Partners.",
        body: ["Independent 3PLs join the network to fulfill for Koherent merchants in their region. If you run a warehouse, see the partner page."],
        cards: [{ title: "3PL and fulfillment partners", href: PAGES.partners, body: "You run the warehouse. We bring the merchants, the technology and the shipping margin." }],
        cols: 2,
      },
    ],
    close: { heading: "Check coverage in your region.", cta: { label: "Check coverage in your region", href: PAGES.contact } },
  },

  {
    key: "integrations",
    path: PAGES.integrations,
    label: "Integrations",
    title: "Integrations",
    description: "Koherent connects to the systems you already run: carts, marketplaces, warehouse and order systems, ERPs, carriers and an API.",
    headline: "Koherent connects to the systems you already run.",
    subhead: "Carts, marketplaces, warehouse and order systems, ERPs, carriers and an API for everything else.",
    cta: { label: "See all integrations", href: "#all" },
    hero: "integrations",
    blocks: [
      {
        id: "all",
        heading: "",
        widget: "groups",
        wide: true,
        notes: [
          { who: "David", text: "Stores: Shopify, WooCommerce, BigCommerce and others to be confirmed by David." },
          { who: "David", text: "Marketplaces: Amazon, eBay, Walmart, Etsy and others to be confirmed." },
          { who: "David", text: "Systems: NetSuite, and the WMS and OMS integrations to be confirmed. QuickBooks is on the live site today." },
          { who: "David", text: "Carriers: list to be confirmed against the Network page." },
        ],
      },
      {
        id: "api",
        heading: "API.",
        body: ["The REST API covers rating, labels, tracking, address validation, orders and analytics, with documentation and sandbox access for your developers."],
        widget: "api",
        notes: [{ who: "Eugene", text: "Confirm the API scope and whether the developer hub is public at launch." }],
      },
    ],
    close: {
      heading: "If the system you need is not listed, tell us.",
      body: "Most integrations our customers run started as a request.",
      cta: advisor,
    },
  },

  {
    key: "pricing",
    path: PAGES.pricing,
    label: "Pricing",
    title: "Pricing",
    description: "You pay for what you ship, and you see the rate before you ship it.",
    headline: "You pay for what you ship, and you see the rate before you ship it.",
    cta: { label: "Talk to an advisor", href: PAGES.contact },
    hero: "rateCard",
    heroNotes: [
      { who: "Jenny and Michael", kind: "decide", text: "Jenny’s navigation says talk-to-sales for enterprise and partners; this copy describes the enterprise model. Publish it, or talk to sales only? The headline also fits Growing brands best." },
    ],
    blocks: [
      {
        id: "tiers",
        heading: "",
        cards: [
          { title: "Growing brands", href: PAGES.growing, body: "There is no monthly platform fee and no volume commitment. You pay the shipping rate you see on screen, which includes our discount, and nothing else. Optimize and Fulfill are added when you want them." },
          { title: "Enterprise brands", href: PAGES.enterprise, body: "Enterprise pricing is a platform subscription plus a per-label fee, with your own carrier rates running on the platform. Managed services, fulfillment and the named account lead are scoped to your volume and locations. Every engagement starts with a free shipping audit and most start with a pilot." },
          { title: "3PL and fulfillment partners", href: PAGES.partners, body: "There is no cost to join the network. Partners earn on fulfillment and on shipping margin." },
        ],
        cols: 3,
        notes: [
          { who: "Michael", text: "Growing brands: confirm that this matches the Business tier commercial model on the Koherent site." },
          { who: "Michael", text: "Enterprise brands: confirm the subscription-plus-per-label description." },
          { who: "Matteo", text: "Partners: confirm." },
        ],
      },
      {
        heading: "Smaller than this?",
        body: ["If you ship fewer than 50 orders a month, ShipTime is built for you, with the same discounted rates and Heroic Support™ on a self-serve platform."],
        cards: [{ title: "ShipTime", href: "https://www.shiptime.com", body: "Discounted labels from every carrier, in one dashboard. Self-serve, no minimum." }],
        cols: 2,
        notes: [nThreshold],
      },
    ],
    close: { heading: "You pay for what you ship.", cta: { label: "Talk to an advisor", href: PAGES.contact } },
  },
];

// Jenny's integration groups, with the marks we have (public/logos) and the
// names she listed for the rest.
export const GROUPS: { id: string; title: string; items: { name: string; logo?: string }[] }[] = [
  { id: "stores", title: "Online stores and carts", items: [{ name: "Shopify", logo: "Shopify" }, { name: "WooCommerce", logo: "WooCommerce" }, { name: "BigCommerce", logo: "BigCommerce" }, { name: "and others" }] },
  { id: "marketplaces", title: "Marketplaces", items: [{ name: "Amazon", logo: "Amazon" }, { name: "eBay" }, { name: "Walmart" }, { name: "Etsy" }, { name: "and others" }] },
  { id: "systems", title: "Warehouse, order and ERP systems", items: [{ name: "NetSuite", logo: "NetSuite" }, { name: "QuickBooks", logo: "QuickBooks" }, { name: "WMS and OMS integrations" }] },
  { id: "carriers", title: "Carriers", items: [{ name: "National couriers" }, { name: "Regional carriers" }, { name: "LTL and FTL freight" }, { name: "Cross-border" }] },
];

export const pageByKey = (key: string) => {
  const p = PAGES_R2.find((x) => x.key === key);
  if (!p) throw new Error(`No revision-2 page "${key}"`);
  return p;
};

// ── The review page ──────────────────────────────────────────────────────────
// Every note, with where it sits, for /koherent/review and the dock's count.
export type PlacedNote = NoteData & { page: string; path: string; where: string };

export const ALL_NOTES: PlacedNote[] = [
  ...HOME.heroNotes.map((n) => ({ ...n, page: "Home", path: PAGES.home, where: "Hero" })),
  ...HOME.factsNotes.map((n) => ({ ...n, page: "Home", path: PAGES.home, where: "The numbers" })),
  ...HOME.doors.notes.map((n) => ({ ...n, page: "Home", path: PAGES.home, where: HOME.doors.heading })),
  ...HOME.proof.notes.map((n) => ({ ...n, page: "Home", path: PAGES.home, where: HOME.proof.heading })),
  ...PAGES_R2.flatMap((p) => [
    ...(p.heroNotes ?? []).map((n) => ({ ...n, page: p.title, path: p.path, where: "Hero" })),
    ...p.blocks.flatMap((b) => [
      ...(b.notes ?? []).map((n) => ({ ...n, page: p.title, path: p.path, where: b.heading || "The list" })),
      ...(b.layers ?? []).flatMap((l) => (l.notes ?? []).map((n) => ({ ...n, page: p.title, path: p.path, where: l.name }))),
    ]),
    ...(p.close.notes ?? []).map((n) => ({ ...n, page: p.title, path: p.path, where: "Closing band" })),
  ]),
];

export const NOTE_COUNT = ALL_NOTES.length;

// Where each of Michael's and Chris's asks lives now, so the review can check
// none dropped (their asks are hard constraints on this site).
export const ASKS: { ask: string; who: string; where: string; href: string }[] = [
  { ask: "A strong, prominent logo top left", who: "Michael", where: "The nav, every page", href: PAGES.home },
  { ask: "“Your managed logistics network.” as the headline", who: "Michael", where: "Home: option three of the headline switch; the footer label", href: PAGES.home },
  { ask: "The moving questions under the problem", who: "Michael", where: "Home, under the outcome line", href: `${PAGES.home}#outcome` },
  { ask: "When to choose ShipTime or Koherent (the volume tiers)", who: "Chris and Michael", where: "Home: the door finder, now landing on Jenny’s three doors", href: `${PAGES.home}#doors` },
  { ask: "“Grow your network, not your overhead.”", who: "Chris", where: "Home: the door finder’s heading", href: `${PAGES.home}#doors` },
  { ask: "The score as the main ask", who: "Chris", where: "The nav button and every closing band; Optimize", href: PAGES.optimize },
  { ask: "How we work is the product: the six steps", who: "Chris", where: "Enterprise brands; the How we work page", href: PAGES.enterprise },
  { ask: "The four ingredients", who: "Chris", where: "The How we work page", href: PAGES.how },
  { ask: "“Not what we sell, but what we design with”", who: "Chris", where: "The What we bring page", href: PAGES.bring },
  { ask: "The six building blocks, and the lattice", who: "Michael", where: "What it is (the bento); the What we bring page", href: PAGES.los },
  { ask: "In between the independents and the giants", who: "Michael and Chris", where: "Enterprise brands", href: PAGES.enterprise },
  { ask: "The design target triangle", who: "The deck", where: "Optimize", href: PAGES.optimize },
  { ask: "The account team, his quote and photo", who: "Michael", where: "Home, Talk to someone who has run a logistics operation", href: `${PAGES.home}#advisors` },
  { ask: "Three case studies, anonymized", who: "Michael", where: "Home; Enterprise brands; Customer stories", href: PAGES.cases },
  { ask: "A custom shipping applet shown as a real deliverable", who: "Michael", where: "Enterprise brands; Manage", href: `${PAGES.manage}#applets` },
  { ask: "The example account", who: "Matteo", where: "Platform", href: PAGES.platform },
  { ask: "“Make it coherent.” as the tagline", who: "The deck", where: "The footer", href: PAGES.home },
];
