// Competitor comparison data. One entry per `/compare/[competitor]` page.
// Tone: fair & confident. Each competitor gets real credit (fairCredit) so the
// wins read as believable to buyers who may already use the competitor.

export type CompareRow = {
  feature: string;
  // ShipTime value + whether it counts as a "win" (orange check) on this row
  shiptime: string;
  shiptimeWin?: boolean;
  // Competitor value + whether *they* win this row (so the table isn't all-✕)
  competitor: string;
  competitorWin?: boolean;
};

export type Differentiator = {
  icon: "Tag" | "Map" | "Layers" | "Chart" | "Dollar" | "Shield" | "Cog" | "Search" | "Package";
  title: string;
  desc: string;
};

export type DeepDive = {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
};

export type FaqItem = { q: string; a: string };

export type Competitor = {
  slug: string;
  name: string;
  // Optional brand wordmark logo (path under /public). When absent, the
  // competitor name renders as styled text instead.
  logo?: string;
  // SEO
  metaTitle: string;
  metaDescription: string;
  // Hero
  eyebrow: string;
  headline: string;
  subhead: string;
  // Answer-first paragraph (AEO — shown between hero buttons and comparison table)
  answerFirst: string;
  // TL;DR differentiator cards (the 3 reasons teams switch)
  differentiators: Differentiator[];
  // The comparison table
  rows: CompareRow[];
  // 2 alternating deep-dive bands expanding the key angles
  deepDives: DeepDive[];
  // Honesty box — where the competitor is genuinely a good fit
  fairCredit: {
    title: string;
    body: string;
    points: string[];
  };
  // FAQ items shown on both alternative and vs pages
  faq: FaqItem[];
  // Content for the "[Competitor] Alternative" page.
  alternative: {
    competitorPrice: string;
    benefitCards: { title: string; desc: string }[];
    social: { rating: number; outOf: number; source: string };
    quote: { text: string; name: string; role: string; context?: string };
    switchingGuide: string;          // paragraph shown before final CTA
    whyTeamsSwitch: { opener: string; bullets: { before: string; after: string }[] };
    features: { eyebrow: string; title: string; points: string[]; image?: string; video?: string }[];
  };
  // Content for the Deel-style "Choose ShipTime over X" page (/vs/[slug]).
  vs: {
    headline: string;               // replaces "Choose ShipTime over X"
    subhead: string;                // replaces generic subhead
    answerFirst: string;            // AEO paragraph for vs page
    savings: string;
    competitorPricing: string;
    whoShouldChoose: {
      shiptime: { title: string; body: string };
      competitor: { title: string; body: string };
    };
    reasons: {
      tab: string;
      title: string;
      body: string;
      mini: { feature: string; shiptime: boolean; competitor: boolean | "basic" }[];
      chips: string[];
      image: string;
    }[];
  };
};

// Shared baseline of ShipTime strengths reused across competitors, so the
// table stays consistent. Each page overrides the competitor side.
const SIGNUP_FAIR =
  "We believe the best logistics tool is the one you actually control. Here is an honest look at where they shine.";

// Shared building blocks for the Alternative pages.
const ALT_BENEFITS = [
  { title: "No platform fee", desc: "Start shipping without a monthly subscription. The discounts you see are the savings you keep." },
  { title: "Every carrier, one login", desc: "Courier, LTL, and Canada Post in one place. Compare rates and ship in seconds." },
  { title: "Bring your own rates", desc: "Plug in the carrier pricing you have already negotiated and shop it against ours on every label." },
];

const ALT_SOCIAL = { rating: 4.8, outOf: 5, source: "based on 1,000+ five-star reviews" };

const ALT_FEATURES = [
  {
    eyebrow: "Rate shopping",
    title: "The cheapest qualified rate, every time",
    image: "feature-rate-shopping",
    video: "ShippingFlowComp",
    points: [
      "Compare every carrier on one screen",
      "Up to 70% off walk-in carrier prices",
      "Bring your own negotiated rates too",
    ],
  },
  {
    eyebrow: "One platform",
    title: "Courier, LTL, and Canada Post together",
    image: "feature-one-platform",
    video: "TrackingContextComp",
    points: [
      "Parcel and freight managed in one place",
      "Native Canada Post and cross-border duty estimates",
      "Labels, pickups, and tracking from one dashboard",
    ],
  },
  {
    eyebrow: "Billing & visibility",
    title: "One invoice, full visibility",
    image: "feature-billing-visibility",
    video: "RateAuditComp",
    points: [
      "A single invoice across every carrier",
      "Shipping audit to catch overcharges",
      "Analytics to find more savings as you grow",
    ],
  },
];

