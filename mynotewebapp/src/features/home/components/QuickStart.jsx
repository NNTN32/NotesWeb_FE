import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Animate from "../../../components/ui/Animate";
import { useFlip } from "../../../hooks/useFlip";
import { useNewItems } from "../../../hooks/useNewItems";
import { ROUTES } from "../../../app/routes";
import { useTasks } from "../../tasks/TasksContext";
import {
  currentSlot,
  dateKey,
  filterTasks,
  taskStats,
} from "../../tasks/taskModel";
import QuickAdd from "../../tasks/components/QuickAdd";
import TaskItem from "../../tasks/components/TaskItem";
import "../../tasks/tasks.css";
import "../home-quickstart.css";

const VISIBLE = 4;
const DAY_VIEW = `${ROUTES.tasks}?view=day`;

/**
 * Hero "try it now": real tasks for today, right on Home.
 * - Nothing planned today → one input; the first task is saved for real.
 * - Something planned → today's progress, the next few tasks, quick add.
 * Uses the same TasksProvider, so everything here shows up in Tasks.
 */
export default function QuickStart() {
  const { tasks, saveTask, toggleTask } = useTasks();
  const navigate = useNavigate();
  const today = dateKey();
  const todayTasks = tasks.filter((task) => task.date === today);
  const isNew = useNewItems(todayTasks.map((task) => task.id));
  const flipRef = useFlip();
  const stats = taskStats(todayTasks);
  const visible = filterTasks(todayTasks).slice(0, VISIBLE);
  const hidden = todayTasks.length - visible.length;
  const addTask = (task) => saveTask({ ...task, slot: currentSlot() });

  if (!todayTasks.length) {
    return (
      <Animate key="empty" name="fade" className="quickstart">
        <QuickAdd
          date={today}
          onAdd={addTask}
          placeholder="What’s one thing you want to do today?"
        />
        <p className="quickstart__hint muted">
          Press Enter. It’s saved in this browser, no account needed.
        </p>
      </Animate>
    );
  }

  const allDone = stats.remaining === 0;
  return (
    <Animate key="today" name="scale" className="quickstart quickstart--card">
      <div className="quickstart__header">
        <strong>Today</strong>
        <span className="muted" aria-live="polite">
          {stats.completed} of {stats.total} done
        </span>
      </div>
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${stats.progress}%` }} />
      </div>

      <ul ref={flipRef} className="task-list quickstart__list flip-root">
        {visible.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isNew={isNew(task.id)}
            onToggle={toggleTask}
            onEdit={() => navigate(DAY_VIEW)}
          />
        ))}
      </ul>

      {allDone && (
        <Animate as="p" name="pop" className="quickstart__done">
          All done for today. Nice work.
        </Animate>
      )}

      <QuickAdd date={today} onAdd={addTask} placeholder="Add another task" />

      <Link className="quickstart__link" to={DAY_VIEW}>
        {hidden > 0 ? `See all ${todayTasks.length} tasks` : "Open your day"}
        <FiArrowRight aria-hidden="true" />
      </Link>
    </Animate>
  );
}
