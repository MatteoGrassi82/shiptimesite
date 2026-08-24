# The Parcel Forum report email

The Logistics Performance Score assessment on `/parcelforum` and
`/parcelforum/score` shows the visitor their score immediately and sends the
written report by email about an hour later.

Decided on the 2026-08-20 landing-page call and reaffirmed with Michael on the
24th: *"Report to be delivered by email with ~1hr delay so it feels personable,
not obviously AI."* A report that appears the instant you press submit announces
what wrote it. The same words an hour later read as a letter — and give a rep a
reason to be in the thread.

The code half is done and deployed with the site. The hour of patience and the
send are HubSpot's, and that part is portal configuration — the checklist below.

---

## What the code does

`POST /api/lps` with `deliver: "email"` (the shiplet sends this automatically
when mounted with `reportDelivery="email"`):

1. Scores the sixteen answers server-side and returns them — the dial animates
   on that response, so nothing waits on a model.
2. Writes the lead to HubSpot through `/api/lead` (contact + timeline note),
   exactly as before.
3. **After the response** (Next's `after()`, so the visitor is already reading
   their score) generates the written report, then patches it onto the same
   contact as five properties and stamps `lps_report_ready_at`.

If the model fails or returns something unparseable, **the stamp is not
written**. That is the safety catch: no stamp means no workflow enrolment means
no email. The lead is still in the CRM for a human to pick up, and the failure
is in the logs as `[lps] report generation produced nothing`.

Env it needs: `HUBSPOT_TOKEN`, `OPENAI_API_KEY`, and optionally `LPS_MODEL`
(defaults to `gpt-4.1-mini`).

---

## 0. Check the subscription first

This design needs three things from the portal: enrol a contact when a custom
property gets written, wait an hour, send a marketing email. The middle one is
the gate.

**Workflow delays are Marketing Hub Professional or Enterprise.** HubSpot lists
delays under Professional and Enterprise only — Starter is not on the list.

Marketing Hub *Starter* does get "simple workflows", and those genuinely allow a
delay plus a send-email action, but they hang off a marketing email's own events
and cap at 10 actions with one workflow per enrolment trigger. A custom contact
property becoming known is not one of those triggers.

So: **on Professional or Enterprise, everything below works as written.** On
Starter, the shape has to change — the practical route is to submit the
assessment through a HubSpot *form* instead of straight to the CRM API
(`HUBSPOT_FORM_ID` is already in ARCHITECTURE.md as an anticipated variable),
and trigger the simple workflow off the form submission. That path is untested
here; confirm the trigger is available in the portal before building on it.

Nothing in the code depends on which of those two you land on. `/api/lps` writes
the contact and the report either way.

## 1. Create five contact properties

There is a script for this — five properties with exact internal names and two
different field types is the kind of job you get subtly wrong once and then
debug for an hour:

```sh
HUBSPOT_TOKEN=pat-... npm run hs:props -- --dry-run   # show what it would do
HUBSPOT_TOKEN=pat-... npm run hs:props                # create them
```

It reads `HUBSPOT_TOKEN` from the environment or from `.env.local`, is
idempotent, and reports a property that already exists with the wrong field type
rather than altering it. Needs `crm.schemas.contacts.read` alongside the
`crm.schemas.contacts.write` scope the Private App already has; it tells you if
that's missing.

By hand instead: Settings → Properties → Create property, object type
**Contact**, group *Logistics Performance Score*. The internal names must match
exactly — `/api/lead` sends these names and HubSpot rejects unknown ones.

| Internal name            | Field type        | Holds |
| ------------------------ | ----------------- | ----- |
| `lps_report_headline`    | Single-line text  | One sentence naming what the score means operationally |
| `lps_report_read`        | **Rich text**     | Two or three sentences on what their answer pattern says |
| `lps_report_priorities`  | **Rich text**     | The three priorities as three paragraphs |
| `lps_report_closing`     | **Rich text**     | One sentence tying their stated priority to the score |
| `lps_report_ready_at`    | Single-line text  | ISO 8601 timestamp — the workflow's enrolment trigger |

