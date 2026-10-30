import { PAGES } from "./koherent-brand";

// ── Revision 2 copy (Oct 30) ─────────────────────────────────────────────────
// "Our story, her structure" (Matteo, Oct 30: the first build followed
// Jenny's draft too closely and was confusing). The story and most of the
// words are the first revision's, the ones Michael and Chris shaped: "Your
// managed logistics network", designed from your own order data and run with
// you, you stay in control. From Jenny's draft (Oct 29) come the structure and
// her strongest lines: three doors, four solutions on one How it works page,
// "a label / a building / the outcome", the rate comparison, the pilot and
// the partner onboarding, and "custom shipping applet" in place of "Shiplet".
// Short on purpose: one idea and one visual per section.
// Her bracketed notes are not on the pages; they're on /koherent/review.
// No "use client": server pages read this.

export type Widget =
  | "console"
  | "rateCard"
  | "rateSwitches"
  | "map"
  | "applet"
  | "team"
  | "integrations"
  | "triangle"
  | "method"
  | "bento"
  | "cases"
  | "spectrum"
  | "score"
  | "audit"
  | "lattice";

export type Cta = { label: string; href: string };
export type Card = { title: string; body?: string; href?: string; id?: string };

export type Block = {
  id?: string;
  label?: string;
  heading: string;
  body?: string;
  cards?: Card[];
  steps?: Card[];
  widget?: Widget;
  wide?: boolean;
  cols?: 1 | 2 | 3 | 4;
  link?: Cta;
};

export type Page = {
  key: string;
  path: string;
  label: string;
  title: string;
  description: string;
  headline: string;
  subhead: string;
  cta: Cta;
  secondary?: Cta;
  hero?: Widget;
  blocks: Block[];
  close: { heading: string; body?: string; cta: Cta; noScore?: boolean };
};

const score: Cta = { label: "Get your logistics score", href: PAGES.score };

// ── Home ─────────────────────────────────────────────────────────────────────
export const HOME = {
  label: "Logistics, designed and run with you",
  headline: "Your managed logistics network.",
  lead: "We cut shipping costs, improve operations and simplify fulfillment for businesses sending 500+ orders a month to individuals.",
  sub: "Not another 3PL, not another shipping platform. One team designs your network from your own order data and runs it with you: no rebuild, and you stay in control.",
  ticks: ["Your carrier contracts or ours", "One team responsible for the result", "No sales deck until you ask for one"],
  facts: [
    ["2M+", "shipments a year"],
    ["1,000+", "businesses on the platform"],
    ["20 years", "in shipping and logistics"],
    ["800+", "partner warehouse locations"],
  ] as [string, string][],
  outcome: {
    heading: "Shipping software sells you a label. A 3PL sells you a building. We sell you the outcome.",
    body: "When a shipment goes wrong, the software points at the carrier, the carrier points at the warehouse, and you’re the one on the phone. Koherent puts all of it under one roof: one party responsible when it works, and when it doesn’t.",
  },
  doors: {
    label: "Who it’s for",
    heading: "Start at the door that fits your business.",
    cards: [
      { title: "Growing brands", href: PAGES.growing, body: "500 to 5,000 orders a month and outgrowing the tools you started with. Better rates, one platform and a team that answers the phone." },
      { title: "Enterprise brands", href: PAGES.enterprise, body: "More than one site and your own carrier contracts. One partner accountable for the whole flow, with your rates or ours." },
      { title: "3PL and fulfillment partners", href: PAGES.partners, body: "You run the warehouse. We bring the merchants, the technology and the shipping margin." },
    ] as Card[],
  },
  how: {
    label: "How it works",
    heading: "Everything a coherent operation needs. Already connected.",
    lead: "Not what we sell, but what we design and run with. We connect the pieces you need into one network, and you see all of it in one place.",
  },
  stories: {
    label: "Customer stories",
    heading: "What we’re designing right now.",
    lead: "Three businesses, three goals. Names stay private until the work is live, and every figure is from our proposals.",
  },
  people: {
    label: "The people behind it",
    heading: "Experienced operators, not account managers.",
    lead: "Our technology is the superpower. Our people make it work for you, and we look after your customers as if they were our own.",
    ask: "Talk to someone who has run a logistics operation.",
  },
};

