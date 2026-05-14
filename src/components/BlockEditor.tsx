import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-[200px] bg-muted/30 rounded animate-pulse" />,
});
import 'react-quill/dist/quill.snow.css';
import { Block, BlockType } from '@/services/cmsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import {
  Type, Image, Video, Code, Quote, Minus, MousePointer, Columns,
  Plus, Trash2, ChevronUp, ChevronDown, GripVertical, List,
  BarChart2, LayoutGrid, Star, Users, HelpCircle, Megaphone,
  Globe, GalleryHorizontal, AlertTriangle, ArrowUpDown, Table2,
  Footprints, X, ChevronDown as ChevDown,
} from 'lucide-react';

// ─── Block Categories & Definitions ──────────────────────────────────────────

interface BlockDef {
  type: BlockType;
  label: string;
  icon: any;
  category: string;
  defaultContent: any;
}

const BLOCK_DEFS: BlockDef[] = [
  // ── النصوص ──
  { type: 'heading', label: 'عنوان', icon: Type, category: 'نصوص', defaultContent: { text: 'عنوان جديد', level: 'h2', align: 'right' } },
  { type: 'paragraph', label: 'فقرة نصية', icon: Type, category: 'نصوص', defaultContent: { text: '', align: 'right' } },
  { type: 'quote', label: 'اقتباس', icon: Quote, category: 'نصوص', defaultContent: { text: '', author: '' } },
  { type: 'list', label: 'قائمة', icon: List, category: 'نصوص', defaultContent: { style: 'bullet', items: ['عنصر 1', 'عنصر 2', 'عنصر 3'] } },
  { type: 'table', label: 'جدول', icon: Table2, category: 'نصوص', defaultContent: { headers: ['عمود 1', 'عمود 2', 'عمود 3'], rows: [['خلية', 'خلية', 'خلية']] } },

  // ── الميديا ──
  { type: 'image', label: 'صورة', icon: Image, category: 'ميديا', defaultContent: { url: '', alt: '', caption: '', size: 'full' } },
  { type: 'gallery', label: 'معرض صور', icon: GalleryHorizontal, category: 'ميديا', defaultContent: { images: [], columns: 3 } },
  { type: 'video', label: 'فيديو (embed)', icon: Video, category: 'ميديا', defaultContent: { embed: '', caption: '' } },
  { type: 'embed', label: 'Embed مخصص', icon: Globe, category: 'ميديا', defaultContent: { code: '', height: 400 } },

  // ── تخطيط ──
  { type: 'columns', label: 'عمودين', icon: Columns, category: 'تخطيط', defaultContent: { ratio: '50-50', leftBlocks: [], rightBlocks: [] } },
  { type: 'banner', label: 'بانر/Hero', icon: Megaphone, category: 'تخطيط', defaultContent: { title: 'عنوان البانر', subtitle: '', bgColor: '#6B21A8', textColor: '#ffffff', buttonText: '', buttonUrl: '', align: 'center', width: 'container' } },
  { type: 'divider', label: 'فاصل', icon: Minus, category: 'تخطيط', defaultContent: { style: 'line' } },
  { type: 'spacer', label: 'مسافة فارغة', icon: ArrowUpDown, category: 'تخطيط', defaultContent: { height: 40 } },

  // ── مكونات ──
  { type: 'cta', label: 'زر / CTA', icon: MousePointer, category: 'مكونات', defaultContent: { text: '', buttonText: 'اضغط هنا', buttonUrl: '#', style: 'primary', align: 'center' } },
  { type: 'alert', label: 'تنبيه', icon: AlertTriangle, category: 'مكونات', defaultContent: { message: '', type: 'info', title: '' } },
  { type: 'faq', label: 'أسئلة شائعة', icon: HelpCircle, category: 'مكونات', defaultContent: { title: 'الأسئلة الشائعة', items: [{ q: 'سؤال؟', a: 'الإجابة...' }] } },
  { type: 'steps', label: 'خطوات متسلسلة', icon: Footprints, category: 'مكونات', defaultContent: { title: '', steps: [{ title: 'الخطوة الأولى', description: '' }, { title: 'الخطوة الثانية', description: '' }] } },

  // ── بيانات ──
  { type: 'stats', label: 'إحصائيات', icon: BarChart2, category: 'بيانات', defaultContent: { items: [{ number: '100+', label: 'عميل' }, { number: '50+', label: 'مشروع' }, { number: '5+', label: 'سنوات' }] } },
  { type: 'cards', label: 'بطاقات', icon: LayoutGrid, category: 'بيانات', defaultContent: { columns: 3, items: [{ title: 'بطاقة 1', description: '', icon: '', image: '' }] } },
  { type: 'testimonials', label: 'آراء العملاء', icon: Star, category: 'بيانات', defaultContent: { items: [{ name: 'اسم العميل', role: 'المنصب', text: 'رأي العميل...', avatar: '', rating: 5 }] } },
  { type: 'team', label: 'فريق العمل', icon: Users, category: 'بيانات', defaultContent: { title: 'فريقنا', columns: 4, members: [{ name: 'الاسم', role: 'المنصب', image: '', bio: '' }] } },

  // ── متقدم ──
  { type: 'html', label: 'HTML مخصص', icon: Code, category: 'متقدم', defaultContent: { code: '' } },
];

const CATEGORIES = ['نصوص', 'ميديا', 'تخطيط', 'مكونات', 'بيانات', 'متقدم'];

