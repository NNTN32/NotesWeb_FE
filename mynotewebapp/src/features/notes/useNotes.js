import { useLocalStore } from "../../hooks/useLocalStore";
import { undoToast } from "../../components/ui/undoToast";
import {
  EMPTY_DRAFT,
  INITIAL_NOTES,
  editDraft,
  noteTitle,
  removeNote,
  restoreNote,
  validNotes,
} from "./noteModel";

export function useNotes() {
  const [store, update, storageError] = useLocalStore(
    "mynote.notes.v1",
    INITIAL_NOTES,
    validNotes,
  );

  const edit = (changes) =>
    update((current) =>
      editDraft(current, changes, {
        id: crypto.randomUUID(),
        updatedAt: new Date().toISOString(),
      }),
    );

  const remove = (note) => {
    if (update((current) => removeNote(current, note.id)))
      undoToast(`Deleted “${noteTitle(note)}”`, () =>
        update((current) => restoreNote(current, note)),
      );
  };

  return {
    notes: store.notes,
    active: store.draft,
    storageError,
    edit,
    open: (note) => update((current) => ({ ...current, draft: note })),
    create: () => update((current) => ({ ...current, draft: { ...EMPTY_DRAFT } })),
    remove,
  };
}
