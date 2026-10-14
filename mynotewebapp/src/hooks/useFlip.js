import { useLayoutEffect, useRef } from "react";
import {
  motionDuration,
  motionToken,
  prefersReducedMotion,
} from "../lib/motion";

/**
 * FLIP layout animation. Children marked with `data-flip-id` glide from their
 * previous position to their new one after any re-render that moves them
 * (reordering, items added/removed above, switching layouts).
 *
 *   const listRef = useFlip();
 *   <ul ref={listRef} className="flip-root">
 *     {items.map((item) => <li key={item.id} data-flip-id={item.id} />)}
 *   </ul>
 *
 * Positions use offsetLeft/offsetTop, which ignore transforms, so running
 * enter/exit animations never cause false moves. The container must be the
 * items' offsetParent (give it `position: relative`, e.g. `.flip-root`).
 */
export function useFlip() {
  const ref = useRef(null);
  const last = useRef({ width: 0, positions: new Map() });

  useLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;
    const items = container.querySelectorAll("[data-flip-id]");
    const positions = new Map();
    items.forEach((item) =>
      positions.set(item.dataset.flipId, {
        x: item.offsetLeft,
        y: item.offsetTop,
      }),
    );

    // A resized container reflows everything; just record, do not animate.
    const resized = last.current.width !== container.offsetWidth;
    if (!resized && !prefersReducedMotion()) {
      const duration = motionDuration("--duration-slow", 300);
      const easing = motionToken("--ease-out") || "ease-out";
      items.forEach((item) => {
        const before = last.current.positions.get(item.dataset.flipId);
        const after = positions.get(item.dataset.flipId);
        if (!before) return;
        const dx = before.x - after.x;
        const dy = before.y - after.y;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
        item.animate([{ translate: `${dx}px ${dy}px` }, { translate: "0 0" }], {
          duration,
          easing,
          composite: "add",
        });
      });
    }
    last.current = { width: container.offsetWidth, positions };
  });

  return ref;
}
