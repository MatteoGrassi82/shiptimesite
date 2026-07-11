import { blockContent, ctaLink, faqItem, feature, quote, seo, stat } from "./shared";
import {
  bookingEmbed,
  ctaSection,
  faqSection,
  featureGrid,
  heroSection,
  logoMarquee,
  metricStats,
  richTextSection,
  testimonialSection,
} from "./sections";
import { page, post, siteSettings } from "./documents";

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
  // documents
  page,
  post,
  siteSettings,
];
