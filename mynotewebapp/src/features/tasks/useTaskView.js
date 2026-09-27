import { useState } from "react";
import { useTasks } from "../../context/TasksContext";
export function useTaskView() {
  const data = useTasks();
  const [filters, setFilters] = useState({
    query: "",
    priority: "all",
    status: "all",
  });
  const [editor, setEditor] = useState(null);
  const [deleted, setDeleted] = useState(null);
  const onDelete = (task) => {
    data.removeTask(task.id);
    setDeleted(task);
  };
  const undoDelete = () => {
    if (deleted) data.restoreTask(deleted);
    setDeleted(null);
  };
  return {
    ...data,
    filters,
    setFilters,
    editor,
    setEditor,
    deleted,
    onDelete,
    undoDelete,
    onEdit: (task) => setEditor({ task }),
  };
}
