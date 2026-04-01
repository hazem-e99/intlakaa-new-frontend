import { Link, useLocation } from "react-router-dom";
import prefetchForm from "@/lib/prefetchForm";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { pushGTMEvent } from "@/utils/gtm";
import { fetchPages, Page } from "@/services/cmsService";
import { Menu, X, Phone } from "lucide-react";

const NAV_PAGES_CACHE_KEY = "nav-pages-cache-v1";
const NAV_PAGES_CACHE_TTL = 5 * 60 * 1000;

type CachedNavPages = {
  timestamp: number;
  pages: Array<Pick<Page, "title" | "slug">>;
};

const getCachedPages = (): { pages: Array<Pick<Page, "title" | "slug">>; isFresh: boolean } => {
  try {
    const raw = sessionStorage.getItem(NAV_PAGES_CACHE_KEY);
    if (!raw) return { pages: [], isFresh: false };
    const parsed = JSON.parse(raw) as CachedNavPages;
    const isFresh = Date.now() - parsed.timestamp < NAV_PAGES_CACHE_TTL;
    return {
      pages: Array.isArray(parsed.pages) ? parsed.pages : [],
      isFresh,
    };
  } catch {
    return { pages: [], isFresh: false };
  }
};

const setCachedPages = (pages: Array<Pick<Page, "title" | "slug">>) => {
  const payload: CachedNavPages = { timestamp: Date.now(), pages };
  sessionStorage.setItem(NAV_PAGES_CACHE_KEY, JSON.stringify(payload));
};

const scheduleIdleTask = (task: () => void) => {
  const requestIdle = (window as any).requestIdleCallback as
    | ((callback: IdleRequestCallback, options?: IdleRequestOptions) => number)
    | undefined;
  const cancelIdle = (window as any).cancelIdleCallback as ((id: number) => void) | undefined;

  if (typeof requestIdle === "function") {
    const id = requestIdle(task, { timeout: 2000 });
    return () => {
      if (typeof cancelIdle === "function") {
        cancelIdle(id);
      }
    };
  }

  const timeoutId = window.setTimeout(task, 500);
  return () => window.clearTimeout(timeoutId);
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [pages, setPages] = useState<Array<Pick<Page, "title" | "slug">>>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let rafId = 0;

    const updateScrolledState = () => {
      rafId = 0;
      const nextScrolled = window.scrollY > 40;
      setIsScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateScrolledState);
    };

    updateScrolledState();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => setIsMenuOpen(false), [location]);

  useEffect(() => {
    let active = true;
    const { pages: cachedPages, isFresh } = getCachedPages();

    if (cachedPages.length) {
      setPages(cachedPages);
    }

    if (isFresh) return;

    const cancelIdleTask = scheduleIdleTask(async () => {
      try {
        const publishedPages = await fetchPages({ status: "published", type: "page" });
        const normalizedPages = publishedPages.map((page) => ({
          title: page.title,
          slug: page.slug,
        }));

        if (!active) return;
        setPages(normalizedPages);
        setCachedPages(normalizedPages);
      } catch {
        // Keep cached/static links when network request fails.
      }
    });

    return () => {
      active = false;
      cancelIdleTask();
    };
  }, []);

  const navLinks = useMemo(
    () => [
      { title: "الرئيسية", slug: "" },
      ...pages.map((page) => ({ title: page.title, slug: page.slug })),
      { title: "المدونة", slug: "blog" },
    ],
    [pages]
  );

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 animate-nav-enter"
      style={{
        background: isScrolled ? "rgba(13,5,32,0.92)" : "rgba(13,5,32,0.5)",
        backdropFilter: "blur(24px) saturate(1.5)",
        WebkitBackdropFilter: "blur(24px) saturate(1.5)",
        borderBottom: `1px solid ${isScrolled ? "rgba(155,80,232,0.18)" : "rgba(255,255,255,0.04)"}`,
        boxShadow: isScrolled ? "0 8px 32px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 relative group py-1">
            <Image
              src="/logo.webp"
              alt="انطلاقة"
              width={795}
              height={254}
              priority
              sizes="(max-width: 768px) 160px, 200px"
              className="h-10 md:h-11 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105"
              style={{ filter: "brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.3))" }}
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => {
              const isActive = location.pathname === `/${link.slug}`;
              return (
                <Link
                  key={link.slug}
                  to={`/${link.slug}`}
                  className={`relative text-sm font-semibold py-1 transition-all duration-300 ${
                    isActive ? "text-white" : "text-white/50 hover:text-white/85"
                  }`}
                >
                  {link.title}
                  <span
                    className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                    style={{ background: "linear-gradient(90deg, #9b50e8, #c084fc)" }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+966511414537"
              className="hidden md:flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
              dir="ltr"
            >
              <Phone className="w-3.5 h-3.5" />
              +966 511 414 537
            </a>

            <Link to="/form" onMouseEnter={prefetchForm} className="hidden sm:block">
              <button
                onClick={() => pushGTMEvent("cta_click", { button_name: "احجز استشارتك المجانية", location: "navbar" })}
                className="px-6 py-2.5 rounded-full font-bold text-white text-sm shadow-lg whitespace-nowrap transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #7c3aed, #9b50e8)" }}
              >
                احجز استشارتك المجانية
              </button>
            </Link>

            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          isMenuOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(13,5,32,0.98)", borderTop: "1px solid rgba(155,80,232,0.12)" }}
      >
        <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.slug}
              to={`/${link.slug}`}
              className={`text-base font-semibold py-3 px-4 rounded-xl transition-all ${
                location.pathname === `/${link.slug}`
                  ? "text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
              style={
                location.pathname === `/${link.slug}`
                  ? { background: "rgba(155,80,232,0.15)", border: "1px solid rgba(155,80,232,0.25)" }
                  : {}
              }
            >
              {link.title}
            </Link>
          ))}
          <div className="h-px my-2" style={{ background: "rgba(155,80,232,0.1)" }} />
          <a href="tel:+966511414537" className="text-sm text-white/35 px-4 py-2 flex items-center gap-2" dir="ltr">
            <Phone className="w-3.5 h-3.5" /> +966 511 414 537
          </a>
          <Link to="/form" onMouseEnter={prefetchForm}>
            <button
              onClick={() => pushGTMEvent("cta_click", { button_name: "navbar_mobile_cta", location: "navbar_mobile" })}
              className="w-full py-3.5 rounded-full font-black text-white text-base shadow-lg mt-2"
              style={{ background: "linear-gradient(135deg, #7c3aed, #9b50e8)" }}
            >
              احجز استشارتك المجانية
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
