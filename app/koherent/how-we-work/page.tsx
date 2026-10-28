import type { Metadata } from "next";
import { Reveal } from "@/components/ui/reveal";
import { MethodScreen } from "@/components/sections/koherent-method";
import { ConsoleView } from "@/components/sections/koherent-motion";
import { inner, K, KoherentShell, Label, PAGES, PageHead, ScoreClose, Sect, Steps, mono, sans, title } from "@/components/sections/koherent-ui";

// /koherent/how-we-work — Chris on v3 (Aug 10): "we can really dig into the
// details in this section, showcasing 'how' we get at better outcomes", and
// (Oct 22) the way we work is the product: assess, plan, design, test and
// execute alongside the customer, who stays in control.
//   - The six steps are the home page's, each as a row with its product
//     screen (MethodScreen, the same screens as the home page's player), what
//     we do and what the customer gets. Timings and the proposal's contents
//     are the old engagement page's.
//   - The rhythm and what the team may do without asking are the /dashboard
//     service model (Network.tsx and scenarios.ts on main), so the site and
//     the product say the same thing.
//   - ConsoleView moved here from the home page's Why we're different.
//   - The chevron steps mark the six steps only, where they count something
//     real; the rhythm cards don't carry them.

export const metadata: Metadata = {
  title: "How we work",
  description: "Six steps, run alongside your team as if it were our business. We suggest, you approve, and you stay in control.",
};

const STEPS: { name: string; when?: string; we: string; you: string }[] = [
  {
    name: "Assess",
    when: "1 to 2 weeks",
    we: "Start from your own orders: every lane, carrier and cost. We talk to the people who run shipping day to day, because the logic that matters is rarely written down.",
    you: "A profile of where your orders go, what each one costs all in, and where the time goes.",
  },
  {
    name: "Plan",
    we: "Agree the goals with you, in your numbers, and what comes first. Often that's shipping cost: the quickest win, without changing how you run.",
    you: "Written goals, like cost per order or customers reached within two days, and an order to tackle them in.",
  },
  {
    name: "Design",
    we: "Pick the carriers, warehouses and routes, and price them before you commit to anything.",
    you: "A proposal, not a quote: your operation modeled, a clear rate card, lane-by-lane costs against today and the savings worked out on your own numbers. If we can't show a return, we tell you.",
  },
  {
    name: "Test",
    we: "Prove it on your real shipments before anything changes, side by side with what you pay today.",
    you: "Numbers from your own orders, not from a model. Your customers see no change while we test.",
  },
  {
    name: "Go live",
    we: "Switch it on in phases alongside your team: connections first, then the routing rules, then each new site.",
    you: "A go-live plan with owners on both sides, your team trained, and nothing paused.",
  },
  {
    name: "Improve",
    we: "Review the results with you every month and keep optimizing as you grow. When you need a new region, we design the next site the same way.",
    you: "Results measured against the goals you agreed, in writing.",
  },
];

const RHYTHM: [string, string][] = [
  ["Daily note", "What we did yesterday, and anything that needs you."],
  ["Weekly check-in", "30 minutes with your operator and support lead."],
  ["Monthly report", "Your numbers against the goals, and what you saved against what you paid us."],
  ["Quarterly review", "Results against these goals, and the next ones."],
];

const INGREDIENTS: string[] = [
  "A control tower watching every order",
  "Experts on the ground at your sites",
  "A daily rhythm with your team",
  "Technology that shows you everything",
];

// The /dashboard's starting permissions for a new account (scenarios.ts,
// jobsAtStart): what the team may do without asking, and what waits for you.
// The carrier switch keeps scenarios.ts's "before pickup": after pickup it
// can't be done, or undone.
const JOBS: { mode: string; jobs: string[] }[] = [
  { mode: "Just do it", jobs: ["Fix an incomplete address with your customer before pickup", "Switch carrier before pickup when one is running late, at no extra cost"] },
  { mode: "Do it, tell me", jobs: ["Reship a lost or damaged parcel under $100"] },
  { mode: "Ask me first", jobs: ["Move stock between your warehouses", "Change your shipping rules (always)"] },
];

