// ShipTime Signup API — server-side calls.
//
// SERVER ONLY. Never import this from a client component: the requests go out
// from our own server, not the visitor's browser, and that is deliberate.
//
// Why proxy instead of calling api.shiptime.com from the page:
//  • CORS. The API is set up for shiptime.com's own pages. Our landers live on
//    lp.shiptime.com / shiptimelandin.com, and ShipTime keeps an allow-list for
//    custom domains (David raised exactly this for the Google login button,
//    2026-08-12). A server-side call has no origin to allow-list, so this works
//    today without waiting on their config.
//  • The upstream contract is quirky — JSON body declared as text/plain,
//    `url` on signup but `URL` on social login, errors variously as `result`,
//    `message`, or `ERROR`. Absorbing that here means the form deals with one
//    predictable shape.
//  • The password never touches a third-party script on the page.

import {
  buildCfibSignupPayload,
  buildContactCheckPayload,
  buildSignupPayload,
  resolveAffiliation,
  type ContactCheckResult,
  type Language,
  type SignupInput,
  type SignupResult,
} from "./shiptime-signup";

// ── Environment ──────────────────────────────────────────────────────────────
// appspaces.ca is ShipTime's sandbox, api.shiptime.com is production (David,
// 2026-08-12). The live site picks between them from the browser's Host header
// via /api/getconfig.php; we have no PHP, so we resolve from our own env
// instead — same destinations, chosen explicitly.
type Bases = {
  /** Standard signup + contacts base. */
  signup: string;
  /** CFIB signup. POSTed to directly — no path is appended. */
  cfib: string;
  /** Where to send someone who turns out to already have an account. */
  login: string;
};

const PRODUCTION: Bases = {
  signup: "https://api.shiptime.com/signup",
  // Spelling per the reference (built from ShipTime's own JS): "zoomshipr", not
  // "zoomershipr". If a CFIB signup ever 404s, this is the first thing to check.
  cfib: "https://api.shiptime.com/zoomshipr-api/zoomshipr/signup",
  login: "https://app.shiptime.com",
};

const SANDBOX: Bases = {
  signup: "https://signupapi.appspaces.ca/signup",
  cfib: "https://ship.appspaces.ca/zoomshipr-api/zoomshipr/signup",
  login: "https://shiptimev3.appspaces.ca/index.jsp",
};

/**
 * Which ShipTime environment this deployment signs people up into.
 *
 * Production only on a real production deploy; previews and local dev hit the
 * sandbox, so nobody creates live accounts while testing a form. Override with
 * SHIPTIME_SIGNUP_ENV=production|sandbox (e.g. to smoke-test prod from a
 * preview, or to keep production on sandbox until the affiliation is
 * registered).
 */
export function signupEnv(): "production" | "sandbox" {
  const explicit = process.env.SHIPTIME_SIGNUP_ENV?.trim().toLowerCase();
  if (explicit === "production" || explicit === "prod") return "production";
  if (explicit === "sandbox") return "sandbox";
  return process.env.VERCEL_ENV === "production" ? "production" : "sandbox";
}

export function bases(): Bases {
  return signupEnv() === "production" ? PRODUCTION : SANDBOX;
}

// ── Transport ────────────────────────────────────────────────────────────────
// The API is fed JSON.stringify(payload) under Content-Type: text/plain. That
// looks wrong and is: it's what shiptime.com's own client sends (the header
// dodges a CORS preflight), and the server parses the body accordingly. Sending
// application/json risks a parser that isn't expecting it, so we match the
// working client exactly.
const TIMEOUT_MS = 15_000;

