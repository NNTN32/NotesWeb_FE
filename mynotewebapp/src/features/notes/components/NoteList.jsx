import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import EmptyState from "../../../components/ui/EmptyState";
import { noteTitle, searchNotes } from "../noteModel";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export default function NoteList({ notes, activeId, onOpen }) {
  const [query, setQuery] = useState("");
  const results = searchNotes(notes, query);

  return (
    <aside className="note-list" aria-label="All notes">
      <label className="search">
        <FiSearch aria-hidden="true" />
        <input
          className="input"
          type="search"
          aria-label="Search notes"
          placeholder="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      {results.length ? (
        <ul className="note-list__items">
          {results.map((note) => (
            <li key={note.id}>
              <button
                type="button"
                className="note-list__item"
                aria-current={note.id === activeId ? "true" : undefined}
                onClick={() => onOpen(note)}
              >
                <strong>{noteTitle(note)}</strong>
                <span>
                  <time dateTime={note.updatedAt}>
                    {dateFormat.format(new Date(note.updatedAt))}
                  </time>
                  {" · "}
                  {note.content.slice(0, 80) || "No content"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>{query ? "No matching notes." : "No notes yet."}</EmptyState>
      )}
    </aside>
  );
}
