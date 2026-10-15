import { useEffect } from "react";

const APP_NAME = "MyNote";

/** Sets the browser tab title for a page ("Notes · MyNote"); restores it on unmount. */
export function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
