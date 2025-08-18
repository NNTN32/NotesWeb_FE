import { useEffect, useRef, useState } from 'react';

/**
 * useInView
 * Simple IntersectionObserver hook for scroll-triggered animations.
 *
 * @param {Object} opts
 * @param {Element|null} opts.root
 * @param {string} opts.rootMargin
 * @param {number|number[]} opts.threshold
 * @param {boolean} opts.once - if true (default), stays true after first intersect
 * @returns {[React.MutableRefObject, boolean]}
 */
export function useInView(opts = {}) {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0.2,
    once = true,
  } = opts;

  const targetRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      try {
        observer.unobserve(element);
      } catch {}
    };
  }, [root, rootMargin, threshold, once]);

  return [targetRef, inView];
}


