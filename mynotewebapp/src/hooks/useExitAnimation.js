import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion";

const FALLBACK_MS = 400;

/**
 * Plays an exit animation before running `onDone` (e.g. remove an item, close
 * a dialog). Put `ref` and `exitProps` on the animated element and combine with
 * an EXIT class. Always finishes: on animationend, after a timeout fallback,
 * or immediately when the element has no animation.
 */
export function useExitAnimation() {
  const ref = useRef(null);
  const [exiting, setExiting] = useState(false);
  const pending = useRef(null);

  useEffect(() => () => clearTimeout(pending.current?.timer), []);

  const exit = useCallback((onDone) => {
    if (pending.current) return;
    const element = ref.current;
    if (!element || prefersReducedMotion()) {
      onDone();
      return;
    }
    const finish = () => {
      if (!pending.current) return;
      clearTimeout(pending.current.timer);
      element.removeEventListener("animationend", onEnd);
      pending.current = null;
      onDone();
    };
    const onEnd = (event) => event.target === element && finish();
    pending.current = { timer: setTimeout(finish, FALLBACK_MS) };
    element.addEventListener("animationend", onEnd);
    setExiting(true);
    // If no exit animation applies (missing class), finish on the next frame.
    requestAnimationFrame(() => {
      if (getComputedStyle(element).animationName === "none") finish();
    });
  }, []);

  return {
    ref,
    exit,
    exiting,
    exitProps: exiting ? { "data-exiting": "" } : {},
  };
}