// ─── Reusable mini helpers ────────────────────────────────────────────────────

const AlignSelect = ({ value, onChange }: any) => (
  <Select value={value || 'right'} onValueChange={onChange}>
    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
    <SelectContent>
      <SelectItem value="right">يمين</SelectItem>
      <SelectItem value="center">وسط</SelectItem>
      <SelectItem value="left">يسار</SelectItem>
    </SelectContent>
  </Select>
);

// Small helper: editable list of strings
const StringListEditor = ({ items, onChange, placeholder = 'عنصر...' }: { items: string[]; onChange: (items: string[]) => void; placeholder?: string }) => (
  <div className="space-y-2">
    {items.map((item, i) => (
      <div key={i} className="flex gap-2">
        <Input value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n); }} placeholder={placeholder} dir="rtl" />
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-destructive" onClick={() => onChange(items.filter((_, j) => j !== i))}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
    <Button variant="outline" size="sm" onClick={() => onChange([...items, ''])} className="gap-1 w-full">
      <Plus className="h-3 w-3" /> إضافة عنصر
    </Button>
  </div>
);

// ─── Individual Block Editors ─────────────────────────────────────────────────

const HeadingEditor = ({ content, onChange }: any) => (
  <div className="space-y-2">
    <div className="flex gap-2 flex-wrap">
      <Select value={content.level || 'h2'} onValueChange={v => onChange({ ...content, level: v })}>
        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
        <SelectContent>{['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(h => <SelectItem key={h} value={h}>{h.toUpperCase()}</SelectItem>)}</SelectContent>
      </Select>
      <AlignSelect value={content.align} onChange={(v: string) => onChange({ ...content, align: v })} />
      <div className="flex items-center gap-1.5">
        <label className="text-xs text-muted-foreground whitespace-nowrap">لون النص:</label>
        <input
          type="color"
          value={content.color || '#000000'}
          onChange={e => onChange({ ...content, color: e.target.value })}
          className="w-8 h-8 rounded cursor-pointer border border-border bg-transparent p-0.5"
          title="لون النص"
        />
        {content.color && (
          <button
            type="button"
            onClick={() => onChange({ ...content, color: '' })}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            title="إزالة اللون"
          >
            ✕
          </button>
        )}
      </div>
    </div>
    <Input value={content.text || ''} onChange={e => onChange({ ...content, text: e.target.value })} placeholder="اكتب العنوان هنا..." className="text-lg font-bold" dir="rtl" style={{ color: content.color || undefined }} />
  </div>
);

const ParagraphEditor = ({ content, onChange }: any) => {
  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  return (
    <div className="space-y-3">
      <div className="bg-background rounded-md overflow-hidden border custom-quill">
        <ReactQuill 
          theme="snow" 
          value={content.text || ''} 
          onChange={(val: string) => onChange({ ...content, text: val })} 
          modules={modules}
          placeholder="اكتب النص هنا..."
        />
      </div>
    </div>
  );
};

const ImageEditor = ({ content, onChange }: any) => (
  <div className="space-y-2">
    <Input value={content.url || ''} onChange={e => onChange({ ...content, url: e.target.value })} placeholder="رابط الصورة (URL)" dir="ltr" />
    <div className="flex gap-2">
      <Input value={content.alt || ''} onChange={e => onChange({ ...content, alt: e.target.value })} placeholder="النص البديل" dir="rtl" />
      <Select value={content.size || 'full'} onValueChange={v => onChange({ ...content, size: v })}>
        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="full">كامل العرض</SelectItem>
          <SelectItem value="wide">عريض</SelectItem>
          <SelectItem value="medium">متوسط</SelectItem>
          <SelectItem value="small">صغير</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <Input value={content.caption || ''} onChange={e => onChange({ ...content, caption: e.target.value })} placeholder="تعليق الصورة (اختياري)" dir="rtl" />
    {content.url && (
      <div className="mt-2 rounded-lg overflow-hidden border">
        <img
          src={content.url}
          alt={content.alt || content.caption || 'معاينة صورة'}
          loading="lazy"
          decoding="async"
          className="max-h-48 w-full object-cover"
        />
      </div>
    )}
  </div>
);

const GalleryEditor = ({ content, onChange }: any) => {
  const images: string[] = content.images || [];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">عدد الأعمدة:</span>
        <Select value={String(content.columns || 3)} onValueChange={v => onChange({ ...content, columns: Number(v) })}>
          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem><SelectItem value="4">4</SelectItem></SelectContent>
        </Select>
      </div>
      <StringListEditor items={images} onChange={imgs => onChange({ ...content, images: imgs })} placeholder="رابط الصورة (URL)..." />
      {images.length > 0 && (
        <div className={`grid grid-cols-${content.columns || 3} gap-2 mt-2`}>
          {images.filter(Boolean).map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`صورة المعرض ${i + 1}`}
              loading="lazy"
              decoding="async"
              className="rounded aspect-square object-cover w-full"
            />
          ))}
        </div>
      )}
    </div>
  );
};

