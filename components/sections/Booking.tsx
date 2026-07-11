import { Container, Heading } from "./primitives";
import type { BookingBlock } from "./types";

// Book-a-call block. Embeds the calendar iframe and shows who the conversation
// routes to (e.g. Peter). Falls back to a helpful placeholder if no URL is set.
export function Booking({ heading, body, calendarUrl, contactName }: BookingBlock) {
  return (
    <section style={{ background: "var(--surface)", color: "var(--ink)", padding: "clamp(56px, 8vw, 112px) 0" }}>
      <Container>
        <div style={{ display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", alignItems: "start" }}>
          <div>
            {heading && <Heading>{heading}</Heading>}
            {body && (
              <p className="st-body" style={{ fontSize: 16.5, lineHeight: 1.65, color: "var(--ink-2)", margin: "18px 0 0", maxWidth: "42ch" }}>
                {body}
              </p>
            )}
            {contactName && (
              <p className="st-body" style={{ marginTop: 20, fontSize: 13.5, color: "var(--ink-3)" }}>
                Routed to {contactName}.
              </p>
            )}
          </div>
          <div style={{ borderRadius: "var(--radius-section)", overflow: "hidden", border: "1px solid var(--line)", background: "var(--card)" }}>
            {calendarUrl ? (
              <iframe
                src={calendarUrl}
                title={heading || "Book a call"}
                style={{ width: "100%", height: 640, border: "none", display: "block" }}
                loading="lazy"
              />
            ) : (
              <div style={{ padding: 40, minHeight: 300, display: "flex", alignItems: "center" }}>
                <p className="st-body" style={{ color: "var(--ink-2)", margin: 0, lineHeight: 1.6 }}>
                  Add a calendar URL in Sanity to embed the live booking widget here.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
