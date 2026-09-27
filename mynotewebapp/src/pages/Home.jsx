import HomeHeader from "../components/home/HomeHeader";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import WorkflowSection from "../components/home/WorkflowSection";
import HomeClosing from "../components/home/HomeClosing";
import styles from "./home/Home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#home-content">
        Đến nội dung chính
      </a>
      <div className={styles.container}>
        <HomeHeader />
        <main id="home-content">
          <HeroSection />
          <div className={styles.manifesto}>
            <span>GHI LẠI.</span>
            <span>SẮP XẾP.</span>
            <span>THẢNH THƠI.</span>
            <p>Bớt những tab đang mở — trong cả trình duyệt lẫn tâm trí.</p>
          </div>
          <FeaturesSection />
          <WorkflowSection />
        </main>
        <HomeClosing />
      </div>
    </div>
  );
}
