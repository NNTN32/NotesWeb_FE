import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AppShell from "../components/layout/AppShell";
import PageLoader from "../components/ui/PageLoader";
import { ROUTES } from "./routes";

const AuthPage = lazy(() => import("../pages/AuthPage"));
const NotesPage = lazy(() => import("../pages/NotesPage"));
const TasksPage = lazy(() => import("../pages/TasksPage"));

/** Old URLs stay valid so bookmarks keep working after the redesign. */
const LEGACY_REDIRECTS = [
  ["/create", ROUTES.notes],
  ["/todo", `${ROUTES.tasks}?view=day`],
  ["/weekly-plan", `${ROUTES.tasks}?view=week`],
  ["/login", ROUTES.auth("login")],
  ["/register", ROUTES.auth("register")],
];

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path="/auth/:mode" element={<AuthPage />} />
        <Route element={<AppShell />}>
          <Route path={ROUTES.notes} element={<NotesPage />} />
          <Route path={ROUTES.tasks} element={<TasksPage />} />
        </Route>
        {LEGACY_REDIRECTS.map(([from, to]) => (
          <Route
            key={from}
            path={from}
            element={<Navigate to={to} replace />}
          />
        ))}
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </Suspense>
  );
}
