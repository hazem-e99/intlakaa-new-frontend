import NotFoundPage from "@/pages/NotFound";
import { SeoHead } from "@/components/seo/SeoHead";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://intlakaa.com";

export default function NotFoundRoute() {
  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title="404 - الصفحة غير موجودة"
        description="الصفحة التي تبحث عنها غير موجودة."
        canonicalPath="/404"
        noIndex
      />
      <NotFoundPage />
    </>
  );
}
