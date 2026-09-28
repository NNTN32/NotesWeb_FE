export default function TaskSummary({ stats }) {
  return (
    <aside className="task-summary ws-panel">
      <p className="ws-eyebrow">ONE STEP AT A TIME</p>
      <div className="task-progress-number">
        {stats.progress}
        <span>%</span>
      </div>
      <h2>Today’s rhythm</h2>
      <p>
        {stats.total === 0
          ? "A little space to begin what matters to you."
          : stats.remaining
            ? `${stats.remaining} ${stats.remaining === 1 ? "task" : "tasks"} left. Start with one small step.`
            : "You have finished everything. Take a little time for yourself."}
      </p>
      <progress
        value={stats.completed}
        max={stats.total || 1}
        aria-label="Today’s progress"
      />
      <div className="task-summary-counts">
        <span>
          <strong>{stats.total}</strong>Planned
        </span>
        <span>
          <strong>{stats.completed}</strong>Completed
        </span>
      </div>
      <div className="ws-quote">
        “You do not need to go faster.
        <br />
        Just keep showing up.”
      </div>
    </aside>
  );
}
