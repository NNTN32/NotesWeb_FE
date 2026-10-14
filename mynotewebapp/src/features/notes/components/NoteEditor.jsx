import { useRef, useState } from "react";
import {
  FiCheckSquare,
  FiDownload,
  FiMaximize2,
  FiMinimize2,
  FiTrash2,
} from "react-icons/fi";
import IconButton from "../../../components/ui/IconButton";
import { isBlank, taskTextAt, wordCount } from "../noteModel";

export default function NoteEditor({
  note,
  saveFailed,
  focus,
  onChange,
  onToggleFocus,
  onDownload,
  onDelete,
  onAddTask,
}) {
  const textarea = useRef(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const taskText = taskTextAt(note.content, selection.start, selection.end);
  const trackSelection = (event) =>
    setSelection({
      start: event.target.selectionStart,
      end: event.target.selectionEnd,
    });

  const status = saveFailed
    ? "Not saved"
    : isBlank(note)
      ? "New note"
      : "Saved";

  return (
    <section className="note-editor" aria-label="Editor">
      <div className="note-editor__toolbar">
        <span className="muted" role="status">
          {status} · {wordCount(note.content)} words
        </span>
        <div className="note-editor__actions">
          <button
            type="button"
            className="btn btn--ghost note-editor__to-task"
            disabled={!taskText}
            onClick={() => {
              // Read the live caret: the textarea keeps it after losing focus.
              const { value, selectionStart, selectionEnd } = textarea.current;
              const text = taskTextAt(value, selectionStart, selectionEnd);
              if (text) onAddTask(text);
            }}
            title={
              taskText
                ? `Add “${taskText}” to today (Ctrl/⌘ + Enter)`
                : "Select a line to add it as a task"
            }
            aria-keyshortcuts="Control+Enter Meta+Enter"
          >
            <FiCheckSquare aria-hidden="true" />
            Add as task
          </button>
          <IconButton
            label="Download as .txt"
            icon={FiDownload}
            disabled={isBlank(note)}
            onClick={onDownload}
          />
          {note.id && (
            <IconButton
              label="Delete note"
              icon={FiTrash2}
              variant="danger"
              onClick={onDelete}
            />
          )}
          <IconButton
            label={focus ? "Exit focus mode" : "Focus mode"}
            icon={focus ? FiMinimize2 : FiMaximize2}
            aria-pressed={focus}
            onClick={onToggleFocus}
          />
        </div>
      </div>
      <label htmlFor="note-title" className="sr-only">
        Title
      </label>
      <input
        id="note-title"
        className="note-editor__title"
        placeholder="Title"
        value={note.title}
        maxLength={200}
        autoComplete="off"
        onChange={(event) => onChange({ title: event.target.value })}
      />
      <label htmlFor="note-content" className="sr-only">
        Content
      </label>
      <textarea
        ref={textarea}
        id="note-content"
        className="note-editor__content"
        placeholder="Start writing…"
        value={note.content}
        maxLength={50000}
        onChange={(event) => onChange({ content: event.target.value })}
        onSelect={trackSelection}
        onKeyDown={(event) => {
          if (!(event.metaKey || event.ctrlKey) || event.key !== "Enter")
            return;
          event.preventDefault();
          const { value, selectionStart, selectionEnd } = event.currentTarget;
          const text = taskTextAt(value, selectionStart, selectionEnd);
          if (text) onAddTask(text);
        }}
      />
    </section>
  );
}
