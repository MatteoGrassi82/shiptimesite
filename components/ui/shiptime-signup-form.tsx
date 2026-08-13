"use client";

// Real ShipTime account creation, inline on a landing page.
//
// Until now every "sign up" on these pages was an outbound link to
// shiptime.com or app.shiptime.com. This creates the account here and then
// forwards the browser to the URL the API returns, which carries a token that
// logs the new account straight into the app — so the visitor goes from landing
// page to a working dashboard without a second form.
//
// All the API knowledge lives behind /api/signup (see lib/shiptime-api.ts).
// This component only handles input, validation feedback, and the handoff.

import { useId, useState } from "react";

import {
  clearAttribution,
  readAttribution,
  submitLead,
  trackSignupConversion,
} from "@/components/ui/lead-capture-form";
import {
  PASSWORD_HINT,
  validateCredentials,
  type FieldErrors,
  type Language,
  type SignupResult,
} from "@/lib/shiptime-signup";

const ds = {
  navy: "#1C1E3D",
  muted: "#52566C",
  orange: "#EC5A26",
  border: "#E8E8E8",
  danger: "#C0392B",
  white: "#FFFFFF",
};
const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };

export type ShipTimeSignupFormProps = {
  /**
   * Affiliation slug for co-branding, e.g. "grommet" — sent as
   * membership_type: "ship-grommet". Must be registered in ShipTime's database
   * first (ping David), or the account is created without the co-branding.
   */
  affiliation?: string;
  /** Locale the ShipTime app should load in for this user. */
  language?: Language;
  /** Value recorded on the CRM contact, so signups are attributable by page. */
  leadSource: string;
  /** Ask for name and company. Off by default — fewer fields, more signups. */
  collectProfile?: boolean;
  /** Label on the submit button. */
  ctaLabel?: string;
  /** Extra properties for the CRM write (e.g. partner_source). */
  leadFields?: Record<string, string>;
  /**
   * Pre-fill the email. For pages that already captured it earlier in the flow —
   * making someone retype an address they just gave you costs signups.
   */
  initialEmail?: string;
  /**
   * Campaign to report when the visitor arrived without a utm_campaign.
   *
   * A stored or in-URL campaign always wins — this only fills the gap. It exists
   * because a page can know something about the campaign that the URL doesn't:
   * the Grommet lander serves two offers (standard vs Product of the Week) whose
   * rewards are issued differently, and that used to be encoded in the outbound
   * signup link. Without this, direct arrivals would report no campaign at all.
   */
  campaignFallback?: string;
};

