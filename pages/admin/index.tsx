import dynamic from "next/dynamic";
import { SeoHead } from "@/components/seo/SeoHead";
import { AdminPageWrapper } from "@/components/AdminPageWrapper";

const DashboardPage = dynamic(() => import("@/pages/Dashboard"), { ssr: false });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://intlakaa.com";

export default function AdminDashboardRoute() {
  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title="لوحة الإدارة"
        description="لوحة التحكم الداخلية"
        canonicalPath="/admin"
        noIndex
      />
      <AdminPageWrapper>
        <DashboardPage />
      </AdminPageWrapper>
    </>
  );
}
