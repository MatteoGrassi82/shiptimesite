# ShipTime — site architecture

One Next.js app, one Sanity project, one Vercel project → **two brands, two blogs, two design systems.**

```
Visitor ─▶ Vercel (CDN · ISR · redirects · A/B · proxy)
        ─▶ Next.js app
             ├─ (core) zone   shiptime.com/*        Core tokens  (navy + orange, Manrope)
             └─ (plus) zone   shiptime.com/plus/*   Plus tokens  (navy + orange, blue accent, Anton display)
                  └─ shared section library  (built once, wears either brand)
        ◀─ Sanity (project hgpi44x3 · dataset production · site field = core|plus)
```

## The core idea: two token sets, one section library

Every shared section in [`components/sections/`](components/sections/) reads **only semantic CSS
variables** — `var(--brand)`, `var(--ink)`, `var(--surface)`, `var(--font-display)`… — never a raw
brand hex. The zone layout sets `data-zone="core"` or `data-zone="plus"` on a wrapper, and
[`app/globals.css`](app/globals.css) resolves those tokens differently per zone. So the *same* `Hero`
renders in Manrope navy/orange in Core and in big Anton uppercase headlines in Plus.

Add a section: build the component → add its schema type → add one `case` in
[`components/sections/page-builder.tsx`](components/sections/page-builder.tsx).

## Routing (URLs unchanged from before)

| URL | Source |
|---|---|
| `/` | `app/(core)/page.tsx` — the landing-page index (hand-coded) |
| `/vs/*`, `/alternative/*`, `/plus-films` | existing hand-coded landing pages (moved into `(core)`, URLs identical) |
| `/{slug}` | `app/(core)/[slug]` → Sanity `page` (site=core), assembled from sections |
| `/blog`, `/blog/{slug}` | Sanity `post` (site=core) — the 4 existing posts live here |
| `/plus` | `app/(plus)/plus/page.tsx` — `PlusHero`, or a Sanity `page` with slug `home` (site=plus) |
| `/plus/{slug}` | Sanity `page` (site=plus) |
| `/plus/blog`, `/plus/blog/{slug}` | Sanity `post` (site=plus) |
| `/api/rate`, `/api/lead`, `/api/revalidate` | server routes |

Static routes win over `[slug]`; `/plus/*` (literal) wins over the core `[slug]`. Interactive pages
stay hand-coded; everything else is assembled from sections.

## Content — Sanity

- **Project:** `hgpi44x3` ("Shiptime site"), dataset `production`. One project, one dataset.
- **The `site` field** (`core` | `plus`) on every `page`, `post`, and `siteSettings` doc is what
  splits one project into two sites. Queries filter with `coalesce(site,"core")` so legacy docs
  default to Core.
- **Schema** is deployed live (via MCP `deploy_schema`) and mirrored in [`sanity/schemaTypes/`](sanity/schemaTypes/)
  for the Studio. Sections: hero, feature grid, logo marquee, metric stats, testimonials, FAQ, CTA,
  rich text, booking embed.
- **Studio** = standalone, two workspaces (Core / Plus, filtered by `site`): `npm run studio`
  (config in [`sanity.config.ts`](sanity.config.ts), excluded from the Next build).
- **Claude Cowork** can already draft into either blog over MCP; a human publishes.

## Delivery — Vercel

- Pages pre-render; Sanity fetches are **tag-cached**. On publish, a GROQ webhook hits
  `/api/revalidate` which calls `revalidateTag(tag, "max")` — the affected page rebuilds in seconds,
  no deploy. Webhook projection: `{ "tags": [_type, _type + ":" + slug.current] }`.
- **Redirects:** the 600-URL migration map lives in [`lib/redirects.ts`](lib/redirects.ts) → returned
  from `next.config` (served at the edge; Vercel caps config redirects ~1,024).
- **A/B:** [`proxy.ts`](proxy.ts) (Next 16 renamed `middleware.ts` → `proxy.ts`) assigns a sticky
  `st_ab` bucket cookie on `/` for the headline test.

## Around the edges (env vars — all degrade gracefully until set)

| Route | Env | Behaviour without env |
|---|---|---|
| `/api/rate` | `SHIPTIME_RATE_API_URL`, `SHIPTIME_RATE_API_KEY` | returns representative **mock** rates (credentials never touch the browser) |
| `/api/lead` | `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_ID` | accepts + echoes (**stub**); wire to post into HubSpot → Holocron |
| `/api/revalidate` | `SANITY_REVALIDATE_SECRET` | rejects unsigned webhooks (401) |

Optional: `NEXT_PUBLIC_SANITY_PROJECT_ID` / `_DATASET` override the defaults (`hgpi44x3` / `production`).

## Dev

```bash
npm run dev        # Next app        → localhost:3000
npm run studio     # Sanity Studio   → localhost:3333  (Core + Plus workspaces)
npm run build      # production build
```
