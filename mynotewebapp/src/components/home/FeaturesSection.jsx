import { Link } from "react-router-dom";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";
import { MODULES } from "../../pages/home/homeConstants";
import Reveal from "../motion/Reveal";
import styles from "../../pages/home/Home.module.css";

function ModuleIllustration({ id }) {
  return (
    <div
      className={`${styles.moduleIllustration} ${styles[`illustration_${id}`]}`}
      aria-hidden="true"
    >
      {id === "notes" ? (
        <>
          <span>A THOUGHT WORTH KEEPING</span>
          <strong>
            Maybe the next big thing
            <br />
            starts with a little note.
          </strong>
          <div className={styles.inkLines}>
            <i />
            <i />
            <i />
          </div>
          <b>✳</b>
        </>
      ) : id === "tasks" ? (
        <>
          {[
            "Start where you are",
            "One thing at a time",
            "Celebrate the small wins",
          ].map((text, i) => (
            <div key={text}>
              <span className={i === 0 ? styles.demoChecked : ""}>
                {i === 0 && <FiCheck />}
              </span>
              {text}
            </div>
          ))}
        </>
      ) : (
        <>
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
            <div key={i}>
              <span>{day}</span>
              <i style={{ height: `${28 + (i % 3) * 22}px` }} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
export default function FeaturesSection() {
  return (
    <section
      id="features"
      className={styles.section}
      aria-labelledby="features-title"
    >
      <Reveal className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>EVERYTHING IN ITS PLACE</p>
          <h2 id="features-title">
            A little less clutter.
            <br />
            <em>A little more clarity.</em>
          </h2>
        </div>
        <p>
          Three simple tools, one thoughtful space.
          <br />
          For the ideas you keep and the days you make.
        </p>
      </Reveal>
      <div className={styles.featureGrid}>
        {MODULES.map(
          (
            {
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
            },
            index,
          ) => {
            const Icon = icon;
            return (
              <Reveal
                as="article"
                key={id}
                delay={index * 70}
                className={`${styles.featureCard} ${styles[tone]}`}
              >
                <div className={styles.featureCopy}>
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
                        <FiCheck />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to={to}>
                    {action}
                    <FiArrowUpRight />
                  </Link>
                </div>
                <ModuleIllustration id={id} />
              </Reveal>
            );
          },
        )}
      </div>
    </section>
  );
}
