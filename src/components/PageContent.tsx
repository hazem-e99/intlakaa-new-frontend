import { Block } from '@/services/cmsService';
import { useMemo, useState } from 'react';

// ─── Individual Block Renderers ───────────────────────────────────────────────

const HeadingRenderer = ({ content }: { content: any }) => {
  const Tag = (content.level || 'h2') as keyof JSX.IntrinsicElements;
  const align = content.align === 'center' ? 'text-center' : content.align === 'left' ? 'text-left' : 'text-right';
  const size: Record<string, string> = {
    h1: 'text-4xl md:text-5xl font-bold', h2: 'text-3xl md:text-4xl font-bold',
    h3: 'text-2xl md:text-3xl font-semibold', h4: 'text-xl md:text-2xl font-semibold',
    h5: 'text-lg md:text-xl font-medium', h6: 'text-base md:text-lg font-medium',
  };
  return <Tag className={`${size[content.level || 'h2']} ${align} text-foreground leading-[1.45]`} dir="rtl" style={{ color: content.color || undefined }}>{content.text}</Tag>;
};

const ParagraphRenderer = ({ content }: { content: any }) => {
  const align = content.align === 'center' ? 'text-center' : content.align === 'left' ? 'text-left' : 'text-right';
  return (
    <div 
      className={`text-base md:text-lg leading-relaxed text-muted-foreground ${align} quill-content`} 
      dir="rtl"
      dangerouslySetInnerHTML={{ __html: content.text || '' }}
    />
  );
};

const ImageRenderer = ({ content }: { content: any }) => {
  const sizeClass: Record<string, string> = { full: 'w-full', wide: 'max-w-3xl mx-auto w-full', medium: 'max-w-xl mx-auto w-full', small: 'max-w-xs mx-auto w-full' };
  return (
    <figure className={sizeClass[content.size || 'full']}>
      <img
        src={content.url}
        alt={content.alt || content.caption || 'Content image'}
        loading="lazy"
        decoding="async"
        className="w-full rounded-xl object-cover"
      />
      {content.caption && <figcaption className="text-center text-sm text-muted-foreground mt-2" dir="rtl">{content.caption}</figcaption>}
    </figure>
  );
};

