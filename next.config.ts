import type { NextConfig } from "next";
import { redirects } from "./lib/redirects";

const nextConfig: NextConfig = {
  images: {
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
