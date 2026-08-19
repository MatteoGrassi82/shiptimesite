"use client";

// Low-commitment lead capture: replaces the external "sign up" redirect on the
// comparison pages with an inline popup. Just an email — no account creation,
// no call booked. Submission is stubbed (onSubmit prop) until a real
// destination (CRM/API route) is wired up.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/icons";

const ds = {
  navy: "#1C1E3D",
  muted: "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  surface: "#F8FAFB",
  white: "#FFFFFF",
};
const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };

// ── Qualification intake ──────────────────────────────────────────────────────
const INDUSTRIES = [
  "E-commerce / retail",
  "Manufacturing",
  "Wholesale / distribution",
  "3PL / fulfillment",
  "Health & beauty",
  "Food & beverage",
  "Other",
];
const VOLUMES = ["None", "1–25", "26–100", "101–500", "501–2,000", "2,000+"];
// HubSpot meetings link embedded on the success screen (after the lead is
// already saved, so booking is pure upside). Set NEXT_PUBLIC_LEAD_CALENDAR_URL
// to enable; unset, the section stays hidden.
const CALENDAR_URL = process.env.NEXT_PUBLIC_LEAD_CALENDAR_URL;
const CALENDAR_EMBED = CALENDAR_URL
  ? `${CALENDAR_URL}${CALENDAR_URL.includes("?") ? "&" : "?"}embed=true`
  : null;

const MODES: { key: string; label: string }[] = [
  { key: "parcel_volume", label: "Parcel / Courier" },
  { key: "ltl_volume", label: "LTL" },
  { key: "partial_volume", label: "Partial truckload" },
  { key: "lcl_volume", label: "LCL (ocean)" },
];

// ── Attribution (UTM) capture ────────────────────────────────────────────────
// Per ShipTime's UTM guideline the triple is: utm_source = partner/brand
// (shiptime, costco, cfib), utm_medium = channel (search, social, email,
// tradeshow, web, website), utm_campaign = the specific initiative. The approved
// values are set where the links are built (and aren't uniformly lowercase — e.g.
// Costco's "Costco Single"), so we forward exactly what the URL carries — no
// rewriting — and let the first touch win across internal navigation.
//
// Storage is localStorage, not sessionStorage, and that's the whole point: a
// visitor who clicks an ad, leaves, and comes back days later without the UTMs
// in the URL still converts against the campaign that brought them. This mirrors
// what ShipTime's own signup pages do (David, 2026-08-12) — see the inline
// writer in components/tracking.tsx, which uses this same key and shape and runs
// on every page. These functions read what that script wrote; the write here is
// a fallback for the (unlikely) case that a form mounts on a page without it.
const STORE_KEY = "st_attribution";
// Read for backwards compatibility only: visitors mid-session when this shipped
// have their first touch in sessionStorage under the same key.
const LEGACY_SESSION_KEY = "st_attribution";
// The three keys ShipTime's own main.js writes, reads at signup, and clears on
// success — copied from their source, so both sites use the same names. We keep
// STORE_KEY alongside them because these three don't carry utm_term,
// utm_content or gclid, which the CRM lead wants.
const ST_KEYS = {
  utm_source: "st_utm_source",
  utm_medium: "st_utm_medium",
  utm_campaign: "st_utm_campaign",
} as const;

// Read UTMs (+ gclid) from the current URL.
function utmFromUrl(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"]) {
    const v = p.get(k);
    if (v) out[k] = v;
  }
  return out;
}

// Persist the campaign that brought this visitor here.
//
// A URL carrying UTMs is a fresh campaign touch and replaces what's stored —
// with a persistent store, "first touch always wins" would credit a click on
// this month's ad to an ad from months ago. Internal navigation and direct
// return visits carry no UTMs, so they leave the stored value untouched.
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const utm = utmFromUrl();
  if (!Object.keys(utm).length) return;
  try {
    for (const [param, key] of Object.entries(ST_KEYS)) {
      if (utm[param]) localStorage.setItem(key, utm[param]);
    }
    localStorage.setItem(STORE_KEY, JSON.stringify({ ...utm, ts: new Date().toISOString() }));
  } catch {
    /* storage unavailable (private mode) — readAttribution falls back to the live URL */
  }
}

