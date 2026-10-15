import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { createTask } from "../taskModel";

/** Type a task and press Enter. Details can be edited afterwards. */
export default function QuickAdd({
  date,
  slot,
  onAdd,
  placeholder = "Add a task and press Enter",
}) {
  const [text, setText] = useState("");
  return (
    <form
      className="quick-add"
      onSubmit={(event) => {
        event.preventDefault();
        if (!text.trim()) return;
        if (onAdd(createTask({ text, date, slot }))) setText("");
      }}
    >
      <FiPlus aria-hidden="true" />
      <label htmlFor="quick-add" className="sr-only">
        Add a task
      </label>
      <input
        id="quick-add"
        className="quick-add__input"
        placeholder={placeholder}
        value={text}
        maxLength={240}
        autoComplete="off"
        autoCapitalize="sentences"
        enterKeyHint="done"
        onChange={(event) => setText(event.target.value)}
      />
    </form>
  );
}
