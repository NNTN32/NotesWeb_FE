import { FiTrash2 } from "react-icons/fi";
import IconButton from "../../../components/ui/IconButton";
import { useExitAnimation } from "../../../hooks/useExitAnimation";
import { ENTER, EXIT } from "../../../lib/motion";
import { PRIORITIES } from "../taskModel";

export default function TaskItem({ task, isNew, onToggle, onEdit, onDelete }) {
  const { ref, exit, exitProps } = useExitAnimation();
  const priority = PRIORITIES[task.priority].label;
  const classes = [
    "task",
    task.completed && "task--done",
    isNew && ENTER.rise,
    EXIT.collapse,
  ].filter(Boolean);

  return (
    <li
      ref={ref}
      className={classes.join(" ")}
      data-flip-id={task.id}
      {...exitProps}
    >
      <input
        type="checkbox"
        className="checkbox-input"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Complete “${task.text}”`}
      />
      <button type="button" className="task__text" onClick={() => onEdit(task)}>
        <span>{task.text}</span>
      </button>
      <span
        className={`task__priority task__priority--${task.priority}`}
        title={`${priority} priority`}
      >
        <span className="sr-only">{priority} priority</span>
      </span>
      {onDelete && (
        <IconButton
          label={`Delete “${task.text}”`}
          icon={FiTrash2}
          variant="danger"
          className="task__delete"
          onClick={() => exit(() => onDelete(task))}
        />
      )}
    </li>
  );
}
