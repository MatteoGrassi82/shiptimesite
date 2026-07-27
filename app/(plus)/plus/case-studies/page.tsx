import { CaseStudiesIndex, generateCaseStudiesIndexMetadata } from "@/components/sections/case-studies";

export const generateMetadata = generateCaseStudiesIndexMetadata;

export default function Page() {
  return <CaseStudiesIndex zone="plus" />;
}
