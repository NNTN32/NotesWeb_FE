import { cssTransition } from "react-toastify";

/** Toast enter/exit using the shared keyframes in styles/motion.css. */
export const toastTransition = cssTransition({
  enter: "toast-enter",
  exit: "toast-exit",
});
