import { CaseStudyPage, generateCaseStudyMetadata } from "@/components/sections/case-studies";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CASE_STUDY_SLUGS_QUERY } from "@/sanity/queries";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: CASE_STUDY_SLUGS_QUERY,
    params: { site: "plus" },
    tags: ["caseStudy"],
  });
  return (slugs || []).filter((s) => s.slug).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return generateCaseStudyMetadata({ zone: "plus", slug });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CaseStudyPage zone="plus" slug={slug} />;
}
