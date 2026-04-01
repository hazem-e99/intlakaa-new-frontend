import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPageById, createPage, updatePage, Block, Page } from '@/services/cmsService';
import { BlockEditor } from '@/components/BlockEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Save, Eye } from 'lucide-react';

export default function PageEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState<Partial<Page>>({
    title: '',
    slug: '',
    type: 'page',
    status: 'draft',
    blocks: [],
    seoTitle: '',
    seoDescription: '',
  });

  useEffect(() => {
    if (!isNew) {
      fetchPageById(id!).then(data => {
        setPage(data);
        setLoading(false);
      }).catch(() => {
        toast({ title: 'خطأ', description: 'فشل تحميل الصفحة', variant: 'destructive' });
        navigate('/admin/pages');
      });
    }
  }, [id]);

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setPage(prev => ({
      ...prev,
      title,
      ...(isNew ? {
        slug: title
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]/g, '')
      } : {}),
    }));
  };

  const handleSave = async (status?: 'published' | 'draft') => {
    if (!page.title) {
      toast({ title: 'خطأ', description: 'العنوان مطلوب', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const data = { ...page, ...(status ? { status } : {}) };
      if (isNew) {
        const created = await createPage(data);
        toast({ title: '✅ تم إنشاء الصفحة بنجاح' });
        navigate(`/admin/pages/${created._id}`, { replace: true });
      } else {
        const updated = await updatePage(id!, data);
        setPage(updated);
        toast({ title: '✅ تم الحفظ بنجاح' });
      }
    } catch (err: any) {
      toast({ title: 'خطأ', description: err?.response?.data?.message || 'فشل الحفظ', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 pb-20" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/pages')}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{isNew ? 'صفحة جديدة' : `تعديل: ${page.title}`}</h1>
            <p className="text-xs text-muted-foreground">/{page.slug || '...'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {page.status === 'published' && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/${page.type === 'home' ? '' : page.slug}`} target="_blank" rel="noreferrer" className="gap-2">
                <Eye className="h-4 w-4" /> معاينة
              </a>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => handleSave('draft')} disabled={saving}>
            حفظ مسودة
          </Button>
          <Button size="sm" onClick={() => handleSave('published')} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'جاري الحفظ...' : 'نشر'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">المحتوى</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* ── Content Tab ── */}
        <TabsContent value="content" className="mt-4">
          <BlockEditor
            blocks={page.blocks as Block[] || []}
            onChange={blocks => setPage(prev => ({ ...prev, blocks }))}
          />
        </TabsContent>

        {/* ── Settings Tab ── */}
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader><CardTitle>إعدادات الصفحة</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>عنوان الصفحة *</Label>
                <Input
                  value={page.title || ''}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="مثال: من نحن"
                  dir="rtl"
                />
              </div>
              <div className="grid gap-2">
                <Label>الـ Slug (رابط الصفحة)</Label>
                <Input
                  value={page.slug || ''}
                  onChange={e => setPage(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="about-us"
                  dir="ltr"
                  disabled={page.type === 'home'}
                />
                {page.type !== 'home' && (
                  <p className="text-xs text-muted-foreground">سيكون رابط الصفحة: /{page.slug}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>نوع الصفحة</Label>
                <Select
                  value={page.type}
                  onValueChange={v => setPage(prev => ({ ...prev, type: v as any }))}
                  disabled={page.type === 'home'}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">صفحة عادية</SelectItem>
                    <SelectItem value="blog">صفحة مدونة</SelectItem>
                    <SelectItem value="home">الصفحة الرئيسية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>الحالة</Label>
                <Select value={page.status} onValueChange={v => setPage(prev => ({ ...prev, status: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="published">منشور</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── SEO Tab ── */}
        <TabsContent value="seo" className="mt-4">
          <Card>
            <CardHeader><CardTitle>إعدادات SEO</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>عنوان SEO</Label>
                <Input
                  value={page.seoTitle || ''}
                  onChange={e => setPage(prev => ({ ...prev, seoTitle: e.target.value }))}
                  placeholder="اتركه فارغاً لاستخدام عنوان الصفحة"
                  dir="rtl"
                />
              </div>
              <div className="grid gap-2">
                <Label>وصف SEO</Label>
                <Textarea
                  value={page.seoDescription || ''}
                  onChange={e => setPage(prev => ({ ...prev, seoDescription: e.target.value }))}
                  placeholder="وصف مختصر للصفحة (150-160 حرف)"
                  rows={3}
                  dir="rtl"
                />
                <p className="text-xs text-muted-foreground">{(page.seoDescription || '').length} / 160 حرف</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
