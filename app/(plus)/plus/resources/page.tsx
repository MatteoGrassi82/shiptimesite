import { ResourcesIndex, generateResourcesIndexMetadata } from "@/components/sections/resources";

export const generateMetadata = generateResourcesIndexMetadata;

export default function Page() {
  return <ResourcesIndex zone="plus" />;
}
