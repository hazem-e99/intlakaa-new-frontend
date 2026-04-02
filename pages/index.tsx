import type { GetStaticProps } from "next";
import HomePage from "@/pages/Index";
import type { SeoSettings } from "@/services/seoService";
import { SeoHead } from "@/components/seo/SeoHead";
import { getSeoSettingsServer, getSiteUrl, toAbsoluteUrl } from "@/lib/serverApi";

type HomeRouteProps = {
  seo: SeoSettings | null;
  siteUrl: string;
};

export default function HomeRoute({ seo, siteUrl }: HomeRouteProps) {
  const title = seo?.siteTitle || "انطلاقة | وكالة تسويق";
  const description =
    seo?.metaDescription ||
    "بنساعدك تخلي نموك أسرع وحملاتك أذكى مع استراتيجيات تسويقية قائمة على النتائج";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "انطلاقة",
    url: siteUrl,
    logo: toAbsoluteUrl(siteUrl, seo?.ogImage || "/logo.webp"),
    sameAs: (seo?.socialLinks || []).map((item) => item.url).filter(Boolean),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "انطلاقة",
    url: siteUrl,
    inLanguage: "ar",
  };

  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title={title}
        description={description}
        keywords={seo?.keywords}
        canonicalPath="/"
        image={seo?.ogImage || "/logo.webp"}
        type="website"
        structuredData={[organizationSchema, websiteSchema]}
      />
      <HomePage />
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeRouteProps> = async () => {
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
