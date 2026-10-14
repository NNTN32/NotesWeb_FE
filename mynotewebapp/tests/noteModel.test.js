import assert from "node:assert/strict";
import { test } from "node:test";
import {
  INITIAL_NOTES,
  editDraft,
  removeNote,
  restoreNote,
  searchNotes,
  noteTitle,
  validNotes,
  wordCount,
} from "../src/features/notes/noteModel.js";

const meta = (id, updatedAt = "2026-10-13T00:00:00Z") => ({ id, updatedAt });

test("the first edit saves a new note at the top of the list", () => {
  const store = editDraft(INITIAL_NOTES, { title: "Ý tưởng" }, meta("n1"));
  assert.equal(store.draft.id, "n1");
  assert.deepEqual(store.notes.map((note) => note.id), ["n1"]);
  assert.equal(validNotes(store), true);
  assert.equal(INITIAL_NOTES.notes.length, 0, "input is not mutated");
});

test("later edits update the same note and move it to the top", () => {
  let store = editDraft(INITIAL_NOTES, { title: "A" }, meta("a", "1"));
  store = editDraft({ ...store, draft: { id: null, title: "", content: "" } }, { title: "B" }, meta("b", "2"));
  store = editDraft({ ...store, draft: store.notes[1] }, { content: "more" }, meta("unused", "3"));
  assert.deepEqual(store.notes.map((note) => note.id), ["a", "b"]);
  assert.equal(store.notes[0].content, "more");
  assert.equal(store.notes[0].updatedAt, "3");
});

test("clearing every field removes the note instead of keeping a blank page", () => {
  const saved = editDraft(INITIAL_NOTES, { title: "Temp" }, meta("t"));
  const cleared = editDraft(saved, { title: "  " }, meta("unused"));
  assert.equal(cleared.notes.length, 0);
  assert.equal(editDraft(INITIAL_NOTES, { title: " " }, meta("x")).notes.length, 0);
});

test("remove and restore keep chronological order", () => {
  let store = editDraft(INITIAL_NOTES, { title: "Old" }, meta("old", "2026-01-01"));
  store = editDraft({ ...store, draft: { id: null, title: "", content: "" } }, { title: "New" }, meta("new", "2026-02-01"));
  const old = store.notes[1];
  const removed = removeNote(store, "old");
  assert.deepEqual(removed.notes.map((note) => note.id), ["new"]);
  assert.equal(removed.draft.id, "new", "other open note stays open");
  assert.deepEqual(restoreNote(removed, old).notes.map((note) => note.id), ["new", "old"]);
  assert.equal(restoreNote(store, old), store, "restoring twice is a no-op");
  assert.equal(removeNote(store, "new").draft.id, null, "removing the open note clears the editor");
});

test("helpers: search, title fallback, word count and validation", () => {
  const notes = [
    { id: "1", title: "Báo cáo", content: "quý 3", updatedAt: "1" },
    { id: "2", title: "", content: "Shopping list", updatedAt: "2" },
  ];
  assert.deepEqual(searchNotes(notes, " BÁO ").map((n) => n.id), ["1"]);
  assert.deepEqual(searchNotes(notes, "shopping").map((n) => n.id), ["2"]);
  assert.equal(searchNotes(notes, ""), notes);
  assert.equal(noteTitle(notes[1]), "Untitled");
  assert.equal(wordCount("  one two\nthree "), 3);
  assert.equal(wordCount(""), 0);
  assert.equal(validNotes({ notes: [null], draft: {} }), false);
  assert.equal(validNotes(null), false);
});

test("taskTextAt uses the selection, or the line under the caret", async () => {
  const { taskTextAt } = await import("../src/features/notes/noteModel.js");
  const content = "Weekend plan\n- [ ] Book dentist\n\n2) Call the bank\n";
  const at = (needle) => content.indexOf(needle);
  assert.equal(taskTextAt(content, at("dentist")), "Book dentist");
  assert.equal(taskTextAt(content, 0), "Weekend plan");
  assert.equal(taskTextAt(content, at("Call") + 2), "Call the bank");
  assert.equal(taskTextAt(content, at("Book"), at("Book") + 4), "Book");
  assert.equal(
    taskTextAt(content, at("\n\n"), at("Call") + 4),
    "Call",
    "multi-line selection uses its first non-empty line",
  );
  assert.equal(taskTextAt(content, at("\n\n") + 1), "", "empty line gives nothing");
  assert.equal(taskTextAt("x".repeat(300), 0).length, 240);
});
