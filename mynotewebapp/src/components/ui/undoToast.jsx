import { toast } from "react-toastify";

/** A short confirmation with one action button (e.g. Undo, View). */
export function actionToast(message, actionLabel, onAction) {
  toast(({ closeToast }) => (
    <div className="toast-undo" role="status">
      <span>{message}</span>
      <button
        type="button"
        className="link-btn"
        onClick={() => {
          onAction();
          closeToast();
        }}
      >
        {actionLabel}
      </button>
    </div>
  ));
}

/** Confirmation after a deletion, with Undo. */
export function undoToast(message, onUndo) {
  actionToast(message, "Undo", onUndo);
}