const ASKS: { title: string; body: string }[] = [
  { title: "Access to your data", body: "The shipping data we need to model your operation honestly: lanes, volumes, spend and exceptions." },
  { title: "Time with your team", body: "The people who actually run shipping. The logic that matters isn't written down anywhere else." },
  { title: "A decision-maker at the proposal", body: "Someone who can say yes. If we're not a fit, you keep the read on your operation." },
];

export default function KoherentHowWeWorkPage() {
  return (
    <KoherentShell>
      <PageHead
        chapter={2}
        label="How we work"
        heading={<>Alongside your team, as if it were our business.</>}
        lead="Six steps, from your own orders to go-live and beyond. We suggest, you approve, and you stay in control."
      />

      {/* the six steps: what we do, what you get, and what it looks like */}
      <Sect bg={K.mist}>
        <div style={{ ...inner, paddingTop: "clamp(56px, 7vw, 96px)" }}>
          <Reveal>
            <p style={{ ...mono, fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", color: K.stone, textAlign: "center", margin: 0 }}>
              The six steps on an example account, Alder &amp; Stone · figures are illustrative
            </p>
          </Reveal>
          <ol style={{ listStyle: "none", padding: 0, margin: "clamp(28px, 3.5vw, 44px) 0 0", display: "grid", gap: "clamp(56px, 8vw, 112px)" }}>
            {STEPS.map((s, i) => (
              <li key={s.name}>
                <div className={`k-steprow${i % 2 ? " is-flip" : ""}`} style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "clamp(28px, 5vw, 72px)", alignItems: "center" }}>
                  <Reveal className="k-steptext" style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Steps total={6} done={i + 1} size={13} />
                      <Label>Step {String(i + 1).padStart(2, "0")}{s.when ? ` · ${s.when}` : ""}</Label>
                    </div>
                    <h2 style={{ ...title, fontSize: "clamp(2.2rem, 4.2vw, 3.3rem)", color: K.ink, margin: "16px 0 0" }}>{s.name}</h2>
                    <p style={{ ...sans, fontSize: "clamp(1.02rem, 1.3vw, 1.12rem)", lineHeight: 1.65, color: K.stone, margin: "14px 0 0", maxWidth: "44ch" }}>{s.we}</p>
                    <div style={{ marginTop: 22, borderLeft: `3px solid ${K.plum}`, padding: "4px 0 4px 18px", maxWidth: "44ch" }}>
                      <p style={{ ...mono, fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: K.plum, margin: 0 }}>What you get</p>
                      <p style={{ ...sans, fontSize: 16, lineHeight: 1.6, fontWeight: 500, color: K.ink, margin: "6px 0 0" }}>{s.you}</p>
                    </div>
                  </Reveal>
                  <div className="k-stepscreen">
                    <MethodScreen n={i} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Sect>

      {/* the rhythm, once you're live */}
      <Sect bg={K.ink}>
        <div style={{ ...inner }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <Label onDark>Once you&rsquo;re live</Label>
              <h2 style={{ ...title, fontSize: "clamp(2rem, 4vw, 3.1rem)", color: K.onDark, margin: "16px auto 0", maxWidth: "20ch" }}>A rhythm you can set your watch by.</h2>
            </div>
          </Reveal>
          <div className="k-six" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: "clamp(36px, 4.5vw, 56px)" }}>
            {RHYTHM.map(([name, body], i) => (
              <Reveal key={name} delay={i * 80}>
                <div style={{ height: "100%", border: `1px solid ${K.darkLine}`, borderRadius: 4, padding: "22px 22px 24px", textAlign: "left" }}>
                  <h3 style={{ ...title, fontSize: "1.3rem", color: K.onDark, margin: 0 }}>{name}</h3>
                  <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: K.onDarkDim, margin: "8px 0 0" }}>{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 30 }}>
              {INGREDIENTS.map((t) => (
                <span key={t} style={{ ...sans, fontSize: 14.5, fontWeight: 500, color: K.onDark, border: `1px solid ${K.darkLine}`, borderRadius: 999, padding: "9px 16px" }}>
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </Sect>

      {/* you stay in control */}
      <Sect bg={K.mist}>
        <div style={{ ...inner }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <Label>You stay in control</Label>
              <h2 style={{ ...title, fontSize: "clamp(2rem, 4vw, 3.1rem)", color: K.ink, margin: "16px auto 0", maxWidth: "22ch" }}>We suggest. You approve. You decide what we can just do.</h2>
              <p style={{ ...sans, fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)", lineHeight: 1.6, color: K.stone, margin: "18px auto 0", maxWidth: "56ch" }}>
                Every account starts like this, and you change it whenever you like. Everything we do shows in your daily note.
              </p>
            </div>
          </Reveal>
          <div className="k-three" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(36px, 4.5vw, 56px)" }}>
            {JOBS.map((j, i) => (
              <Reveal key={j.mode} delay={i * 90}>
                <div style={{ height: "100%", background: i === 2 ? K.plum : K.card, border: `1px solid ${i === 2 ? K.plum : K.line}`, borderRadius: 4, padding: "24px 24px 26px", textAlign: "left" }}>
                  <p style={{ ...mono, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: i === 2 ? K.lilac : K.violet, margin: 0 }}>{j.mode}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "grid", gap: 10 }}>
                    {j.jobs.map((t) => (
                      <li key={t} style={{ ...sans, fontSize: 15.5, lineHeight: 1.5, color: i === 2 ? K.onDark : K.ink }}>{t}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: "clamp(56px, 7vw, 88px)", textAlign: "center" }}>
            <Label>What one view looks like</Label>
            <div style={{ marginTop: 26 }}>
              <ConsoleView />
            </div>
            {/* Michael (Aug 6): show the custom dashboard, with Shiplets, as a
                deliverable, with an example: the live /dashboard mockup */}
            <a href="https://lp.shiptime.com/dashboard" className="k-more" style={{ ...sans, position: "relative", display: "inline-flex", alignItems: "center", gap: 7, marginTop: 40, fontSize: 15, fontWeight: 700, color: K.plum, textDecoration: "none" }}>
              Open the example account &rarr;
            </a>
          </div>
        </div>
      </Sect>

      {/* what we ask of you */}
      <Sect>
        <div style={{ ...inner }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <Label>What we ask of you</Label>
              <h2 style={{ ...title, fontSize: "clamp(2rem, 4vw, 3.1rem)", color: K.ink, margin: "16px 0 0" }}>Three things. That&rsquo;s it.</h2>
            </div>
          </Reveal>
          <div className="k-three" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(36px, 4.5vw, 56px)" }}>
            {ASKS.map((a, i) => (
              <Reveal key={a.title} delay={i * 90}>
                <div style={{ height: "100%", borderTop: `2px solid ${K.plum}`, paddingTop: 20, textAlign: "center" }}>
                  <h3 style={{ ...title, fontSize: "1.35rem", color: K.ink, margin: 0 }}>{a.title}</h3>
                  <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.6, color: K.stone, margin: "10px auto 0", maxWidth: "32ch" }}>{a.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Sect>

      <ScoreClose next={{ href: PAGES.cases, name: "Case studies" }} />
      <style>{`
        .k-steprow.is-flip { grid-template-columns: 1.15fr 0.85fr !important; }
        .k-steprow.is-flip .k-steptext { order: 2; }
        @media (max-width: 900px) {
          .k-steprow, .k-steprow.is-flip { grid-template-columns: 1fr !important; }
          .k-steprow.is-flip .k-steptext { order: 0; }
        }
      `}</style>
    </KoherentShell>
  );
}
