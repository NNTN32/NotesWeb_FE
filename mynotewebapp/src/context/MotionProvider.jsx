import { useEffect, useSyncExternalStore } from "react";
import { useLocalStore } from "../hooks/useLocalStore";
import { MotionContext } from "./MotionContext";

const validate = (value) => typeof value === "boolean";
const preference = () => window.matchMedia("(prefers-reduced-motion: reduce)");
const subscribe = (notify) => {
  const query = preference();
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const getSnapshot = () => preference().matches;

export default function MotionProvider({ children }) {
  const [quiet, setQuiet] = useLocalStore("mynote.quiet.v1", false, validate);
  const systemReduced = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => true,
  );
  const reduced = quiet || systemReduced;
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "quiet" : "full";
    return () => delete document.documentElement.dataset.motion;
  }, [reduced]);
  return (
    <MotionContext.Provider
      value={{
        quiet,
        reduced,
        systemReduced,
        toggleQuiet: () => setQuiet(!quiet),
      }}
    >
      {children}
    </MotionContext.Provider>
  );
}