// Called after a successful ShipTime signup: the campaign has done its job, so
// the stored triple is dropped rather than being reused for a later, unrelated
// conversion. ShipTime's own pages clear it at exactly this point.
export function clearAttribution() {
  if (typeof window === "undefined") return;
  try {
    for (const key of Object.values(ST_KEYS)) localStorage.removeItem(key);
    localStorage.removeItem(STORE_KEY);
    sessionStorage.removeItem(LEGACY_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

// Resolve attribution at submit time: the live URL if this load carries UTMs,
// otherwise whatever the last campaign touch stored.
// Normalize source/medium to the canonical vocabulary so Metabase can group.
// Page slug for on-site conversions, e.g. "/vs/freightcom" -> "vs_freightcom",
// "/alternative/shipstation" -> "alternative_shipstation", "/" -> "home".
function pageCampaign(): string {
  if (typeof window === "undefined") return "site";
  const seg = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return seg ? seg.replace(/[/-]+/g, "_").toLowerCase() : "home";
}

export function readAttribution(
  opts: {
    /**
     * Campaign to use when the visit carries none. Lets a page supply something
     * more specific than its own slug — e.g. the Grommet lander distinguishing
     * its Product-of-the-Week offer from the standard one. A real inbound
     * utm_campaign always wins over this.
     */
    fallbackCampaign?: string;
  } = {},
): Record<string, string> {
  if (typeof window === "undefined") return {};
  let stored: Record<string, string> = {};
  try {
    stored = JSON.parse(
      localStorage.getItem(STORE_KEY) || sessionStorage.getItem(LEGACY_SESSION_KEY) || "{}",
    );
  } catch {
    /* ignore */
  }
  // `ts` is bookkeeping for the store, not a lead property — don't forward it.
  delete stored.ts;
  // Fall back to ShipTime's individual keys for anything the blob is missing, so
  // attribution written by their script (or left behind by an older visit)
  // still counts.
  try {
    for (const [param, key] of Object.entries(ST_KEYS)) {
      if (!stored[param]) {
        const v = localStorage.getItem(key);
        if (v) stored[param] = v;
      }
    }
  } catch {
    /* ignore */
  }
  // The live URL wins over the store: if this page load carries UTMs it *is*
  // the current touch (and the writer has already replaced the stored copy with
  // it). The store only fills in when the URL has nothing.
  const merged = { ...stored, ...utmFromUrl() };
  // On-site fallback: a visitor with no inbound campaign who clicks a lead
  // trigger is a "website" conversion per the UTM guideline — attribute it to
  // ShipTime, medium "website", campaign = the page they converted on.
  if (!merged.utm_source) {
    merged.utm_source = "shiptime";
    merged.utm_medium = "website";
  }
  if (!merged.utm_campaign) {
    merged.utm_campaign = opts.fallbackCampaign || pageCampaign();
  }
  return merged;
}

// The same attribution, renamed for the ShipTime Signup API — it takes the
// triple as source / medium / campaign, not utm_*. Sending it means the campaign
// is recorded on the ShipTime account itself, not just on our CRM contact.
export function signupAttribution(
  opts: { fallbackCampaign?: string } = {},
): { source: string; medium: string; campaign: string } {
  const a = readAttribution(opts);
  return {
    source: a.utm_source ?? "",
    medium: a.utm_medium ?? "",
    campaign: a.utm_campaign ?? "",
  };
}

// ── Conversion tracking ───────────────────────────────────────────────────────
// Without this the ad platforms only ever see clicks, so Google Ads Smart
// Bidding can't optimise toward leads and Meta can't build lookalikes. Fires
// three separate signals on a successful submit:
//
//   gtag('event','generate_lead')  → GA4 direct (GA4 is installed via gtag)
//   fbq('track','Lead')            → Meta standard Lead event
//   dataLayer.push('lead_submitted') → a distinctly-named event for GTM, so
//     whoever manages Google Ads can attach the AW- conversion tag in the
//     container without another code change. Named differently from the GA4
//     event on purpose, so the two can't be confused for each other.
//
// All calls are guarded — a blocked or absent tracker must never break the form.
type Win = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  _hsq?: unknown[];
};

export function trackLeadConversion(detail: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Win;
  try {
    w.gtag?.("event", "generate_lead", { ...detail });
  } catch { /* ignore */ }
  try {
    w.fbq?.("track", "Lead");
  } catch { /* ignore */ }
  try {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "lead_submitted", ...detail });
  } catch { /* ignore */ }
}

