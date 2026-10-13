import { toast } from "react-toastify";

/** Shows a short confirmation with an Undo action (used after deletions). */
export function undoToast(message, onUndo) {
  toast(({ closeToast }) => (
    <div className="toast-undo" role="status">
      <span>{message}</span>
      <button
        type="button"
        className="link-btn"
        onClick={() => {
          onUndo();
          closeToast();
        }}
      >
        Undo
      </button>
    </div>
  ));
}
