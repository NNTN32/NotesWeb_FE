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
          Đã xóa “{deleted.text}”.
          <button className="ws-text-button" onClick={onUndo}>
            Hoàn tác
          </button>
        </div>
      )}
    </>
  );
}
