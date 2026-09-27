import { useEffect, useState } from "react";
import { FiDownload, FiFeather, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import PageHeader from "../../components/workspace/PageHeader";
import NoteLibrary from "../../components/notes/NoteLibrary";
import NoteCanvas from "../../components/notes/NoteCanvas";
import { useNoteEditor } from "../../features/notes/useNoteEditor";

export default function NoteForm() {
  const editor = useNoteEditor();
  const [deleted, setDeleted] = useState(null);
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    if (!focus) return;
    const escape = (event) => {
      if (event.key === "Escape") setFocus(false);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [focus]);
  const save = () => {
    if (!editor.draft.title.trim() || !editor.draft.content.trim()) {
      toast.error("Nhập tiêu đề và một chút nội dung trước khi lưu nhé.");
      return;
    }
    if (editor.save()) toast.success("Đã lưu vào sổ trên trình duyệt này.");
  };
  const beforeSwitch = (action) => {
    if (
      editor.dirty &&
      !window.confirm(
        "Bản nháp đang mở chưa được đưa vào sổ. Chuyển trang sẽ thay thế bản nháp này. Bạn muốn tiếp tục?",
      )
    )
      return;
    action();
  };
  const download = () => {
    const blob = new Blob(
      [`${editor.draft.title}\n\n${editor.draft.content}`],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(editor.draft.title || "ghi-chu").replace(/[^\p{L}\p{N} _-]/gu, "").slice(0, 80)}.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div
      className={`workspace-page notes-page ${focus ? "notes-page--focus" : ""}`}
    >
      <PageHeader
        eyebrow="GHI CHÚ · MỘT KHOẢNG TRỐNG ĐỂ NGHĨ"
        title={
          <>
            Cứ để ý tưởng
            <br />
            <em>tự nhiên thành lời.</em>
          </>
        }
        description="Không cần hoàn hảo. Chỉ cần là những điều bạn muốn giữ lại."
      >
        <button
          className="ws-secondary"
          disabled={!editor.draft.content}
          onClick={download}
        >
          <FiDownload />
          Tải bản .txt
        </button>
      </PageHeader>
      {editor.storageError && (
        <p className="ws-error" role="alert">
          {editor.storageError}
        </p>
      )}
      {deleted && (
        <div className="ws-notice" role="status">
          Đã xóa “{deleted.title}”.
          <button
            className="ws-text-button"
            onClick={() => {
              editor.restore(deleted);
              setDeleted(null);
            }}
          >
            Hoàn tác
          </button>
        </div>
      )}
      {editor.draft.id && (
        <div className="note-actions">
          <button
            className="ws-text-button"
            onClick={() => {
              const note = { ...editor.draft };
              editor.remove(note.id);
              setDeleted(note);
            }}
          >
            <FiTrash2 />
            Xóa trang đang mở
          </button>
        </div>
      )}
      <div className="note-layout">
        {!focus && (
          <NoteLibrary
            notes={editor.notes}
            activeId={editor.draft.id}
            onOpen={(note) => {
              if (note.id !== editor.draft.id)
                beforeSwitch(() => editor.open(note));
            }}
            onNew={() => beforeSwitch(editor.startNew)}
          />
        )}
        <div>
          <NoteCanvas
            draft={editor.draft}
            onChange={editor.change}
            focus={focus}
            onToggleFocus={() => setFocus(!focus)}
            onSave={save}
            error={editor.storageError}
            dirty={editor.dirty}
          />
          <p className="note-bottom-hint">
            <FiFeather />
            Ghi chú và bản nháp lưu trên trình duyệt này. Tải bản .txt để giữ
            một bản sao.
          </p>
        </div>
      </div>
    </div>
  );
}
