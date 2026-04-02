import type { GetStaticPaths, GetStaticProps } from "next";
import BlogPostPage from "@/pages/BlogPost";
import type { Post } from "@/services/cmsService";
import type { SeoSettings } from "@/services/seoService";
import { SeoHead } from "@/components/seo/SeoHead";
import { getPostBySlugServer, getPublishedPostsServer, getSeoSettingsServer, getSiteUrl, toAbsoluteUrl } from "@/lib/serverApi";

type BlogPostRouteProps = {
  seo: SeoSettings | null;
  siteUrl: string;
  post: Post;
};

type Params = {
  slug: string;
};

export default function BlogPostRoute({ seo, siteUrl, post }: BlogPostRouteProps) {
  const title = post.seoTitle || post.title;
  const description =
    post.seoDescription || post.excerpt || seo?.metaDescription || "مقال من مدونة انطلاقة";
  const image = post.coverImage || seo?.ogImage || "/logo.webp";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    image: toAbsoluteUrl(siteUrl, image),
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    inLanguage: "ar",
    author: {
      "@type": "Person",
      name: post.author || "فريق انطلاقة",
    },
    publisher: {
      "@type": "Organization",
      name: "انطلاقة",
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl(siteUrl, "/logo.webp"),
      },
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <>
      <SeoHead
        siteUrl={siteUrl}
        title={title}
        description={description}
        keywords={seo?.keywords}
        canonicalPath={`/blog/${post.slug}`}
        image={image}
        type="article"
        structuredData={articleSchema}
      />
      <BlogPostPage slug={post.slug} initialPost={post} initialLoaded />
    </>
  );
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const posts = await getPublishedPostsServer(200);

  return {
    paths: posts
      .filter((post) => post.slug)
      .map((post) => ({
        params: {
          slug: post.slug,
        },
      })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<BlogPostRouteProps, Params> = async ({ params }) => {
  const slug = params?.slug;
  if (!slug) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const [seo, post] = await Promise.all([getSeoSettingsServer(), getPostBySlugServer(slug)]);

  if (!post || post.status !== "published") {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const siteUrl = getSiteUrl(seo);

  return {
    props: {
      seo,
      siteUrl,
      post,
    },
    revalidate: 300,
  };
};
