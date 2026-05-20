import type { AppProps, NextWebVitalsMetric } from "next/app";
import dynamic from "next/dynamic";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { pushGTMEvent } from "@/utils/gtm";
import "../src/index.css";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const Toaster = dynamic(() => import("@/components/ui/toaster").then((mod) => mod.Toaster), {
  ssr: false,
});

const SonnerToaster = dynamic(() => import("@/components/ui/sonner").then((mod) => mod.Toaster), {
  ssr: false,
});

const DynamicTrackingScripts = dynamic(
  () => import("@/components/seo/DynamicTrackingScripts").then((mod) => mod.DynamicTrackingScripts),
  {
    ssr: false,
  }
);

const FloatingWhatsAppButton = dynamic(
  () => import("@/components/FloatingWhatsAppButton"),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [enableToasters, setEnableToasters] = useState(false);
  const [enableTrackingScripts, setEnableTrackingScripts] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
          },
        },
      })
  );

  useEffect(() => {
    const enable = () => setEnableToasters(true);
    const requestIdle = (window as any).requestIdleCallback as
      | ((callback: IdleRequestCallback, options?: IdleRequestOptions) => number)
      | undefined;
    const cancelIdle = (window as any).cancelIdleCallback as ((id: number) => void) | undefined;

    if (typeof requestIdle === "function") {
      const id = requestIdle(enable, { timeout: 2500 });
      return () => {
        if (typeof cancelIdle === "function") {
          cancelIdle(id);
        }
      };
    }

    const timeoutId = window.setTimeout(enable, 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const enable = () => setEnableTrackingScripts(true);
    const requestIdle = (window as any).requestIdleCallback as
      | ((callback: IdleRequestCallback, options?: IdleRequestOptions) => number)
      | undefined;
    const cancelIdle = (window as any).cancelIdleCallback as ((id: number) => void) | undefined;

    if (typeof requestIdle === "function") {
      const id = requestIdle(enable, { timeout: 4500 });
      return () => {
        if (typeof cancelIdle === "function") {
          cancelIdle(id);
        }
      };
    }

    const timeoutId = window.setTimeout(enable, 2200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const shouldTrackPath = (path: string) => {
      return !path.startsWith("/admin") && !path.startsWith("/404");
    };

    const track = (path: string) => {
      if (!shouldTrackPath(path)) {
        return;
      }

      pushGTMEvent("page_view", {
        page_path: path,
        page_title: document.title,
        page_location: window.location.href,
      });
    };

    track(router.asPath);

    const onRouteChange = (url: string) => track(url);
    router.events.on("routeChangeComplete", onRouteChange);

    return () => {
      router.events.off("routeChangeComplete", onRouteChange);
    };
  }, [router.events]);

  const isAdmin = router.asPath.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <div className={ibmPlexSansArabic.className}>
        {enableTrackingScripts ? <DynamicTrackingScripts /> : null}
        {enableToasters ? (
          <>
            <Toaster />
            <SonnerToaster />
          </>
        ) : null}

        <Component {...pageProps} />
        {!isAdmin && <FloatingWhatsAppButton />}
      </div>
    </QueryClientProvider>
  );
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (typeof window === "undefined") {
    return;
  }

  if (window.location.pathname.startsWith("/admin")) {
    return;
  }

  const delta = (metric as NextWebVitalsMetric & { delta?: number }).delta ?? metric.value;

  pushGTMEvent("web_vitals", {
    metric_name: metric.name,
    metric_value: metric.name === "CLS" ? Number(metric.value.toFixed(4)) : Math.round(metric.value),
    metric_delta: metric.name === "CLS" ? Number(delta.toFixed(4)) : Math.round(delta),
    metric_id: metric.id,
    metric_label: metric.label,
    page_path: window.location.pathname,
  });
}
