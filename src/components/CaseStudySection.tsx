import { memo, useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import { usePerPage } from "@/hooks/use-per-page";
import FadeIn from "@/components/FadeIn";

interface VideoCard {
  id: string;
  caption: string;
  highlights: { text: string; highlight: boolean }[];
}

const videos: VideoCard[] = [
  {
    id: "FnyHvtsMmLY",
    caption: "متجر يكسر حاجز مليون و700 ألف",
    highlights: [
      { text: "متجر يكسر حاجز ", highlight: false },
      { text: "مليون", highlight: true },
      { text: " و", highlight: false },
      { text: "700 ألف", highlight: true },
    ],
  },
  {
    id: "KA_WqTOn_TY",
    caption: "أكثر من 140,000 في أقل من شهر",
    highlights: [
      { text: "أكثر من ", highlight: false },
      { text: "140,000", highlight: true },
      { text: " في أقل من شهر", highlight: false },
    ],
  },
  {
    id: "rT7G9dqDnDU",
    caption: "من 11 ألف شهرياً لأكثر من 129,000 في أقل من 30 يوم",
    highlights: [
      { text: "من ", highlight: false },
      { text: "11 ألف", highlight: true },
      { text: " شهرياً لأكثر من ", highlight: false },
      { text: "129,000", highlight: true },
      { text: " في أقل من ", highlight: false },
      { text: "30", highlight: true },
      { text: " يوم", highlight: false },
    ],
  },
  {
    id: "vJdvht5M8no",
    caption: "متجر عبايات وصل من صفر لـ 107,000 في أقل من شهر",
    highlights: [
      { text: "متجر عبايات وصل من ", highlight: false },
      { text: "صفر", highlight: true },
      { text: " لـ ", highlight: false },
      { text: "107,000", highlight: true },
      { text: " في أقل من شهر", highlight: false },
    ],
  },
  {
    id: "WgfSnIMpKfc",
    caption: "متجر وصل من 7 آلاف لـ 79,000 ريال في 20 يوم",
    highlights: [
      { text: "متجر وصل من ", highlight: false },
      { text: "7 آلاف", highlight: true },
      { text: " لـ ", highlight: false },
      { text: "79,000", highlight: true },
      { text: " ريال في ", highlight: false },
      { text: "20", highlight: true },
      { text: " يوم", highlight: false },
    ],
  },
  {
    id: "ikTIjhyZGXk",
    caption:
      "كيف ساعدنا براند ملابس على كسر حاجز 100 ألف ريال خلال أسبوع واحد فقط باستخدام استراتيجية واحدة على تيكتوك",
    highlights: [
      { text: "كيف ساعدنا براند ملابس على كسر حاجز ", highlight: false },
      { text: "100 ألف", highlight: true },
      { text: " ريال خلال ", highlight: false },
      { text: "أسبوع واحد", highlight: true },
      {
        text: " فقط باستخدام استراتيجية واحدة على تيكتوك",
        highlight: false,
      },
    ],
  },
];

const CaseStudySection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [modalVideoId, setModalVideoId] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const perPage = usePerPage();
  const totalPages = Math.ceil(videos.length / perPage);

  // Touch swipe state
  const touchStartX = useRef(0);
  const touchDiffX = useRef(0);

  const closeModal = useCallback(() => {
    if (isExiting || !modalVideoId) return;
    setIsExiting(true);
    window.setTimeout(() => {
      setModalVideoId(null);
      setIsExiting(false);
    }, 300);
  }, [isExiting, modalVideoId]);

  const goNext = useCallback(() => {
    setCurrentPage((prev) => (prev + 1 >= totalPages ? 0 : prev + 1));
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 < 0 ? totalPages - 1 : prev - 1));
  }, [totalPages]);

  // Reset page on resize if out of bounds
  useEffect(() => {
    if (currentPage >= totalPages) setCurrentPage(Math.max(0, totalPages - 1));
  }, [totalPages, currentPage]);

  useEffect(() => {
    const updateCardWidth = () => {
      if (!trackRef.current || !trackRef.current.children[0]) return;

      const card = trackRef.current.children[0] as HTMLElement;
      const gap = 16;
      setCardWidth(card.offsetWidth + gap);
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, [perPage]);

  // RTL: positive translateX moves right (which scrolls "forward" in RTL)
  const translateX = currentPage * cardWidth * perPage;

  // Close modal on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (modalVideoId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalVideoId]);

  // Card width class based on perPage
  const cardFlexBasis =
    perPage === 1
      ? "flex-[0_0_88%]"
      : perPage === 2
        ? "flex-[0_0_calc((100%-16px)/2)]"
        : "flex-[0_0_calc((100%-32px)/3)]";

  return (
    <>
      <section className="section-py px-4 section-bg-elevated overflow-hidden" id="casestudies">
        <div className="container mx-auto">
          {/* Header */}
          <FadeIn delay={0} direction="up" duration={0.6} className="text-center mb-12">
            <div className="w-[50px] h-[3px] rounded-full mx-auto mb-4" style={{ background: 'linear-gradient(to left, #9b50e8, #7c3aed)' }} />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-[1.5] max-w-4xl mx-auto text-white">
              هدفنا مو بس نسوّي حملات… نسوّي حملات تنذكر كـ Case Study
            </h2>
            <p className="text-sm text-white/50 max-w-xl mx-auto leading-relaxed">
              شاهد التحليل من لوحات التحكم — نتائج حقيقية مباشرة من داخل حسابات
              عملائنا.
            </p>
          </FadeIn>

          {/* Carousel */}
          <div className="relative mt-6">
            <div className="flex items-center gap-3">
              {/* Prev Button */}
              <button
                onClick={goPrev}
                className="cta-hover hidden md:flex flex-shrink-0 w-11 h-11 items-center justify-center rounded-full text-white transition-all"
                style={{ background: 'rgba(21,11,46,0.8)', border: '1px solid rgba(155,80,232,0.2)' }}
                aria-label="السابق"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Track */}
              <div className="overflow-hidden flex-1 rounded-xl">
                <div
                  ref={trackRef}
                  className="flex gap-4 transition-transform duration-500"
                  style={{
                    transform: `translateX(${translateX}px)`,
                    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                  onTouchStart={(e) => {
                    touchStartX.current = e.touches[0].clientX;
                    touchDiffX.current = 0;
                  }}
                  onTouchMove={(e) => {
                    touchDiffX.current =
                      e.touches[0].clientX - touchStartX.current;
                  }}
                  onTouchEnd={() => {
                    if (Math.abs(touchDiffX.current) > 40) {
                      // RTL swipe: swipe right = next, swipe left = prev
                      if (touchDiffX.current > 0) goNext();
                      else goPrev();
                    }
                    touchDiffX.current = 0;
                  }}
                >
                  {videos.map((video, index) => (
                    <FadeIn
                      key={video.id}
                      delay={index * 0.08}
                      direction="up"
                      duration={0.5}
                      className={cardFlexBasis}
                    >
                      <div
                        className="rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all group hover-lift-sm w-full"
                        style={{ background: 'rgba(13,5,32,0.9)', border: '1px solid rgba(155,80,232,0.12)' }}
                        onClick={() => {
                          setIsExiting(false);
                          setModalVideoId(video.id);
                        }}
                      >
                        {/* Thumbnail Container */}
                        <div className="relative w-full pt-[56.25%] flex-shrink-0 bg-[#0a0a1a]">
                          <picture>
                            <source srcSet={`https://i.ytimg.com/vi_webp/${video.id}/hqdefault.webp`} type="image/webp" />
                            <img
                              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                              alt={video.caption}
                              loading="lazy"
                              decoding="async"
                              className="absolute top-0 left-0 w-full h-full object-cover"
                            />
                          </picture>
                          {/* Play Button */}
                          <button
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-600/85 rounded-2xl flex items-center justify-center z-[2] group-hover:scale-110 group-hover:bg-red-600 transition-all"
                            aria-label="تشغيل الفيديو"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsExiting(false);
                              setModalVideoId(video.id);
                            }}
                          >
                            <Play className="w-7 h-7 text-white fill-white ml-[-2px]" />
                          </button>
                        </div>

                        {/* Caption */}
                        <div className="px-4 py-3.5 text-white text-sm font-bold leading-relaxed text-center flex-grow flex items-center justify-center" style={{ background: 'rgba(13,5,32,0.95)' }}>
                          <span>
                            {video.highlights.map((part, i) =>
                              part.highlight ? (
                                <span
                                  key={i}
                                  className="text-[#f5c542] font-black"
                                >
                                  {part.text}
                                </span>
                              ) : (
                                <span key={i}>{part.text}</span>
                              )
                            )}
                          </span>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={goNext}
                className="cta-hover hidden md:flex flex-shrink-0 w-11 h-11 items-center justify-center rounded-full text-white transition-all"
                style={{ background: 'rgba(21,11,46,0.8)', border: '1px solid rgba(155,80,232,0.2)' }}
                aria-label="التالي"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-5">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    background: i === currentPage ? '#9b50e8' : 'rgba(155,80,232,0.2)',
                    transform: i === currentPage ? 'scale(1.3)' : 'scale(1)',
                    boxShadow: i === currentPage ? '0 0 8px rgba(155,80,232,0.5)' : 'none',
                  }}
                  aria-label={`صفحة ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {modalVideoId && (
        <div
          className={`fixed inset-0 z-[99999] flex items-center justify-center p-5 bg-black/92 transition-opacity duration-300 ${isExiting ? "opacity-0" : "opacity-100"}`}
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-[900px] aspect-video rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/15 border border-white/30 rounded-full text-white text-xl flex items-center justify-center hover:bg-white/30 transition-colors z-[2]"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${modalVideoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&controls=1`}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};

export default memo(CaseStudySection);
