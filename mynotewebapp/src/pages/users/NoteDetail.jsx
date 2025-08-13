import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const sampleNotes = [
  { id: 1, title: "Ghi chú Web3", content: "Khám phá công nghệ blockchain và ứng dụng Web3." },
  { id: 2, title: "Học React", content: "Ôn tập các hook, component, và state management." },
  { id: 3, title: "Viết bài blog", content: "Chia sẻ kiến thức về lập trình và công nghệ mới." },
];

export default function NoteDetail() {
  const { id } = useParams();
  const note = sampleNotes.find(n => n.id === Number(id));

  if (!note) return <div className="text-center text-gray-400 mt-10">Không tìm thấy ghi chú.</div>;

  return (
    <section className="max-w-xl mx-auto py-10 px-2">
      <Link to="/" className="flex items-center gap-2 text-blue-600 hover:underline mb-6 text-sm">
        <FaArrowLeft /> Quay lại
      </Link>
      <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{note.title}</h1>
        <p className="text-gray-800 text-base">{note.content}</p>
      </div>
    </section>
  );
} 