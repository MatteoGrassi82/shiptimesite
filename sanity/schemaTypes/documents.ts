import { defineArrayMember, defineField, defineType } from "sanity";
// @sanity/icons v5 dropped the barrel export — each icon is its own subpath.
import { CaseIcon } from "@sanity/icons/Case";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentIcon } from "@sanity/icons/Document";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { DownloadIcon } from "@sanity/icons/Download";
import { UsersIcon } from "@sanity/icons/Users";
import { siteField } from "./shared";

const SECTION_TYPES = [
  "heroSection",
  "featureGrid",
  "logoMarquee",
  "metricStats",
  "testimonialSection",
  "faqSection",
  "ctaSection",
  "richTextSection",
  "bookingEmbed",
  "numberedSteps",
  "comparisonTable",
  "mediaSplit",
];

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    siteField,
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: SECTION_TYPES.map((t) => defineArrayMember({ type: t })),
    }),
    defineField({ name: "seo", title: "SEO / AEO metadata", type: "seo" }),
  ],
  preview: {
    select: { title: "title", site: "site" },
    prepare: ({ title, site }) => ({ title: title || "Untitled page", subtitle: site === "plus" ? "Plus page" : "Core page" }),
  },
});

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    siteField,
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "pillar", title: "Pillar / cluster topic", type: "string", description: "Which content pillar this post supports, e.g. ecommerce-shipping-canada" }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({ name: "mainImage", title: "Cover Image", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt text", type: "string" })] }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          marks: {
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  { name: "href", type: "url", title: "URL" },
                  { name: "internal", type: "boolean", title: "Internal link" },
                ],
              },
            ],
          },
        }),
        defineArrayMember({ type: "image", options: { hotspot: true } }),
      ],
    }),
    defineField({ name: "seo", title: "SEO / AEO metadata", type: "seo" }),
    defineField({ name: "faq", title: "FAQ", type: "array", of: [defineArrayMember({ type: "faqItem" })] }),
  ],
  preview: {
    select: { title: "title", site: "site", media: "mainImage" },
    prepare: ({ title, site, media }) => ({ title: title || "Untitled post", subtitle: site === "plus" ? "Plus" : "Core", media }),
  },
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    siteField,
    defineField({ name: "title", title: "Site title", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "nav", title: "Nav links", type: "array", of: [defineArrayMember({ type: "ctaLink" })] }),
    defineField({ name: "primaryCta", title: "Primary CTA", type: "ctaLink" }),
    defineField({ name: "footerNote", title: "Footer note", type: "text", rows: 2 }),
  ],
  preview: {
    select: { site: "site", title: "title" },
    prepare: ({ site, title }) => ({ title: title || (site === "plus" ? "Plus settings" : "Core settings"), subtitle: site === "plus" ? "Plus" : "Core" }),
  },
});

// ── Plus template: P-T1 Solution / persona page ──────────────────────
// Fixed shape (hero, pains, capabilities, proof, related content, CTA) rather
// than free-form sections — the doc's "solutions" template is a repeatable
// persona pattern, not a composed page.
export const solutionPage = defineType({
  name: "solutionPage",
  title: "Solution / Persona Page",
  type: "document",
  icon: UsersIcon,
  fields: [
    siteField,
    defineField({ name: "title", title: "Persona name", type: "string", description: "e.g. 'Scaling DTC & CPG brands'", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: "heroHeadline", title: "Hero headline", type: "string" }),
    defineField({ name: "heroSubline", title: "Hero subline", type: "text", rows: 2 }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "hidden",
      title: "Hold — hide from Solutions index/nav",
      type: "boolean",
      initialValue: false,
      description: "Use for personas on hold (e.g. freight forwarders pending the partner-conflict check). The page still exists at its URL but isn't linked anywhere.",
    }),
    defineField({
      name: "pains",
      title: "Your operation today (the pains)",
      type: "array",
      of: [defineArrayMember({ type: "feature" })],
    }),
    defineField({
      name: "capabilities",
      title: "The system we design (capabilities mapped to pains)",
      type: "array",
      of: [defineArrayMember({ type: "feature" })],
    }),
    defineField({ name: "proofStat", title: "Proof stat", type: "stat" }),
    defineField({
      name: "relatedCaseStudy",
      title: "Mini case study",
      type: "reference",
      to: [{ type: "caseStudy" }],
    }),
    defineField({
      name: "relatedResources",
      title: "Related resources",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "resource" }] })],
    }),
    defineField({ name: "cta", title: "CTA", type: "ctaLink" }),
    defineField({ name: "seo", title: "SEO / AEO metadata", type: "seo" }),
  ],
  preview: {
    select: { title: "title", site: "site", hidden: "hidden" },
    prepare: ({ title, site, hidden }) => ({
      title: title || "Untitled persona",
      subtitle: `${site === "plus" ? "Plus" : "Core"} · Solutions${hidden ? " · HELD" : ""}`,
    }),
  },
});

// ── Plus template: P-T2 Case study ───────────────────────────────────
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  icon: CaseIcon,
  fields: [
    siteField,
    defineField({ name: "title", title: "Title", type: "string", description: "Display name — anonymize until permission clears, e.g. 'A US consumer brand entering Canada'", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: "headerStat", title: "Header stat", type: "string", description: "The one number — $ saved / % faster / volume scaled" }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({ name: "operation", title: "The operation", type: "text", rows: 3, description: "Who they are, what they ship" }),
    defineField({ name: "problem", title: "The problem", type: "text", rows: 3, description: "What was fragmented / bleeding" }),
    defineField({ name: "system", title: "The system", type: "blockContent", description: "What we designed — phases, integrations, automations" }),
    defineField({ name: "results", title: "The results", type: "array", of: [defineArrayMember({ type: "stat" })] }),
    defineField({
      name: "anonymized",
      title: "Anonymized (pending customer permission)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "quote",
      title: "Pull quote",
      type: "quote",
      description: "Leave empty until a real, permissioned quote exists — never fabricate a customer quote.",
    }),
    defineField({ name: "seo", title: "SEO / AEO metadata", type: "seo" }),
  ],
  preview: {
    select: { title: "title", site: "site", stat: "headerStat" },
    prepare: ({ title, site, stat }) => ({ title: title || "Untitled case study", subtitle: `${site === "plus" ? "Plus" : "Core"}${stat ? ` · ${stat}` : ""}` }),
  },
});

// ── Plus template: P-T4 Resource (gated lead magnet) ─────────────────
export const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  icon: DownloadIcon,
  fields: [
    siteField,
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({
      name: "resourceType",
      title: "Type",
      type: "string",
      options: { list: [
        { title: "Guide", value: "guide" },
        { title: "Whitepaper", value: "whitepaper" },
        { title: "Webinar", value: "webinar" },
        { title: "Teardown", value: "teardown" },
      ] },
      initialValue: "guide",
    }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "learnBullets",
      title: "What you'll learn",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "gated", title: "Gated behind a form", type: "boolean", initialValue: true }),
    defineField({ name: "ctaLabel", title: "Form CTA label", type: "string", initialValue: "Get the guide" }),
    defineField({ name: "seo", title: "SEO / AEO metadata", type: "seo" }),
  ],
  preview: {
    select: { title: "title", site: "site", type: "resourceType" },
    prepare: ({ title, site, type }) => ({ title: title || "Untitled resource", subtitle: `${site === "plus" ? "Plus" : "Core"} · ${type || "guide"}` }),
  },
});
