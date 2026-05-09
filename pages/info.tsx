import type { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import type { SeoSettings } from "@/services/seoService";
import { SeoHead } from "@/components/seo/SeoHead";
import { getSeoSettingsServer, getSiteUrl, toAbsoluteUrl } from "@/lib/serverApi";

const LinksIntlakaa = dynamic(() => import("@/pages/LinksIntlakaa"), {
  ssr: false,
});

type InfoRouteProps = {
  seo: SeoSettings | null;
  siteUrl: string;
};

export default function InfoRoute({ seo, siteUrl }: InfoRouteProps) {
  const baseTitle = seo?.siteTitle || "انطلاقة";
  const description =
    "انطلاقة | وكالة إعلانات وتسويق رقمي — روابطنا على واتساب، تيك توك، انستغرام، يوتيوب، فيسبوك، وسناب شات.";
  const image = seo?.ogImage || "/logo.webp";

  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title={`روابط انطلاقة | ${baseTitle}`}
        description={description}
        canonicalPath="/info"
        image={image}
        type="website"
      />
      <LinksIntlakaa />
    </>
  );
}

export const getStaticProps: GetStaticProps<InfoRouteProps> = async () => {
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
