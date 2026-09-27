import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowDown, FiCheck } from "react-icons/fi";
import PlannerPreview from "./PlannerPreview";
import styles from "../../pages/home/Home.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>
          <span className={styles.onlineDot} /> MỘT GÓC NHỎ CHO TÂM TRÍ
        </p>
        <h1 id="hero-title">
          Ý tưởng gọn lại.
          <br />
          Ngày mới
          <br />
          <em>thảnh thơi hơn.</em>
        </h1>
        <p className={styles.heroDescription}>
          Ghi lại điều bạn nghĩ, sắp xếp điều cần làm và dành chỗ cho những điều
          quan trọng. Tất cả trong một không gian của riêng bạn.
        </p>
        <div className={styles.heroActions}>
          <Link to="/create" className={styles.primaryButton}>
            Bắt đầu ghi chép <FiArrowRight />
          </Link>
          <a href="#features" className={styles.textButton}>
            Khám phá MyNote <FiArrowDown />
          </a>
        </div>
        <p className={styles.heroFootnote}>
          <FiCheck /> Nhẹ nhàng để bắt đầu. Đơn giản để duy trì.
        </p>
      </div>
      <PlannerPreview />
    </section>
  );
}
