// ── ShipTime Logistics Performance Framework™ ────────────────────────────────
// Michael's framework doc, "ShipTime Logistics Performance Framework and
// Assessment (with questionnaire).docx" (emailed 2026-08-18), transcribed
// verbatim. Positioned as a 5-minute executive diagnostic, not a logistics
// audit.
//
// Scoring: every question is answered on a 1–5 maturity scale. A question's
// `points` IS its share of the 100-point total, so answering 5/5 earns the
// full points and 1/5 earns points/5. The three pillars' points sum to their
// stated weights — Costs 42, Operational Excellence 34, Customer Experience 24
// — which is asserted at module load so a future edit can't silently break the
// weighting.
//
// Vocabulary (Michael's, trademarked in the doc):
//   LPS™ Logistics Performance Score — the weighted total out of 100
//   CPS™ / OES™ / CES™ — the per-pillar scores
//   LPI™ — the aggregate benchmark across all completed assessments
//
// The 17th question is the lead-qualification question. It is deliberately NOT
// scored: it exists to tell sales what the conversation should be about.

export type PillarKey = "cost" | "ops" | "cx";

export type Pillar = {
  key: PillarKey;
  name: string;
  scoreName: string;
  abbr: string;
  weight: number;
  blurb: string;
};

export const PILLARS: Pillar[] = [
  {
    key: "cost",
    name: "Logistics Costs",
    scoreName: "Cost Performance Score",
    abbr: "CPS",
    weight: 42,
    blurb: "What you pay to move every order — and how deliberately that gets decided.",
  },
  {
    key: "ops",
    name: "Operational Excellence",
    scoreName: "Operational Excellence Score",
    abbr: "OES",
    weight: 34,
    blurb: "How much of the operation runs itself, and how fast you catch what breaks.",
  },
  {
    key: "cx",
    name: "Customer Experience",
    scoreName: "Customer Experience Score",
    abbr: "CES",
    weight: 24,
    blurb: "What the customer feels after they buy — tracking, delivery, returns.",
  },
];

