import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import EmptyState from "../../../components/ui/EmptyState";
import { useNewItems } from "../../../hooks/useNewItems";
import { ENTER } from "../../../lib/motion";
import { useFlip } from "../../../hooks/useFlip";
import { noteTitle, searchNotes } from "../noteModel";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export default function NoteList({ notes, activeId, onOpen }) {
  const [query, setQuery] = useState("");
  const results = searchNotes(notes, query);
  const isNew = useNewItems(notes.map((note) => note.id));
  const flipRef = useFlip();

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
        <ul ref={flipRef} className="note-list__items flip-root">
          {results.map((note) => (
            <li
              key={note.id}
              data-flip-id={note.id}
              className={isNew(note.id) ? ENTER.rise : undefined}
            >
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
        <EmptyState>
          {query ? "No matching notes." : "No notes yet."}
        </EmptyState>
      )}
    </aside>
  );
}
