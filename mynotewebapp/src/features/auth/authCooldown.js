const deadlines = { login: 0, register: 0 };
const listeners = new Set();
export const getAuthDeadline = (mode) => deadlines[mode];
export const subscribeAuthDeadline = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export function setAuthDeadline(mode, deadline) {
  deadlines[mode] = deadline ? Math.max(deadlines[mode], deadline) : 0;
  listeners.forEach((listener) => listener());
}