// A completed account creation, not just an enquiry — a distinct and much
// stronger conversion than generate_lead, so it gets its own event names rather
// than being folded into the lead signal. Same guarded, fail-soft style.
export function trackSignupConversion(detail: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Win;
  try {
    w.gtag?.("event", "sign_up", { method: "shiptime", ...detail });
  } catch { /* ignore */ }
  try {
    w.fbq?.("track", "CompleteRegistration");
  } catch { /* ignore */ }
  try {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "shiptime_signup", ...detail });
  } catch { /* ignore */ }
}

// ── Lead durability ──────────────────────────────────────────────────────────
// The requirement is that a name and email typed into step 1 reaches us even if
// the visitor never answers another question and never opens an account. Step 1
// already POSTs to /api/lead, so the happy path was covered — but three things
// could swallow a lead silently, and all three are handled here.
//
//  1. HubSpot rejects the write. /api/lead is deliberately fail-soft: it answers
//     `{ ok: true, saved: false }` so a CRM outage never blocks a visitor. The
//     forms only read `ok`, which meant a bad token or a HubSpot incident looked
//     exactly like success and nothing ever retried. `saved === false` is now
//     treated as a failure worth re-sending.
//  2. The network drops, or the visitor closes the tab mid-request. `keepalive`
//     lets an in-flight POST outlive the page, and anything that still fails is
//     queued.
//  3. Nothing recovers a queued lead. Any later page view flushes the queue, so
//     a lead lost to a flaky café connection lands the next time they visit.
//
// Re-sending is safe: the route creates the contact and falls back to PATCH by
// email on 409, so the same payload twice is an update, not a duplicate.
const OUTBOX_KEY = "st_lead_outbox";
const OUTBOX_MAX = 20;
const OUTBOX_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // a fortnight

type OutboxEntry = { payload: Record<string, unknown>; ts: number; tries: number };

function readOutbox(): OutboxEntry[] {
  try {
    const raw = localStorage.getItem(OUTBOX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OutboxEntry[]) : [];
  } catch {
    return [];
  }
}

function writeOutbox(entries: OutboxEntry[]) {
  try {
    if (!entries.length) localStorage.removeItem(OUTBOX_KEY);
    else localStorage.setItem(OUTBOX_KEY, JSON.stringify(entries.slice(-OUTBOX_MAX)));
  } catch {
    /* private mode — nothing more we can do */
  }
}

function enqueueLead(payload: Record<string, unknown>) {
  const email = String(payload.email ?? "").toLowerCase();
  const rest = readOutbox().filter((e) => String(e.payload?.email ?? "").toLowerCase() !== email);
  writeOutbox([...rest, { payload, ts: Date.now(), tries: 0 }]);
}

// One POST attempt. Returns true only when the CRM confirms it stored the lead.
async function postLead(payload: Record<string, unknown>): Promise<boolean> {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    // Survives the page being closed or navigated away from mid-flight.
    keepalive: true,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.ok === false) return false;
  // The stub response (HubSpot not configured, i.e. local dev) has no `saved`
  // field. Treat only an explicit `saved: false` as a failure so dev still works.
  return data?.saved !== false;
}

// Collapses the stampede. A comparison page renders one lead button per CTA —
// eight on /vs/freightcom — and every one of them calls this on mount in the same
// commit. Without a guard that's eight identical POSTs per page load: harmless to
// the CRM (the route updates by email rather than duplicating) but a pointless way
// to spend a rate limit we're specifically trying not to hit.
let flushInFlight: Promise<void> | null = null;

// Retries anything queued by an earlier visit. Safe to call on every mount:
// concurrent callers share one pass, it's a no-op when the queue is empty, and
// it never throws.
export function flushLeadOutbox(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (flushInFlight) return flushInFlight;
  flushInFlight = runFlush().finally(() => {
    flushInFlight = null;
  });
  return flushInFlight;
}

async function runFlush(): Promise<void> {
  const queued = readOutbox();
  if (!queued.length) return;

  const fresh = queued.filter((e) => Date.now() - (e.ts ?? 0) < OUTBOX_MAX_AGE_MS && e.tries < 8);
  const kept: OutboxEntry[] = [];
  for (const entry of fresh) {
    let ok = false;
    try {
      ok = await postLead(entry.payload);
    } catch {
      ok = false;
    }
    if (!ok) kept.push({ ...entry, tries: (entry.tries ?? 0) + 1 });
  }
  writeOutbox(kept);
}

