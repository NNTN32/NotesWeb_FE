import { useEffect, useState } from "react";
import { FiDownload, FiFeather, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import PageHeader from "../../components/workspace/PageHeader";
import NoteLibrary from "../../components/notes/NoteLibrary";
import NoteCanvas from "../../components/notes/NoteCanvas";
import { useNoteEditor } from "../../features/notes/useNoteEditor";
import PageSurface from "../../components/workspace/PageSurface";

export default function NoteForm() {
  const editor = useNoteEditor();
  const [deleted, setDeleted] = useState(null);
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    if (!focus) return;
    const escape = (event) => {
      if (event.key === "Escape") setFocus(false);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [focus]);
  const save = () => {
    if (!editor.draft.title.trim() || !editor.draft.content.trim()) {
      toast.error("Add a title and some content before saving.");
      return;
    }
    if (editor.save()) toast.success("Saved to your notebook in this browser.");
  };
  const beforeSwitch = (action) => {
    if (
      editor.dirty &&
      !window.confirm(
        "This draft has not been added to your notebook. Opening another page will replace it. Continue?",
      )
    )
      return;
    action();
  };
  const download = () => {
    const blob = new Blob(
      [`${editor.draft.title}\n\n${editor.draft.content}`],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(editor.draft.title || "note").replace(/[^\p{L}\p{N} _-]/gu, "").slice(0, 80)}.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <PageSurface variant="notes" className={focus ? "notes-page--focus" : ""}>
      <PageHeader
        eyebrow="NOTES · SPACE TO THINK"
        title={
          <>
            Let your ideas
            <br />
            <em>find their words.</em>
          </>
        }
        description="They do not need to be perfect. Just worth keeping."
      >
        <button
          className="ws-secondary"
          disabled={!editor.draft.content}
          onClick={download}
        >
          <FiDownload />
          Download .txt
        </button>
      </PageHeader>
      {editor.storageError && (
        <p className="ws-error" role="alert">
          {editor.storageError}
        </p>
      )}
      {deleted && (
        <div className="ws-notice" role="status">
          Deleted “{deleted.title}”.
          <button
            className="ws-text-button"
            onClick={() => {
              editor.restore(deleted);
              setDeleted(null);
            }}
          >
            Undo
          </button>
        </div>
      )}
      {editor.draft.id && (
        <div className="note-actions">
          <button
            className="ws-text-button"
            onClick={() => {
              const note = { ...editor.draft };
              editor.remove(note.id);
              setDeleted(note);
            }}
          >
            <FiTrash2 />
            Delete current page
          </button>
        </div>
      )}
      <div className="note-layout">
        {!focus && (
          <NoteLibrary
            notes={editor.notes}
            activeId={editor.draft.id}
            onOpen={(note) => {
              if (note.id !== editor.draft.id)
                beforeSwitch(() => editor.open(note));
            }}
            onNew={() => beforeSwitch(editor.startNew)}
          />
        )}
        <div>
          <NoteCanvas
            draft={editor.draft}
            onChange={editor.change}
            focus={focus}
            onToggleFocus={() => setFocus(!focus)}
            onSave={save}
            error={editor.storageError}
            dirty={editor.dirty}
          />
          <p className="note-bottom-hint">
            <FiFeather />
            Notes and drafts are saved in this browser. Download a .txt file to
            keep a copy.
          </p>
        </div>
      </div>
    </PageSurface>
  );
}
