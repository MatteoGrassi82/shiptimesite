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
    answerFirst: string;            // AEO paragraph for vs page (short lead)
    answerFirstMore?: string;       // optional 2nd paragraph elaborating the lead
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
    title: "Every major carrier and service in one place.",
    image: "feature-one-platform",
    video: "TrackingContextComp",
    points: [
      "Parcel and freight, same dashboard",
      "Branded tracking that keeps your customers in your brand, not the carrier's",
      "Book and manage carrier pickups without leaving the platform",
      "Duties and taxes calculated — not estimated — for cross-border and international shipments",
    ],
  },
  {
    eyebrow: "Billing & visibility",
    title: "Catch the overcharges you'd never spot",
    image: "feature-billing-visibility",
    video: "RateAuditComp",
    points: [
      "The carrier invoices for the rates you bring, audited for overbilling — set up with us",
      "Overcharges flagged before they cost you",
      "Analytics that surface your next savings",
    ],
  },
];

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
      "Both are free shipping platforms that support courier and LTL modes. ShipTime includes capabilities that lower your true cost of shipping: your own rates compared in every quote, a broader array of carriers, a built-in shipment audit, and a knowledgeable and responsive support team based in Canada.",
    differentiators: [
      {
        icon: "Tag",
        title: "Bring your own rates",
        desc: "Already negotiated a carrier deal? Drop it in and compare it against ours on every label — parcel and LTL. Freightcom locks you to their book of rates.",
      },
      {
        icon: "Shield",
        title: "We pick up the phone",
        desc: "Real people based in Canada, by phone, email, or chat — quick to answer and happy to help. Reaching a live person at Freightcom isn't always as easy.",
      },
      {
        icon: "Layers",
        title: "More carriers, more backup",
        desc: "A deep bench of national and regional couriers and LTL carriers means you've always got a fallback when one lets you down — a wider lineup than Freightcom.",
      },
    ],
    rows: [
      { feature: "Bring Your Own Courier Rates (BYOR)", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Bring Your Own Rates for LTL", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Canada Post support", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "Wide courier & LTL carrier selection", shiptime: "Yes", shiptimeWin: true, competitor: "More limited", competitorWin: true },
      { feature: "Discounted carrier rates", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "Discounted shipping insurance", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "Insure without a forced signature", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Courier + LTL in one platform", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "Live phone, email & chat support", shiptime: "Yes", shiptimeWin: true, competitor: "Limited" },
      { feature: "Shipment audit on your BYOR invoices", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
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
      { q: "What's your support actually like?", a: "Real people based in Canada, three ways: phone, email, and chat, during our support hours. They know shipping and they're quick to answer — which is typically not the case when you call Freightcom." },
      { q: "How fast do you actually answer?", a: "So far this year our Canadian team has taken more than 10,000 support calls, with an average time to answer of 26 seconds — and fewer than 1% of callers needed a callback. You reach a person, not a queue." },
      { q: "Do you check carrier invoices for errors?", a: "We do — on the carrier invoices for the rates you bring to ShipTime. Set it up with us once, and we'll check those bills for overcharges and help you recover them." },
      { q: "Do you carry more carriers than Freightcom?", a: "Yes — a wider selection of national and regional couriers plus LTL carriers. More options means more backup whenever you need to move something and often, better prices." },
      { q: "Do you offer warehousing and fulfillment?", a: "We're building out warehousing and fulfillment capability across Canada and the U.S., including support for cross-border activity. Freightcom offers this under a separate brand; if you need a full 3PL under one roof today, that's worth weighing — and worth asking us where our coverage stands for your lanes." },
    ],
    alternative: {
      competitorPrice: "Varies",
      benefitCards: ALT_BENEFITS,
      social: ALT_SOCIAL,
      quote: {
        text: "So happy we switched to ShipTime! The local rates are way cheaper than the courier we were using and seeing all the options on one page (without signing into 5 different portals) is such a time saver.",
        name: "Paul V.",
        role: "Operations Manager",
      },
      switchingGuide:
        "Registration takes under a minute, and there's no sales call. Bring your own carrier rates or use ours, link your store or upload orders, and print your first label — connect a store and you can be up and running in about 15 minutes. Nothing to migrate: your Freightcom account stays exactly as it is.",
      whyTeamsSwitch: {
        opener:
          "Freightcom is solid on freight. But the day you want your own rates in the mix, a backup carrier, or someone to actually answer the phone — here's where ShipTime steps up.",
        bullets: [
          { before: "Stuck shipping on Freightcom's book of rates", after: "Bring your own courier rates and compare them against ours on every label — parcel and LTL both." },
          { before: "Calls that go unanswered", after: "Real people based in Canada — 26 seconds to answer on average, by phone, email, or chat." },
          { before: "You catch carrier billing errors yourself", after: "Bring your own rates and we'll audit those carrier invoices for overbilling — set it up once and errors get caught before they cost you." },
        ],
      },
      features: ALT_FEATURES,
    },
    vs: {
      headline: "ShipTime vs Freightcom: same coverage, your rates, better support",
      subhead: "Both are free platforms covering courier and LTL. ShipTime adds the parts that lower your true cost of shipping: your own courier rates in every quote, a broader carrier lineup, a built-in shipment audit, and a knowledgeable support team based in Canada.",
      answerFirst:
        "Both are free shipping platforms that support courier and LTL modes. ShipTime is built to lower your true cost of shipping — not just the cost of a label.",
      answerFirstMore:
        "That shows up in the details: your own courier rates compared in every quote, a broader array of carriers and services to choose from, branded tracking and pickups managed in the same place you ship, a shipment audit that catches carrier overbilling on the rates you bring, and a knowledgeable Canadian support team you can actually reach and rely on. Those are the costs a label price never shows — savings missed without your own rates in the mix, overbilling nobody catches, claims that stall, and hours lost chasing support.",
      savings: "Bring the carrier deals you've already earned — and keep them.",
      competitorPricing: "Free, but no BYOR",
      whoShouldChoose: {
        shiptime: {
          title: "Pick ShipTime if",
          body: "You want to lower your true cost of shipping: your own courier rates compared in every quote, a broader carrier lineup for backup, branded tracking and pickups managed where you ship, a shipment audit on the invoices you bring, and a knowledgeable Canadian support team you can actually reach and rely on.",
        },
        competitor: {
          title: "Pick Freightcom if",
          body: "You ship mostly LTL and full truckload, don't need your own rates in the mix, and are comfortable without a hands-on support team to answer questions or resolve issues when they come up.",
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
          body: "When one carrier falls through, you need a fallback — ShipTime's deep lineup of national and regional couriers and LTL carriers gives you one. And when something needs a hand, you reach a real person by phone, email, or chat, instead of waiting on hold.",
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
      "No subscription. No tickets that vanish into a queue. No shortage of Canadian carrier options, and deeply discounted rates ShipStation simply doesn't carry. Just the best rate, every label.",
    answerFirst:
      "ShipTime is a free multi-carrier platform for Canadian and North American businesses — a no-fee alternative to ShipStation, which starts at $14.99/month and climbs from there. ShipTime is built to lower your true cost of shipping, not just the cost of a label: far more Canadian carrier options with deeply discounted rates of our own, parcel and LTL in one place, your negotiated rates compared against ours, and a Canadian support team that takes carrier disputes off your plate.",
    differentiators: [
      {
        icon: "Dollar",
        title: "No platform fee — ever",
        desc: "ShipStation runs $14.99 to $7,499/month and climbs with your volume. ShipTime's fee is zero, and it stays there no matter how much you ship.",
      },
      {
        icon: "Map",
        title: "Built for Canada, not bolted on",
        desc: "Canada Post, Purolator, Canpar, GLS, and duties and taxes calculated up front — all native, with deeply discounted Canadian rates. ShipStation gives Canadian shippers far fewer options and no discounted rates of its own.",
      },
      {
        icon: "Tag",
        title: "Your rates and ours, side by side",
        desc: "Both platforms let you bring your own carrier accounts. Only ShipTime puts your negotiated pricing next to our discounted Canadian rates on every label, so you take whichever is cheaper.",
      },
    ],
    rows: [
      { feature: "Monthly platform fee", shiptime: "None", shiptimeWin: true, competitor: "$14.99–$7,499/mo" },
      { feature: "Bring Your Own Courier Rates (BYOR)", shiptime: "Yes", shiptimeWin: true, competitor: "Yes", competitorWin: true },
      { feature: "Discounted Canadian carrier rates", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Canadian carrier selection", shiptime: "Yes", shiptimeWin: true, competitor: "More limited", competitorWin: true },
      { feature: "Canada Post support", shiptime: "Yes", shiptimeWin: true, competitor: "Yes", competitorWin: true },
      { feature: "Duties & taxes calculated (cross-border & int'l)", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
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
      { q: "Can I bring my UPS or FedEx rates?", a: "Yes. ShipStation lets you connect your own carrier accounts too — the difference is that ShipTime compares your negotiated pricing against our discounted Canadian rates on every shipment, so you always take whichever is cheaper." },
      { q: "Do you handle freight and LTL?", a: "Yes — parcel and LTL in one place. ShipStation is parcel only." },
      { q: "Will you handle carrier claims for me?", a: "Yes — our Canada-based Heroic Support team takes disputes and claims off your plate. ShipStation points you back to the carrier to sort it out yourself." },
      { q: "How fast do you actually answer?", a: "So far this year our Canadian team has taken more than 10,000 support calls, with an average time to answer of 26 seconds — and fewer than 1% of callers needed a callback. You reach a person, not a ticket queue." },
      { q: "What happens to my bill as I scale?", a: "Nothing — there's no platform fee at any volume. ShipStation's climbs from $14.99 toward $7,499/month as your volume and feature needs grow." },
    ],
    alternative: {
      competitorPrice: "$14.99–$7,499/mo",
      benefitCards: ALT_BENEFITS,
      social: ALT_SOCIAL,
      quote: {
        text: "I recently started using ShipTime for my business and the platform is extremely user friendly. Comparing courier rates, delivery times, and pickup options all on one screen makes shipping simple. The rates are far better than what we previously received as a shipping agent.",
        name: "Mary",
        role: "Business Owner",
      },
      switchingGuide:
        "Registration takes under a minute and there's no sales call. Bring your own carrier rates or use ours, link your Shopify or WooCommerce store, and print your first label. Your ShipStation account stays put — nothing to migrate, nothing to break.",
      whyTeamsSwitch: {
        opener:
          "ShipStation works — until the bill creeps up, the ticket goes unanswered, and you notice Canadian carriers were never really the point. Here's what changes with ShipTime.",
        bullets: [
          { before: "Few Canadian carrier options to choose from", after: "Canada Post, Purolator, Canpar, and GLS built in — all compared in one search." },
          { before: "No discounted Canadian rates of their own", after: "Deeply discounted Canadian rates from your very first shipment." },
          { before: "A monthly platform fee that climbs as you grow", after: "No platform fee, at any volume — the discount you see is the money you keep." },
          { before: "Support that leaves you chasing a ticket queue", after: "A Canadian team that answers in 26 seconds on average — and takes the carrier disputes off your plate." },
          { before: "Your own carrier rates, on their own", after: "Your negotiated rates compared against our discounted Canadian rates on every label." },
        ],
      },
      features: ALT_FEATURES,
    },
    vs: {
      headline: "ShipTime vs ShipStation: what changes for a Canadian business",
      subhead: "ShipStation is built for US parcel automation. ShipTime is built for Canada — no platform fee, far more Canadian carrier options at deeply discounted rates, and support you can rely on.",
      answerFirst:
        "ShipStation charges a monthly subscription that climbs as you grow, and carries no discounted Canadian rates of its own. ShipTime is Canada-first and free — built to lower your true cost of shipping, not just the cost of a label.",
      answerFirstMore:
        "That shows up in the details: no platform fee at any volume, far more Canadian carrier options with deeply discounted rates from your first label, your own negotiated rates compared against ours so you always take the cheaper one, parcel and LTL in one place, branded tracking and pickups managed where you ship, and a knowledgeable Canadian support team you can actually reach and rely on — one that takes carrier disputes and claims off your plate.",
      savings: "Drop the subscription and keep your own negotiated rates.",
      competitorPricing: "$14.99–$7,499/mo",
      whoShouldChoose: {
        shiptime: {
          title: "Pick ShipTime if",
          body: "You ship in Canada or cross-border, want Canada Post and Canadian carriers native, need parcel and freight in one place, would rather skip a monthly fee, or have your own rates to bring.",
        },
        competitor: {
          title: "Pick ShipStation if",
          body: "You're US-based, shipping mostly within the US, and need deep automation and marketplace integrations at scale — and you're not expecting responsive, knowledgeable support to be there when something goes wrong. For high-volume US domestic operations, that breadth is genuinely strong.",
        },
      },
      reasons: [
        {
          tab: "Reason #1",
          title: "Built for Canada, with the rates to match",
          body: "ShipStation connects you to carriers, but it brings no discounted Canadian rates of its own and a much shorter list of Canadian options. ShipTime is Canada-first: Canada Post, Purolator, Canpar, and GLS built in, deeply discounted from your very first label, with duties and taxes calculated up front.",
          mini: [
            { feature: "Discounted Canadian rates", shiptime: true, competitor: false },
            { feature: "Wide Canadian carrier selection", shiptime: true, competitor: "basic" },
            { feature: "Duties & taxes calculated", shiptime: true, competitor: false },
          ],
          chips: ["Discounted from day one", "Canada-first"],
          image: "vs-reason-1",
        },
        {
          tab: "Reason #2",
          title: "No platform fee, and support that answers",
          body: "ShipStation runs $14.99 to $7,499 a month and climbs with your volume, with support that routes you to a ticket queue. ShipTime charges no platform fee at any volume, and puts a knowledgeable Canadian team on phone, email, and chat who take carrier disputes off your plate.",
          mini: [
            { feature: "No monthly platform fee", shiptime: true, competitor: false },
            { feature: "Live Canadian phone, email & chat", shiptime: true, competitor: "basic" },
            { feature: "Carrier dispute support", shiptime: true, competitor: false },
          ],
          chips: ["No platform fee", "Canadian support"],
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
    headline: "With eShipper you ship their carriers. With ShipTime, yours too.",
    subhead:
      "Both compare carriers and services before you ship. Only ShipTime lets you bring the rates you've already negotiated, audits the bill, and puts a Canadian support team on the line.",
    answerFirst:
      "ShipTime and eShipper are both free Canadian multi-carrier platforms with strong discounted rates, and both let you compare carriers and services while you process a shipment. ShipTime is built to lower your true cost of shipping — not just the cost of a label: you can bring your own courier rates into every quote, we audit the carrier invoices for the rates you bring, and you get a knowledgeable Canadian support team you can actually reach and rely on.",
    differentiators: [
      {
        icon: "Tag",
        title: "Bring your own rates",
        desc: "Drop in the carrier deals you've already negotiated and compare them against ours on every label. With eShipper you only ship with eShipper's carriers.",
      },
      {
        icon: "Shield",
        title: "Support you can rely on",
        desc: "A knowledgeable Canadian team by phone, email, or chat — quick to answer, and they take carrier disputes and claims off your plate.",
      },
      {
        icon: "Chart",
        title: "Audit built in",
        desc: "Set it up once and we check the carrier invoices for the rates you bring, flagging overbilling before it costs you. eShipper doesn't.",
      },
    ],
    rows: [
      { feature: "Discounted carrier rates", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "Bring Your Own Courier Rates (BYOR)", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Compare carriers & services before you ship", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "Branded tracking", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "Native Canada Post support", shiptime: "Yes", shiptimeWin: true, competitor: "Yes", competitorWin: true },
      { feature: "Courier + LTL in one platform", shiptime: "Yes", competitor: "Yes", competitorWin: true },
      { feature: "3rd-party fulfillment & warehousing", shiptime: "Partner network", competitor: "Yes", competitorWin: true },
      { feature: "Shipping audit", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Carrier dispute support", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "Duties & taxes calculated (cross-border & int'l)", shiptime: "Yes", shiptimeWin: true, competitor: "No" },
      { feature: "No monthly platform fee", shiptime: "Yes", competitor: "Yes", competitorWin: true },
    ],
    deepDives: [
      {
        eyebrow: "Your carriers, not just theirs",
        title: "Ship the rates you've already earned",
        body: "eShipper gives you a solid book of discounted rates and shows you carriers and services as you process a shipment. What you can't do is bring your own. ShipTime puts the pricing you've already negotiated side by side with ours on every label, so you always take the better of the two.",
        points: [
          "Your own negotiated pricing, in every quote",
          "Compared against ShipTime's on every label",
          "You're never limited to one platform's book of rates",
        ],
      },
      {
        eyebrow: "Your rates, audited",
        title: "We check the bill so you don't have to",
        body: "Carrier invoices are where quiet overbilling lives. Set up our audit once and we check the carrier invoices for the rates you bring, flag the errors, and help you recover them — something you'd be doing yourself on eShipper.",
        points: [
          "Overbilling flagged before it costs you",
          "Help recovering what you're owed",
          "A Canadian support team that handles the dispute",
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
      { q: "Will I know which carrier I'm shipping with?", a: "Yes — the exact courier, service, and surcharges are shown before you ship. eShipper shows carriers and services during processing too; the difference is that ShipTime also lets you bring your own carrier rates into that comparison." },
      { q: "Can I bring my own negotiated rates?", a: "Yes — your pricing gets compared against ShipTime's discounts on every shipment. eShipper doesn't support this." },
      { q: "Is there a platform fee?", a: "No — ShipTime is free, same as eShipper. You pay for the labels you print, nothing else." },
      { q: "Do you handle warehousing and fulfillment like eShipper?", a: "We're building out warehousing and fulfillment capability across Canada and the U.S., including support for cross-border activity, alongside a growing network of partner 3PLs. eShipper runs its own in-house fulfillment today — a better fit if you need everything under one provider right now, so it's worth asking us where our coverage stands for your lanes." },
      { q: "Will you handle carrier claims for me?", a: "Yes — our Canada-based Heroic Support team takes disputes, claims, and billing errors off your hands, and once it's set up the audit flags overcharges on the invoices you bring." },
      { q: "How fast do you actually answer?", a: "So far this year our Canadian team has taken more than 10,000 support calls, with an average time to answer of 26 seconds — and fewer than 1% of callers needed a callback. You reach a person, not a queue." },
    ],
    alternative: {
      competitorPrice: "Varies",
      benefitCards: ALT_BENEFITS,
      social: ALT_SOCIAL,
      quote: {
        text: "I've used ShipTime for years to ship photography prints and calendars, and every order has arrived safely and on time. Having all courier options, service times, and pricing on one screen makes shipping simple. The rates are always much better than shipping directly with the couriers.",
        name: "Great West Auctions & Realty",
        role: "Long-time ShipTime customer",
      },
      switchingGuide:
        "Registration takes under a minute, no sales call. Bring your own carrier rates or use ours, link your store or upload orders, and print your first label. Your eShipper account stays active — nothing to migrate, nothing to break.",
      whyTeamsSwitch: {
        opener:
          "eShipper is strong on fulfillment and white-label, and it does let you compare carriers and services as you ship. But the moment you want your own pricing in that comparison, someone auditing your invoices, or a support team you can rely on — here's what changes with ShipTime.",
        bullets: [
          { before: "You only ship with eShipper's carriers", after: "Bring your own courier rates and compare them against ours on every label." },
          { before: "Billing errors are yours to catch", after: "Set up our audit once and it flags and recovers overcharges on the invoices you bring." },
          { before: "Support that leaves you chasing", after: "A Canadian team that answers in 26 seconds on average — and takes the carrier disputes off your plate." },
        ],
      },
      features: ALT_FEATURES,
    },
    vs: {
      headline: "ShipTime vs eShipper: your rates, audited, with real support",
      subhead: "Both compare carriers and services before you ship. ShipTime adds the parts that lower your true cost: your own courier rates in every quote, an audit on the bill, and a Canadian support team you can rely on.",
      answerFirst:
        "Both are free platforms with strong discounted rates, and both let you compare carriers and services as you process a shipment. ShipTime is built to lower your true cost of shipping — not just the cost of a label.",
      answerFirstMore:
        "That shows up in what happens around the rate: your own negotiated courier rates compared against ours on every label, a shipment audit that catches carrier overbilling on the invoices you bring, branded tracking and pickups managed where you ship, and a knowledgeable Canadian support team you can actually reach and rely on — one that takes the disputes and claims off your plate. eShipper's strengths sit elsewhere: in-house fulfillment, warehousing, and white-label shipping experiences.",
      savings: "Bring the carrier deals you've already earned — and keep them.",
      competitorPricing: "Free, no BYOR",
      whoShouldChoose: {
        shiptime: {
          title: "Pick ShipTime if",
          body: "You want your own negotiated rates in every quote, an audit on the carrier invoices you bring, branded tracking and pickups in one place, and a Canadian support team that handles carrier disputes for you.",
        },
        competitor: {
          title: "Pick eShipper if",
          body: "You need in-house fulfillment and warehousing under one provider, want white-label or branded shipping experiences, or lean on zone skipping and same-day at high volume and don't need your own rates in the mix.",
        },
      },
      reasons: [
        {
          tab: "Reason #1",
          title: "Your rates in, overcharges out",
          body: "With eShipper you only ship with eShipper's carriers. ShipTime lets you bring the pricing you've already negotiated and compare it on every label, then audits the carrier invoices for those rates — so billing errors get caught and recovered instead of quietly costing you.",
          mini: [
            { feature: "Bring your own courier rates", shiptime: true, competitor: false },
            { feature: "Discounted carrier rates", shiptime: true, competitor: true },
            { feature: "Audit on the invoices you bring", shiptime: true, competitor: false },
          ],
          chips: ["Your rates blended in", "Bill audited"],
          image: "vs-reason-1",
        },
        {
          tab: "Reason #2",
          title: "Support you can reach and rely on",
          body: "Both platforms show you carriers and services as you ship. The difference shows up when something goes wrong: ShipTime puts a knowledgeable Canadian team on the phone, email, or chat, and they take the carrier disputes and claims off your plate.",
          mini: [
            { feature: "Live phone, email & chat", shiptime: true, competitor: "basic" },
            { feature: "Carrier dispute support", shiptime: true, competitor: false },
            { feature: "Compare carriers & services", shiptime: true, competitor: true },
          ],
          chips: ["Canadian support", "We take the disputes"],
          image: "vs-reason-2",
        },
      ],
    },
  },
];

export function getCompetitor(slug: string): Competitor | undefined {
  return competitors.find((c) => c.slug === slug);
}
