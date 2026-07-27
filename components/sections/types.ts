// Shared TypeScript shapes for the page-builder blocks. Kept hand-written and
// loose (optional fields) so the renderer degrades gracefully when an editor
// leaves a field empty. These mirror the Sanity schema in sanity/schemaTypes.

export type Zone = "core" | "plus";

export type SanityImage = {
  asset?: {
    _id?: string;
    url?: string;
    metadata?: { lqip?: string; dimensions?: { width?: number; height?: number } };
  };
  alt?: string;
};

export type Cta = {
  label?: string;
  href?: string;
  style?: "primary" | "secondary" | "ghost";
};

export type HeroBlock = {
  _type: "heroSection";
  _key: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  media?: SanityImage;
};

export type FeatureGridBlock = {
  _type: "featureGrid";
  _key: string;
  heading?: string;
  intro?: string;
  columns?: "2" | "3" | "4";
  features?: { _key?: string; icon?: string; title?: string; body?: string }[];
};

export type LogoMarqueeBlock = {
  _type: "logoMarquee";
  _key: string;
  heading?: string;
  logos?: SanityImage[];
};

export type FaqBlock = {
  _type: "faqSection";
  _key: string;
  heading?: string;
  intro?: string;
  items?: { _key?: string; question?: string; answer?: string }[];
};

export type CtaBlock = {
  _type: "ctaSection";
  _key: string;
  heading?: string;
  body?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  tone?: "contrast" | "brand" | "surface";
};

export type MetricStatsBlock = {
  _type: "metricStats";
  _key: string;
  heading?: string;
  stats?: { _key?: string; value?: string; label?: string; caption?: string }[];
};

export type TestimonialsBlock = {
  _type: "testimonialSection";
  _key: string;
  heading?: string;
  quotes?: { _key?: string; quote?: string; author?: string; role?: string }[];
};

export type RichTextBlock = {
  _type: "richTextSection";
  _key: string;
  heading?: string;
  content?: unknown[];
};

export type BookingBlock = {
  _type: "bookingEmbed";
  _key: string;
  heading?: string;
  body?: string;
  calendarUrl?: string;
  contactName?: string;
};

export type NumberedStepsBlock = {
  _type: "numberedSteps";
  _key: string;
  heading?: string;
  intro?: string;
  steps?: { _key?: string; label?: string; body?: string }[];
};

export type ComparisonTableBlock = {
  _type: "comparisonTable";
  _key: string;
  heading?: string;
  intro?: string;
  approaches?: string[];
  rows?: { _key?: string; aspect?: string; values?: string[] }[];
};

export type MediaSplitBlock = {
  _type: "mediaSplit";
  _key: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  bullets?: string[];
  image?: SanityImage;
  imageSide?: "left" | "right";
  tone?: "page" | "surface";
  cta?: Cta;
  secondaryCta?: Cta;
};

export type Block =
  | HeroBlock
  | FeatureGridBlock
  | LogoMarqueeBlock
  | FaqBlock
  | CtaBlock
  | MetricStatsBlock
  | TestimonialsBlock
  | RichTextBlock
  | BookingBlock
  | NumberedStepsBlock
  | ComparisonTableBlock
  | MediaSplitBlock;

// ── P-T1/P-T2/P-T4 document shapes (used outside the generic PageBuilder) ──

export type FeatureItem = { _key?: string; icon?: string; title?: string; body?: string };
export type StatItem = { _key?: string; value?: string; label?: string; caption?: string };

export type SolutionPage = {
  _id: string;
  title?: string;
  slug?: string;
  heroHeadline?: string;
  heroSubline?: string;
  heroImage?: SanityImage;
  hidden?: boolean;
  pains?: FeatureItem[];
  capabilities?: FeatureItem[];
  proofStat?: StatItem;
  relatedCaseStudy?: CaseStudyCard | null;
  relatedResources?: ResourceCard[];
  cta?: Cta;
  seo?: { metaTitle?: string; metaDescription?: string; canonicalUrl?: string };
};

export type CaseStudyCard = {
  _id: string;
  title?: string;
  slug?: string;
  headerStat?: string;
  coverImage?: SanityImage;
  operation?: string;
};

export type CaseStudyDoc = CaseStudyCard & {
  problem?: string;
  system?: unknown[];
  results?: StatItem[];
  anonymized?: boolean;
  quote?: { quote?: string; author?: string; role?: string };
  seo?: { metaTitle?: string; metaDescription?: string; canonicalUrl?: string };
};

export type ResourceCard = {
  _id: string;
  title?: string;
  slug?: string;
  resourceType?: "guide" | "whitepaper" | "webinar" | "teardown";
  summary?: string;
  coverImage?: SanityImage;
};

export type ResourceDoc = ResourceCard & {
  learnBullets?: string[];
  gated?: boolean;
  ctaLabel?: string;
  seo?: { metaTitle?: string; metaDescription?: string; canonicalUrl?: string };
};

export type SiteSettings = {
  title?: string;
  tagline?: string;
  nav?: Cta[];
  primaryCta?: Cta;
  footerNote?: string;
};
