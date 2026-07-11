import { defineConfig, type StructureResolver } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

// One Sanity project, one dataset, TWO workspaces. Each workspace is scoped to a
// `site` value so the Core editor never sees Plus content and vice versa — the
// two blogs and two sites come from that one field. Run with `npm run studio`.

const siteStructure = (site: "core" | "plus"): StructureResolver => (S) =>
  S.list()
    .title(site === "core" ? "Core content" : "Plus content")
    .items([
      S.listItem()
        .id("pages")
        .title("Pages")
        .child(
          S.documentList()
            .title("Pages")
            .filter('_type == "page" && coalesce(site, "core") == $site')
            .params({ site })
            .initialValueTemplates([]),
        ),
      S.listItem()
        .id("posts")
        .title("Blog posts")
        .child(
          S.documentList()
            .title("Blog posts")
            .filter('_type == "post" && coalesce(site, "core") == $site')
            .params({ site }),
        ),
      S.listItem()
        .id("settings")
        .title("Site settings")
        .child(
          S.documentList()
            .title("Site settings")
            .filter('_type == "siteSettings" && coalesce(site, "core") == $site')
            .params({ site }),
        ),
    ]);

const workspace = (site: "core" | "plus") => ({
  name: site,
  title: site === "core" ? "ShipTime — Core" : "ShipTime — Plus",
  basePath: `/${site}`,
  projectId,
  dataset,
  plugins: [
    structureTool({ structure: siteStructure(site) }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: { types: schemaTypes },
  // New documents created in a workspace default to that workspace's site.
  document: {
    newDocumentOptions: (prev: unknown[]) => prev,
  },
});

export default defineConfig([workspace("core"), workspace("plus")]);