// Shared tabbed "reasons" for the Deel-style /vs/ page. `competitorName` is
// woven in per call so the mini tables read naturally.
function vsReasons(competitorName: string): Competitor["vs"]["reasons"] {
  return [
    {
      tab: "Reason #1",
      title: "Every carrier and your own rates, under one roof",
      body: `Scattered carrier logins and a rate spreadsheet quietly cost you time and money. ShipTime brings courier, LTL, and Canada Post together and lets you shop your own negotiated rates against ours, something ${competitorName} does not fully offer.`,
      mini: [
        { feature: "Bring Your Own Rates", shiptime: true, competitor: false },
        { feature: "Courier + LTL in one place", shiptime: true, competitor: "basic" },
        { feature: "Native Canada Post", shiptime: true, competitor: false },
      ],
      chips: ["Best rate found", "Canada Post ready"],
      image: "vs-reason-1",
    },
    {
      tab: "Reason #2",
      title: "Save big with no platform fee",
      body: `Platform fees and add-ons eat into the savings a shipping tool is supposed to deliver. ShipTime has no monthly platform fee, so the discounted rates you see are the savings you keep, unlike ${competitorName}.`,
      mini: [
        { feature: "No platform fee", shiptime: true, competitor: false },
        { feature: "Discounted carrier rates", shiptime: true, competitor: true },
        { feature: "Single invoice across carriers", shiptime: true, competitor: false },
      ],
      chips: ["No platform fee", "One invoice"],
      image: "vs-reason-2",
    },
  ];
}

