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
  styles/                  tokens → base → components → layout (imported once in main.jsx)
tests/                     node:test, no extra dependencies
```

### Conventions

- **Pages compose, features own.** A page wires feature components together; business rules live in the feature's pure `*Model.js` and are unit-tested.
- **Pure models.** `noteModel.js` and `taskModel.js` have no React or browser APIs, so they are tested directly with `node --test`.
- **Context files.** `XContext.js` holds `createContext` + `useX()`; `XProvider.jsx` holds the provider. This keeps React Fast Refresh happy.
- **Styling.** Every color, size and radius is a token in `styles/tokens.css`; dark mode only redefines colors under `:root.dark`. Global primitives (`.btn`, `.input`, `.icon-btn`, `.modal`…) are in `styles/components.css`. Feature CSS sits next to the feature and is imported by the page or component that needs it. Class names follow `block__element--modifier`.
- **Accessibility.** Icon-only buttons go through `IconButton`, which requires a `label`. Dialogs use the native `<dialog>` (`Modal`). Motion is limited to short transitions and is disabled by `prefers-reduced-motion`.
- **Copy.** One title per page, no decorative eyebrows or quotes. Say "stored in this browser" once per screen at most.

## Data

- `mynote.notes.v1`: `{ draft, notes[] }`. The open note is saved on every keystroke; a note emptied of all text is removed. Download a note as `.txt` from the editor.
- `mynote.tasks.v1`: tasks shared by the Day and Week views.
- Data stays in this browser's local storage; it does not sync between devices or accounts and signing out does not erase it. Unreadable stored data is never overwritten on startup.
- Deleting a note or task shows an Undo toast.
- Auth follows [the API contract](docs/API_CONTRACT.md): username login, register then sign in, HttpOnly-cookie refresh, server logout. Access tokens stay in memory.

## Verification

`yarn test` covers auth (async flow, cancellation, session refresh), note editing/removal/restore/search, task dates, week ranges, time slots, filters, statistics, storage validation and file names.

For UI changes, check Home, Notes, Tasks (Day and Week), Sign in and Sign up at 360px and desktop widths, in light and dark mode: no horizontal page scroll, dialog focus and Escape, mobile menu, and undo after delete.
