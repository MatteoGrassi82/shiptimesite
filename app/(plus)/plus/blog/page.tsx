import type { Metadata } from "next";
import { BlogIndex } from "@/components/sections/cms-page";

export const metadata: Metadata = {
  title: "ShipTime Plus — The network layer",
  description: "Field notes on enterprise logistics: cross-border, freight, multi-carrier routing, and invoice audit.",
};

export default function PlusBlog() {
  return <BlogIndex zone="plus" />;
}