**The three body properties must be Rich text, not Multi-line text.** HubSpot
renders a multi-line text property through a personalization token with its
newlines collapsed, so the three priorities would arrive as one run-on
paragraph — and you cannot fix that in the email, because HubSpot does not
support HubL filters on personalization tokens when rendering email (they work
on CMS pages and blog templates, not here). A rich text property renders its
markup, so `/api/lps` writes these three as HTML paragraphs. Rich text caps at
64 KB per value; a report is one or two.

`lps_report_ready_at` is text rather than a date picker on purpose: HubSpot date
properties store midnight UTC and would throw away the time of day, and the
workflow only needs *"is known"* plus re-enrolment when it changes.

Until these exist, `/api/lead` strips them and retries, so nothing breaks —
leads keep landing, they just arrive without a report. That is also the
rollback: delete the workflow and the emails stop, with the site untouched.

## 2. Build the workflow

Automation → Workflows → Create → Contact-based, blank. Name it
**LPS — send report (1h delay)**.

- **Enrolment trigger:** `lps_report_ready_at` *is known*
- **Re-enrolment:** allow, when `lps_report_ready_at` changes — someone who
  retakes the assessment should get the new report, not silence
- **Action 1:** Delay — *1 hour*
- **Action 2:** *If/then* — `lps_report_headline` is known → continue; else end
  (belt and braces; the code already refuses to stamp without a report)
- **Action 3:** Send marketing email → the email from step 3

Set the delay to whatever reads best. An hour was the call's number; it is one
field to change, and nothing in the code depends on it.

## 3. The email

Marketing → Email → Regular → **Automated** (workflow-triggered), plain
single-column template. Send from the rep who owns the show, not a
`no-reply@` — the whole point is that it reads as a person, and replies should
land somewhere a human sees them.

**Subject:** `Your Logistics Performance Score: {{ contact.scorecard_total }}/100`
**Preview:** `{{ contact.lps_report_headline }}`

Body, as plain personalization tokens in a rich text module — no filters, no
custom code. The three body tokens carry their own paragraph markup:

```
{{ contact.firstname }},

You scored {{ contact.scorecard_total }}/100 — {{ contact.scorecard_band }}.
{{ contact.lps_report_headline }}

{{ contact.lps_report_read }}

Where the leverage is
{{ contact.lps_report_priorities }}

{{ contact.lps_report_closing }}

Worth half an hour to go through it properly? [Grab a slot] — no pitch, just
the read.
```

Put each token on its own line in its own paragraph. HubSpot's own guidance is
that rich text values work as separate paragraphs rather than inline, and the
three priorities are three paragraphs, so don't wrap them in a sentence.

Link the CTA to the same HubSpot meeting link the site uses
(`NEXT_PUBLIC_PLUS_CALENDAR_URL`, falling back to
`NEXT_PUBLIC_LEAD_CALENDAR_URL`). Keep the pillar scores out of the body unless
Michael wants them — `scorecard_areas` has them (`CPS 61 · OES 48 · CES 72`).

If a token renders as literal `<p>` text rather than as a paragraph, the
property was created as Multi-line text instead of Rich text. Change the field
type; no code change needed.

---

## Still open

- **The PDF.** The email carries the report as its body. A per-contact PDF
  attachment needs a render step we don't have, and the design isn't settled
  yet — Michael is mocking up answer sets to see what the report *should* look
  like before we lock a layout (his action item from the 24th). Once that
  settles, the natural shape is a `/parcelforum/report/[token]` page the email
  links to, print-styled, since the print CSS already exists in the shiplet.
- **Who it comes from.** Peter is the booking CTA on the landing page; the
  sender on this email should probably match.

## Testing it

```sh
curl -s localhost:3000/api/lps -H 'content-type: application/json' -d '{
  "email":"you+lps@example.com","firstname":"Test","company":"Test Co",
  "deliver":"email","priority":"Reduce cost per shipment",
  "answers":{"1":3,"2":2,"3":4,"4":1,"5":3,"6":2,"7":5,"8":3,
             "9":2,"10":4,"11":1,"12":3,"13":4,"14":2,"15":3,"16":5}
}' | head -c 400
```

The response comes back with the score straight away. Watch the server log for
`[lps/report]` a few seconds later — that line is the report reaching HubSpot.
Then check the contact: five properties filled, one timeline note, and the
workflow showing one enrolment.

To see the whole thing end to end, set the workflow delay to 5 minutes while
testing and put it back to an hour after.
