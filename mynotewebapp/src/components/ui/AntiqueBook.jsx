/** Inline vector artwork stays crisp and shares the current page's palette. */
export default function AntiqueBook() {
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
        <path
          d="M31 14c-5-.4-9 3.1-9.8 7.6l2.9 1.4C28.3 21.7 30.8 18.5 31 14Z"
          fill="var(--brand-gold)"
        />
        <path
          d="m29 16-8.2 11m4.6-7.3 2.8-.5m-4.8 3.1.5-2.7"
          stroke="currentColor"
          strokeWidth=".85"
          strokeLinecap="round"
        />
        <path
          d="m24 22-3.2 5"
          stroke="var(--brand-gold)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M19.5 26.5h6m-5 0v1.4l-1.5 1v2.2h7v-2.2l-1.5-1v-1.4"
          stroke="var(--brand-gold)"
          strokeWidth="1.1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
