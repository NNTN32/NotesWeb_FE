import { useState } from "react";
import {
  FiCheck,
  FiMoreHorizontal,
  FiSun,
  FiFeather,
  FiArrowUpRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { PREVIEW_TASKS } from "../../pages/home/homeConstants";
import styles from "../../pages/home/Home.module.css";

export default function PlannerPreview() {
  const [tasks, setTasks] = useState(PREVIEW_TASKS);
  const completed = tasks.filter((task) => task.done).length;
  return (
    <div className={styles.previewScene}>
      <span className={styles.previewAnnotation}>
        A gentler day begins here ↴
      </span>
      <div className={styles.previewPaper}>
        <div className={styles.paperTop}>
          <span>
            <span className={styles.onlineDot} /> MY SPACE
          </span>
          <FiMoreHorizontal aria-hidden="true" />
        </div>
        <div className={styles.paperHeading}>
          <div>
            <p>A NEW PAGE, A FRESH START</p>
            <h2>
              Hello, new day <FiSun aria-hidden="true" />
            </h2>
          </div>
        </div>
        <p className={styles.paperIntro}>Today, I want to make time for…</p>
        <div className={styles.previewNote}>
          <span className={styles.tape} aria-hidden="true" />
          <span className={styles.smallLabel}>
            <FiFeather /> ONE SMALL IDEA
          </span>
          <h3>
            Do less,
            <br />
            but make it count.
          </h3>
          <p>No rush. Start with what matters most.</p>
          <span className={styles.noteSketch} aria-hidden="true">
            ✳
          </span>
        </div>
        <div className={styles.taskHeading}>
          <h3>Today’s priorities</h3>
          <span aria-live="polite">
            {completed}/{tasks.length} complete
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
        <div className={styles.paperBottom}>
          <span>A PREVIEW · TRY CHECKING OFF A TASK</span>
          <Link to="/todo" aria-label="Open your task list">
            <FiArrowUpRight />
          </Link>
        </div>
      </div>
      <div className={styles.floatingNote}>
        <span aria-hidden="true">✦</span>
        <div>
          Slow down a little.
          <br />
          <strong>Make things a little clearer.</strong>
        </div>
      </div>
      <span className={styles.previewCaption}>
        Less clutter. More breathing room.
      </span>
    </div>
  );
}