export type Question = {
  id: number;
  pillar: PillarKey;
  title: string;
  prompt: string;
  points: number;
  /** Five maturity levels, ascending. Index 0 = level 1. */
  levels: [string, string, string, string, string];
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    pillar: "cost",
    title: "Carrier Optimization",
    prompt: "Which statement best describes how shipping carriers are selected?",
    points: 10,
    levels: [
      "One preferred carrier for most shipments.",
      "Manual comparison for some shipments.",
      "Multiple carriers compared for most shipments.",
      "System automatically selects the best carrier/service.",
      "Dynamic optimization using business rules, cost, transit time and historical performance.",
    ],
  },
  {
    id: 2,
    pillar: "cost",
    title: "Warehouse & Inventory Strategy",
    prompt: "Which statement best describes how inventory is positioned?",
    points: 8,
    levels: [
      "Single shipping location.",
      "Multiple locations but static inventory.",
      "Inventory positioned in major regions.",
      "Inventory placement reviewed periodically using demand data.",
      "Inventory continuously optimized using forecasting and analytics.",
    ],
  },
  {
    id: 3,
    pillar: "cost",
    title: "Logistics Cost Visibility",
    prompt: "Which statement best describes your logistics reporting?",
    points: 5,
    levels: [
      "Limited visibility.",
      "Monthly reports.",
      "Regular KPI reporting.",
      "Interactive dashboards.",
      "Real-time analytics with forecasting.",
    ],
  },
  {
    id: 4,
    pillar: "cost",
    title: "Carrier Pricing Strategy",
    prompt: "How are carrier agreements managed?",
    points: 3,
    levels: [
      "Rarely reviewed.",
      "Every few years.",
      "Annually.",
      "Regularly using shipment data.",
      "Continuously optimized using analytics and market intelligence.",
    ],
  },
  {
    id: 5,
    pillar: "cost",
    title: "Regional Carrier Utilization",
    prompt: "Which statement best describes your use of regional and alternative last-mile carriers?",
    points: 10,
    levels: [
      "We ship almost exclusively with UPS, FedEx or USPS.",
      "We occasionally use a regional carrier when requested.",
      "We regularly use regional carriers in selected markets.",
      "We actively optimize shipments between national and regional carriers based on destination, cost and service.",
      "We continuously optimize shipments across national, regional and specialized last-mile providers using data and business rules.",
    ],
  },
  {
    id: 6,
    pillar: "cost",
    title: "Packaging Optimization",
    prompt: "Which statement best describes how your organization optimizes packaging for customer orders?",
    points: 6,
    levels: [
      "We use a limited selection of standard packaging and box sizes for most orders, with little consideration for product fit, dimensional weight or shipping costs.",
      "Packaging materials and box sizes are selected manually based primarily on staff experience, with limited guidelines for matching packaging to the products being shipped.",
      "We have established packaging standards that generally match products to appropriate packaging materials and box sizes, helping to balance product protection and shipping costs.",
      "We regularly review and optimize both our packaging methods and box size selection to reduce shipping costs, minimize dimensional weight, improve product protection and reduce material waste.",
      "Packaging is continuously optimized using data, with packaging materials and box sizes dynamically selected to provide the best balance of product protection, shipping cost, dimensional efficiency, sustainability and customer experience.",
    ],
  },
  {
    id: 7,
    pillar: "ops",
    title: "Process Automation",
    prompt: "Which best describes your fulfillment workflow?",
    points: 10,
    levels: [
      "Mostly manual.",
      "Some automation.",
      "Most routine processes automated.",
      "Highly automated.",
      "End-to-end intelligent automation.",
    ],
  },
  {
    id: 8,
    pillar: "ops",
    title: "Systems Integration",
    prompt: "How are your systems connected?",
    points: 8,
    levels: [
      "Separate systems with manual work.",
      "Limited integrations.",
      "Most systems integrated.",
      "Fully integrated workflows.",
      "Real-time synchronization across commerce, ERP/WMS and shipping.",
    ],
  },
  {
    id: 9,
    pillar: "ops",
    title: "Operational Performance",
    prompt: "How are fulfillment service levels managed?",
    points: 7,
    levels: [
      "Frequently miss targets.",
      "Inconsistent.",
      "Usually meet targets.",
      "Consistently meet targets.",
      "Continuously monitored and consistently exceed targets.",
    ],
  },
  {
    id: 10,
    pillar: "ops",
    title: "Exception Management",
    prompt: "How are shipment issues handled?",
    points: 5,
    levels: [
      "Customers identify problems first.",
      "Reactive.",
      "Daily monitoring.",
      "Most issues identified before customers notice.",
      "Predictive alerts prevent most service failures.",
    ],
  },
  {
    id: 11,
    pillar: "ops",
    title: "Data & Continuous Improvement",
    prompt: "How does your organization use logistics data to continuously improve operations?",
    points: 4,
    levels: [
      "We rarely review logistics data.",
      "We review reports occasionally.",
      "KPIs are reviewed regularly by management.",
      "Data drives operational decisions and improvement initiatives.",
      "Continuous improvement is embedded into the business through dashboards, analytics and AI-driven recommendations.",
    ],
  },
  {
    id: 12,
    pillar: "cx",
    title: "Delivery Experience",
    prompt: "Which best describes the post-purchase experience?",
    points: 8,
    levels: [
      "Shipment confirmation only.",
      "Tracking provided.",
      "Tracking plus notifications.",
      "Branded tracking and proactive updates.",
      "Fully integrated experience with delivery choices, branded tracking and proactive communication.",
    ],
  },
  {
    id: 13,
    pillar: "cx",
    title: "Delivery Performance",
    prompt: "How is delivery performance measured?",
    points: 4,
    levels: [
      "Inconsistent with limited measurement.",
      "Often delayed.",
      "Generally meets expectations.",
      "Consistently reliable.",
      "Competitive advantage measured through customer satisfaction and delivery KPIs.",
    ],
  },
  {
    id: 14,
    pillar: "cx",
    title: "Returns Experience",
    prompt: "Which best describes your returns process?",
    points: 6,
    levels: [
      "Manual and difficult.",
      "Functional but inconvenient.",
      "Straightforward.",
      "Mostly automated.",
      "Seamless and loyalty-enhancing.",
    ],
  },
  {
    id: 15,
    pillar: "cx",
    title: "Customer Feedback",
    prompt: "How is logistics-related customer feedback used?",
    points: 3,
    levels: [
      "Not measured.",
      "Complaint driven.",
      "Periodic review.",
      "Ongoing KPI monitoring.",
      "Continuously drives operational improvements.",
    ],
  },
  {
    id: 16,
    pillar: "cx",
    title: "Delivery Choice & Flexibility",
    prompt: "How much delivery flexibility do your customers have at checkout or after placing an order?",
    points: 3,
    levels: [
      "Customers receive only one shipping option.",
      "Limited shipping options are available.",
      "Customers can choose from several delivery services.",
      "Customers can choose delivery speed, location and service level.",
      "Delivery choices are dynamically optimized to balance customer preference, cost and operational efficiency.",
    ],
  },
];

