const fs = require("fs");
const path = require("path");

const siteUrl = "https://wordtowallet.com";
const locales = [
  "en",
  "zh",
  "cs",
  "nl",
  "fr",
  "de",
  "el",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "ms",
  "pl",
  "pt",
  "ro",
  "sr",
  "es",
  "se",
  "th",
  "tr",
  "uk",
  "vi",
  "fi",
];

const allowPaths = [
  "",
  "/contact",
  "/plan",
  "/privacy-policy",
  "/terms",
  "/gpt",
  "/auctions",
];

const today = "2025-12-13";

const ensureDir = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const writeRobots = () => {
  let robots =
    "User-agent: *\n" +
    "Disallow: /\n" +
    "Allow: /sitemap.xml\n" +
    "Allow: /\n";

  locales.forEach((locale) => {
    allowPaths.forEach((p) => {
      robots += `Allow: /${locale}${p}\n`;
    });
  });

  const robotsPath = path.join("public", "robots.txt");
  ensureDir(robotsPath);
  fs.writeFileSync(robotsPath, robots.trimEnd() + "\n");
};

const writeSitemap = () => {
  const urlSet = new Set([`${siteUrl}/`]);

  locales.forEach((locale) => {
    allowPaths.forEach((p) => {
      const url = `${siteUrl}/${locale}${p}`;
      urlSet.add(url.replace(/([^:])\/{2,}/g, "$1/").replace(/\/+$/, ""));
    });
  });

  const urlXml = Array.from(urlSet)
    .map(
      (loc) =>
        "  <url>\n" +
        `    <loc>${loc}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        "    <changefreq>weekly</changefreq>\n" +
        `    <priority>${loc === `${siteUrl}/` ? "1.0" : "0.8"}</priority>\n` +
        "  </url>"
    )
    .join("\n");

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${urlXml}\n` +
    "</urlset>\n";

  const sitemapPath = path.join("public", "sitemap.xml");
  ensureDir(sitemapPath);
  fs.writeFileSync(sitemapPath, xml);
};

writeRobots();
writeSitemap();
