import { FiEdit3, FiCheckSquare, FiCalendar } from "react-icons/fi";

export const HOME_LINKS = [
  { href: "#features", label: "Your space" },
  { href: "#workflow", label: "How it works" },
];

export const MODULES = [
  {
    id: "notes",
    number: "01",
    label: "Notes",
    icon: FiEdit3,
    title: "A place for every idea.",
    description:
      "A passing thought, something you learned, or a plan still taking shape. Write it down and make room for what comes next.",
    to: "/create",
    action: "Write a note",
    tone: "peach",
    items: [
      "Ideas for a new project",
      "Things you want to try",
      "A little inspiration each day",
    ],
  },
  {
    id: "tasks",
    number: "02",
    label: "To-dos",
    icon: FiCheckSquare,
    title: "Small tasks. Real progress.",
    description:
      "Organize what needs doing and focus on the next step. Checking something off feels good.",
    to: "/todo",
    action: "Open your tasks",
    tone: "sage",
    items: [
      "Choose what matters most",
      "Break it down to get started",
      "Celebrate every step forward",
    ],
  },
  {
    id: "week",
    number: "03",
    label: "Weekly plan",
    icon: FiCalendar,
    title: "Look beyond today.",
    description:
      "Make room for work, appointments, and time for yourself. A clearer week makes for a lighter mind.",
    to: "/weekly-plan",
    action: "Plan your week",
    tone: "lavender",
    items: [
      "See your week at a glance",
      "Make time for what matters",
      "Leave space to rest",
    ],
  },
];

export const WORKFLOW_STEPS = [
  {
    title: "Capture what's on your mind",
    body: "Start with an idea. It doesn't need to be perfect; just write it down.",
  },
  {
    title: "Choose your next step",
    body: "Turn intentions into small, clear, manageable tasks.",
  },
  {
    title: "Find your own rhythm",
    body: "Plan a week with room for both goals and breaks.",
  },
];

export const PREVIEW_TASKS = [
  { id: "read", label: "Read a few pages", done: true },
  { id: "idea", label: "Sketch a new idea", done: false },
  { id: "walk", label: "Take a walk and recharge", done: false },
];
