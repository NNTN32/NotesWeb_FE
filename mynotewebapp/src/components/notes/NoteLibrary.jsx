import { FiPlus, FiFileText } from "react-icons/fi";
import { useState } from "react";
export default function NoteLibrary({ notes, activeId, onOpen, onNew }) {
  const [query, setQuery] = useState("");
  const filtered = notes.filter((note) =>
    `${note.title} ${note.content}`
      .toLocaleLowerCase("vi")
      .includes(query.toLocaleLowerCase("vi")),
  );
  return (
    <aside className="note-library ws-panel">
      <div className="ws-panel-heading">
        <h2>Sổ ghi chép</h2>
        <span>{notes.length} trang</span>
      </div>
      <div className="note-library-controls">
        <button className="ws-secondary" onClick={onNew}>
          <FiPlus />
          Trang mới
        </button>
        <input
          aria-label="Tìm ghi chú"
          placeholder="Tìm trong sổ…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="note-library-list">
        {filtered.length ? (
          filtered.map((note) => (
            <button
              key={note.id}
              className={`note-library-item ${activeId === note.id ? "note-library-item--active" : ""}`}
              aria-pressed={activeId === note.id}
              onClick={() => onOpen(note)}
            >
              <FiFileText aria-hidden="true" />
              <span>
                <strong>{note.title}</strong>
                <small>{note.content.slice(0, 68)}</small>
              </span>
            </button>
          ))
        ) : (
          <p className="note-library-empty">
            {query
              ? "Chưa tìm thấy ghi chú phù hợp."
              : "Những trang đã lưu sẽ ở đây. Mỗi ý tưởng đều có một chỗ riêng."}
          </p>
        )}
      </div>
      <div className="note-library-tip">
        <span>✳</span>
        <p>
          Viết cho mình trước.
          <br />
          Chỉnh sửa sau cũng được.
        </p>
      </div>
    </aside>
  );
}
