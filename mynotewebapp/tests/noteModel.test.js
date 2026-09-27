import assert from "node:assert/strict";
import { test } from "node:test";
import {
  INITIAL_NOTES,
  saveDraft,
  removeNote,
  isDraftDirty,
  validNotes,
} from "../src/features/notes/noteModel.js";

test("saving a draft trims the title and preserves content", () => {
  const original = {
    notes: [],
    draft: { id: null, title: "  Ý tưởng  ", content: "Dòng đầu\nDòng sau\n" },
  };
  const result = saveDraft(original, "note-1", "2026-09-27T00:00:00Z");
  assert.equal(result.notes[0].title, "Ý tưởng");
  assert.equal(result.notes[0].content, original.draft.content);
  assert.equal(original.notes.length, 0);
  assert.equal(isDraftDirty(result), false);
  assert.equal(validNotes(result), true);
});
test("editing an existing note updates it without duplicates", () => {
  const initial = saveDraft(
    { notes: [], draft: { id: null, title: "Tiêu đề", content: "Nội dung" } },
    "n1",
    "2026-09-27",
  );
  const editing = {
    ...initial,
    draft: { ...initial.draft, content: "Đã sửa" },
  };
  assert.equal(isDraftDirty(editing), true);
  const saved = saveDraft(editing, "unused-new-id", "2026-09-28");
  assert.equal(saved.notes.length, 1);
  assert.equal(saved.notes[0].id, "n1");
  assert.equal(saved.notes[0].content, "Đã sửa");
});
test("removing the active note clears its draft but leaves other drafts alone", () => {
  const store = saveDraft(
    { notes: [], draft: { id: null, title: "Tiêu đề", content: "Nội dung" } },
    "n1",
    "2026-09-27",
  );
  assert.deepEqual(removeNote(store, "n1"), INITIAL_NOTES);
  const otherDraft = { id: null, title: "Bản nháp mới", content: "Chưa lưu" };
  assert.deepEqual(
    removeNote({ ...store, draft: otherDraft }, "n1").draft,
    otherDraft,
  );
});
test("blank drafts do not create saved notes and malformed stores are rejected", () => {
  assert.equal(saveDraft(INITIAL_NOTES, "n1", "now"), INITIAL_NOTES);
  assert.equal(isDraftDirty(INITIAL_NOTES), false);
  assert.equal(validNotes(INITIAL_NOTES), true);
  assert.equal(validNotes({ notes: [null], draft: {} }), false);
  assert.equal(validNotes(null), false);
});
