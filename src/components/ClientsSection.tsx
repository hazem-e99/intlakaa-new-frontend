import { memo, useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import { usePerPage } from "@/hooks/use-per-page";
import FadeIn from "@/components/FadeIn";

interface ClientVideo {
  id: number;
  src: string;
}

const clientVideos: ClientVideo[] = [1, 2, 3, 4, 6, 7, 13].map((id) => ({
  id,
  src: `/clients/${id}.mp4`,
}));

// Loads video metadata lazily (only when visible) to show the first frame
function VideoThumbnail({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-[#0a0a1a]">
      {active && (
        <video
          ref={videoRef}
          src={src}
          preload="metadata"
          muted
          playsInline
          className="w-full h-full object-cover"
          onLoadedMetadata={() => {
            if (videoRef.current) videoRef.current.currentTime = 0.001;
          }}
        />
      )}
    </div>
  );
}

const ClientsSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [modalVideoSrc, setModalVideoSrc] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const perPage = usePerPage();
  const totalPages = Math.ceil(clientVideos.length / perPage);

  // Touch swipe state
  const touchStartX = useRef(0);
  const touchDiffX = useRef(0);

  const closeModal = useCallback(() => {
    if (isExiting || !modalVideoSrc) return;
    setIsExiting(true);
    window.setTimeout(() => {
      setModalVideoSrc(null);
      setIsExiting(false);
    }, 300);
  }, [isExiting, modalVideoSrc]);

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
    let rafId = 0;

    const updateCardWidth = () => {
      if (!trackRef.current || !trackRef.current.children[0]) return;

      const card = trackRef.current.children[0] as HTMLElement;
      const gap = 16;
      setCardWidth(card.offsetWidth + gap);
    };

    const scheduleWidthUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updateCardWidth();
      });
    };

    updateCardWidth();
    window.addEventListener("resize", scheduleWidthUpdate, { passive: true });
    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("resize", scheduleWidthUpdate);
    };
  }, [perPage]);

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
    if (modalVideoSrc) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalVideoSrc]);

  // Card width class based on perPage
  const cardFlexBasis =
    perPage === 1
      ? "flex-[0_0_88%]"
      : perPage === 2
        ? "flex-[0_0_calc((100%-16px)/2)]"
        : "flex-[0_0_calc((100%-32px)/3)]";

  return (
    <>
      <section className="section-py px-4 section-bg-elevated overflow-hidden" id="clients">
        <div className="container mx-auto">
          {/* Header */}
          <FadeIn delay={0} direction="up" duration={0.6} className="text-center mb-12">
            <div className="w-[50px] h-[3px] rounded-full mx-auto mb-4" style={{ background: 'linear-gradient(to left, #9b50e8, #7c3aed)' }} />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-[1.5] max-w-4xl mx-auto text-white">
              آراء عملائنا
            </h2>
            <p className="text-sm text-white/50 max-w-xl mx-auto leading-relaxed">
              استمع إلى تجارب عملائنا الحقيقية مع خدماتنا
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
                      if (touchDiffX.current > 0) goNext();
                      else goPrev();
                    }
                    touchDiffX.current = 0;
                  }}
                >
                  {clientVideos.map((video, index) => (
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
                          setModalVideoSrc(video.src);
                        }}
                      >
                        {/* Video Thumbnail Container */}
                        <div className="relative w-full pt-[56.25%] flex-shrink-0">
                          <VideoThumbnail src={video.src} />
                          {/* Dark overlay on hover */}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 z-[1]" />
                          {/* Play Button */}
                          <button
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-600/85 rounded-2xl flex items-center justify-center z-[2] group-hover:scale-110 group-hover:bg-red-600 transition-all"
                            aria-label="تشغيل الفيديو"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsExiting(false);
                              setModalVideoSrc(video.src);
                            }}
                          >
                            <Play className="w-7 h-7 text-white fill-white ml-[-2px]" />
                          </button>
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
      {modalVideoSrc && (
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
            <video
              ref={modalVideoRef}
              key={modalVideoSrc}
              src={modalVideoSrc}
              className="w-full h-full object-contain bg-black"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}
    </>
  );
};

export default memo(ClientsSection);
