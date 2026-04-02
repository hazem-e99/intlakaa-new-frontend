import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Script from "next/script";

type TrackingIds = {
  gtmId?: string;
  gaId?: string;
  fbPixel?: string;
  tiktokPixel?: string;
};

type SeoPayload = {
  data?: TrackingIds;
};

const CACHE_KEY = "seo-tracking-cache-v1";
const CACHE_TTL = 30 * 60 * 1000;

const getBackendOrigin = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return raw.replace(/\/$/, "").replace(/\/api\/?$/, "");
};

const readCache = (): { ids: TrackingIds | null; fresh: boolean } => {
  if (typeof window === "undefined") {
    return { ids: null, fresh: false };
  }

  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return { ids: null, fresh: false };

    const parsed = JSON.parse(raw) as { timestamp: number; ids: TrackingIds };
    if (!parsed?.ids) return { ids: null, fresh: false };

    return {
      ids: parsed.ids,
      fresh: Date.now() - parsed.timestamp < CACHE_TTL,
    };
  } catch {
    return { ids: null, fresh: false };
  }
};

const writeCache = (ids: TrackingIds) => {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      timestamp: Date.now(),
      ids,
    })
  );
};

const readEnvDefaults = (): TrackingIds => ({
  gtmId: process.env.NEXT_PUBLIC_GTM_ID,
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  fbPixel: process.env.NEXT_PUBLIC_FB_PIXEL,
  tiktokPixel: process.env.NEXT_PUBLIC_TIKTOK_PIXEL,
});

export function DynamicTrackingScripts() {
  const router = useRouter();
  const [ids, setIds] = useState<TrackingIds>(readEnvDefaults());
  const [shouldInjectScripts, setShouldInjectScripts] = useState(false);
  const [shouldLoadExtendedPixels, setShouldLoadExtendedPixels] = useState(false);
  const disableTracking = router.pathname.startsWith("/admin") || router.pathname === "/404";

  useEffect(() => {
    if (disableTracking) {
      return;
    }

    const activate = () => setShouldLoadExtendedPixels(true);
    const timeoutId = window.setTimeout(activate, 12000);

    window.addEventListener("scroll", activate, { once: true, passive: true });
    window.addEventListener("pointerdown", activate, { once: true, passive: true });
    window.addEventListener("keydown", activate, { once: true });

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("scroll", activate);
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
    };
  }, [disableTracking]);

  useEffect(() => {
    if (disableTracking) {
      return;
    }

    let cancelled = false;
    let injectTimeoutId = 0;
    let fetchTimeoutId = 0;
    let injectIdleId: number | null = null;
    let fetchIdleId: number | null = null;

    const requestIdle = (window as any).requestIdleCallback as
      | ((callback: IdleRequestCallback, options?: IdleRequestOptions) => number)
      | undefined;
    const cancelIdle = (window as any).cancelIdleCallback as ((id: number) => void) | undefined;

    const scheduleInjection = () => {
      const inject = () => {
        if (!cancelled) {
          setShouldInjectScripts(true);
        }
      };

      if (typeof requestIdle === "function") {
        injectIdleId = requestIdle(inject, { timeout: 4500 });
        return;
      }

      injectTimeoutId = window.setTimeout(inject, 2200);
    };

    scheduleInjection();

    const cached = readCache();

    if (cached.ids) {
      setIds((prev) => ({ ...prev, ...cached.ids }));
    }

    if (cached.fresh) {
      return () => {
        cancelled = true;
        window.clearTimeout(injectTimeoutId);
        if (typeof cancelIdle === "function" && injectIdleId !== null) {
          cancelIdle(injectIdleId);
        }
      };
    }

    const controller = new AbortController();

    const fetchSeo = async () => {
      try {
        const response = await fetch(`${getBackendOrigin()}/api/seo`, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) return;

        const payload = (await response.json()) as SeoPayload;
        const nextIds: TrackingIds = {
          gtmId: payload.data?.gtmId,
          gaId: payload.data?.gaId,
          fbPixel: payload.data?.fbPixel,
          tiktokPixel: payload.data?.tiktokPixel,
        };

        if (cancelled) return;

        setIds((prev) => ({ ...prev, ...nextIds }));
        writeCache(nextIds);
      } catch {
        // Keep app responsive if SEO endpoint is unavailable.
      }
    };

    if (typeof requestIdle === "function") {
      fetchIdleId = requestIdle(fetchSeo, { timeout: 5000 });
      return () => {
        cancelled = true;
        controller.abort();
        window.clearTimeout(injectTimeoutId);
        window.clearTimeout(fetchTimeoutId);
        if (typeof cancelIdle === "function") {
          if (injectIdleId !== null) {
            cancelIdle(injectIdleId);
          }
          if (fetchIdleId !== null) {
            cancelIdle(fetchIdleId);
          }
        }
      };
    }

    fetchTimeoutId = window.setTimeout(fetchSeo, 3200);
    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(injectTimeoutId);
      window.clearTimeout(fetchTimeoutId);
    };
  }, [disableTracking]);

  if (disableTracking || !shouldInjectScripts) {
    return null;
  }

  return (
    <>
      {ids.gtmId ? (
        <Script id="gtm-base" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${ids.gtmId}');`}
        </Script>
      ) : null}

      {ids.gaId && !ids.gtmId ? (
        <>
          <Script
            id="ga-loader"
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${ids.gaId}`}
          />
          <Script id="ga-config" strategy="lazyOnload">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);} 
gtag('js', new Date());
gtag('config', '${ids.gaId}');`}
          </Script>
        </>
      ) : null}

      {shouldLoadExtendedPixels && ids.fbPixel ? (
        <Script id="facebook-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${ids.fbPixel}');
fbq('track', 'PageView');`}
        </Script>
      ) : null}

      {shouldLoadExtendedPixels && ids.tiktokPixel ? (
        <Script id="tiktok-pixel" strategy="lazyOnload">
          {`!function (w, d, t) {
w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
ttq.load=function(e,n){var r='https://analytics.tiktok.com/i18n/pixel/events.js';
ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,
ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement('script');n.type='text/javascript';
n.async=true;n.src=r+'?sdkid='+e+'&lib='+t;e=document.getElementsByTagName('script')[0];e.parentNode.insertBefore(n,e)};
ttq.load('${ids.tiktokPixel}');
ttq.page();
}(window, document, 'ttq');`}
        </Script>
      ) : null}
    </>
  );
}
