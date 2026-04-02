import {
  memo,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
  type ReactNode,
} from "react";

interface LazySectionProps {
  component: LazyExoticComponent<ComponentType>;
  fallback: ReactNode;
  rootMargin?: string;
  className?: string;
}

const LazySection = ({
  component: Component,
  fallback,
  rootMargin = "180px 0px",
  className,
}: LazySectionProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldRender) return;
    const node = containerRef.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? (
        <Suspense fallback={fallback}>
          <Component />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

export default memo(LazySection);
