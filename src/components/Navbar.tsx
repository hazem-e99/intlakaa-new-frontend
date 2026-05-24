import { Link, useLocation } from "react-router-dom";
import prefetchForm from "@/lib/prefetchForm";
import { memo, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { pushGTMEvent } from "@/utils/gtm";
import { fetchPages, Page } from "@/services/cmsService";
import { Menu, X } from "lucide-react";

const NAV_PAGES_CACHE_KEY = "nav-pages-cache-v1";
const NAV_PAGES_CACHE_TTL = 30 * 60 * 1000;

type NavPage = Pick<Page, "_id" | "title" | "slug" | "parentPage">;

type CachedNavPages = {
  timestamp: number;
  pages: NavPage[];
};

type NavLinkNode = {
  title: string;
  slug: string;
  children: Array<{ title: string; slug: string }>;
};

const isValidCachedPage = (page: unknown): page is NavPage => {
  if (!page || typeof page !== "object") return false;
  const p = page as Record<string, unknown>;
  const hasRequired =
    typeof p._id === "string" &&
    typeof p.title === "string" &&
    typeof p.slug === "string";
  const hasValidParent =
    p.parentPage === null ||
    p.parentPage === undefined ||
    typeof p.parentPage === "string";
  return hasRequired && hasValidParent;
};

const getCachedPages = (): { pages: NavPage[]; isFresh: boolean } => {
  try {
    const raw = sessionStorage.getItem(NAV_PAGES_CACHE_KEY);
    if (!raw) return { pages: [], isFresh: false };
    const parsed = JSON.parse(raw) as CachedNavPages;
    const normalized = Array.isArray(parsed.pages)
      ? parsed.pages.filter(isValidCachedPage)
      : [];
    const hasLegacyShape = Array.isArray(parsed.pages) && normalized.length !== parsed.pages.length;
    const isFresh = Date.now() - parsed.timestamp < NAV_PAGES_CACHE_TTL && !hasLegacyShape;
    return {
      pages: normalized,
      isFresh,
    };
  } catch {
    return { pages: [], isFresh: false };
  }
};

const setCachedPages = (pages: NavPage[]) => {
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
  const [pages, setPages] = useState<NavPage[]>([]);
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
        const normalizedPages: NavPage[] = publishedPages.map((page) => ({
          _id: page._id,
          title: page.title,
          slug: page.slug,
          parentPage: page.parentPage ?? null,
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

  const navLinks = useMemo<NavLinkNode[]>(() => {
    const parentPages = pages.filter((page) => !page.parentPage);
    const childPages = pages.filter((page) => !!page.parentPage);

    const pageTree = parentPages.map((parent) => ({
      title: parent.title,
      slug: parent.slug,
      children: childPages
        .filter((child) => child.parentPage === parent._id)
        .map((child) => ({ title: child.title, slug: child.slug })),
    }));

    return [
      { title: "الرئيسية", slug: "", children: [] },
      ...pageTree,
      { title: "المدونة", slug: "blog", children: [] },
    ];
  }, [pages]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 animate-nav-enter"
      style={{
        background: isScrolled ? "rgba(13,5,32,0.97)" : "rgba(13,5,32,0.85)",
        borderBottom: `1px solid ${isScrolled ? "rgba(155,80,232,0.18)" : "rgba(255,255,255,0.04)"}`,
        boxShadow: isScrolled ? "0 8px 32px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link to="/" className="flex items-center flex-shrink-0 relative group py-1">
            <Image
              src="/logo.webp"
              alt="انطلاقة"
              width={795}
              height={254}
              sizes="(max-width: 768px) 160px, 200px"
              className="h-10 md:h-11 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105"
              style={{ filter: "brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.3))" }}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === `/${link.slug}`;
              const hasChildren = link.children.length > 0;

              return (
                <div key={link.slug || "home"} className="relative group">
                  <Link
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

                  {hasChildren && (
                    <div className="absolute top-full right-0 mt-2 min-w-[180px] rounded-xl border border-white/10 bg-[#14072D]/95 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl">
                      {link.children.map((child) => (
                        <Link
                          key={child.slug}
                          to={`/${child.slug}`}
                          className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                            location.pathname === `/${child.slug}`
                              ? "text-white bg-white/10"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
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

      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          isMenuOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(13,5,32,0.98)", borderTop: "1px solid rgba(155,80,232,0.12)" }}
      >
        <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
          {navLinks.map((link) => (
            <div key={link.slug || "home"}>
              <Link
                to={`/${link.slug}`}
                className={`text-base font-semibold py-3 px-4 rounded-xl transition-all block ${
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

              {link.children.length > 0 && (
                <div className="mt-1 mr-4 border-r border-white/10 pr-3 space-y-1">
                  {link.children.map((child) => (
                    <Link
                      key={child.slug}
                      to={`/${child.slug}`}
                      className={`block text-sm py-2 px-3 rounded-lg transition-all ${
                        location.pathname === `/${child.slug}`
                          ? "text-white bg-white/10"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="h-px my-2" style={{ background: "rgba(155,80,232,0.1)" }} />
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

export default memo(Navbar);
