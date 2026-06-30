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
  { title: "No platform fee", desc: "No monthly subscription. The discount you see is the money you keep." },
  { title: "Every carrier, one login", desc: "Courier, LTL, and Canada Post side by side. Compare and ship in seconds." },
  { title: "Bring your own rates", desc: "Drop in the deals you've already negotiated and compare them against ours on every label." },
];

const ALT_SOCIAL = { rating: 4.8, outOf: 5, source: "based on 1,000+ five-star reviews" };

const ALT_FEATURES = [
  {
    eyebrow: "Rate shopping",
    title: "The best rate between ours and yours, every time",
    image: "feature-rate-shopping",
    video: "ShippingFlowComp",
    points: [
      "Compare a wide range of national and regional couriers and LTL carriers on one screen",
      "Up to 70% off walk-in carrier prices",
      "Bring your own negotiated rates and shop them against ours",
    ],
  },
  {
    eyebrow: "One platform",
    title: "Courier, LTL, and Canada Post in one place",
    image: "feature-one-platform",
    video: "TrackingContextComp",
    points: [
      "Parcel and freight, same dashboard",
      "Canada Post built in, with cross-border duty estimates",
      "Labels, pickups, and tracking without switching tabs",
    ],
  },
  {
    eyebrow: "Billing & visibility",
    title: "Catch the overcharges you'd never spot",
    image: "feature-billing-visibility",
    video: "RateAuditComp",
    points: [
      "Every carrier invoice audited automatically",
      "Overcharges flagged before they cost you",
      "Analytics that surface your next savings",
    ],
  },
];

