import HomeHeader from "../components/home/HomeHeader";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import WorkflowSection from "../components/home/WorkflowSection";
import FaqSection from "../components/home/FaqSection";
import HomeClosing from "../components/home/HomeClosing";
import AmbientBackground from "../components/workspace/AmbientBackground";
import styles from "./home/Home.module.css";

export default function Home() {
  return (
    <div className={`${styles.page} home-ambient-host`}>
      <AmbientBackground variant="home" />
      <a className={styles.skipLink} href="#home-content">
        Skip to main content
      </a>
      <div className={`${styles.container} ambient-content`}>
        <HomeHeader />
        <main id="home-content">
          <HeroSection />
          <div className={styles.manifesto}>
            <span>CAPTURE.</span>
            <span>ORGANIZE.</span>
            <span>BREATHE.</span>
            <p>Fewer open tabs — in your browser and in your mind.</p>
          </div>
          <FeaturesSection />
          <WorkflowSection />
          <FaqSection />
        </main>
        <HomeClosing />
      </div>
    </div>
  );
}
