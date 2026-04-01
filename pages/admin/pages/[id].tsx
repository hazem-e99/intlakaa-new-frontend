import dynamic from "next/dynamic";
import { SeoHead } from "@/components/seo/SeoHead";
import { AdminPageWrapper } from "@/components/AdminPageWrapper";

const PageEditor = dynamic(() => import("@/pages/PageEditor"), { ssr: false });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://intlakaa.com";

export default function AdminPageEditorRoute() {
  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title="محرر الصفحة"
        description="تحرير محتوى الصفحة"
        canonicalPath="/admin/pages"
        noIndex
      />
      <AdminPageWrapper>
        <PageEditor />
      </AdminPageWrapper>
    </>
  );
}
