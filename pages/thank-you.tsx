import type { GetStaticProps } from "next";
import ThankYouPage from "@/pages/ThankYou";
import type { SeoSettings } from "@/services/seoService";
import { SeoHead } from "@/components/seo/SeoHead";
import { getSeoSettingsServer, getSiteUrl } from "@/lib/serverApi";

type ThankYouRouteProps = {
  seo: SeoSettings | null;
  siteUrl: string;
};

export default function ThankYouRoute({ seo, siteUrl }: ThankYouRouteProps) {
  const baseTitle = seo?.siteTitle || "انطلاقة";

  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title={`شكرا لتواصلك معنا | ${baseTitle}`}
        description="تم استلام طلبك بنجاح. سيتواصل معك فريق انطلاقة في أقرب وقت."
        canonicalPath="/thank-you"
        image={seo?.ogImage || "/logo.webp"}
        noIndex
      />
      <ThankYouPage />
    </>
  );
}

export const getStaticProps: GetStaticProps<ThankYouRouteProps> = async () => {
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
