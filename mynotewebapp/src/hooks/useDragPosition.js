import { useRef, useState } from "react";
import { useLocalStore } from "./useLocalStore";

const DRAG_THRESHOLD = 4; // px a pointer must travel before a press becomes a drag
const isPoint = (value) =>
  value === null || (Number.isFinite(value?.x) && Number.isFinite(value?.y));

/**
 * Drag a fixed element anywhere on screen; the spot is remembered in this
 * browser under `key`. Spread `handlers` on the drag handle. `position` is the
 * element's top-left corner (null until the user moves it). Call
 * `consumeDrag()` in onClick: it returns true when the press was a drag, so
 * the click that ends a drag is ignored.
 */
export function useDragPosition(key) {
  const [saved, save] = useLocalStore(key, null, isPoint);
  const [live, setLive] = useState(null);
  const drag = useRef(null);
  const dragged = useRef(false);

  const end = () => {
    if (drag.current?.last) save(drag.current.last);
    drag.current = null;
    setLive(null);
  };

  return {
    position: live ?? saved,
    dragging: live !== null,
    consumeDrag() {
      const was = dragged.current;
      dragged.current = false;
      return was;
    },
    handlers: {
      onPointerDown(event) {
        if (event.button !== 0) return;
        const box = event.currentTarget.getBoundingClientRect();
        drag.current = {
          startX: event.clientX,
          startY: event.clientY,
          offsetX: event.clientX - box.left,
          offsetY: event.clientY - box.top,
        };
        dragged.current = false;
        event.currentTarget.setPointerCapture?.(event.pointerId);
      },
      onPointerMove(event) {
        const state = drag.current;
        if (!state) return;
        const distance = Math.hypot(
          event.clientX - state.startX,
          event.clientY - state.startY,
        );
        if (!dragged.current && distance < DRAG_THRESHOLD) return;
        dragged.current = true;
        state.last = {
          x: event.clientX - state.offsetX,
          y: event.clientY - state.offsetY,
        };
        setLive(state.last);
      },
      onPointerUp: end,
      onPointerCancel: end,
    },
  };
}
