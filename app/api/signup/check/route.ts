import { type NextRequest, NextResponse } from "next/server";

import { checkContact, loginUrl } from "@/lib/shiptime-api";
import { EMAIL_RE, type Language } from "@/lib/shiptime-signup";

// Standalone email-exists check, so the form can tell someone they already have
// an account when they leave the email field — before they pick a password.
// /api/signup runs the same check server-side regardless; this one is purely to
// move that answer earlier in the flow.

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let email = "";
  let language: Language = "en";
  try {
    const body = (await req.json()) as { email?: string; language?: string };
    email = typeof body.email === "string" ? body.email.trim() : "";
    if (typeof body.language === "string" && body.language.toLowerCase() === "fr") language = "fr";
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_input" }, { status: 400 });
  }

  // Don't spend an upstream call on something that can't be an account.
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, code: "invalid_input" }, { status: 422 });
  }

  const result = await checkContact(email, language);
  if (!result.ok) {
    // Inconclusive is not "taken" — answer 200 with exists:null so the form
    // stays quiet rather than warning someone off their own signup.
    console.warn(`[shiptime-signup] check inconclusive: ${result.message}`);
    return NextResponse.json({ ok: true, exists: null });
  }

  // loginUrl travels with the answer so the form's "sign in instead" link points
  // at the same environment the check ran against.
  return NextResponse.json({
    ok: true,
    exists: result.exists,
    ...(result.exists ? { loginUrl: loginUrl() } : {}),
  });
}
