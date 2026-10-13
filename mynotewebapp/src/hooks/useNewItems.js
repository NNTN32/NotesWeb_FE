import { useState } from "react";

/**
 * Remembers which ids existed on first render. Items added afterwards are
 * "new", so only they get an enter animation — never the initial list.
 */
export function useNewItems(ids) {
  const [initial] = useState(() => new Set(ids));
  return (id) => !initial.has(id);
}
