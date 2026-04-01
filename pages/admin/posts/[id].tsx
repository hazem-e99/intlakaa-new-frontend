import dynamic from "next/dynamic";
import { SeoHead } from "@/components/seo/SeoHead";
import { AdminPageWrapper } from "@/components/AdminPageWrapper";

const PostEditor = dynamic(() => import("@/pages/PostEditor"), { ssr: false });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://intlakaa.com";

export default function AdminPostEditorRoute() {
  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title="محرر المقال"
        description="تحرير محتوى المقال"
        canonicalPath="/admin/posts"
        noIndex
      />
      <AdminPageWrapper>
        <PostEditor />
      </AdminPageWrapper>
    </>
  );
}
