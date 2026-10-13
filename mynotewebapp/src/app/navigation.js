import { FiCheckSquare, FiEdit3 } from "react-icons/fi";
import { ROUTES } from "./routes";

/** `backdrop` picks the ambient variant for the page (see styles/backdrop.css). */
export const WORKSPACE_NAVIGATION = [
  { to: ROUTES.notes, label: "Notes", icon: FiEdit3, backdrop: "notes" },
  { to: ROUTES.tasks, label: "Tasks", icon: FiCheckSquare, backdrop: "tasks" },
];
