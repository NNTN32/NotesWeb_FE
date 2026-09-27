import { useCallback, useMemo } from "react";
import { useLocalStore } from "../hooks/useLocalStore";
import { validTasks } from "../features/tasks/taskModel";
import { TasksContext } from "./TasksContext";

const EMPTY_TASKS = [];
export default function TasksProvider({ children }) {
  const [tasks, setTasks, storageError] = useLocalStore(
    "mynote.tasks.v1",
    EMPTY_TASKS,
    validTasks,
  );
  const saveTask = useCallback(
    (task) =>
      setTasks((current) =>
        task.id
          ? current.map((item) =>
              item.id === task.id ? { ...item, ...task } : item,
            )
          : [
              ...current,
              { ...task, id: crypto.randomUUID(), completed: false },
            ],
      ),
    [setTasks],
  );
  const toggleTask = useCallback(
    (id) =>
      setTasks((current) =>
        current.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        ),
      ),
    [setTasks],
  );
  const removeTask = useCallback(
    (id) => setTasks((current) => current.filter((task) => task.id !== id)),
    [setTasks],
  );
  const restoreTask = useCallback(
    (task) =>
      setTasks((current) =>
        current.some((item) => item.id === task.id)
          ? current
          : [...current, task],
      ),
    [setTasks],
  );
  const value = useMemo(
    () => ({
      tasks,
      saveTask,
      toggleTask,
      removeTask,
      restoreTask,
      storageError,
    }),
    [tasks, saveTask, toggleTask, removeTask, restoreTask, storageError],
  );
  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}
