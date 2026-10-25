import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiBookOpen } from "react-icons/fi";
import NoteList from "./NoteList";
import { ENTER } from "../../../lib/motion";
import { useDragPosition } from "../../../hooks/useDragPosition";

const PANEL_ID = "notes-bubble-panel";
// Keeps a dragged bubble inside the viewport even after the window shrinks.
const EDGE = "8px";
const clampTo = (value, axis) =>
  `clamp(${EDGE}, ${value}px, calc(100${axis} - var(--bubble-size) - ${EDGE}))`;

/**
 * Focus mode: the note list folds into a floating notebook bubble
 * (view-transition-name `note-list` in notes.css morphs one into the other).
 * The bubble shows/hides the list; picking a note, Escape or a click outside
 * closes it. It can be dragged anywhere; the list opens toward the roomier
 * side of the screen. Portaled to <body> so `position: fixed` is not trapped by the
 * page's enter animation (a transform creates a containing block).
 */
export default function NotesBubble({ notes, activeId, onOpen }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const toggle = useRef(null);
  const { position, dragging, handlers, consumeDrag } =
    useDragPosition("mynote.notes.bubble.v1");
  const placed = position && {
    left: clampTo(position.x, "vw"),
    top: clampTo(position.y, "vh"),
    bottom: "auto",
  };

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event) =>
      root.current?.contains(event.target) || setOpen(false);
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  const openNote = (note) => {
    onOpen(note);
    setOpen(false);
  };

  return createPortal(
    <div
      ref={root}
      className="notes-bubble"
      style={placed || undefined}
      data-dragging={dragging || undefined}
      data-below={(position && position.y < window.innerHeight / 2) || undefined}
      data-end={(position && position.x > window.innerWidth / 2) || undefined}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !open) return;
        event.stopPropagation(); // close the list only, stay in focus mode
        setOpen(false);
        toggle.current?.focus();
      }}
    >
      <div
        id={PANEL_ID}
        className="notes-bubble__panel"
        data-open={open || undefined}
        inert={!open}
      >
        <NoteList notes={notes} activeId={activeId} onOpen={openNote} />
      </div>
      <button
        ref={toggle}
        type="button"
        className={`notes-bubble__toggle ${ENTER.pop}`}
        aria-label={open ? "Hide notes" : "Show notes"}
        title={`${open ? "Hide" : "Show"} notes (drag to move)`}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        {...handlers}
        onClick={() => consumeDrag() || setOpen(!open)}
      >
        <FiBookOpen aria-hidden="true" />
        <span className="notes-bubble__count" aria-hidden="true">
          {notes.length}
        </span>
      </button>
    </div>,
    document.body,
  );
}
