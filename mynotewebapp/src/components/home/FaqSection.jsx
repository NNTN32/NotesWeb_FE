import { FiPlus } from "react-icons/fi";
import Reveal from "../motion/Reveal";
import styles from "../../pages/home/Home.module.css";
const QUESTIONS = [
  [
    "Do I need an account to get started?",
    "No. You can write notes, create tasks, and plan your week right away. Your workspace is saved in this browser.",
  ],
  [
    "Where are my notes and tasks stored?",
    "They stay in this browser’s local storage. They do not sync to an account or another device yet. Download important notes as .txt files to keep a copy.",
  ],
  [
    "Are my to-dos connected to my weekly plan?",
    "Yes. Both views use the same tasks. Add, edit, or complete a task in either view and you’ll see the change in the other.",
  ],
  [
    "Can I make the space a little quieter?",
    "Turn on Quiet mode to pause animations, or use focus mode in your notebook. MyNote also respects your device’s reduced-motion preference.",
  ],
];
export default function FaqSection() {
  return (
    <Reveal as="section" className={styles.faq} aria-labelledby="faq-title">
      <div>
        <p className={styles.eyebrow}>A FEW THINGS TO KNOW</p>
        <h2 id="faq-title">
          Make yourself
          <br />
          <em>at home.</em>
        </h2>
      </div>
      <div className={styles.faqList}>
        {QUESTIONS.map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <FiPlus aria-hidden="true" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </Reveal>
  );
}
