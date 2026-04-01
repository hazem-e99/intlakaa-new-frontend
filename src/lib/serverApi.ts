import type { Page, Post } from "@/services/cmsService";
import type { SeoSettings } from "@/services/seoService";

const REQUEST_TIMEOUT_MS = 3000;

const normalizeOrigin = (value: string) => value.replace(/\/$/, "").replace(/\/api\/?$/, "");

export const getBackendOrigin = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || process.env.VITE_API_URL || "http://localhost:5000";
  return normalizeOrigin(raw);
};

export const getApiBaseUrl = () => `${getBackendOrigin()}/api`;

export const normalizeSiteUrl = (siteUrl: string) => siteUrl.replace(/\/$/, "");

export const getSiteUrl = (seo?: Partial<SeoSettings> | null) => {
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (envSiteUrl) return normalizeSiteUrl(envSiteUrl);

  if (seo?.ogUrl) {
    try {
      const parsed = new URL(seo.ogUrl);
      return `${parsed.protocol}//${parsed.host}`;
    } catch {
      // Ignore malformed ogUrl and fall back to default.
    }
  }

  return "https://intlakaa.com";
};

export const toAbsoluteUrl = (siteUrl: string, value?: string | null) => {
  if (!value) return undefined;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const origin = normalizeSiteUrl(siteUrl);
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${origin}${path}`;
};

const fetchJson = async <T>(path: string, revalidate?: number): Promise<T | null> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      next: revalidate != null ? { revalidate } : undefined,
    } as RequestInit);

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

type ApiCollectionResponse<T> = {
  data?: T[];
  total?: number;
};

type ApiEntityResponse<T> = {
  data?: T;
};

export const getSeoSettingsServer = async (): Promise<SeoSettings | null> => {
  const payload = await fetchJson<ApiEntityResponse<SeoSettings>>("/seo", 300);
  return payload?.data || null;
};

export const getPublishedPostsServer = async (limit = 100): Promise<Post[]> => {
  const payload = await fetchJson<ApiCollectionResponse<Post>>(`/posts?status=published&limit=${limit}`, 120);
  return payload?.data || [];
};

export const getPostBySlugServer = async (slug: string): Promise<Post | null> => {
  const payload = await fetchJson<ApiEntityResponse<Post>>(`/posts/slug/${encodeURIComponent(slug)}`, 120);
  return payload?.data || null;
};

export const getPublishedPagesServer = async (): Promise<Page[]> => {
  const payload = await fetchJson<ApiCollectionResponse<Page>>("/pages?status=published&type=page", 120);
  return payload?.data || [];
};

export const getPageBySlugServer = async (slug: string): Promise<Page | null> => {
  const payload = await fetchJson<ApiEntityResponse<Page>>(`/pages/slug/${encodeURIComponent(slug)}`, 120);
  return payload?.data || null;
};

export const RESERVED_PUBLIC_SLUGS = new Set([
  "",
  "form",
  "thank-you",
  "ads",
  "blog",
  "admin",
  "api",
  "_next",
  "favicon.ico",
  "sitemap.xml",
  "robots.txt",
]);
