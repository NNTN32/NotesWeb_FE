import assert from "node:assert/strict";
import { test } from "node:test";
import {
  weekDates,
  shiftDate,
  currentSlot,
  filterTasks,
  taskStats,
  validTasks,
  validDate,
} from "../src/features/tasks/taskModel.js";

test("Monday-based weeks span month and year boundaries", () => {
  assert.deepEqual(weekDates("2027-01-03"), [
    "2026-12-28",
    "2026-12-29",
    "2026-12-30",
    "2026-12-31",
    "2027-01-01",
    "2027-01-02",
    "2027-01-03",
  ]);
  assert.equal(shiftDate("2024-03-01", -1), "2024-02-29");
});
test("time slots cover midnight and each boundary", () => {
  for (const [hour, expected] of [
    [0, "night"],
    [5, "night"],
    [6, "early"],
    [9, "morning"],
    [12, "noon"],
    [14, "afternoon"],
    [17, "evening"],
    [21, "night"],
    [23, "night"],
  ])
    assert.equal(currentSlot(hour), expected);
});
const tasks = [
  {
    id: "a",
    text: "Viết ý tưởng",
    priority: "low",
    completed: false,
    date: "2026-09-27",
    slot: "morning",
  },
  {
    id: "b",
    text: "Viết báo cáo",
    priority: "high",
    completed: true,
    date: "2026-09-28",
    slot: "afternoon",
  },
  {
    id: "c",
    text: "Gửi báo cáo",
    priority: "high",
    completed: false,
    date: "2026-09-28",
    slot: "afternoon",
  },
];
test("combined filters and priority ordering do not mutate shared data", () => {
  const original = structuredClone(tasks);
  assert.deepEqual(
    filterTasks(tasks).map((task) => task.id),
    ["c", "a", "b"],
  );
  assert.deepEqual(
    filterTasks(tasks, {
      query: " BÁO CÁO ",
      priority: "high",
      status: "open",
    }).map((task) => task.id),
    ["c"],
  );
  assert.deepEqual(tasks, original);
});
test("statistics handle empty and partially completed days", () => {
  assert.deepEqual(taskStats([]), {
    total: 0,
    completed: 0,
    remaining: 0,
    progress: 0,
  });
  assert.deepEqual(taskStats(tasks), {
    total: 3,
    completed: 1,
    remaining: 2,
    progress: 33,
  });
});
test("stored data validation rejects invalid fields and impossible dates", () => {
  assert.equal(validTasks(tasks), true);
  assert.equal(validTasks([null]), false);
  assert.equal(validTasks([{ ...tasks[0], priority: "constructor" }]), false);
  assert.equal(validTasks([{ ...tasks[0], date: "2026-02-30" }]), false);
  assert.equal(validTasks([{ ...tasks[0], slot: "invalid" }]), false);
  assert.equal(validDate("2024-02-29"), true);
  assert.equal(validDate("2025-02-29"), false);
});
