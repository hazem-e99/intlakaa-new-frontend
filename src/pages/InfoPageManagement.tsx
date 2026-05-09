import { useEffect, useState } from "react";
import {
  fetchInfoPage,
  updateInfoPage,
  resetInfoPage,
  SOCIAL_ICON_OPTIONS,
  type InfoPageData,
  type InfoLink,
  type InfoSocial,
} from "@/services/infoPageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  Eye,
  ExternalLink,
} from "lucide-react";

const newId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const emptyLink = (order: number): InfoLink => ({
  id: newId("link"),
  title: "",
  url: "",
  image: "",
  order,
});

const emptySocial = (order: number): InfoSocial => ({
  id: newId("social"),
  label: "",
  icon: "globe",
  url: "",
  order,
});

export default function InfoPageManagement() {
  const { toast } = useToast();
  const [data, setData] = useState<InfoPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const d = await fetchInfoPage();
      setData(d);
    } catch {
      toast({ title: "خطأ", description: "فشل تحميل البيانات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;
    try {
      setSaving(true);
      const payload: Partial<InfoPageData> = {
        profile: data.profile,
        theme: data.theme,
        links: data.links.map((l, i) => ({ ...l, order: i })),
        socials: data.socials.map((s, i) => ({ ...s, order: i })),
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        isActive: data.isActive,
      };
      const updated = await updateInfoPage(payload);
      setData(updated);
      toast({ title: "✅ تم الحفظ بنجاح" });
    } catch (err: any) {
      toast({
        title: "خطأ",
        description: err?.response?.data?.message || "فشل الحفظ",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      const fresh = await resetInfoPage();
      setData(fresh);
      toast({ title: "✅ تمت استعادة القيم الافتراضية" });
    } catch {
      toast({ title: "خطأ", description: "فشل استعادة القيم", variant: "destructive" });
    } finally {
      setResetOpen(false);
    }
  };

  // ── Profile ────────────────────────────────────────────────────────────
  const setProfile = (key: keyof InfoPageData["profile"], value: string) => {
    if (!data) return;
    setData({ ...data, profile: { ...data.profile, [key]: value } });
  };

  // ── Theme ──────────────────────────────────────────────────────────────
  const setTheme = (key: keyof InfoPageData["theme"], value: string) => {
    if (!data) return;
    setData({ ...data, theme: { ...data.theme, [key]: value } });
  };

  // ── Links ──────────────────────────────────────────────────────────────
  const updateLink = (idx: number, patch: Partial<InfoLink>) => {
    if (!data) return;
    const next = [...data.links];
    next[idx] = { ...next[idx], ...patch };
    setData({ ...data, links: next });
  };
  const addLink = () => {
    if (!data) return;
    setData({ ...data, links: [...data.links, emptyLink(data.links.length)] });
  };
  const removeLink = (idx: number) => {
    if (!data) return;
    setData({ ...data, links: data.links.filter((_, i) => i !== idx) });
  };
  const moveLink = (idx: number, dir: -1 | 1) => {
    if (!data) return;
    const target = idx + dir;
    if (target < 0 || target >= data.links.length) return;
    const next = [...data.links];
    [next[idx], next[target]] = [next[target], next[idx]];
    setData({ ...data, links: next });
  };

  // ── Socials ────────────────────────────────────────────────────────────
  const updateSocial = (idx: number, patch: Partial<InfoSocial>) => {
    if (!data) return;
    const next = [...data.socials];
    next[idx] = { ...next[idx], ...patch };
    setData({ ...data, socials: next });
  };
  const addSocial = () => {
    if (!data) return;
    setData({ ...data, socials: [...data.socials, emptySocial(data.socials.length)] });
  };
  const removeSocial = (idx: number) => {
    if (!data) return;
    setData({ ...data, socials: data.socials.filter((_, i) => i !== idx) });
  };
  const moveSocial = (idx: number, dir: -1 | 1) => {
    if (!data) return;
    const target = idx + dir;
    if (target < 0 || target >= data.socials.length) return;
    const next = [...data.socials];
    [next[idx], next[target]] = [next[target], next[idx]];
    setData({ ...data, socials: next });
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة صفحة المعلومات (Info)</h1>
          <p className="text-muted-foreground text-sm mt-1">
            عدّل الروابط، السوشيال، الملف الشخصي، والألوان لصفحة /info
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <a href="/info" target="_blank" rel="noreferrer" className="gap-2">
              <Eye className="h-4 w-4" />
              معاينة
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
          <Button variant="outline" onClick={() => setResetOpen(true)} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            استعادة افتراضي
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </div>

      {/* Active toggle */}
      <Card className="p-4 flex items-center justify-between">
        <div>
          <Label className="font-semibold">الصفحة مفعّلة</Label>
          <p className="text-xs text-muted-foreground mt-1">
            عند الإيقاف ستظهر رسالة "الصفحة غير متاحة حالياً" للزوار
          </p>
        </div>
        <Switch
          checked={data.isActive ?? true}
          onCheckedChange={(v) => setData({ ...data, isActive: v })}
        />
      </Card>

      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full md:max-w-3xl">
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="links">
            الروابط ({data.links.length})
          </TabsTrigger>
          <TabsTrigger value="socials">
            السوشيال ({data.socials.length})
          </TabsTrigger>
          <TabsTrigger value="theme">الألوان</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* ── Profile ── */}
        <TabsContent value="profile" className="mt-4">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>الاسم</Label>
              <Input
                value={data.profile.name}
                onChange={(e) => setProfile("name", e.target.value)}
                placeholder="Intlakaa"
              />
            </div>
            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea
                rows={4}
                value={data.profile.description}
                onChange={(e) => setProfile("description", e.target.value)}
                placeholder="انطلاقة | وكالة إعلانات وتسويق رقمي"
              />
            </div>
            <div className="space-y-2">
              <Label>رابط صورة البروفايل (URL)</Label>
              <Input
                value={data.profile.avatar}
                onChange={(e) => setProfile("avatar", e.target.value)}
                placeholder="https://..."
                dir="ltr"
              />
              {data.profile.avatar && (
                <img
                  src={data.profile.avatar}
                  alt="avatar preview"
                  className="h-20 w-20 rounded-full object-cover border mt-2"
                />
              )}
            </div>
          </Card>
        </TabsContent>

        {/* ── Links ── */}
        <TabsContent value="links" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button onClick={addLink} className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة رابط
            </Button>
          </div>

          {data.links.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground border-dashed">
              لا توجد روابط — اضغط "إضافة رابط" للبدء
            </Card>
          ) : (
            <div className="space-y-3">
              {data.links.map((link, idx) => (
                <Card key={link.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1 pt-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={idx === 0}
                        onClick={() => moveLink(idx, -1)}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={idx === data.links.length - 1}
                        onClick={() => moveLink(idx, 1)}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {link.image ? (
                      <img
                        src={link.image}
                        alt=""
                        className="h-14 w-14 rounded object-cover border shrink-0"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded bg-muted shrink-0" />
                    )}

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">العنوان</Label>
                        <Input
                          value={link.title}
                          onChange={(e) => updateLink(idx, { title: e.target.value })}
                          placeholder="مثال: WhatsApp"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">الرابط (URL)</Label>
                        <Input
                          value={link.url}
                          onChange={(e) => updateLink(idx, { url: e.target.value })}
                          placeholder="https://..."
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-xs">رابط الصورة (URL — اختياري)</Label>
                        <Input
                          value={link.image}
                          onChange={(e) => updateLink(idx, { image: e.target.value })}
                          placeholder="https://..."
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive shrink-0"
                      onClick={() => removeLink(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Socials ── */}
        <TabsContent value="socials" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button onClick={addSocial} className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة أيقونة سوشيال
            </Button>
          </div>

          {data.socials.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground border-dashed">
              لا توجد أيقونات — اضغط "إضافة أيقونة سوشيال" للبدء
            </Card>
          ) : (
            <div className="space-y-3">
              {data.socials.map((s, idx) => (
                <Card key={s.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1 pt-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={idx === 0}
                        onClick={() => moveSocial(idx, -1)}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={idx === data.socials.length - 1}
                        onClick={() => moveSocial(idx, 1)}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">الأيقونة</Label>
                        <Select
                          value={s.icon}
                          onValueChange={(v) => updateSocial(idx, { icon: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر أيقونة" />
                          </SelectTrigger>
                          <SelectContent>
                            {SOCIAL_ICON_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                            <SelectItem value="globe">globe (افتراضي)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">الاسم</Label>
                        <Input
                          value={s.label}
                          onChange={(e) => updateSocial(idx, { label: e.target.value })}
                          placeholder="TikTok"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">الرابط</Label>
                        <Input
                          value={s.url}
                          onChange={(e) => updateSocial(idx, { url: e.target.value })}
                          placeholder="https://..."
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive shrink-0"
                      onClick={() => removeSocial(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Theme ── */}
        <TabsContent value="theme" className="mt-4">
          <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorField
              label="خلفية البطاقة (موبايل)"
              value={data.theme.profileBg}
              onChange={(v) => setTheme("profileBg", v)}
            />
            <ColorField
              label="خلفية الإطار الخارجي (ديسكتوب)"
              value={data.theme.desktopFrame}
              onChange={(v) => setTheme("desktopFrame", v)}
            />
            <ColorField
              label="خلفية الأزرار"
              value={data.theme.buttonBg}
              onChange={(v) => setTheme("buttonBg", v)}
            />
            <ColorField
              label="نص الأزرار"
              value={data.theme.buttonText}
              onChange={(v) => setTheme("buttonText", v)}
            />
            <ColorField
              label="نص العنوان (الاسم)"
              value={data.theme.titleText}
              onChange={(v) => setTheme("titleText", v)}
            />
            <ColorField
              label="نص الوصف"
              value={data.theme.descriptionText}
              onChange={(v) => setTheme("descriptionText", v)}
            />
          </Card>
        </TabsContent>

        {/* ── SEO ── */}
        <TabsContent value="seo" className="mt-4">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>عنوان SEO</Label>
              <Input
                value={data.seoTitle ?? ""}
                onChange={(e) => setData({ ...data, seoTitle: e.target.value })}
                placeholder="روابط انطلاقة"
              />
            </div>
            <div className="space-y-2">
              <Label>وصف SEO</Label>
              <Textarea
                rows={3}
                value={data.seoDescription ?? ""}
                onChange={(e) => setData({ ...data, seoDescription: e.target.value })}
                placeholder="وصف مختصر للصفحة لمحركات البحث"
              />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reset Confirm */}
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>استعادة القيم الافتراضية</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم استبدال كل البيانات الحالية بالقيم الافتراضية. لا يمكن التراجع.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse">
            <AlertDialogAction
              onClick={handleReset}
              className="bg-destructive hover:bg-destructive/90"
            >
              نعم، استعد الافتراضي
            </AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 rounded border cursor-pointer shrink-0"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} dir="ltr" />
      </div>
    </div>
  );
}
