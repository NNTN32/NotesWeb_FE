import { useEffect, useRef } from "react";
import { useMotion } from "../context/MotionContext";

/** A single acknowledgement, triggered only by a successful user action. */
export function useFeedbackMotion() {
  const ref = useRef(null);
  const animation = useRef(null);
  const { reduced } = useMotion();
  useEffect(() => {
    if (reduced) animation.current?.cancel();
    return () => animation.current?.cancel();
  }, [reduced]);
  const acknowledge = () => {
    animation.current?.cancel();
    if (reduced || !ref.current?.animate) return;
    animation.current = ref.current.animate(
      [{ scale: "1" }, { scale: "1.08", offset: 0.4 }, { scale: "1" }],
      { duration: 260, easing: "cubic-bezier(.2,.7,.2,1)" },
    );
  };
  return { ref, acknowledge };
}
