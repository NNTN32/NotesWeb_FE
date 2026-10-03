import { useFeedbackMotion } from "../../hooks/useFeedbackMotion";
import { FiCheck, FiFeather, FiMaximize2, FiMinimize2 } from "react-icons/fi";
export default function NoteCanvas({
  draft,
  onChange,
  focus,
  onToggleFocus,
  onSave,
  error,
  dirty,
}) {
  const feedback = useFeedbackMotion();
  const saved = !!draft.id && !dirty && !error;
  const words = draft.content.trim()
    ? draft.content.trim().split(/\s+/u).length
    : 0;
  return (
    <section className="note-canvas">
      <div className="note-canvas-toolbar">
        <span>
          <FiFeather />
          {draft.id ? "NOTEBOOK PAGE" : "A NEW PAGE"}
        </span>
        <button
          className="ws-icon-button"
          aria-label={focus ? "Exit focus mode" : "Enter focus mode"}
          aria-pressed={focus}
          onClick={onToggleFocus}
        >
          {focus ? <FiMinimize2 /> : <FiMaximize2 />}
        </button>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (onSave()) feedback.acknowledge();
        }}
      >
        <label className="sr-only" htmlFor="note-title">
          Note title
        </label>
        <input
          id="note-title"
          className="note-title"
          value={draft.title}
          onChange={(event) => onChange("title", event.target.value)}
          placeholder="An idea just crossed your mind…"
          required
          maxLength={200}
          autoComplete="off"
        />
        <label className="sr-only" htmlFor="note-content">
          Note content
        </label>
        <textarea
          id="note-content"
          className="note-content"
          value={draft.content}
          onChange={(event) => onChange("content", event.target.value)}
          placeholder="Just write. A thought, a story, or something you want to remember…"
          required
          maxLength={50000}
        />
        <footer className="note-canvas-footer">
          <span>
            {words} words · {draft.content.length.toLocaleString("en-US")}{" "}
            characters
          </span>
          <span role="status">
            {error
              ? "Could not save in this browser"
              : !draft.title && !draft.content
                ? "Ready for your first idea"
                : dirty
                  ? "Draft saved in this browser"
                  : "Saved in this browser"}
          </span>
        </footer>
        <button
          ref={feedback.ref}
          type="submit"
          className="ws-button note-save"
        >
          {saved && <FiCheck aria-hidden="true" />}
          {saved ? "Saved to notebook" : "Save to notebook"}
        </button>
      </form>
    </section>
  );
}
