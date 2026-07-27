// Minimal i18n shim ported from the Hana design system.
//
// The Hana repo ships a full ~1000-line translation table. ShipTime Plus is
// English-only for now, so this shim provides the same call surface the ported
// components expect — getLocale() and useTranslations() — without the weight.
// Section components that embed their own COPY_EN block only need getLocale();
// the shared shell copy (footer, CTA, hero) lives in the `translations` object
// below. When ShipTime Plus needs localization, swap this for a real table.

export type Locale = "en" | "it";

// Return type is the widened Locale (not the literal "en") so ported components
// that still branch on `getLocale() === "it"` type-check cleanly. ShipTime Plus
// is English-only for now, so the "it" branches are dead code, not errors.
export function getLocale(): Locale {
  return "en";
}

const translations = {
  cta: {
    heading: "Ready to ship at scale?",
    body: "Bring your carriers, your volume, and your team. ShipTime Plus handles the rest — one platform, every rate, zero busywork.",
    bookDemo: "Book a demo",
    savings: "See your savings",
    readDocs: "Read the docs",
  },
  footer: {
    tagline:
      "The premium logistics platform for teams that outgrew the basics. Built on ShipTime's carrier network.",
    platform: "Platform",
    resources: "Resources",
    company: "Company",
    legal: "Legal",
    integrations: "Integrations",
    sdk: "Developer SDK",
    documentation: "Documentation",
    blog: "Blog",
    labs: "Labs",
    stateOfVoiceAI: "State of Shipping",
    useCases: "Use cases",
    pricing: "Pricing",
    aboutUs: "About us",
    contact: "Contact",
    partnerships: "Partnerships",
    bookDemo: "Book a demo",
    privacyPolicy: "Privacy policy",
    termsOfService: "Terms of service",
    compliance: "Compliance",
    acceptableUsePolicy: "Acceptable use policy",
    allRightsReserved: "ShipTime Plus. All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    cookies: "Cookies",
    aup: "AUP",
    twitterLabel: "ShipTime Plus on X",
    githubLabel: "ShipTime Plus on GitHub",
    linkedinLabel: "ShipTime Plus on LinkedIn",
  },
  hero: {
    headline: "Logistics, elevated.",
    headlineCantMake: "for teams that outgrew the basics",
    subheadline:
      "Every carrier, every rate, one platform — with the automation, controls, and support a scaling operation actually needs.",
    talkToHana: "Get started free",
    bookDemo: "Book a demo",
    builtByClinicians: "Built on the ShipTime carrier network",
    connecting: "Connecting…",
    endDemo: "End demo",
  },
  recipesMarquee: {
    tag: "Workflows",
    heading: "Automations that run the busywork for you",
    body: "Rate shopping, label printing, tracking, and billing audits — wired together so shipments move without anyone babysitting them.",
  },
} as const;

export type Translations = typeof translations;

export function useTranslations(): Translations {
  return translations;
}