const VideoEditor = ({ content, onChange }: any) => (
  <div className="space-y-2">
    <Input value={content.embed || ''} onChange={e => onChange({ ...content, embed: e.target.value })} placeholder="رابط YouTube embed أو Vimeo..." dir="ltr" />
    <Input value={content.caption || ''} onChange={e => onChange({ ...content, caption: e.target.value })} placeholder="تعليق الفيديو (اختياري)" dir="rtl" />
    {content.embed && (
      <div className="mt-2 rounded-lg overflow-hidden border aspect-video">
        <iframe
          src={content.embed}
          title={content.caption || 'معاينة فيديو'}
          loading="lazy"
          className="w-full h-full"
          allowFullScreen
        />
      </div>
    )}
  </div>
);

const EmbedEditor = ({ content, onChange }: any) => (
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">الصق كود iframe كامل (Google Maps, Forms, إلخ...)</p>
    <Textarea value={content.code || ''} onChange={e => onChange({ ...content, code: e.target.value })} placeholder='<iframe src="..." ...></iframe>' rows={4} className="font-mono text-sm" dir="ltr" />
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">الارتفاع (px):</span>
      <Input type="number" value={content.height || 400} onChange={e => onChange({ ...content, height: Number(e.target.value) })} className="w-24" />
    </div>
  </div>
);

const HtmlEditor = ({ content, onChange }: any) => (
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">كود HTML / CSS / JS مخصص:</p>
    <Textarea value={content.code || ''} onChange={e => onChange({ ...content, code: e.target.value })} placeholder="<div>...</div>" rows={8} className="font-mono text-sm" dir="ltr" />
  </div>
);

const QuoteEditor = ({ content, onChange }: any) => (
  <div className="space-y-2">
    <Textarea value={content.text || ''} onChange={e => onChange({ ...content, text: e.target.value })} placeholder="نص الاقتباس..." rows={3} dir="rtl" />
    <Input value={content.author || ''} onChange={e => onChange({ ...content, author: e.target.value })} placeholder="المصدر / الكاتب (اختياري)" dir="rtl" />
  </div>
);

const ListEditor = ({ content, onChange }: any) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">نوع القائمة:</span>
      <Select value={content.style || 'bullet'} onValueChange={v => onChange({ ...content, style: v })}>
        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="bullet">نقاط (•)</SelectItem>
          <SelectItem value="numbered">مرقمة (1.)</SelectItem>
          <SelectItem value="check">✓ تشيك</SelectItem>
          <SelectItem value="arrow">← سهم</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <StringListEditor items={content.items || []} onChange={items => onChange({ ...content, items })} placeholder="عنصر القائمة..." />
  </div>
);

const TableEditor = ({ content, onChange }: any) => {
  const headers: string[] = content.headers || ['عمود 1', 'عمود 2'];
  const rows: string[][] = content.rows || [['', '']];

  const updateHeader = (i: number, val: string) => {
    const h = [...headers]; h[i] = val; onChange({ ...content, headers: h });
  };
  const addCol = () => {
    const h = [...headers, `عمود ${headers.length + 1}`];
    const r = rows.map(row => [...row, '']);
    onChange({ ...content, headers: h, rows: r });
  };
  const removeCol = (ci: number) => {
    if (headers.length <= 1) return;
    onChange({ ...content, headers: headers.filter((_, i) => i !== ci), rows: rows.map(row => row.filter((_, i) => i !== ci)) });
  };
  const updateCell = (ri: number, ci: number, val: string) => {
    const r = rows.map((row, i) => i === ri ? row.map((c, j) => j === ci ? val : c) : row);
    onChange({ ...content, rows: r });
  };
  const addRow = () => onChange({ ...content, rows: [...rows, headers.map(() => '')] });
  const removeRow = (ri: number) => onChange({ ...content, rows: rows.filter((_, i) => i !== ri) });

  return (
    <div className="space-y-3 overflow-x-auto">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={addCol} className="gap-1"><Plus className="h-3 w-3" /> عمود</Button>
        <Button variant="outline" size="sm" onClick={addRow} className="gap-1"><Plus className="h-3 w-3" /> صف</Button>
      </div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((h, ci) => (
              <th key={ci} className="border p-1 bg-muted">
                <div className="flex gap-1">
                  <Input value={h} onChange={e => updateHeader(ci, e.target.value)} className="h-7 text-xs" dir="rtl" />
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive shrink-0" onClick={() => removeCol(ci)}><X className="h-3 w-3" /></Button>
                </div>
              </th>
            ))}
            <th className="border p-1 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="border p-1">
                  <Input value={cell} onChange={e => updateCell(ri, ci, e.target.value)} className="h-7 text-xs" dir="rtl" />
                </td>
              ))}
              <td className="border p-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeRow(ri)}><X className="h-3 w-3" /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DividerEditor = ({ content, onChange }: any) => (
  <div className="flex items-center gap-3">
    <span className="text-sm text-muted-foreground">الستايل:</span>
    <Select value={content.style || 'line'} onValueChange={v => onChange({ ...content, style: v })}>
      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="line">خط عادي ───</SelectItem>
        <SelectItem value="dashed">متقطع - - -</SelectItem>
        <SelectItem value="dots">نقاط · · ·</SelectItem>
        <SelectItem value="thick">سميك ━━━</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

const SpacerEditor = ({ content, onChange }: any) => (
  <div className="flex items-center gap-3">
    <span className="text-sm text-muted-foreground">الارتفاع (px):</span>
    <Input type="number" value={content.height || 40} onChange={e => onChange({ ...content, height: Number(e.target.value) })} className="w-24" />
    <div className="flex-1 border-dashed border-t-2 border-muted-foreground/30" style={{ height: '2px' }} />
  </div>
);

