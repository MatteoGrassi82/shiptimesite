import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { LeadForm } from "@/components/sections/LeadForm";
import { Reveal } from "@/components/ui/reveal";
import { inner, K, KoherentShell, Label, More, PAGES, PageHead, Sect, mono, sans, title } from "@/components/sections/koherent-ui";

// /koherent/contact — "Talk to our team". The same form as /plus/book-a-call,
// so HubSpot gets the same properties (the volume options match the portal's),
// tagged koherent-contact, but it asks less: no freight-mode question (the
// lead already says we'll ask what you ship), and the warehouse question is
// optional. The form takes its colours from the CSS variables set on its
// wrapper; --line is darker than K.line so the field borders read at about
// 3.5:1. What happens next is the start of How we work, from the old
// engagement steps.

export const metadata: Metadata = {
  title: "Talk to our team",
  description: "30 minutes on your operation. We'll tell you honestly whether Koherent makes sense for you.",
};

const formTheme = {
  "--line": "#8A8293",
  "--card": K.card,
  "--page": K.paper,
  "--ink": K.ink,
  "--ink-2": K.stone,
  "--brand": K.plum,
  "--on-brand": K.paper,
  "--radius-card": "4px",
  "--radius-pill": "6px",
  "--font-body": "var(--font-schibsted), 'Schibsted Grotesk', system-ui, sans-serif",
  "--font-display": "var(--font-schibsted), 'Schibsted Grotesk', system-ui, sans-serif",
  "--display-weight": "700",
  "--display-tracking": "-0.02em",
} as CSSProperties;

const NEXT: { title: string; body: string }[] = [
  { title: "A 30-minute call", body: "What you ship, where it hurts and what you've tried. You'll know by the end whether this is worth pursuing, and so will we." },
  { title: "A look at your own data", body: "With your permission, one to two weeks with your orders, lanes and costs, and the people who run shipping day to day." },
  { title: "A proposal, not a quote", body: "Your operation modeled, a clear rate card and the savings worked out on your own numbers. If we can't show a return, we tell you." },
];

export default function KoherentContactPage() {
  const calendarUrl = process.env.NEXT_PUBLIC_PLUS_CALENDAR_URL;
  return (
    <KoherentShell>
      <PageHead
        label="Talk to our team"
        heading={<>30 minutes on your operation.</>}
        lead="No deck, no pressure. We'll ask what you ship and where it hurts, and tell you honestly whether Koherent makes sense for you, or whether ShipTime does."
      />
      <Sect bg={K.mist}>
        <div className="k-two" style={{ ...inner, paddingTop: "clamp(48px, 6vw, 80px)", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "clamp(28px, 4vw, 56px)", alignItems: "start" }}>
          <div className="k-form" style={formTheme}>
            <LeadForm
              source="koherent-contact"
              submitLabel="Request a call"
              successHeading="We've got it."
              successBody="Someone from our team will be in touch within one business day to find a time."
              fields={[
                { name: "firstname", label: "Name", type: "text", required: true },
                { name: "company", label: "Company", type: "text", required: true },
                { name: "email", label: "Work email", type: "email", required: true },
                { name: "monthly_volume", label: "Monthly shipment volume", type: "select", required: true, options: ["Under 500/mo", "500–2,000/mo", "2,000–10,000/mo", "10,000+/mo"] },
                { name: "uses_warehouse", label: "Do you use a warehouse or 3PL today?", type: "select", required: false, options: ["Yes", "No", "Our own"] },
                { name: "notes", label: "Anything specific you want to solve?", type: "textarea", placeholder: "Optional" },
              ]}
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <Label>What happens next</Label>
            <ol style={{ listStyle: "none", padding: 0, margin: "18px 0 0", display: "grid", gap: 22 }}>
              {NEXT.map((n, i) => (
                <li key={n.title} style={{ borderTop: `1px solid ${K.line}`, paddingTop: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ ...mono, fontSize: 13, color: K.violet }}>{String(i + 1).padStart(2, "0")}</span>
                    <h2 style={{ ...title, fontSize: "1.3rem", color: K.ink, margin: 0 }}>{n.title}</h2>
                  </div>
                  <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.6, color: K.stone, margin: "8px 0 0" }}>{n.body}</p>
                </li>
              ))}
            </ol>
            <div style={{ marginTop: 30, display: "grid", gap: 14 }}>
              {calendarUrl && (
                <a href={calendarUrl} target="_blank" rel="noopener" className="k-more" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 7, fontSize: 15, fontWeight: 700, color: K.plum, textDecoration: "none" }}>
                  Or pick a time on our calendar <ArrowRight size={15} />
                </a>
              )}
              <More href={PAGES.how}>How an engagement runs</More>
            </div>
          </div>
        </div>
      </Sect>
      <Sect>
        <Reveal style={{ ...inner, paddingTop: "clamp(48px, 6vw, 72px)", paddingBottom: "clamp(48px, 6vw, 72px)", textAlign: "center" }}>
          <p style={{ ...title, fontSize: "clamp(1.2rem, 1.8vw, 1.45rem)", color: K.ink, margin: "0 auto", maxWidth: "36ch" }}>
            Not ready to talk? Start with your Logistics Performance Score.
          </p>
          <div style={{ marginTop: 16 }}>
            <More href={PAGES.score}>Get your score</More>
          </div>
        </Reveal>
      </Sect>
      <style>{`.k-form .st-cta:hover { opacity: .92; }`}</style>
    </KoherentShell>
  );
}
