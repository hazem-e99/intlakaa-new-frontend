import { lazy } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { useEffect } from "react";
import prefetchForm from "@/lib/prefetchForm";
import LazySection from "@/components/LazySection";

// Lazy load non-critical sections (code splitting for performance)
const PlatformsSection     = lazy(() => import("@/components/PlatformsSection"));
const StoreProblemsSection = lazy(() => import("@/components/StoreProblemsSection"));
const ResultsSection       = lazy(() => import("@/components/ResultsSection"));
const PromoSection         = lazy(() => import("@/components/PromoSection"));
const CustomersLogosSection= lazy(() => import("@/components/CustomersLogosSection"));
const CaseStudySection     = lazy(() => import("@/components/CaseStudySection"));
const ClientsSection       = lazy(() => import("@/components/ClientsSection"));
const ServicesSection      = lazy(() => import("@/components/ServicesSection"));
const FAQSection           = lazy(() => import("@/components/FAQSection"));
const ValuesSection        = lazy(() => import("@/components/ValuesSection"));
const Footer               = lazy(() => import("@/components/Footer"));

// Lightweight animated loading skeleton
const SectionSkeleton = ({ minHeight = 380 }: { minHeight?: number }) => (
  <div className="py-20 px-4" style={{ background: "inherit", minHeight }}>
    <div className="container mx-auto">
      <div className="h-8 bg-white/5 rounded-xl w-1/3 mx-auto mb-8 animate-pulse" />
      <div className="h-4 bg-white/5 rounded-xl w-2/3 mx-auto animate-pulse" />
    </div>
  </div>
);

const Index = () => {
  useEffect(() => {
    // Defer prefetch until after initial paint to avoid blocking LCP
    const requestIdle = (window as any).requestIdleCallback as
      | ((callback: IdleRequestCallback, options?: IdleRequestOptions) => number)
      | undefined;
    const cancelIdle = (window as any).cancelIdleCallback as ((id: number) => void) | undefined;

    if (typeof requestIdle === "function") {
      const id = requestIdle(() => prefetchForm(), { timeout: 2000 });
      return () => {
        if (typeof cancelIdle === "function") {
          cancelIdle(id);
        }
      };
    }

    const timeoutId = setTimeout(() => prefetchForm(), 1500);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: "#0d0520" }}>
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero — above the fold, eager load */}
      <HeroSection />

      {/* 3. Pain points — clarify current bottlenecks */}
      <LazySection
        component={StoreProblemsSection}
        fallback={<SectionSkeleton minHeight={500} />}
      />

      {/* 4. Platforms – first social proof above fold */}
      <LazySection
        component={PlatformsSection}
        fallback={<SectionSkeleton minHeight={340} />}
        rootMargin="420px 0px"
      />

      {/* 5. Results – hard numbers build trust */}
      <LazySection
        component={ResultsSection}
        fallback={<SectionSkeleton minHeight={460} />}
      />

      {/* 6. Customer Logos — social proof marquee */}
      <LazySection
        component={CustomersLogosSection}
        fallback={<SectionSkeleton minHeight={280} />}
      />

      {/* 7. Mid-page CTA — capture warm traffic */}
      <LazySection
        component={PromoSection}
        fallback={<SectionSkeleton minHeight={280} />}
      />

      {/* 8. Case Studies — evidence */}
      <LazySection
        component={CaseStudySection}
        fallback={<SectionSkeleton minHeight={420} />}
      />

      {/* 9. Client Testimonial Videos — social proof */}
      <LazySection
        component={ClientsSection}
        fallback={<SectionSkeleton minHeight={420} />}
      />

      {/* 10. Services — what we offer */}
      <LazySection
        component={ServicesSection}
        fallback={<SectionSkeleton minHeight={440} />}
      />

      {/* 11. Values / Why Us timeline */}
      <LazySection
        component={ValuesSection}
        fallback={<SectionSkeleton minHeight={460} />}
      />

      {/* 12. FAQ — handle objections */}
      <LazySection
        component={FAQSection}
        fallback={<SectionSkeleton minHeight={420} />}
      />

      {/* 13. Footer */}
      <LazySection
        component={Footer}
        fallback={<SectionSkeleton minHeight={260} />}
        rootMargin="300px 0px"
      />

      {/* Floating WhatsApp CTA */}
      <FloatingWhatsAppButton />
    </div>
  );
};

export default Index;
