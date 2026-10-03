import { useEffect, useId, useRef, useState } from "react";
import AntiqueBook from "./AntiqueBook";
import { Link } from "react-router-dom";
import { useMotion } from "../../context/MotionContext";
import "../../styles/brand.css";

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
