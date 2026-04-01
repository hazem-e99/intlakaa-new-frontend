import dynamic from "next/dynamic";
import { SeoHead } from "@/components/seo/SeoHead";
import { AdminPageWrapper } from "@/components/AdminPageWrapper";

const ManageAdminsPage = dynamic(() => import("@/pages/ManageAdmins"), { ssr: false });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://intlakaa.com";

export default function AdminManageAdminsRoute() {
  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title="إدارة الأدمنز"
        description="إدارة مستخدمي لوحة التحكم"
        canonicalPath="/admin/manage-admins"
        noIndex
      />
      <AdminPageWrapper>
        <ManageAdminsPage />
      </AdminPageWrapper>
    </>
  );
}
