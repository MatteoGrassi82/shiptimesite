import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

// Infer the accepted source type from the builder so we don't depend on an
// internal type path (which moves between @sanity/image-url versions).
type ImageSource = Parameters<typeof builder.image>[0];

// Accepts a Sanity image object (or an expanded asset ref) and returns a URL
// builder. Callers chain .width()/.height()/.url() as needed.
export function urlFor(source: ImageSource) {
  return builder.image(source);
}
