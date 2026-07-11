// Central redirect map for the domain migration ("the 600-URL redirect map").
// Next returns this array from next.config `redirects()`, so Vercel serves them
// at the edge before any function runs. Keep entries here; the config just
// imports the list.
//
// Vercel caps config redirects at ~1,024 entries. If the real map exceeds that,
// move the overflow into proxy.ts (NextResponse.redirect keyed off a lookup).
//
// `permanent: true` => 308 (cached by browsers/crawlers, use for real moves).
// `permanent: false` => 307 (temporary, safe while a destination is in flux).

export type Redirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

export const redirects: Redirect[] = [
  // ── Legacy marketing paths → new structure ──────────────────────
  { source: "/features", destination: "/", permanent: true },
  { source: "/shipping-software", destination: "/", permanent: true },
  { source: "/compare", destination: "/vs", permanent: true },
  { source: "/comparisons/:slug", destination: "/vs/:slug", permanent: true },
  { source: "/alternatives/:slug", destination: "/alternative/:slug", permanent: true },

  // ── Blog path consolidation ─────────────────────────────────────
  { source: "/blog/posts/:slug", destination: "/blog/:slug", permanent: true },
  { source: "/resources/:slug", destination: "/blog/:slug", permanent: true },

  // ── Plus zone ───────────────────────────────────────────────────
  { source: "/enterprise", destination: "/plus", permanent: false },
  { source: "/plus/home", destination: "/plus", permanent: true },

  // The remaining ~590 mapped URLs from the legacy site paste in below,
  // one { source, destination, permanent } per line.
];
