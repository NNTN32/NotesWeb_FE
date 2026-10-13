import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import IconButton from "./IconButton";
import { useExitAnimation } from "../../hooks/useExitAnimation";

/**
 * Native <dialog>: traps focus, closes on Escape/backdrop, restores focus.
 * Enter/exit animations live in styles/motion.css (.modal[open], [data-exiting]).
 *
 * `children` may be a function receiving `close`, so forms can close the
 * dialog with its exit animation after a successful submit.
 */
export default function Modal({ children, titleId, onClose, className = "" }) {
  const { ref, exit, exitProps } = useExitAnimation();
  const close = () => exit(onClose);

  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    dialog
      .querySelector(
        "input:not([disabled]), textarea:not([disabled]), select:not([disabled])",
      )
      ?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement && previous.isConnected)
        previous.focus();
    };
  }, [ref]);

  return createPortal(
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-labelledby={titleId}
      {...exitProps}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const outside =
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom;
        if (outside) close();
      }}
    >
      <IconButton
        label="Close dialog"
        icon={FiX}
        className="modal__close"
        onClick={close}
      />
      {typeof children === "function" ? children(close) : children}
    </dialog>,
    document.body,
  );
}