// ── How it works ─────────────────────────────────────────────────────────────
// Jenny's four solutions, each with her one-sentence definition, as the
// first revision's scroller (words left, the widget pinned right). Then
// Chris's six steps and the design target, which were the How we work page
// and the home page before; /koherent/how-we-work and /what-we-bring
// redirect here.
export const HOW = {
  label: "How it works",
  headline: "Four solutions, bought together or one at a time.",
  lead: "Ship, Fulfill, Optimize and Manage, designed together and run with you by one team. Every brand starts with Ship, and most add the rest as they grow.",
  four: [
    {
      id: "ship",
      name: "Ship",
      line: "Every parcel and pallet through the best carrier at the best rate, across the border and to the door.",
      points: [
        "National and regional couriers, LTL and FTL freight, and cross-border, compared on every order.",
        "Our rates, from 2M+ shipments a year, and your own contracts: the best value wins.",
        "You set the rules: cheapest, fastest, or a specific carrier for a specific customer.",
        "Every invoice checked against the quote, with adjustments disputed for you.",
      ],
      widget: "rateCard" as Widget,
    },
    {
      id: "fulfill",
      name: "Fulfill",
      line: "Inventory in the right warehouses across North America, without owning a building.",
      points: [
        "800+ partner warehouse locations in the US and Canada. We don’t own them; we pick the right ones for you.",
        "Storage, pick and pack, cross-dock, returns, and extra capacity for peak season.",
        "Inventory placed where your orders go, so more of them arrive in one or two days.",
        "No lease and no minimum: add space for Q4, let it go in January.",
      ],
      widget: "map" as Widget,
    },
    {
      id: "optimize",
      name: "Optimize",
      line: "Finds the money and time hiding in your shipping data, and keeps finding it every day.",
      points: [
        "A line-by-line audit of every carrier invoice.",
        "Packaging and carrier rules that improve as you ship.",
        "Dashboards by lane, carrier, service and site.",
        "Your Logistics Performance Score, against world-class logistics.",
      ],
      widget: "score" as Widget,
    },
    {
      id: "manage",
      name: "Manage",
      line: "Your systems connected to ours, and one team responsible for the result.",
      points: [
        "Shopify, Amazon, NetSuite, QuickBooks and 30 more, plus an open API.",
        "Custom shipping applets for the one workflow that’s yours alone.",
        "Branded tracking, and exception reports before your customers notice.",
        "A named account manager, an operator on the ground and a support lead.",
      ],
      widget: "team" as Widget,
      link: { label: "Open the example account", href: "https://lp.shiptime.com/dashboard" },
    },
  ],
  method: {
    label: "How we work",
    heading: "Alongside your team, as if it were our business. You stay in control.",
    lead: "We suggest, you approve. Start with one piece, like your shipping costs, or design the whole network. Either way it’s the same six steps.",
  },
  ingredients: ["A control tower watching every order", "Experts on the ground at your sites", "A daily rhythm with your team", "Technology that shows you everything"],
  target: {
    label: "The design target",
    heading: "Always all three. Never pick two.",
    lead: "Every network we design is held to lower cost, smoother operations and a better customer experience, all at once. Put in your numbers to see your triangle.",
  },
};

