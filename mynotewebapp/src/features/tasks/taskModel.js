export const PRIORITIES = {
  high: { label: "High", rank: 0 },
  medium: { label: "Medium", rank: 1 },
  low: { label: "Low", rank: 2 },
};
export const TIME_SLOTS = [
  {
    id: "early",
    label: "Early morning",
    time: "06:00 – 09:00",
    icon: "sunrise",
  },
  { id: "morning", label: "Morning", time: "09:00 – 12:00", icon: "sun" },
  { id: "noon", label: "Midday", time: "12:00 – 14:00", icon: "sun" },
  {
    id: "afternoon",
    label: "Afternoon",
    time: "14:00 – 17:00",
    icon: "sunset",
  },
  { id: "evening", label: "Evening", time: "17:00 – 21:00", icon: "moon" },
  { id: "night", label: "Night", time: "21:00 – 06:00", icon: "moon" },
];
export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function shiftDate(key, amount) {
  const date = new Date(`${key}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return dateKey(date);
}
export function weekDates(key) {
  const day = new Date(`${key}T12:00:00`).getDay();
  const monday = shiftDate(key, -((day + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => shiftDate(monday, index));
}
export function formatDate(key, options = { day: "numeric", month: "long" }) {
  return new Date(`${key}T12:00:00`).toLocaleDateString("en-US", options);
}
export function currentSlot(hour = new Date().getHours()) {
  if (hour < 6 || hour >= 21) return "night";
  if (hour < 9) return "early";
  if (hour < 12) return "morning";
  if (hour < 14) return "noon";
  if (hour < 17) return "afternoon";
  return "evening";
}
export function filterTasks(
  tasks,
  { query = "", priority = "all", status = "all" } = {},
) {
  return tasks
    .filter(
      (task) =>
        task.text
          .toLocaleLowerCase("en")
          .includes(query.trim().toLocaleLowerCase("en")) &&
        (priority === "all" || task.priority === priority) &&
        (status === "all" ||
          (status === "done" ? task.completed : !task.completed)),
    )
    .toSorted(
      (a, b) =>
        Number(a.completed) - Number(b.completed) ||
        PRIORITIES[a.priority].rank - PRIORITIES[b.priority].rank,
    );
}
export function taskStats(tasks) {
  const completed = tasks.filter((task) => task.completed).length;
  return {
    total: tasks.length,
    completed,
    remaining: tasks.length - completed,
    progress: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
  };
}
export function validDate(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(`${value}T12:00:00`).getTime()) &&
    dateKey(new Date(`${value}T12:00:00`)) === value
  );
}
export function validTasks(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (task) =>
        task &&
        typeof task.id === "string" &&
        typeof task.text === "string" &&
        typeof task.completed === "boolean" &&
        Object.hasOwn(PRIORITIES, task.priority) &&
        TIME_SLOTS.some((slot) => slot.id === task.slot) &&
        validDate(task.date),
    )
  );
}
