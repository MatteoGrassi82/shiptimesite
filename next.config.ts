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
  // Multi-zone compose: /plus/* is served by the standalone ShipTime Plus app
  // (deployed separately with basePath /plus). beforeFiles makes this win over
  // any local /plus route. Its assets live under /plus/_next, also proxied here.
  async rewrites() {
    const PLUS = "https://shiptime-plus.vercel.app";
    return {
      beforeFiles: [
        { source: "/plus", destination: `${PLUS}/plus` },
        { source: "/plus/:path*", destination: `${PLUS}/plus/:path*` },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
