import { useSyncExternalStore } from "react";

const subscribe = (notify) => {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
};
const getSnapshot = () => document.visibilityState === "visible";

/** False while the tab is in the background (used to pause ambient motion). */
export function usePageVisible() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
