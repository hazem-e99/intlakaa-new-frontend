import { memo, useEffect, useRef, useState, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none" | "scale";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  duration?: number;
  direction?: Direction;
  margin?: string;
  style?: React.CSSProperties;
}

const OFFSETS: Record<Direction, string> = {
  up: "translateY(24px)",
  down: "translateY(-24px)",
  left: "translateX(24px)",
  right: "translateX(-24px)",
  scale: "scale(0.95)",
  none: "none",
};

const FadeIn = ({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  duration = 0.6,
  direction = "up",
  margin = "-60px",
  style: extraStyle,
}: FadeInProps) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [margin]);

  const animStyle: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : OFFSETS[direction],
    transition: `opacity ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    willChange: visible ? "auto" : "opacity, transform",
    ...extraStyle,
  };

  return (
    // @ts-expect-error - dynamic tag
    <Tag ref={ref} className={className} style={animStyle}>
      {children}
    </Tag>
  );
};

export default memo(FadeIn);
