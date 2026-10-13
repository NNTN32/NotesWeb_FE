import assert from "node:assert/strict";
import { test } from "node:test";
import { safeFileName } from "../src/lib/download.js";

test("file names keep letters in any language and drop unsafe characters", () => {
  assert.equal(safeFileName("Kế hoạch: tuần 42/2026?"), "Kế hoạch tuần 422026");
  assert.equal(safeFileName("../../etc"), "etc");
  assert.equal(safeFileName("***"), "note");
});
