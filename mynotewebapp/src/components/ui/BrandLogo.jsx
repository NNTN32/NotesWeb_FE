import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMotion } from "../../context/MotionContext";
import "../../styles/brand.css";

/** Inline vector artwork stays crisp and shares the current page's palette. */
function AntiqueBook() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
      <g className="brand-book-pages">
        <path
          d="M10 10c5-2 9-1 14 2v28c-5-3-9-4-14-2V10Z"
          fill="var(--brand-paper)"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M24 12c5-3 9-4 14-2v28c-5-2-9-1-14 2V12Z"
          fill="var(--brand-paper)"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M14 17c3 0 5 1 7 2m-7 4c3 0 5 1 7 2m6-6c2-1 4-2 7-2m-7 8c2-1 4-2 7-2"
          stroke="currentColor"
          strokeWidth=".8"
          opacity=".45"
        />
      </g>
      <path
        d="M12 9h21a3 3 0 0 1 3 3v28H13a4 4 0 0 1-4-4V13a4 4 0 0 1 3-4Z"
        fill="var(--brand-paper)"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M13 35h22m-22 3h22"
        stroke="currentColor"
        strokeWidth=".8"
        opacity=".45"
      />
      <g className="brand-book-cover">
        <path
          d="M13 7h20a3 3 0 0 1 3 3v26H13a4 4 0 0 0-4 4V11a4 4 0 0 1 4-4Z"
          fill="currentColor"
        />
        <path
          d="M14 7v29"
          stroke="var(--brand-gold)"
          strokeWidth=".8"
          opacity=".8"
        />
        <path
          d="M17 11h15v21H17V11Z"
          stroke="var(--brand-gold)"
          strokeWidth=".8"
        />
        <path
          d="M10 13h3m-3 5h3m-3 10h3m-3 5h3"
          stroke="var(--brand-gold)"
          strokeWidth="1.2"
        />
        <text
          x="24.5"
          y="27"
          textAnchor="middle"
          fill="var(--brand-gold)"
          fontFamily="Georgia, serif"
          fontSize="18"
        >
          N
        </text>
        <path
          d="m24.5 12 1.5 1.5-1.5 1.5-1.5-1.5 1.5-1.5Z"
          fill="var(--brand-gold)"
        />
      </g>
    </svg>
  );
}

export default function BrandLogo({ className = "", onNavigate }) {
  const [revealed, setRevealed] = useState(false);
  const wordmarkId = useId();
  const root = useRef(null);
  const animations = useRef([]);
  const { quiet, reduced } = useMotion();
  const visible = revealed && !quiet;
  useEffect(() => {
    if (reduced) animations.current.forEach((animation) => animation.cancel());
    return () => animations.current.forEach((animation) => animation.cancel());
  }, [reduced]);

  const toggleBook = () => {
    if (quiet) return;
    const opening = !revealed;
    const wordmark = root.current?.querySelector(".brand-wordmark");
    const interrupted = animations.current.some(
      (animation) => animation.playState === "running",
    );
    const current = interrupted && wordmark ? getComputedStyle(wordmark) : null;
    // Capture the current frame before cancelling so rapid toggles stay fluid.
    const initial = current
      ? {
          clipPath: current.clipPath,
          transform: current.transform,
          opacity: current.opacity,
          visibility: "visible",
        }
      : null;
    setRevealed(opening);
    animations.current.forEach((animation) => animation.cancel());
    if (reduced) return;
    const animate = (selector, frames, options) => {
      const element = root.current?.querySelector(selector);
      if (!element?.animate) return;
      animations.current.push(element.animate(frames, options));
    };
    const easing = "cubic-bezier(.22,.8,.25,1)";
    animations.current = [];
    if (!opening) {
      animate(
        ".brand-wordmark",
        [
          initial || {
            clipPath: "inset(0 0% 0 0 round 0%)",
            transform: "translateX(0) scaleX(1)",
            opacity: 1,
            visibility: "visible",
          },
          {
            clipPath: "inset(0 30% 0 0 round 35%)",
            transform: "translateX(-4px) scaleX(.96)",
            opacity: 0.9,
            visibility: "visible",
            offset: 0.4,
          },
          {
            clipPath: "inset(0 100% 0 0 round 50%)",
            transform: "translateX(-12px) scaleX(.72)",
            opacity: 0,
            visibility: "visible",
          },
        ],
        { duration: 480, easing },
      );
      animate(
        ".brand-book",
        [{ scale: "1" }, { scale: ".94", offset: 0.55 }, { scale: "1" }],
        { duration: 520, easing },
      );
      return;
    }
    animate(
      ".brand-book-cover",
      [
        { transform: "perspective(160px) rotateY(0deg)" },
        { transform: "perspective(160px) rotateY(-125deg)", offset: 0.48 },
        { transform: "perspective(160px) rotateY(-110deg)", offset: 0.68 },
        { transform: "perspective(160px) rotateY(0deg)" },
      ],
      { duration: 900, easing },
    );
    animate(
      ".brand-book-pages",
      [
        { opacity: 0, transform: "scaleX(.7)" },
        { opacity: 1, transform: "scaleX(1.05)", offset: 0.45 },
        { opacity: 1, transform: "scaleX(1)", offset: 0.7 },
        { opacity: 0, transform: "scaleX(.7)" },
      ],
      { duration: 900, easing },
    );
    animate(
      ".brand-wordmark",
      [
        initial || {
          clipPath: "inset(0 100% 0 0 round 50%)",
          transform: "translateX(-5px) scaleX(.94)",
          opacity: 0,
          visibility: "visible",
        },
        {
          clipPath: "inset(0 0% 0 0 round 25%)",
          transform: "translateX(2px) scaleX(1.025)",
          offset: 0.72,
          opacity: 1,
          visibility: "visible",
        },
        {
          clipPath: "inset(0 0% 0 0 round 0%)",
          transform: "translateX(0) scaleX(1)",
          opacity: 1,
          visibility: "visible",
        },
      ],
      { duration: 620, delay: 110, easing, fill: "backwards" },
    );
  };

  return (
    <span
      className={`mynote-brand ${className}`}
      ref={root}
      data-revealed={visible}
    >
      <button
        type="button"
        className="brand-book"
        onClick={toggleBook}
        aria-expanded={visible}
        aria-disabled={quiet}
        aria-controls={wordmarkId}
        aria-label={visible ? "Close the MyNote book" : "Open the MyNote book"}
        title={
          quiet
            ? "MyNote book · Quiet mode"
            : visible
              ? "Close the MyNote book"
              : "Open the MyNote book"
        }
      >
        <AntiqueBook />
      </button>
      <Link
        to="/"
        id={wordmarkId}
        aria-hidden={!visible}
        tabIndex={visible ? undefined : -1}
        className="brand-wordmark"
        aria-label="MyNote — Home"
        onClick={onNavigate}
      >
        MyNote<span className="brand-period">.</span>
      </Link>
    </span>
  );
}
