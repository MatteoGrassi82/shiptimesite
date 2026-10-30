import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_NOTES, ASKS, PAGES_R2 } from "@/components/sections/koherent-copy";
import type { PlacedNote } from "@/components/sections/koherent-copy";
import { box, K, KoherentShell, Label, PAGES, REVIEW, Sect, display, mono, sans, title } from "@/components/sections/koherent-ui";

// /koherent/review — every open item on revision 2 in one place: the
// decisions first, then Jenny's "Confirm…" notes grouped by who confirms,
// then where each of Michael's and Chris's asks lives now. Only while REVIEW
// is on (koherent-brand.tsx).

export const metadata: Metadata = { title: "Review: revision 2", robots: "noindex" };

const h2 = { ...title, fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)", color: K.ink, margin: "clamp(44px, 5vw, 64px) 0 0" };

function Item({ n }: { n: PlacedNote }) {
  return (
    <li style={{ ...box, listStyle: "none", padding: "16px 18px", display: "grid", gap: 6 }}>
      <span style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: n.kind === "decide" ? K.plum : "#5C4300" }}>
        {n.kind === "decide" ? "To decide" : "To confirm"} · {n.who}
      </span>
      <span style={{ ...sans, fontSize: 15.5, lineHeight: 1.55, color: K.ink }}>{n.text}</span>
      <Link href={n.path} style={{ ...sans, fontSize: 14, color: K.violet, textDecoration: "underline", textUnderlineOffset: 3 }}>
        {n.page} · {n.where}
      </Link>
    </li>
  );
}

export default function KoherentReviewPage() {
  if (!REVIEW) notFound();
  const decide = ALL_NOTES.filter((n) => n.kind === "decide");
  const confirm = ALL_NOTES.filter((n) => n.kind !== "decide");
  const owners = [...new Set(confirm.map((n) => n.who))];
  const pages: [string, string][] = [
    ["Home", PAGES.home],
    ...PAGES_R2.map((p): [string, string] => [p.title, p.path]),
    ["Customer stories", PAGES.cases],
    ["Logistics Performance Score", PAGES.score],
    ["How we work (first revision)", PAGES.how],
    ["What we bring (first revision)", PAGES.bring],
    ["Contact", PAGES.contact],
  ];
  return (
    <KoherentShell>
      <Sect>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "clamp(40px, 5vw, 72px) clamp(20px, 4vw, 56px) clamp(56px, 7vw, 96px)" }}>
          <Label>Revision 2 · for review</Label>
          <h1 style={{ ...display, fontSize: "clamp(2.4rem, 4.6vw, 3.6rem)", color: K.plum, margin: "18px 0 0" }}>What’s open on the new site.</h1>
          <p style={{ ...sans, fontSize: "clamp(1.05rem, 1.35vw, 1.18rem)", lineHeight: 1.65, color: K.stone, margin: "20px 0 0", maxWidth: "64ch" }}>
            Jenny’s navigation and copy (Oct 29), built page by page. Her words are kept as she wrote them, apart from “custom shipping applet” in place of “Shiplet”, as her email asked. Each bracketed note in her draft is a tag on the page where it applies, and they’re all here. Who confirms is her name where she gave one (David, Peter’s team) and otherwise a suggestion by role. The switch at the bottom left hides the tags.
          </p>

          <h2 style={h2}>To decide ({decide.length})</h2>
          <ul style={{ padding: 0, margin: "18px 0 0", display: "grid", gap: 10 }}>
            {decide.map((n) => (
              <Item key={n.page + n.text} n={n} />
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
                    <Item key={n.page + n.text} n={n} />
                  ))}
              </ul>
            </div>
          ))}

          <h2 style={h2}>Where Michael’s and Chris’s asks are now</h2>
          <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.6, color: K.stone, margin: "10px 0 0", maxWidth: "64ch" }}>Everything they asked for on the first revision is still on the site; some of it moved to the page it fits.</p>
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
        <style>{`@media (max-width: 640px) { .k-ask { grid-template-columns: 1fr !important; gap: 4px !important; } }`}</style>
      </Sect>
    </KoherentShell>
  );
}
