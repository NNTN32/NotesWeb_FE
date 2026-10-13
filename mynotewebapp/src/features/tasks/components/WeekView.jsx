import { FiPlus } from "react-icons/fi";
import IconButton from "../../../components/ui/IconButton";
import { dateKey, formatDate } from "../taskModel";
import TaskItem from "./TaskItem";
import { useNewItems } from "../../../hooks/useNewItems";
import { staggerStyle } from "../../../lib/motion";

export default function WeekView({ dates, tasks, actions }) {
  const today = dateKey();
  const isNew = useNewItems(tasks.map((task) => task.id));
  return (
    <div className="week-view" role="region" aria-label="Week" tabIndex={0}>
      {dates.map((date, index) => {
        const items = tasks.filter((task) => task.date === date);
        const done = items.filter((task) => task.completed).length;
        return (
          <section
            key={date}
            className={`week-day motion-rise ${date === today ? "week-day--today" : ""}`}
            style={staggerStyle(index)}
            aria-label={formatDate(date, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          >
            <header className="week-day__header">
              <span>{formatDate(date, { weekday: "short" })}</span>
              <strong>{formatDate(date, { day: "numeric" })}</strong>
              {items.length > 0 && (
                <small>
                  {done}/{items.length}
                </small>
              )}
            </header>
            <ul className="task-list task-list--compact">
              {items.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isNew={isNew(task.id)}
                  onToggle={actions.toggle}
                  onEdit={actions.edit}
                />
              ))}
            </ul>
            <IconButton
              label={`Add task on ${formatDate(date, { weekday: "long", month: "long", day: "numeric" })}`}
              icon={FiPlus}
              className="week-day__add"
              onClick={() => actions.openEditor({ date })}
            />
          </section>
        );
      })}
    </div>
  );
}
