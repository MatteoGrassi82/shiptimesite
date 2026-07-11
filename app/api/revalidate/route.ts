import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Sanity publish webhook → rebuild exactly the affected pages "in seconds, no
// deployment". Configure a GROQ-powered webhook in sanity.io/manage:
//   URL:        https://<domain>/api/revalidate
//   Trigger:    on publish for _type in ["page","post","siteSettings"]
//   Projection: { "tags": [_type, _type + ":" + slug.current] }
//   Secret:     SANITY_REVALIDATE_SECRET (also set in the app env)
// The section renderers tag their fetches with the same tag names, so a single
// revalidateTag call invalidates every page that depends on the changed doc.

export const runtime = "nodejs";

type WebhookPayload = { tags?: string[] };

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true, // wait for the Sanity CDN to settle before revalidating
    );

    if (!isValidSignature) {
      return new Response("Invalid signature", { status: 401 });
    }
    if (!Array.isArray(body?.tags) || body.tags.length === 0) {
      return new Response("Missing tags", { status: 400 });
    }

    for (const tag of body.tags) {
      // Next.js 16: second arg is required. "max" = stale-while-revalidate.
      revalidateTag(tag, "max");
    }

    return NextResponse.json({ revalidated: body.tags });
  } catch (err) {
    return new Response((err as Error).message, { status: 500 });
  }
}
