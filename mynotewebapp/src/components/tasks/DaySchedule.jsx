import { FiPlus, FiSun, FiSunrise, FiSunset, FiMoon } from "react-icons/fi";
import { TIME_SLOTS, currentSlot } from "../../features/tasks/taskModel";
import TaskCard from "./TaskCard";
const ICONS = {
  sun: FiSun,
  sunrise: FiSunrise,
  sunset: FiSunset,
  moon: FiMoon,
};
export default function DaySchedule({ tasks, isToday, onAdd, ...actions }) {
  return (
    <div className="day-schedule">
      {TIME_SLOTS.map((slot) => {
        const Icon = ICONS[slot.icon];
        const items = tasks.filter((task) => task.slot === slot.id);
        return (
          <section
            key={slot.id}
            className={`day-slot ${isToday && currentSlot() === slot.id ? "day-slot--current" : ""}`}
          >
            <div className="day-slot-label">
              <Icon aria-hidden="true" />
              <div>
                <h3>{slot.label}</h3>
                <span>{slot.time}</span>
              </div>
              {isToday && currentSlot() === slot.id && <small>Hiện tại</small>}
            </div>
            <div className="day-slot-body">
              {items.map((task) => (
                <TaskCard key={task.id} task={task} {...actions} />
              ))}
              <button
                className="task-add-inline"
                onClick={() => onAdd(slot.id)}
              >
                <FiPlus />
                {items.length ? "Thêm một việc" : "Dành chỗ cho một việc nhỏ"}
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
