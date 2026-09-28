import { useCallback, useEffect, useRef, useState } from "react";

// Only write data after a user change; do not overwrite invalid data on startup.
export function useLocalStore(key, initialValue, validate) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return { value: initialValue, error: "" };
      const value = JSON.parse(raw);
      if (!validate(value)) throw new Error("Invalid local data");
      return { value, error: "" };
    } catch {
      return {
        value: initialValue,
        error:
          "Saved data could not be read. It has not been overwritten; back it up before editing.",
      };
    }
  });
  const current = useRef(state.value);
  const update = useCallback(
    (valueOrUpdater) => {
      const value =
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(current.current)
          : valueOrUpdater;
      let error = "";
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        error =
          "This browser cannot save your changes. They are only in memory; copy your content before leaving.";
      }
      current.current = value;
      setState({ value, error });
      return !error;
    },
    [key],
  );

  useEffect(() => {
    const sync = (event) => {
      if (event.key !== key || event.newValue === null) return;
      try {
        const value = JSON.parse(event.newValue);
        if (!validate(value)) return;
        current.current = value;
        setState({ value, error: "" });
      } catch {
        /* Ignore invalid data from another tab. */
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [key, validate]);

  return [state.value, update, state.error];
}
