import type { Metadata } from "next";
import { BlogIndex } from "@/components/sections/cms-page";

export const metadata: Metadata = {
  title: "ShipTime Blog — Ship smarter",
  description: "Guides on carriers, cross-border freight, and cutting shipping costs for Canadian ecommerce brands.",
};

export default function CoreBlog() {
  return <BlogIndex zone="core" />;
}
