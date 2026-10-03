import { FiFeather, FiCheckSquare, FiCalendar } from "react-icons/fi";
import { WORKFLOW_STEPS } from "../../pages/home/homeConstants";
import Reveal from "../motion/Reveal";
import styles from "../../pages/home/Home.module.css";
const ICONS = [FiFeather, FiCheckSquare, FiCalendar];
const PROMPTS = [
  "A thought → A note worth keeping",
  "An intention → One small next step",
  "A busy week → Room to breathe",
];
export default function WorkflowSection() {
  return (
    <section
      id="workflow"
      className={styles.workflow}
      aria-labelledby="workflow-title"
    >
      <Reveal className={styles.workflowIntro}>
        <p className={styles.eyebrow}>AT YOUR OWN PACE</p>
        <h2 id="workflow-title">
          From a passing thought
          <br />
          to a <em>calmer day.</em>
        </h2>
        <p>
          No perfect system needed. Just a small habit that feels like yours.
        </p>
      </Reveal>
      <ol className={styles.workflowSteps}>
        {WORKFLOW_STEPS.map((step, index) => {
          const Icon = ICONS[index];
          return (
            <Reveal as="li" key={step.title} delay={index * 60}>
              <div className={styles.stepCopy}>
                <span className={styles.stepNumber}>0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
              <div className={styles.stepVisual}>
                <Icon />
                <span>{PROMPTS[index]}</span>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
