import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import PageHeader from "../components/ui/PageHeader";
import SegmentedControl from "../components/ui/SegmentedControl";
import IconButton from "../components/ui/IconButton";
import Alert from "../components/ui/Alert";
import Animate from "../components/ui/Animate";
import DayView from "../features/tasks/components/DayView";
import WeekView from "../features/tasks/components/WeekView";
import TaskEditor from "../features/tasks/components/TaskEditor";
import { useTasks } from "../features/tasks/TasksContext";
import { useTaskActions } from "../features/tasks/useTaskActions";
import {
  dateKey,
  filterTasks,
  formatDate,
  formatWeekRange,
  shiftDate,
  validDate,
  weekDates,
} from "../features/tasks/taskModel";
import "../features/tasks/tasks.css";

const VIEWS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
];

/** View and date live in the URL (?view=week&date=2026-10-13) so they survive reloads. */
function useTasksLocation() {
  const [params, setParams] = useSearchParams();
  const view = params.get("view") === "week" ? "week" : "day";
  const date = validDate(params.get("date")) ? params.get("date") : dateKey();
  const update = (changes) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        return next;
      },
      { replace: true },
    );
  return {
    view,
    date,
    setView: (value) => update({ view: value }),
    setDate: (value) => update({ date: value === dateKey() ? null : value }),
  };
}

export default function TasksPage() {
  const { view, date, setView, setDate } = useTasksLocation();
  const { tasks, storageError } = useTasks();
  const actions = useTaskActions();
  const [query, setQuery] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  // Which way the last date change went, so content slides in from that side.
  const [direction, setDirection] = useState(null);
  const goTo = (next) => {
    setDirection(next > date ? "forward" : "back");
    setDate(next);
  };

  const isWeek = view === "week";
  const dates = isWeek ? weekDates(date) : [date];
  const rangeTasks = tasks.filter((task) => dates.includes(task.date));
  const visibleTasks = filterTasks(rangeTasks, {
    query,
    status: hideCompleted ? "open" : "all",
  });
  const showsToday = dates.includes(dateKey());

  return (
    <>
      <PageHeader title="Tasks">
        <SegmentedControl
          label="View"
          options={VIEWS}
          value={view}
          onChange={(next) => {
            setDirection(null);
            setView(next);
          }}
        />
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => actions.openEditor({ date })}
        >
          New task
        </button>
      </PageHeader>

      <Alert>{storageError}</Alert>

      <div className="tasks-toolbar">
        <div className="date-nav">
          <IconButton
            label={isWeek ? "Previous week" : "Previous day"}
            icon={FiChevronLeft}
            onClick={() => goTo(shiftDate(date, isWeek ? -7 : -1))}
          />
          <h2 className="date-nav__label" aria-live="polite">
            {isWeek
              ? formatWeekRange(dates)
              : formatDate(date, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
          </h2>
          <IconButton
            label={isWeek ? "Next week" : "Next day"}
            icon={FiChevronRight}
            onClick={() => goTo(shiftDate(date, isWeek ? 7 : 1))}
          />
          {!showsToday && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => goTo(dateKey())}
            >
              Today
            </button>
          )}
        </div>
        <div className="tasks-toolbar__filters">
          <label className="search">
            <FiSearch aria-hidden="true" />
            <input
              className="input"
              type="search"
              aria-label="Search tasks"
              placeholder="Search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="checkbox muted">
            <input
              type="checkbox"
              checked={hideCompleted}
              onChange={(event) => setHideCompleted(event.target.checked)}
            />
            Hide done
          </label>
        </div>
      </div>

      {/* Re-keyed per view and period: slides in the navigation direction. */}
      <Animate
        key={`${view}-${dates[0]}`}
        name={
          direction === "forward"
            ? "fromRight"
            : direction === "back"
              ? "fromLeft"
              : "fade"
        }
      >
        {isWeek ? (
          <WeekView dates={dates} tasks={visibleTasks} actions={actions} />
        ) : (
          <DayView
            date={date}
            dayTasks={rangeTasks}
            visibleTasks={visibleTasks}
            actions={actions}
          />
        )}
      </Animate>

      {actions.editor && (
        <TaskEditor
          {...actions.editor}
          onSave={actions.save}
          onDelete={actions.remove}
          onClose={actions.closeEditor}
        />
      )}
    </>
  );
}
