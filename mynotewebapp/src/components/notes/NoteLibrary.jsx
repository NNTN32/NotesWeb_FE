import { FiPlus, FiFileText } from "react-icons/fi";
import { useState } from "react";
export default function NoteLibrary({ notes, activeId, onOpen, onNew }) {
  const [query, setQuery] = useState("");
  const filtered = notes.filter((note) =>
    `${note.title} ${note.content}`
      .toLocaleLowerCase("en")
      .includes(query.toLocaleLowerCase("en")),
  );
  return (
    <aside className="note-library ws-panel">
      <div className="ws-panel-heading">
        <h2>Notebook</h2>
        <span>
          {notes.length} {notes.length === 1 ? "page" : "pages"}
        </span>
      </div>
      <div className="note-library-controls">
        <button className="ws-secondary" onClick={onNew}>
          <FiPlus />
          New page
        </button>
        <input
          aria-label="Search notes"
          placeholder="Search your notebook…"
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
              ? "No matching notes found."
              : "Saved pages will appear here. Every idea has a place."}
          </p>
        )}
      </div>
      <div className="note-library-tip">
        <span>✳</span>
        <p>
          Write for yourself first.
          <br />
          You can edit later.
        </p>
      </div>
    </aside>
  );
}
