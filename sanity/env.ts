// Sanity connection details for the "Shiptime site" project (org: Shiptime).
// Project id + dataset are not secret (they ship to the browser), so we default
// them here and allow env overrides. Read/write tokens live in env vars only.

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "hgpi44x3";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-01";

// Optional server-only read token (needed only for draft previews / private
// datasets). Published content in a public dataset reads without it.
export const readToken = process.env.SANITY_API_READ_TOKEN || "";
