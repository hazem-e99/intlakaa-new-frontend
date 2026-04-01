import dynamic from "next/dynamic";
import { SeoHead } from "@/components/seo/SeoHead";

const ChangePasswordPage = dynamic(() => import("@/pages/ChangePassword"), { ssr: false });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://intlakaa.com";

export default function AdminChangePasswordRoute() {
  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title="تغيير كلمة المرور"
        description="تغيير كلمة مرور حساب الإدارة"
        canonicalPath="/admin/change-password"
        noIndex
      />
      <ChangePasswordPage />
    </>
  );
}
