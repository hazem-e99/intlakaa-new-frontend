import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
    Globe, Share2, Search, BarChart3, Save, Loader2,
    RefreshCw, Link2, Plus, Trash2, GripVertical, Phone,
} from "lucide-react";
import {
    fetchSeoSettings, saveSeoSettings, syncSeoFromHtml,
    type SeoSettings, type SocialLink, type ContactInfo,
} from "@/services/seoService";
import { SOCIAL_ICON_OPTIONS, ICON_MAP } from "@/lib/iconMap";

// ─── Reusable Icon Picker ─────────────────────────────────────────────────────
function IconPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const current = ICON_MAP[value] ?? ICON_MAP["globe"];

    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative shrink-0">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                title="اختر أيقونة"
                className="w-11 h-11 rounded-xl border-2 border-border hover:border-primary flex items-center justify-center transition-all hover:bg-accent"
                style={{ color: current.color }}
            >
                <current.Icon size={22} />
            </button>

            {open && (
                <div className="absolute z-50 top-12 right-0 mt-1 w-[280px] bg-background border rounded-xl shadow-xl p-3 grid grid-cols-5 gap-1.5">
                    {SOCIAL_ICON_OPTIONS.map(opt => (
                        <button
                            key={opt.id}
                            type="button"
                            title={opt.label}
                            onClick={() => { onChange(opt.id); setOpen(false); }}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all hover:bg-accent
                                ${value === opt.id ? "bg-primary/10 ring-1 ring-primary" : ""}`}
                            style={{ color: opt.color }}
                        >
                            <opt.Icon size={18} />
                            <span className="text-[9px] text-muted-foreground leading-tight text-center truncate w-full">{opt.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Social Link Row ──────────────────────────────────────────────────────────
function SocialLinkRow({ link, index, onUpdate, onRemove }: {
    link: SocialLink;
    index: number;
    onUpdate: (i: number, f: keyof SocialLink, v: string) => void;
    onRemove: (i: number) => void;
}) {
    return (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-all group">
            <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0 cursor-grab" />
            <IconPicker value={link.icon} onChange={v => onUpdate(index, "icon", v)} />
            <Input
                value={link.label}
                onChange={e => onUpdate(index, "label", e.target.value)}
                placeholder="الاسم"
                className="w-24 shrink-0 text-right text-sm"
                aria-label="اسم المنصة"
            />
            <Input
                value={link.url}
                onChange={e => onUpdate(index, "url", e.target.value)}
                placeholder="https://..."
                dir="ltr"
                className="flex-1 text-left text-sm font-mono"
                aria-label="رابط"
            />
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                title="حذف"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}

// ─── Contact Info Row ─────────────────────────────────────────────────────────
function ContactInfoRow({ item, index, onUpdate, onRemove }: {
    item: ContactInfo;
    index: number;
    onUpdate: (i: number, f: keyof ContactInfo, v: string) => void;
    onRemove: (i: number) => void;
}) {
    return (
        <div className="flex items-start gap-2 p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-all group">
            <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0 cursor-grab mt-3" />
            <IconPicker value={item.icon} onChange={v => onUpdate(index, "icon", v)} />
            <div className="flex-1 grid grid-cols-1 gap-2">
                {/* Row: label + text */}
                <div className="flex gap-2">
                    <Input
                        value={item.label}
                        onChange={e => onUpdate(index, "label", e.target.value)}
                        placeholder="العنوان"
                        className="w-28 text-right text-sm shrink-0"
                        aria-label="عنوان البطاقة"
                    />
                    <Input
                        value={item.text}
                        onChange={e => onUpdate(index, "text", e.target.value)}
                        placeholder="النص المعروض"
                        className="flex-1 text-right text-sm"
                        aria-label="النص المعروض"
                    />
                </div>
                {/* Link */}
                <Input
                    value={item.href}
                    onChange={e => onUpdate(index, "href", e.target.value)}
                    placeholder="الرابط: tel:+966... أو mailto:... أو https://wa.me/..."
                    dir="ltr"
                    className="text-left text-sm font-mono"
                    aria-label="الرابط"
                />
            </div>
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100 shrink-0 mt-0.5"
                title="حذف"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
    return (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
            <Icon className="h-7 w-7 mx-auto mb-2 opacity-40" />
            <p className="text-sm">{message}</p>
        </div>
    );
}

// ─── Default empty state ──────────────────────────────────────────────────────
const defaultSeo: SeoSettings = {
    siteTitle: "", metaDescription: "", keywords: "",
    ogTitle: "", ogDescription: "", ogImage: "", ogUrl: "",
    googleConsole: "", robotsTxt: "", sitemap: "",
    gtmId: "", gaId: "", fbPixel: "", tiktokPixel: "",
    socialLinks: [],
    contactInfo: [],
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SEOManagement() {
    const { toast } = useToast();
    const [seo, setSeo] = useState<SeoSettings>(defaultSeo);
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        fetchSeoSettings()
            .then(data => {
                setSeo({
                    ...defaultSeo, ...data,
                    socialLinks: data.socialLinks ?? [],
                    contactInfo: data.contactInfo ?? [],
                });
            })
            .catch(() => {
                setFetchError(true);
                toast({ title: "خطأ في تحميل الإعدادات", variant: "destructive" });
            })
            .finally(() => setIsFetching(false));
    }, []);

    // ── Field helpers ─────────────────────────────────────────────────────────
    const handleChange = (field: keyof SeoSettings) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setSeo(prev => ({ ...prev, [field]: e.target.value }));

    // ── Social links helpers ──────────────────────────────────────────────────
    const updateSocial = (i: number, f: keyof SocialLink, v: string) =>
        setSeo(prev => ({ ...prev, socialLinks: prev.socialLinks.map((l, idx) => idx === i ? { ...l, [f]: v } : l) }));
    const addSocial = () =>
        setSeo(prev => ({ ...prev, socialLinks: [...prev.socialLinks, { icon: "globe", url: "", label: "جديد" }] }));
    const removeSocial = (i: number) =>
        setSeo(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, idx) => idx !== i) }));

    // ── Contact info helpers ──────────────────────────────────────────────────
    const updateContact = (i: number, f: keyof ContactInfo, v: string) =>
        setSeo(prev => ({ ...prev, contactInfo: prev.contactInfo.map((c, idx) => idx === i ? { ...c, [f]: v } : c) }));
    const addContact = () =>
        setSeo(prev => ({
            ...prev,
            contactInfo: [...prev.contactInfo, { icon: "phone", label: "تواصل", text: "", href: "" }],
        }));
    const removeContact = (i: number) =>
        setSeo(prev => ({ ...prev, contactInfo: prev.contactInfo.filter((_, idx) => idx !== i) }));

    // ── Sync + Save ───────────────────────────────────────────────────────────
    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const updated = await syncSeoFromHtml();
            setSeo({ ...defaultSeo, ...updated, socialLinks: updated.socialLinks ?? [], contactInfo: updated.contactInfo ?? [] });
            toast({ title: "✅ تمت المزامنة" });
        } catch {
            toast({ title: "خطأ في المزامنة", variant: "destructive" });
        } finally { setIsSyncing(false); }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updated = await saveSeoSettings(seo);
            setSeo({ ...defaultSeo, ...updated, socialLinks: updated.socialLinks ?? [], contactInfo: updated.contactInfo ?? [] });
            toast({ title: "✅ تم الحفظ", description: "تم تحديث إعدادات SEO وتطبيقها على الموقع بنجاح" });
        } catch {
            toast({ title: "خطأ في الحفظ", variant: "destructive" });
        } finally { setIsLoading(false); }
    };

    // ── Loading / Error ───────────────────────────────────────────────────────
    if (isFetching) return (
        <div className="flex items-center justify-center min-h-[400px]" dir="rtl">
            <div className="text-center space-y-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">جاري تحميل إعدادات SEO...</p>
            </div>
        </div>
    );

    if (fetchError) return (
        <div className="flex items-center justify-center min-h-[400px]" dir="rtl">
            <div className="text-center space-y-4">
                <div className="text-5xl">⚠️</div>
                <h2 className="text-xl font-semibold">تعذّر الاتصال بالخادم</h2>
                <Button onClick={() => window.location.reload()} variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" /> إعادة المحاولة
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500" dir="rtl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">إدارة SEO</h1>
                    <p className="text-muted-foreground">تحسين ظهور موقعك في محركات البحث ومواقع التواصل الاجتماعي</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleSync} disabled={isSyncing || isLoading} className="gap-2">
                        {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                        {isSyncing ? "جاري المزامنة..." : "مزامنة من الموقع"}
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading || isSyncing} className="gap-2">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isLoading ? "جاري الحفظ..." : "حفظ وتطبيق على الموقع"}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="general" className="w-full" dir="rtl">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
                    <TabsTrigger value="general" className="flex items-center gap-1.5">
                        <Globe className="h-4 w-4" /><span className="hidden sm:inline">عام</span>
                    </TabsTrigger>
                    <TabsTrigger value="contact" className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4" /><span className="hidden sm:inline">التواصل</span>
                    </TabsTrigger>
                    <TabsTrigger value="og" className="flex items-center gap-1.5">
                        <Share2 className="h-4 w-4" /><span className="hidden sm:inline">Open Graph</span>
                    </TabsTrigger>
                    <TabsTrigger value="search" className="flex items-center gap-1.5">
                        <Search className="h-4 w-4" /><span className="hidden sm:inline">محركات البحث</span>
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center gap-1.5">
                        <BarChart3 className="h-4 w-4" /><span className="hidden sm:inline">التحليلات</span>
                    </TabsTrigger>
                </TabsList>

                {/* ── General ── */}
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader className="text-right">
                            <CardTitle>الإعدادات الأساسية</CardTitle>
                            <CardDescription>العنوان والوصف التعريفي الذي يظهر في نتائج جوجل</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 text-right">
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">{seo.siteTitle.length} / 60 حرف</span>
                                    <Label htmlFor="site-title">عنوان الموقع (Meta Title)</Label>
                                </div>
                                <Input id="site-title" value={seo.siteTitle} onChange={handleChange("siteTitle")} />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">{seo.metaDescription.length} / 160 حرف</span>
                                    <Label htmlFor="meta-desc">الوصف التعريفي (Meta Description)</Label>
                                </div>
                                <Textarea id="meta-desc" value={seo.metaDescription} onChange={handleChange("metaDescription")} className="min-h-[100px]" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="keywords">الكلمات المفتاحية</Label>
                                <Input id="keywords" value={seo.keywords} onChange={handleChange("keywords")} placeholder="افصل الكلمات بفاصلة: تسويق, نمو, انطلاقة" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── التواصل (Contact + Social) ── */}
                <TabsContent value="contact" className="space-y-4">

                    {/* Contact Info Cards */}
                    <Card>
                        <CardHeader className="text-right">
                            <CardTitle className="flex items-center gap-2 justify-end">
                                <span>بطاقات التواصل</span>
                                <Phone className="h-5 w-5 text-primary" />
                            </CardTitle>
                            <CardDescription>
                                البطاقات التي تظهر في فوتر الموقع (هاتف، واتساب، بريد…) — الترتيب هنا هو الترتيب في الموقع
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {seo.contactInfo.length > 0 && (
                                <div className="flex items-center gap-2 px-3 text-xs text-muted-foreground pb-1">
                                    <div className="w-4" />
                                    <div className="w-11 text-center">أيقونة</div>
                                    <div className="flex-1">العنوان / النص / الرابط</div>
                                    <div className="w-9" />
                                </div>
                            )}

                            <div className="space-y-2">
                                {seo.contactInfo.map((item, idx) => (
                                    <ContactInfoRow
                                        key={idx}
                                        item={item}
                                        index={idx}
                                        onUpdate={updateContact}
                                        onRemove={removeContact}
                                    />
                                ))}
                            </div>

                            {seo.contactInfo.length === 0 && (
                                <EmptyState icon={Phone} message="لا توجد بطاقات تواصل — اضغط إضافة لإنشاء أول بطاقة" />
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={addContact}
                                className="w-full gap-2 border-dashed hover:border-primary hover:text-primary"
                            >
                                <Plus className="h-4 w-4" />
                                إضافة بطاقة تواصل
                            </Button>

                            {seo.contactInfo.length > 0 && (
                                <p className="text-xs text-muted-foreground text-center">
                                    مثال للرابط: <code className="bg-muted px-1 rounded">tel:+966511414537</code> أو <code className="bg-muted px-1 rounded">https://wa.me/966511414537</code> أو <code className="bg-muted px-1 rounded">mailto:info@domain.com</code>
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Social Media Links */}
                    <Card>
                        <CardHeader className="text-right">
                            <CardTitle className="flex items-center gap-2 justify-end">
                                <span>أيقونات السوشيال ميديا</span>
                                <Link2 className="h-5 w-5 text-primary" />
                            </CardTitle>
                            <CardDescription>
                                الأيقونات الصغيرة أسفل بطاقات التواصل في الفوتر — اتركها فارغة لإخفاء الأيقونة
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {seo.socialLinks.length > 0 && (
                                <div className="flex items-center gap-2 px-3 text-xs text-muted-foreground pb-1">
                                    <div className="w-4" />
                                    <div className="w-11 text-center">أيقونة</div>
                                    <div className="w-24">الاسم</div>
                                    <div className="flex-1">الرابط</div>
                                    <div className="w-9" />
                                </div>
                            )}

                            <div className="space-y-2">
                                {seo.socialLinks.map((link, idx) => (
                                    <SocialLinkRow
                                        key={idx}
                                        link={link}
                                        index={idx}
                                        onUpdate={updateSocial}
                                        onRemove={removeSocial}
                                    />
                                ))}
                            </div>

                            {seo.socialLinks.length === 0 && (
                                <EmptyState icon={Link2} message="لا توجد روابط سوشيال — اضغط إضافة لإنشاء أول رابط" />
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={addSocial}
                                className="w-full gap-2 border-dashed hover:border-primary hover:text-primary"
                            >
                                <Plus className="h-4 w-4" />
                                إضافة منصة جديدة
                            </Button>

                            {seo.socialLinks.length > 0 && (
                                <p className="text-xs text-muted-foreground text-center pt-1">
                                    💡 تذكر الضغط على "حفظ وتطبيق على الموقع" بعد أي تعديل
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── Open Graph ── */}
                <TabsContent value="og" className="space-y-4">
                    <Card>
                        <CardHeader className="text-right">
                            <CardTitle>معاينة التواصل الاجتماعي (Open Graph)</CardTitle>
                            <CardDescription>تحكم في كيفية ظهور الموقع عند مشاركته على فيسبوك وواتساب وتويتر</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 text-right">
                            <div className="grid gap-2">
                                <Label htmlFor="og-title">عنوان المشاركة</Label>
                                <Input id="og-title" value={seo.ogTitle} onChange={handleChange("ogTitle")} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="og-desc">وصف المشاركة</Label>
                                <Textarea id="og-desc" value={seo.ogDescription} onChange={handleChange("ogDescription")} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="og-image">رابط صورة المعاينة</Label>
                                <Input id="og-image" value={seo.ogImage} onChange={handleChange("ogImage")} placeholder="https://intlakaa.com/og-image.jpg أو /logo.png" />
                                <p className="text-xs text-muted-foreground">أبعاد الصورة الموصى بها: 1200 × 630 بكسل</p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="og-url">رابط الموقع (og:url)</Label>
                                <Input id="og-url" value={seo.ogUrl} onChange={handleChange("ogUrl")} placeholder="https://intlakaa.com" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── Search ── */}
                <TabsContent value="search" className="space-y-4">
                    <Card>
                        <CardHeader className="text-right">
                            <CardTitle>أدوات مشرفي المواقع</CardTitle>
                            <CardDescription>ربط الموقع بأدوات محركات البحث</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 text-right">
                            <div className="grid gap-2">
                                <Label htmlFor="google-console">رمز التحقق من Google Search Console</Label>
                                <Input id="google-console" value={seo.googleConsole} onChange={handleChange("googleConsole")} placeholder="رمز التحقق (Meta Tag Content)" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="robots-txt">ملف Robots.txt</Label>
                                <Textarea id="robots-txt" value={seo.robotsTxt} onChange={handleChange("robotsTxt")} className="font-mono text-sm min-h-[120px]" dir="ltr" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sitemap">رابط ملف السايت ماب</Label>
                                <Input id="sitemap" value={seo.sitemap} onChange={handleChange("sitemap")} placeholder="https://intlakaa.com/sitemap.xml" dir="ltr" className="text-left" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── Analytics ── */}
                <TabsContent value="analytics" className="space-y-4">
                    <Card>
                        <CardHeader className="text-right">
                            <CardTitle>أكواد التتبع والتحليل</CardTitle>
                            <CardDescription>أدخل الـ ID فقط — الكود الكامل يتولّد تلقائياً</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 text-right">
                            <div className="grid gap-2">
                                <Label htmlFor="gtm-id">Google Tag Manager ID</Label>
                                <Input id="gtm-id" value={seo.gtmId} onChange={handleChange("gtmId")} placeholder="GTM-XXXXXXX" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ga-id">Google Analytics ID (GA4)</Label>
                                <Input id="ga-id" value={seo.gaId} onChange={handleChange("gaId")} placeholder="G-XXXXXXXXXX" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gc-verify">Google Search Console (Verification)</Label>
                                <Input id="gc-verify" value={seo.googleConsole} onChange={handleChange("googleConsole")} placeholder="YZbIykBhCX6tmf5srmI1PqKpLXGVuuzQbGpBjh4MBOA" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fb-pixel">Facebook Pixel ID</Label>
                                <Input id="fb-pixel" value={seo.fbPixel} onChange={handleChange("fbPixel")} placeholder="123456789012345" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tt-pixel">TikTok Pixel ID</Label>
                                <Input id="tt-pixel" value={seo.tiktokPixel} onChange={handleChange("tiktokPixel")} placeholder="D6A307JC77U2V3Q5JGF0" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
