import { type NextRequest, NextResponse } from "next/server";

// Single lead sink for every form on the site. Writes the lead into HubSpot as a
// contact via the CRM API (create, or update-by-email if it already exists),
// using a Private App token (HUBSPOT_TOKEN). Until the token is set it accepts +
// echoes so the forms work end-to-end in dev.
//
// The token's Private App needs scopes: crm.objects.contacts.write (to write the
// contact) and crm.schemas.contacts.write (used once to create the custom
// properties below). The custom properties must exist in HubSpot with these
// exact internal names, or the write is rejected.

export const runtime = "nodejs";

const CONTACTS_URL = "https://api.hubapi.com/crm/v3/objects/contacts";

// Only these keys are forwarded as HubSpot contact properties (must match the
// property internal names created in HubSpot). `email` is added separately.
const PROP_KEYS = [
  "firstname",
  "lastname",
  "company",
  "lead_source",
  "partner_source",
  "grommet_offer",
  "shipping_industry",
  "parcel_volume",
  "ltl_volume",
  "partial_volume",
  "lcl_volume",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
] as const;

type LeadBody = { email?: string; [key: string]: unknown };

// Everything the lead told us, as one readable block on the contact timeline.
// Reps shouldn't have to scroll a property list to see the shipping profile.
function buildNoteBody(b: LeadBody, referer: string | null): string {
  const v = (k: string) => (b[k] ? String(b[k]) : null);
  const name = [v("firstname"), v("lastname")].filter(Boolean).join(" ");
  const line = (label: string, value: string | null) =>
    value ? `${label}: ${value}<br>` : "";

  const volumes = [
    ["Parcel / Courier", v("parcel_volume")],
    ["LTL", v("ltl_volume")],
    ["Partial truckload", v("partial_volume")],
    ["LCL (ocean)", v("lcl_volume")],
  ].filter(([, val]) => val);

  const attribution = [v("utm_source"), v("utm_medium"), v("utm_campaign")]
    .filter(Boolean)
    .join(" / ");

  const partner = v("partner_source");

  return [
    partner
      ? `<strong>Landing page lead — via ${partner}</strong><br><br>`
      : "<strong>Landing page lead</strong><br><br>",
    "<strong>Contact</strong><br>",
    line("Name", name || null),
    line("Company", v("company")),
    line("Email", v("email")),
    "<br><strong>Shipping profile</strong><br>",
    line("Industry", v("shipping_industry")),
    volumes.length
      ? volumes.map(([l, val]) => `${l}: ${val}/mo<br>`).join("")
      : "Volumes: not provided<br>",
    "<br><strong>Attribution</strong><br>",
    line("Source / Medium / Campaign", attribution || null),
    line("Partner", partner),
    line("Offer shown", v("grommet_offer")),
    line("Clicked from", v("lead_source")),
    line("Page", referer),
  ].join("");
}

// Posts the note and associates it to the contact (association type 202 =
// note → contact). Fail-soft: the contact is already saved either way.
async function postNote(
  contactId: string,
  body: LeadBody,
  referer: string | null,
  headers: Record<string, string>,
): Promise<boolean> {
  try {
    const res = await fetch("https://api.hubapi.com/crm/v3/objects/notes", {
      method: "POST",
      headers,
      body: JSON.stringify({
        properties: {
          hs_timestamp: new Date().toISOString(),
          hs_note_body: buildNoteBody(body, referer),
        },
        associations: [
          {
            to: { id: contactId },
            types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }],
          },
        ],
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as LeadBody;
  const email = body.email?.trim();
  if (!email) {
    return NextResponse.json({ ok: false, error: "email_required" }, { status: 400 });
  }

  const token = process.env.HUBSPOT_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: true, source: "stub", note: "HubSpot not configured", email });
  }

  const properties: Record<string, string> = { email };
  for (const k of PROP_KEYS) {
    const v = body[k];
    if (v != null && v !== "") properties[k] = String(v);
  }

  const headers = { authorization: `Bearer ${token}`, "content-type": "application/json" };

  // Rate limits and 5xx are transient by definition — retrying in-request costs
  // one short wait and saves a lead that would otherwise fall to the client's
  // outbox and wait for a page view that may never come. 4xx is not retried:
  // a bad token or malformed property won't fix itself in 400ms.
  const transient = (status: number) => status === 429 || status >= 500;
  const send = async (url: string, method: "POST" | "PATCH") => {
    let res = await fetch(url, { method, headers, body: JSON.stringify({ properties }) });
    for (let attempt = 0; attempt < 2 && transient(res.status); attempt++) {
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
      res = await fetch(url, { method, headers, body: JSON.stringify({ properties }) });
    }
    return res;
  };

  try {
    // Create the contact…
    let res = await send(CONTACTS_URL, "POST");

    // …and if it already exists (409), update it by email instead.
    if (res.status === 409) {
      res = await send(`${CONTACTS_URL}/${encodeURIComponent(email)}?idProperty=email`, "PATCH");
    }

    const data = await res.json().catch(() => ({}));
    // Fail-soft: never block the visitor on a CRM hiccup. Accept the lead but
    // report honestly whether it stored — submitLead reads `saved` and queues the
    // payload for retry when it's false, so this flag is load-bearing now, not
    // just diagnostics.
    if (!res.ok) {
      // Keep the email in the log line: it's what makes a lead recoverable by
      // hand if every automatic retry is also exhausted.
      console.error("[lead] HubSpot rejected the write", {
        email, status: res.status, response: data,
      });
      return NextResponse.json({ ok: true, source: "hubspot", saved: false, error: data });
    }

    // Also drop the whole profile onto the contact as a single note, so sales
    // reads everything at a glance instead of hunting through properties.
    const contactId = (data as { id?: string }).id;
    const noted = contactId
      ? await postNote(contactId, body, req.headers.get("referer"), headers)
      : false;

    return NextResponse.json({ ok: true, source: "hubspot", saved: true, noted });
  } catch (e) {
    console.error("[lead] HubSpot write threw", { email, error: (e as Error).message });
    return NextResponse.json({ ok: true, source: "hubspot", saved: false, error: (e as Error).message });
  }
}