// ── The doors and Pricing ────────────────────────────────────────────────────
export const PAGES_R2: Page[] = [
  {
    key: "growing",
    path: PAGES.growing,
    label: "Who we help",
    title: "Growing brands",
    description: "For brands shipping 500 to 5,000 orders a month: better rates, one platform and a team that answers the phone.",
    headline: "Outgrown your tools. Not ready for a 3PL.",
    subhead: "For brands shipping 500 to 5,000 orders a month: better rates, one platform and a team that answers the phone.",
    cta: { label: "Get a 15-minute rate comparison", href: PAGES.contact },
    secondary: score,
    hero: "rateCard",
    blocks: [
      { heading: "Our rates, and yours.", body: "Our negotiated rates across national and regional couriers, LTL and cross-border, compared with your own contracts on every order. The best value wins.", widget: "rateSwitches" },
      { heading: "Every invoice, audited.", body: "We check every carrier invoice against the quote, dispute the adjustments and show you the credit. You see by lane and by carrier where the savings are.", widget: "audit" },
      { heading: "A warehouse when you’re ready.", body: "When it’s time for a 3PL, you don’t switch vendors. We add warehouse space from our network where your customers are, on the same platform and the same invoice.", widget: "map" },
      {
        heading: "How it starts.",
        steps: [
          { title: "Your invoice", body: "Send us your last carrier invoice." },
          { title: "Line by line", body: "We show you what the same shipments cost on Koherent." },
          { title: "Keep your setup", body: "Your store, your listings and your warehouse stay. We connect to them, and labels print from one screen." },
        ],
      },
    ],
    close: {
      heading: "Get a 15-minute rate comparison.",
      body: "Send us your last carrier invoice and we’ll show you, line by line, what the same shipments cost on Koherent.",
      cta: { label: "Get a 15-minute rate comparison", href: PAGES.contact },
    },
  },

  {
    key: "enterprise",
    path: PAGES.enterprise,
    label: "Who we help",
    title: "Enterprise brands",
    description: "For brands with more than one site or 5,000+ orders a month: one partner for the whole logistics flow.",
    headline: "One partner for your whole logistics flow.",
    subhead: "For brands with more than one site or 5,000+ orders a month. We design your network from your own order data and run it with you, with your carrier contracts or ours.",
    cta: { label: "Talk to an enterprise advisor", href: PAGES.contact },
    secondary: score,
    hero: "console",
    blocks: [
      { heading: "Your rates, or ours.", body: "If you have negotiated contracts, we run them. Our platform shops your rates alongside ours on every order and picks the service that meets your rules.", widget: "rateSwitches" },
      { heading: "More than one site, one system.", body: "Inventory placed across our network, each order shipped from the site that gets it there fastest at the lowest cost. You see every site, unit and order in one view.", widget: "map" },
      { heading: "A team that owns the outcome.", body: "A named account manager, an operator on the ground and a support lead own onboarding, escalations, claims, reporting and the quarterly review.", widget: "team" },
      {
        id: "applets",
        heading: "Custom shipping applets.",
        body: "For the workflow that doesn’t exist off the shelf, our team builds a small app on the platform. This one lets the store counters of two national retail chains send jobs to a workshop in a few clicks.",
        widget: "applet",
      },
      { heading: "", widget: "spectrum", wide: true },
      {
        label: "How it starts",
        heading: "A 90-day audit, then a pilot.",
        steps: [
          { title: "The audit", body: "We go through your last ninety days of invoices to show where the savings and the service gaps are." },
          { title: "The pilot", body: "One lane or one site, with your rates, measured against the numbers you already track." },
          { title: "Your call", body: "If the pilot doesn’t beat your current setup, you’ve lost nothing but the audit, which you keep." },
        ],
        link: { label: "How we work, step by step", href: `${PAGES.works}#method` },
      },
      { label: "Customer stories", heading: "What we’re designing right now.", widget: "cases", wide: true },
    ],
    close: { heading: "One partner for your whole logistics flow.", cta: { label: "Talk to an enterprise advisor", href: PAGES.contact } },
  },

  {
    key: "partners",
    path: PAGES.partners,
    label: "Who we help",
    title: "3PL and fulfillment partners",
    description: "Join the Koherent network: merchants in your region, our rates and technology, and shipping that becomes margin.",
    headline: "You run the warehouse. We bring the merchants.",
    subhead: "Join the Koherent network: brands that need fulfillment in your region, our rates and technology, and shipping that becomes margin.",
    cta: { label: "Apply to join the network", href: PAGES.contact },
    hero: "map",
    blocks: [
      {
        heading: "An integrated network, not a referral list.",
        body: "We find the merchants, build the integrations to their store and your WMS, run the rate shopping and handle the billing and the audit. You receive, pick, pack and ship.",
        widget: "integrations",
      },
      {
        heading: "What you get.",
        cards: [
          { title: "Merchants in your region", body: "Brands that need fulfillment near their customers, with volume that grows as they grow." },
          { title: "Your region, protected", body: "We don’t sign three partners on the same street and split the demand." },
          { title: "Shipping as margin", body: "Our carrier rates and markup controls turn shipping into margin, not a pass-through." },
          { title: "One invoice, one payment", body: "Standard rate cards, unified billing, and a weekly review with a partner lead." },
        ],
        cols: 4,
      },
      {
        label: "Onboarding",
        heading: "Live in 30 to 45 days.",
        steps: [
          { title: "Connect", body: "We map your WMS and your service area." },
          { title: "Integrate", body: "We link your systems and test with live orders." },
          { title: "Standardize", body: "We set rate cards, packaging rules and service levels." },
          { title: "Go live", body: "Your first merchant ships." },
        ],
      },
      { heading: "Who we’re looking for.", body: "Independent, fulfillment-capable 3PLs doing roughly $1 million to $10 million in revenue, with a WMS, a dock and room to grow, in the US or Canada." },
    ],
    close: {
      heading: "Apply to join the network.",
      body: "It takes about ten minutes, and a partner lead calls you within two business days.",
      cta: { label: "Apply to join the network", href: PAGES.contact },
      noScore: true,
    },
  },

  {
    key: "pricing",
    path: PAGES.pricing,
    label: "Pricing",
    title: "Pricing",
    description: "No platform fee to start, a subscription when we run your network, and free to join for 3PL partners.",
    headline: "Pricing for the way you ship.",
    subhead: "No platform fee to start, a subscription when we run your network, and free to join for 3PL partners.",
    cta: { label: "Talk to an advisor", href: PAGES.contact },
    secondary: score,
    blocks: [
      {
        id: "tiers",
        heading: "",
        cards: [
          { title: "Growing brands", href: PAGES.growing, body: "You pay the shipping rate you see on screen, with our discount in it. No monthly platform fee, no volume commitment. Add Optimize and Fulfill when you want them." },
          { title: "Enterprise brands", href: PAGES.enterprise, body: "A platform subscription plus a per-label fee, with your own carrier rates on the platform. Managed services and fulfillment are scoped to your volume and sites. It starts with a free shipping audit." },
          { title: "3PL and fulfillment partners", href: PAGES.partners, body: "Free to join. You earn on every order you fulfill and every label you ship." },
        ],
        cols: 3,
      },
      {
        heading: "Shipping fewer than 500 orders a month?",
        body: "ShipTime is built for you, with the same discounted rates and Heroic Support™ on a self-serve platform.",
        cards: [{ title: "ShipTime", href: "https://www.shiptime.com", body: "Discounted labels from every carrier, in one dashboard. Self-serve, no minimum." }],
        cols: 1,
      },
    ],
    close: { heading: "Pay for what fits.", cta: { label: "Talk to an advisor", href: PAGES.contact } },
  },
];

