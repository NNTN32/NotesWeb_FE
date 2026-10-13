import { useId, useState } from "react";
import Modal from "../../../components/ui/Modal";
import { PRIORITIES, TIME_SLOTS, currentSlot, dateKey } from "../taskModel";

export default function TaskEditor({
  task,
  date = dateKey(),
  slot = currentSlot(),
  onSave,
  onDelete,
  onClose,
}) {
  const titleId = useId();
  const [values, setValues] = useState(
    task || { text: "", priority: "medium", date, slot },
  );
  const [error, setError] = useState("");
  const change = (event) =>
    setValues((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const submit = (event) => {
    event.preventDefault();
    if (!values.text.trim()) {
      setError("Please enter a task name.");
      return;
    }
    if (onSave({ ...values, text: values.text.trim() })) onClose();
  };

  return (
    <Modal titleId={titleId} onClose={onClose}>
      <h2 id={titleId}>{task ? "Edit task" : "New task"}</h2>
      <form onSubmit={submit} className="form">
        <label className="field">
          Task
          <input
            className="input"
            name="text"
            value={values.text}
            onChange={change}
            maxLength={240}
            required
            autoComplete="off"
          />
        </label>
        <div className="form-row">
          <label className="field">
            Date
            <input
              className="input"
              type="date"
              name="date"
              required
              value={values.date}
              onChange={change}
            />
          </label>
          <label className="field">
            Priority
            <select
              className="select"
              name="priority"
              value={values.priority}
              onChange={change}
            >
              {Object.entries(PRIORITIES).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="field">
          Time of day
          <select
            className="select"
            name="slot"
            value={values.slot}
            onChange={change}
          >
            {TIME_SLOTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label} · {item.time}
              </option>
            ))}
          </select>
        </label>
        {error && (
          <p role="alert" className="alert">
            {error}
          </p>
        )}
        <div className="task-editor__actions">
          {task && (
            <button
              type="button"
              className="btn btn--ghost task-editor__delete"
              onClick={() => {
                onDelete(task);
                onClose();
              }}
            >
              Delete
            </button>
          )}
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {task ? "Save" : "Add task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
