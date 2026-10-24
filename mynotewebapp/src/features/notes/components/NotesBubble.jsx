import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiBookOpen } from "react-icons/fi";
import NoteList from "./NoteList";
import { ENTER } from "../../../lib/motion";

const PANEL_ID = "notes-bubble-panel";

/**
 * Focus mode: the note list folds into a floating notebook bubble
 * (view-transition-name `note-list` in notes.css morphs one into the other).
 * The bubble shows/hides the list; picking a note, Escape or a click outside
 * closes it. Portaled to <body> so `position: fixed` is not trapped by the
 * page's enter animation (a transform creates a containing block).
 */
export default function NotesBubble({ notes, activeId, onOpen }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const toggle = useRef(null);

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
        title={open ? "Hide notes" : "Show notes"}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={() => setOpen(!open)}
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
