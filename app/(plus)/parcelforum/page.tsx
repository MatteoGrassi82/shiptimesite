import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes, Building2, CalendarDays, Gauge, MapPin, RotateCcw, Route, Tags, Warehouse } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter } from "@/components/sections/site-chrome";
import { LpsShiplet } from "@/components/sections/lps-shiplet";
import { P, serif, sans, inner, dots, Eyebrow, HalftoneBlob, Sparkle } from "@/components/sections/plus-v2-kit";
import { Reveal } from "@/components/ui/reveal";
import type { SiteSettings } from "@/components/sections/types";

// ── /parcelforum — the booth QR target ───────────────────────────────────────
// Decided on the 2026-08-13 banner call: the 10x10 banner's QR code points at a
// dedicated event landing page, NOT shiptime.com and not a LinkedIn profile.
// Artwork deadline is the 21st, so this URL must stay stable — do not rename
// this route once the banner goes to print.
//
// It's a real landing page, not a form on a background: someone scans at the
// booth (or lands from pre-show outreach) and gets the pitch, the offer, what
// we actually do, the proof, and a way to book time — in that order. The
// assessment itself lives on /parcelforum/score, where there is nothing to
// scroll to and nothing still selling.
//
// Delivery: score on screen, written report by email about an hour later
// (2026-08-20 call, reaffirmed on the 24th). A report that lands the instant
// you press submit announces itself as machine-written; the same words an hour
// later read as a letter, and give a rep a reason to be in the thread. Hence
// `reportDelivery="email"` — and hence card 03 below promising an inbox, not a
// chat window.
//
// Facts used here are sourced, not invented: event dates from the Parcel Forum
// '26 logo art, service list + case numbers from the North Bound proposal
// (July 2026), infrastructure figures from its slide 4.
//
// TODO before print: booth number is unknown — BOOTH_NUMBER stays null until
// Austin confirms, and the "find us" card renders without it rather than
// showing a placeholder someone might trust.

export const metadata: Metadata = {
  title: "Your Logistics Performance Score — ShipTime Plus at Parcel Forum '26",
  description:
    "Sixteen questions, five minutes. Get your Logistics Performance Score across cost, operational excellence and customer experience — with a personalized read on where the leverage is.",
  robots: "noindex",
};

const BOOTH_NUMBER: string | null = null;

// Straight to HubSpot scheduling; the booking page only if the env is unset.
const BOOK_HREF =
  process.env.NEXT_PUBLIC_PLUS_CALENDAR_URL ||
  process.env.NEXT_PUBLIC_LEAD_CALENDAR_URL ||
  "/plus/book-a-call";
const bookProps = BOOK_HREF.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

const STATS = [
  { v: "2M+", l: "shipments managed per year" },
  { v: "20 yrs", l: "in shipping and logistics" },
  { v: "1,000+", l: "active platform merchants" },
];

const SERVICES = [
  { icon: Warehouse, t: "Warehousing & fulfillment", d: "Certified partner network, run by our ops team." },
  { icon: Boxes, t: "Inventory placement", d: "Stock positioned by demand, not by who has space." },
  { icon: Tags, t: "Multi-carrier rate shopping", d: "Our negotiated rates and yours, compared per shipment." },
  { icon: Route, t: "Zone skipping & injection", d: "Bulk the linehaul, inject regionally, cut transit." },
  { icon: Gauge, t: "Cross-border, both ways", d: "Canada and US, customs brokerage included." },
  { icon: RotateCcw, t: "Returns", d: "Flexible labels and routing, restocked into the network." },
];

