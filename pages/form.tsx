import type { GetStaticProps } from "next";
import FormPage from "@/pages/Form";
import type { SeoSettings } from "@/services/seoService";
import { SeoHead } from "@/components/seo/SeoHead";
import { getSeoSettingsServer, getSiteUrl, toAbsoluteUrl } from "@/lib/serverApi";

type FormRouteProps = {
  seo: SeoSettings | null;
  siteUrl: string;
};

export default function FormRoute({ seo, siteUrl }: FormRouteProps) {
  const baseTitle = seo?.siteTitle || "انطلاقة";
  const description = "احجز استشارة تسويقية مجانية مع فريق انطلاقة واحصل على خطة نمو مخصصة لمشروعك.";
  const image = seo?.ogImage || "/logo.webp";

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `احجز استشارتك المجانية | ${baseTitle}`,
    description,
    inLanguage: "ar",
    url: `${siteUrl}/form`,
    primaryImageOfPage: toAbsoluteUrl(siteUrl, image),
  };

  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title={`احجز استشارتك المجانية | ${baseTitle}`}
        description={description}
        keywords={seo?.keywords}
        canonicalPath="/form"
        image={image}
        type="website"
        structuredData={webPageSchema}
      />
      <FormPage />
    </>
  );
}

export const getStaticProps: GetStaticProps<FormRouteProps> = async () => {
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
