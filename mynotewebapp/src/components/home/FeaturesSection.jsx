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
          <p className={styles.eyebrow}>EVERYTHING IN ITS PLACE</p>
          <h2 id="features-title">
            Three simple tools.
            <br />
            <em>A more organized day.</em>
          </h2>
        </div>
        <p>
          From your first idea to a full week of plans.
          <br />
          MyNote helps you take it one step at a time.
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
