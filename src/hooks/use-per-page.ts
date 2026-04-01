import { useEffect, useState } from "react";

export function usePerPage() {
  const [perPage, setPerPage] = useState(3);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const w = window.innerWidth;
      setPerPage(w <= 768 ? 1 : w <= 1024 ? 2 : 3);
    };

    const onResize = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return perPage;
}
