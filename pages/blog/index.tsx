import type { GetStaticProps } from "next";
import BlogPage from "@/pages/Blog";
import type { Post } from "@/services/cmsService";
import type { SeoSettings } from "@/services/seoService";
import { SeoHead } from "@/components/seo/SeoHead";
import { getPublishedPostsServer, getSeoSettingsServer, getSiteUrl } from "@/lib/serverApi";

type BlogIndexRouteProps = {
  seo: SeoSettings | null;
  siteUrl: string;
  initialPosts: Post[];
};

export default function BlogIndexRoute({ seo, siteUrl, initialPosts }: BlogIndexRouteProps) {
  const baseTitle = seo?.siteTitle || "انطلاقة";

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "مدونة انطلاقة",
    url: `${siteUrl}/blog`,
    inLanguage: "ar",
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialPosts.slice(0, 10).map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title={`المدونة | ${baseTitle}`}
        description="أحدث المقالات والرؤى في عالم التسويق والنمو من فريق انطلاقة."
        keywords={seo?.keywords}
        canonicalPath="/blog"
        image={seo?.ogImage || "/logo.webp"}
        type="website"
        structuredData={[blogSchema, itemListSchema]}
      />
      <BlogPage initialPosts={initialPosts} initialLoaded />
    </>
  );
}

export const getStaticProps: GetStaticProps<BlogIndexRouteProps> = async () => {
  const [seo, posts] = await Promise.all([getSeoSettingsServer(), getPublishedPostsServer(100)]);
  const siteUrl = getSiteUrl(seo);

  return {
    props: {
      seo,
      siteUrl,
      initialPosts: posts,
    },
    revalidate: 300,
  };
};
