type SeoSettings = {
    siteTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    googleConsole?: string;
    gtmId?: string;
    gaId?: string;
    fbPixel?: string;
    tiktokPixel?: string;
};

const BACKEND_URL = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.VITE_API_URL ||
    'http://localhost:5000'
).replace(/\/api\/?$/, '');
const SEO_CACHE_KEY = 'seo-settings-cache-v1';
const SEO_CACHE_TTL = 10 * 60 * 1000;

type SeoCache = {
    timestamp: number;
    settings: SeoSettings;
};

const readSeoCache = (): { settings: SeoSettings | null; isFresh: boolean } => {
    try {
        const raw = sessionStorage.getItem(SEO_CACHE_KEY);
        if (!raw) return { settings: null, isFresh: false };

        const cache = JSON.parse(raw) as SeoCache;
        if (!cache?.settings) return { settings: null, isFresh: false };

        return {
            settings: cache.settings,
            isFresh: Date.now() - cache.timestamp < SEO_CACHE_TTL,
        };
    } catch {
        return { settings: null, isFresh: false };
    }
};

const writeSeoCache = (settings: SeoSettings) => {
    const cache: SeoCache = {
        timestamp: Date.now(),
        settings,
    };
    sessionStorage.setItem(SEO_CACHE_KEY, JSON.stringify(cache));
};

const applySeoSettings = (settings: SeoSettings) => {
    if (!settings) return;

    if (settings.siteTitle) {
        document.title = settings.siteTitle;
    }

    updateMeta('name', 'description', settings.metaDescription);
    updateMeta('name', 'keywords', settings.keywords);

    if (settings.googleConsole) {
        updateMeta('name', 'google-site-verification', settings.googleConsole);
    }

    updateMeta('property', 'og:title', settings.ogTitle);
    updateMeta('property', 'og:description', settings.ogDescription);
    updateMeta('property', 'og:image', settings.ogImage);
    updateMeta('property', 'og:url', settings.ogUrl);
    updateMeta('name', 'twitter:title', settings.ogTitle);
    updateMeta('name', 'twitter:description', settings.ogDescription);

    if (settings.gtmId) injectGTM(settings.gtmId);
    if (settings.gaId) injectGA(settings.gaId);
    if (settings.fbPixel) injectFBPixel(settings.fbPixel);
    if (settings.tiktokPixel) injectTikTok(settings.tiktokPixel);
};

export async function initializeDynamicSEO() {
    const cached = readSeoCache();
    if (cached.settings) {
        applySeoSettings(cached.settings);
        if (cached.isFresh) {
            return;
        }
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 4000);

    try {
        const response = await fetch(`${BACKEND_URL}/api/seo`, {
            method: 'GET',
            headers: { Accept: 'application/json' },
            signal: controller.signal,
        });

        if (!response.ok) return;

        const payload = await response.json();
        const settings = payload?.data as SeoSettings | undefined;
        if (!settings) return;

        applySeoSettings(settings);
        writeSeoCache(settings);
    } catch {
        // Keep the app responsive even if SEO endpoint is unavailable.
    } finally {
        clearTimeout(timeoutId);
    }
}

function updateMeta(attrBase: 'name' | 'property', attrValue: string, content?: string) {
    if (!content) return;

    let meta = document.querySelector(`meta[${attrBase}="${attrValue}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrBase, attrValue);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}

const hasScriptWithSrc = (srcFragment: string) => {
    const scripts = Array.from(document.scripts);
    return scripts.some((script) => script.src.includes(srcFragment));
};

const appendInlineScript = (id: string, content: string) => {
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.textContent = content;
    document.head.appendChild(script);
};

function injectGTM(gtmId: string) {
    if (hasScriptWithSrc(`googletagmanager.com/gtm.js?id=${gtmId}`)) return;

    appendInlineScript(
        'dynamic-gtm-script',
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');`
    );

    if (!document.getElementById('dynamic-gtm-noscript')) {
        const noscript = document.createElement('noscript');
        noscript.id = 'dynamic-gtm-noscript';
        noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.insertBefore(noscript, document.body.firstChild);
    }
}

function injectGA(gaId: string) {
    if (!hasScriptWithSrc(`googletagmanager.com/gtag/js?id=${gaId}`)) {
        const script = document.createElement('script');
        script.id = 'dynamic-ga-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);
    }

    appendInlineScript(
        'dynamic-ga-config',
        `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);} 
        gtag('js', new Date());
        gtag('config', '${gaId}');`
    );
}

function injectFBPixel(fbId: string) {
    if ((window as any).fbq || document.getElementById('dynamic-fb-script')) return;

    appendInlineScript(
        'dynamic-fb-script',
        `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
        (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${fbId}');
        fbq('track', 'PageView');`
    );

    if (!document.getElementById('dynamic-fb-noscript')) {
        const noscript = document.createElement('noscript');
        noscript.id = 'dynamic-fb-noscript';
        noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${fbId}&ev=PageView&noscript=1"/>`;
        document.head.appendChild(noscript);
    }
}

function injectTikTok(tiktokId: string) {
    if ((window as any).ttq || document.getElementById('dynamic-tiktok-script')) return;

    appendInlineScript(
        'dynamic-tiktok-script',
        `!function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
        ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
        ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
        for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
        ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
        ttq.load=function(e,n){var r='https://analytics.tiktok.com/i18n/pixel/events.js';
        ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,
        ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement('script');n.type='text/javascript';
        n.async=true;n.src=r+'?sdkid='+e+'&lib='+t;e=document.getElementsByTagName('script')[0];e.parentNode.insertBefore(n,e)};
        ttq.load('${tiktokId}');
        ttq.page();
        }(window, document, 'ttq');`
    );
}
