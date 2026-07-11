import type { QueryParams } from "next-sanity";
import { client } from "../client";

// Thin wrapper around client.fetch that wires Next's tag-based caching. Every
// query is tagged so the Sanity publish webhook (/api/revalidate) can rebuild
// exactly the pages that depend on the changed content — "live in seconds, no
// deployment". When tags are present we disable time-based revalidation and
// rely purely on webhook invalidation; otherwise fall back to a 60s window.
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = 60,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  });
}
