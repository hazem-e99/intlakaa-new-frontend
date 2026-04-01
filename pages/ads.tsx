import type { GetStaticProps } from "next";
import AdsLandingPage from "@/pages/AdsLanding";
import type { SeoSettings } from "@/services/seoService";
import { SeoHead } from "@/components/seo/SeoHead";
import { getSeoSettingsServer, getSiteUrl, toAbsoluteUrl } from "@/lib/serverApi";

type AdsRouteProps = {
  seo: SeoSettings | null;
  siteUrl: string;
};

export default function AdsRoute({ seo, siteUrl }: AdsRouteProps) {
  const baseTitle = seo?.siteTitle || "انطلاقة";
  const description = "احجز استشارة مجانية مع انطلاقة واكتشف كيف نضاعف مبيعاتك بحملات تسويقية قائمة على البيانات.";
  const image = seo?.ogImage || "/logo.png";

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `ضاعف مبيعاتك في 90 يومًا | ${baseTitle}`,
    description,
    inLanguage: "ar",
    url: `${siteUrl}/ads`,
    primaryImageOfPage: toAbsoluteUrl(siteUrl, image),
  };

  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title={`ضاعف مبيعاتك في 90 يومًا | ${baseTitle}`}
        description={description}
        canonicalPath="/ads"
        image={image}
        type="website"
        structuredData={webPageSchema}
      />
      <AdsLandingPage />
    </>
  );
}

export const getStaticProps: GetStaticProps<AdsRouteProps> = async () => {
  const seo = await getSeoSettingsServer();
  const siteUrl = getSiteUrl(seo);

  return {
    props: {
      seo,
      siteUrl,
    },
    revalidate: 600,
  };
};
