import { redirect } from "next/navigation";
import { PAGES } from "@/components/sections/koherent-brand";

// Revision 2 (Oct 30): this first-revision page folded into How it works,
// which now holds its asks (Michael's lattice and blocks, Chris's method).
// A temporary redirect, so old links still land somewhere useful.
export default function KoherentFoldedPage() {
  redirect(PAGES.works);
}
