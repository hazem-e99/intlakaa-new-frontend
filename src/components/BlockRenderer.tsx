import { Block } from '@/services/pageService';
import { cn } from '@/lib/utils';

// ─── Helper: embed URL ────────────────────────────────────────────────────────

function getEmbedUrl(url: string): string {
  if (!url) return '';
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

// ─── Block Renderers ──────────────────────────────────────────────────────────

function HeadingBlock({ data, settings }: { data: any; settings?: Block['settings'] }) {
  const Tag = (data.level || 'h2') as keyof JSX.IntrinsicElements;
  const sizes: Record<string, string> = {
    h1: 'text-4xl md:text-5xl font-bold',
    h2: 'text-3xl md:text-4xl font-bold',
    h3: 'text-2xl md:text-3xl font-semibold',
    h4: 'text-xl md:text-2xl font-semibold',
  };
  return (
    <Tag
      className={cn(sizes[data.level || 'h2'], 'leading-[1.45]')}
      style={{
        textAlign: settings?.textAlign || 'right',
        color: settings?.textColor || undefined,
      }}
    >
      {data.text}
    </Tag>
  );
}

function ParagraphBlock({ data, settings }: { data: any; settings?: Block['settings'] }) {
  return (
    <div
      className="text-base md:text-lg leading-relaxed text-foreground/80 quill-content"
      style={{
        textAlign: settings?.textAlign || 'right',
        color: settings?.textColor || undefined,
      }}
      dangerouslySetInnerHTML={{ __html: data.text || '' }}
    />
  );
}

function ImageBlock({ data }: { data: any }) {
  if (!data.src) return null;
  return (
    <figure className="w-full">
      <img
        src={data.src}
        alt={data.alt || data.caption || 'Content image'}
        loading="lazy"
        decoding="async"
        className="w-full rounded-xl object-cover"
      />
      {data.caption && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2">{data.caption}</figcaption>
      )}
    </figure>
  );
}

function VideoBlock({ data }: { data: any }) {
  if (!data.url) return null;
  const embed = getEmbedUrl(data.url);
  return (
    <figure className="w-full">
      <div className="relative pt-[56.25%] rounded-xl overflow-hidden bg-black">
        <iframe
          src={embed}
          title={data.caption || 'Embedded video'}
          loading="lazy"
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      {data.caption && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2">{data.caption}</figcaption>
      )}
    </figure>
  );
}

function HtmlBlock({ data }: { data: any }) {
  return (
    <div
      className="prose prose-lg max-w-none text-right"
      dangerouslySetInnerHTML={{ __html: data.code || '' }}
    />
  );
}

function QuoteBlock({ data }: { data: any }) {
  return (
    <blockquote className="border-r-4 border-primary pr-6 py-2 my-4">
      <p className="text-lg italic text-foreground/80 text-right">{data.text}</p>
      {data.author && (
        <cite className="text-sm text-muted-foreground text-right block mt-2">— {data.author}</cite>
      )}
    </blockquote>
  );
}

function DividerBlock() {
  return <hr className="border-border my-4" />;
}

function ButtonBlock({ data }: { data: any }) {
  const variants: Record<string, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
  };
  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  return (
    <div className="flex justify-center">
      <a
        href={data.url || '/'}
        className={cn(
          'inline-block rounded-full font-semibold transition-all',
          variants[data.variant || 'primary'],
          sizes[data.size || 'md']
        )}
      >
        {data.text}
      </a>
    </div>
  );
}

function ListBlock({ data }: { data: any }) {
  const Tag = (data.style === 'ol' ? 'ol' : 'ul') as 'ul' | 'ol';
  return (
    <Tag className={cn('space-y-1 text-right', data.style === 'ol' ? 'list-decimal list-inside' : 'list-disc list-inside')}>
      {(data.items || []).map((item: string, idx: number) => (
        <li key={idx} className="text-base text-foreground/80">{item}</li>
      ))}
    </Tag>
  );
}

function HeroBlock({ data }: { data: any }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden py-20 px-8 text-center"
      style={{
        backgroundImage: data.bgImage ? `url(${data.bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: data.bgImage ? undefined : '#0f172a',
      }}
    >
      {data.bgImage && <div className="absolute inset-0 bg-black/50" />}
      <div className="relative z-10 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">{data.subtitle}</p>
        {data.buttonText && (
          <a
            href={data.buttonUrl || '/'}
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all"
          >
            {data.buttonText}
          </a>
        )}
      </div>
    </div>
  );
}

function CtaBlock({ data }: { data: any }) {
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-10 text-center">
      <h2 className="text-3xl font-bold mb-3">{data.title}</h2>
      <p className="text-muted-foreground mb-6">{data.subtitle}</p>
      {data.buttonText && (
        <a
          href={data.buttonUrl || '/'}
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all"
        >
          {data.buttonText}
        </a>
      )}
    </div>
  );
}

function GalleryBlock({ data }: { data: any }) {
  const images: string[] = (data.images || []).filter(Boolean);
  if (!images.length) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {images.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`Gallery image ${idx + 1}`}
          loading="lazy"
          decoding="async"
          className="w-full h-48 object-cover rounded-xl"
        />
      ))}
    </div>
  );
}

// ─── Main Renderer ────────────────────────────────────────────────────────────

interface BlockRendererProps {
  blocks: Block[];
  className?: string;
}

export default function BlockRenderer({ blocks, className }: BlockRendererProps) {
  if (!blocks?.length) return null;

  return (
    <div className={cn('space-y-8', className)} dir="rtl">
      {blocks.map(block => {
        const style: React.CSSProperties = {
          paddingTop: block.settings?.paddingTop ? `${block.settings.paddingTop}px` : undefined,
          paddingBottom: block.settings?.paddingBottom ? `${block.settings.paddingBottom}px` : undefined,
          backgroundColor: block.settings?.backgroundColor || undefined,
        };

        return (
          <div key={block.id} style={style} className={block.settings?.customClass}>
            {block.type === 'heading' && <HeadingBlock data={block.data} settings={block.settings} />}
            {block.type === 'paragraph' && <ParagraphBlock data={block.data} settings={block.settings} />}
            {block.type === 'image' && <ImageBlock data={block.data} />}
            {block.type === 'video' && <VideoBlock data={block.data} />}
            {block.type === 'html' && <HtmlBlock data={block.data} />}
            {block.type === 'quote' && <QuoteBlock data={block.data} />}
            {block.type === 'divider' && <DividerBlock />}
            {block.type === 'button' && <ButtonBlock data={block.data} />}
            {block.type === 'list' && <ListBlock data={block.data} />}
            {block.type === 'hero' && <HeroBlock data={block.data} />}
            {block.type === 'cta' && <CtaBlock data={block.data} />}
            {block.type === 'gallery' && <GalleryBlock data={block.data} />}
          </div>
        );
      })}
    </div>
  );
}
