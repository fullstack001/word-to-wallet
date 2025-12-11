import type { MetadataRoute } from "next";

const DEFAULT_SITE_URL =
  process.env.NODE_ENV === "production"
    ? "https://wordtowallet.com"
    : "http://localhost:3065";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || DEFAULT_SITE_URL;

const PROTECTED_SEGMENTS = [
  "account",
  "admin",
  "arc",
  "checkout",
  "dashboard",
  "delivery",
  "integrations",
  "login",
  "mail-campaigns",
  "payment",
  "sale-links",
  "signup",
  "write-book",
];

const DISALLOWED_PATHS = [
  "/api",
  "/api/*",
  ...PROTECTED_SEGMENTS.flatMap((segment) => [
    `/${segment}`,
    `/${segment}/*`,
    `/*/${segment}`,
    `/*/${segment}/*`,
  ]),
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",          // root
          "/en/*",      // all English pages
          "/fr/*",      // all French pages
          "/blogs/*",   // non-localized blog base (if any)
          "/*/blogs/*", // localized blog posts, e.g. /en/blogs/*
        ],
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`],
  };
}

