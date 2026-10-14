import { ROUTES } from "../../app/routes.js";

/**
 * The three connected features shown on Home, in order. Each `id` matches a
 * scene in components/FlowPreview.jsx. Edit copy here, not in components.
 */
export const FLOW_STEPS = [
  {
    id: "capture",
    title: "Capture",
    text: "Write it down in Notes. Select a line and choose Add as task.",
    action: "Open Notes",
    to: ROUTES.notes,
  },
  {
    id: "today",
    title: "Plan today",
    text: "It lands in today’s list, ready to check off.",
    action: "Open Today",
    to: `${ROUTES.tasks}?view=day`,
  },
  {
    id: "week",
    title: "See the week",
    text: "The same task appears in your week, next to everything else.",
    action: "Open Week",
    to: `${ROUTES.tasks}?view=week`,
  },
];

/** How long each step stays on screen while autoplaying. */
export const FLOW_STEP_MS = 4500;

/** The example task that travels through all three scenes. */
export const FLOW_EXAMPLE_TASK = "Book dentist";
