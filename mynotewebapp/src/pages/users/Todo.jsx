import { useState } from "react";
import {
  FiPlus,
  FiList,
  FiGrid,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import PageHeader from "../../components/workspace/PageHeader";
import EmptyState from "../../components/workspace/EmptyState";
import DaySchedule from "../../components/tasks/DaySchedule";
import TaskCard from "../../components/tasks/TaskCard";
import TaskFilters from "../../components/tasks/TaskFilters";
import TaskSummary from "../../components/tasks/TaskSummary";
import TaskEditor from "../../components/tasks/TaskEditor";
import TaskFeedback from "../../components/tasks/TaskFeedback";
import { useTaskView } from "../../features/tasks/useTaskView";
import {
  dateKey,
  shiftDate,
  formatDate,
  filterTasks,
  taskStats,
} from "../../features/tasks/taskModel";

export default function Todo() {
  const view = useTaskView();
  const [date, setDate] = useState(dateKey);
  const [listMode, setListMode] = useState(false);
  const dayTasks = view.tasks.filter((task) => task.date === date);
  const visible = filterTasks(dayTasks, view.filters);
  const actions = {
    onToggle: view.toggleTask,
    onEdit: view.onEdit,
    onDelete: view.onDelete,
  };
  return (
    <div className="workspace-page todo-page">
      <PageHeader
        eyebrow="VIỆC CẦN LÀM · MỘT NGÀY CÓ CHỦ ĐÍCH"
        title={
          <>
            Từng việc nhỏ.
            <br />
            <em>Một ngày trọn vẹn.</em>
          </>
        }
        description="Sắp xếp điều cần làm, dành tâm trí cho điều đang làm."
      >
        <button className="ws-button" onClick={() => view.setEditor({ date })}>
          <FiPlus />
          Thêm công việc
        </button>
      </PageHeader>
      <TaskFeedback
        error={view.storageError}
        deleted={view.deleted}
        onUndo={view.undoDelete}
      />
      <div className="ws-toolbar">
        <div className="ws-date-nav">
          <button
            className="ws-icon-button"
            aria-label="Ngày trước"
            onClick={() => setDate(shiftDate(date, -1))}
          >
            <FiChevronLeft />
          </button>
          <label>
            <span className="sr-only">Chọn ngày</span>
            <input
              type="date"
              required
              value={date}
              onChange={(event) =>
                event.target.value && setDate(event.target.value)
              }
            />
          </label>
          <button
            className="ws-icon-button"
            aria-label="Ngày sau"
            onClick={() => setDate(shiftDate(date, 1))}
          >
            <FiChevronRight />
          </button>
          <button className="ws-text-button" onClick={() => setDate(dateKey())}>
            Hôm nay
          </button>
        </div>
        <button
          className="ws-secondary"
          aria-pressed={listMode}
          onClick={() => setListMode(!listMode)}
        >
          {listMode ? <FiGrid /> : <FiList />}
          {listMode ? "Theo khung giờ" : "Danh sách tập trung"}
        </button>
      </div>
      <TaskFilters filters={view.filters} onChange={view.setFilters} />
      <div className={`todo-layout ${listMode ? "todo-layout--focus" : ""}`}>
        <section className="ws-panel">
          <div className="ws-panel-heading">
            <h2>
              {formatDate(date, {
                weekday: "long",
                day: "numeric",
                month: "numeric",
              })}
            </h2>
            <span>{visible.length} công việc</span>
          </div>
          {listMode ? (
            <div className="task-list">
              {visible.length ? (
                visible.map((task) => (
                  <TaskCard key={task.id} task={task} {...actions} />
                ))
              ) : (
                <EmptyState
                  title="Khoảng trống cho điều quan trọng"
                  description="Thêm công việc hoặc thử thay đổi bộ lọc."
                />
              )}
            </div>
          ) : (
            <DaySchedule
              tasks={visible}
              isToday={date === dateKey()}
              onAdd={(slot) => view.setEditor({ date, slot })}
              {...actions}
            />
          )}
        </section>
        {!listMode && <TaskSummary stats={taskStats(dayTasks)} />}
      </div>
      {view.editor && (
        <TaskEditor {...view.editor} onClose={() => view.setEditor(null)} />
      )}
    </div>
  );
}
