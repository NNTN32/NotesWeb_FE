import { memo } from "react";

/**
 * AI Chibi mascot - friendly animated character for the Home page.
 * Uses pure CSS/SVG for maintainability. Idle: gentle bob, blink.
 */
function ChibiMascot({ className = "", size = 160 }) {
  return (
    <div
      className={`chibi-mascot-container ${className}`}
      role="img"
      aria-label="Cute AI assistant mascot"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="chibi-mascot-svg"
      >
        {/* Note paper (held by chibi) */}
        <g className="chibi-note">
          <rect
            x="68"
            y="75"
            width="28"
            height="35"
            rx="2"
            fill="#f9f5e7"
            stroke="#a27b5c"
            strokeWidth="1.5"
            className="dark:fill-ink dark:stroke-terracotta/60"
          />
          <line
            x1="72"
            y1="82"
            x2="90"
            y2="82"
            stroke="#a27b5c"
            strokeWidth="1"
            opacity="0.6"
          />
          <line
            x1="72"
            y1="88"
            x2="88"
            y2="88"
            stroke="#a27b5c"
            strokeWidth="1"
            opacity="0.4"
          />
          <line
            x1="72"
            y1="94"
            x2="92"
            y2="94"
            stroke="#a27b5c"
            strokeWidth="1"
            opacity="0.3"
          />
        </g>

        {/* Body - rounded dress/body */}
        <ellipse
          cx="60"
          cy="95"
          rx="32"
          ry="18"
          fill="#c9ada7"
          className="chibi-body dark:opacity-90"
        />
        <path
          d="M30 95 Q60 75 90 95 Q60 115 30 95"
          fill="#c9ada7"
          className="chibi-body dark:opacity-90"
        />

        {/* Arms - one holding note */}
        <path
          d="M48 82 Q62 80 68 78"
          stroke="#e8d5d0"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          className="chibi-arm"
        />
        <path
          d="M72 80 Q85 82 90 90"
          stroke="#e8d5d0"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          className="chibi-arm"
        />

        {/* Head */}
        <circle
          cx="60"
          cy="45"
          r="28"
          fill="#f5e6dc"
          className="chibi-head dark:fill-latte"
        />

        {/* Hair - cute bob cut */}
        <path
          d="M35 50 Q32 35 40 25 Q60 18 80 25 Q88 35 85 50 Q82 65 60 68 Q38 65 35 50"
          fill="#4a3728"
          className="chibi-hair dark:fill-ink"
        />
        <path
          d="M42 28 Q60 22 78 28"
          stroke="#4a3728"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          className="chibi-hair dark:stroke-ink"
        />

        {/* Face - eyes (chibi-eye-pupil gets blink animation) */}
        <g className="chibi-eyes">
          <ellipse className="chibi-eye-pupil" cx="50" cy="44" rx="4" ry="5" fill="#2f2a2a" />
          <ellipse className="chibi-eye-pupil" cx="70" cy="44" rx="4" ry="5" fill="#2f2a2a" />
          <circle cx="51" cy="42" r="1" fill="white" opacity="0.9" />
          <circle cx="71" cy="42" r="1" fill="white" opacity="0.9" />
        </g>

        {/* Blush */}
        <ellipse cx="42" cy="52" rx="4" ry="2" fill="#e8a0a0" opacity="0.6" />
        <ellipse cx="78" cy="52" rx="4" ry="2" fill="#e8a0a0" opacity="0.6" />

        {/* Smile */}
        <path
          d="M52 56 Q60 62 68 56"
          stroke="#6b4f4f"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* Cute bow/ribbon */}
        <g className="chibi-bow">
          <ellipse cx="48" cy="32" rx="6" ry="4" fill="#a27b5c" />
          <ellipse cx="72" cy="32" rx="6" ry="4" fill="#a27b5c" />
          <circle cx="60" cy="32" r="3" fill="#b08d57" />
        </g>

        {/* Sparkle - AI indicator */}
        <g className="chibi-sparkle">
          <path
            d="M95 25 L97 30 L102 32 L97 34 L95 39 L93 34 L88 32 L93 30 Z"
            fill="#b08d57"
            opacity="0.9"
          />
          <path
            d="M25 35 L26 38 L29 39 L26 40 L25 43 L24 40 L21 39 L24 38 Z"
            fill="#b08d57"
            opacity="0.7"
          />
        </g>
      </svg>
    </div>
  );
}

export default memo(ChibiMascot);
