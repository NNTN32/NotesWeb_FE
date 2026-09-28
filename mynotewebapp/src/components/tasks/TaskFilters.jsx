import { FiSearch } from "react-icons/fi";
import { PRIORITIES } from "../../features/tasks/taskModel";
export default function TaskFilters({ filters, onChange }) {
  return (
    <div className="task-filters">
      <label className="ws-search">
        <FiSearch aria-hidden="true" />
        <input
          aria-label="Search tasks"
          placeholder="Search tasks…"
          value={filters.query}
          onChange={(event) =>
            onChange({ ...filters, query: event.target.value })
          }
        />
      </label>
      <select
        aria-label="Filter by priority"
        value={filters.priority}
        onChange={(event) =>
          onChange({ ...filters, priority: event.target.value })
        }
      >
        <option value="all">All priorities</option>
        {Object.entries(PRIORITIES).map(([key, value]) => (
          <option key={key} value={key}>
            {value.label}
          </option>
        ))}
      </select>
      <select
        aria-label="Filter by status"
        value={filters.status}
        onChange={(event) =>
          onChange({ ...filters, status: event.target.value })
        }
      >
        <option value="all">All statuses</option>
        <option value="open">Open</option>
        <option value="done">Completed</option>
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
          Clear filters
        </button>
      )}
    </div>
  );
}
