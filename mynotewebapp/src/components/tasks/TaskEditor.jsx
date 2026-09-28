import { useId, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  PRIORITIES,
  TIME_SLOTS,
  dateKey,
  currentSlot,
} from "../../features/tasks/taskModel";
import { useTasks } from "../../context/TasksContext";
import Modal from "../workspace/Modal";

export default function TaskEditor({
  task,
  date = dateKey(),
  slot = currentSlot(),
  onClose,
}) {
  const id = useId();
  const { saveTask } = useTasks();
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
    saveTask({ ...values, text: values.text.trim() });
    onClose();
  };
  return (
    <Modal titleId={id} onClose={onClose}>
      <p className="ws-eyebrow">ONE SMALL STEP FORWARD</p>
      <h2 id={id}>{task ? "Edit task" : "Make time for…"}</h2>
      <p className="ws-description">
        A little clarity makes things feel lighter.
      </p>
      <form onSubmit={submit} className="ws-form">
        <label>
          Task
          <input
            name="text"
            value={values.text}
            onChange={change}
            maxLength={240}
            required
            autoFocus
            placeholder="What would you like to get done?"
          />
        </label>
        <div className="ws-form-row">
          <label>
            Date
            <input
              type="date"
              name="date"
              required
              value={values.date}
              onChange={change}
            />
          </label>
          <label>
            Priority
            <select name="priority" value={values.priority} onChange={change}>
              {Object.entries(PRIORITIES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Time block
          <select name="slot" value={values.slot} onChange={change}>
            {TIME_SLOTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label} · {item.time}
              </option>
            ))}
          </select>
        </label>
        {error && (
          <p role="alert" className="ws-error">
            {error}
          </p>
        )}
        <button className="ws-button" type="submit">
          {task ? "Save changes" : "Add task"}
          <FiArrowRight />
        </button>
        <p className="ws-storage-note">
          Saved in this browser · Appears in both To-dos and Weekly plan.
        </p>
      </form>
    </Modal>
  );
}