export const pageByKey = (key: string) => {
  const p = PAGES_R2.find((x) => x.key === key);
  if (!p) throw new Error(`No revision-2 page "${key}"`);
  return p;
};

// ── The review checklist (/koherent/review) ──────────────────────────────────
// Jenny's bracketed notes that still apply to what's on the site, the
// decisions her draft raised, and what was kept from it or left for later.
// Who confirms is her name where she gave one, otherwise a suggestion by role.
export type ReviewNote = { who: string; text: string; kind?: "confirm" | "decide"; page: string; href: string };

export const NOTES: ReviewNote[] = [
  { kind: "decide", who: "Jenny and Michael", page: "Home", href: PAGES.home, text: "Headline: the site keeps “Your managed logistics network.” (Michael, Oct 27). Jenny’s draft opens with “Your logistics should run like one system, and now it does.”; her “label / building / outcome” line is the home page’s second section." },
  { kind: "decide", who: "Jenny and Chris", page: "Home", href: PAGES.home, text: "Main button: the score leads (Chris, Aug 7), with “Talk to an advisor” beside it. Jenny’s draft led with the advisor." },
  { kind: "decide", who: "Jenny and Michael", page: "Growing brands", href: PAGES.growing, text: "Growing brands threshold: the site uses 500 to 5,000 orders a month and sends smaller shippers to ShipTime (tiers set Oct 28). Jenny’s draft says 50 to 1,000." },
  { kind: "decide", who: "Jenny and Michael", page: "Pricing", href: PAGES.pricing, text: "Pricing: publish the enterprise model (subscription plus a per-label fee), or talk to sales only, as Jenny’s navigation suggested?" },
  { kind: "decide", who: "Matteo", page: "How it works", href: PAGES.works, text: "The example account (lp.shiptime.com/dashboard) still says “Shiplets” throughout." },
  { kind: "decide", who: "Matteo", page: "3PL partners", href: PAGES.partners, text: "There’s no partner application form yet: “Apply to join the network” goes to the contact form." },
  { who: "Michael", page: "Home", href: PAGES.home, text: "Figures: 2M+ shipments a year, 1,000+ businesses and 20 years are on the live site already; Michael gave 800 partner warehouses on Oct 27. Jenny asked to check all four against the corporate deck." },
  { who: "Michael", page: "Home", href: PAGES.home, text: "Customer logos: PG Golf, Kahoots and InnoWave are pending approval. The cases stay anonymized until then." },
  { who: "Michael", page: "Home", href: PAGES.home, text: "The bento names “last-mile partners”: fine to say before the Five String earnout ends?" },
  { who: "Eugene", page: "Home", href: PAGES.home, text: "Custom shipping applets are “built in days” in the bento: is the build-time claim safe?" },
  { who: "Eugene", page: "How it works", href: PAGES.works, text: "Feature availability at launch: branded tracking, exception reports, dashboards by lane and site." },
  { who: "David", page: "How it works", href: PAGES.works, text: "The integrations named: Shopify, Amazon, NetSuite, QuickBooks, WooCommerce, BigCommerce and “30 more”. Also returns processing in Fulfill." },
  { who: "Michael", page: "How it works", href: PAGES.works, text: "Fulfill: “no lease and no minimum”, and the vetting of partner warehouses." },
  { who: "Michael", page: "Enterprise brands", href: PAGES.enterprise, text: "The 90-day audit and pilot structure." },
  { who: "David", page: "Enterprise brands", href: PAGES.enterprise, text: "The security questionnaire or SOC 2 status, before the pilot is published." },
  { who: "Matteo", page: "3PL partners", href: PAGES.partners, text: "Partner terms: regional protection, the weekly review, the four onboarding steps and 30 to 45 days." },
  { who: "Peter", page: "3PL partners", href: PAGES.partners, text: "The response-time promise: a partner lead calls within two business days." },
  { who: "Michael", page: "Pricing", href: PAGES.pricing, text: "Growing brands: no monthly platform fee, no volume commitment. Enterprise: subscription plus a per-label fee." },
];