/**
 * Origin sent on every upstream call.
 *
 * The API allow-lists by Origin and returns a bare 403 (Tomcat HTML, no JSON)
 * when it's missing or unrecognised — verified against the sandbox on
 * 2026-08-13: identical requests differ only by this header, 403 without it and
 * 200 with `https://shiptime.com`. A browser sets Origin automatically; a
 * server-to-server fetch does not, so we set it explicitly or every call fails.
 *
 * This is the same allow-list David mentioned for the Google login button. He
 * added lp.shiptime.com on 2026-08-13 and it's verified working against the
 * sandbox (the response echoes `Access-Control-Allow-Origin:
 * https://lp.shiptime.com`), so that's the default — our own domain, matching
 * where the request actually comes from.
 *
 * Origin is scheme + host only, never a path, so this one value covers every
 * page. And because we call from the server rather than the browser, it's a
 * value we choose: the same origin is sent from local dev, previews, and
 * production, so no preview URLs need allow-listing.
 */
function origin(): string {
  return process.env.SHIPTIME_SIGNUP_ORIGIN?.trim() || "https://lp.shiptime.com";
}

type UpstreamResponse = {
  status: number;
  /** Parsed body when it was JSON (in either of the two shapes it arrives in). */
  data: Record<string, unknown> | null;
  /** Raw body, always kept — some errors come back as bare text. */
  raw: string;
};

async function postText(url: string, payload: unknown): Promise<UpstreamResponse> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain", Origin: origin() },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });

  const raw = await res.text();
  return { status: res.status, data: parseTolerant(raw), raw };
}

// The upstream sometimes returns a JSON object and sometimes a JSON *string*
// containing that object (the reference notes its own client parsing twice).
// One extra unwrap covers both without accepting nonsense.
function parseTolerant(raw: string): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    let parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "string") parsed = JSON.parse(parsed);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function str(data: Record<string, unknown> | null, key: string): string {
  const v = data?.[key];
  return typeof v === "string" ? v : "";
}

// ── /contacts — does this email already have an account? ─────────────────────
// Called before signup so an existing customer gets "you already have an
// account, sign in" instead of a raw API error.
//
// Status mapping is from the reference: 200 means the email is new, 409 means it
// exists, and 400 with the duplicate-username message also means it exists. Any
// other status is inconclusive, and we deliberately do NOT treat that as
// "exists" — blocking a legitimate signup is worse than letting the signup call
// itself return the duplicate error.
const DUPLICATE_MESSAGE = "username already exists in database";

export async function checkContact(
  email: string,
  language: Language = "en",
): Promise<ContactCheckResult> {
  const url = `${bases().signup}/contacts`;
  let res: UpstreamResponse;
  try {
    res = await postText(url, buildContactCheckPayload(email, language));
  } catch (err) {
    return {
      ok: false,
      code: "network_error",
      message: err instanceof Error ? err.message : "contact_check_failed",
    };
  }

  if (res.status === 200) return { ok: true, exists: false };
  if (res.status === 409) return { ok: true, exists: true };

  // The duplicate signal can arrive either as JSON {message} or as bare text, so
  // both are searched.
  const message = str(res.data, "message");
  if (
    res.status === 400 &&
    `${message} ${res.raw}`.toLowerCase().includes(DUPLICATE_MESSAGE)
  ) {
    return { ok: true, exists: true };
  }

  return {
    ok: false,
    code: "upstream_error",
    message: message || describe(res),
  };
}

// Not every failure is JSON: a rejected Origin comes back as a Tomcat HTML error
// page. Passing res.raw straight through would put a page of markup into a log
// line — or worse, into a message shown to a visitor. Summarise instead.
function describe(res: UpstreamResponse): string {
  const looksHtml = /^\s*<(?:!doctype|html)/i.test(res.raw);
  if (looksHtml) {
    return (
      `HTTP ${res.status} with an HTML error page (not JSON). ` +
      `Most likely the Origin header isn't on ShipTime's allow-list — see SHIPTIME_SIGNUP_ORIGIN.`
    );
  }
  return `HTTP ${res.status}${res.raw ? `: ${res.raw.slice(0, 200)}` : ""}`;
}

// ── Account creation ─────────────────────────────────────────────────────────
/**
 * Create a ShipTime account and return the URL to send the browser to.
 *
 * That URL carries a one-time token that logs the new account straight into the
 * app (David demoed this on the call), which is why we hand it back to the
 * client to navigate to rather than following the redirect here.
 */