const CtaEditor = ({ content, onChange }: any) => (
  <div className="space-y-2">
    <Textarea value={content.text || ''} onChange={e => onChange({ ...content, text: e.target.value })} placeholder="نص فوق الزر (اختياري)" rows={2} dir="rtl" />
    <div className="grid grid-cols-2 gap-2">
      <Input value={content.buttonText || ''} onChange={e => onChange({ ...content, buttonText: e.target.value })} placeholder="نص الزر" dir="rtl" />
      <Input value={content.buttonUrl || ''} onChange={e => onChange({ ...content, buttonUrl: e.target.value })} placeholder="رابط الزر" dir="ltr" />
    </div>
    <div className="flex gap-2">
      <Select value={content.style || 'primary'} onValueChange={v => onChange({ ...content, style: v })}>
        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="primary">أساسي</SelectItem>
          <SelectItem value="secondary">ثانوي</SelectItem>
          <SelectItem value="outline">إطار</SelectItem>
          <SelectItem value="ghost">شفاف</SelectItem>
        </SelectContent>
      </Select>
      <AlignSelect value={content.align} onChange={(v: string) => onChange({ ...content, align: v })} />
    </div>
  </div>
);

const AlertEditor = ({ content, onChange }: any) => (
  <div className="space-y-2">
    <Select value={content.type || 'info'} onValueChange={v => onChange({ ...content, type: v })}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="info">ℹ️ معلومة (أزرق)</SelectItem>
        <SelectItem value="success">✅ نجاح (أخضر)</SelectItem>
        <SelectItem value="warning">⚠️ تحذير (أصفر)</SelectItem>
        <SelectItem value="error">❌ خطأ (أحمر)</SelectItem>
        <SelectItem value="tip">💡 نصيحة (بنفسجي)</SelectItem>
      </SelectContent>
    </Select>
    <Input value={content.title || ''} onChange={e => onChange({ ...content, title: e.target.value })} placeholder="عنوان التنبيه (اختياري)" dir="rtl" />
    <Textarea value={content.message || ''} onChange={e => onChange({ ...content, message: e.target.value })} placeholder="نص التنبيه..." rows={2} dir="rtl" />
  </div>
);

