import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { PRIORITIES } from "../../features/tasks/taskModel";
export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  return (
    <article className={`task-card ${task.completed ? "task-card--done" : ""}`}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Hoàn thành: ${task.text}`}
        />
      </label>
      <button className="task-copy" type="button" onClick={() => onEdit(task)}>
        <span>{task.text}</span>
        <small className={`priority priority--${task.priority}`}>
          {PRIORITIES[task.priority].label}
        </small>
      </button>
      <div className="task-actions">
        <button
          className="ws-icon-button"
          type="button"
          aria-label={`Sửa: ${task.text}`}
          onClick={() => onEdit(task)}
        >
          <FiEdit2 />
        </button>
        <button
          className="ws-icon-button"
          type="button"
          aria-label={`Xóa: ${task.text}`}
          onClick={() => onDelete(task)}
        >
          <FiTrash2 />
        </button>
      </div>
    </article>
  );
}
