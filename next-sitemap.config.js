const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://intlakaa.com";

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  outDir: "public",
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
    ],
  },
  exclude: ["/admin", "/admin/*", "/api/*", "/404"],
};

export default config;
