import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts, Post } from '@/services/cmsService';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { shouldUseUnoptimizedImage } from '@/lib/imageUtils';

type BlogProps = {
  initialPosts?: Post[];
  initialLoaded?: boolean;
};

export default function Blog({ initialPosts = [], initialLoaded = false }: BlogProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(!initialLoaded);

  useEffect(() => {
    if (initialLoaded) return;

    fetchPosts({ status: 'published', limit: 50 })
      .then(({ data }) => setPosts(data))
      .finally(() => setLoading(false));
  }, [initialLoaded]);

  return (
    <div className="min-h-screen" dir="rtl">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">المدونة</h1>
            <p className="text-muted-foreground text-lg">
              أحدث المقالات والرؤى في عالم التسويق والنمو
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-2xl border bg-card p-0 overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-5 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground opacity-30 mb-4" />
              <p className="text-xl text-muted-foreground">لا توجد مقالات بعد</p>
              <p className="text-muted-foreground/60 mt-2">تابعنا قريباً لأحدث المقالات</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const useUnoptimizedImage = shouldUseUnoptimizedImage(post.coverImage);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
    >
      {post.coverImage ? (
        <div className="h-48 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={900}
            height={540}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={useUnoptimizedImage}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
          <FileText className="h-12 w-12 text-primary/30" />
        </div>
      )}
      <div className="p-5 space-y-3">
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {post.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
        <h2 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          {post.author && <span>{post.author}</span>}
          {post.publishedAt && (
            <span>{format(new Date(post.publishedAt), 'dd MMM yyyy', { locale: ar })}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
