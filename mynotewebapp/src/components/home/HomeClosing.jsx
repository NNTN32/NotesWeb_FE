import { Link } from "react-router-dom";
import { FiArrowRight, FiBookOpen } from "react-icons/fi";
import Reveal from "../motion/Reveal";
import styles from "../../pages/home/Home.module.css";

export default function HomeClosing() {
  return (
    <>
      <Reveal
        as="section"
        className={styles.closing}
        aria-labelledby="closing-title"
      >
        <span className={styles.closingStar} aria-hidden="true">
          ✧
        </span>
        <p className={styles.eyebrow}>THE NEXT PAGE IS YOURS</p>
        <h2 id="closing-title">Give your ideas a place to begin.</h2>
        <p>One note today. A clearer tomorrow.</p>
        <Link to="/create" className={styles.primaryButton}>
          Write your first page <FiArrowRight />
        </Link>
      </Reveal>
      <footer className={styles.footer}>
        <Link to="/" className={styles.brand}>
          <FiBookOpen aria-hidden="true" />
          MyNote<span className={styles.brandDot}>.</span>
        </Link>
        <p>A little space, just for you.</p>
        <span>© {new Date().getFullYear()} MyNote</span>
      </footer>
    </>
  );
}
