import { CmsPage, generatePageMetadata } from "@/components/sections/cms-page";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_SLUGS_QUERY } from "@/sanity/queries";

export const dynamicParams = true;

// These slugs are served by dedicated coded pages (app/(plus)/plus/<slug>/) —
// the marketing pages are code, Sanity is blogs-only. A static route wins over
// this [slug] catch-all, but we also exclude them here so generateStaticParams
// can't try to prerender a colliding path.
const CODED_SLUGS = new Set(["home", "los", "platform", "fulfillment", "how-we-work", "technology", "compare", "faq", "assessment", "book-a-call", "solutions", "case-studies", "resources"]);

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: PAGE_SLUGS_QUERY,
    params: { site: "plus" },
    tags: ["page"],
  });
  return (slugs || []).filter((s) => s.slug && !CODED_SLUGS.has(s.slug)).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return generatePageMetadata({ zone: "plus", slug });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CmsPage zone="plus" slug={slug} />;
}
