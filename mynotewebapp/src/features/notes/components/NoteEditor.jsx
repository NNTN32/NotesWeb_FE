import { FiDownload, FiMaximize2, FiMinimize2, FiTrash2 } from "react-icons/fi";
import IconButton from "../../../components/ui/IconButton";
import { isBlank, wordCount } from "../noteModel";

export default function NoteEditor({
  note,
  saveFailed,
  focus,
  onChange,
  onToggleFocus,
  onDownload,
  onDelete,
}) {
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
        id="note-content"
        className="note-editor__content"
        placeholder="Start writing…"
        value={note.content}
        maxLength={50000}
        onChange={(event) => onChange({ content: event.target.value })}
      />
    </section>
  );
}
