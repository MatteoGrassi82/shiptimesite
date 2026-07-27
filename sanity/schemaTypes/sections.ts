import { defineArrayMember, defineField, defineType } from "sanity";
// @sanity/icons v5 dropped the barrel export — each icon is its own subpath.
import { BlockContentIcon } from "@sanity/icons/BlockContent";
import { CalendarIcon } from "@sanity/icons/Calendar";
import { ComponentIcon } from "@sanity/icons/Component";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { ImagesIcon } from "@sanity/icons/Images";
import { OlistIcon } from "@sanity/icons/Olist";
import { RocketIcon } from "@sanity/icons/Rocket";
import { StarIcon } from "@sanity/icons/Star";
import { ThLargeIcon } from "@sanity/icons/ThLarge";
import { ThListIcon } from "@sanity/icons/ThList";
import { TrendUpwardIcon } from "@sanity/icons/TrendUpward";

// Page-builder section blocks. Names describe WHAT the content is, not what it
// looks like — the look comes from the zone tokens on the frontend.

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  icon: RocketIcon,
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subheading", title: "Subheading", type: "text", rows: 3 }),
    defineField({ name: "primaryCta", title: "Primary button", type: "ctaLink" }),
    defineField({ name: "secondaryCta", title: "Secondary button", type: "ctaLink" }),
    defineField({ name: "media", title: "Media", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt text", type: "string" })] }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Hero", subtitle: "Hero" }) },
});

export const featureGrid = defineType({
  name: "featureGrid",
  title: "Feature grid",
  type: "object",
  icon: ThLargeIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({ name: "columns", title: "Columns", type: "string", options: { list: [
      { title: "Two", value: "2" }, { title: "Three", value: "3" }, { title: "Four", value: "4" },
    ], layout: "radio" }, initialValue: "3" }),
    defineField({ name: "features", title: "Features", type: "array", of: [defineArrayMember({ type: "feature" })] }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Feature grid", subtitle: "Feature grid" }) },
});

export const logoMarquee = defineType({
  name: "logoMarquee",
  title: "Logo marquee",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "logos", title: "Logos", type: "array", of: [defineArrayMember({ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt text", type: "string" })] })] }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Logo marquee", subtitle: "Logo marquee" }) },
});

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ",
  type: "object",
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({ name: "items", title: "Questions", type: "array", of: [defineArrayMember({ type: "faqItem" })] }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "FAQ", subtitle: "FAQ" }) },
});

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Call to action",
  type: "object",
  icon: ComponentIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
    defineField({ name: "primaryCta", title: "Primary button", type: "ctaLink" }),
    defineField({ name: "secondaryCta", title: "Secondary button", type: "ctaLink" }),
    defineField({ name: "tone", title: "Tone", type: "string", options: { list: [
      { title: "Contrast (dark)", value: "contrast" }, { title: "Brand", value: "brand" }, { title: "Surface", value: "surface" },
    ], layout: "radio" }, initialValue: "contrast" }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Call to action", subtitle: "CTA" }) },
});

export const metricStats = defineType({
  name: "metricStats",
  title: "Metric stats",
  type: "object",
  icon: TrendUpwardIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "stats", title: "Stats", type: "array", of: [defineArrayMember({ type: "stat" })] }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Metric stats", subtitle: "Stats" }) },
});

export const testimonialSection = defineType({
  name: "testimonialSection",
  title: "Testimonials",
  type: "object",
  icon: StarIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "quotes", title: "Quotes", type: "array", of: [defineArrayMember({ type: "quote" })] }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Testimonials", subtitle: "Testimonials" }) },
});

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Rich text",
  type: "object",
  icon: BlockContentIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "content", title: "Content", type: "blockContent" }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Rich text", subtitle: "Rich text" }) },
});

export const bookingEmbed = defineType({
  name: "bookingEmbed",
  title: "Booking embed",
  type: "object",
  icon: CalendarIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
    defineField({ name: "calendarUrl", title: "Calendar URL", type: "url" }),
    defineField({ name: "contactName", title: "Routes to", type: "string" }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Booking embed", subtitle: "Booking" }) },
});

export const mediaSplit = defineType({
  name: "mediaSplit",
  title: "Media + text split",
  type: "object",
  icon: ImagesIcon,
  description: "A real photo/illustration alongside a block of copy — for narrative sections that shouldn't be icon-only.",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "body", title: "Body", type: "text", rows: 4 }),
    defineField({
      name: "bullets",
      title: "Bullet list (optional)",
      description: "The Relume 'Layout 18/21' variant — a short list under the body instead of (or in addition to) prose.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "imageSide",
      title: "Image side",
      type: "string",
      options: { list: [{ title: "Right", value: "right" }, { title: "Left", value: "left" }], layout: "radio" },
      initialValue: "right",
    }),
    defineField({
      name: "tone",
      title: "Background",
      type: "string",
      options: { list: [{ title: "Page", value: "page" }, { title: "Surface", value: "surface" }], layout: "radio" },
      initialValue: "page",
    }),
    defineField({ name: "cta", title: "Primary button", type: "ctaLink" }),
    defineField({ name: "secondaryCta", title: "Secondary button", description: "The classic pattern pairs a solid primary button with a plain-text link — set style to Ghost.", type: "ctaLink" }),
  ],
  preview: { select: { title: "heading", media: "image" }, prepare: ({ title, media }) => ({ title: title || "Media + text split", subtitle: "Media split", media }) },
});

export const numberedSteps = defineType({
  name: "numberedSteps",
  title: "Numbered steps",
  type: "object",
  icon: OlistIcon,
  description: "A phased walkthrough or engagement model — e.g. 'three phases', 'how an engagement works'.",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [
            defineField({ name: "label", title: "Step label", type: "string", description: "e.g. 'Phase 1 — Unify' or 'Discovery call'" }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "label" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Numbered steps", subtitle: "Steps" }) },
});

export const comparisonTable = defineType({
  name: "comparisonTable",
  title: "Comparison table",
  type: "object",
  icon: ThListIcon,
  description: "A row-per-aspect table comparing several approaches side by side (e.g. Plus vs 3PL vs TMS vs broker).",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "approaches",
      title: "Approaches (column headers)",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "row",
          fields: [
            defineField({ name: "aspect", title: "Aspect", type: "string", description: "Row label, e.g. 'What it is' or 'Great when'" }),
            defineField({
              name: "values",
              title: "Values (one per approach, in order)",
              type: "array",
              of: [defineArrayMember({ type: "text", rows: 2 })],
            }),
          ],
          preview: { select: { title: "aspect" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Comparison table", subtitle: "Table" }) },
});
