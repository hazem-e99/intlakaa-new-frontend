import Link from "next/link";
import { useRouter } from "next/router";
import prefetchForm from "@/lib/prefetchForm";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { pushGTMEvent } from "@/utils/gtm";
import { fetchPages, Page } from "@/services/cmsService";
import { ChevronDown, Menu, X } from "lucide-react";

const NAV_PAGES_CACHE_KEY = "nav-pages-cache-v3";
const NAV_PAGES_CACHE_TTL = 30 * 60 * 1000;

type NavPage = Pick<Page, "_id" | "title" | "slug" | "parentPage">;

type CachedNavPages = {
  timestamp: number;
  pages: NavPage[];
};

const getCachedPages = (): { pages: NavPage[]; isFresh: boolean } => {
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
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = (slug: string) => {
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    setHoveredSlug(slug);
  };
  const closeDropdown = () => {
    hoverCloseTimer.current = setTimeout(() => setHoveredSlug(null), 300);
  };
  const [openMobileDropdowns, setOpenMobileDropdowns] = useState<Set<string>>(new Set());
  const router = useRouter();

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

  useEffect(() => setIsMenuOpen(false), [router.asPath]);

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

  const { navLinks, childMap } = useMemo(() => {
    // Build id→slug map for resolving parentPage IDs
    const idToSlug: Record<string, string> = {};
    pages.forEach(p => { idToSlug[p._id] = p.slug; });

    // Separate root pages from child pages
    const childMap: Record<string, NavPage[]> = {};
    const rootPages: NavPage[] = [];

    pages.forEach(p => {
      if (p.parentPage) {
        const parentSlug = idToSlug[p.parentPage as string];
        if (parentSlug) {
          if (!childMap[parentSlug]) childMap[parentSlug] = [];
          childMap[parentSlug].push(p);
        } else {
          rootPages.push(p); // parent not found, treat as root
        }
      } else {
        rootPages.push(p);
      }
    });

    const navLinks = [
      { _id: '', title: "الرئيسية", slug: "" },
      ...rootPages,
      { _id: '', title: "المدونة", slug: "blog" },
    ];

    return { navLinks, childMap };
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
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 relative group py-1">
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

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => {
              const children = childMap[link.slug] || [];
              const hasChildren = children.length > 0;
              const isActive =
                router.asPath === `/${link.slug}` ||
                children.some(c => router.asPath === `/${c.slug}`);

              if (hasChildren) {
                return (
                  <div
                    key={link.slug}
                    className="relative"
                    onMouseEnter={() => openDropdown(link.slug)}
                    onMouseLeave={closeDropdown}
                  >
                    <Link
                      href={`/${link.slug}`}
                      className={`relative flex items-center gap-1 text-sm font-semibold py-1 transition-all duration-300 ${
                        isActive ? "text-white" : "text-white/50 hover:text-white/85"
                      }`}
                    >
                      {link.title}
                      <ChevronDown
                        className={`h-3 w-3 transition-transform duration-200 ${hoveredSlug === link.slug ? "rotate-180" : ""}`}
                      />
                      <span
                        className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full transition-transform duration-300 ${
                          isActive ? "scale-x-100" : "scale-x-0"
                        }`}
                        style={{ background: "linear-gradient(90deg, #9b50e8, #c084fc)" }}
                      />
                    </Link>
                    {/* Dropdown */}
                    <div
                      onMouseEnter={() => openDropdown(link.slug)}
                      onMouseLeave={closeDropdown}
                      className={`absolute top-full right-0 mt-1 min-w-[200px] rounded-xl overflow-hidden transition-all duration-200 ${
                        hoveredSlug === link.slug
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                      style={{
                        background: "rgba(13,5,32,0.98)",
                        border: "1px solid rgba(155,80,232,0.2)",
                        boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                        zIndex: 999,
                      }}
                    >
                      {children.map((child, i) => (
                        <Link
                          key={child.slug}
                          href={`/${child.slug}`}
                          className={`flex items-center px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all ${
                            i > 0 ? "border-t border-white/5" : ""
                          }`}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.slug}
                  href={`/${link.slug}`}
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
            <Link href="/form" onMouseEnter={prefetchForm} className="hidden sm:block">
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
          {navLinks.map((link) => {
            const children = childMap[link.slug] || [];
            const hasChildren = children.length > 0;
            const isActive = router.asPath === `/${link.slug}`;
            const isOpen = openMobileDropdowns.has(link.slug);

            if (hasChildren) {
              return (
                <div key={link.slug}>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/${link.slug}`}
                      className={`flex-1 text-base font-semibold py-3 px-4 rounded-xl transition-all ${
                        isActive ? "text-white" : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                      style={isActive ? { background: "rgba(155,80,232,0.15)", border: "1px solid rgba(155,80,232,0.25)" } : {}}
                    >
                      {link.title}
                    </Link>
                    <button
                      onClick={() => setOpenMobileDropdowns(prev => {
                        const next = new Set(prev);
                        next.has(link.slug) ? next.delete(link.slug) : next.add(link.slug);
                        return next;
                      })}
                      className="p-3 text-white/50 hover:text-white transition-colors"
                      aria-label="توسيع"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                  <div
                    className={`overflow-hidden transition-[max-height,opacity] duration-200 ${
                      isOpen ? "max-h-96 opacity-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="pr-4 pb-1 flex flex-col gap-1">
                      {children.map(child => (
                        <Link
                          key={child.slug}
                          href={`/${child.slug}`}
                          className="text-sm text-white/40 hover:text-white py-2 px-4 rounded-lg hover:bg-white/5 transition-all"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.slug}
                href={`/${link.slug}`}
                className={`text-base font-semibold py-3 px-4 rounded-xl transition-all ${
                  isActive ? "text-white" : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
                style={isActive ? { background: "rgba(155,80,232,0.15)", border: "1px solid rgba(155,80,232,0.25)" } : {}}
              >
                {link.title}
              </Link>
            );
          })}
          <div className="h-px my-2" style={{ background: "rgba(155,80,232,0.1)" }} />
          <Link href="/form" onMouseEnter={prefetchForm}>
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
