import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

// Single shared read client. `stega: false` keeps invisible visual-editing
// characters out of the rendered markup and <head>. Published perspective so
// drafts never leak to production visitors.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: false,
});
