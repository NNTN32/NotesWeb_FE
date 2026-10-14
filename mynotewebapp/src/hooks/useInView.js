import { useEffect, useState } from "react";

/**
 * Tracks whether an element is on screen. Returns [ref callback, inView].
 * Falls back to "visible" where IntersectionObserver is unavailable.
 */
export function useInView({ threshold = 0.25, rootMargin = "0px" } = {}) {
  const [node, setNode] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold, rootMargin]);

  return [setNode, inView];
}
