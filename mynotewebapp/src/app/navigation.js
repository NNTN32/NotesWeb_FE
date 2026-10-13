import { FiCheckSquare, FiEdit3 } from "react-icons/fi";
import { ROUTES } from "./routes";

export const WORKSPACE_NAVIGATION = [
  { to: ROUTES.notes, label: "Notes", icon: FiEdit3 },
  { to: ROUTES.tasks, label: "Tasks", icon: FiCheckSquare },
];
