/**
 * Pure notebook model. The store keeps the open note (`draft`) next to the saved
 * list so an unfinished page survives a reload. Every edit is saved automatically.
 */
export const EMPTY_DRAFT = { id: null, title: "", content: "" };
export const INITIAL_NOTES = { notes: [], draft: EMPTY_DRAFT };

const validNote = (note) =>
  !!note && typeof note.title === "string" && typeof note.content === "string";

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

export const isBlank = (note) => !note.title.trim() && !note.content.trim();

export const noteTitle = (note) => note.title.trim() || "Untitled";

/**
 * Applies an edit to the open note and saves it into the list (newest first).
 * A note emptied of all text leaves the list, so blank pages never pile up.
 */
export function editDraft(store, changes, { id, updatedAt }) {
  const draft = { ...store.draft, ...changes };
  if (isBlank(draft)) {
    return {
      draft,
      notes: store.notes.filter((note) => note.id !== draft.id),
    };
  }
  const note = { ...draft, id: draft.id || id, updatedAt };
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

/** Puts a deleted note back in its chronological place. */
export function restoreNote(store, note) {
  if (store.notes.some((item) => item.id === note.id)) return store;
  const notes = [...store.notes, note].toSorted((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
  return { ...store, notes };
}

export function searchNotes(notes, query) {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return notes;
  return notes.filter((note) =>
    `${note.title} ${note.content}`.toLocaleLowerCase().includes(needle),
  );
}

export function wordCount(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/u).length : 0;
}

// "- ", "* ", "• ", "1. ", "2) ", "[ ] ", "[x] " at the start of a line.
const LIST_MARKER = /^(?:[-*•]|\d+[.)]|\[[ xX]?\])\s+/u;

/**
 * Text to turn into a task: the selection if there is one, otherwise the line
 * under the caret. Uses the first non-empty line, strips list/checkbox
 * markers and caps the length at 240 characters. Returns "" when empty.
 */
export function taskTextAt(content, start, end = start) {
  let text;
  if (end > start) {
    text = content.slice(start, end);
  } else {
    const lineStart =
      start === 0 ? 0 : content.lastIndexOf("\n", start - 1) + 1;
    const lineEnd = content.indexOf("\n", start);
    text = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
  }
  let line =
    text
      .split("\n")
      .map((part) => part.trim())
      .find(Boolean) ?? "";
  while (LIST_MARKER.test(line)) line = line.replace(LIST_MARKER, "");
  return line.trim().slice(0, 240);
}
