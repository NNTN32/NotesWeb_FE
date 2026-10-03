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
  const [feedback, setFeedback] = useState("");
  const [deleted, setDeleted] = useState(null);
  const onDelete = (task) => {
    setFeedback("");
    data.removeTask(task.id);
    setDeleted(task);
  };
  const undoDelete = () => {
    if (deleted) data.restoreTask(deleted);
    setDeleted(null);
  };
  return {
    ...data,
    feedback,
    toggleTask: (id) => {
      const task = data.tasks.find((item) => item.id === id);
      const saved = data.toggleTask(id);
      setFeedback(
        saved && task
          ? task.completed
            ? `“${task.text}” is back in your plan.`
            : `“${task.text}” completed. One small step forward.`
          : "",
      );
      return saved;
    },
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
