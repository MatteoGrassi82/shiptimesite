import { blockContent, ctaLink, faqItem, feature, quote, seo, stat } from "./shared";
import {
  bookingEmbed,
  comparisonTable,
  ctaSection,
  faqSection,
  featureGrid,
  heroSection,
  logoMarquee,
  mediaSplit,
  metricStats,
  numberedSteps,
  richTextSection,
  testimonialSection,
} from "./sections";
import { caseStudy, page, post, resource, siteSettings, solutionPage } from "./documents";

// Full schema registry for the Studio. Mirrors the model deployed to the
// project via MCP — keep the two in sync (deploy schema changes with
// `npm run studio:deploy`, or the MCP deploy_schema tool).
export const schemaTypes = [
  // shared objects
  seo,
  faqItem,
  ctaLink,
  feature,
  stat,
  quote,
  blockContent,
  // section blocks
  heroSection,
  featureGrid,
  logoMarquee,
  faqSection,
  ctaSection,
  metricStats,
  testimonialSection,
  richTextSection,
  bookingEmbed,
  numberedSteps,
  comparisonTable,
  mediaSplit,
  // documents
  page,
  post,
  siteSettings,
  solutionPage,
  caseStudy,
  resource,
];
