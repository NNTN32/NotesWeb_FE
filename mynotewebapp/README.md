# MyNote

Notes, daily tasks and a weekly plan in one quiet place. React 19 + Vite, plain CSS with design tokens, no UI framework.

## Development

```sh
yarn install
yarn dev        # http://localhost:5173, proxies /api to http://localhost:8081
yarn lint
yarn test
yarn build
```

Set `API_PROXY_TARGET` to point the dev proxy at another backend. Account flows need that backend; the frontend never fakes a successful sign-in.

## Production deployment

See [Dokploy configuration and operating checks](deploy/DOKPLOY.md). The Dockerfile builds with the Yarn lockfile and serves the bundle through Nginx. Production follows `main`.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/auth/login`, `/auth/register` | Account |
| `/notes` | Notes (list + editor) |
| `/tasks?view=day\|week&date=YYYY-MM-DD` | Tasks; view and date live in the URL |

Old paths (`/create`, `/todo`, `/weekly-plan`, `/login`, `/register`) redirect to the new ones. All paths are defined in `app/routes.js`.

## Structure

```text
src/
  main.jsx                 Entry: global CSS + <App />
  app/                     App, providers, routes, navigation
  components/
    layout/                AppShell (sidebar + outlet), Sidebar
    ui/                    Reusable primitives: IconButton, Modal, PageHeader,
                           SegmentedControl, ThemeToggle, Alert, EmptyState, Logo, undoToast
  features/                One folder per domain; owns its state, logic, UI and CSS
    auth/                  API client, session, providers, AuthForm/AuthModal
    notes/                 noteModel (pure), useNotes, NoteList, NoteEditor, notes.css
    tasks/                 taskModel (pure), TasksProvider, useTaskActions, Day/Week views, tasks.css
    theme/                 ThemeProvider (light/dark)
    home/                  FeatureFlow story (steps data, tabs, preview)
  hooks/                   useLocalStore: validated localStorage + cross-tab sync
  lib/                     Framework-free helpers (httpClient, download)
  pages/                   Thin route components that compose features
  styles/                  tokens → base → components → layout → backdrop → motion (imported once in main.jsx)
