// ShipTime Signup API — shared contract (client-safe).
//
// Source of truth: "ShipTime Signup API" technical reference from David Scott
// (2026-08-12), which was written from the two real front-end files
// (getconfig.php + the main signup JS) that shiptime.com runs, plus the call
// recording of the same date. Nothing here is invented API surface — where the
// reference is silent, the code says so rather than guessing.
//
// This file holds only the pure, environment-free parts (regexes, affiliation
// map, payload builders) so both the browser form and the server route can
// import it. Base-URL resolution and the actual network calls live in
// lib/shiptime-api.ts, which is server-only.

export type Language = "en" | "fr";

// ── Fixed payload values ─────────────────────────────────────────────────────
// `brand` is the product/version brand and is "V3" for every signup made from a
// web page — NOT the affiliation. The affiliation ("ship-grommet") travels in
// `membership_type`; see AFFILIATIONS below.
export const BRAND = "V3";
export const CHANNEL = "Web";
// Every non-social signup is a local account. Google/Facebook would need our
// custom domain added to ShipTime's OAuth allow-list first (David, 2026-08-12),
// so there is no social path here on purpose.
export const AUTH_PROVIDER_LOCAL = "LOCAL";
// Fixed GUID the shiptime.com client sends on every /contacts call. Not a
// secret and not per-tenant — it identifies the signup client to the API.
export const CONTACTS_GUID = "2c711e00-e3dc-411b-8d69-727955cc13a4";

// ── Validation ───────────────────────────────────────────────────────────────
// These exist so we never hand the API a value it will reject: a client-side
// failure is a friendly inline message, a server-side one is an opaque 400.
//
// EMAIL_RE is copied character-for-character from ShipTime's main.js
// (`function isEmail`, line 115), read off the screen share in the 2026-08-12
// recording. Do not "improve" it: it is deliberately the same expression the
// API's own client uses, so anything this accepts, the API accepts. Note it
// permits digits in the final suffix and rejects the rarer RFC-legal local-part
// characters (!#$%&'*/=?^`{|}~) — that's their rule, not an oversight here.
export const EMAIL_RE =
  /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

