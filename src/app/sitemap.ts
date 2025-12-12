// app/sitemap.ts
import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import axios from "axios";

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

  const nowStr = now;

  // Discover static routes by walking src/app/[locale]
  const appLocaleDir = path.join(process.cwd(), "src", "app", "[locale]");

  function walkRoutes(dir: string, baseRoute = ""): { static: string[]; dynamics: string[] } {
    const staticRoutes: string[] = [];
    const dynamicRoutes: string[] = [];

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // dynamic segment
        if (/^\[.+\]$/.test(entry.name)) {
          dynamicRoutes.push(path.join(baseRoute, entry.name));
        }

        // if this folder contains a page.tsx then add its route
        const pageFile = path.join(entryPath, "page.tsx");
        if (!/^\[.+\]$/.test(entry.name) && fs.existsSync(pageFile)) {
          staticRoutes.push(path.join(baseRoute, entry.name));
        }

        // Recurse
        const nested = walkRoutes(entryPath, path.join(baseRoute, entry.name));
        staticRoutes.push(...nested.static);
        dynamicRoutes.push(...nested.dynamics);
      }
    }

    return { static: staticRoutes, dynamics: dynamicRoutes };
  }

  let staticPaths: string[] = [];
  let dynamicPaths: string[] = [];

  try {
    const { static: s, dynamics: d } = walkRoutes(appLocaleDir, "");
    // Normalize to URL path patterns
    staticPaths = Array.from(new Set(s)).map((p) => `/${p.replace(/\\/g, "/")}`.replace(/\/$/, ""));
    dynamicPaths = Array.from(new Set(d)).map((p) => `/${p.replace(/\\/g, "/")}`.replace(/\/$/, ""));
    // Root locale page (page.tsx at [locale]/page.tsx) should map to '/'
    if (fs.existsSync(path.join(appLocaleDir, "page.tsx"))) {
      staticPaths.push("");
    }
  } catch (err) {
    // If anything goes wrong reading the filesystem, fall back to minimal set
    staticPaths = ["", "/blogs"];
  }

  const staticEntries = locales.flatMap((locale) =>
    staticPaths.map((p) => ({
      url: `${SITE_URL}/${locale}${p}`,
      lastModified: nowStr,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.8,
    }))
  );

  // For dynamic routes we try to enumerate slugs for known patterns (blogs, book)
  const blogEntries: MetadataRoute.Sitemap = [];
  const bookEntries: MetadataRoute.Sitemap = [];

  // try to fetch published blogs
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const blogRes = await axios.get(`${apiBase.replace(/\/$/, "")}/blogs/published?limit=1000`);
    const blogs: Array<{ slug: string; updatedAt?: string; publishedAt?: string }> = blogRes.data?.data || blogRes.data || [];

    for (const blog of blogs) {
      const blogLast = blog.updatedAt ?? blog.publishedAt;
      for (const locale of locales) {
        blogEntries.push({
          url: `${SITE_URL}/${locale}/blogs/${blog.slug}`,
          lastModified: blogLast ? new Date(blogLast) : nowStr,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch (err) {
    // ignore failures - blogs will at least be reachable via /blogs index
  }

  // try to fetch public delivery links (book pages)
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    // Try a few public endpoints that might exist on the API
    const candidates = [
      `${apiBase.replace(/\/$/, "")}/delivery-links/public`,
      `${apiBase.replace(/\/$/, "")}/delivery-links?public=true`,
      `${apiBase.replace(/\/$/, "")}/delivery-links`,
    ];

    let links: Array<{ slug: string; updatedAt?: string }> = [];
    for (const url of candidates) {
      try {
        const res = await axios.get(url, { params: { limit: 1000 } });
        const data = res.data?.data || res.data;
        if (Array.isArray(data) && data.length) {
          links = data;
          break;
        }
        // Some APIs return object { deliveryLinks: [...] }
        if (data?.deliveryLinks && Array.isArray(data.deliveryLinks) && data.deliveryLinks.length) {
          links = data.deliveryLinks;
          break;
        }
      } catch (e) {
        // try next
      }
    }

    for (const link of links) {
      const linkLast = link.updatedAt;
      for (const locale of locales) {
        bookEntries.push({
          url: `${SITE_URL}/${locale}/book/${link.slug}`,
          lastModified: linkLast ? new Date(linkLast) : nowStr,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch (err) {
    // ignore
  }

  return [...staticEntries, ...blogEntries, ...bookEntries];
}

// Dummy example – implement this with your real data source
async function getAllBlogSlugs() {
  return [
    { slug: "example-post", updatedAt: new Date() },
    // ...
  ];
}
