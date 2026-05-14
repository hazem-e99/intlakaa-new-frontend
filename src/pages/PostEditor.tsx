import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, createPost, updatePost, Block, Post } from '@/services/cmsService';
import { BlockEditor } from '@/components/BlockEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Save, Eye, X, Plus } from 'lucide-react';

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    const val = tagInput.trim();
    if (!val) return;
    setPost(prev => ({ ...prev, tags: [...(prev.tags || []), val] }));
    setTagInput('');
  };
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<Partial<Post>>({
    title: '',
    slug: '',
    excerpt: '',
    coverImage: '',
    status: 'draft',
    blocks: [],
    author: '',
    tags: [],
    seoTitle: '',
    seoDescription: '',
  });

  useEffect(() => {
    if (!isNew) {
      fetchPostById(id!).then(data => {
        setPost(data);
        setLoading(false);
      }).catch(() => {
        toast({ title: 'خطأ', description: 'فشل تحميل المقال', variant: 'destructive' });
        navigate('/admin/pages');
      });
    }
  }, [id]);

  const handleTitleChange = (title: string) => {
    setPost(prev => ({
      ...prev,
      title,
      ...(isNew ? {
        slug: title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '')
      } : {}),
    }));
  };

  const handleSave = async (status?: 'published' | 'draft') => {
    if (!post.title) {
      toast({ title: 'خطأ', description: 'العنوان مطلوب', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const data = { ...post, ...(status ? { status } : {}) };
      if (isNew) {
        const created = await createPost(data);
        toast({ title: '✅ تم إنشاء المقال بنجاح' });
        navigate(`/admin/posts/${created._id}`, { replace: true });
      } else {
        const updated = await updatePost(id!, data);
        setPost(updated);
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
            <h1 className="text-xl font-bold">{isNew ? 'مقال جديد' : `تعديل: ${post.title}`}</h1>
            <p className="text-xs text-muted-foreground">/blog/{post.slug || '...'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {post.status === 'published' && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="gap-2">
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

        {/* Content */}
        <TabsContent value="content" className="mt-4">
          {/* Cover Image Preview */}
          {post.coverImage && (
            <div className="mb-4 rounded-xl overflow-hidden border">
              <img
                src={post.coverImage}
                alt={post.title}
                loading="lazy"
                decoding="async"
                className="w-full max-h-56 object-cover"
              />
            </div>
          )}
          <BlockEditor
            blocks={post.blocks as Block[] || []}
            onChange={blocks => setPost(prev => ({ ...prev, blocks }))}
          />
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader><CardTitle>إعدادات المقال</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>عنوان المقال *</Label>
                <Input value={post.title || ''} onChange={e => handleTitleChange(e.target.value)} placeholder="عنوان المقال" dir="rtl" />
              </div>
              <div className="grid gap-2">
                <Label>الـ Slug</Label>
                <Input value={post.slug || ''} onChange={e => setPost(prev => ({ ...prev, slug: e.target.value }))} dir="ltr" />
                <p className="text-xs text-muted-foreground">سيكون الرابط: /blog/{post.slug}</p>
              </div>
              <div className="grid gap-2">
                <Label>مقدمة المقال (Excerpt)</Label>
                <Textarea value={post.excerpt || ''} onChange={e => setPost(prev => ({ ...prev, excerpt: e.target.value }))} placeholder="ملخص مختصر عن المقال..." rows={2} dir="rtl" />
              </div>
              <div className="grid gap-2">
                <Label>صورة الغلاف (Cover Image URL)</Label>
                <Input value={post.coverImage || ''} onChange={e => setPost(prev => ({ ...prev, coverImage: e.target.value }))} placeholder="https://..." dir="ltr" />
              </div>
              <div className="grid gap-2">
                <Label>الكاتب</Label>
                <Input value={post.author || ''} onChange={e => setPost(prev => ({ ...prev, author: e.target.value }))} placeholder="اسم الكاتب" dir="rtl" />
              </div>
              <div className="grid gap-2">
                <Label>التاجز</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    placeholder="أضف تاج..."
                    dir="rtl"
                  />
                  <Button type="button" onClick={addTag} size="sm" variant="outline" className="shrink-0">
                    <Plus className="h-4 w-4" />
                    إضافة
                  </Button>
                </div>
                {(post.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(post.tags || []).map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                        {tag}
                        <button
                          type="button"
                          onClick={() => setPost(prev => ({ ...prev, tags: (prev.tags || []).filter((_, idx) => idx !== i) }))}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label>الحالة</Label>
                <Select value={post.status} onValueChange={v => setPost(prev => ({ ...prev, status: v as any }))}>
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

        {/* SEO */}
        <TabsContent value="seo" className="mt-4">
          <Card>
            <CardHeader><CardTitle>إعدادات SEO</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>عنوان SEO</Label>
                <Input value={post.seoTitle || ''} onChange={e => setPost(prev => ({ ...prev, seoTitle: e.target.value }))} placeholder="اتركه فارغاً لاستخدام عنوان المقال" dir="rtl" />
              </div>
              <div className="grid gap-2">
                <Label>وصف SEO</Label>
                <Textarea value={post.seoDescription || ''} onChange={e => setPost(prev => ({ ...prev, seoDescription: e.target.value }))} placeholder="وصف مختصر (150-160 حرف)" rows={3} dir="rtl" />
                <p className="text-xs text-muted-foreground">{(post.seoDescription || '').length} / 160 حرف</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
