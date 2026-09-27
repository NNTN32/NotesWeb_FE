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
    <div className="workspace-page week-page">
      <PageHeader
        eyebrow="KẾ HOẠCH TUẦN · NHÌN BỨC TRANH LỚN"
        title={
          <>
            Một tuần rõ ràng.
            <br />
            <em>Thêm chỗ cho chính mình.</em>
          </>
        }
        description="Có thời gian cho mục tiêu. Có khoảng trống để thở."
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
          Lên kế hoạch
        </button>
      </PageHeader>
      <TaskFeedback
        error={view.storageError}
        deleted={view.deleted}
        onUndo={view.undoDelete}
      />
      <div className="week-overview">
        <div>
          <span>KẾ HOẠCH</span>
          <strong>
            {stats.total}
            <small>công việc</small>
          </strong>
        </div>
        <div>
          <span>ĐÃ HOÀN THÀNH</span>
          <strong>
            {stats.completed}
            <small>từng bước tiến</small>
          </strong>
        </div>
        <div>
          <span>NHỊP ĐỘ TUẦN NÀY</span>
          <strong>
            {stats.progress}
            <small>% hoàn thành</small>
          </strong>
          <progress
            value={stats.completed}
            max={stats.total || 1}
            aria-label="Tiến độ tuần"
          />
        </div>
      </div>
      <div className="ws-toolbar">
        <div className="ws-date-nav">
          <button
            className="ws-icon-button"
            aria-label="Tuần trước"
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
            aria-label="Tuần sau"
            onClick={() => setAnchor(shiftDate(anchor, 7))}
          >
            <FiChevronRight />
          </button>
          <button
            className="ws-text-button"
            onClick={() => setAnchor(dateKey())}
          >
            Tuần này
          </button>
        </div>
        <span className="ws-storage-note">Tuần bắt đầu từ thứ Hai</span>
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
              Ba điều đáng ưu tiên
            </h2>
            <span>Việc chưa hoàn thành</span>
          </div>
          {focus.length ? (
            <div className="week-focus">
              {focus.map((task) => (
                <TaskCard key={task.id} task={task} {...actions} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Chưa có việc cần ưu tiên"
              description="Hãy dành tuần này cho những điều có ý nghĩa với bạn."
            />
          )}
        </div>
        <aside className="week-reflection">
          <span aria-hidden="true">✧</span>
          <h3>Đừng quên những khoảng nghỉ.</h3>
          <p>
            Một tuần tốt không phải là một tuần kín lịch. Hãy để lại chỗ cho
            những điều bất ngờ.
          </p>
        </aside>
      </section>
      {view.editor && (
        <TaskEditor {...view.editor} onClose={() => view.setEditor(null)} />
      )}
    </div>
  );
}
