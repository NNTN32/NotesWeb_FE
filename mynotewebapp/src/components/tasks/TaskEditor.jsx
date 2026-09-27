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
      setError("Hãy nhập tên công việc.");
      return;
    }
    saveTask({ ...values, text: values.text.trim() });
    onClose();
  };
  return (
    <Modal titleId={id} onClose={onClose}>
      <p className="ws-eyebrow">MỘT BƯỚC NHỎ TIẾP THEO</p>
      <h2 id={id}>{task ? "Chỉnh sửa công việc" : "Dành thời gian cho…"}</h2>
      <p className="ws-description">Rõ ràng một chút, nhẹ đầu hơn một chút.</p>
      <form onSubmit={submit} className="ws-form">
        <label>
          Công việc
          <input
            name="text"
            value={values.text}
            onChange={change}
            maxLength={240}
            required
            autoFocus
            placeholder="Điều bạn muốn hoàn thành"
          />
        </label>
        <div className="ws-form-row">
          <label>
            Ngày thực hiện
            <input
              type="date"
              name="date"
              required
              value={values.date}
              onChange={change}
            />
          </label>
          <label>
            Ưu tiên
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
          Khoảng thời gian
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
          {task ? "Lưu thay đổi" : "Thêm công việc"}
          <FiArrowRight />
        </button>
        <p className="ws-storage-note">
          Lưu trên trình duyệt này · Hiển thị trong cả Todo và Kế hoạch tuần.
        </p>
      </form>
    </Modal>
  );
}
