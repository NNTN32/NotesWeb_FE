import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Alert from "../components/ui/Alert";
import Animate from "../components/ui/Animate";
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
  // Bumped only when the user opens or creates a note, never while typing,
  // so the editor fades in on switch without losing focus mid-edit.
  const [openCount, setOpenCount] = useState(0);
  const openNote = (note) => {
    if (note.id === active.id) return;
    notes.open(note);
    setOpenCount((count) => count + 1);
  };
  const createNote = () => {
    notes.create();
    setOpenCount((count) => count + 1);
  };

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
          <button
            type="button"
            className="btn btn--primary"
            onClick={createNote}
          >
            New note
          </button>
        </PageHeader>
      )}

      <Alert>{notes.storageError}</Alert>

      <div className="notes-layout">
        {!focus && (
          <NoteList
            notes={notes.notes}
            activeId={active.id}
            onOpen={openNote}
          />
        )}
        <Animate key={openCount} name="fade">
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
        </Animate>
      </div>
    </div>
  );
}
