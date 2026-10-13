import { useState } from "react";
import { useTasks } from "./TasksContext";
import { undoToast } from "../../components/ui/undoToast";

/** UI-level task actions shared by the day and week views. */
export function useTaskActions() {
  const { saveTask, toggleTask, removeTask, restoreTask } = useTasks();
  // null = closed; { task } edits an existing task; { date, slot } creates one.
  const [editor, setEditor] = useState(null);

  const remove = (task) => {
    if (removeTask(task.id))
      undoToast(`Deleted “${task.text}”`, () => restoreTask(task));
  };

  return {
    editor,
    openEditor: setEditor,
    closeEditor: () => setEditor(null),
    edit: (task) => setEditor({ task }),
    save: saveTask,
    toggle: toggleTask,
    remove,
  };
}
