import { Link } from "react-router-dom";
import { FiArrowRight, FiBookOpen } from "react-icons/fi";
import styles from "../../pages/home/Home.module.css";

export default function HomeClosing() {
  return (
    <>
      <section className={styles.closing} aria-labelledby="closing-title">
        <span className={styles.closingStar} aria-hidden="true">
          ✧
        </span>
        <p className={styles.eyebrow}>TRANG GIẤY TIẾP THEO LÀ CỦA BẠN</p>
        <h2 id="closing-title">Cho ý tưởng một nơi để bắt đầu.</h2>
        <p>Một ghi chú hôm nay. Một ngày rõ ràng hơn ngày mai.</p>
        <Link to="/create" className={styles.primaryButton}>
          Viết trang đầu tiên <FiArrowRight />
        </Link>
      </section>
      <footer className={styles.footer}>
        <Link to="/" className={styles.brand}>
          <FiBookOpen aria-hidden="true" />
          MyNote<span className={styles.brandDot}>.</span>
        </Link>
        <p>Một không gian nhỏ. Dành riêng cho bạn.</p>
        <span>© {new Date().getFullYear()} MyNote</span>
      </footer>
    </>
  );
}
