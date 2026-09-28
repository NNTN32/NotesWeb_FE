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
        <p className={styles.eyebrow}>AT YOUR OWN PACE</p>
        <h2 id="workflow-title">
          You don’t have to do it all.
          <br />
          <em>Just begin.</em>
        </h2>
        <p>
          A small daily habit can make a difference. Find the rhythm that feels
          right for you.
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
