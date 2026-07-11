import { defineArrayMember, defineField, defineType } from "sanity";

// The one field that turns a single Sanity project into two independent sites.
export const siteField = defineField({
  name: "site",
  title: "Site",
  type: "string",
  options: {
    list: [
      { title: "Core (shiptime.com)", value: "core" },
      { title: "Plus (shiptime.com/plus)", value: "plus" },
    ],
    layout: "radio",
  },
  initialValue: "core",
  validation: (rule) => rule.required(),
});

export const seo = defineType({
  name: "seo",
  title: "SEO / AEO metadata",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "metaTitle", title: "Meta Title", type: "string", validation: (r) => r.max(70).warning("Keep under 70 chars") }),
    defineField({ name: "metaDescription", title: "Meta Description", type: "text", rows: 2, validation: (r) => r.max(160).warning("Keep under 160 chars") }),
    defineField({ name: "canonicalUrl", title: "Canonical URL", type: "url" }),
  ],
});

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "object",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "question" } },
});

export const ctaLink = defineType({
  name: "ctaLink",
  title: "Button",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "href", title: "URL or path", type: "string", description: "External URL or an internal path like /pricing" }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: { list: [
        { title: "Primary", value: "primary" },
        { title: "Secondary", value: "secondary" },
        { title: "Ghost", value: "ghost" },
      ], layout: "radio" },
      initialValue: "primary",
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const feature = defineType({
  name: "feature",
  title: "Feature",
  type: "object",
  fields: [
    defineField({ name: "icon", title: "Icon name", type: "string", description: "One of: truck, shield, zap, globe, box, clock, check, dollar, layers, route, search, refresh" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "title", subtitle: "icon" } },
});

export const stat = defineType({
  name: "stat",
  title: "Stat",
  type: "object",
  fields: [
    defineField({ name: "value", title: "Value", type: "string" }),
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});

export const quote = defineType({
  name: "quote",
  title: "Testimonial",
  type: "object",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({ name: "role", title: "Role / company", type: "string" }),
  ],
  preview: { select: { title: "author", subtitle: "role" } },
});

export const blockContent = defineType({
  name: "blockContent",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({ type: "block" }),
    defineArrayMember({ type: "image", options: { hotspot: true } }),
  ],
});
