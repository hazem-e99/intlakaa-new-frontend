import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPages, fetchPosts, deletePage, deletePost, Page, Post } from '@/services/cmsService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Globe, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function PagesManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'page' | 'post'; id: string; title: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pagesData, postsData] = await Promise.all([
        fetchPages(),
        fetchPosts({ limit: 100 }),
      ]);
      setPages(pagesData);
      setPosts(postsData.data);
    } catch (err) {
      toast({ title: 'خطأ', description: 'فشل تحميل البيانات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'page') {
        await deletePage(deleteTarget.id);
        setPages(prev => prev.filter(p => p._id !== deleteTarget.id));
      } else {
        await deletePost(deleteTarget.id);
        setPosts(prev => prev.filter(p => p._id !== deleteTarget.id));
      }
      toast({ title: '✅ تم الحذف بنجاح' });
    } catch (err: any) {
      toast({ title: 'خطأ', description: err?.response?.data?.message || 'فشل الحذف', variant: 'destructive' });
    } finally {
      setDeleteTarget(null);
    }
  };

  const statusBadge = (status: string) => (
    <Badge variant={status === 'published' ? 'default' : 'secondary'}>
      {status === 'published' ? 'منشور' : 'مسودة'}
    </Badge>
  );

  const typeBadge = (type: string) => {
    const map: Record<string, string> = { home: 'الرئيسية', blog: 'مدونة', page: 'صفحة' };
    return <Badge variant="outline">{map[type] || type}</Badge>;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة الصفحات والمحتوى</h1>
          <p className="text-muted-foreground text-sm mt-1">أنشئ وعدّل صفحات موقعك ومقالات مدونتك</p>
        </div>
      </div>

      <Tabs defaultValue="pages">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="pages">الصفحات ({pages.length})</TabsTrigger>
          <TabsTrigger value="posts">المقالات ({posts.length})</TabsTrigger>
        </TabsList>

        {/* ── Pages Tab ── */}
        <TabsContent value="pages" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button onClick={() => navigate('/admin/pages/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              صفحة جديدة
            </Button>
          </div>

          {pages.length === 0 ? (
            <EmptyState icon={Globe} title="لا توجد صفحات" sub="ابدأ بإنشاء صفحتك الأولى" />
          ) : (
            <div className="grid gap-3">
              {pages.map(page => (
                <Card key={page._id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{page.title}</span>
                        {typeBadge(page.type)}
                        {statusBadge(page.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        /{page.slug} · آخر تعديل: {format(new Date(page.updatedAt), 'dd MMM yyyy', { locale: ar })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {page.status === 'published' && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/${page.type === 'home' ? '' : page.slug}`} target="_blank" rel="noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/pages/${page._id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {page.type !== 'home' && (
                      <Button
                        variant="ghost" size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget({ type: 'page', id: page._id, title: page.title })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Posts Tab ── */}
        <TabsContent value="posts" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button onClick={() => navigate('/admin/posts/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              مقال جديد
            </Button>
          </div>

          {posts.length === 0 ? (
            <EmptyState icon={FileText} title="لا توجد مقالات" sub="ابدأ بكتابة أول مقال في مدونتك" />
          ) : (
            <div className="grid gap-3">
              {posts.map(post => (
                <Card key={post._id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        className="h-12 w-16 rounded object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-16 rounded bg-muted flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{post.title}</span>
                        {statusBadge(post.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        /blog/{post.slug} · {format(new Date(post.updatedAt), 'dd MMM yyyy', { locale: ar })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.status === 'published' && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/posts/${post._id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget({ type: 'post', id: post._id, title: post.title })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف "{deleteTarget?.title}"؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse">
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              نعم، احذف
            </AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EmptyState({ icon: Icon, title, sub }: { icon: any; title: string; sub: string }) {
  return (
    <div className="text-center py-16 border-2 border-dashed rounded-xl">
      <Icon className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
      <p className="font-semibold text-muted-foreground">{title}</p>
      <p className="text-sm text-muted-foreground/60 mt-1">{sub}</p>
    </div>
  );
}