// PASSWORD_RE reproduces the live shiptime.com rules exactly. Their client
// doesn't use one regex — it runs five discrete checks (length 10, length 30,
// symbol, number, uppercase, lowercase), each with its own error row. This is
// the same set folded into one expression:
//
//   length 10-30   passwordVal.length < 10  /  > 30
//   symbol         /[!@#$%^&*(),.?":{}|<>]/
//   number         /[0-9]/
//   uppercase      /[A-Z]/
//   lowercase      /[a-z]/
//
// The symbol class is the important part and is NOT "any non-alphanumeric": it
// excludes - _ + = [ ] ; ' / \ ~ and backtick. A password whose only special
// character is a hyphen ("my-password-1A") is accepted by a naive
// [^A-Za-z0-9] check and refused by ShipTime, so keep this list exact.
export const SPECIAL_CHARS = /[!@#$%^&*(),.?":{}|<>]/;

export const PASSWORD_RE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{10,30}$/;

// Names the accepted symbols rather than saying "a special character" — with a
// restricted set, a vague hint leaves someone guessing why a password they think
// is strong keeps getting rejected.
export const PASSWORD_HINT =
  '10–30 characters, with an uppercase and a lowercase letter, a number, and one of ! @ # $ % ^ & * ( ) , . ? " : { } | < >';

export type FieldErrors = Partial<Record<"email" | "password" | "confirm", string>>;

/** Validate exactly what the API will see, before it sees it. */
export function validateCredentials(input: {
  email: string;
  password: string;
  confirm?: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  const email = input.email.trim();

  if (!email) errors.email = "Enter your email address.";
  else if (!EMAIL_RE.test(email)) errors.email = "That doesn't look like a valid email address.";

  if (!input.password) errors.password = "Choose a password.";
  else if (!PASSWORD_RE.test(input.password)) errors.password = PASSWORD_HINT;

  // Confirmation is UI-only — it is never sent to the API.
  if (input.confirm !== undefined && input.confirm !== input.password) {
    errors.confirm = "Passwords don't match.";
  }

  return errors;
}

// ── Affiliations ─────────────────────────────────────────────────────────────
// An affiliation co-brands the ShipTime app the account lands in (logo, support
// numbers, white-label). The naming convention is always `ship-<brand>`.
//
// Two things to know before adding one:
//  1. ShipTime has to register it in their database and redeploy before it
//     works — ping David for any new affiliation (his words, 2026-08-12). An
//     unregistered value doesn't co-brand; it may just be ignored.
//  2. `configured: false` marks an affiliation we intend to use but which David
//     hasn't confirmed as live yet. The API call still sends it (harmless if
//     unknown), and /api/signup logs it, so a silently-uncobranded signup is
//     traceable rather than mysterious.
//
// Values below are the mapping table from the reference, verbatim.
export type Affiliation = {
  /** The `membership_type` value sent to the API. */
  membershipType: string;
  /**
   * Registered in ShipTime's PRODUCTION database.
   *
   * Production is the only environment this tracks, because it's the only one
   * kept current. The sandbox holds whatever a past dump of prod happened to
   * contain and new affiliations are deliberately not set up there (David,
   * 2026-08-13: "we don't do the full brand set ups on dev as they take some
   * time"). So a `BrandType is not found by alias` error in the sandbox says
   * nothing about production — see the sandbox note in lib/shiptime-api.ts.
   */
  configured: boolean;
};

export const AFFILIATIONS: Record<string, Affiliation> = {
  cangift: { membershipType: "ship-cangift", configured: true },
  "cangift-members": { membershipType: "ship-cangift-mem", configured: true },
  cca: { membershipType: "ship-cca", configured: true },
  futurpreneur: { membershipType: "ship-futurpreneur", configured: true },
  amex: { membershipType: "ship-amex", configured: true },
  cedricmillar: { membershipType: "ship-cmis", configured: true },
  // Not a typo and not prefixed — the mapping table lists `lar` mapping to
  // itself, unlike every other entry.
  lar: { membershipType: "lar", configured: true },
  gain: { membershipType: "ship-associum", configured: true },
  sales: { membershipType: "ship-sales", configured: true },
  consignee: { membershipType: "ship-consignee", configured: true },
  rcc: { membershipType: "ship-rcc", configured: true },
  sca: { membershipType: "ship-sca", configured: true },
  founderscard: { membershipType: "ship-founders", configured: true },
  postcard: { membershipType: "ship-postcard", configured: true },
  capitalone: { membershipType: "ship-capitalone", configured: true },
  ownr: { membershipType: "ship-ownr", configured: true },
  mds: { membershipType: "ship-mds", configured: true },
  // Costco's membership_type is chosen in the UI for a local signup (the plan
  // the member holds), so there is no single constant. Only include Costco here
  // once that selector exists on our side.

  // ── Ours ──
  // Registered in production by ShipTime, confirmed by David 2026-08-13. It is
  // NOT in the sandbox, so signup tests there fail with "BrandType is not found
  // by alias ship-grommet" — that's expected; use a dump-era alias like `cca` to
  // exercise the affiliation path in the sandbox.
  //
  // Separately: shiptime.com/grommet still declares `g_subsite = 'cfib'`, so
  // their own page was signing Grommet traffic up as CFIB. Raised with David and
  // under review — it doesn't affect our landers, which send membership_type
  // directly rather than going through that page.
  grommet: { membershipType: "ship-grommet", configured: true },
};

export function resolveAffiliation(slug?: string | null): Affiliation | null {
  if (!slug) return null;
  return AFFILIATIONS[slug.trim().toLowerCase()] ?? null;
}

// ── Attribution passed through to the API ────────────────────────────────────
// The API takes the UTM triple as source / medium / campaign (not utm_*), so
// the campaign that produced a signup is attached to the ShipTime account
// itself rather than living only in our CRM. Field names verified in the live
// shiptime.com main.js (`data.source = utm_source`, `data.medium`,
// `data.campaign`), which reads them back out of the st_utm_* localStorage keys.
export type SignupAttribution = {
  source?: string;
  medium?: string;
  campaign?: string;
};

// ── Payloads ─────────────────────────────────────────────────────────────────
export type SignupInput = {
  email: string;
  password: string;
  language?: Language;
  affiliation?: string | null;
  company?: string;
  firstname?: string;
  lastname?: string;
  /** ShipTime agent access code — the UI enforces a SHIP- prefix. */
  agentAccessCode?: string;
  attribution?: SignupAttribution;
};

/** Body for POST {base}/contacts — the "does this email already exist" check. */
export function buildContactCheckPayload(email: string, language: Language) {
  return {
    email,
    channel: CHANNEL,
    brand: BRAND,
    guid: CONTACTS_GUID,
    language,
    authProvider: AUTH_PROVIDER_LOCAL,
  };
}

/**
 * Body for POST {base}/contacts/signupredirect.
 *
 * Field names and casing are load-bearing: the standard payload uses
 * `language` / `firstname` / `lastname` (all lowercase), while the CFIB
 * endpoint uses `lang` / `firstName` / `lastName`. Don't normalise them.
 */
export function buildSignupPayload(input: SignupInput) {
  const affiliation = resolveAffiliation(input.affiliation);
  const attr = input.attribution ?? {};

  return {
    email: input.email,
    brand: BRAND,
    channel: CHANNEL,
    password: input.password,
    language: input.language ?? "en",
    // The reference shows the live client sending these as empty strings rather
    // than omitting them, so we match that and only fill them when we have a
    // real value.
    company: input.company ?? "",
    firstname: input.firstname ?? "",
    lastname: input.lastname ?? "",
    ...(affiliation ? { membership_type: affiliation.membershipType } : {}),
    ...(input.agentAccessCode ? { agentAccessCode: input.agentAccessCode } : {}),
    ...(attr.source ? { source: attr.source } : {}),
    ...(attr.medium ? { medium: attr.medium } : {}),
    ...(attr.campaign ? { campaign: attr.campaign } : {}),
  };
}

/**
 * Body for the CFIB endpoint. Separate builder because CFIB is a different
 * endpoint with different field names — see buildSignupPayload's note.
 *
 * Unused today: none of our landing pages are CFIB, and David's guidance was to
 * ignore the CFIB endpoint unless we're doing CFIB signups. It's here so that
 * when a CFIB lander does appear, the field casing is already correct.
 */
export function buildCfibSignupPayload(
  input: SignupInput & { cfibMemberId?: string; aeroplanDigits?: string },
) {
  return {
    email: input.email,
    password: input.password,
    cfibMemberId: input.cfibMemberId ?? "",
    lang: input.language ?? "en",
    brand: BRAND,
    channel: CHANNEL,
    commercialBusinessName: "",
    firstName: input.firstname ?? "",
    lastName: input.lastname ?? "",
    ...(input.agentAccessCode
      ? { agentAccessCode: input.agentAccessCode, promoCode: input.agentAccessCode }
      : {}),
    // The client prefixes the 9 digits the member types with Aeroplan's IIN.
    ...(input.aeroplanDigits ? { aeroplanNumber: `627421${input.aeroplanDigits}` } : {}),
  };
}

// ── Result shapes shared between the route and the form ──────────────────────
export type SignupResult =
  | { ok: true; url: string }
  | {
      ok: false;
      code: SignupErrorCode;
      message: string;
      fields?: FieldErrors;
      /** Where to send someone who already has an account (environment-aware). */
      loginUrl?: string;
    };

export type SignupErrorCode =
  | "invalid_input"
  | "account_exists"
  | "invalid_access_code"
  /**
   * The affiliation we sent isn't registered in ShipTime's database for this
   * environment. The API rejects the whole signup rather than ignoring the
   * unknown value, so this is a hard failure, not a downgrade — verified in the
   * sandbox on 2026-08-13: `BrandType is not found by alias ship-grommet`.
   * Its own code because the fix is a ShipTime-side registration, not anything
   * the visitor or this codebase can do.
   */
  | "unknown_affiliation"
  | "upstream_error"
  | "network_error";

export type ContactCheckResult =
  | { ok: true; exists: boolean }
  | { ok: false; code: "network_error" | "upstream_error"; message: string };