// ── Layout option button helper
const LayoutBtn = ({ value, current, onClick, children }: any) => (
  <button
    type="button"
    onClick={() => onClick(value)}
    className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all ${current === value
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-border hover:border-primary/40 text-muted-foreground'
      }`}
  >
    {children}
  </button>
);

const BannerEditor = ({ content, onChange }: any) => {
  const layout = content.layout || 'color';       // 'color' | 'media-bg' | 'media-right' | 'media-left'
  const mediaType = content.mediaType || 'image'; // 'image' | 'video'
  const width = content.width || 'container';    // 'container' | 'full'

  const set = (patch: any) => onChange({ ...content, ...patch });

  // ── Live Preview ──────────────────────────────────────────────────────────
  const PreviewBox = () => {
    const textAlign = content.align === 'center' ? 'text-center' : content.align === 'left' ? 'text-left' : 'text-right';
    const textBlock = (
      <div className={`${textAlign} space-y-2`} style={{ color: content.textColor || '#fff' }}>
        <p className="font-bold text-base leading-snug">{content.title || 'عنوان البانر'}</p>
        {content.subtitle && <p className="text-xs opacity-80">{content.subtitle}</p>}
        {content.buttonText && (
          <button className="mt-1 px-4 py-1.5 rounded-full text-xs font-semibold border border-current opacity-90">
            {content.buttonText}
          </button>
        )}
      </div>
    );

    const mediaSrc = content.mediaUrl || '';
    const overlayStyle = {
      backgroundColor: `rgba(0,0,0,${content.overlayOpacity ?? 0.4})`,
    };

    // ── color only
    if (layout === 'color') {
      return (
        <div className={`${width === 'container' ? 'rounded-xl mx-4' : 'rounded-none'} p-6 mt-3`} style={{ backgroundColor: content.bgColor || '#6B21A8' }}>
          {textBlock}
        </div>
      );
    }

    // ── media background
    if (layout === 'media-bg') {
      return (
        <div className={`${width === 'container' ? 'rounded-xl mx-4' : 'rounded-none'} overflow-hidden relative mt-3`} style={{ minHeight: 120 }}>
          {mediaType === 'image' && mediaSrc
            ? <img src={mediaSrc} alt="صورة معاينة البانر" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
            : mediaType === 'video' && mediaSrc
              ? <video src={mediaSrc} autoPlay muted loop className="absolute inset-0 w-full h-full object-cover" />
              : <div className="absolute inset-0 bg-muted flex items-center justify-center text-xs text-muted-foreground">أضف رابط الميديا</div>
          }
          <div className="absolute inset-0" style={overlayStyle} />
          <div className="relative z-10 p-6">{textBlock}</div>
        </div>
      );
    }

    // ── media side (right or left)
    const isRight = layout === 'media-right';
    const mediaBox = (
      <div className="w-2/5 shrink-0 rounded-lg overflow-hidden" style={{ minHeight: 80 }}>
        {mediaType === 'image' && mediaSrc
          ? <img src={mediaSrc} alt="صورة معاينة البانر" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          : mediaType === 'video' && mediaSrc
            ? <video src={mediaSrc} autoPlay muted loop className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground" style={{ minHeight: 80 }}>ميديا</div>
        }
      </div>
    );
    return (
      <div
        className={`${width === 'container' ? 'rounded-xl mx-4' : 'rounded-none'} p-4 flex gap-4 items-center mt-3 ${isRight ? 'flex-row' : 'flex-row-reverse'}`}
        style={{ backgroundColor: content.bgColor || '#6B21A8' }}
      >
        {mediaBox}
        <div className="flex-1">{textBlock}</div>
      </div>
    );
  };

  return (
    <div className="space-y-4" dir="rtl">

      {/* ── Step 1: Width & Layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">① عرض القسم</p>
          <div className="flex gap-2">
            <LayoutBtn value="container" current={width} onClick={(v: string) => set({ width: v })}>
              <div className="w-8 h-5 border-2 border-primary/30 rounded flex items-center justify-center">
                <div className="w-4 h-3 bg-primary/20 rounded-sm" />
              </div>
              داخل حاوية
            </LayoutBtn>
            <LayoutBtn value="full" current={width} onClick={(v: string) => set({ width: v })}>
              <div className="w-8 h-5 border-2 border-primary/30 rounded flex items-center justify-center">
                <div className="w-full h-3 bg-primary/20" />
              </div>
              عرض كامل
            </LayoutBtn>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">② تخطيط البانر</p>
          <div className="flex gap-2">
            <LayoutBtn value="color" current={layout} onClick={(v: string) => set({ layout: v })}>
              <div className="w-8 h-5 rounded bg-primary" />
              لون فقط
            </LayoutBtn>
            <LayoutBtn value="media-bg" current={layout} onClick={(v: string) => set({ layout: v })}>
              <div className="w-8 h-5 rounded bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40" />
                <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-bold">T</span>
              </div>
              باك جراوند
            </LayoutBtn>
            <LayoutBtn value="media-right" current={layout} onClick={(v: string) => set({ layout: v })}>
              <div className="w-8 h-5 rounded border flex overflow-hidden">
                <div className="flex-1 bg-primary/20" />
                <div className="w-2.5 bg-muted" />
              </div>
              نص + يمين
            </LayoutBtn>
            <LayoutBtn value="media-left" current={layout} onClick={(v: string) => set({ layout: v })}>
              <div className="w-8 h-5 rounded border flex overflow-hidden">
                <div className="w-2.5 bg-muted" />
                <div className="flex-1 bg-primary/20" />
              </div>
              يسار + نص
            </LayoutBtn>
          </div>
        </div>
      </div>

      {/* ── Step 2: Media (if not color-only) ── */}
      {layout !== 'color' && (
        <div className="border rounded-xl p-3 space-y-3 bg-muted/20">
          <p className="text-xs font-semibold text-muted-foreground">③ نوع الميديا</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => set({ mediaType: 'image' })}
              className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${mediaType === 'image' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
            >
              🖼️ صورة
            </button>
            <button
              type="button"
              onClick={() => set({ mediaType: 'video' })}
              className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${mediaType === 'video' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
            >
              🎬 فيديو
            </button>
          </div>
          <Input
            value={content.mediaUrl || ''}
            onChange={e => set({ mediaUrl: e.target.value })}
            placeholder={mediaType === 'image' ? 'رابط الصورة (URL)...' : 'رابط الفيديو (MP4 URL)...'}
            dir="ltr"
          />
          {/* overlay opacity — only for bg layout */}
          {layout === 'media-bg' && (
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs text-muted-foreground">درجة الـ Overlay (تعتيم فوق الميديا)</label>
                <span className="text-xs font-mono text-primary">{Math.round((content.overlayOpacity ?? 0.4) * 100)}%</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={content.overlayOpacity ?? 0.4}
                onChange={e => set({ overlayOpacity: parseFloat(e.target.value) })}
                className="w-full accent-primary h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground/60">
                <span>شفاف تماماً</span>
                <span>معتم تماماً</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Step 3: Content ── */}
      <div className="border rounded-xl p-3 space-y-3 bg-muted/20">
        <p className="text-xs font-semibold text-muted-foreground">{layout !== 'color' ? '④' : '③'} المحتوى</p>
        <Input value={content.title || ''} onChange={e => set({ title: e.target.value })} placeholder="عنوان البانر" dir="rtl" className="font-bold" />
        <Input value={content.subtitle || ''} onChange={e => set({ subtitle: e.target.value })} placeholder="عنوان فرعي (اختياري)" dir="rtl" />
        <div className="grid grid-cols-2 gap-2">
          <Input value={content.buttonText || ''} onChange={e => set({ buttonText: e.target.value })} placeholder="نص الزر (اختياري)" dir="rtl" />
          <Input value={content.buttonUrl || ''} onChange={e => set({ buttonUrl: e.target.value })} placeholder="رابط الزر" dir="ltr" />
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-muted-foreground">محاذاة النص:</span>
          <AlignSelect value={content.align || 'center'} onChange={(v: string) => set({ align: v })} />
        </div>
      </div>

      {/* ── Step 4: Colors ── */}
      <div className="border rounded-xl p-3 space-y-3 bg-muted/20">
        <p className="text-xs font-semibold text-muted-foreground">{layout !== 'color' ? '⑤' : '④'} الألوان</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              {layout === 'media-bg' ? 'لون الـ Overlay' : 'لون الخلفية'}
            </label>
            <div className="flex gap-2">
              <Input type="color" value={content.bgColor || '#6B21A8'} onChange={e => set({ bgColor: e.target.value })} className="h-9 w-12 p-0.5 cursor-pointer rounded" />
              <Input value={content.bgColor || '#6B21A8'} onChange={e => set({ bgColor: e.target.value })} className="flex-1 text-xs" dir="ltr" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">لون النص</label>
            <div className="flex gap-2">
              <Input type="color" value={content.textColor || '#ffffff'} onChange={e => set({ textColor: e.target.value })} className="h-9 w-12 p-0.5 cursor-pointer rounded" />
              <Input value={content.textColor || '#ffffff'} onChange={e => set({ textColor: e.target.value })} className="flex-1 text-xs" dir="ltr" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Live Preview ── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1">معاينة مباشرة</p>
        <PreviewBox />
      </div>

    </div>
  );
};

const StatsEditor = ({ content, onChange }: any) => {
  const items = content.items || [];
  const updateItem = (i: number, field: string, val: string) => {
    const n = items.map((item: any, j: number) => j === i ? { ...item, [field]: val } : item);
    onChange({ ...content, items: n });
  };
  return (
    <div className="space-y-3">
      {items.map((item: any, i: number) => (
        <div key={i} className="flex gap-2 items-center">
          <Input value={item.number || ''} onChange={e => updateItem(i, 'number', e.target.value)} placeholder="100+" className="w-28 font-bold text-lg" dir="ltr" />
          <Input value={item.label || ''} onChange={e => updateItem(i, 'label', e.target.value)} placeholder="وصف الرقم" dir="rtl" />
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-destructive" onClick={() => onChange({ ...content, items: items.filter((_: any, j: number) => j !== i) })}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full gap-1" onClick={() => onChange({ ...content, items: [...items, { number: '', label: '' }] })}>
        <Plus className="h-3 w-3" /> إضافة إحصائية
      </Button>
    </div>
  );
};

const CardsEditor = ({ content, onChange }: any) => {
  const items = content.items || [];
  const updateItem = (i: number, field: string, val: string) => {
    onChange({ ...content, items: items.map((item: any, j: number) => j === i ? { ...item, [field]: val } : item) });
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">عدد الأعمدة:</span>
        <Select value={String(content.columns || 3)} onValueChange={v => onChange({ ...content, columns: Number(v) })}>
          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem><SelectItem value="4">4</SelectItem></SelectContent>
        </Select>
      </div>
      {items.map((item: any, i: number) => (
        <div key={i} className="border rounded-lg p-3 space-y-2 bg-muted/30">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-muted-foreground">بطاقة {i + 1}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onChange({ ...content, items: items.filter((_: any, j: number) => j !== i) })}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          <Input value={item.image || ''} onChange={e => updateItem(i, 'image', e.target.value)} placeholder="رابط الصورة (اختياري)" dir="ltr" />
          <Input value={item.icon || ''} onChange={e => updateItem(i, 'icon', e.target.value)} placeholder="إيموجي أو رمز (مثل: 🚀)" dir="ltr" />
          <Input value={item.title || ''} onChange={e => updateItem(i, 'title', e.target.value)} placeholder="عنوان البطاقة" dir="rtl" />
          <Textarea value={item.description || ''} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="وصف البطاقة" rows={2} dir="rtl" />
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full gap-1" onClick={() => onChange({ ...content, items: [...items, { title: '', description: '', icon: '', image: '' }] })}>
        <Plus className="h-3 w-3" /> إضافة بطاقة
      </Button>
    </div>
  );
};

const TestimonialsEditor = ({ content, onChange }: any) => {
  const items = content.items || [];
  const updateItem = (i: number, field: string, val: any) => {
    onChange({ ...content, items: items.map((item: any, j: number) => j === i ? { ...item, [field]: val } : item) });
  };
  return (
    <div className="space-y-4">
      {items.map((item: any, i: number) => (
        <div key={i} className="border rounded-lg p-3 space-y-2 bg-muted/30">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-muted-foreground">تقييم {i + 1}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onChange({ ...content, items: items.filter((_: any, j: number) => j !== i) })}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          <Textarea value={item.text || ''} onChange={e => updateItem(i, 'text', e.target.value)} placeholder="رأي العميل..." rows={2} dir="rtl" />
          <div className="grid grid-cols-2 gap-2">
            <Input value={item.name || ''} onChange={e => updateItem(i, 'name', e.target.value)} placeholder="اسم العميل" dir="rtl" />
            <Input value={item.role || ''} onChange={e => updateItem(i, 'role', e.target.value)} placeholder="المنصب / الشركة" dir="rtl" />
          </div>
          <Input value={item.avatar || ''} onChange={e => updateItem(i, 'avatar', e.target.value)} placeholder="رابط صورة العميل (اختياري)" dir="ltr" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">التقييم:</span>
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} onClick={() => updateItem(i, 'rating', s)} className={`text-xl ${(item.rating || 5) >= s ? 'text-yellow-400' : 'text-muted-foreground/30'}`}>★</button>
            ))}
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full gap-1" onClick={() => onChange({ ...content, items: [...items, { name: '', role: '', text: '', avatar: '', rating: 5 }] })}>
        <Plus className="h-3 w-3" /> إضافة تقييم
      </Button>
    </div>
  );
};

const TeamEditor = ({ content, onChange }: any) => {
  const members = content.members || [];
  const updateMember = (i: number, field: string, val: string) => {
    onChange({ ...content, members: members.map((m: any, j: number) => j === i ? { ...m, [field]: val } : m) });
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Input value={content.title || ''} onChange={e => onChange({ ...content, title: e.target.value })} placeholder="عنوان القسم (مثل: فريقنا)" dir="rtl" className="flex-1" />
        <Select value={String(content.columns || 4)} onValueChange={v => onChange({ ...content, columns: Number(v) })}>
          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem><SelectItem value="4">4</SelectItem></SelectContent>
        </Select>
      </div>
      {members.map((m: any, i: number) => (
        <div key={i} className="border rounded-lg p-3 space-y-2 bg-muted/30">
          <div className="flex justify-between">
            <span className="text-xs font-medium text-muted-foreground">عضو {i + 1}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onChange({ ...content, members: members.filter((_: any, j: number) => j !== i) })}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          <Input value={m.image || ''} onChange={e => updateMember(i, 'image', e.target.value)} placeholder="رابط الصورة" dir="ltr" />
          <div className="grid grid-cols-2 gap-2">
            <Input value={m.name || ''} onChange={e => updateMember(i, 'name', e.target.value)} placeholder="الاسم" dir="rtl" />
            <Input value={m.role || ''} onChange={e => updateMember(i, 'role', e.target.value)} placeholder="المنصب" dir="rtl" />
          </div>
          <Textarea value={m.bio || ''} onChange={e => updateMember(i, 'bio', e.target.value)} placeholder="نبذة مختصرة (اختياري)" rows={2} dir="rtl" />
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full gap-1" onClick={() => onChange({ ...content, members: [...members, { name: '', role: '', image: '', bio: '' }] })}>
        <Plus className="h-3 w-3" /> إضافة عضو
      </Button>
    </div>
  );
};

const FaqEditor = ({ content, onChange }: any) => {
  const items = content.items || [];
  const updateItem = (i: number, field: string, val: string) => {
    onChange({ ...content, items: items.map((item: any, j: number) => j === i ? { ...item, [field]: val } : item) });
  };
  return (
    <div className="space-y-3">
      <Input value={content.title || ''} onChange={e => onChange({ ...content, title: e.target.value })} placeholder="عنوان القسم (مثل: الأسئلة الشائعة)" dir="rtl" />
      {items.map((item: any, i: number) => (
        <div key={i} className="border rounded-lg p-3 space-y-2 bg-muted/30">
          <div className="flex gap-2">
            <Input value={item.q || ''} onChange={e => updateItem(i, 'q', e.target.value)} placeholder="السؤال؟" dir="rtl" className="flex-1 font-medium" />
            <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive shrink-0" onClick={() => onChange({ ...content, items: items.filter((_: any, j: number) => j !== i) })}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Textarea value={item.a || ''} onChange={e => updateItem(i, 'a', e.target.value)} placeholder="الإجابة..." rows={2} dir="rtl" />
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full gap-1" onClick={() => onChange({ ...content, items: [...items, { q: '', a: '' }] })}>
        <Plus className="h-3 w-3" /> إضافة سؤال
      </Button>
    </div>
  );
};

const StepsEditor = ({ content, onChange }: any) => {
  const steps = content.steps || [];
  const updateStep = (i: number, field: string, val: string) => {
    onChange({ ...content, steps: steps.map((s: any, j: number) => j === i ? { ...s, [field]: val } : s) });
  };
  return (
    <div className="space-y-3">
      <Input value={content.title || ''} onChange={e => onChange({ ...content, title: e.target.value })} placeholder="عنوان القسم (اختياري)" dir="rtl" />
      {steps.map((step: any, i: number) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0 mt-1">{i + 1}</div>
          <div className="flex-1 border rounded-lg p-3 space-y-2 bg-muted/30">
            <Input value={step.title || ''} onChange={e => updateStep(i, 'title', e.target.value)} placeholder="عنوان الخطوة" dir="rtl" className="font-semibold" />
            <Textarea value={step.description || ''} onChange={e => updateStep(i, 'description', e.target.value)} placeholder="وصف الخطوة (اختياري)" rows={2} dir="rtl" />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive mt-1 shrink-0" onClick={() => onChange({ ...content, steps: steps.filter((_: any, j: number) => j !== i) })}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full gap-1" onClick={() => onChange({ ...content, steps: [...steps, { title: '', description: '' }] })}>
        <Plus className="h-3 w-3" /> إضافة خطوة
      </Button>
    </div>
  );
};

const ColumnsEditor = ({ content, onChange }: any) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">نسبة الأعمدة:</span>
      <Select value={content.ratio || '50-50'} onValueChange={v => onChange({ ...content, ratio: v })}>
        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="50-50">50% / 50%</SelectItem>
          <SelectItem value="60-40">60% / 40%</SelectItem>
          <SelectItem value="70-30">70% / 30%</SelectItem>
          <SelectItem value="30-70">30% / 70%</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
      💡 محتوى الأعمدة يُضاف بعد الحفظ عبر الـ Page Renderer. هذا البلوك يحدد الهيكل فقط.
    </p>
  </div>
);

// ─── Block Content Editor Router ──────────────────────────────────────────────

const BlockContentEditor = ({ block, onChange }: { block: Block; onChange: (content: any) => void }) => {
  const p = { content: block.content, onChange };
  switch (block.type) {
    case 'heading': return <HeadingEditor {...p} />;
    case 'paragraph': return <ParagraphEditor {...p} />;
    case 'image': return <ImageEditor {...p} />;
    case 'gallery': return <GalleryEditor {...p} />;
    case 'video': return <VideoEditor {...p} />;
    case 'embed': return <EmbedEditor {...p} />;
    case 'html': return <HtmlEditor {...p} />;
    case 'quote': return <QuoteEditor {...p} />;
    case 'list': return <ListEditor {...p} />;
    case 'table': return <TableEditor {...p} />;
    case 'divider': return <DividerEditor {...p} />;
    case 'spacer': return <SpacerEditor {...p} />;
    case 'cta': return <CtaEditor {...p} />;
    case 'alert': return <AlertEditor {...p} />;
    case 'banner': return <BannerEditor {...p} />;
    case 'stats': return <StatsEditor {...p} />;
    case 'cards': return <CardsEditor {...p} />;
    case 'testimonials': return <TestimonialsEditor {...p} />;
    case 'team': return <TeamEditor {...p} />;
    case 'faq': return <FaqEditor {...p} />;
    case 'steps': return <StepsEditor {...p} />;
    case 'columns': return <ColumnsEditor {...p} />;
    default: return <p className="text-muted-foreground text-sm">نوع البلوك غير مدعوم</p>;
  }
};

// ─── Single Block Item ────────────────────────────────────────────────────────

interface BlockItemProps {
  block: Block;
  index: number;
  total: number;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

const BlockItem = ({ block, index, total, onUpdate, onDelete, onMoveUp, onMoveDown }: BlockItemProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const def = BLOCK_DEFS.find(b => b.type === block.type);
  const Icon = def?.icon || Type;

  return (
    <Card className="border-2 hover:border-primary/40 transition-colors overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 bg-muted/30 cursor-pointer select-none"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" onClick={e => e.stopPropagation()} />
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{def?.category}</span>
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">{def?.label}</span>
        </div>
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onMoveUp(index)} disabled={index === 0}><ChevronUp className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onMoveDown(index)} disabled={index === total - 1}><ChevronDown className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(block.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
          <ChevDown className={`h-4 w-4 text-muted-foreground transition-transform ${collapsed ? '-rotate-90' : ''}`} onClick={() => setCollapsed(c => !c)} />
        </div>
      </div>
      {/* Content */}
      {!collapsed && (
        <div className="p-4">
          <BlockContentEditor block={block} onChange={(content) => onUpdate(block.id, content)} />
        </div>
      )}
    </Card>
  );
};

// ─── Add Block Menu ───────────────────────────────────────────────────────────

const AddBlockMenu = ({ onAdd }: { onAdd: (type: BlockType) => void }) => {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('نصوص');

  const filtered = BLOCK_DEFS.filter(b => b.category === activeCategory);

  return (
    <div className="relative">
      <Button variant="outline" className="w-full border-dashed gap-2 border-primary/40 text-primary hover:bg-primary/5" onClick={() => setOpen(!open)}>
        <Plus className="h-4 w-4" />
        إضافة بلوك جديد
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <Card className="absolute bottom-full mb-2 w-full z-50 shadow-2xl overflow-hidden border-2">
            {/* Category tabs */}
            <div className="flex overflow-x-auto border-b bg-muted/30 no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Blocks grid */}
            <div className="p-3 grid grid-cols-4 gap-2">
              {filtered.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => { onAdd(type); setOpen(false); }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-primary/10 hover:text-primary text-center transition-all group border border-transparent hover:border-primary/20"
                >
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <span className="text-[11px] leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

// ─── Main Block Editor ────────────────────────────────────────────────────────

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const addBlock = useCallback((type: BlockType) => {
    const def = BLOCK_DEFS.find(b => b.type === type)!;
    const newBlock: Block = { id: uuidv4(), type, content: { ...def.defaultContent }, order: blocks.length };
    onChange([...blocks, newBlock]);
  }, [blocks, onChange]);

  const updateBlock = useCallback((id: string, content: any) => {
    onChange(blocks.map(b => b.id === id ? { ...b, content } : b));
  }, [blocks, onChange]);

  const deleteBlock = useCallback((id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  }, [blocks, onChange]);

  const moveUp = useCallback((index: number) => {
    if (index === 0) return;
    const next = [...blocks];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next.map((b, i) => ({ ...b, order: i })));
  }, [blocks, onChange]);

  const moveDown = useCallback((index: number) => {
    if (index === blocks.length - 1) return;
    const next = [...blocks];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next.map((b, i) => ({ ...b, order: i })));
  }, [blocks, onChange]);

  return (
    <div className="space-y-2" dir="rtl">
      {blocks.length === 0 && (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-xl border-primary/20">
          <LayoutGrid className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">لا يوجد محتوى بعد</p>
          <p className="text-sm opacity-60 mt-1">اضغط على "إضافة بلوك جديد" لتبدأ</p>
        </div>
      )}
      {blocks.map((block, index) => (
        <BlockItem key={block.id} block={block} index={index} total={blocks.length}
          onUpdate={updateBlock} onDelete={deleteBlock} onMoveUp={moveUp} onMoveDown={moveDown} />
      ))}
      <AddBlockMenu onAdd={addBlock} />
    </div>
  );
}

export default BlockEditor;
