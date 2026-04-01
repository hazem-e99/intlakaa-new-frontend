import dynamic from "next/dynamic";
import { SeoHead } from "@/components/seo/SeoHead";
import { AdminPageWrapper } from "@/components/AdminPageWrapper";

const RequestsPage = dynamic(() => import("@/pages/Requests"), { ssr: false });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://intlakaa.com";

export default function AdminRequestsRoute() {
  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title="طلبات العملاء"
        description="إدارة طلبات العملاء"
        canonicalPath="/admin/requests"
        noIndex
      />
      <AdminPageWrapper>
        <RequestsPage />
      </AdminPageWrapper>
    </>
  );
}
