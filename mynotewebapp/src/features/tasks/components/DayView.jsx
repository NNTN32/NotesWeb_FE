import { currentSlot, dateKey, groupBySlot, taskStats } from "../taskModel";
import EmptyState from "../../../components/ui/EmptyState";
import QuickAdd from "./QuickAdd";
import TaskItem from "./TaskItem";
import { useFlip } from "../../../hooks/useFlip";
import { useNewItems } from "../../../hooks/useNewItems";

export default function DayView({ date, dayTasks, visibleTasks, actions }) {
  const flipRef = useFlip();
  const stats = taskStats(dayTasks);
  const isToday = date === dateKey();
  const groups = groupBySlot(visibleTasks);
  const isNew = useNewItems(dayTasks.map((task) => task.id));

  return (
    <section
      ref={flipRef}
      className="day-view flip-root"
      aria-label="Tasks for the day"
    >
      {stats.total > 0 && (
        <div className="day-view__progress" aria-live="polite">
          <span className="muted">
            {stats.completed} of {stats.total} done
          </span>
          <div className="progress" aria-hidden="true">
            <span style={{ width: `${stats.progress}%` }} />
          </div>
        </div>
      )}

      <QuickAdd
        date={date}
        slot={isToday ? currentSlot() : "morning"}
        onAdd={actions.save}
      />

      {groups.length ? (
        groups.map(({ slot, tasks }) => (
          <section key={slot.id} className="task-group">
            <h2 className="task-group__title">
              {slot.label}
              <span>{slot.time}</span>
            </h2>
            <ul className="task-list">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isNew={isNew(task.id)}
                  onToggle={actions.toggle}
                  onEdit={actions.edit}
                  onDelete={actions.remove}
                />
              ))}
            </ul>
          </section>
        ))
      ) : (
        <EmptyState>
          {dayTasks.length
            ? "No tasks match your filters."
            : "Nothing planned yet."}
        </EmptyState>
      )}
    </section>
  );
}
