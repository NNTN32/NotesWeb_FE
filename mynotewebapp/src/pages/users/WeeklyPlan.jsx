import { useState } from "react";
import {
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiTarget,
} from "react-icons/fi";
import PageHeader from "../../components/workspace/PageHeader";
import TaskFilters from "../../components/tasks/TaskFilters";
import TaskEditor from "../../components/tasks/TaskEditor";
import TaskFeedback from "../../components/tasks/TaskFeedback";
import TaskCard from "../../components/tasks/TaskCard";
import WeekBoard from "../../components/tasks/WeekBoard";
import EmptyState from "../../components/workspace/EmptyState";
import { useTaskView } from "../../features/tasks/useTaskView";
import PageSurface from "../../components/workspace/PageSurface";
import {
  dateKey,
  shiftDate,
  weekDates,
  formatDate,
  filterTasks,
  taskStats,
} from "../../features/tasks/taskModel";

export default function WeeklyPlan() {
  const view = useTaskView();
  const [anchor, setAnchor] = useState(dateKey);
  const dates = weekDates(anchor);
  const tasks = view.tasks.filter((task) => dates.includes(task.date));
  const stats = taskStats(tasks);
  const focus = filterTasks(tasks, { status: "open" }).slice(0, 3);
  const actions = {
    onToggle: view.toggleTask,
    onEdit: view.onEdit,
    onDelete: view.onDelete,
  };
  return (
    <PageSurface variant="week">
      <PageHeader
        eyebrow="WEEKLY PLAN · SEE THE BIG PICTURE"
        title={
          <>
            A clearer week.
            <br />
            <em>More room for yourself.</em>
          </>
        }
        description="Make time for your goals. Leave room to breathe."
      >
        <button
          className="ws-button"
          onClick={() =>
            view.setEditor({
              date: dates.includes(dateKey()) ? dateKey() : dates[0],
            })
          }
        >
          <FiPlus />
          Add task
        </button>
      </PageHeader>
      <TaskFeedback
        error={view.storageError}
        deleted={view.deleted}
        onUndo={view.undoDelete}
      />
      <div className="week-overview">
        <div>
          <span>PLANNED</span>
          <strong>
            {stats.total}
            <small>tasks</small>
          </strong>
        </div>
        <div>
          <span>COMPLETED</span>
          <strong>
            {stats.completed}
            <small>tasks</small>
          </strong>
        </div>
        <div>
          <span>THIS WEEK’S PACE</span>
          <strong>
            {stats.progress}
            <small>% complete</small>
          </strong>
          <progress
            value={stats.completed}
            max={stats.total || 1}
            aria-label="Weekly progress"
          />
        </div>
      </div>
      <div className="ws-toolbar">
        <div className="ws-date-nav">
          <button
            className="ws-icon-button"
            aria-label="Previous week"
            onClick={() => setAnchor(shiftDate(anchor, -7))}
          >
            <FiChevronLeft />
          </button>
          <h2>
            {formatDate(dates[0], { day: "numeric", month: "numeric" })} —{" "}
            {formatDate(dates[6], {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </h2>
          <button
            className="ws-icon-button"
            aria-label="Next week"
            onClick={() => setAnchor(shiftDate(anchor, 7))}
          >
            <FiChevronRight />
          </button>
          <button
            className="ws-text-button"
            onClick={() => setAnchor(dateKey())}
          >
            This week
          </button>
        </div>
        <span className="ws-storage-note">Weeks start on Monday</span>
      </div>
      <TaskFilters filters={view.filters} onChange={view.setFilters} />
      <WeekBoard
        dates={dates}
        tasks={filterTasks(tasks, view.filters)}
        onAdd={(date) => view.setEditor({ date })}
        {...actions}
      />
      <section className="week-bottom">
        <div className="ws-panel">
          <div className="ws-panel-heading">
            <h2>
              <FiTarget />
              Three things to prioritize
            </h2>
            <span>Open tasks</span>
          </div>
          {focus.length ? (
            <div className="week-focus">
              {focus.map((task) => (
                <TaskCard key={task.id} task={task} {...actions} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nothing to prioritize yet"
              description="Make this week about what matters to you."
            />
          )}
        </div>
        <aside className="week-reflection">
          <span aria-hidden="true">✧</span>
          <h3>Remember to take breaks.</h3>
          <p>
            A good week does not have to be packed. Leave space for the
            unexpected.
          </p>
        </aside>
      </section>
      {view.editor && (
        <TaskEditor {...view.editor} onClose={() => view.setEditor(null)} />
      )}
    </PageSurface>
  );
}
