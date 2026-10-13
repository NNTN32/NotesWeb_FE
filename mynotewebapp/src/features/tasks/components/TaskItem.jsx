import { FiTrash2 } from "react-icons/fi";
import IconButton from "../../../components/ui/IconButton";
import { PRIORITIES } from "../taskModel";

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const priority = PRIORITIES[task.priority].label;
  return (
    <li className={`task ${task.completed ? "task--done" : ""}`}>
      <input
        type="checkbox"
        className="task__check"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Complete “${task.text}”`}
      />
      <button type="button" className="task__text" onClick={() => onEdit(task)}>
        {task.text}
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
          onClick={() => onDelete(task)}
        />
      )}
    </li>
  );
}
