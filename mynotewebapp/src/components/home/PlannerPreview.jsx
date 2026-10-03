import { useState } from "react";
import {
  FiCheck,
  FiBookOpen,
  FiFeather,
  FiArrowUpRight,
  FiCalendar,
  FiCheckSquare,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { PREVIEW_TASKS } from "../../pages/home/homeConstants";
import styles from "../../pages/home/Home.module.css";

export default function PlannerPreview() {
  const [tasks, setTasks] = useState(PREVIEW_TASKS);
  const completed = tasks.filter((task) => task.done).length;
  return (
    <div className={styles.previewScene}>
      <div className={styles.previewPaper}>
        <div className={styles.paperTop}>
          <span className={styles.windowDots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            <FiBookOpen /> mynote / your little corner
          </span>
          <span className={styles.previewStatus}>
            <span className={styles.onlineDot} /> All yours
          </span>
        </div>
        <div className={styles.previewColumns}>
          <div className={styles.previewColumn}>
            <span className={styles.smallLabel}>
              <FiFeather /> CAPTURE A THOUGHT
            </span>
            <div className={styles.previewNote}>
              <span className={styles.tape} aria-hidden="true" />
              <p>A NOTE TO SELF</p>
              <h3>
                Do less.
                <br />
                <em>Make it count.</em>
              </h3>
              <p>
                You don’t have to have it all figured out. Start with what
                matters.
              </p>
              <span className={styles.noteSketch} aria-hidden="true">
                ✳
              </span>
            </div>
            <Link to="/create" className={styles.previewLink}>
              Room for a new idea <FiArrowUpRight />
            </Link>
          </div>
          <div className={styles.previewColumn}>
            <span className={styles.smallLabel}>
              <FiCheckSquare /> TAKE A SMALL STEP
            </span>
            <div className={styles.taskHeading}>
              <h3>Today’s intentions</h3>
              <span aria-live="polite">
                {completed}/{tasks.length}
              </span>
            </div>
            <div className={styles.previewTasks}>
              {tasks.map((task) => (
                <label
                  key={task.id}
                  className={`${styles.previewTask} ${task.done ? styles.taskDone : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() =>
                      setTasks((current) =>
                        current.map((item) =>
                          item.id === task.id
                            ? { ...item, done: !item.done }
                            : item,
                        ),
                      )
                    }
                  />
                  <span className={styles.checkbox} aria-hidden="true">
                    {task.done && <FiCheck />}
                  </span>
                  <span>{task.label}</span>
                </label>
              ))}
            </div>
            <div className={styles.previewProgress} aria-hidden="true">
              <span style={{ width: `${(completed / tasks.length) * 100}%` }} />
            </div>
            <p className={styles.previewHint}>
              Try checking off a task. Small wins count.
            </p>
            <Link to="/todo" className={styles.previewLink}>
              Find your focus <FiArrowUpRight />
            </Link>
          </div>
          <div className={styles.previewColumn}>
            <span className={styles.smallLabel}>
              <FiCalendar /> SEE THE BIGGER PICTURE
            </span>
            <h3 className={styles.weekTitle}>A week with breathing room.</h3>
            <div
              className={styles.miniWeek}
              aria-label="Illustrative weekly plan"
            >
              {[
                ["M", "Deep work"],
                ["T", "A fresh idea"],
                ["W", "Make space"],
                ["T", "Catch up"],
                ["F", "Slow down"],
              ].map(([day, label], i) => (
                <div key={i}>
                  <span>{day}</span>
                  <span
                    className={styles.miniWeekBar}
                    style={{ "--bar-width": `${88 - i * 10}%` }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/weekly-plan" className={styles.previewLink}>
              Make room for your week <FiArrowUpRight />
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.floatingNote}>
        <span>
          <FiCheck />
        </span>
        <div>
          <strong>A little progress, every day.</strong>
          <small>That’s more than enough.</small>
        </div>
      </div>
    </div>
  );
}
