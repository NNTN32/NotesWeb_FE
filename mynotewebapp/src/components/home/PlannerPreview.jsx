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
        Một ngày nhẹ nhàng bắt đầu từ đây ↴
      </span>
      <div className={styles.previewPaper}>
        <div className={styles.paperTop}>
          <span>
            <span className={styles.onlineDot} /> KHÔNG GIAN CỦA TÔI
          </span>
          <FiMoreHorizontal aria-hidden="true" />
        </div>
        <div className={styles.paperHeading}>
          <div>
            <p>MỘT TRANG MỚI, MỘT KHỞI ĐẦU MỚI</p>
            <h2>
              Chào ngày mới <FiSun aria-hidden="true" />
            </h2>
          </div>
        </div>
        <p className={styles.paperIntro}>
          Hôm nay, mình muốn dành thời gian cho…
        </p>
        <div className={styles.previewNote}>
          <span className={styles.tape} aria-hidden="true" />
          <span className={styles.smallLabel}>
            <FiFeather /> MỘT Ý TƯỞNG NHỎ
          </span>
          <h3>
            Làm ít hơn,
            <br />
            nhưng có ý nghĩa hơn.
          </h3>
          <p>Không cần vội. Cứ bắt đầu với điều quan trọng nhất.</p>
          <span className={styles.noteSketch} aria-hidden="true">
            ✳
          </span>
        </div>
        <div className={styles.taskHeading}>
          <h3>Ưu tiên hôm nay</h3>
          <span aria-live="polite">
            {completed}/{tasks.length} hoàn thành
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
          <span>BẢN XEM TRƯỚC · THỬ ĐÁNH DẤU MỘT VIỆC</span>
          <Link to="/todo" aria-label="Mở danh sách việc của bạn">
            <FiArrowUpRight />
          </Link>
        </div>
      </div>
      <div className={styles.floatingNote}>
        <span aria-hidden="true">✦</span>
        <div>
          Chậm một chút.
          <br />
          <strong>Rõ ràng hơn một chút.</strong>
        </div>
      </div>
      <span className={styles.previewCaption}>
        Ít bộn bề hơn. Nhiều khoảng trống hơn.
      </span>
    </div>
  );
}