export async function createAccount(
  input: SignupInput & { cfib?: { memberId?: string; aeroplanDigits?: string } },
): Promise<SignupResult> {
  const b = bases();
  // CFIB is routed to its own base with no path appended, and takes differently
  // named fields — the live client special-cases it the same way.
  const isCfib = Boolean(input.cfib);
  const url = isCfib ? b.cfib : `${b.signup}/contacts/signupredirect`;
  const payload = isCfib
    ? buildCfibSignupPayload({
        ...input,
        cfibMemberId: input.cfib?.memberId,
        aeroplanDigits: input.cfib?.aeroplanDigits,
      })
    : buildSignupPayload(input);

  let res: UpstreamResponse;
  try {
    res = await postText(url, payload);
  } catch (err) {
    return {
      ok: false,
      code: "network_error",
      message: err instanceof Error ? err.message : "signup_request_failed",
    };
  }

  const message = str(res.data, "message");
  const upstreamError = str(res.data, "ERROR");

  if (res.status === 409) {
    return {
      ok: false,
      code: "account_exists",
      message: upstreamError || "An account with that email already exists.",
    };
  }

  if (message === "Invalid_agent_access_code") {
    return { ok: false, code: "invalid_access_code", message: "That access code isn't valid." };
  }

  // "BrandType is not found by alias <x>" — the affiliation isn't registered in
  // this environment. Worth its own code: the signup failed for a reason that
  // has nothing to do with the visitor's input, and the fix is on ShipTime's
  // side. Note affiliations are registered per environment, so an alias working
  // in production can still fail in the sandbox.
  if (/BrandType is not found by alias/i.test(message)) {
    return {
      ok: false,
      code: "unknown_affiliation",
      // In the sandbox this is usually not a real problem, and saying so saves
      // the next person the investigation: the sandbox database is an old dump
      // of production and new affiliations aren't seeded there on purpose.
      message:
        signupEnv() === "sandbox"
          ? `${message} — expected in the sandbox, which runs off a past prod dump with no new affiliations seeded. ` +
            `Use a dump-era alias (e.g. affiliation "cca") to test this path, and verify the real one against production.`
          : message,
    };
  }

  // A 2xx can still be a failure: the API signals application errors in the
  // body as {result: 'error', message}.
  const is2xx = res.status >= 200 && res.status < 300;
  if (!is2xx || str(res.data, "result") === "error") {
    return {
      ok: false,
      code: "upstream_error",
      message: message || upstreamError || describe(res),
    };
  }

  // Signup returns `url` lowercase; social login returns `URL` uppercase. We
  // only do local signup, but accepting both costs nothing and matches the
  // reference's caveat that the response shape isn't stable.
  const redirect = str(res.data, "url") || str(res.data, "URL");
  // No URL back is not a failed signup — the account exists at this point. Their
  // client calls redirectToLogin() here, so we do the same rather than showing
  // an error for an account that was actually created.
  return { ok: true, url: redirect || b.login };
}

/** Convenience so the login destination is never hardcoded at a call site. */
export function loginUrl(): string {
  return bases().login;
}

/**
 * Log affiliations we send that ShipTime hasn't confirmed as registered.
 *
 * This is a heads-up before the call, not a guess about the outcome: an
 * unregistered alias makes the API reject the signup outright with
 * "BrandType is not found by alias …" (confirmed in the sandbox 2026-08-13),
 * so every signup on that page fails until it's registered.
 */
export function warnIfUnregistered(affiliation?: string | null): void {
  const resolved = resolveAffiliation(affiliation);
  if (resolved && !resolved.configured) {
    console.warn(
      `[shiptime-signup] membership_type "${resolved.membershipType}" is not confirmed as registered in ShipTime's ${signupEnv()} database. ` +
        `If it isn't, the API will REJECT this signup entirely — it does not fall back to a non-co-branded account.`,
    );
  }
}
