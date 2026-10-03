import { useMotion } from "../../context/MotionContext";
import { useEffect, useRef } from "react";

/** Progressive enhancement: content stays visible when motion or JS is unavailable. */
export default function Reveal({ as = "div", children, delay = 0, ...props }) {
  const Element = as;
  const { reduced } = useMotion();
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || reduced || !window.IntersectionObserver || !element.animate)
      return;
    let animation;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(element);
        animation = element.animate(
          [
            { opacity: 0, transform: "translateY(12px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 420,
            delay,
            easing: "cubic-bezier(.2,.7,.2,1)",
            fill: "backwards",
          },
        );
      },
      { threshold: 0.08 },
    );
    const stop = () => {
      if (preference.matches) {
        observer.disconnect();
        animation?.cancel();
      }
    };
    observer.observe(element);
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      animation?.cancel();
      preference.removeEventListener("change", stop);
    };
  }, [delay, reduced]);
  return (
    <Element ref={ref} {...props}>
      {children}
    </Element>
  );
}
