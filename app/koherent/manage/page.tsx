import { R2Page, r2Metadata } from "@/components/sections/koherent-page";

// /koherent/manage — Jenny's copy for this page, rendered by koherent-page.tsx.
export const metadata = r2Metadata("manage");

export default function KoherentManagePage() {
  return <R2Page pageKey="manage" />;
}
