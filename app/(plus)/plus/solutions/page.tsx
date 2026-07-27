import { SolutionsIndex, generateSolutionsIndexMetadata } from "@/components/sections/solutions";

export const generateMetadata = generateSolutionsIndexMetadata;

export default function Page() {
  return <SolutionsIndex zone="plus" />;
}
