import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowDown, FiCheck, FiFeather } from "react-icons/fi";
import PlannerPreview from "./PlannerPreview";
import Reveal from "../motion/Reveal";
import FlowDecoration from "../ui/FlowDecoration";
import styles from "../../pages/home/Home.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Reveal className={styles.heroCopy}>
        <p className={styles.eyebrow}>
          <FiFeather /> A LITTLE ROOM FOR YOUR MIND
        </p>
        <h1 id="hero-title">
          All your thoughts.
          <br />A little more <em>space.</em>
        </h1>
        <p className={styles.heroDescription}>
          Capture an idea. Make a little progress. Find your rhythm.
          <br className={styles.desktopBreak} /> Notes, to-dos, and weekly plans
          — together in a space that feels like you.
        </p>
        <div className={styles.heroActions}>
          <Link to="/create" className={styles.primaryButton}>
            Open your notebook <FiArrowRight />
          </Link>
          <a href="#features" className={styles.textButton}>
            Take a look around <FiArrowDown />
          </a>
        </div>
        <p className={styles.heroFootnote}>
          <FiCheck /> Your pace. Your space. No account needed to begin.
        </p>
        <FlowDecoration />
      </Reveal>
      <Reveal delay={120}>
        <PlannerPreview />
      </Reveal>
    </section>
  );
}
