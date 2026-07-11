import { defineArrayMember, defineField, defineType } from "sanity";
import {
  BlockContentIcon,
  ComponentIcon,
  HelpCircleIcon,
  ImagesIcon,
  RocketIcon,
  StarIcon,
  ThLargeIcon,
  TrendUpwardIcon,
  CalendarIcon,
} from "@sanity/icons";

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
