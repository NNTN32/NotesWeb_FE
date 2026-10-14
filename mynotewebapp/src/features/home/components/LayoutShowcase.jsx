import { useEffect, useId, useRef, useState } from "react";
import Animate from "../../../components/ui/Animate";
import SegmentedControl from "../../../components/ui/SegmentedControl";
import { useFlip } from "../../../hooks/useFlip";
import { useInView } from "../../../hooks/useInView";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";
import "../home-sections.css";
import { SHOWCASE_HINT_MS, SHOWCASE_TASKS, WEEKDAYS } from "../homeContent";

const VIEWS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
];

/**
 * "Day or week, same tasks": the same chips re-flow between a list and a
 * 7-day grid using FLIP (useFlip). On first view it switches once by itself
 * as a hint; any click hands control to the user.
 */
export default function LayoutShowcase() {
  const id = useId();
  const [view, setView] = useState("day");
  const touched = useRef(false);
  const flipRef = useFlip();
  const [sectionRef, inView] = useInView({ threshold: 0.5, once: true });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!inView || reducedMotion || touched.current) return;
    const timer = setTimeout(() => setView("week"), SHOWCASE_HINT_MS);
    return () => clearTimeout(timer);
  }, [inView, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="showcase"
      aria-labelledby={`${id}-title`}
    >
      <div className="showcase__copy">
        <h2 id={`${id}-title`}>Day or week, same tasks</h2>
        <p>
          Switch views and every task glides to its place. Nothing is copied:
          Today and the week share one list.
        </p>
        <SegmentedControl
          label="Preview view"
          options={VIEWS}
          value={view}
          onChange={(next) => {
            touched.current = true;
            setView(next);
          }}
        />
      </div>

      <div
        ref={flipRef}
        className={`showcase__board showcase__board--${view} flip-root`}
        aria-hidden="true"
      >
        {view === "week" &&
          WEEKDAYS.map((day, index) => (
            <Animate
              as="span"
              key={day}
              name="fade"
              index={index}
              className="showcase__day"
              style={{ "--col": index + 1 }}
            >
              {day}
            </Animate>
          ))}
        {view === "day" && <span className="showcase__heading">Today</span>}
        {SHOWCASE_TASKS.map((task) => (
          <span
            key={task.id}
            data-flip-id={task.id}
            className="showcase__chip"
            style={{ "--col": task.day + 1 }}
          >
            <i />
            {task.text}
          </span>
        ))}
      </div>
    </section>
  );
}
