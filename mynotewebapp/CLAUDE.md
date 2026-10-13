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
