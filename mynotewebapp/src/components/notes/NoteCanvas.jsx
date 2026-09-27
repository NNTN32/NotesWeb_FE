import { FiFeather, FiMaximize2, FiMinimize2 } from "react-icons/fi";
export default function NoteCanvas({
  draft,
  onChange,
  focus,
  onToggleFocus,
  onSave,
  error,
  dirty,
}) {
  const words = draft.content.trim()
    ? draft.content.trim().split(/\s+/u).length
    : 0;
  return (
    <section className="note-canvas">
      <div className="note-canvas-toolbar">
        <span>
          <FiFeather />
          {draft.id ? "TRANG GHI CHÉP" : "MỘT TRANG MỚI"}
        </span>
        <button
          className="ws-icon-button"
          aria-label={focus ? "Thoát chế độ tập trung" : "Bật chế độ tập trung"}
          aria-pressed={focus}
          onClick={onToggleFocus}
        >
          {focus ? <FiMinimize2 /> : <FiMaximize2 />}
        </button>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <label className="sr-only" htmlFor="note-title">
          Tiêu đề ghi chú
        </label>
        <input
          id="note-title"
          className="note-title"
          value={draft.title}
          onChange={(event) => onChange("title", event.target.value)}
          placeholder="Một ý tưởng vừa ghé qua…"
          required
          maxLength={200}
          autoComplete="off"
        />
        <label className="sr-only" htmlFor="note-content">
          Nội dung ghi chú
        </label>
        <textarea
          id="note-content"
          className="note-content"
          value={draft.content}
          onChange={(event) => onChange("content", event.target.value)}
          placeholder="Cứ viết xuống. Một suy nghĩ, một câu chuyện, hay điều bạn muốn ghi nhớ…"
          required
          maxLength={50000}
        />
        <footer className="note-canvas-footer">
          <span>
            {words} từ · {draft.content.length.toLocaleString("vi-VN")} ký tự
          </span>
          <span role="status">
            {error
              ? "Chưa lưu được trên trình duyệt"
              : !draft.title && !draft.content
                ? "Sẵn sàng cho ý tưởng đầu tiên"
                : dirty
                  ? "Bản nháp đã lưu trên trình duyệt"
                  : "Đã lưu trên trình duyệt"}
          </span>
        </footer>
        <button type="submit" className="ws-button note-save">
          Lưu vào sổ
        </button>
      </form>
    </section>
  );
}
