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
  // Scorecard result. These are the only fields that describe what the lead
  // actually told us about their operation, so they're the ones sales acts on.
  // If the matching HubSpot properties don't exist yet the write below strips
  // them and retries, so listing them early is safe — they start populating the
  // moment the properties are created, with no code change.
  "scorecard_total",
  "scorecard_answered",
  "scorecard_band",
  "scorecard_areas",
  "scorecard_weakest",
  "scorecard_detail",
  // The written report, one property per section. It lives on the contact
  // because HubSpot personalization tokens can read properties and nothing
  // else — the delayed report email is assembled from exactly these five.
  // `lps_report_ready_at` is the workflow's enrolment trigger, so it is
  // written last-in-the-object and only when the rest are present.
  "lps_report_headline",
  "lps_report_read",
  "lps_report_priorities",
  "lps_report_closing",
  "lps_report_ready_at",
] as const;

type LeadBody = { email?: string; [key: string]: unknown };

// HubSpot rejects the whole contact if any single property doesn't exist in the
// portal, which makes one missing property indistinguishable from a lost lead.
// Given the choice between "no lead" and "lead minus one field", take the field
// loss: pull the names HubSpot complained about out of its error and retry
// without them. This also covers the 14 pre-existing properties — before, one
// rename in HubSpot would have started failing every write on the site.
function unknownProps(data: unknown, sent: string[]): string[] {
  const d = data as { message?: string; errors?: { message?: string }[] } | null;
  const blob = [d?.message, ...(d?.errors ?? []).map((e) => e?.message)]
    .filter(Boolean)
    .join(" ");
  if (!blob) return [];
  // Word-boundary matched, not a substring test: plain `includes` would let a
  // complaint about "source" strip utm_source, quietly discarding attribution
  // that HubSpot never objected to.
  return sent.filter((k) => new RegExp(`(^|[^a-zA-Z0-9_])${k}([^a-zA-Z0-9_]|$)`).test(blob));
}

// Everything the lead told us, as one readable block on the contact timeline.
// Reps shouldn't have to scroll a property list to see the shipping profile.
//
// `scorecard_name`, `scorecard_scale` and `scorecard_of` are deliberately not in
// PROP_KEYS: they only exist to label this block correctly for whichever
// assessment produced the lead (the LPS is 0–100 over 16 questions, the older
// readiness scorecard was 0–24 over 12), and they'd be dead weight in HubSpot.
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
    // The scorecard is the only part of this that says anything about how the
    // prospect actually operates, so it goes above attribution. It's rendered
    // from the request body rather than from HubSpot properties, which means it
    // shows up on the timeline whether or not those properties exist yet.
    v("scorecard_total")
      ? [
          `<br><strong>${v("scorecard_name") ?? "Logistics Readiness Scorecard"}</strong><br>`,
          line("Score", `${v("scorecard_total")} / ${v("scorecard_scale") ?? "24"} — ${v("scorecard_band") ?? ""}`),
          line("Items answered", `${v("scorecard_answered") ?? "?"} of ${v("scorecard_of") ?? "12"}`),
          line("By area", v("scorecard_areas")),
          line("Weakest area", v("scorecard_weakest")),
          v("scorecard_detail")
            ? `<br>${String(v("scorecard_detail")).replace(/\n/g, "<br>")}<br>`
            : "",
        ].join("")
      : "",
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

  const PATCH_URL = `${CONTACTS_URL}/${encodeURIComponent(email)}?idProperty=email`;

  // Create the contact, or update it by email if it already exists (409).
  const upsert = async () => {
    let r = await send(CONTACTS_URL, "POST");
    if (r.status === 409) r = await send(PATCH_URL, "PATCH");
    return r;
  };

  try {
    let res = await upsert();
    let data = await res.json().catch(() => ({}));

    // One property HubSpot doesn't recognise fails the entire contact. Drop the
    // ones it named and try again rather than losing the lead over a field.
    if (!res.ok && res.status === 400) {
      const bad = unknownProps(data, Object.keys(properties).filter((k) => k !== "email"));
      if (bad.length) {
        console.warn("[lead] dropping properties HubSpot rejected, retrying", { email, bad });
        for (const k of bad) delete properties[k];
        res = await upsert();
        data = await res.json().catch(() => ({}));
      }
    }
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
    // `no_note` exists for second writes against a contact this route already
    // noted — the delayed report attaches itself to a lead that arrived
    // minutes ago, and a second note would just be the first one with the
    // shipping profile missing.
    const contactId = (data as { id?: string }).id;
    const noted = contactId && !body.no_note
      ? await postNote(contactId, body, req.headers.get("referer"), headers)
      : false;

    return NextResponse.json({ ok: true, source: "hubspot", saved: true, noted });
  } catch (e) {
    console.error("[lead] HubSpot write threw", { email, error: (e as Error).message });
    return NextResponse.json({ ok: true, source: "hubspot", saved: false, error: (e as Error).message });
  }
}
