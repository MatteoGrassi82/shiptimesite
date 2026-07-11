import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon, DocumentIcon, DocumentTextIcon } from "@sanity/icons";
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
