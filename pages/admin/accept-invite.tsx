import dynamic from "next/dynamic";
import { SeoHead } from "@/components/seo/SeoHead";

const AcceptInvitePage = dynamic(() => import("@/pages/AcceptInvite"), { ssr: false });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://intlakaa.com";

export default function AdminAcceptInviteRoute() {
  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title="قبول دعوة الإدارة"
        description="إعداد حساب مسؤول جديد"
        canonicalPath="/admin/accept-invite"
        noIndex
      />
      <AcceptInvitePage />
    </>
  );
}
