/** Route paths in one place so links and redirects never drift apart. */
export const ROUTES = {
  home: "/",
  notes: "/notes",
  tasks: "/tasks",
  auth: (mode) => `/auth/${mode}`,
};
