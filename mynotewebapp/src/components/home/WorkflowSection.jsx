import { WORKFLOW_STEPS } from "../../pages/home/homeConstants";
import styles from "../../pages/home/Home.module.css";

export default function WorkflowSection() {
  return (
    <section
      id="workflow"
      className={styles.workflow}
      aria-labelledby="workflow-title"
    >
      <div className={styles.workflowIntro}>
        <p className={styles.eyebrow}>THEO NHỊP CỦA BẠN</p>
        <h2 id="workflow-title">
          Không cần làm tất cả.
          <br />
          <em>Chỉ cần bắt đầu.</em>
        </h2>
        <p>
          Một thói quen nhỏ mỗi ngày có thể tạo nên sự khác biệt. Hãy tìm nhịp
          điệu phù hợp với bạn.
        </p>
        <span className={styles.flower} aria-hidden="true">
          ✳
        </span>
      </div>
      <ol className={styles.workflowSteps}>
        {WORKFLOW_STEPS.map((step, index) => (
          <li key={step.title}>
            <span className={styles.stepNumber}>0{index + 1}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