export const competitors: Competitor[] = [
  // ── FREIGHTCOM ──────────────────────────────────────────────
  {
    slug: "freightcom",
    name: "Freightcom",
    logo: "/logos/freightcom.png",
    metaTitle: "ShipTime vs Freightcom — Parcel, Canada Post & BYOR | ShipTime",
    metaDescription:
      "Compare ShipTime and Freightcom. ShipTime adds native Canada Post, Bring Your Own Rates, unified parcel and freight billing on one invoice, and no platform fee.",
    eyebrow: "ShipTime vs Freightcom",
    headline: "Freightcom handles freight. ShipTime handles everything.",
    subhead:
      "Parcel and LTL freight together. Canada Post built in. Your own negotiated rates, blended automatically. And no platform fee to start.",
    answerFirst:
      "ShipTime is a free multi-carrier shipping platform for Canadian businesses that offers parcel and LTL freight in one system — with native Canada Post support, Bring Your Own Rates, unified billing across all carriers, and shipping audit. Unlike Freightcom, ShipTime has no platform fee and includes Canada Post natively without a separate account or integration.",
    differentiators: [
      {
        icon: "Tag",
        title: "Bring Your Own Rates (BYOR)",
        desc: "Plug in the carrier rates you have already negotiated and shop them alongside ours. Freightcom does not support BYOR, so you are limited to their book of rates.",
      },
      {
        icon: "Map",
        title: "Native Canada Post support",
        desc: "Ship Canada Post directly inside ShipTime. Freightcom has no Canada Post support, which leaves a real gap for Canadian shippers.",
      },
      {
        icon: "Dollar",
        title: "Pre-shipment duties & tax calculator",
        desc: "Quote landed cost before you ship across the border. Freightcom does not offer a pre-shipment duties and tax calculator.",
      },
    ],
    rows: [
      { feature: "Bring Your Own Rates (BYOR)", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Canada Post support", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Pre-shipment duties & tax calculator", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Discounted carrier rates", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "Courier + LTL in one platform", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "Parcel and freight on one invoice", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Shipping analytics", shiptime: "Yes", shiptimeWin: true, competitor: "Basic only" },
      { feature: "Shipping audit", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Carrier dispute support", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "No monthly platform fee", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
    ],
    deepDives: [
      {
        eyebrow: "Your negotiated rates, not just theirs",
        title: "BYOR turns ShipTime into your rate hub",
        body: "Most platforms make you ship on the rates they give you. ShipTime lets you bring the rates you have already earned and compare them against our discounted rates on every shipment, so you always pick the cheapest qualified option.",
        points: [
          "Load your own carrier accounts and negotiated pricing",
          "Shop your rates against ShipTime's on every label",
          "Keep the discounts you have already negotiated",
        ],
      },
      {
        eyebrow: "Built for Canadian shippers",
        title: "Canada Post and cross-border, handled",
        body: "For most Canadian SMBs, Canada Post is not optional. ShipTime supports it natively and adds a pre-shipment duties and tax calculator so cross-border quotes reflect true landed cost before you commit.",
        points: [
          "Native Canada Post (CPC) shipping",
          "Pre-shipment duties and tax estimates",
          "Courier and LTL on one screen with one invoice",
        ],
      },
    ],
    fairCredit: {
      title: "Where Freightcom is a good fit",
      body: SIGNUP_FAIR,
      points: [
        "Businesses whose shipping is predominantly LTL and full truckload freight",
        "Teams that don't need Canada Post or significant parcel volume",
        "Shippers who don't have their own negotiated carrier rates",
      ],
    },
    faq: [
      { q: "Does ShipTime handle LTL freight as well as Freightcom?", a: "Yes — ShipTime manages LTL and parcel in one platform, one dashboard, and one invoice. You don't need a separate freight broker." },
      { q: "Can I get Canada Post rates on ShipTime?", a: "Yes — Canada Post is built in natively, not as a separate integration or account. You can compare Canada Post alongside courier and LTL on every shipment." },
      { q: "Does ShipTime have a platform fee like Freightcom?", a: "No — ShipTime is free to start with no monthly platform fee. You pay only for the shipping labels you print." },
      { q: "Can I bring my own carrier rates to ShipTime?", a: "Yes — Bring Your Own Rates (BYOR) lets you plug in your negotiated carrier pricing and shop it against ShipTime's discounted rates on every shipment." },
      { q: "How does billing work across carriers?", a: "One invoice across all carriers including parcel and freight — no separate freight broker invoice, no reconciliation between systems." },
      { q: "Does ShipTime support cross-border freight?", a: "Yes — Canada-to-US LTL is included with a pre-shipment duties and tax calculator so you see true landed cost before you book." },
    ],
    alternative: {
      competitorPrice: "Varies",
      benefitCards: ALT_BENEFITS,
      social: ALT_SOCIAL,
      quote: {
        text: "Seeing every carrier's rate side by side — and being able to drop in our own negotiated pricing — changed how we ship. Wish we'd switched sooner.",
        name: "Lena B.",
        role: "CEO, Wellness Brand",
      },
      switchingGuide:
        "Switching from Freightcom takes under an hour. Sign up free — no credit card, no sales call. Connect your existing carrier accounts or bring your negotiated rates. Link your store or upload orders. Your first label in under 60 minutes. Your existing Freightcom data stays in Freightcom — nothing to migrate, nothing to break.",
      whyTeamsSwitch: {
        opener:
          "Freightcom is good at freight. But if you also ship parcels, need Canada Post, or want to see all your rates on one screen without calling anyone — you need a different platform. Here's what ShipTime adds.",
        bullets: [
          { before: "Canada Post requires a separate account and integration", after: "Canada Post is built in natively. Compare it alongside every carrier in one search." },
          { before: "Parcel and freight land on separate invoices", after: "One invoice across every carrier. Parcel and freight, one bill, full visibility." },
          { before: "You're limited to Freightcom's rates", after: "Bring your own negotiated rates and shop them against ShipTime's on every label." },
        ],
      },
      features: ALT_FEATURES,
    },
    vs: {
      headline: "ShipTime vs Freightcom: Parcel, Freight, and What Each Platform Actually Covers",
      subhead: "ShipTime goes further with Bring Your Own Rates, native Canada Post, and parcel and freight on one invoice — the things Freightcom doesn't offer out of the box.",
      answerFirst:
        "ShipTime and Freightcom are both Canadian multi-carrier shipping platforms with LTL freight capability. The key differences: ShipTime includes Canada Post natively, offers Bring Your Own Rates, provides unified billing across parcel and freight carriers on one invoice, and has no platform fee. Freightcom is primarily freight-focused with parcel as a secondary capability and doesn't offer BYOR.",
      savings: "Bring your own negotiated rates and keep every discount you've earned.",
      competitorPricing: "Rates vary, no BYOR",
      whoShouldChoose: {
        shiptime: {
          title: "Choose ShipTime if",
          body: "You ship a mix of parcels and freight, need Canada Post, want one invoice across all carrier types, have your own carrier rates, or need audit and analytics built in.",
        },
        competitor: {
          title: "Choose Freightcom if",
          body: "Your shipping is predominantly LTL and full truckload freight and you don't need Canada Post or parcel shipping at significant volume.",
        },
      },
      reasons: vsReasons("Freightcom"),
    },
  },

  // ── SHIPSTATION ─────────────────────────────────────────────
  {
    slug: "shipstation",
    name: "ShipStation",
    metaTitle: "ShipStation Alternative for Canadian Businesses — No Fee | ShipTime",
    metaDescription:
      "ShipStation charges more as you grow. ShipTime has no platform fee, native Canada Post, Bring Your Own Rates, and support that handles carrier disputes on your behalf.",
    eyebrow: "ShipStation Alternative",
    headline: "ShipStation charges more as you grow. ShipTime doesn't charge at all.",
    subhead:
      "No monthly subscription. No support tickets that go nowhere. No US-first carrier coverage that leaves Canadian routes underserved. Just the cheapest label, every time.",
    answerFirst:
      "ShipTime is a free multi-carrier shipping platform built for Canadian and North American businesses as an alternative to ShipStation. Unlike ShipStation's subscription model starting at $14.99/month, ShipTime has no platform fee. It includes full Canadian carrier coverage, parcel and LTL freight in one platform, Bring Your Own Rates, and a support team that handles carrier disputes on your behalf.",
    differentiators: [
      {
        icon: "Dollar",
        title: "No platform fee — ever",
        desc: "ShipTime has no monthly subscription. ShipStation scales from $14.99 to $7,499/month. That fee grows with your volume — ShipTime's never does.",
      },
      {
        icon: "Map",
        title: "Built for Canada, not bolted on",
        desc: "Native Canada Post, Purolator, Canpar, GLS, and cross-border duties calculator. ShipStation is US-first — Canadian carriers are secondary.",
      },
      {
        icon: "Tag",
        title: "Bring Your Own Rates",
        desc: "Already negotiated a UPS or FedEx deal? Bring it. ShipTime blends your rates with ours on every shipment automatically. ShipStation's BYOR support is limited.",
      },
    ],
    rows: [
      { feature: "Monthly platform fee", shiptime: "None", shiptimeWin: true, competitor: "$14.99–$7,499/mo" },
      { feature: "Bring Your Own Rates (BYOR)", shiptime: "Yes", shiptimeWin: true, competitor: "Limited" },
      { feature: "Canada Post support", shiptime: "Yes", shiptimeWin: true, competitor: "Yes", competitorWin: true },
      { feature: "Cross-border duties & tax calculator", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "e-Commerce integrations", shiptime: "Yes", competitor: "Extensive", competitorWin: true },
      { feature: "Shipping automation rules", shiptime: "Yes", competitor: "Advanced", competitorWin: true },
      { feature: "Courier + LTL in one platform", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Single invoice across carriers", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Carrier dispute support", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "No Canadian carrier fees", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
    ],
    deepDives: [
      {
        eyebrow: "Keep your savings",
        title: "No subscription standing between you and lower rates",
        body: "Platform fees quietly offset the discounts a shipping tool is supposed to deliver. ShipTime has no monthly platform fee, so the rates you see are the savings you keep, whether you ship ten parcels a month or ten thousand.",
        points: [
          "No monthly subscription to unlock features",
          "Discounted carrier rates with nothing skimmed off the top",
          "Bring your own negotiated rates and shop them too",
        ],
      },
      {
        eyebrow: "More than parcel automation",
        title: "A logistics platform, not just a label printer",
        body: "ShipStation is excellent at automating US parcel workflows. ShipTime covers courier and LTL on one screen, gives you a single invoice across carriers, and is built around Canadian and cross-border shipping with a duties and tax calculator.",
        points: [
          "Courier and LTL managed together",
          "One invoice across every carrier",
          "Native Canada Post and cross-border duty estimates",
        ],
      },
    ],
    fairCredit: {
      title: "Where ShipStation is a good fit",
      body: SIGNUP_FAIR,
      points: [
        "US-based merchants who ship primarily within the US",
        "Stores that need the widest catalog of e-commerce integrations",
        "Teams comfortable trading a monthly fee for deep parcel automation",
      ],
    },
    faq: [
      { q: "Is ShipTime really free?", a: "Yes — no platform fee, no contract. You pay only for the shipping labels you print. ShipStation starts at $14.99/month and scales to $7,499/month." },
      { q: "Does ShipTime integrate with Shopify like ShipStation?", a: "Yes — ShipTime connects to Shopify, WooCommerce, BigCommerce, Magento, and more. The same integrations as ShipStation, plus Canadian-specific platforms." },
      { q: "Can I bring my UPS or FedEx negotiated rates?", a: "Yes — Bring Your Own Rates (BYOR) blends your negotiated pricing with ShipTime's discounts on every shipment. ShipStation's BYOR support is limited by comparison." },
      { q: "Does ShipTime handle freight and LTL?", a: "Yes — parcel and LTL freight in one platform, one invoice. ShipStation is parcel-only." },
      { q: "Will ShipTime handle carrier claims and disputes for me?", a: "Yes — ShipTime's Heroic Support team deals with carriers on your behalf. ShipStation routes you back to the carrier yourself." },
      { q: "How does ShipTime's pricing compare to ShipStation as I scale?", a: "ShipTime has no platform fee at any volume. ShipStation scales from $14.99/month to $7,499/month as your shipment count and feature needs grow." },
    ],
    alternative: {
      competitorPrice: "$14.99–$7,499/mo",
      benefitCards: ALT_BENEFITS,
      social: ALT_SOCIAL,
      quote: {
        text: "Setup was under five minutes and we were printing labels the same day. The support team actually picks up the phone.",
        name: "James R.",
        role: "Operations Manager",
        context: "Switched from ShipStation after 14 months",
      },
      switchingGuide:
        "Switching from ShipStation takes under an hour. Sign up free — no credit card, no sales call. Connect your existing carrier accounts or paste in your negotiated rates. Link your Shopify or WooCommerce store. Your first label in under 60 minutes. Your old ShipStation data stays in ShipStation — there's nothing to migrate and nothing to break.",
      whyTeamsSwitch: {
        opener:
          "ShipStation works until it doesn't. Then your bill goes up, your support ticket goes unanswered, and you realise Canadian carriers were an afterthought. Here's what changes when you switch to ShipTime.",
        bullets: [
          { before: "ShipStation's rates are US-first", after: "ShipTime includes Canada Post, Purolator, Canpar, and GLS natively — compare all of them in one search." },
          { before: "Stop paying walk-in rates because you don't have volume", after: "ShipTime's pre-negotiated discounts are available from your very first shipment." },
          { before: "Already negotiated a UPS or FedEx deal?", after: "Bring it. ShipTime blends your rates with ours on every shipment automatically." },
        ],
      },
      features: ALT_FEATURES,
    },
    vs: {
      headline: "ShipTime vs ShipStation: What Actually Differs for Canadian Businesses",
      subhead: "ShipStation is built for US-first automation. ShipTime is built for Canadian businesses — no platform fee, full Canadian carrier coverage, and Bring Your Own Rates.",
      answerFirst:
        "ShipTime and ShipStation are both multi-carrier shipping platforms, but they serve different needs. ShipStation is US-first with strong automation and integrations, starting at $14.99/month. ShipTime is Canadian-first with no platform fee, native Canada Post and Canadian carrier support, parcel and LTL freight unified, and a Bring Your Own Rates model that ShipStation doesn't offer.",
      savings: "Skip the monthly subscription and keep your own negotiated carrier rates.",
      competitorPricing: "$14.99–$7,499/mo subscription",
      whoShouldChoose: {
        shiptime: {
          title: "Choose ShipTime if",
          body: "You're Canadian or ship cross-border between Canada and the US, need Canada Post and Canadian carriers natively, want parcel and freight in one platform, don't want a monthly platform fee, or have your own negotiated carrier rates.",
        },
        competitor: {
          title: "Choose ShipStation if",
          body: "You're US-based, shipping primarily within the US, and need deep automation rules and marketplace integrations at scale. ShipStation's breadth of integrations and automation is genuinely strong for high-volume US domestic operations.",
        },
      },
      reasons: vsReasons("ShipStation"),
    },
  },

  // ── STALLION EXPRESS ────────────────────────────────────────
  {
    slug: "stallion-express",
    name: "Stallion Express",
    metaTitle: "Stallion Express Alternative for Growing Canadian Brands | ShipTime",
    metaDescription:
      "Outgrown Stallion Express? ShipTime handles domestic, freight, multi-carrier, and your own negotiated rates — same free pricing model, significantly broader coverage.",
    eyebrow: "Stallion Express Alternative",
    headline: "Outgrown Stallion Express? ShipTime is the next step.",
    subhead:
      "Stallion Express is great for Canada-to-US Shopify orders. ShipTime handles everything else — domestic, freight, multi-carrier, and your own negotiated rates. Same free pricing model, significantly broader coverage.",
    answerFirst:
      "ShipTime is a free multi-carrier shipping platform for Canadian businesses that have outgrown Stallion Express. Where Stallion Express focuses on Canada-to-US Shopify parcel volume, ShipTime adds domestic Canadian carriers, LTL freight, Bring Your Own Rates, and a shipping audit — at no monthly platform fee. It's the natural upgrade for growing brands who need more than one corridor and one carrier.",
    differentiators: [
      {
        icon: "Layers",
        title: "Domestic + cross-border + freight",
        desc: "Stallion Express shines on Canada → US Shopify parcel. ShipTime covers domestic Canadian routes, cross-border, and LTL freight — all in one search.",
      },
      {
        icon: "Tag",
        title: "Bring Your Own Rates",
        desc: "Already negotiated a UPS or FedEx deal? Bring it. ShipTime blends your rates with ours on every shipment automatically. Stallion Express does not support BYOR.",
      },
      {
        icon: "Chart",
        title: "Shipping audit + analytics",
        desc: "ShipTime audits your invoices for carrier billing errors and surfaces analytics on your spend. Stallion Express has no shipping audit.",
      },
    ],
    rows: [
      { feature: "Full Canadian carrier network", shiptime: "Yes", shiptimeWin: true, competitor: "Limited" },
      { feature: "Bring Your Own Rates (BYOR)", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Courier + LTL in one platform", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Cross-border CAN → US", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "Monthly platform fee", shiptime: "None", shiptimeWin: true, competitor: "None", competitorWin: true },
      { feature: "Pre-shipment duties & tax calculator", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Shipping audit", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Single invoice across carriers", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Carrier dispute support", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "LTL freight booking", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
    ],
    deepDives: [
      {
        eyebrow: "More carriers, same price",
        title: "Full Canadian carrier coverage at no monthly fee",
        body: "Stallion Express is tuned for Canada-to-US Shopify volume, which is exactly why brands outgrow it. ShipTime covers domestic Canadian routes with Canada Post, Purolator, Canpar, and GLS — plus cross-border — all in one rate comparison, at no platform fee.",
        points: [
          "Canada Post, Purolator, Canpar, GLS natively",
          "Cross-border with pre-shipment duties calculator",
          "No platform fee at any volume",
        ],
      },
      {
        eyebrow: "Grow into logistics",
        title: "Add LTL, BYOR, and audit as your volume climbs",
        body: "As your brand grows, your shipping complexity grows with it. ShipTime adds LTL freight alongside parcel, lets you bring negotiated carrier rates, and audits your invoices for billing errors automatically.",
        points: [
          "Courier and LTL managed in one place",
          "Bring your own negotiated rates",
          "Shipping audit catches carrier billing errors",
        ],
      },
    ],
    fairCredit: {
      title: "Where Stallion Express is a good fit",
      body: SIGNUP_FAIR,
      points: [
        "Small Shopify sellers focused on Canada-to-US volume",
        "Merchants who want the lowest possible entry cost",
        "Lower-volume parcel shippers who do not need LTL, audit, or domestic Canadian routing",
      ],
    },
    faq: [
      { q: "Does ShipTime cost more than Stallion Express?", a: "No — both are free to use. ShipTime has no monthly platform fee, just like Stallion Express. You pay for labels, not the platform." },
      { q: "Does ShipTime cover Canada-to-US shipping like Stallion?", a: "Yes — ShipTime covers Canada-to-US parcel alongside domestic Canadian and US domestic routes, with a pre-shipment duties and tax calculator built in." },
      { q: "Can I bring my own UPS or FedEx negotiated rates?", a: "Yes — Bring Your Own Rates (BYOR) blends your negotiated pricing with ShipTime's discounts. Stallion Express does not support BYOR." },
      { q: "Does ShipTime handle freight?", a: "Yes — parcel and LTL freight in one platform, one invoice. Stallion Express is parcel only." },
      { q: "What carriers does ShipTime support in Canada?", a: "Canada Post, UPS, FedEx, Purolator, Canpar, GLS, and more — all searched simultaneously so you always get the best rate." },
      { q: "Will ShipTime handle carrier claims for me?", a: "Yes — ShipTime's Heroic Support team handles carrier disputes, claims, and billing errors on your behalf. Stallion Express routes you to the carrier directly." },
    ],
    alternative: {
      competitorPrice: "Free / low-cost",
      benefitCards: ALT_BENEFITS,
      social: ALT_SOCIAL,
      quote: {
        text: "We run a high-volume Shopify store and ShipTime has been bulletproof. Multi-carrier, automated rules, real support. It scales with us.",
        name: "Natalie C.",
        role: "CTO, Fashion Brand",
        context: "Switched from Stallion Express after outgrowing Canada-US routing",
      },
      switchingGuide:
        "Switching from Stallion Express takes under 30 minutes. Sign up free — no credit card, no sales call. Connect your Shopify store or paste in your carrier credentials. Your Stallion Express account stays active; there's nothing to delete or migrate. Start comparing rates on day one and print your first label in under 30 minutes.",
      whyTeamsSwitch: {
        opener:
          "Stallion Express is a great starting point — until your brand ships domestic, needs freight, or lands a carrier deal worth using. Here's what changes when you switch to ShipTime.",
        bullets: [
          { before: "Stallion Express is tuned for Canada → US Shopify volume", after: "ShipTime covers domestic Canadian routes, cross-border, and LTL freight — all in one rate search." },
          { before: "No way to use your negotiated UPS or FedEx rates", after: "Bring Your Own Rates blends your deal with ShipTime's discounts on every shipment." },
          { before: "No shipping audit — carrier billing errors go unnoticed", after: "ShipTime audits your invoices automatically and flags overcharges for you." },
        ],
      },
      features: ALT_FEATURES,
    },
    vs: {
      headline: "ShipTime vs Stallion Express: When to Upgrade and What You Actually Get",
      subhead: "Stallion Express is built for Canada-to-US Shopify parcel. ShipTime is built for Canadian businesses that ship domestic, cross-border, and freight — same free pricing model, significantly broader coverage.",
      answerFirst:
        "ShipTime and Stallion Express are both free to use — no monthly platform fee on either. The difference is coverage. Stallion Express specialises in Canada-to-US Shopify parcel volume. ShipTime adds full domestic Canadian carrier coverage (Canada Post, Purolator, Canpar, GLS), LTL freight, Bring Your Own Rates, and a shipping audit that Stallion Express doesn't offer. If you're still growing, both work. Once you ship domestic or negotiate your own rates, ShipTime is the better fit.",
      savings: "Same free pricing model, with domestic, freight, and your own rates added.",
      competitorPricing: "Free / low-cost",
      whoShouldChoose: {
        shiptime: {
          title: "Choose ShipTime if",
          body: "You ship domestic Canadian routes alongside cross-border, need LTL freight in the same platform, want to bring your own negotiated carrier rates, or need a shipping audit and real support that handles disputes on your behalf.",
        },
        competitor: {
          title: "Stay on Stallion if",
          body: "You're a smaller Shopify seller focused primarily on Canada-to-US parcel volume and don't yet need domestic Canadian carrier routing, freight, BYOR, or shipping audit.",
        },
      },
      reasons: vsReasons("Stallion Express"),
    },
  },

  // ── ESHIPPER ────────────────────────────────────────────────
  {
    slug: "eshipper",
    name: "eShipper",
    metaTitle: "eShipper Alternative — BYOR, Transparency & Canada Post | ShipTime",
    metaDescription:
      "Comparing ShipTime and eShipper? ShipTime adds Bring Your Own Rates, full carrier transparency, native Canada Post, shipping audit, and no platform fee — so you always see the carrier and every fee before you ship.",
    eyebrow: "eShipper Alternative",
    headline: "eShipper hides the carrier. ShipTime shows you everything.",
    subhead:
      "See the exact courier and every surcharge before you ship. Bring your own negotiated rates. Native Canada Post, shipping audit, and no platform fee — all in one transparent platform.",
    answerFirst:
      "ShipTime and eShipper are both Canadian multi-carrier shipping platforms with competitive discounted rates. The difference is control and transparency: ShipTime lets you Bring Your Own Rates, shows you the exact carrier and itemized surcharges on every quote, includes native Canada Post, audits your invoices for billing errors, and charges no platform fee. eShipper leans on white-label services where the underlying courier is not always visible.",
    differentiators: [
      {
        icon: "Tag",
        title: "Bring Your Own Rates (BYOR)",
        desc: "Plug in the carrier rates you have already negotiated and shop them against ours on every label. eShipper does not let you bring your own negotiated rates.",
      },
      {
        icon: "Search",
        title: "Full carrier transparency",
        desc: "ShipTime shows you the exact courier and every surcharge before you ship. eShipper's white-label products do not always reveal which underlying carrier is moving your parcel.",
      },
      {
        icon: "Chart",
        title: "Shipping audit built in",
        desc: "ShipTime audits your invoices for carrier billing errors and recovers overcharges automatically. eShipper does not offer a shipping audit.",
      },
    ],
    rows: [
      { feature: "Discounted carrier rates", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "Bring Your Own Rates (BYOR)", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Full carrier transparency", shiptime: "Yes", shiptimeWin: true, competitor: "White-label" },
      { feature: "Native Canada Post support", shiptime: "Yes", shiptimeWin: true, competitor: "Yes", competitorWin: true },
      { feature: "Courier + LTL in one platform", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "3rd-party fulfillment & warehousing", shiptime: "Partner network", competitor: "Yes", competitorWin: true },
      { feature: "Shipping audit", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Carrier dispute support", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Pre-shipment duties & tax calculator", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "No monthly platform fee", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
    ],
    deepDives: [
      {
        eyebrow: "Know exactly what you're shipping on",
        title: "Transparency on every label, not white-label guesswork",
        body: "eShipper's strength is its white-label and fulfillment services — but white-label means the underlying courier is often hidden. ShipTime shows you the exact carrier and every itemized surcharge before you commit, so you always know who is moving your parcel and what each fee is for.",
        points: [
          "See the exact courier on every quote",
          "Itemized surcharges before you ship, not after",
          "No white-label markup you can't trace",
        ],
      },
      {
        eyebrow: "Your rates, your savings, audited",
        title: "BYOR and shipping audit keep more money in your pocket",
        body: "ShipTime lets you bring the carrier rates you've already negotiated and shop them against ours on every shipment — then audits your invoices for billing errors automatically. eShipper offers neither, so you ship on their book of rates and catch overcharges yourself.",
        points: [
          "Bring your own negotiated carrier pricing",
          "Shop your rates against ShipTime's on every label",
          "Automatic invoice audit recovers carrier overcharges",
        ],
      },
    ],
    fairCredit: {
      title: "Where eShipper is a good fit",
      body: SIGNUP_FAIR,
      points: [
        "Brands that need third-party fulfillment and warehousing under one roof",
        "Merchants who want white-label and branded shipping experiences",
        "High-volume shippers who value zone skipping and same-day options and don't need to bring their own rates",
      ],
    },
    faq: [
      { q: "Is ShipTime cheaper than eShipper?", a: "Both offer strongly discounted carrier rates and the cheapest option varies by lane and weight. Where ShipTime pulls ahead is control: Bring Your Own Rates lets you shop your negotiated pricing on every label, and a built-in shipping audit recovers carrier overcharges eShipper would leave on the table." },
      { q: "Does ShipTime show which carrier I'm shipping with?", a: "Yes — ShipTime shows the exact courier and every itemized surcharge before you ship. eShipper's white-label products don't always reveal the underlying carrier." },
      { q: "Can I bring my own negotiated carrier rates?", a: "Yes — Bring Your Own Rates (BYOR) blends your negotiated pricing with ShipTime's discounts on every shipment. eShipper does not support BYOR." },
      { q: "Does ShipTime have a platform fee like a subscription?", a: "No — ShipTime is free to start with no monthly platform fee. You pay only for the labels you print." },
      { q: "Does ShipTime handle fulfillment like eShipper?", a: "ShipTime offers a growing network of partner 3PLs across Canada and the US for fulfillment flexibility. eShipper runs its own in-house fulfillment and warehousing, which is a good fit if you want everything under one provider." },
      { q: "Will ShipTime handle carrier claims and disputes for me?", a: "Yes — ShipTime's Heroic Support team handles carrier disputes, claims, and billing errors on your behalf, and the shipping audit flags overcharges automatically." },
    ],
    alternative: {
      competitorPrice: "Varies",
      benefitCards: ALT_BENEFITS,
      social: ALT_SOCIAL,
      quote: {
        text: "What sold us was seeing the actual carrier and every fee up front, then dropping in our own UPS rates. No more guessing what we were really paying for.",
        name: "Marcus T.",
        role: "Head of Operations",
        context: "Switched from eShipper",
      },
      switchingGuide:
        "Switching from eShipper takes under an hour. Sign up free — no credit card, no sales call. Connect your existing carrier accounts or bring your negotiated rates. Link your store or upload orders. Your first label in under 60 minutes. Your eShipper account stays active; there's nothing to migrate and nothing to break.",
      whyTeamsSwitch: {
        opener:
          "eShipper is strong on fulfillment and white-label. But if you want to see the actual carrier behind every rate, bring your own negotiated pricing, and have your invoices audited for you — here's what changes with ShipTime.",
        bullets: [
          { before: "White-label rates can hide which courier is carrying your parcel", after: "ShipTime shows the exact courier and every surcharge before you ship." },
          { before: "You ship on eShipper's book of rates", after: "Bring your own negotiated rates and shop them against ShipTime's on every label." },
          { before: "Carrier billing errors are yours to catch", after: "ShipTime's shipping audit flags and recovers overcharges automatically." },
        ],
      },
      features: ALT_FEATURES,
    },
    vs: {
      headline: "ShipTime vs eShipper: Transparency, Your Own Rates, and What Each Platform Covers",
      subhead: "eShipper is built around white-label and fulfillment. ShipTime is built around transparency and control — see the exact carrier, bring your own rates, and get a shipping audit eShipper doesn't offer.",
      answerFirst:
        "ShipTime and eShipper are both Canadian multi-carrier platforms with competitive discounted rates, and on price the cheapest option depends on the lane. The real differences are control and transparency: ShipTime offers Bring Your Own Rates, shows the exact carrier and itemized surcharges on every quote, includes native Canada Post, audits invoices for billing errors, and has no platform fee. eShipper's strengths are its in-house fulfillment, warehousing, and white-label services.",
      savings: "See the exact carrier and every fee, then ship on your own rates.",
      competitorPricing: "Rates vary, white-label",
      whoShouldChoose: {
        shiptime: {
          title: "Choose ShipTime if",
          body: "You want to see the exact carrier and surcharges before you ship, bring your own negotiated rates, need Canada Post and a shipping audit built in, or want real support that handles carrier disputes on your behalf.",
        },
        competitor: {
          title: "Choose eShipper if",
          body: "You need in-house third-party fulfillment and warehousing under one provider, want white-label or branded shipping experiences, or rely on zone skipping and same-day delivery at high volume.",
        },
      },
      reasons: [
        {
          tab: "Reason #1",
          title: "See the exact carrier and every fee before you ship",
          body: "eShipper's white-label products don't always reveal which underlying courier is moving your parcel or what each surcharge is for. ShipTime shows you the exact carrier and itemized fees on every quote, so you always know what you're paying for and who's delivering it.",
          mini: [
            { feature: "Exact carrier shown on every quote", shiptime: true, competitor: "basic" },
            { feature: "Itemized surcharges before you ship", shiptime: true, competitor: false },
            { feature: "Shipping audit recovers overcharges", shiptime: true, competitor: false },
          ],
          chips: ["Carrier shown", "Every fee itemized"],
          image: "vs-reason-1",
        },
        {
          tab: "Reason #2",
          title: "Bring your own rates, with no platform fee",
          body: "eShipper ships you on their book of rates. ShipTime lets you bring the carrier pricing you've already negotiated and shop it against ours on every label — with no monthly platform fee, so the discounts you see are the savings you keep.",
          mini: [
            { feature: "Bring Your Own Rates", shiptime: true, competitor: false },
            { feature: "Discounted carrier rates", shiptime: true, competitor: true },
            { feature: "No platform fee", shiptime: true, competitor: true },
          ],
          chips: ["Your rates blended in", "No platform fee"],
          image: "vs-reason-2",
        },
      ],
    },
  },
];

export function getCompetitor(slug: string): Competitor | undefined {
  return competitors.find((c) => c.slug === slug);
}