const GalleryRenderer = ({ content }: { content: any }) => {
  const images: string[] = (content.images || []).filter(Boolean);
  const cols = content.columns || 3;
  const gridClass: Record<number, string> = { 2: 'grid-cols-2', 3: 'grid-cols-2 md:grid-cols-3', 4: 'grid-cols-2 md:grid-cols-4' };
  return (
    <div className={`grid ${gridClass[cols] || 'grid-cols-3'} gap-3`}>
      {images.map((url, i) => (
        <div key={i} className="overflow-hidden rounded-xl aspect-square">
          <img
            src={url}
            alt={`صورة ${i + 1}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      ))}
    </div>
  );
};

const VideoRenderer = ({ content }: { content: any }) => (
  <figure>
    <div className="aspect-video rounded-xl overflow-hidden bg-black">
      <iframe
        src={content.embed}
        title={content.caption || 'Embedded video'}
        loading="lazy"
        className="w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
    {content.caption && <figcaption className="text-center text-sm text-muted-foreground mt-2" dir="rtl">{content.caption}</figcaption>}
  </figure>
);

const EmbedRenderer = ({ content }: { content: any }) => (
  <div className="w-full overflow-hidden rounded-xl border" style={{ height: content.height || 400 }}
    dangerouslySetInnerHTML={{ __html: content.code || '' }} />
);

const HtmlRenderer = ({ content }: { content: any }) => (
  <div className="w-full" dangerouslySetInnerHTML={{ __html: content.code || '' }} />
);

const QuoteRenderer = ({ content }: { content: any }) => (
  <blockquote className="border-r-4 border-primary pr-6 py-2 my-4" dir="rtl">
    <p className="text-lg md:text-xl italic text-foreground leading-relaxed">"{content.text}"</p>
    {content.author && <footer className="text-sm text-muted-foreground mt-2">— {content.author}</footer>}
  </blockquote>
);

const ListRenderer = ({ content }: { content: any }) => {
  const items: string[] = content.items || [];
  const markers: Record<string, string> = { bullet: '•', numbered: '', check: '✓', arrow: '→' };
  if (content.style === 'numbered') {
    return (
      <ol className="space-y-2 list-none" dir="rtl">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0 mt-0.5">{i + 1}</span>
            <span className="text-base text-muted-foreground leading-relaxed">{item}</span>
          </li>
        ))}
      </ol>
    );
  }
  const colorMap: Record<string, string> = { check: 'text-green-500', arrow: 'text-primary', bullet: 'text-primary' };
  return (
    <ul className="space-y-2 list-none" dir="rtl">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className={`font-bold text-lg shrink-0 ${colorMap[content.style] || 'text-primary'}`}>{markers[content.style] || '•'}</span>
          <span className="text-base text-muted-foreground leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
};

const TableRenderer = ({ content }: { content: any }) => {
  const headers: string[] = content.headers || [];
  const rows: string[][] = content.rows || [];
  return (
    <div className="overflow-x-auto" dir="rtl">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-primary/10">
            {headers.map((h, i) => <th key={i} className="border border-border px-4 py-3 text-right font-semibold text-foreground">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-muted/50 transition-colors">
              {row.map((cell, ci) => <td key={ci} className="border border-border px-4 py-3 text-right text-muted-foreground">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DividerRenderer = ({ content }: { content: any }) => {
  const styles: Record<string, string> = {
    line: 'border-solid border-border',
    dashed: 'border-dashed border-border',
    dots: 'border-dotted border-border',
    thick: 'border-solid border-border border-t-4',
  };
  return <hr className={`my-2 ${styles[content?.style || 'line']}`} />;
};

const SpacerRenderer = ({ content }: { content: any }) => (
  <div style={{ height: content?.height || 40 }} aria-hidden="true" />
);

const CtaRenderer = ({ content }: { content: any }) => {
  const align = content.align === 'center' ? 'items-center text-center' : content.align === 'left' ? 'items-start text-left' : 'items-end text-right';
  const btnStyles: Record<string, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    ghost: 'text-primary hover:bg-primary/10',
  };
  return (
    <div className={`flex flex-col gap-4 ${align} py-4`} dir="rtl">
      {content.text && <p className="text-lg text-muted-foreground">{content.text}</p>}
      {content.buttonText && (
        <a href={content.buttonUrl || '#'} className={`inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold transition-colors ${btnStyles[content.style || 'primary']}`}>
          {content.buttonText}
        </a>
      )}
    </div>
  );
};

const AlertRenderer = ({ content }: { content: any }) => {
  const typeStyles: Record<string, { border: string; bg: string; icon: string; title: string }> = {
    info: { border: 'border-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30', icon: 'ℹ️', title: 'text-blue-700 dark:text-blue-300' },
    success: { border: 'border-green-400', bg: 'bg-green-50 dark:bg-green-950/30', icon: '✅', title: 'text-green-700 dark:text-green-300' },
    warning: { border: 'border-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-950/30', icon: '⚠️', title: 'text-yellow-700 dark:text-yellow-300' },
    error: { border: 'border-red-400', bg: 'bg-red-50 dark:bg-red-950/30', icon: '❌', title: 'text-red-700 dark:text-red-300' },
    tip: { border: 'border-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30', icon: '💡', title: 'text-purple-700 dark:text-purple-300' },
  };
  const s = typeStyles[content.type || 'info'];
  return (
    <div className={`border-r-4 ${s.border} ${s.bg} rounded-xl p-4`} dir="rtl">
      <div className="flex items-start gap-3">
        <span className="text-xl">{s.icon}</span>
        <div>
          {content.title && <p className={`font-bold mb-1 ${s.title}`}>{content.title}</p>}
          <p className="text-sm leading-relaxed">{content.message}</p>
        </div>
      </div>
    </div>
  );
};

const BannerRenderer = ({ content }: { content: any }) => {
  const layout = content.layout || 'color';
  const mediaType = content.mediaType || 'image';
  const mediaSrc = content.mediaUrl || '';
  const bgColor = content.bgColor || '#6B21A8';
  const textColor = content.textColor || '#ffffff';
  const alignClass = content.align === 'center' ? 'text-center' : content.align === 'left' ? 'text-left' : 'text-right';
  const overlayOpacity = content.overlayOpacity ?? 0.4;
  const isFullWidth = content.width === 'full';

  const MediaEl = ({ className = '' }: { className?: string }) =>
    mediaType === 'video'
      ? <video src={mediaSrc} autoPlay muted loop playsInline className={className} />
      : <img src={mediaSrc} alt={content.mediaAlt || content.title || 'Banner image'} loading="lazy" decoding="async" className={className} />;

  const TextBlock = () => (
    <div className={`space-y-4 ${alignClass}`} style={{ color: textColor }}>
      <h2 className="text-3xl md:text-4xl font-bold leading-[1.4]">{content.title}</h2>
      {content.subtitle && <p className="text-lg opacity-80 leading-relaxed">{content.subtitle}</p>}
      {content.buttonText && (
        <a
          href={content.buttonUrl || '#'}
          className="inline-flex items-center justify-center mt-2 px-8 py-3 rounded-full font-semibold border-2 border-current hover:opacity-90 transition-opacity"
        >
          {content.buttonText}
        </a>
      )}
    </div>
  );

  const containerClass = isFullWidth ? 'rounded-none' : 'rounded-2xl';

  // ── color only
  if (layout === 'color') {
    return (
      <div className={`${containerClass} px-8 py-14 ${alignClass}`} style={{ backgroundColor: bgColor }}>
        <TextBlock />
      </div>
    );
  }

  // ── media background
  if (layout === 'media-bg') {
    return (
      <div className={`${containerClass} overflow-hidden relative`}>
        {mediaSrc
          ? <MediaEl className="absolute inset-0 w-full h-full object-cover" />
          : <div className="absolute inset-0 bg-muted" />
        }
        {/* overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: bgColor, opacity: overlayOpacity }}
        />
        <div className="relative z-10 px-8 py-20">
          <TextBlock />
        </div>
      </div>
    );
  }

  // ── side layouts
  const isRight = layout === 'media-right';
  return (
    <div
      className={`${containerClass} overflow-hidden flex flex-col md:flex-row items-stretch`}
      style={{ backgroundColor: bgColor }}
      dir={isRight ? 'ltr' : 'rtl'}
    >
      {/* text side */}
      <div className="flex-1 px-8 py-12 flex items-center" dir="rtl">
        <TextBlock />
      </div>
      {/* media side */}
      <div className="w-full md:w-2/5 shrink-0 min-h-[240px] overflow-hidden">
        {mediaSrc
          ? <MediaEl className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-muted/30" />
        }
      </div>
    </div>
  );
};

const StatsRenderer = ({ content }: { content: any }) => {
  const items = content.items || [];
  const colsClass = items.length <= 2 ? 'grid-cols-2' : items.length === 3 ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4';
  return (
    <div className={`grid ${colsClass} gap-6`} dir="rtl">
      {items.map((item: any, i: number) => (
        <div key={i} className="text-center p-6 rounded-2xl bg-muted/50 border">
          <p className="text-4xl md:text-5xl font-black text-primary">{item.number}</p>
          <p className="text-muted-foreground mt-2 font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

const CardsRenderer = ({ content }: { content: any }) => {
  const items = content.items || [];
  const cols = content.columns || 3;
  const gridClass: Record<number, string> = { 1: 'grid-cols-1', 2: 'grid-cols-1 md:grid-cols-2', 3: 'grid-cols-1 md:grid-cols-3', 4: 'grid-cols-2 md:grid-cols-4' };
  return (
    <div className={`grid ${gridClass[cols] || 'grid-cols-3'} gap-6`} dir="rtl">
      {items.map((item: any, i: number) => (
        <div key={i} className="rounded-2xl border bg-card p-6 hover:shadow-lg transition-shadow">
          {item.image && (
            <img
              src={item.image}
              alt={item.title || 'Card image'}
              loading="lazy"
              decoding="async"
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
          )}
          {!item.image && item.icon && <div className="text-4xl mb-4">{item.icon}</div>}
          {item.title && <h3 className="font-bold text-lg mb-2">{item.title}</h3>}
          {item.description && <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>}
        </div>
      ))}
    </div>
  );
};

const TestimonialsRenderer = ({ content }: { content: any }) => {
  const items = content.items || [];
  return (
    <div className="grid gap-6 md:grid-cols-2" dir="rtl">
      {items.map((item: any, i: number) => (
        <div key={i} className="rounded-2xl border bg-card p-6">
          <div className="flex gap-0.5 mb-3">
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s} className={`text-lg ${(item.rating || 5) >= s ? 'text-yellow-400' : 'text-muted-foreground/20'}`}>★</span>
            ))}
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">"{item.text}"</p>
          <div className="flex items-center gap-3">
            {item.avatar ? (
              <img
                src={item.avatar}
                alt={item.name || 'User avatar'}
                loading="lazy"
                decoding="async"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{item.name?.charAt(0)}</div>
            )}
            <div>
              <p className="font-semibold text-sm">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const TeamRenderer = ({ content }: { content: any }) => {
  const members = content.members || [];
  const cols = content.columns || 4;
  const gridClass: Record<number, string> = { 2: 'grid-cols-2', 3: 'grid-cols-2 md:grid-cols-3', 4: 'grid-cols-2 md:grid-cols-4' };
  return (
    <div dir="rtl">
      {content.title && <h2 className="text-3xl font-bold text-center mb-8">{content.title}</h2>}
      <div className={`grid ${gridClass[cols] || 'grid-cols-4'} gap-6`}>
        {members.map((m: any, i: number) => (
          <div key={i} className="text-center">
            {m.image ? (
              <img
                src={m.image}
                alt={m.name || 'Team member'}
                loading="lazy"
                decoding="async"
                className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl font-bold text-primary">{m.name?.charAt(0)}</span>
              </div>
            )}
            <p className="font-bold">{m.name}</p>
            <p className="text-sm text-muted-foreground">{m.role}</p>
            {m.bio && <p className="text-xs text-muted-foreground/70 mt-2 leading-relaxed">{m.bio}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

const FaqRenderer = ({ content }: { content: any }) => {
  const [open, setOpen] = useState<number | null>(null);
  const items = content.items || [];
  return (
    <div dir="rtl">
      {content.title && <h2 className="text-3xl font-bold text-center mb-8">{content.title}</h2>}
      <div className="space-y-3">
        {items.map((item: any, i: number) => (
          <div key={i} className="rounded-xl border overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-right font-semibold hover:bg-muted/50 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>{item.q}</span>
              <span className={`text-primary transition-transform shrink-0 mr-2 ${open === i ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-muted-foreground leading-relaxed border-t bg-muted/20 pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const StepsRenderer = ({ content }: { content: any }) => {
  const steps = content.steps || [];
  return (
    <div dir="rtl">
      {content.title && <h2 className="text-3xl font-bold text-center mb-10">{content.title}</h2>}
      <div className="space-y-4">
        {steps.map((step: any, i: number) => (
          <div key={i} className="flex gap-4 items-start">
            <div className="flex flex-col items-center shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">{i + 1}</div>
              {i < steps.length - 1 && <div className="w-0.5 h-8 bg-primary/20 mt-1" />}
            </div>
            <div className="flex-1 pb-4">
              <p className="font-bold text-lg">{step.title}</p>
              {step.description && <p className="text-muted-foreground mt-1 leading-relaxed">{step.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ColumnsRenderer = ({ content, children }: { content: any; children?: any }) => {
  const ratioMap: Record<string, string> = { '50-50': 'grid-cols-2', '60-40': 'md:grid-cols-[3fr_2fr]', '70-30': 'md:grid-cols-[7fr_3fr]', '30-70': 'md:grid-cols-[3fr_7fr]' };
  return (
    <div className={`grid ${ratioMap[content?.ratio || '50-50'] || 'grid-cols-2'} gap-8`} dir="rtl">
      <div className="space-y-4">{children?.[0] || <div className="h-24 border-2 border-dashed rounded-xl opacity-30" />}</div>
      <div className="space-y-4">{children?.[1] || <div className="h-24 border-2 border-dashed rounded-xl opacity-30" />}</div>
    </div>
  );
};

// ─── Block Router ─────────────────────────────────────────────────────────────

const BlockRenderer = ({ block }: { block: Block }) => {
  switch (block.type) {
    case 'heading': return <HeadingRenderer content={block.content} />;
    case 'paragraph': return <ParagraphRenderer content={block.content} />;
    case 'image': return <ImageRenderer content={block.content} />;
    case 'gallery': return <GalleryRenderer content={block.content} />;
    case 'video': return <VideoRenderer content={block.content} />;
    case 'embed': return <EmbedRenderer content={block.content} />;
    case 'html': return <HtmlRenderer content={block.content} />;
    case 'quote': return <QuoteRenderer content={block.content} />;
    case 'list': return <ListRenderer content={block.content} />;
    case 'table': return <TableRenderer content={block.content} />;
    case 'divider': return <DividerRenderer content={block.content} />;
    case 'spacer': return <SpacerRenderer content={block.content} />;
    case 'cta': return <CtaRenderer content={block.content} />;
    case 'alert': return <AlertRenderer content={block.content} />;
    case 'banner': return <BannerRenderer content={block.content} />;
    case 'stats': return <StatsRenderer content={block.content} />;
    case 'cards': return <CardsRenderer content={block.content} />;
    case 'testimonials': return <TestimonialsRenderer content={block.content} />;
    case 'team': return <TeamRenderer content={block.content} />;
    case 'faq': return <FaqRenderer content={block.content} />;
    case 'steps': return <StepsRenderer content={block.content} />;
    case 'columns': return <ColumnsRenderer content={block.content} />;
    default: return null;
  }
};

// ─── Main Export ──────────────────────────────────────────────────────────────

interface PageContentProps {
  blocks: Block[];
  className?: string;
}

export function PageContent({ blocks, className = '' }: PageContentProps) {
  if (!blocks || blocks.length === 0) return null;

  const sortedBlocks = useMemo(() => {
    return [...blocks].sort((a, b) => a.order - b.order);
  }, [blocks]);

  return (
    <div className={`space-y-10 ${className}`}>
      {sortedBlocks.map(block => {
        const isFullWidthBanner = block.type === 'banner' && block.content?.width === 'full';

        return (
          <div key={block.id} className={isFullWidthBanner ? '' : 'container mx-auto px-4 max-w-4xl'}>
            <BlockRenderer block={block} />
          </div>
        );
      })}
    </div>
  );
}

export default PageContent;
