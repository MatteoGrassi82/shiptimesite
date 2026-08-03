import type { NextConfig } from "next";
import { redirects } from "./lib/redirects";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP as the fallback. Next's default is WebP only, so AVIF-
    // capable browsers were being served WebP — AVIF is ~20-30% smaller again
    // (the Grommet hero drops from ~70KB to ~50KB), which matters on the
    // landing pages since most of that traffic is mobile email/ad clicks.
    // Cost: the first optimise per size is slower to encode, then it's cached
    // at the edge. PNG/JPEG still served to anything that can't take either.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  // The domain-migration redirect map (served at the edge by Vercel).
  async redirects() {
    return redirects;
  },
  // NOTE: /plus/* used to be multi-zone-composed from the standalone
  // shiptime-plus.vercel.app deployment via a beforeFiles rewrite. That's gone —
  // since the two-zone unification (see ARCHITECTURE.md), /plus/* is served
  // locally by app/(plus)/plus/*. Re-adding a /plus rewrite here would shadow
  // every local Plus route again.
};

export default nextConfig;
