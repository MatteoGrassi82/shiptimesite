import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ASKS, FROM_JENNY, NOTES } from "@/components/sections/koherent-copy";
import type { ReviewNote } from "@/components/sections/koherent-copy";
import { box, K, KoherentShell, Label, PAGES, REVIEW, Sect, display, mono, sans, title } from "@/components/sections/koherent-ui";

// /koherent/review — the checklist for revision 2, kept off the pages
// themselves: what was taken from Jenny's draft and what was left for later,
// the decisions, her "Confirm…" notes that still apply (by who confirms), and
// where each of Michael's and Chris's asks lives now. Only while REVIEW is on
// (koherent-brand.tsx); not in any menu.

export const metadata: Metadata = { title: "Review: revision 2", robots: "noindex" };

const h2 = { ...title, fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)", color: K.ink, margin: "clamp(44px, 5vw, 64px) 0 0" };
const li = { ...sans, fontSize: 15.5, lineHeight: 1.55, color: K.ink };

function Item({ n }: { n: ReviewNote }) {
  const decide = n.kind === "decide";
  return (
    <li style={{ ...box, listStyle: "none", padding: "16px 18px", display: "grid", gap: 6 }}>
      <span style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: decide ? K.plum : "#5C4300" }}>
        {decide ? "To decide" : "To confirm"} · {n.who}
      </span>
      <span style={li}>{n.text}</span>
      <Link href={n.href} style={{ ...sans, fontSize: 14, color: K.violet, textDecoration: "underline", textUnderlineOffset: 3 }}>
        {n.page}
      </Link>
    </li>
  );
}

export default function KoherentReviewPage() {
  if (!REVIEW) notFound();
  const decide = NOTES.filter((n) => n.kind === "decide");
  const confirm = NOTES.filter((n) => n.kind !== "decide");
  const owners = [...new Set(confirm.map((n) => n.who))];
  const pages: [string, string][] = [
    ["Home", PAGES.home],
    ["Growing brands", PAGES.growing],
    ["Enterprise brands", PAGES.enterprise],
    ["3PL and fulfillment partners", PAGES.partners],
    ["How it works", PAGES.works],
    ["Pricing", PAGES.pricing],
    ["Customer stories", PAGES.cases],
    ["Logistics Performance Score", PAGES.score],
    ["Contact", PAGES.contact],
  ];
  return (
    <KoherentShell>
      <Sect>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "clamp(40px, 5vw, 72px) clamp(20px, 4vw, 56px) clamp(56px, 7vw, 96px)" }}>
          <Label>Revision 2 · for review</Label>
          <h1 style={{ ...display, fontSize: "clamp(2.4rem, 4.6vw, 3.6rem)", color: K.plum, margin: "18px 0 0" }}>Our story, Jenny’s structure.</h1>
          <p style={{ ...sans, fontSize: "clamp(1.05rem, 1.35vw, 1.18rem)", lineHeight: 1.65, color: K.stone, margin: "20px 0 0", maxWidth: "64ch" }}>
            The site keeps the story Michael and Chris shaped and takes its structure and best lines from Jenny’s navigation and copy drafts (Oct 29). Her notes and the open decisions are here rather than on the pages. Who confirms is her name where she gave one, otherwise a suggestion by role.
          </p>

          <div className="k-rv2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 36 }}>
            {[
              ["From Jenny’s draft", FROM_JENNY.kept],
              ["Left for later", FROM_JENNY.later],
            ].map(([t, items]) => (
              <div key={t as string} style={{ ...box, padding: "22px 22px 20px" }}>
                <p style={{ ...mono, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: K.violet, margin: 0 }}>{t as string}</p>
                <ul style={{ margin: "12px 0 0", paddingLeft: 18, display: "grid", gap: 8 }}>
                  {(items as string[]).map((s) => (
                    <li key={s} style={{ ...li, fontSize: 15 }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2 style={h2}>To decide ({decide.length})</h2>
          <ul style={{ padding: 0, margin: "18px 0 0", display: "grid", gap: 10 }}>
            {decide.map((n) => (
              <Item key={n.text} n={n} />
            ))}
          </ul>

          <h2 style={h2}>To confirm ({confirm.length})</h2>
          {owners.map((o) => (
            <div key={o}>
              <p style={{ ...mono, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: K.violet, margin: "26px 0 0" }}>{o}</p>
              <ul style={{ padding: 0, margin: "10px 0 0", display: "grid", gap: 10 }}>
                {confirm
                  .filter((n) => n.who === o)
                  .map((n) => (
                    <Item key={n.text} n={n} />
                  ))}
              </ul>
            </div>
          ))}

          <h2 style={h2}>Where Michael’s and Chris’s asks are now</h2>
          <div style={{ ...box, marginTop: 16, overflow: "hidden" }}>
            {ASKS.map((a, i) => (
              <div key={a.ask} className="k-ask" style={{ display: "grid", gridTemplateColumns: "1.3fr 0.6fr 1.3fr", gap: 14, padding: "13px 18px", borderTop: i ? `1px solid ${K.line}` : "none", alignItems: "baseline" }}>
                <span style={{ ...sans, fontSize: 15, fontWeight: 600, color: K.ink }}>{a.ask}</span>
                <span style={{ ...mono, fontSize: 12, color: K.violet }}>{a.who}</span>
                <Link href={a.href} style={{ ...sans, fontSize: 14.5, color: K.stone, textDecoration: "underline", textUnderlineOffset: 3 }}>
                  {a.where}
                </Link>
              </div>
            ))}
          </div>

          <h2 style={h2}>Every page</h2>
          <ul style={{ padding: 0, margin: "16px 0 0", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {pages.map(([n, h]) => (
              <li key={h} style={{ listStyle: "none" }}>
                <Link href={h} style={{ ...sans, display: "inline-flex", fontSize: 14.5, fontWeight: 600, color: K.ink, background: K.wash, border: `1px solid ${K.line}`, borderRadius: 999, padding: "8px 14px", textDecoration: "none" }}>
                  {n}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <style>{`@media (max-width: 640px) { .k-ask, .k-rv2 { grid-template-columns: 1fr !important; } .k-ask { gap: 4px !important; } }`}</style>
      </Sect>
    </KoherentShell>
  );
}
