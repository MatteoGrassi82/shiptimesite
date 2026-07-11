import { type NextRequest, NextResponse } from "next/server";

// Single lead sink for every form on the site (resource downloads, savings
// calculator, assessment, contact sales, inline email capture). Posts into
// HubSpot Forms. Until HUBSPOT_* are set it accepts + echoes so the forms work
// end-to-end in dev; wire the env vars to go live. Downstream, Holocron pulls
// high-intent leads out of HubSpot.

export const runtime = "nodejs";

type LeadBody = {
  email?: string;
  firstname?: string;
  lastname?: string;
  company?: string;
  source?: string;
  [key: string]: unknown;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as LeadBody;
  const email = body.email?.trim();
  if (!email) {
    return NextResponse.json({ ok: false, error: "email_required" }, { status: 400 });
  }

  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formId = process.env.HUBSPOT_FORM_ID;

  if (!portalId || !formId) {
    return NextResponse.json({ ok: true, source: "stub", note: "HubSpot not configured", email });
  }

  const fields = Object.entries(body)
    .filter(([, v]) => v != null && v !== "")
    .map(([name, value]) => ({ name, value: String(value) }));

  try {
    const res = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fields,
          context: {
            pageUri: req.headers.get("referer") || undefined,
            pageName: (body.source as string) || "shiptime",
          },
        }),
      },
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: data }, { status: 502 });
    }
    return NextResponse.json({ ok: true, source: "hubspot" });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 502 });
  }
}
