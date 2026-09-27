export const EMPTY_DRAFT = { title: "", content: "", id: null };
export const INITIAL_NOTES = { notes: [], draft: EMPTY_DRAFT };
const validNote = (note) =>
  note && typeof note.title === "string" && typeof note.content === "string";
export function validNotes(value) {
  return !!(
    value &&
    validNote(value.draft) &&
    (value.draft.id === null || typeof value.draft.id === "string") &&
    Array.isArray(value.notes) &&
    value.notes.every(
      (note) =>
        validNote(note) &&
        typeof note.id === "string" &&
        typeof note.updatedAt === "string",
    )
  );
}
export function saveDraft(store, id, updatedAt) {
  if (!store.draft.title.trim() || !store.draft.content.trim()) return store;
  const note = {
    ...store.draft,
    title: store.draft.title.trim(),
    id: store.draft.id || id,
    updatedAt,
  };
  return {
    draft: note,
    notes: [note, ...store.notes.filter((item) => item.id !== note.id)],
  };
}
export function removeNote(store, id) {
  return {
    notes: store.notes.filter((note) => note.id !== id),
    draft: store.draft.id === id ? { ...EMPTY_DRAFT } : store.draft,
  };
}
export function isDraftDirty(store) {
  const active = store.notes.find((note) => note.id === store.draft.id);
  return (
    !!(store.draft.title || store.draft.content) &&
    (!active ||
      active.title !== store.draft.title ||
      active.content !== store.draft.content)
  );
}
