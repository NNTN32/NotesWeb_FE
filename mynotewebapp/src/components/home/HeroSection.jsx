import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowDown, FiCheck } from "react-icons/fi";
import PlannerPreview from "./PlannerPreview";
import styles from "../../pages/home/Home.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>
          <span className={styles.onlineDot} /> A LITTLE ROOM FOR YOUR MIND
        </p>
        <h1 id="hero-title">
          Ideas in one place.
          <br />
          A calmer day
          <br />
          <em>starts here.</em>
        </h1>
        <p className={styles.heroDescription}>
          Capture your thoughts, organize your tasks, and make room for what
          matters. All in a space of your own.
        </p>
        <div className={styles.heroActions}>
          <Link to="/create" className={styles.primaryButton}>
            Start writing <FiArrowRight />
          </Link>
          <a href="#features" className={styles.textButton}>
            Explore MyNote <FiArrowDown />
          </a>
        </div>
        <p className={styles.heroFootnote}>
          <FiCheck /> Easy to start. Simple to keep going.
        </p>
      </div>
      <PlannerPreview />
    </section>
  );
}
