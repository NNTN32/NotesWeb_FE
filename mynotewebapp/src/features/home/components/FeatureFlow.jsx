import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import FlowPreview from "./FlowPreview";
import { FLOW_STEPS, FLOW_STEP_MS } from "../flowSteps";
import { useInView } from "../../../hooks/useInView";
import { usePageVisible } from "../../../hooks/usePageVisible";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";
import "../home-flow.css";

const KEY_STEPS = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };

/**
 * "From a thought to a planned week": three tabs + a live preview.
 *
 * Autoplay is driven by the CSS progress bar: when its animation ends, the
 * next step shows. It pauses off screen, in background tabs, on hover/focus,
 * stops for good once the user picks a step, and never runs with reduced motion.
 */
export default function FeatureFlow({ id: anchorId }) {
  const id = useId();
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [engaged, setEngaged] = useState(false);
  const [sectionRef, inView] = useInView({ threshold: 0.4 });
  const pageVisible = usePageVisible();
  const reducedMotion = usePrefersReducedMotion();
  const tabs = useRef([]);

  const count = FLOW_STEPS.length;
  const step = FLOW_STEPS[active];
  const playing = autoplay && !reducedMotion;
  const paused = !inView || !pageVisible || engaged;

  const choose = (index, { focus = false } = {}) => {
    setAutoplay(false);
    setActive(index);
    if (focus) tabs.current[index]?.focus();
  };

  const onKeyDown = (event) => {
    const target =
      event.key in KEY_STEPS
        ? (active + KEY_STEPS[event.key] + count) % count
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? count - 1
            : null;
    if (target === null) return;
    event.preventDefault();
    choose(target, { focus: true });
  };

  return (
    <section
      ref={sectionRef}
      id={anchorId}
      tabIndex={-1}
      className="flow"
      aria-labelledby={`${id}-title`}
      data-paused={paused ? "" : undefined}
      onPointerEnter={() => setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setEngaged(false);
      }}
    >
      <h2 id={`${id}-title`} className="flow__title">
        From a thought to a planned week
      </h2>

      <div className="flow__body">
        <div
          role="tablist"
          aria-label="How MyNote works"
          aria-orientation="vertical"
          className="flow__steps"
          onKeyDown={onKeyDown}
        >
          {FLOW_STEPS.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => (tabs.current[index] = node)}
              type="button"
              role="tab"
              id={`${id}-tab-${item.id}`}
              aria-selected={index === active}
              aria-controls={`${id}-panel`}
              tabIndex={index === active ? 0 : -1}
              className="flow-step"
              data-done={index < active ? "" : undefined}
              onClick={() => choose(index)}
            >
              <span className="flow-step__index">{index + 1}</span>
              <span className="flow-step__copy">
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </span>
              {playing && index === active && (
                <span
                  className="flow-step__progress motion-progress"
                  style={{ "--progress-duration": `${FLOW_STEP_MS}ms` }}
                  onAnimationEnd={() => setActive((index + 1) % count)}
                />
              )}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-tab-${step.id}`}
          className="flow__panel"
        >
          <FlowPreview step={step.id} />
          <p className="flow__panel-text">{step.text}</p>
          <Link to={step.to} className="flow__link">
            {step.action} <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
