import { R2Page, r2Metadata } from "@/components/sections/koherent-page";

// /koherent/network — Jenny's copy for this page, rendered by koherent-page.tsx.
export const metadata = r2Metadata("network");

export default function KoherentNetworkPage() {
  return <R2Page pageKey="network" />;
}
