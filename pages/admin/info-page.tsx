import dynamic from "next/dynamic";
import { SeoHead } from "@/components/seo/SeoHead";
import { AdminPageWrapper } from "@/components/AdminPageWrapper";

const InfoPageManagementPage = dynamic(() => import("@/pages/InfoPageManagement"), { ssr: false });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://intlakaa.com";

export default function AdminInfoPageRoute() {
  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title="إدارة صفحة المعلومات"
        description="إدارة محتوى صفحة /info"
        canonicalPath="/admin/info-page"
        noIndex
      />
      <AdminPageWrapper>
        <InfoPageManagementPage />
      </AdminPageWrapper>
    </>
  );
}