/** The lead-qualification question. Not scored — it sets the sales agenda. */
export const PRIORITY_QUESTION =
  "Which area of your logistics operation would you most like to improve or implement over the next 12 months?";

export const PRIORITY_OPTIONS = [
  "Shipping costs",
  "Delivery performance",
  "Customer experience",
  "Warehouse & fulfillment",
  "Multi-warehouse strategy",
  "International shipping",
  "Technology & automation",
  "Returns management",
  "Inventory optimization",
  "Carrier diversification",
  "Other",
];

// A silent drift in the weighting would corrupt every score and every future
// LPI benchmark, so it fails loudly at import instead.
for (const p of PILLARS) {
  const sum = QUESTIONS.filter((q) => q.pillar === p.key).reduce((n, q) => n + q.points, 0);
  if (sum !== p.weight) {
    throw new Error(`LPS weighting drift: ${p.name} questions total ${sum}, expected ${p.weight}`);
  }
}

export type Answers = Record<number, number>; // question id → 1..5

export type PillarResult = {
  key: PillarKey;
  name: string;
  scoreName: string;
  abbr: string;
  /** 0–100 within this pillar. */
  score: number;
  earned: number;
  weight: number;
};

export type LpsResult = {
  /** LPS™ — weighted total, 0–100. */
  total: number;
  band: string;
  bandBlurb: string;
  pillars: PillarResult[];
  strongest: PillarResult;
  weakest: PillarResult;
  /** Lowest-scoring questions, biggest weighted gap first. */
  gaps: { question: Question; level: number; lost: number }[];
  answered: number;
};

export function bandFor(total: number): { band: string; blurb: string } {
  if (total >= 80) return { band: "Optimized", blurb: "Your logistics is a competitive advantage. The remaining gains are in continuous tuning." };
  if (total >= 60) return { band: "Advancing", blurb: "Strong foundations with clear, addressable gaps. Most of the value left is in a few specific areas." };
  if (total >= 40) return { band: "Developing", blurb: "The operation works, but it's carrying cost and risk that a designed system would remove." };
  if (total >= 20) return { band: "Reactive", blurb: "Logistics is being run day to day rather than designed. There is significant cost and service upside here." };
  return { band: "Foundational", blurb: "Most decisions are still manual. Nearly every dimension is an opportunity." };
}

/** Pure scoring. Same maths on the client (instant feedback) and server (source of truth). */
export function scoreAssessment(answers: Answers): LpsResult {
  const pillars: PillarResult[] = PILLARS.map((p) => {
    const qs = QUESTIONS.filter((q) => q.pillar === p.key);
    const earned = qs.reduce((n, q) => n + ((answers[q.id] ?? 0) / 5) * q.points, 0);
    return {
      key: p.key,
      name: p.name,
      scoreName: p.scoreName,
      abbr: p.abbr,
      earned: Math.round(earned * 10) / 10,
      weight: p.weight,
      score: Math.round((earned / p.weight) * 100),
    };
  });

  const total = Math.round(pillars.reduce((n, p) => n + p.earned, 0));
  const { band, blurb } = bandFor(total);

  const ranked = [...pillars].sort((a, b) => b.score - a.score);
  const gaps = QUESTIONS.map((q) => {
    const level = answers[q.id] ?? 0;
    return { question: q, level, lost: Math.round((1 - level / 5) * q.points * 10) / 10 };
  })
    .filter((g) => g.level > 0 && g.lost > 0)
    .sort((a, b) => b.lost - a.lost);

  return {
    total,
    band,
    bandBlurb: blurb,
    pillars,
    strongest: ranked[0],
    weakest: ranked[ranked.length - 1],
    gaps,
    answered: QUESTIONS.filter((q) => answers[q.id]).length,
  };
}
