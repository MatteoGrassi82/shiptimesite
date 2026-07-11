// Next.js 16 renamed `middleware.ts` to `proxy.ts` (runs on the Node.js runtime,
// runtime is not configurable). This handles the A/B headline split for the home
// page: assign each visitor a sticky bucket cookie the first time they land, so
// the server can render variant A or B deterministically for that visitor.
//
// Bulk redirects live in next.config (`redirects()`), served at the edge. Only
// request-time personalization belongs here.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const AB_COOKIE = "st_ab";

export function proxy(request: NextRequest) {
  const res = NextResponse.next();

  if (!request.cookies.get(AB_COOKIE)) {
    const bucket = Math.random() < 0.5 ? "A" : "B";
    res.cookies.set(AB_COOKIE, bucket, {
      path: "/",
      maxAge: 60 * 60 * 24 * 90, // 90 days
      sameSite: "lax",
    });
  }

  return res;
}

// Only run on the home page — that's where the headline test lives. Keeps the
// proxy off every static asset and API route.
export const config = {
  matcher: ["/"],
};