// A second, independent route to the same contact record.
//
// /api/lead writes server-side with HUBSPOT_TOKEN. If that token is ever revoked
// or rotated, every one of those writes fails at once — the single point of
// failure the outbox above can queue against but not replace. HubSpot's own
// tracking script is already loaded on these pages and carries its own portal
// auth, so pushing an identify through it reaches HubSpot by a path that shares
// nothing with the token: different transport, different credential.
//
// identify only takes effect on the next tracked hit, hence the trackPageView.
// Guarded and fail-soft like the rest — this is insurance, never the primary.
export function identifyLead(fields: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!fields.email) return;
  try {
    const w = window as Win;
    w._hsq = w._hsq || [];
    w._hsq.push(["identify", fields]);
    w._hsq.push(["trackPageView"]);
  } catch {
    /* ignore — the server-side write is the primary path */
  }
}

export async function submitLead(payload: Record<string, unknown>) {
  // Posts to the shared lead sink (/api/lead → HubSpot). In dev, before the
  // HUBSPOT_* env vars are set, the route accepts and echoes so the form still
  // works end-to-end.
  //
  // Two attempts, then the queue. Callers already treat a throw as non-fatal, so
  // the visitor is never blocked either way — the difference is that the lead is
  // now recoverable instead of gone.
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (await postLead(payload)) return { ok: true, saved: true };
    } catch (e) {
      lastErr = e;
    }
    if (attempt === 0) await new Promise((r) => setTimeout(r, 600));
  }
  enqueueLead(payload);
  throw new Error(lastErr ? String(lastErr) : "lead_submit_unconfirmed");
}

