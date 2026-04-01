import dynamic from "next/dynamic";
import { SeoHead } from "@/components/seo/SeoHead";
import { AdminPageWrapper } from "@/components/AdminPageWrapper";

const SeoManagementPage = dynamic(() => import("@/pages/SEOManagement"), { ssr: false });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://intlakaa.com";

export default function AdminSeoManagementRoute() {
  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title="إدارة SEO"
        description="إعدادات تحسين محركات البحث"
        canonicalPath="/admin/seo-management"
        noIndex
      />
      <AdminPageWrapper>
        <SeoManagementPage />
      </AdminPageWrapper>
    </>
  );
}
