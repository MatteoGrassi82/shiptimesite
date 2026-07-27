import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "@/components/sections/site-chrome";
import { LeadForm } from "@/components/sections/LeadForm";
import { PageHero } from "@/components/sections/plus-page-hero";
import type { SiteSettings } from "@/components/sections/types";

// C7 — the landing target for every Plus outbound sequence. Coded (not
// Sanity-driven) per the master doc's "5 coded pages" list.

export const metadata: Metadata = {
  title: "Book a call — ShipTime Plus",
  description: "30 minutes. Your operation. A first read on the savings.",
};

export default async function BookACallPage() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: "plus" }, tags: ["siteSettings"] });
  const calendarUrl = process.env.NEXT_PUBLIC_PLUS_CALENDAR_URL;

  return (
    <>
      <ZoneNav zone="plus" settings={settings} />
      <main>
        <PageHero
          eyebrow="Book a call"
          heading={<>30 minutes. Your operation. <span className="italic">A first read on the savings.</span></>}
          lead="No deck, no pressure. We'll ask what you ship, where it hurts, and what you've already tried — and tell you honestly whether a designed system makes sense for you."
        />

        <section className="bg-[#F8FAFB] py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid items-start gap-8 md:grid-cols-2">
              <LeadForm
                source="book-a-call"
                submitLabel="Request a call"
                successHeading="We've got it."
                successBody="We'll follow up within one business day to find a time — or grab a slot on the calendar now."
                fields={[
                  { name: "firstname", label: "Name", type: "text", required: true },
                  { name: "company", label: "Company", type: "text", required: true },
                  { name: "email", label: "Work email", type: "email", required: true },
                  { name: "ships_mostly", label: "What do you ship mostly?", type: "select", required: true, options: ["Parcel", "LTL", "FTL", "Ocean", "Mixed"] },
                  { name: "monthly_volume", label: "Monthly shipment volume", type: "select", required: true, options: ["Under 500/mo", "500–2,000/mo", "2,000–10,000/mo", "10,000+/mo"] },
                  { name: "uses_warehouse", label: "Do you use a warehouse or 3PL today?", type: "select", required: true, options: ["Yes", "No", "Our own"] },
                  { name: "notes", label: "Anything specific you want to solve?", type: "textarea", placeholder: "Optional" },
                ]}
              />
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                {calendarUrl ? (
                  <iframe src={calendarUrl} title="Book a call" style={{ width: "100%", height: 640, border: "none", display: "block" }} loading="lazy" />
                ) : (
                  <div style={{ padding: 40, minHeight: 320, display: "flex", alignItems: "center" }}>
                    <p className="st-body" style={{ color: "var(--ink-2)", margin: 0, lineHeight: 1.7 }}>
                      Submit the form and we&rsquo;ll follow up within one business day to find a time that works — the
                      live calendar embed goes here once scheduling is wired up.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <p className="mt-7 text-sm text-slate-500">
              Prefer email first? Reach out through the contact page — a human reads it.
            </p>
          </div>
        </section>
      </main>
      <ZoneFooter zone="plus" settings={settings} />
    </>
  );
}
