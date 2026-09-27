export default function TaskSummary({ stats, period = "hôm nay" }) {
  return (
    <aside className="task-summary ws-panel">
      <p className="ws-eyebrow">TỪNG BƯỚC MỘT</p>
      <div className="task-progress-number">
        {stats.progress}
        <span>%</span>
      </div>
      <h2>Nhịp điệu {period}</h2>
      <p>
        {stats.total === 0
          ? "Một khoảng trống để bắt đầu điều bạn muốn."
          : stats.remaining
            ? `Còn ${stats.remaining} việc. Bắt đầu từ một việc nhỏ thôi.`
            : "Bạn đã hoàn thành tất cả. Dành một chút thời gian cho mình nhé."}
      </p>
      <progress
        value={stats.completed}
        max={stats.total || 1}
        aria-label={`Tiến độ ${period}`}
      />
      <div className="task-summary-counts">
        <span>
          <strong>{stats.total}</strong>Đã lên kế hoạch
        </span>
        <span>
          <strong>{stats.completed}</strong>Đã hoàn thành
        </span>
      </div>
      <div className="ws-quote">
        “Không cần nhanh hơn.
        <br />
        Chỉ cần đều đặn hơn.”
      </div>
    </aside>
  );
}