export const FROM_JENNY: { kept: string[]; later: string[] } = {
  kept: [
    "Her three doors, Growing brands, Enterprise brands and 3PL and fulfillment partners, each with a page and in the menu.",
    "Her four solutions, Ship, Fulfill, Optimize and Manage, on one How it works page, each with her one-sentence definition.",
    "“Shipping software sells you a label. A 3PL sells you a building. We sell you the outcome.” on the home page.",
    "The 15-minute rate comparison, the 90-day audit and pilot, and the partner onboarding steps.",
    "A way to ShipTime for smaller shippers: the door finder and Pricing.",
    "Pure white with boxes, and no generated hero picture.",
    "“Custom shipping applet” instead of “Shiplet”.",
  ],
  later: [
    "Separate Platform, Network and Integrations pages: their content is in How it works for now.",
    "Resources: the benchmark report, blog, podcast and guides.",
    "The “logistics operating system” explainer: software vendors already use the term (Orbit, Trenvar, CargoWise), so it doesn’t set us apart.",
    "The long-form copy: her lines are used in short form; the full draft stays in her doc.",
  ],
};

// Where each of Michael's and Chris's asks lives now, so the review can check
// none dropped (their asks are hard constraints on this site).
export const ASKS: { ask: string; who: string; where: string; href: string }[] = [
  { ask: "A strong, prominent logo top left", who: "Michael", where: "The nav, every page", href: PAGES.home },
  { ask: "“Your managed logistics network.” as the headline", who: "Michael", where: "Home, the hero", href: PAGES.home },
  { ask: "Who it’s for and what we do in one sentence", who: "Michael", where: "Home, under the headline", href: PAGES.home },
  { ask: "Not another 3PL, not another shipping platform", who: "Chris", where: "Home, the hero", href: PAGES.home },
  { ask: "The moving questions under the problem", who: "Michael", where: "Home, under the outcome line", href: `${PAGES.home}#outcome` },
  { ask: "When to choose ShipTime or Koherent (the volume tiers)", who: "Chris and Michael", where: "Home, the door finder; Pricing", href: `${PAGES.home}#doors` },
  { ask: "“Grow your network, not your overhead.”", who: "Chris", where: "Home, over the door finder", href: `${PAGES.home}#doors` },
  { ask: "The score as the main ask", who: "Chris", where: "Home hero, the nav and every closing band", href: PAGES.home },
  { ask: "“Not what we sell, but what we design with”", who: "Chris", where: "Home, How it works", href: `${PAGES.home}#how` },
  { ask: "The six building blocks", who: "Michael", where: "Home, the bento", href: `${PAGES.home}#how` },
  { ask: "The lattice", who: "Michael", where: "How it works, the hero", href: PAGES.works },
  { ask: "How we work is the product: the six steps", who: "Chris", where: "How it works", href: `${PAGES.works}#method` },
  { ask: "The four ingredients", who: "Chris", where: "How it works, under the six steps", href: `${PAGES.works}#method` },
  { ask: "The design target triangle", who: "The deck", where: "How it works", href: `${PAGES.works}#target` },
  { ask: "In between the independents and the giants", who: "Michael and Chris", where: "Enterprise brands", href: PAGES.enterprise },
  { ask: "Experienced operators, the account team, Michael’s quote and photo", who: "Chris and Michael", where: "Home, the people", href: `${PAGES.home}#people` },
  { ask: "Three case studies, anonymized", who: "Michael", where: "Home; Enterprise brands; Customer stories", href: PAGES.cases },
  { ask: "A custom shipping applet shown as a real deliverable", who: "Michael", where: "Enterprise brands", href: `${PAGES.enterprise}#applets` },
  { ask: "The example account", who: "Matteo", where: "How it works, Manage", href: `${PAGES.works}#manage` },
  { ask: "“Make it coherent.” as the tagline", who: "The deck", where: "The footer", href: PAGES.home },
];
