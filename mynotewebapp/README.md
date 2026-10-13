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
  hooks/                   useLocalStore: validated localStorage + cross-tab sync
  lib/                     Framework-free helpers (httpClient, download)
  pages/                   Thin route components that compose features
  styles/                  tokens → base → components → layout → motion (imported once in main.jsx)
tests/                     node:test, no extra dependencies
```

### Conventions

- **Pages compose, features own.** A page wires feature components together; business rules live in the feature's pure `*Model.js` and are unit-tested.
- **Pure models.** `noteModel.js` and `taskModel.js` have no React or browser APIs, so they are tested directly with `node --test`.
- **Context files.** `XContext.js` holds `createContext` + `useX()`; `XProvider.jsx` holds the provider. This keeps React Fast Refresh happy.
- **Styling.** Every color, size and radius is a token in `styles/tokens.css`; dark mode only redefines colors under `:root.dark`. Global primitives (`.btn`, `.input`, `.icon-btn`, `.modal`…) are in `styles/components.css`. Feature CSS sits next to the feature and is imported by the page or component that needs it. Class names follow `block__element--modifier`.
- **Accessibility.** Icon-only buttons go through `IconButton`, which requires a `label`. Dialogs use the native `<dialog>` (`Modal`). Motion is limited to short transitions and is disabled by `prefers-reduced-motion`.
- **Copy.** One title per page, no decorative eyebrows or quotes. Say "stored in this browser" once per screen at most.

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

## Data

- `mynote.notes.v1`: `{ draft, notes[] }`. The open note is saved on every keystroke; a note emptied of all text is removed. Download a note as `.txt` from the editor.
- `mynote.tasks.v1`: tasks shared by the Day and Week views.
- Data stays in this browser's local storage; it does not sync between devices or accounts and signing out does not erase it. Unreadable stored data is never overwritten on startup.
- Deleting a note or task shows an Undo toast.
- Auth follows [the API contract](docs/API_CONTRACT.md): username login, register then sign in, HttpOnly-cookie refresh, server logout. Access tokens stay in memory.

## Verification

`yarn test` covers auth (async flow, cancellation, session refresh), note editing/removal/restore/search, task dates, week ranges, time slots, filters, statistics, storage validation and file names.

For UI changes, check Home, Notes, Tasks (Day and Week), Sign in and Sign up at 360px and desktop widths, in light and dark mode: no horizontal page scroll, dialog focus and Escape, mobile menu, and undo after delete.
