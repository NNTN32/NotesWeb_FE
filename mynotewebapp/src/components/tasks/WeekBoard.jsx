import { FiPlus } from "react-icons/fi";
import { dateKey, formatDate } from "../../features/tasks/taskModel";
import TaskCard from "./TaskCard";
export default function WeekBoard({ dates, tasks, onAdd, ...actions }) {
  return (
    <div
      className="week-scroll"
      role="region"
      aria-label="Lịch bảy ngày, cuộn ngang để xem"
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
                    ? "Hôm nay"
                    : `${items.filter((task) => task.completed).length}/${items.length} hoàn thành`}
                </small>
              </header>
              <div className="week-day-tasks">
                {items.map((task) => (
                  <TaskCard key={task.id} task={task} {...actions} />
                ))}
                {!items.length && (
                  <p className="week-empty">
                    Một chút khoảng trống
                    <br />
                    cũng là một kế hoạch.
                  </p>
                )}
                <button
                  className="task-add-inline"
                  aria-label={`Thêm việc ngày ${date}`}
                  onClick={() => onAdd(date)}
                >
                  <FiPlus />
                  Thêm việc
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
