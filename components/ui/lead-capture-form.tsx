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
const SS_KEY = "st_attribution";

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

// Store first-touch attribution once, so it survives internal navigation before
// the visitor converts (first ad click wins; we don't overwrite it).
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const utm = utmFromUrl();
  try {
    if (Object.keys(utm).length && !sessionStorage.getItem(SS_KEY)) {
      sessionStorage.setItem(SS_KEY, JSON.stringify(utm));
    }
  } catch {
    /* sessionStorage unavailable (private mode) — fall back to live URL */
  }
}

// Resolve attribution at submit time: first-touch if stored, else the live URL.
// Normalize source/medium to the canonical vocabulary so Metabase can group.
// Page slug for on-site conversions, e.g. "/vs/freightcom" -> "vs_freightcom",
// "/alternative/shipstation" -> "alternative_shipstation", "/" -> "home".
function pageCampaign(): string {
  if (typeof window === "undefined") return "site";
  const seg = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return seg ? seg.replace(/[/-]+/g, "_").toLowerCase() : "home";
}

export function readAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  let stored: Record<string, string> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(SS_KEY) || "{}");
  } catch {
    /* ignore */
  }
  // First-touch (stored) wins over the live URL; values pass through verbatim.
  const merged = { ...utmFromUrl(), ...stored };
  // On-site fallback: a visitor with no inbound campaign who clicks a lead
  // trigger is a "website" conversion per the UTM guideline — attribute it to
  // ShipTime, medium "website", campaign = the page they converted on.
  if (!merged.utm_source) {
    merged.utm_source = "shiptime";
    merged.utm_medium = "website";
    merged.utm_campaign = pageCampaign();
  }
  return merged;
}

export async function submitLead(payload: Record<string, unknown>) {
  // Posts to the shared lead sink (/api/lead → HubSpot). In dev, before the
  // HUBSPOT_* env vars are set, the route accepts and echoes so the form still
  // works end-to-end.
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error ? String(data.error) : "lead_submit_failed");
  }
  return data;
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
    try {
      await submitLead({
        email: email.trim(),
        firstname: parts[0],
        ...(parts.length > 1 ? { lastname: parts.slice(1).join(" ") } : {}),
        ...(company.trim() ? { company: company.trim() } : {}),
        lead_source: source,
        ...readAttribution(),
      });
    } catch {
      /* fail-soft: still advance — we'll retry the write on step 2 */
    }
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
  useEffect(() => {
    captureAttribution();
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
