export default function TaskFeedback({ error, deleted, onUndo, feedback }) {
  return (
    <>
      <p className="task-action-feedback" role="status" aria-atomic="true">
        {feedback}
      </p>
      {error && (
        <p role="alert" className="ws-error">
          {error}
        </p>
      )}
      {deleted && (
        <div className="ws-notice" role="status">
          Deleted “{deleted.text}”.
          <button className="ws-text-button" onClick={onUndo}>
            Undo
          </button>
        </div>
      )}
    </>
  );
}
