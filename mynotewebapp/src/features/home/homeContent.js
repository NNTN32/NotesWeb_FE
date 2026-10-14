/** Copy and demo data for the Home sections below the feature flow (Day ↔ Week showcase). */

/** Day ↔ Week showcase: `day` is the Monday-based column in the week layout. */
export const SHOWCASE_TASKS = [
  { id: "gym", text: "Morning run", day: 0 },
  { id: "dentist", text: "Book dentist", day: 1 },
  { id: "sync", text: "Team sync", day: 3 },
  { id: "mom", text: "Call mom", day: 5 },
];

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** How long the showcase waits on first view before demonstrating the switch. */
export const SHOWCASE_HINT_MS = 1400;
