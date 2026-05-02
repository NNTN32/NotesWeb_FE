/**
 * Stagger timings for auth forms (paired with `.auth-form-*` in `src/index.css`).
 * Heading/subtitle in CSS use fixed +45ms / +95ms; change those literals if you change `titleMs` / `subtitleMs`.
 */

export const AUTH_FORM_REVEAL = {
  /** Title block (sync: index.css `.auth-form-reveal-heading` delta) */
  titleMs: 45,
  /** Subtitle (sync: index.css `.auth-form-reveal-subtitle` delta) */
  subtitleMs: 95,
  /** First field baseline */
  fieldStartMs: 150,
  /** Extra delay per subsequent field */
  fieldStepMs: 68,
  /** After last field, before submit */
  submitLagMs: 52,
  /** After submit, footer link block */
  footerLagMs: 85,
};

/**
 * @param {number} index zero-based field index
 * @returns {number} milliseconds for `animation-delay` / `--auth-reveal-delay`
 */
export function authFieldRevealDelayMs(index) {
  return AUTH_FORM_REVEAL.fieldStartMs + index * AUTH_FORM_REVEAL.fieldStepMs;
}

/**
 * @param {number} fieldCount
 * @returns {number} milliseconds delay for submit button reveal
 */
export function authSubmitRevealDelayMs(fieldCount) {
  return (
    AUTH_FORM_REVEAL.fieldStartMs +
    fieldCount * AUTH_FORM_REVEAL.fieldStepMs +
    AUTH_FORM_REVEAL.submitLagMs
  );
}

/**
 * @param {number} fieldCount
 */
export function authFooterRevealDelayMs(fieldCount) {
  return authSubmitRevealDelayMs(fieldCount) + AUTH_FORM_REVEAL.footerLagMs;
}
