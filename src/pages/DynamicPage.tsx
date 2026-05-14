import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPageBySlug, Page } from '@/services/cmsService';
import { PageContent } from '@/components/PageContent';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

type DynamicPageProps = {
  slug?: string;
  initialPage?: Page | null;
  initialNotFound?: boolean;
  initialLoaded?: boolean;
};

export default function DynamicPage({
  slug: slugFromProps,
  initialPage = null,
  initialNotFound = false,
  initialLoaded = false,
}: DynamicPageProps) {
  const { slug: slugFromParams } = useParams<{ slug: string }>();
  const slug = slugFromProps || slugFromParams;

  const [page, setPage] = useState<Page | null>(initialPage);
  const [loading, setLoading] = useState(!initialLoaded && !initialPage && !initialNotFound);
  const [notFound, setNotFound] = useState(initialNotFound);

  // Reset state whenever the slug changes (SPA navigation between dynamic pages)
  useEffect(() => {
    if (initialLoaded) return;
    setPage(null);
    setNotFound(false);
    setLoading(true);
  }, [slug, initialLoaded]);

  useEffect(() => {
    if (!slug || initialLoaded) return;

    fetchPageBySlug(slug)
      .then(data => {
        if (data.status !== 'published') { setNotFound(true); return; }
        setPage(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [initialLoaded, slug]);

  useEffect(() => {
    if (page) document.title = page.seoTitle || page.title;
  }, [page]);

  return (
    <div className="min-h-screen" dir="rtl">
      <Navbar />
      <main className="pt-28 pb-20">
        {loading ? (
          <div className="container mx-auto px-4 max-w-4xl space-y-6 animate-pulse">
            <div className="h-10 bg-muted rounded w-1/2 mx-auto" />
            <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
            <div className="h-48 bg-muted rounded-xl mt-8" />
          </div>
        ) : notFound || !page ? (
          <div className="text-center py-24">
            <p className="text-2xl font-bold mb-2">الصفحة غير موجودة</p>
            <Link to="/" className="text-primary hover:underline flex items-center gap-2 justify-center mt-4">
              <ArrowRight className="h-4 w-4" /> العودة للرئيسية
            </Link>
          </div>
        ) : (
          <>
            <div className="container mx-auto px-4 max-w-4xl">
              {/* Page Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-center mb-12">{page.title}</h1>
            </div>
            {/* Page Content Blocks — handles its own containers per block */}
            <PageContent blocks={page.blocks} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
