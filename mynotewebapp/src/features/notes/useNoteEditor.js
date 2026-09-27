import { useLocalStore } from "../../hooks/useLocalStore";
import {
  EMPTY_DRAFT,
  INITIAL_NOTES,
  validNotes,
  saveDraft,
  removeNote,
  isDraftDirty,
} from "./noteModel";

export function useNoteEditor() {
  const [store, update, storageError] = useLocalStore(
    "mynote.notes.v1",
    INITIAL_NOTES,
    validNotes,
  );
  const change = (field, value) =>
    update((current) => ({
      ...current,
      draft: { ...current.draft, [field]: value },
    }));
  const save = () => {
    if (!store.draft.title.trim() || !store.draft.content.trim()) return false;
    return update((current) =>
      saveDraft(current, crypto.randomUUID(), new Date().toISOString()),
    );
  };
  const open = (note) => update((current) => ({ ...current, draft: note }));
  const startNew = () =>
    update((current) => ({ ...current, draft: { ...EMPTY_DRAFT } }));
  const remove = (id) => update((current) => removeNote(current, id));
  const restore = (note) =>
    update((current) => ({
      ...current,
      notes: current.notes.some((item) => item.id === note.id)
        ? current.notes
        : [note, ...current.notes],
    }));
  return {
    ...store,
    change,
    save,
    open,
    startNew,
    remove,
    restore,
    dirty: isDraftDirty(store),
    storageError,
  };
}