export function ShipTimeSignupForm({
  affiliation,
  language = "en",
  leadSource,
  collectProfile = false,
  ctaLabel = "Create my free account",
  leadFields,
  initialEmail = "",
  campaignFallback,
}: ShipTimeSignupFormProps) {
  // Field ids are namespaced per instance. A page can legitimately render this
  // form more than once (an offer block plus a footer CTA), and duplicate DOM
  // ids would silently break every label and aria-describedby association.
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<{ message: string; loginUrl?: string } | null>(null);
  // "redirecting" is its own state so the button never flips back to idle while
  // the browser is on its way to the app.
  const [status, setStatus] = useState<"idle" | "submitting" | "redirecting">("idle");

  // Ask the API whether this email already has an account as soon as they leave
  // the field, so an existing customer isn't sent off to invent a password
  // before being told. /api/signup re-checks server-side regardless.
  async function checkEmailOnBlur() {
    const value = email.trim();
    if (!value || errors.email) return;
    try {
      const res = await fetch("/api/signup/check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: value, language }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        exists?: boolean | null;
        loginUrl?: string;
      };
      if (data.ok && data.exists === true) {
        setFormError({
          message: "You already have a ShipTime account with that email.",
          loginUrl: data.loginUrl,
        });
      }
    } catch {
      /* inconclusive — stay quiet and let submit decide */
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    // Same regexes the API enforces, so a bad value is an inline message here
    // rather than an opaque 400 from upstream.
    const fieldErrors = validateCredentials({ email, password, confirm });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setStatus("submitting");
    const parts = name.trim().split(/\s+/).filter(Boolean);
    // Resolved once, then expressed in both vocabularies, so the CRM write can't
    // disagree with what the ShipTime account recorded. The lead sink stores
    // utm_* property names (and also wants utm_term / utm_content / gclid); the
    // ShipTime API takes the triple as source / medium / campaign.
    const leadAttribution = readAttribution({ fallbackCampaign: campaignFallback });
    const apiAttribution = {
      source: leadAttribution.utm_source ?? "",
      medium: leadAttribution.utm_medium ?? "",
      campaign: leadAttribution.utm_campaign ?? "",
    };

    let result: SignupResult;
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          language,
          affiliation,
          ...(parts.length ? { firstname: parts[0] } : {}),
          ...(parts.length > 1 ? { lastname: parts.slice(1).join(" ") } : {}),
          ...(company.trim() ? { company: company.trim() } : {}),
          ...apiAttribution,
        }),
      });
      result = (await res.json()) as SignupResult;
    } catch {
      setStatus("idle");
      setFormError({ message: "Something went wrong reaching ShipTime. Please try again." });
      return;
    }

    if (!result.ok) {
      setStatus("idle");
      if (result.fields) setErrors(result.fields);
      setFormError({ message: result.message, loginUrl: result.loginUrl });
      return;
    }

    // Account exists upstream from here on — everything below is best-effort and
    // must never stand between the visitor and their new dashboard.
    setStatus("redirecting");
    trackSignupConversion({ lead_source: leadSource, affiliation, ...leadFields });
    try {
      await submitLead({
        email: email.trim(),
        ...(parts.length ? { firstname: parts[0] } : {}),
        ...(parts.length > 1 ? { lastname: parts.slice(1).join(" ") } : {}),
        ...(company.trim() ? { company: company.trim() } : {}),
        lead_source: leadSource,
        ...leadFields,
        ...leadAttribution,
      });
    } catch {
      /* the ShipTime account is created; a missed CRM write isn't worth blocking on */
    }
    // The campaign has converted — drop it so it can't be credited again later.
    clearAttribution();
    window.location.assign(result.url);
  }

  const inputStyle = (invalid?: string): React.CSSProperties => ({
    ...inter,
    width: "100%",
    borderRadius: 11,
    border: `1.5px solid ${invalid ? ds.danger : ds.border}`,
    padding: "14px 15px",
    fontSize: 16, // 16px keeps iOS from zooming the page on focus
    color: ds.navy,
    background: ds.white,
    outline: "none",
  });
  const labelStyle: React.CSSProperties = {
    ...inter,
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: ds.muted,
    marginBottom: 6,
  };
  const errorStyle: React.CSSProperties = {
    ...inter,
    margin: "6px 0 0",
    fontSize: 12.5,
    lineHeight: 1.45,
    color: ds.danger,
  };

  const busy = status !== "idle";

  return (
    <form onSubmit={onSubmit} noValidate>
      {collectProfile && (
        <>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle} htmlFor={id("name")}>Name</label>
            <input
              id={id("name")}
              style={inputStyle()}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Your name"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle} htmlFor={id("company")}>Company</label>
            <input
              id={id("company")}
              style={inputStyle()}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              autoComplete="organization"
              placeholder="Your business name"
            />
          </div>
        </>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle} htmlFor={id("email")}>Email</label>
        <input
          id={id("email")}
          type="email"
          style={inputStyle(errors.email)}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: undefined }));
            setFormError(null);
          }}
          onBlur={checkEmailOnBlur}
          autoComplete="email"
          placeholder="you@yourbusiness.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? id("email-error") : undefined}
        />
        {errors.email && <p id={id("email-error")} style={errorStyle}>{errors.email}</p>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle} htmlFor={id("password")}>Password</label>
        <input
          id={id("password")}
          type="password"
          style={inputStyle(errors.password)}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={id("password-hint")}
        />
        {/* Always visible, not only after a failure — the rules are strict enough
            that showing them up front saves a round trip. */}
        <p
          id={id("password-hint")}
          style={{ ...errorStyle, color: errors.password ? ds.danger : "#8A8FA3" }}
        >
          {PASSWORD_HINT}
        </p>
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle} htmlFor={id("confirm")}>Confirm password</label>
        <input
          id={id("confirm")}
          type="password"
          style={inputStyle(errors.confirm)}
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setErrors((prev) => ({ ...prev, confirm: undefined }));
          }}
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirm)}
          aria-describedby={errors.confirm ? id("confirm-error") : undefined}
        />
        {errors.confirm && <p id={id("confirm-error")} style={errorStyle}>{errors.confirm}</p>}
      </div>

      {formError && (
        <div
          role="alert"
          style={{
            ...inter,
            marginBottom: 18,
            padding: "12px 14px",
            borderRadius: 10,
            background: "#FDF0EE",
            border: `1px solid #F3C9C2`,
            fontSize: 13.5,
            lineHeight: 1.55,
            color: "#8E2E22",
          }}
        >
          {formError.message}
          {formError.loginUrl && (
            <>
              {" "}
              <a
                href={formError.loginUrl}
                style={{ color: ds.orange, fontWeight: 600, textDecoration: "underline" }}
              >
                Sign in instead
              </a>
              .
            </>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        style={{
          ...sora,
          width: "100%",
          background: ds.orange,
          color: ds.white,
          border: 0,
          borderRadius: 999,
          padding: "16px 24px",
          fontSize: 15.5,
          fontWeight: 700,
          cursor: busy ? "default" : "pointer",
          opacity: busy ? 0.6 : 1,
          boxShadow: "0 6px 22px rgba(236,90,38,0.32)",
        }}
      >
        {status === "submitting"
          ? "Creating your account…"
          : status === "redirecting"
            ? "Taking you to ShipTime…"
            : ctaLabel}
      </button>

      <p style={{ ...inter, margin: "13px 0 0", fontSize: 12.5, color: "#8A8FA3", textAlign: "center", lineHeight: 1.5 }}>
        No platform fee, no contract. By creating an account you agree to ShipTime&rsquo;s{" "}
        <a href="https://shiptime.com/terms-of-service/" target="_blank" rel="noopener noreferrer" style={{ color: ds.muted, textDecoration: "underline" }}>
          terms
        </a>
        .
      </p>
    </form>
  );
}
