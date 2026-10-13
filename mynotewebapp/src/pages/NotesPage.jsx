import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Alert from "../components/ui/Alert";
import NoteList from "../features/notes/components/NoteList";
import NoteEditor from "../features/notes/components/NoteEditor";
import { useNotes } from "../features/notes/useNotes";
import { noteTitle } from "../features/notes/noteModel";
import { downloadText, safeFileName } from "../lib/download";
import "../features/notes/notes.css";

export default function NotesPage() {
  const notes = useNotes();
  const [focus, setFocus] = useState(false);
  const { active } = notes;

  useEffect(() => {
    if (!focus) return;
    const exitOnEscape = (event) => event.key === "Escape" && setFocus(false);
    window.addEventListener("keydown", exitOnEscape);
    return () => window.removeEventListener("keydown", exitOnEscape);
  }, [focus]);

  return (
    <div className={`notes-page ${focus ? "notes-page--focus" : ""}`}>
      {!focus && (
        <PageHeader title="Notes">
          <button type="button" className="btn btn--primary" onClick={notes.create}>
            New note
          </button>
        </PageHeader>
      )}

      <Alert>{notes.storageError}</Alert>

      <div className="notes-layout">
        {!focus && (
          <NoteList notes={notes.notes} activeId={active.id} onOpen={notes.open} />
        )}
        <NoteEditor
          note={active}
          saveFailed={!!notes.storageError}
          focus={focus}
          onChange={notes.edit}
          onToggleFocus={() => setFocus(!focus)}
          onDelete={() => notes.remove(active)}
          onDownload={() =>
            downloadText(
              `${safeFileName(noteTitle(active))}.txt`,
              `${active.title}\n\n${active.content}`,
            )
          }
        />
      </div>
    </div>
  );
}