export default async function ParcelForumPage() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: "plus" }, tags: ["siteSettings"] });

  return (
    <>
      {/* No ZoneNav: this is a landing page. A booth scan has one job, and a
          sitemap in the header is an invitation to go do something else. */}
      <main style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}>
        {/* ── hero: event badge + the shiplet, together above the fold ───────── */}
        <section style={{ position: "relative", overflow: "hidden", background: P.dark }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, ...dots("rgba(255,255,255,0.05)", 13, 1.7) }} />
          <HalftoneBlob color="rgba(236,90,38,0.32)" style={{ width: 520, height: 520, right: -160, top: -180 }} />
          <div style={{ ...inner, position: "relative" }}>
            <div className="pf-split" style={{ display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: "clamp(36px, 5vw, 72px)", alignItems: "center" }}>
              <div>
                <div style={{ display: "inline-flex", background: "#fff", borderRadius: 12, padding: "12px 18px", marginBottom: 24 }}>
                  <img
                    src="/generated/parcel-forum-logo.webp"
                    alt="Parcel Forum '26 — September 14-16"
                    width={820}
                    height={200}
                    style={{ width: "clamp(190px, 24vw, 270px)", height: "auto", display: "block" }}
                  />
                </div>
                <h1 style={{ ...serif, fontSize: "clamp(2.5rem, 5.4vw, 4rem)", lineHeight: 1.04, color: "#fff", margin: 0 }}>
                  You came to the booth. <span style={{ fontStyle: "italic" }}>Leave with a number.</span>
                </h1>
                <p style={{ ...sans, fontSize: "clamp(1.05rem, 1.5vw, 1.24rem)", fontWeight: 500, lineHeight: 1.62, color: "rgba(248,249,252,0.9)", margin: "20px 0 0", maxWidth: "48ch" }}>
                  Sixteen questions. Five minutes. Your Logistics Performance Score out of 100 — scored across cost,
                  operational excellence and customer experience, with a personalized read on where the leverage is.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 28px", marginTop: 30 }}>
                  {STATS.map((s) => (
                    <div key={s.l}>
                      <div style={{ ...serif, fontSize: "clamp(1.7rem, 2.6vw, 2.2rem)", lineHeight: 1, color: P.orange }}>{s.v}</div>
                      <div style={{ ...sans, fontSize: 12.5, lineHeight: 1.45, color: "rgba(244,245,248,0.7)", marginTop: 6, maxWidth: "18ch" }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <LpsShiplet startHref="/parcelforum/score" reportDelivery="email" />
              </div>
            </div>
          </div>
        </section>

        {/* ── what you get back — the offer, made concrete ───────────────────── */}
        <section style={{ position: "relative", background: P.panel, borderTop: `1px solid ${P.line}` }}>
          <div style={{ ...inner }}>
            <Reveal>
              <div style={{ maxWidth: 700 }}>
                <Eyebrow>What you get back</Eyebrow>
                <h2 style={{ ...serif, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.06, color: P.ink, margin: "20px 0 0" }}>
                  Not a brochure. <span style={{ fontStyle: "italic" }}>A diagnostic.</span>
                </h2>
              </div>
            </Reveal>
            <div className="pf-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(40px, 5vw, 60px)" }}>
              {[
                { n: "01", t: "Your score out of 100", d: "One Logistics Performance Score, plus a separate score for cost, operations and customer experience." },
                { n: "02", t: "Where the leverage is", d: "The three gaps costing you the most, weighted — with the first concrete move for each." },
                { n: "03", t: "The written read, by email", d: "What your answers actually say about the operation — the costliest gaps and the first move for each — in your inbox within the hour." },
              ].map((c, i) => (
                <Reveal key={c.n} delay={i * 100}>
                  <div className="pk-lift" style={{ height: "100%", background: P.card, border: `1px solid ${P.line}`, borderRadius: 20, padding: "28px 28px 32px" }}>
                    <span style={{ ...serif, fontSize: 20, color: P.orange }}>{c.n}</span>
                    <h3 style={{ ...serif, fontSize: "clamp(1.4rem, 2.1vw, 1.7rem)", lineHeight: 1.14, color: P.ink, margin: "12px 0 0" }}>{c.t}</h3>
                    <p style={{ ...sans, fontSize: 14, lineHeight: 1.62, color: "#4A5060", margin: "10px 0 0" }}>{c.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── the framework ──────────────────────────────────────────────────── */}
        <section style={{ position: "relative", background: P.panelSoft, borderTop: `1px solid ${P.line}`, borderBottom: `1px solid ${P.line}` }}>
          <div style={{ ...inner }}>
            <Reveal>
              <div style={{ maxWidth: 720 }}>
                <Eyebrow>The framework</Eyebrow>
                <h2 style={{ ...serif, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.06, color: P.ink, margin: "20px 0 0" }}>
                  Three pillars of a well-designed <span style={{ fontStyle: "italic" }}>logistics system.</span>
                </h2>
                <p style={{ ...sans, fontSize: "clamp(1.02rem, 1.4vw, 1.18rem)", fontWeight: 500, lineHeight: 1.62, color: "#464C5C", margin: "16px 0 0" }}>
                  One that lowers cost, improves operational efficiency and elevates the customer experience. Your
                  score is weighted across all three, and every completed assessment feeds the Logistics Performance
                  Index — the benchmark behind our State of Logistics Performance Report.
                </p>
              </div>
            </Reveal>

            <div className="pf-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(44px, 5vw, 64px)" }}>
              {[
                { n: "42%", t: "Logistics Costs", d: "Carrier optimization, inventory positioning, cost visibility, pricing strategy, regional carriers, packaging." },
                { n: "34%", t: "Operational Excellence", d: "Process automation, systems integration, service levels, exception management, continuous improvement." },
                { n: "24%", t: "Customer Experience", d: "Post-purchase experience, delivery performance, returns, feedback loops, delivery choice." },
              ].map((c, i) => (
                <Reveal key={c.t} delay={i * 100}>
                  <div className="pk-lift" style={{ height: "100%", background: P.card, border: `1px solid ${P.line}`, borderRadius: 20, padding: "28px 28px 32px" }}>
                    <div style={{ ...serif, fontSize: "clamp(2rem, 3vw, 2.5rem)", lineHeight: 1, color: P.orange }}>{c.n}</div>
                    <h3 style={{ ...serif, fontSize: "clamp(1.4rem, 2.1vw, 1.7rem)", lineHeight: 1.14, color: P.ink, margin: "14px 0 0" }}>{c.t}</h3>
                    <p style={{ ...sans, fontSize: 14, lineHeight: 1.62, color: "#4A5060", margin: "10px 0 0" }}>{c.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── what we actually do ────────────────────────────────────────────── */}
        <section style={{ position: "relative", background: P.panel }}>
          <div style={{ ...inner }}>
            <Reveal>
              <div style={{ maxWidth: 700 }}>
                <Eyebrow>What we do</Eyebrow>
                <h2 style={{ ...serif, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.06, color: P.ink, margin: "20px 0 0" }}>
                  We design the system, <span style={{ fontStyle: "italic" }}>then help you run it.</span>
                </h2>
                <p style={{ ...sans, fontSize: "clamp(1.02rem, 1.4vw, 1.18rem)", fontWeight: 500, lineHeight: 1.62, color: "#464C5C", margin: "16px 0 0" }}>
                  An integrated network that reaches efficiencies a standalone warehouse or parcel provider can&rsquo;t.
                </p>
              </div>
            </Reveal>
            <div className="pf-services" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: "clamp(40px, 5vw, 60px)" }}>
              {SERVICES.map((s, i) => (
                <Reveal key={s.t} delay={(i % 3) * 90}>
                  <div className="pk-lift" style={{ height: "100%", background: P.card, border: `1px solid ${P.line}`, borderRadius: 18, padding: "24px 24px 28px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 11, background: P.orangeTint, color: P.orange }}>
                      <s.icon size={19} strokeWidth={2} />
                    </span>
                    <h3 style={{ ...serif, fontSize: 20, lineHeight: 1.18, color: P.ink, margin: "14px 0 0" }}>{s.t}</h3>
                    <p style={{ ...sans, fontSize: 13.5, lineHeight: 1.6, color: "#4A5060", margin: "7px 0 0" }}>{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── proof ──────────────────────────────────────────────────────────── */}
        <section style={{ position: "relative", overflow: "hidden", background: P.dark }}>
          <HalftoneBlob color="rgba(236,90,38,0.3)" style={{ width: 460, height: 460, right: -150, top: -160 }} />
          <div style={{ ...inner, position: "relative" }}>
            <div className="pf-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 5vw, 72px)", alignItems: "center" }}>
              <div>
                <Eyebrow onDark>Proof</Eyebrow>
                <h2 style={{ ...serif, fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", lineHeight: 1.08, color: "#fff", margin: "18px 0 0" }}>
                  A US brand entering Canada, <span style={{ fontStyle: "italic" }}>redesigned.</span>
                </h2>
                <p style={{ ...sans, fontSize: "clamp(1rem, 1.4vw, 1.16rem)", fontWeight: 500, lineHeight: 1.65, color: "rgba(244,245,248,0.86)", margin: "16px 0 0", maxWidth: "46ch" }}>
                  Every order shipping from Texas at premium cross-border rates, with customs delays their customers
                  felt. We designed a four-phase entry: bulk shipping, Canadian fulfillment, last-mile injection, then
                  expansion across the network.
                </p>
                <p style={{ ...sans, fontSize: 12, color: "rgba(244,245,248,0.45)", margin: "16px 0 0" }}>
                  Anonymized pending customer permission. Figures from the delivered proposal.
                </p>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                  <span style={{ ...serif, fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)", color: "rgba(244,245,248,0.5)", textDecoration: "line-through", textDecorationColor: P.orange }}>$25.00</span>
                  <span style={{ ...serif, fontSize: "clamp(3rem, 6vw, 4.4rem)", lineHeight: 1, color: P.orange }}>$13.22</span>
                  <span style={{ ...sans, fontSize: 12.5, color: "rgba(244,245,248,0.7)" }}>delivered cost per shipment</span>
                </div>
                <div className="pf-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 26 }}>
                  {[
                    ["40–50%", "lower transportation costs"],
                    ["~$600K", "saved per year on shipping"],
                    ["Faster", "delivery, no customs delays"],
                  ].map(([v, l]) => (
                    <div key={l} style={{ borderRadius: 14, border: `1px solid ${P.darkLine}`, background: "rgba(255,255,255,0.04)", padding: "16px 16px 18px" }}>
                      <div style={{ ...serif, fontSize: "clamp(1.2rem, 2vw, 1.6rem)", color: "#fff" }}>{v}</div>
                      <div style={{ ...sans, fontSize: 11.5, lineHeight: 1.5, color: "rgba(244,245,248,0.7)", marginTop: 5 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── the people (same band as /plus/v3, same photo) ─────────────────── */}
        <section style={{ position: "relative", background: P.panel, borderTop: `1px solid ${P.line}` }}>
          <div style={{ ...inner }}>
            <div className="pf-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(36px, 5vw, 80px)", alignItems: "center" }}>
              <div>
                <Eyebrow>The people</Eyebrow>
                <h2 style={{ ...serif, fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", lineHeight: 1.1, color: P.ink, margin: "18px 0 0" }}>
                  Experienced operators, <span style={{ fontStyle: "italic" }}>not account managers.</span>
                </h2>
                <p style={{ ...sans, fontSize: "clamp(1rem, 1.4vw, 1.16rem)", fontWeight: 500, lineHeight: 1.65, color: "#464C5C", margin: "16px 0 0", maxWidth: "48ch" }}>
                  The person who reads your score with you is the same person who would design the system and stay on
                  it afterwards. Strategy, solution design, implementation, ongoing optimization — one team, and they
                  know your network by name.
                </p>
              </div>
              <img
                src="/generated/plus-ops-team.webp"
                alt="Two ShipTime operators reviewing a logistics plan together"
                width={1024}
                height={1024}
                loading="lazy"
                style={{ width: "100%", height: "auto", borderRadius: 22, display: "block", border: `1px solid ${P.line}` }}
              />
            </div>
          </div>
        </section>

        {/* ── find us at the show ────────────────────────────────────────────── */}
        <section style={{ position: "relative", background: P.panelSoft, borderTop: `1px solid ${P.line}` }}>
          <div style={{ ...inner }}>
            <div className="pf-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 5vw, 72px)", alignItems: "center" }}>
              <div>
                <Eyebrow>Find us at the show</Eyebrow>
                <h2 style={{ ...serif, fontSize: "clamp(2rem, 3.8vw, 2.9rem)", lineHeight: 1.07, color: P.ink, margin: "18px 0 0" }}>
                  Bring your score. <span style={{ fontStyle: "italic" }}>We&rsquo;ll read it with you.</span>
                </h2>
                <p style={{ ...sans, fontSize: "clamp(1rem, 1.4vw, 1.16rem)", fontWeight: 500, lineHeight: 1.65, color: "#464C5C", margin: "16px 0 0", maxWidth: "46ch" }}>
                  Take the assessment before you stop by and the conversation starts somewhere useful — your actual
                  numbers, not a product tour. Or book a slot now and we&rsquo;ll hold the time.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                  <a href={BOOK_HREF} {...bookProps} className="st-cta" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10, background: P.orange, color: "#fff", padding: "14px 26px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
                    Book time at the booth <ArrowRight size={15} />
                  </a>
                  <Link href="/plus/v3" className="st-cta" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10, border: `1px solid ${P.line}`, background: P.card, color: P.ink, padding: "14px 26px", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                    See how we work
                  </Link>
                </div>
              </div>
              <div style={{ background: P.card, border: `1px solid ${P.line}`, borderRadius: 20, padding: "clamp(26px, 3vw, 38px)" }}>
                {[
                  { Icon: CalendarDays, k: "Dates", v: "September 14–16, 2026" },
                  { Icon: Building2, k: "Event", v: "Parcel Forum '26" },
                  ...(BOOTH_NUMBER ? [{ Icon: MapPin, k: "Booth", v: BOOTH_NUMBER }] : []),
                ].map((row, i) => (
                  <div key={row.k} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px 0", borderTop: i ? `1px solid ${P.line}` : "none" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 10, background: P.orangeTint, color: P.orange, flex: "none" }}>
                      <row.Icon size={18} strokeWidth={2} />
                    </span>
                    <div>
                      <div style={{ ...sans, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: P.faint }}>{row.k}</div>
                      <div style={{ ...serif, fontSize: 21, color: P.ink, marginTop: 4 }}>{row.v}</div>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 12, alignItems: "baseline", paddingTop: 18, borderTop: `1px solid ${P.line}` }}>
                  <Sparkle size={14} />
                  <span style={{ ...sans, fontSize: 13.5, lineHeight: 1.55, color: "#4A5060" }}>
                    Canada, US and cross-border — parcel through full truckload, with customs brokerage.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ── closing: photo-backed card, same pattern as /plus/v3 ───────────── */}
        <section style={{ position: "relative", overflow: "hidden", background: P.dark }}>
          <img
            src="/generated/plus-cta-operator.webp"
            alt=""
            aria-hidden
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "left center" }}
          />
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(28,30,61,0.2) 0%, rgba(28,30,61,0.03) 45%, rgba(28,30,61,0.14) 100%)" }} />
          <div style={{ ...inner, position: "relative", minHeight: "min(78svh, 680px)", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <div style={{ background: "rgba(251,251,252,0.97)", borderRadius: 22, padding: "clamp(30px, 3.6vw, 46px)", maxWidth: 520, width: "100%", boxShadow: "0 30px 70px -30px rgba(16,18,38,0.5)" }}>
              <Eyebrow>Before the show</Eyebrow>
              <h2 style={{ ...serif, fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)", lineHeight: 1.1, color: P.ink, margin: "16px 0 0" }}>
                Get your score, then come <span style={{ fontStyle: "italic" }}>find us.</span>
              </h2>
              <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.62, color: "#4A5060", margin: "14px 0 0" }}>
                Five minutes now saves the first twenty of any conversation at the booth.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26 }}>
                <Link href="/parcelforum/score" className="st-cta" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10, background: P.orange, color: "#fff", padding: "14px 26px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
                  Start the assessment <ArrowRight size={15} />
                </Link>
                <a href={BOOK_HREF} {...bookProps} className="st-cta" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10, border: `1px solid ${P.line}`, background: P.card, color: P.ink, padding: "14px 26px", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                  Book a call
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ZoneFooter zone="plus" settings={settings} />

      <style>{`
        @media (max-width: 980px) {
          .pf-split { grid-template-columns: 1fr !important; }
          .pf-cards { grid-template-columns: 1fr !important; }
          .pf-services { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .pf-services { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
