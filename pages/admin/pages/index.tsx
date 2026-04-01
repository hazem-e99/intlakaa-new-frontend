import dynamic from "next/dynamic";
import { SeoHead } from "@/components/seo/SeoHead";
import { AdminPageWrapper } from "@/components/AdminPageWrapper";

const PagesManagementPage = dynamic(() => import("@/pages/PagesManagement"), { ssr: false });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://intlakaa.com";

export default function AdminPagesManagementRoute() {
  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title="إدارة الصفحات والمحتوى"
        description="إدارة الصفحات والمنشورات"
        canonicalPath="/admin/pages"
        noIndex
      />
      <AdminPageWrapper>
        <PagesManagementPage />
      </AdminPageWrapper>
    </>
  );
}