function LeadCaptureModal({ source, onClose }: { source: string; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [volumes, setVolumes] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  // Slide-in on mount; slide-out before unmount. On mobile the panel is docked
  // to the bottom (translateY relative to its own height = fully offscreen),
  // so it rises like a native bottom sheet; on desktop it's centered and the
  // same transform makes it lift gently into place.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  function close() {
    setShown(false);
    setTimeout(onClose, 240);
  }

  // Step 1 — capture the core contact and push immediately, so the lead is
  // saved even if they abandon the enrichment questions. Then advance to step 2.
  async function submitStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    setStatus("loading");
    const parts = name.trim().split(/\s+/);
    const lead = {
      email: email.trim(),
      firstname: parts[0],
      ...(parts.length > 1 ? { lastname: parts.slice(1).join(" ") } : {}),
      ...(company.trim() ? { company: company.trim() } : {}),
      lead_source: source,
      ...readAttribution(),
    };
    // Independent of the token-based write below — see identifyLead.
    identifyLead(lead);
    try {
      await submitLead(lead);
    } catch {
      /* fail-soft: still advance. submitLead has retried and queued the payload,
         so the lead is recoverable on any later page view. */
    }
    // Fire once, here — step 1 is where the lead is actually captured. Firing
    // again on step 2 would double-count the conversion in Ads and GA4.
    const attr = readAttribution();
    trackLeadConversion({
      lead_source: source,
      utm_source: attr.utm_source,
      utm_campaign: attr.utm_campaign,
    });
    setStatus("idle");
    setStep(2);
  }

  // Step 2 — enrich the same contact (matched by email) with the qualifying
  // answers, then show the confirmation.
  async function submitStep2(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const answeredVolumes = Object.fromEntries(
      Object.entries(volumes).filter(([, v]) => v),
    );
    try {
      await submitLead({
        email: email.trim(),
        ...(industry ? { shipping_industry: industry } : {}),
        ...answeredVolumes,
        ...readAttribution(),
      });
    } catch {
      /* fail-soft: the contact is already captured from step 1 */
    }
    setStatus("done");
  }

  // Rendered into document.body via a portal so it escapes any ancestor that
  // creates a containing block for fixed elements (the nav's backdrop-filter,
  // scroll-reveal transforms, etc.) — otherwise the sheet anchors to that
  // ancestor instead of the viewport and clips at the top of the page.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:px-5"
      style={{ background: "rgba(28,30,61,0.45)", opacity: shown ? 1 : 0, transition: "opacity 0.24s ease" }}
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full rounded-t-[26px] sm:rounded-[24px] flex flex-col${
          status === "done" ? "" : " sm:grid sm:grid-cols-[1.08fr_1fr]"
        }`}
        style={{
          maxWidth: 920,
          maxHeight: "94vh",
          overflowX: "hidden",
          overflowY: "auto",
          background: ds.white,
          boxShadow: "0 -12px 70px rgba(28,30,61,0.45)",
          transform: shown ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.34s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* Close (white icon over navy on mobile top / grey over white on desktop) */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute z-20 flex items-center justify-center transition-opacity opacity-80 hover:opacity-100 text-white sm:text-[#9AA0B0]"
          style={{ top: 14, right: 14, width: 34, height: 34, borderRadius: "50%" }}
        >
          <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* ── LEFT: brand / value (navy) — hidden on the success screen so the
             embedded calendar gets the full modal width ── */}
        <div
          className={`relative flex-col gap-7 px-7 pt-7 pb-9 sm:px-11 sm:py-12 ${status === "done" ? "hidden" : "flex"}`}
          style={{ background: ds.navy }}
        >
          {/* drag handle (mobile) */}
          <div className="sm:hidden absolute left-0 right-0 top-0 flex justify-center pt-3">
            <span style={{ width: 40, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.4)" }} />
          </div>

          <div className="mt-3 sm:mt-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: ds.orange, ...sora }}>Ship smarter</p>
            <h2 style={{ ...sora, fontWeight: 800, fontSize: "clamp(1.7rem, 4.5vw, 2.4rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: ds.white }}>
              Let&rsquo;s talk shipping.
            </h2>
            <p className="mt-4" style={{ ...inter, fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.78)" }}>
              No account to create, no call to book — leave your email and a real person from our Canada-based team will reach out.
            </p>
          </div>

          <ul className="flex flex-col gap-3.5">
            {["No platform fee, ever", "Bring your own courier rates", "A real support team, based in Canada"].map((b) => (
              <li key={b} className="flex items-center gap-3">
                <span className="flex items-center justify-center flex-shrink-0" style={{ width: 22, height: 22, borderRadius: 999, background: ds.orange }}>
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4.5l3.2 3.2L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span style={{ ...inter, fontSize: 14.5, color: "rgba(255,255,255,0.92)" }}>{b}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 mt-auto pt-2">
            <div className="flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={ds.orange}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span style={{ ...inter, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
              <strong style={{ color: ds.white }}>500+</strong> businesses shipping smarter
            </span>
          </div>
        </div>

        {/* ── RIGHT: form (white) ── */}
        <div
          className="flex flex-col justify-center px-7 py-9 sm:px-11 sm:py-12"
          style={{ background: ds.white, paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 36px)" }}
        >
          {status === "done" ? (
            <div className="py-1">
              {/* Compact confirmation — the lead is already saved, so the
                  calendar below is a pure accelerator, never a gate. */}
              <div className="flex items-start gap-4">
                <span className="flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, borderRadius: "50%", background: "#EAF7EE" }}>
                  <Icon.Check size={22} style={{ stroke: "#3FA864" }} />
                </span>
                <div>
                  <h3 className="mb-1.5" style={{ ...sora, fontWeight: 800, fontSize: 21, color: ds.navy, letterSpacing: "-0.01em" }}>You&rsquo;re all set</h3>
                  <p style={{ ...inter, fontSize: 14.5, color: "#52566C", lineHeight: 1.6 }}>
                    We&rsquo;ll reach out to <strong style={{ color: ds.navy }}>{email}</strong> — usually within one business day.
                  </p>
                </div>
              </div>

              {CALENDAR_EMBED && (
                <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${ds.border}` }}>
                  <p className="mb-1" style={{ ...sora, fontWeight: 700, fontSize: 16, color: ds.navy }}>
                    Don&rsquo;t want to wait? Pick a time.
                  </p>
                  <p className="mb-4" style={{ ...inter, fontSize: 14, color: "#52566C", lineHeight: 1.6 }}>
                    Grab a slot that suits you and we&rsquo;ll talk it through.
                  </p>
                  <iframe
                    src={CALENDAR_EMBED}
                    title="Book a time with ShipTime"
                    className="w-full"
                    style={{ border: 0, minHeight: 660, borderRadius: 12 }}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          ) : step === 1 ? (
            <>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ ...sora, color: ds.orange }}>Step 1 of 2</p>
              <h3 className="mb-2" style={{ ...sora, fontWeight: 800, fontSize: 22, color: ds.navy, letterSpacing: "-0.01em" }}>
                Let&rsquo;s get started
              </h3>
              <p className="mb-6" style={{ ...inter, fontSize: 14.5, color: "#52566C", lineHeight: 1.6 }}>
                Tell us who you are and we&rsquo;ll take it from there.
              </p>
              <form onSubmit={submitStep1} className="flex flex-col gap-3">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-base outline-none transition-colors focus:border-[#EC5A26]"
                  style={{ ...inter, borderRadius: 10, border: `1.5px solid ${ds.border}`, color: ds.navy }}
                />
                <input
                  type="email"
                  required
                  placeholder="Work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-base outline-none transition-colors focus:border-[#EC5A26]"
                  style={{ ...inter, borderRadius: 10, border: `1.5px solid ${ds.border}`, color: ds.navy }}
                />
                <input
                  type="text"
                  required
                  placeholder="Company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 text-base outline-none transition-colors focus:border-[#EC5A26]"
                  style={{ ...inter, borderRadius: 10, border: `1.5px solid ${ds.border}`, color: ds.navy }}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full text-white text-sm font-semibold py-3.5 mt-1 transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: ds.orange, borderRadius: 999, ...sora }}
                >
                  {status === "loading" ? "Saving…" : "Continue"}
                </button>
              </form>
              <p className="mt-3" style={{ ...inter, fontSize: 12, color: "#8A8FA3", lineHeight: 1.5 }}>
                No spam, no sales pressure. We&rsquo;ll reach out within one business day.
              </p>
            </>
          ) : (
            <>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ ...sora, color: ds.orange }}>Step 2 of 2</p>
              <h3 className="mb-2" style={{ ...sora, fontWeight: 800, fontSize: 22, color: ds.navy, letterSpacing: "-0.01em" }}>
                A couple more details
              </h3>
              <p className="mb-6" style={{ ...inter, fontSize: 14.5, color: "#52566C", lineHeight: 1.6 }}>
                This helps us point you to the right savings — optional, but it speeds things up.
              </p>
              <form onSubmit={submitStep2} className="flex flex-col gap-4">
                {/* Industry */}
                <label className="flex flex-col gap-1.5">
                  <span style={{ ...inter, fontSize: 12.5, fontWeight: 600, color: "#52566C" }}>What industry are you in?</span>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-3 text-sm outline-none transition-colors focus:border-[#EC5A26]"
                    style={{ ...inter, borderRadius: 10, border: `1.5px solid ${ds.border}`, color: industry ? ds.navy : "#9AA0B0", background: ds.white }}
                  >
                    <option value="">Select an industry…</option>
                    {INDUSTRIES.map((o) => <option key={o} value={o} style={{ color: ds.navy }}>{o}</option>)}
                  </select>
                </label>

                {/* Volume by mode */}
                <div className="flex flex-col gap-2.5">
                  <span style={{ ...inter, fontSize: 12.5, fontWeight: 600, color: "#52566C" }}>Roughly how many shipments a month?</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {MODES.map((m) => (
                      <label key={m.key} className="flex flex-col gap-1">
                        <span style={{ ...inter, fontSize: 12, color: "#8A8FA3" }}>{m.label}</span>
                        <select
                          value={volumes[m.key] ?? ""}
                          onChange={(e) => setVolumes((v) => ({ ...v, [m.key]: e.target.value }))}
                          className="w-full px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#EC5A26]"
                          style={{ ...inter, borderRadius: 10, border: `1.5px solid ${ds.border}`, color: volumes[m.key] ? ds.navy : "#9AA0B0", background: ds.white }}
                        >
                          <option value="">—</option>
                          {VOLUMES.map((o) => <option key={o} value={o} style={{ color: ds.navy }}>{o}</option>)}
                        </select>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full text-white text-sm font-semibold py-3.5 mt-1 transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: ds.orange, borderRadius: 999, ...sora }}
                >
                  {status === "loading" ? "Sending…" : "Get in touch"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

// Drop-in replacement for the old external signup <a>. Renders the same kind
// of button (pass className/style like before) and opens the modal on click.
export function LeadCaptureButton({
  source,
  children,
  className,
  style,
}: {
  source: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  // Runs on first paint of any page with a lead button (nav is always present),
  // so first-touch UTMs are captured on landing before the visitor converts.
  // Same mount is the natural place to retry unconfirmed leads: this button is
  // on every page, so any later visit anywhere on the site drains the queue.
  useEffect(() => {
    captureAttribution();
    void flushLeadOutbox();
  }, []);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} style={style}>
        {children}
      </button>
      {open && <LeadCaptureModal source={source} onClose={() => setOpen(false)} />}
    </>
  );
}