// Shared tabbed "reasons" for the Deel-style /vs/ page. `competitorName` is
// woven in per call so the mini tables read naturally.
function vsReasons(competitorName: string): Competitor["vs"]["reasons"] {
  return [
    {
      tab: "Reason #1",
      title: "Every carrier — and your own rates — in one place",
      body: `Juggling carrier logins and a rate spreadsheet quietly bleeds time and money. ShipTime puts courier, LTL, and Canada Post on one screen and lets you compare your own negotiated rates against ours — something ${competitorName} doesn't fully offer.`,
      mini: [
        { feature: "Bring your own rates", shiptime: true, competitor: false },
        { feature: "Courier + LTL together", shiptime: true, competitor: "basic" },
        { feature: "Canada Post built in", shiptime: true, competitor: false },
      ],
      chips: ["Best rate found", "Canada Post ready"],
      image: "vs-reason-1",
    },
    {
      tab: "Reason #2",
      title: "No platform fee, so the savings stay yours",
      body: `Monthly fees and add-ons quietly eat the savings a shipping tool is supposed to deliver. ShipTime charges no platform fee — the discount you see is the money you keep, which isn't the case with ${competitorName}.`,
      mini: [
        { feature: "No platform fee", shiptime: true, competitor: false },
        { feature: "Discounted carrier rates", shiptime: true, competitor: true },
        { feature: "One invoice across carriers", shiptime: true, competitor: false },
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
    headline: "Everything Freightcom does — plus your own rates.",
    subhead:
      "Parcel and LTL in one place. Canada Post built in. The carrier deals you've already negotiated, blended into every quote. No platform fee, and a team that actually picks up.",
    answerFirst:
      "ShipTime and Freightcom are both free Canadian multi-carrier platforms covering parcel, LTL, and Canada Post. Where ShipTime pulls ahead: you can bring your own negotiated rates (parcel and LTL), pick from a wider lineup of couriers and LTL carriers, get a built-in shipping audit, and reach a real person by phone, email, or chat — none of which Freightcom matches.",
    differentiators: [
      {
        icon: "Tag",
        title: "Bring your own rates",
        desc: "Already negotiated a carrier deal? Drop it in and compare it against ours on every label — parcel and LTL. Freightcom locks you to their book of rates.",
      },
      {
        icon: "Shield",
        title: "We pick up the phone",
        desc: "Real people, by phone, email, or chat — quick to answer and happy to help. Good luck getting a live voice at Freightcom.",
      },
      {
        icon: "Layers",
        title: "More carriers, more backup",
        desc: "A deep bench of national and regional couriers and LTL carriers means you've always got a fallback when one lets you down — a wider lineup than Freightcom.",
      },
    ],
    rows: [
      { feature: "Bring Your Own Rates (BYOR)", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Bring Your Own Rates for LTL", shiptime: "Yes (more limited)", shiptimeWin: true, competitor: "No" },
      { feature: "Canada Post support", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "Wide courier & LTL carrier selection", shiptime: "Yes", shiptimeWin: true, competitor: "Yes" },
      { feature: "Discounted carrier rates", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "Courier + LTL in one platform", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "Live phone, email & chat support", shiptime: "Yes", shiptimeWin: true, competitor: "Limited" },
      { feature: "Shipping audit", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Audit for BYOR invoices", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Carrier dispute support", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "No monthly platform fee", shiptime: "Yes", competitor: "Yes", competitorWin: true },
    ],
    deepDives: [
      {
        eyebrow: "Your rates, not just ours",
        title: "Already negotiated a deal? Bring it",
        body: "Most platforms make you ship on the rates they hand you. ShipTime lets you bring the pricing you've already earned and compare it against ours on every shipment — so you always take the better of the two. That goes for LTL as well, which Freightcom doesn't allow at all.",
        points: [
          "Drop in your own carrier accounts and negotiated pricing",
          "See your rates against ours on every label",
          "Works for LTL too — Freightcom won't let you",
        ],
      },
      {
        eyebrow: "Backup when you need it",
        title: "More carriers, and people who actually answer",
        body: "When one carrier falls through, you need another — fast. ShipTime gives you a deep bench of national and regional couriers and LTL carriers, so there's always a way to get it moving. And when you need a hand, you reach a real person by phone, email, or chat instead of waiting on a line that doesn't pick up.",
        points: [
          "A wider carrier lineup, so you're never stuck",
          "Real support by phone, email, and chat",
          "Built-in shipping audit — and we'll audit your own-rate invoices too",
        ],
      },
    ],
    fairCredit: {
      title: "When Freightcom makes sense",
      body: SIGNUP_FAIR,
      points: [
        "You ship mostly LTL and full truckload freight",
        "You don't need your own negotiated rates in the mix",
        "A built-in shipping audit isn't a priority for you",
      ],
    },
    faq: [
      { q: "Does ShipTime handle LTL freight like Freightcom?", a: "Yes — parcel and LTL live in one dashboard. You can even bring your own LTL rates and compare them against ours, which Freightcom doesn't offer." },
      { q: "Can I get Canada Post rates on ShipTime?", a: "Yes. Canada Post is built in — compare it against every other courier and LTL carrier on the same screen." },
      { q: "Can I bring my own carrier rates?", a: "Yes. Drop in the pricing you've already negotiated and compare it against ours on every shipment — parcel and LTL. Freightcom doesn't support this." },
      { q: "What's your support actually like?", a: "Real people, three ways: phone, email, and chat, during our support hours. They know shipping and they're quick to answer — which isn't always the case when you call Freightcom." },
      { q: "Do you check carrier invoices for errors?", a: "We do. We audit our own carrier bills so we always charge you correctly — and if you bring your own rates, we'll audit those invoices too and catch overcharges before they cost you." },
      { q: "Do you carry more carriers than Freightcom?", a: "Yes — a wider selection of national and regional couriers plus LTL carriers. More options means more backup whenever you need to move something." },
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
        "You can be up and running in under a minute — that's how long registration takes. No sales call. Bring your own carrier rates or use ours, link your store or upload orders, and print your first label. Nothing to migrate: your Freightcom account stays exactly as it is.",
      whyTeamsSwitch: {
        opener:
          "Freightcom is solid on freight. But the day you want your own rates in the mix, a backup carrier, or someone to actually answer the phone — here's where ShipTime steps up.",
        bullets: [
          { before: "Stuck shipping on Freightcom's book of rates", after: "Bring your own — and compare them against ours on every label, parcel and LTL." },
          { before: "Calls that go unanswered", after: "Real people on phone, email, and chat, quick to help." },
          { before: "You catch carrier billing errors yourself", after: "We audit our own bills, and yours too when you bring your rates." },
        ],
      },
      features: ALT_FEATURES,
    },
    vs: {
      headline: "ShipTime vs Freightcom: same coverage, your rates, better support",
      subhead: "Both are free and both cover parcel, LTL, and Canada Post. ShipTime adds the parts that save you money and headaches: your own rates in every quote, a wider carrier lineup, a built-in audit, and a team that answers.",
      answerFirst:
        "ShipTime and Freightcom are both free Canadian multi-carrier platforms covering parcel, LTL, and Canada Post. The difference is the extras: ShipTime lets you bring your own rates (parcel and LTL), gives you a wider lineup of couriers and LTL carriers for backup, audits invoices automatically, and puts a real person on the phone, email, or chat. Freightcom does none of those.",
      savings: "Bring the carrier deals you've already earned — and keep them.",
      competitorPricing: "Free, but no BYOR",
      whoShouldChoose: {
        shiptime: {
          title: "Pick ShipTime if",
          body: "You want your own negotiated rates in every quote (parcel or LTL), a wider carrier lineup for backup, automatic invoice auditing, and a support team that actually picks up.",
        },
        competitor: {
          title: "Pick Freightcom if",
          body: "You ship mostly LTL and full truckload, don't need your own rates in the mix, and aren't looking for a built-in shipping audit.",
        },
      },
      reasons: [
        {
          tab: "Reason #1",
          title: "Your rates, in every quote",
          body: "Freightcom ships you on their numbers. ShipTime lets you drop in the carrier pricing you've already negotiated and compare it against ours on every label — parcel and LTL both, something Freightcom doesn't allow at all.",
          mini: [
            { feature: "Bring your own rates (parcel)", shiptime: true, competitor: false },
            { feature: "Bring your own rates (LTL)", shiptime: true, competitor: false },
            { feature: "Discounted carrier rates", shiptime: true, competitor: true },
          ],
          chips: ["Your rates blended in", "Parcel + LTL"],
          image: "vs-reason-1",
        },
        {
          tab: "Reason #2",
          title: "Backup carriers, and a real voice",
          body: "When one carrier falls through, you need a fallback — ShipTime's deep lineup of national and regional couriers and LTL carriers gives you one. And when something needs a hand, you reach a real person by phone, email, or chat, not a line that rings out the way Freightcom's can.",
          mini: [
            { feature: "Wide courier & LTL lineup", shiptime: true, competitor: true },
            { feature: "Live phone, email & chat", shiptime: true, competitor: "basic" },
            { feature: "Shipping audit built in", shiptime: true, competitor: false },
          ],
          chips: ["Backup carriers", "Real support"],
          image: "vs-reason-2",
        },
      ],
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
    headline: "ShipStation bills you monthly. ShipTime doesn't.",
    subhead:
      "No subscription. No tickets that vanish into a queue. No US-first coverage that treats Canadian routes as an afterthought. Just the best rate, every label.",
    answerFirst:
      "ShipTime is a free multi-carrier platform for Canadian and North American businesses — a no-fee alternative to ShipStation, which starts at $14.99/month and climbs from there. You get full Canadian carrier coverage, parcel and LTL in one place, your own negotiated rates blended in, and a support team that takes carrier disputes off your plate.",
    differentiators: [
      {
        icon: "Dollar",
        title: "No platform fee — ever",
        desc: "ShipStation runs $14.99 to $7,499/month and climbs with your volume. ShipTime's fee is zero, and it stays there no matter how much you ship.",
      },
      {
        icon: "Map",
        title: "Built for Canada, not bolted on",
        desc: "Canada Post, Purolator, Canpar, GLS, and a cross-border duties calculator — all native. On ShipStation, Canadian carriers are the afterthought.",
      },
      {
        icon: "Tag",
        title: "Bring your own rates",
        desc: "Got a UPS or FedEx deal? Bring it. ShipTime compares your rates against ours on every shipment. ShipStation barely supports this.",
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
        title: "Nothing standing between you and the rate",
        body: "A monthly fee quietly cancels out the discount a shipping tool is supposed to deliver. ShipTime charges none — the rate you see is the money you keep, whether you ship ten parcels a month or ten thousand.",
        points: [
          "No subscription to unlock features",
          "Discounted rates with nothing skimmed off the top",
          "Your own negotiated rates in the comparison too",
        ],
      },
      {
        eyebrow: "More than a label printer",
        title: "A shipping platform, not just parcel automation",
        body: "ShipStation is great at automating US parcel workflows. ShipTime goes wider: courier and LTL on one screen, one invoice across carriers, and a Canadian and cross-border backbone with a duties calculator built in.",
        points: [
          "Courier and LTL, managed together",
          "One invoice across every carrier",
          "Canada Post and cross-border duty estimates built in",
        ],
      },
    ],
    fairCredit: {
      title: "When ShipStation makes sense",
      body: SIGNUP_FAIR,
      points: [
        "You ship mostly within the US",
        "You need the broadest catalog of e-commerce integrations",
        "You're happy trading a monthly fee for deep parcel automation",
      ],
    },
    faq: [
      { q: "Is ShipTime really free?", a: "Yes — no platform fee, no contract. You pay for the labels you print, nothing else. ShipStation runs $14.99 to $7,499 a month." },
      { q: "Does it integrate with Shopify like ShipStation?", a: "Yes — Shopify, WooCommerce, BigCommerce, Magento, and more. The same integrations you'd expect, plus Canadian platforms ShipStation skips." },
      { q: "Can I bring my UPS or FedEx rates?", a: "Yes. Your negotiated pricing gets compared against ShipTime's discounts on every shipment — something ShipStation barely supports." },
      { q: "Do you handle freight and LTL?", a: "Yes — parcel and LTL in one place. ShipStation is parcel only." },
      { q: "Will you handle carrier claims for me?", a: "Yes — our Heroic Support team takes disputes and claims off your plate. ShipStation points you back to the carrier to sort it out yourself." },
      { q: "What happens to my bill as I scale?", a: "Nothing — there's no platform fee at any volume. ShipStation's climbs from $14.99 toward $7,499/month as your volume and feature needs grow." },
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
        "Registration takes under a minute and there's no sales call. Bring your own carrier rates or use ours, link your Shopify or WooCommerce store, and print your first label. Your ShipStation account stays put — nothing to migrate, nothing to break.",
      whyTeamsSwitch: {
        opener:
          "ShipStation works — until the bill creeps up, the ticket goes unanswered, and you notice Canadian carriers were never really the point. Here's what changes with ShipTime.",
        bullets: [
          { before: "Rates that lean US-first", after: "Canada Post, Purolator, Canpar, and GLS built in — all compared in one search." },
          { before: "Walk-in prices until you hit volume", after: "Pre-negotiated discounts from your very first shipment." },
          { before: "Got a UPS or FedEx deal already?", after: "Bring it — your rates get compared against ours on every shipment." },
        ],
      },
      features: ALT_FEATURES,
    },
    vs: {
      headline: "ShipTime vs ShipStation: what changes for a Canadian business",
      subhead: "ShipStation is built for US-first automation. ShipTime is built for Canada — no platform fee, full Canadian carrier coverage, and your own rates in every quote.",
      answerFirst:
        "Both are multi-carrier platforms, but they're built for different homes. ShipStation is US-first with deep automation and integrations, starting at $14.99/month. ShipTime is Canada-first and free: native Canada Post and Canadian carriers, parcel and LTL together, and your own negotiated rates blended in — which ShipStation doesn't offer.",
      savings: "Drop the subscription and keep your own negotiated rates.",
      competitorPricing: "$14.99–$7,499/mo",
      whoShouldChoose: {
        shiptime: {
          title: "Pick ShipTime if",
          body: "You ship in Canada or cross-border, want Canada Post and Canadian carriers native, need parcel and freight in one place, would rather skip a monthly fee, or have your own rates to bring.",
        },
        competitor: {
          title: "Pick ShipStation if",
          body: "You're US-based, shipping mostly within the US, and need deep automation and marketplace integrations at scale. For high-volume US domestic operations, that breadth is genuinely strong.",
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
    headline: "Outgrown Stallion Express? This is the next step.",
    subhead:
      "Stallion's great for Canada-to-US Shopify orders. ShipTime picks up everything else — domestic, freight, more carriers, your own rates — and it's still free.",
    answerFirst:
      "ShipTime is the free multi-carrier platform brands move to once they've outgrown Stallion Express. Stallion is built around Canada-to-US Shopify parcel; ShipTime adds domestic Canadian carriers, LTL freight, your own negotiated rates, and an automatic shipping audit — no platform fee, either. It's the natural step up when one corridor and one carrier stop being enough.",
    differentiators: [
      {
        icon: "Layers",
        title: "Domestic, cross-border, and freight",
        desc: "Stallion shines on Canada → US Shopify parcel. ShipTime covers domestic routes, cross-border, and LTL freight too — all in one search.",
      },
      {
        icon: "Tag",
        title: "Bring your own rates",
        desc: "Got a UPS or FedEx deal? Bring it. ShipTime compares your rates against ours on every shipment. Stallion doesn't support this at all.",
      },
      {
        icon: "Chart",
        title: "Audit + analytics",
        desc: "ShipTime checks your invoices for carrier billing errors and shows you where the money goes. Stallion has no audit.",
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
        eyebrow: "More carriers, still free",
        title: "Full Canadian coverage, no monthly fee",
        body: "Stallion is tuned for Canada-to-US Shopify volume — which is exactly why brands outgrow it. ShipTime opens up domestic routes with Canada Post, Purolator, Canpar, and GLS, plus cross-border, all in one comparison and still with no platform fee.",
        points: [
          "Canada Post, Purolator, Canpar, GLS built in",
          "Cross-border with a duties calculator",
          "No platform fee at any volume",
        ],
      },
      {
        eyebrow: "Room to grow",
        title: "Add freight, your own rates, and audit as you scale",
        body: "The bigger your brand, the messier shipping gets. ShipTime grows with it: LTL alongside parcel, your own negotiated rates in every quote, and invoices audited for billing errors without you lifting a finger.",
        points: [
          "Courier and LTL in one place",
          "Your own negotiated rates, blended in",
          "Automatic audit that catches carrier errors",
        ],
      },
    ],
    fairCredit: {
      title: "When Stallion Express makes sense",
      body: SIGNUP_FAIR,
      points: [
        "You're a smaller Shopify seller focused on Canada-to-US volume",
        "You want the lowest possible entry cost",
        "You don't yet need LTL, audit, or domestic Canadian routing",
      ],
    },
    faq: [
      { q: "Is ShipTime more expensive than Stallion?", a: "No — both are free, no platform fee on either. You pay for labels, not the software." },
      { q: "Does it cover Canada-to-US like Stallion?", a: "Yes — Canada-to-US parcel, plus domestic Canadian and US routes, with a duties and tax calculator built in." },
      { q: "Can I bring my own UPS or FedEx rates?", a: "Yes — your negotiated pricing gets compared against ShipTime's discounts on every shipment. Stallion doesn't support this." },
      { q: "Do you handle freight?", a: "Yes — parcel and LTL in one place. Stallion is parcel only." },
      { q: "Which Canadian carriers do you support?", a: "Canada Post, UPS, FedEx, Purolator, Canpar, GLS, and more — all searched at once so you see the best rate." },
      { q: "Will you handle carrier claims for me?", a: "Yes — our Heroic Support team takes disputes, claims, and billing errors off your hands. Stallion sends you to the carrier to deal with it yourself." },
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
        "Registration takes under a minute, no sales call. Link your Shopify store or drop in your carrier credentials and start comparing rates right away. Your Stallion account stays active — nothing to delete, nothing to migrate.",
      whyTeamsSwitch: {
        opener:
          "Stallion is a great starting point — right up until your brand ships domestic, needs freight, or lands a carrier deal worth using. Here's what changes with ShipTime.",
        bullets: [
          { before: "Built around Canada → US Shopify volume", after: "Domestic routes, cross-border, and LTL freight — all in one search." },
          { before: "No way to use your UPS or FedEx deal", after: "Bring it — your rates get compared against ours on every shipment." },
          { before: "Carrier billing errors slip by unnoticed", after: "Invoices audited automatically, overcharges flagged for you." },
        ],
      },
      features: ALT_FEATURES,
    },
    vs: {
      headline: "ShipTime vs Stallion Express: when to make the jump",
      subhead: "Stallion is built for Canada-to-US Shopify parcel. ShipTime is built for brands that also ship domestic, cross-border, and freight — same free pricing, much wider coverage.",
      answerFirst:
        "Both are free — no platform fee on either. The difference is reach. Stallion specializes in Canada-to-US Shopify parcel. ShipTime adds full domestic Canadian coverage (Canada Post, Purolator, Canpar, GLS), LTL freight, your own negotiated rates, and an automatic shipping audit Stallion doesn't offer. While you're small, both work. The day you ship domestic or land your own carrier deal, ShipTime fits better.",
      savings: "Same free model — with domestic, freight, and your own rates added.",
      competitorPricing: "Free, one corridor",
      whoShouldChoose: {
        shiptime: {
          title: "Pick ShipTime if",
          body: "You ship domestic as well as cross-border, want LTL in the same place, have your own carrier rates to bring, or want an audit and a team that handles disputes for you.",
        },
        competitor: {
          title: "Stay on Stallion if",
          body: "You're a smaller seller focused on Canada-to-US parcel and don't yet need domestic routing, freight, your own rates, or an audit.",
        },
      },
      reasons: [
        {
          tab: "Reason #1",
          title: "One corridor, or all of them",
          body: "Stallion is built around Canada-to-US Shopify parcel. ShipTime covers that and the rest — domestic Canadian routes, cross-border, and LTL freight — in a single rate search, so you don't outgrow the tool the moment your shipping does.",
          mini: [
            { feature: "Canada → US parcel", shiptime: true, competitor: true },
            { feature: "Domestic Canadian routing", shiptime: true, competitor: false },
            { feature: "LTL freight booking", shiptime: true, competitor: false },
          ],
          chips: ["Every route", "Parcel + LTL"],
          image: "vs-reason-1",
        },
        {
          tab: "Reason #2",
          title: "Your own rates, plus an audit",
          body: "Stallion ships you on its rates and leaves billing errors for you to catch. ShipTime lets you bring the carrier deals you've negotiated and compare them on every label, then audits your invoices automatically — all still free.",
          mini: [
            { feature: "Bring your own rates", shiptime: true, competitor: false },
            { feature: "Automatic shipping audit", shiptime: true, competitor: false },
            { feature: "No platform fee", shiptime: true, competitor: true },
          ],
          chips: ["Your rates blended in", "Audited automatically"],
          image: "vs-reason-2",
        },
      ],
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
      "See the exact courier and every surcharge before you ship. Bring your own negotiated rates. A wider carrier lineup and a built-in audit — all out in the open.",
    answerFirst:
      "ShipTime and eShipper are both free Canadian multi-carrier platforms with strong discounted rates. The difference is control and transparency: ShipTime lets you bring your own rates, shows the exact carrier and every itemized surcharge on each quote, and audits your invoices for billing errors automatically. eShipper leans on white-label services, where the carrier actually moving your parcel isn't always visible.",
    differentiators: [
      {
        icon: "Tag",
        title: "Bring your own rates",
        desc: "Drop in the carrier deals you've already negotiated and compare them against ours on every label. eShipper doesn't let you bring your own.",
      },
      {
        icon: "Search",
        title: "See the actual carrier",
        desc: "The exact courier and every surcharge, shown before you ship. eShipper's white-label products often hide which carrier is really moving your parcel.",
      },
      {
        icon: "Chart",
        title: "Audit built in",
        desc: "ShipTime checks your invoices for carrier billing errors and recovers overcharges automatically. eShipper doesn't.",
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
      { feature: "No monthly platform fee", shiptime: "Yes", competitor: "Yes", competitorWin: true },
    ],
    deepDives: [
      {
        eyebrow: "Know what you're shipping on",
        title: "The real carrier, not white-label guesswork",
        body: "eShipper's strength is white-label and fulfillment — but white-label means the carrier behind your label is often hidden. ShipTime shows you the exact courier and every itemized surcharge before you commit, so you always know who's moving your parcel and what each line is for.",
        points: [
          "The exact courier, on every quote",
          "Surcharges itemized before you ship, not after",
          "No white-label markup you can't trace",
        ],
      },
      {
        eyebrow: "Your rates, audited",
        title: "Bring your own rates — and we'll check the bill",
        body: "ShipTime lets you bring the carrier pricing you've already negotiated and compare it against ours on every shipment, then audits your invoices for billing errors automatically. eShipper does neither — you ship on their numbers and catch overcharges yourself.",
        points: [
          "Your own negotiated pricing, in every quote",
          "Compared against ShipTime's on every label",
          "Automatic audit that recovers overcharges",
        ],
      },
    ],
    fairCredit: {
      title: "When eShipper makes sense",
      body: SIGNUP_FAIR,
      points: [
        "You want third-party fulfillment and warehousing under one roof",
        "You're after white-label or branded shipping experiences",
        "You lean on zone skipping and same-day at high volume and don't need your own rates",
      ],
    },
    faq: [
      { q: "Is ShipTime cheaper than eShipper?", a: "Both run strong discounted rates, and the cheaper one depends on the lane and weight. Where ShipTime pulls ahead is control: you can bring your own negotiated pricing on every label, and a built-in audit recovers overcharges eShipper would leave on the table." },
      { q: "Will I know which carrier I'm shipping with?", a: "Yes — the exact courier and every surcharge, shown before you ship. eShipper's white-label products don't always reveal the carrier underneath." },
      { q: "Can I bring my own negotiated rates?", a: "Yes — your pricing gets compared against ShipTime's discounts on every shipment. eShipper doesn't support this." },
      { q: "Is there a platform fee?", a: "No — ShipTime is free, same as eShipper. You pay for the labels you print, nothing else." },
      { q: "Do you handle fulfillment like eShipper?", a: "ShipTime works with a growing network of partner 3PLs across Canada and the US. eShipper runs its own in-house fulfillment and warehousing — a better fit if you want everything under one provider." },
      { q: "Will you handle carrier claims for me?", a: "Yes — our Heroic Support team takes disputes, claims, and billing errors off your hands, and the audit flags overcharges automatically." },
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
        "Registration takes under a minute, no sales call. Bring your own carrier rates or use ours, link your store or upload orders, and print your first label. Your eShipper account stays active — nothing to migrate, nothing to break.",
      whyTeamsSwitch: {
        opener:
          "eShipper is strong on fulfillment and white-label. But the moment you want to see the actual carrier, bring your own pricing, or have someone audit your invoices — here's what changes with ShipTime.",
        bullets: [
          { before: "White-label can hide the courier carrying your parcel", after: "The exact courier and every surcharge, shown before you ship." },
          { before: "You ship on eShipper's numbers", after: "Bring your own rates and compare them against ours on every label." },
          { before: "Billing errors are yours to catch", after: "Our audit flags and recovers overcharges automatically." },
        ],
      },
      features: ALT_FEATURES,
    },
    vs: {
      headline: "ShipTime vs eShipper: transparency and control vs white-label",
      subhead: "eShipper is built around white-label and fulfillment. ShipTime is built around showing you everything — the real carrier, your own rates, and an audit eShipper doesn't offer.",
      answerFirst:
        "Both are free Canadian multi-carrier platforms with strong discounted rates, and the cheaper one depends on the lane. The real split is control and transparency: ShipTime lets you bring your own rates, shows the exact carrier and itemized surcharges on every quote, and audits invoices for billing errors. eShipper's strengths sit elsewhere — in-house fulfillment, warehousing, and white-label services.",
      savings: "See the real carrier and every fee, then ship on your own rates.",
      competitorPricing: "Free, but white-label",
      whoShouldChoose: {
        shiptime: {
          title: "Pick ShipTime if",
          body: "You want to see the exact carrier and surcharges before you ship, bring your own negotiated rates, have an audit built in, or want a team that handles carrier disputes for you.",
        },
        competitor: {
          title: "Pick eShipper if",
          body: "You need in-house fulfillment and warehousing under one provider, want white-label or branded shipping, or lean on zone skipping and same-day at high volume.",
        },
      },
      reasons: [
        {
          tab: "Reason #1",
          title: "The real carrier and every fee, up front",
          body: "eShipper's white-label products don't always show which courier is moving your parcel or what each surcharge is for. ShipTime puts the exact carrier and itemized fees on every quote — so you always know what you're paying and who's delivering.",
          mini: [
            { feature: "Exact carrier on every quote", shiptime: true, competitor: "basic" },
            { feature: "Itemized surcharges before you ship", shiptime: true, competitor: false },
            { feature: "Audit recovers overcharges", shiptime: true, competitor: false },
          ],
          chips: ["Carrier shown", "Every fee itemized"],
          image: "vs-reason-1",
        },
        {
          tab: "Reason #2",
          title: "Your rates in, overcharges out",
          body: "eShipper ships you on their numbers. ShipTime lets you bring the pricing you've already negotiated and compare it on every label, then audits your invoices automatically — so carrier billing errors get caught and recovered instead of quietly costing you.",
          mini: [
            { feature: "Bring your own rates", shiptime: true, competitor: false },
            { feature: "Discounted carrier rates", shiptime: true, competitor: true },
            { feature: "Automatic invoice audit", shiptime: true, competitor: false },
          ],
          chips: ["Your rates blended in", "Audited automatically"],
          image: "vs-reason-2",
        },
      ],
    },
  },
];

export function getCompetitor(slug: string): Competitor | undefined {
  return competitors.find((c) => c.slug === slug);
}
