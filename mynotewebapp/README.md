# MyNote

A calm place for notes, daily tasks, and weekly plans. Built with React 19 and Vite, with an English interface and warm paper, sage, and lavender palettes.

## Development

```sh
npm install
npm run dev
npm run lint
npm test
npm run build
```

The dev server proxies `/api` to `http://localhost:8081` (`vite.config.js`). Account flows require that backend; the frontend does not simulate successful authentication.

## Structure

```text
src/
  app/                     Providers, lazy routes, shared navigation, scroll reset
  components/
    home/                  Landing sections, interactive preview, FAQ
    layout/                Workspace shell and breadcrumb/date bar
    workspace/             PageSurface, PageHeader, dialog, empty state, ambient canvas
    motion/                Reveal: isolated scroll entrance enhancement
    ui/                    Shared decorative connection illustration
    notes/                 Notebook library and writing canvas
    tasks/                 Schedule, cards, filters, editor, weekly board, summary
    auth/                  Shared account form for page and modal
  features/
    notes/                 Pure note model and editor hook
    tasks/                 Pure date/filter/statistics model and view hook
    auth/                  Authentication submission and errors
  context/                 Shared tasks, authentication, theme, motion preferences, auth modal
  hooks/                   Local storage persistence and cross-tab updates
  pages/                   Compose components and feature state for each route
  pages/home/              Landing content data and scoped CSS Module
  styles/
    tokens.css             Shared radius, shadow, and motion timing
    workspace.css          Ordered entry point for workspace styles
    workspace-base.css     Shared controls and layout
    notes.css              Notebook palette and editor layout
    tasks.css              Daily schedule and lavender weekly calendar
    auth.css               Warm account page and form
    ambient.css            Grid, light washes, and page palette variants
    flow.css               Decorative paths and floating icon nodes
    interactions.css       Hover/press feedback
    page-motion.css        One-time workspace and dialog entrances
    responsive.css         Workspace breakpoints and reduced motion
  utils/api/               Existing authentication API integration

tests/                     Node test runner; no extra test dependency
```

Pages compose the interface. Data transformations stay in pure feature models. Shared task state lives in `TasksProvider`, so the daily and weekly views remain consistent. Navigation labels and routes are defined once in `app/navigation.js`.

## Design and motion

The layout takes cues from the reference at https://explee-staging.nudgen.net/: a centered serif hero, faint grid, connected icon nodes, a product preview, bento cards, and guided steps. MyNote keeps its own copy, local-first behavior, warm paper surfaces, and feature colors.

- Use `PageSurface` for a workspace page and its ambient variant. Keep functional controls outside decorative layers.
- Change shared geometry in `tokens.css`; keep feature colors in their feature stylesheet. Home uses a CSS Module.
- Use `Reveal` for independent landing sections. It observes once, animates with the Web Animations API, and cleans up observers and listeners. Content remains available without animation support.
- Workspace backgrounds stay still while writing or planning. Entrances last 280ms without staggered delays; landing reveals last 420ms. Successful saves and task completion get a single 260ms acknowledgement, never on initial render. Text feedback remains available with motion off.
- Workspace entrances use CSS. Hover effects are limited to devices with a fine pointer; press feedback also works on touch.
- Quiet mode is available on Home, workspace navigation, and account pages; its local preference persists between visits. Device reduced-motion preferences always take priority. Both stop decorative loops, entrances, and movement. Focus outlines remain visible. No animation library or scroll listener is required.
- Decorative SVGs and backgrounds are hidden from assistive technology and cannot intercept pointer events.
- Native dialogs isolate the background, focus the first form field, close on Escape, and restore focus to the trigger.
- The home preview is a demonstration; only workspace pages write to storage.

## Data and limits

- `mynote.tasks.v1`: tasks shared by the daily and weekly views.
- `mynote.notes.v1`: current draft and saved notebook pages. Typing saves the draft; **Save to notebook** creates or updates a page. Download `.txt` to keep a copy.
- Notes and tasks live in this browser’s local storage. They do not sync to another device or an account. Signing out does not erase them.
- Success is reported only after a successful storage write. Invalid stored data is not overwritten on startup. Back up unreadable data before editing.
- Deletion supports undo for the most recently deleted item while its page remains open.
- Authentication endpoints remain `/auth/login`, `/auth/register`, and `/auth/oauth/:provider`. A session restoration endpoint has not been added.

## Verification

`npm test` covers date boundaries, English date labels, time slots, filters, priority sorting, statistics, storage validation, and note mutations.

For visual or interaction changes, check Home, Notes, To-dos, Weekly Plan, Sign in, and Sign up at desktop and mobile widths. Verify note save/reload, tasks shared between views, dialog focus/Escape, mobile navigation, dark mode, and reduced motion. Weekly overflow must stay inside the calendar region.

## Motion review rationale

Motion helps users recognize an action and see real progress. It does not guarantee repeat use; validate that with usability sessions and returning-user data. Avoid streak penalties, artificial urgency, repeated celebrations, and moving calls to action. Keep tasks reversible and the next step optional.

References: [NN/g — purpose of animation](https://www.nngroup.com/articles/animation-purpose-ux/), [NN/g — duration](https://www.nngroup.com/articles/animation-duration/), [W3C — Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide).