tests/                     node:test, no extra dependencies
```

### Conventions

- **Pages compose, features own.** A page wires feature components together; business rules live in the feature's pure `*Model.js` and are unit-tested.
- **Pure models.** `noteModel.js` and `taskModel.js` have no React or browser APIs, so they are tested directly with `node --test`.
- **Context files.** `XContext.js` holds `createContext` + `useX()`; `XProvider.jsx` holds the provider. This keeps React Fast Refresh happy.
- **Styling.** Every color, size and radius is a token in `styles/tokens.css`; dark mode only redefines colors under `:root.dark`. Global primitives (`.btn`, `.input`, `.icon-btn`, `.modal`…) are in `styles/components.css`. Feature CSS sits next to the feature and is imported by the page or component that needs it. Class names follow `block__element--modifier`.
- **Accessibility.** Icon-only buttons go through `IconButton`, which requires a `label`. Dialogs use the native `<dialog>` (`Modal`). Motion is limited to short transitions and is disabled by `prefers-reduced-motion`.
- **Copy.** One title per page, no decorative eyebrows or quotes. Say "stored in this browser" once per screen at most.

## Home: "From a thought to a planned week"

Home tells one story with the three connected features: **Notes → Today → Week**.

- `features/home/flowSteps.js`: copy, links and timing for the three steps (edit content here only).
- `features/home/components/FeatureFlow.jsx`: ARIA tabs (arrow keys, Home/End) + panel. Autoplay is driven by the CSS progress bar (`.motion-progress`): when it ends, the next step shows. It pauses off screen (`useInView`), in background tabs (`usePageVisible`), on hover/focus, stops for good once the user picks a step, and never runs with reduced motion (`usePrefersReducedMotion`).
- `features/home/components/FlowPreview.jsx`: decorative mini app (`aria-hidden`) where the same example task is highlighted in a note, drops into Today and lands in the week.
- `features/home/home-flow.css`: layout and look; motion comes from `motion.css` utilities (`highlight`, `pop`, `drop`, `progress`).
- `features/home/components/LayoutShowcase.jsx`: "Day or week, same tasks" — the same chips re-flow between a list and a 7-day grid with `useFlip`; switches once by itself on first view, then the user is in control.
- `features/home/components/Shortcuts.jsx`: the real keyboard shortcuts; keycaps press once when revealed. Copy and demo data live in `features/home/homeContent.js`.

The story is real: in Notes, **Add as task** (or Ctrl/⌘ + Enter) turns the selected text, or the line under the caret, into a task for today (`taskTextAt` in `noteModel.js` strips list markers). The page wires Notes to Tasks; neither feature imports the other.

## Motion

Motion confirms what just happened and where things went; it never decorates. Everything is CSS-driven except exit timing.

| Where | Effect |
| --- | --- |
| Route change | page rises in (`AppShell` keys `<Animate>` by path) |
| Day ↔ Week, ‹ › | content slides in from the navigation side, week columns stagger |
| Add task / note | only the new item rises in (`useNewItems`), never the initial list |
| Complete task | round checkbox fills with a springy tick, strike-through draws left→right |
| Delete task | row slides out, then is removed (`useExitAnimation`); Undo toast slides up |
| Dialogs | scale + fade in, faster ease-in out, backdrop fades |
| Segmented control | thumb slides to the active option |
| Theme | View Transitions cross-fade, icon turns in |
| Buttons | press scale 0.97; hover colors ease |
| Loading | skeleton appears only after 200ms |

**Where things live**

- `styles/tokens.css`: durations (`--duration-instant/fast/base/slow`), easings (`--ease-out/in/spring`), distances (`--motion-distance`, `--motion-scale`, `--motion-rotate`).
- `styles/motion.css`: the only file with `@keyframes`; enter (`motion-*`) and exit (`motion-exit-*`) utilities, dialog, toast and press feedback.
- `lib/motion.js`: `ENTER` / `EXIT` class maps, `staggerStyle()`, `withViewTransition()`, `prefersReducedMotion()`.
- `components/ui/Animate.jsx`: `<Animate name="rise" index={i}>`; change its `key` to replay.
- `hooks/useExitAnimation.js`: play an exit, then run a callback (always finishes via animationend, a fallback timeout, or immediately).
- `hooks/useNewItems.js`: animate only items added after mount.

**Rules**

- Animate `transform` and `opacity` only. Enter 160–300ms ease-out; exit shorter, ease-in. Stagger ≤ 6 items × 50ms.
- State changes use `transition`; mount/unmount uses the utilities. Never add `@keyframes` outside `motion.css`.
- Never remount an input while the user types (e.g. Notes keys the editor by an open counter, not by note id).
- `prefers-reduced-motion` sets distances/scales to zero and shortens durations, so everything becomes a short fade; the skeleton shimmer stops.

### Layout animation

- **FLIP lists** (`hooks/useFlip.js`): give a container `ref={useFlip()}` + class `flip-root`, and each item `data-flip-id`. After any render that moves items, they glide from their old position (individual `translate`, so it never fights enter/exit `transform` animations). Used by the day view (completed tasks sink to the bottom, siblings close the gap after a delete), the week board and the note list (an edited note rises to the top). Duration/easing are read from the CSS tokens via `motionDuration()` / `motionToken()`.
- **Shared-element morph**: Notes focus mode toggles inside `withViewTransition()` (which `flushSync`s the React update) and the editor has `view-transition-name: note-editor`.
- **Scroll reveal** (`components/ui/Reveal.jsx`): sections rise in once when first seen (`useInView({ once: true })`); children can key off `[data-revealed]` (e.g. the keycap press on Home).
- All of it is skipped under `prefers-reduced-motion`.

### Ambient backdrop

Every page sits on a "paper and ink" backdrop: slow-drifting ink washes, a stationery pattern and static paper grain. Each page has its own character.

| Variant | Palette | Pattern | Motion |
| --- | --- | --- | --- |
| `home` | sage, amber, lavender | dot grid | 48s drift |
| `auth` | sage, amber | dots around the form | 48s drift |
| `notes` | warm amber | ruled lines (notebook) | 2× slower, faint |
| `tasks` | sage, sky | planner dot grid | 48s drift |

- `components/layout/Backdrop.jsx` renders the layers (`aria-hidden`, no pointer events, fixed behind content). `AppShell` picks the variant from `backdrop` in `app/navigation.js`; Home and Auth pass theirs directly.
- `styles/backdrop.css` defines the look: a variant only sets custom properties (`--blob-1..3`, `--backdrop-intensity`, `--pattern-*`). Tints live in `tokens.css` with dark-mode values.
- `styles/motion.css` ("Ambient") defines the movement: transform-only, 48–96s alternating loops; the palette eases between pages via `@property`.
- It pauses when the tab is hidden (`usePageVisible`), while any text field has focus, and entirely under `prefers-reduced-motion`.
- To add a page: add a `.backdrop--<name>` block and set `backdrop: "<name>"` on its navigation entry.

## Data

- `mynote.notes.v1`: `{ draft, notes[] }`. The open note is saved on every keystroke; a note emptied of all text is removed. Download a note as `.txt` from the editor.
- `mynote.tasks.v1`: tasks shared by the Day and Week views.
- Data stays in this browser's local storage; it does not sync between devices or accounts and signing out does not erase it. Unreadable stored data is never overwritten on startup.
- Deleting a note or task shows an Undo toast.
- Auth follows [the API contract](docs/API_CONTRACT.md): username login, register then sign in, HttpOnly-cookie refresh, server logout. Access tokens stay in memory.

## Verification

`yarn test` covers auth (async flow, cancellation, session refresh), note editing/removal/restore/search, task dates, week ranges, time slots, filters, statistics, storage validation and file names.

For UI changes, check Home, Notes, Tasks (Day and Week), Sign in and Sign up at 360px and desktop widths, in light and dark mode: no horizontal page scroll, dialog focus and Escape, mobile menu, and undo after delete.
