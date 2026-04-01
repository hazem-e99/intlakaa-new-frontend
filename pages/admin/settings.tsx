import dynamic from "next/dynamic";
import { SeoHead } from "@/components/seo/SeoHead";
import { AdminPageWrapper } from "@/components/AdminPageWrapper";

const SettingsPage = dynamic(() => import("@/pages/Settings"), { ssr: false });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://intlakaa.com";

export default function AdminSettingsRoute() {
  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title="إعدادات الإدارة"
        description="إعدادات النظام الداخلية"
        canonicalPath="/admin/settings"
        noIndex
      />
      <AdminPageWrapper>
        <SettingsPage />
      </AdminPageWrapper>
    </>
  );
}
