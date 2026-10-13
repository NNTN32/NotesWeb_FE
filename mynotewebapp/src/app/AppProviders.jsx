import { BrowserRouter } from "react-router-dom";
import RouteScrollReset from "./RouteScrollReset";
import { ThemeProvider } from "../features/theme/ThemeProvider";
import { AuthProvider } from "../features/auth/AuthProvider";
import { AuthModalProvider } from "../features/auth/AuthModalProvider";
import TasksProvider from "../features/tasks/TasksProvider";

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <RouteScrollReset />
          <AuthModalProvider>
            <TasksProvider>{children}</TasksProvider>
          </AuthModalProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
