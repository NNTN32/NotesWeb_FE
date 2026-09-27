import { Link } from "react-router-dom";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";
import { MODULES } from "../../pages/home/homeConstants";
import styles from "../../pages/home/Home.module.css";

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className={styles.section}
      aria-labelledby="features-title"
    >
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>MỌI THỨ Ở ĐÚNG CHỖ</p>
          <h2 id="features-title">
            Ba công cụ nhỏ.
            <br />
            <em>Một ngày ngăn nắp hơn.</em>
          </h2>
        </div>
        <p>
          Từ ý tưởng đầu tiên đến kế hoạch cả tuần.
          <br />
          MyNote cùng bạn đi từng bước.
        </p>
      </div>
      <div className={styles.featureGrid}>
        {MODULES.map(
          ({
            id,
            number,
            label,
            icon,
            title,
            description,
            to,
            action,
            tone,
            items,
          }) => {
            const Icon = icon;
            return (
              <article
                key={id}
                className={`${styles.featureCard} ${styles[tone]}`}
              >
                <div className={styles.featureTop}>
                  <span className={styles.featureIcon}>
                    <Icon />
                  </span>
                  <span>
                    {number} / {label}
                  </span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <ul>
                  {items.map((item) => (
                    <li key={item}>
                      <FiCheck aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to={to}>
                  {action}
                  <FiArrowUpRight />
                </Link>
              </article>
            );
          },
        )}
      </div>
    </section>
  );
}
