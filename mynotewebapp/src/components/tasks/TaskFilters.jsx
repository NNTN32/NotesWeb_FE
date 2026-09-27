import { FiSearch } from "react-icons/fi";
import { PRIORITIES } from "../../features/tasks/taskModel";
export default function TaskFilters({ filters, onChange }) {
  return (
    <div className="task-filters">
      <label className="ws-search">
        <FiSearch aria-hidden="true" />
        <input
          aria-label="Tìm công việc"
          placeholder="Tìm một công việc…"
          value={filters.query}
          onChange={(event) =>
            onChange({ ...filters, query: event.target.value })
          }
        />
      </label>
      <select
        aria-label="Lọc ưu tiên"
        value={filters.priority}
        onChange={(event) =>
          onChange({ ...filters, priority: event.target.value })
        }
      >
        <option value="all">Mọi mức ưu tiên</option>
        {Object.entries(PRIORITIES).map(([key, value]) => (
          <option key={key} value={key}>
            {value.label}
          </option>
        ))}
      </select>
      <select
        aria-label="Lọc trạng thái"
        value={filters.status}
        onChange={(event) =>
          onChange({ ...filters, status: event.target.value })
        }
      >
        <option value="all">Mọi trạng thái</option>
        <option value="open">Chưa hoàn thành</option>
        <option value="done">Đã hoàn thành</option>
      </select>
      {(filters.query ||
        filters.priority !== "all" ||
        filters.status !== "all") && (
        <button
          className="ws-text-button"
          onClick={() =>
            onChange({ query: "", priority: "all", status: "all" })
          }
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
}
