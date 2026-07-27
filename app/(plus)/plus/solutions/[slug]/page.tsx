import { SolutionPage, generateSolutionMetadata } from "@/components/sections/solutions";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SOLUTION_PAGE_SLUGS_QUERY } from "@/sanity/queries";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: SOLUTION_PAGE_SLUGS_QUERY,
    params: { site: "plus" },
    tags: ["solutionPage"],
  });
  return (slugs || []).filter((s) => s.slug).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return generateSolutionMetadata({ zone: "plus", slug });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SolutionPage zone="plus" slug={slug} />;
}
