import type { GetStaticPaths, GetStaticProps } from "next";
import DynamicPageView from "@/pages/DynamicPage";
import type { Page } from "@/services/cmsService";
import type { SeoSettings } from "@/services/seoService";
import { SeoHead } from "@/components/seo/SeoHead";
import {
  RESERVED_PUBLIC_SLUGS,
  getPageBySlugServer,
  getPublishedPagesServer,
  getSeoSettingsServer,
  getSiteUrl,
  toAbsoluteUrl,
} from "@/lib/serverApi";

type DynamicRouteProps = {
  seo: SeoSettings | null;
  siteUrl: string;
  page: Page;
};

type Params = {
  slug: string;
};

export default function DynamicRoute({ seo, siteUrl, page }: DynamicRouteProps) {
  const title = page.seoTitle || page.title;
  const description = page.seoDescription || seo?.metaDescription || page.title;
  const image = seo?.ogImage || "/logo.webp";

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description,
    inLanguage: "ar",
    url: `${siteUrl}/${page.slug}`,
    primaryImageOfPage: toAbsoluteUrl(siteUrl, image),
  };

  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title={title}
        description={description}
        keywords={seo?.keywords}
        canonicalPath={`/${page.slug}`}
        image={image}
        type="website"
        structuredData={webPageSchema}
      />
      <DynamicPageView slug={page.slug} initialPage={page} initialLoaded />
    </>
  );
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const pages = await getPublishedPagesServer();

  return {
    paths: pages
      .filter((page) => page.slug && !RESERVED_PUBLIC_SLUGS.has(page.slug))
      .map((page) => ({
        params: {
          slug: page.slug,
        },
      })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<DynamicRouteProps, Params> = async ({ params }) => {
  const slug = params?.slug;

  if (!slug || RESERVED_PUBLIC_SLUGS.has(slug)) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const [seo, page] = await Promise.all([getSeoSettingsServer(), getPageBySlugServer(slug)]);

  if (!page || page.status !== "published") {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const siteUrl = getSiteUrl(seo);

  return {
    props: {
      seo,
      siteUrl,
      page,
    },
    revalidate: 300,
  };
};
