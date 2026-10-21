# Project: MyNote (React 19 + Vite, plain CSS)

## Commands
- Dev: `yarn dev` · Lint: `yarn lint` · Test: `yarn test` · Build: `yarn build`
- Run lint, test and build before every commit.

## Structure (see README for details)
- `src/features/<domain>/`: state, pure model, components and CSS for one domain (auth, notes, tasks, theme).
- `src/pages/`: thin route components that compose features. `src/app/routes.js` is the single source of route paths.
- `src/components/ui/`: shared primitives. Reuse `IconButton`, `Modal`, `PageHeader`, `SegmentedControl`, `Alert`, `EmptyState` before adding new ones.
- `src/lib/`: helpers without React. `src/hooks/`: shared hooks.

## Guidelines
- Functional components and hooks only. Keep business rules in pure `*Model.js` files with tests in `tests/`.
- Context: `XContext.js` (context + hook) and `XProvider.jsx` (provider) are separate files.
- Styling: plain CSS. Use tokens from `src/styles/tokens.css`; never hard-code colors. Global primitives live in `styles/components.css`; feature CSS lives beside the feature. BEM-style class names.
- Icons: `react-icons/fi` (Feather). Icon-only buttons must use `IconButton` with a `label`.
- UI and code in English. Keep the interface minimal: one title per page, no decorative copy.
- Motion: use tokens + `styles/motion.css` utilities via `<Animate>`, `ENTER`/`EXIT` from `lib/motion.js`, `useExitAnimation`, `useNewItems`. `@keyframes` only in `motion.css`; animate transform/opacity only; respect reduced motion (see README "Motion").
- Every new UI must work at 360px width and in dark mode.
- Backdrop: page look in `styles/backdrop.css` (variants set custom properties only), movement in `motion.css`; choose a variant via `backdrop` in `app/navigation.js`. Content surfaces stay opaque for legibility.
- Layout animation: lists that reorder use `useFlip` (+ `flip-root`, `data-flip-id`); sections below the fold use `<Reveal>`; layout toggles of a single element use `withViewTransition`.
- Every page calls `usePageTitle("…")`. Keep `theme-color` in index.html in sync with `--color-bg` in tokens.css.

## Release and recovery
- Production is CapRover on **Lightsail Malaysia**, `notesweb-my-02-caprover`, app `notesweb-fe`; OrbStack and Dokploy are retired, never a CD fallback.
- Current merged main → ProductFE environment → build/smoke published digest on amd64 + arm64 → private GHCR → CapRover app deploy token → matching public revision + 120-second smoke → latest promotion. Keep ProductFE main-only.
- Preserve same-origin `/api` and `API_UPSTREAM=http://server:8081` (CapRover BE app). No secrets in browser bundles or VITE_*.
- [CD runbook](deploy/CI-CD.md) and [runtime configuration](deploy/CAPROVER.md) describe evidence and recovery. A failed public smoke redeploys the previous `latest` digest; verify its revision before declaring recovery.
- BE has its own ProductBE environment and guarded API/digest health rollback; do not copy BE keys or webhook targets into FE. Keep data/env/networks intact during code rollback; never restore retired OrbStack data over new production writes.
