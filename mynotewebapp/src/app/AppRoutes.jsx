import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import WorkspaceLayout from "../components/layout/WorkspaceLayout";

const AuthEntry = lazy(() => import("../pages/auth/AuthEntry"));
const NoteForm = lazy(() => import("../pages/users/NoteForm"));
const Todo = lazy(() => import("../pages/users/Todo"));
const WeeklyPlan = lazy(() => import("../pages/users/WeeklyPlan"));

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          className="min-h-screen grid place-items-center bg-paper text-ink"
        >
          Opening your space…
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/:mode" element={<AuthEntry />} />
        <Route element={<WorkspaceLayout />}>
          <Route path="/create" element={<NoteForm />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/weekly-plan" element={<WeeklyPlan />} />
        </Route>
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route
          path="/register"
          element={<Navigate to="/auth/register" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
