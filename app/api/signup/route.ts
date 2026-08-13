import { type NextRequest, NextResponse } from "next/server";

import { checkContact, createAccount, loginUrl, signupEnv, warnIfUnregistered } from "@/lib/shiptime-api";
import { validateCredentials, type Language, type SignupResult } from "@/lib/shiptime-signup";

// Creates a real ShipTime account from a landing page, instead of bouncing the
// visitor to shiptime.com and hoping the attribution survives the hop.
//
// The sequence mirrors what shiptime.com's own client does:
//   1. validate email + password against ShipTime's regexes (a rejection here is
//      an inline message; a rejection upstream is an opaque 400)
//   2. POST /contacts to see whether the email already has an account
//   3. POST /contacts/signupredirect and hand back the redirect URL, which
//      carries a token that auto-logs the new account into the app
//
// Environment (sandbox vs production) is resolved server-side — see signupEnv().

export const runtime = "nodejs";

type Body = {
  email?: string;
  password?: string;
  confirm?: string;
  language?: string;
  affiliation?: string;
  company?: string;
  firstname?: string;
  lastname?: string;
  agentAccessCode?: string;
  // UTM triple, already resolved to first-touch by the client. Named source /
  // medium / campaign because that's what the ShipTime API takes.
  source?: string;
  medium?: string;
  campaign?: string;
};

const clean = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const language = (v: unknown): Language => (clean(v).toLowerCase() === "fr" ? "fr" : "en");

function fail(result: Extract<SignupResult, { ok: false }>, status: number) {
  return NextResponse.json(result, { status });
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return fail(
      { ok: false, code: "invalid_input", message: "Malformed request body." },
      400,
    );
  }

  const email = clean(body.email);
  // Not trimmed: leading/trailing whitespace is legal in a password and
  // trimming it would silently change what the person typed.
  const password = typeof body.password === "string" ? body.password : "";
  const lang = language(body.language);

  const fields = validateCredentials({
    email,
    password,
    ...(typeof body.confirm === "string" ? { confirm: body.confirm } : {}),
  });
  if (Object.keys(fields).length) {
    return fail(
      { ok: false, code: "invalid_input", message: "Check the highlighted fields.", fields },
      422,
    );
  }

  // Existing-account check. If the check itself fails (network, unexpected
  // status) we carry on to the signup call rather than blocking a legitimate
  // signup — the signup response will surface a duplicate as a 409 anyway.
  const existing = await checkContact(email, lang);
  if (existing.ok && existing.exists) {
    return fail(
      {
        ok: false,
        code: "account_exists",
        message: "You already have a ShipTime account with that email — sign in instead.",
        loginUrl: loginUrl(),
      },
      409,
    );
  }
  if (!existing.ok) {
    console.warn(`[shiptime-signup] contact check inconclusive: ${existing.message}`);
  }

  warnIfUnregistered(body.affiliation);

  const result = await createAccount({
    email,
    password,
    language: lang,
    affiliation: clean(body.affiliation) || null,
    company: clean(body.company),
    firstname: clean(body.firstname),
    lastname: clean(body.lastname),
    agentAccessCode: clean(body.agentAccessCode),
    attribution: {
      source: clean(body.source) || undefined,
      medium: clean(body.medium) || undefined,
      campaign: clean(body.campaign) || undefined,
    },
  });

  if (!result.ok) {
    const status = result.code === "account_exists" ? 409 : 502;
    if (result.code === "account_exists") result.loginUrl = loginUrl();
    // Logged with the environment because "signup is broken" is almost always
    // "signup is pointed at the wrong environment".
    console.error(`[shiptime-signup] ${signupEnv()} ${result.code}: ${result.message}`);
    return fail(result, status);
  }

  return NextResponse.json(result);
}

// Lets the form show the right "sign in instead" link and makes it obvious
// which environment a deployment is signing people up into.
export async function GET() {
  return NextResponse.json({ env: signupEnv(), loginUrl: loginUrl() });
}
