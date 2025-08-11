import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function NoteForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    toast.success("Đã lưu ghi chú!");
    navigate("/");
  };

  return (
    <section className="max-w-xl mx-auto py-10 px-2">
      <Link to="/" className="flex items-center gap-2 text-blue-600 hover:underline mb-6 text-sm">
        <FaArrowLeft /> Quay lại
      </Link>
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-md p-6 shadow-sm flex flex-col gap-4">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Tạo/Sửa ghi chú</h1>
        <input
          type="text"
          placeholder="Tiêu đề"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Nội dung ghi chú"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[120px] text-gray-900"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium self-end">
          <FaSave /> Lưu ghi chú
        </button>
      </form>
    </section>
  );
} 