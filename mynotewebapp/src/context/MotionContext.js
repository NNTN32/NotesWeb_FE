import { createContext, useContext } from "react";

export const MotionContext = createContext(null);
export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) throw new Error("useMotion must be used within MotionProvider");
  return context;
}
