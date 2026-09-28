export default function TaskFeedback({ error, deleted, onUndo }) {
  return (
    <>
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
