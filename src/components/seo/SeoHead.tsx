import Head from "next/head";

type JsonLd = Record<string, unknown>;

type SeoHeadProps = {
  siteUrl: string;
  title: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  locale?: string;
  structuredData?: JsonLd | JsonLd[];
  /** Google Search Console verification token (from SEO settings `googleConsole`). */
  googleSiteVerification?: string;
};

const toCanonical = (siteUrl: string, canonicalPath?: string) => {
  if (!canonicalPath) return undefined;

  if (/^https?:\/\//i.test(canonicalPath)) {
    return canonicalPath;
  }

  const origin = siteUrl.replace(/\/$/, "");
  const path = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;
  return `${origin}${path}`;
};

const toAbsoluteImage = (siteUrl: string, value?: string) => {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;

  const origin = siteUrl.replace(/\/$/, "");
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${origin}${path}`;
};

export function SeoHead({
  siteUrl,
  title,
  description,
  keywords,
  canonicalPath,
  image,
  type = "website",
  noIndex = false,
  locale = "ar_SA",
  structuredData,
  googleSiteVerification,
}: SeoHeadProps) {
  const canonical = toCanonical(siteUrl, canonicalPath);
  const imageUrl = toAbsoluteImage(siteUrl, image);
  const structured = Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : [];
  const verification = googleSiteVerification?.trim();

  return (
    <Head>
      <title>{title}</title>
      {verification ? <meta name="google-site-verification" content={verification} /> : null}
      {description ? <meta name="description" content={description} /> : null}
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}

      <meta property="og:locale" content={locale} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}

      <meta name="twitter:card" content={imageUrl ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}

      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}

      {structured.map((item, index) => (
        <script
          key={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Head>
  );
}
