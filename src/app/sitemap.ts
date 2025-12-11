// app/sitemap.ts
import type { MetadataRoute } from "next";

const DEFAULT_SITE_URL =
  process.env.NODE_ENV === "production"
    ? "https://wordtowallet.com"
    : "http://localhost:3065";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || DEFAULT_SITE_URL;

const locales = [
  "en",
  "fr",
  "de",
  "es",
  "cs",
  "it",
  "pt",
  "nl",
  "pl",
  "ro",
  "hu",
  "id",
  "ja",
  "ko",
  "ms",
  "se",
  "sr",
  "th",
  "tr",
  "uk",
  "vi",
  "zh",
  // add/remove based on your JSON files
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages (home, blogs list, etc.)
  const staticPaths = ["", "/blogs"]; // "" = home, adjust as needed

  const staticEntries = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }))
  );

  // Dynamic blog posts (example)
  // Replace this with your real source (CMS, filesystem, DB, etc.)
  const posts = await getAllBlogSlugs(); // e.g. [{ slug: "how-to-do-x", updatedAt: Date }]

  const blogEntries = posts.flatMap((post) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/blogs/${post.slug}`,
      lastModified: post.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  return [...staticEntries, ...blogEntries];
}

// Dummy example – implement this with your real data source
async function getAllBlogSlugs() {
  return [
    { slug: "example-post", updatedAt: new Date() },
    // ...
  ];
}
