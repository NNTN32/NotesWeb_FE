/**
 * Motion helpers. Animation names map 1:1 to classes in styles/motion.css,
 * so components never hard-code class strings.
 */
export const ENTER = {
  fade: "motion-fade",
  rise: "motion-rise",
  scale: "motion-scale",
  fromRight: "motion-from-right",
  fromLeft: "motion-from-left",
  slideUp: "motion-slide-up",
  turn: "motion-turn",
  pop: "motion-pop",
  drop: "motion-drop",
  highlight: "motion-highlight",
};

export const EXIT = {
  fade: "motion-exit-fade",
  scale: "motion-exit-scale",
  collapse: "motion-exit-collapse",
  slideDown: "motion-exit-slide-down",
};

/** Delay between items in a staggered group. Keep groups short (≤ 6 items). */
export const STAGGER_MS = 50;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Runs a DOM-changing update inside a View Transition when supported
 * (cross-fades the whole page, e.g. when switching theme). Falls back to
 * calling `update` directly.
 */
export function withViewTransition(update) {
  if (!document.startViewTransition || prefersReducedMotion()) {
    update();
    return;
  }
  document.startViewTransition(update);
}

/** Inline style for the n-th item of a staggered group. */
export const staggerStyle = (index) => ({
  "--motion-delay": `${index * STAGGER_MS}ms`,
});
