import { FiPlus } from "react-icons/fi";
import { dateKey, formatDate } from "../../features/tasks/taskModel";
import TaskCard from "./TaskCard";
export default function WeekBoard({ dates, tasks, onAdd, ...actions }) {
  return (
    <div
      className="week-scroll"
      role="region"
      aria-label="Seven-day calendar; scroll horizontally to explore"
      tabIndex={0}
    >
      <div className="week-board">
        {dates.map((date) => {
          const items = tasks.filter((task) => task.date === date);
          return (
            <section
              className={`week-day ${date === dateKey() ? "week-day--today" : ""}`}
              key={date}
            >
              <header>
                <span>{formatDate(date, { weekday: "short" })}</span>
                <strong>{formatDate(date, { day: "2-digit" })}</strong>
                <small>
                  {date === dateKey()
                    ? "Today"
                    : `${items.filter((task) => task.completed).length}/${items.length} complete`}
                </small>
              </header>
              <div className="week-day-tasks">
                {items.map((task) => (
                  <TaskCard key={task.id} task={task} {...actions} />
                ))}
                {!items.length && (
                  <p className="week-empty">
                    A little open space
                    <br />
                    is a plan, too.
                  </p>
                )}
                <button
                  className="task-add-inline"
                  aria-label={`Add task for ${formatDate(date, { weekday: "long", month: "long", day: "numeric" })}`}
                  onClick={() => onAdd(date)}
                >
                  <FiPlus />
                  Add task
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
