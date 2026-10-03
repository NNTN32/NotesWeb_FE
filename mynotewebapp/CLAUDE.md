# Project: MyNoteWebApp (React + Vite + Tailwind)

## Build & Development Commands
- Dev server: `npm run dev` or `yarn dev`
- Build project: `npm run build`
- Linting: `npm run lint`

## Code Style & Guidelines
- **Framework**: React (Functional Components).
- **Styling**: Shared design tokens in `src/styles/tokens.css`; feature styles in `src/styles`; Home uses a CSS Module. Reuse existing styles before adding utilities.
- **Icons**: Use Lucide React or React Icons (if available).
- **Language**: 
    - Code (variables, functions): English.
    - Comments and UI: English.
- **Project Structure**: 
    - New components are placed in `src/components`.
    - New pages are placed in `src/pages`.

## Specific Logic
- Always use `useState` and `useEffect` according to React 18+ standards.
- When creating a new UI, ensure it's responsive for both mobile and desktop.