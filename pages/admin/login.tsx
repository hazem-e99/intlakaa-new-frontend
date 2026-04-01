import dynamic from "next/dynamic";
import { SeoHead } from "@/components/seo/SeoHead";

const LoginPage = dynamic(() => import("@/pages/Login"), { ssr: false });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://intlakaa.com";

export default function AdminLoginRoute() {
  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title="تسجيل دخول الإدارة"
        description="تسجيل دخول لوحة إدارة انطلاقة"
        canonicalPath="/admin/login"
        noIndex
      />
      <LoginPage />
    </>
  );
}
