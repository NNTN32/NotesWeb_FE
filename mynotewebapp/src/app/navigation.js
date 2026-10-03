import { FiEdit3, FiCheckSquare, FiCalendar } from "react-icons/fi";

export const WORKSPACE_NAVIGATION = [
  { to: "/create", label: "Notebook", icon: FiEdit3 },
  { to: "/todo", label: "Today’s tasks", icon: FiCheckSquare },
  { to: "/weekly-plan", label: "Weekly plan", icon: FiCalendar },
];
