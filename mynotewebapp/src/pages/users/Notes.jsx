import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegStickyNote, FaStar, FaEdit, FaTrash, FaPlus, FaSearch, FaClock, FaBookmark } from "react-icons/fa";
import { toast } from "react-toastify";

function NotesList() {
  const [notes, setNotes] = useState([
    { id: 1, title: "Ghi chú Web3", content: "Khám phá công nghệ blockchain và ứng dụng Web3.", lastModified: "2 giờ trước", isStarred: true, category: "Technology" },
    { id: 2, title: "Học React", content: "Ôn tập các hook, component, và state management.", lastModified: "1 ngày trước", isStarred: false, category: "Learning" },
    { id: 3, title: "Viết bài blog", content: "Chia sẻ kiến thức về lập trình và công nghệ mới.", lastModified: "3 ngày trước", isStarred: true, category: "Writing" },
    { id: 4, title: "Kế hoạch dự án", content: "Lên kế hoạch chi tiết cho dự án mới sắp tới.", lastModified: "5 ngày trước", isStarred: false, category: "Planning" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [quickNoteTitle, setQuickNoteTitle] = useState("");
  const [quickNoteContent, setQuickNoteContent] = useState("");

  const categories = ["all", "Technology", "Learning", "Writing", "Planning", "Personal"];

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    toast.success("Đã xóa ghi chú!");
  };

  const handleStarNote = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isStarred: !note.isStarred } : note
    ));
  };

  const handleCreateQuickNote = () => {
    if (quickNoteTitle.trim() && quickNoteContent.trim()) {
      const newNote = {
        id: Date.now(),
        title: quickNoteTitle,
        content: quickNoteContent,
        lastModified: "Vừa xong",
        isStarred: false,
        category: "Personal"
      };
      setNotes([newNote, ...notes]);
      setQuickNoteTitle("");
      setQuickNoteContent("");
      setShowQuickNote(false);
      toast.success("Đã tạo ghi chú mới!");
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const starredNotes = notes.filter(note => note.isStarred);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-ink mb-3">Ghi chú của tôi</h1>
        <p className="text-coffee text-lg">Lưu trữ và tổ chức những ý tưởng quan trọng</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={() => setShowQuickNote(!showQuickNote)}
          className="bg-gradient-to-r from-terracotta to-brass text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <FaPlus />
          Ghi chú nhanh
        </button>
        <Link
          to="/create"
          className="bg-white border-2 border-coffee text-coffee px-6 py-3 rounded-full hover:border-terracotta hover:text-terracotta transition-all duration-200 flex items-center gap-2"
        >
          <FaEdit />
          Tạo ghi chú chi tiết
        </Link>
      </div>

      {/* Quick Note Form */}
      {showQuickNote && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-ink">Ghi chú nhanh</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tiêu đề ghi chú..."
              value={quickNoteTitle}
              onChange={(e) => setQuickNoteTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
            />
            <textarea
              placeholder="Nội dung ghi chú..."
              value={quickNoteContent}
              onChange={(e) => setQuickNoteContent(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={handleCreateQuickNote}
                className="bg-terracotta text-white px-6 py-2 rounded-lg hover:bg-brass transition-colors"
              >
                Lưu ghi chú
              </button>
              <button
                onClick={() => setShowQuickNote(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm trong ghi chú..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === "all" ? "Tất cả danh mục" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Display */}
      <div>
        {filteredNotes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <FaRegStickyNote className="text-8xl text-gray-300 mx-auto mb-6" />
            <div className="text-gray-400 text-2xl mb-3">
              {searchQuery ? "Không tìm thấy ghi chú nào" : "Chưa có ghi chú nào"}
            </div>
            <p className="text-gray-500 text-lg mb-6">
              {searchQuery ? "Thử tìm kiếm với từ khóa khác" : "Bắt đầu tạo ghi chú đầu tiên của bạn!"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowQuickNote(true)}
                className="bg-terracotta text-white px-6 py-3 rounded-full hover:bg-brass transition-colors"
              >
                Tạo ghi chú đầu tiên
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <div 
                key={note.id} 
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-ink">{note.title}</h3>
                      {note.isStarred && <FaStar className="text-rose flex-shrink-0" />}
                      <span className="text-xs px-3 py-1 bg-rose/10 text-rose rounded-full font-medium">
                        {note.category}
                      </span>
                    </div>
                    <p className="text-coffee mb-4 leading-relaxed">{note.content}</p>
                    <div className="flex items-center gap-4 text-sm text-coffee/70">
                      <span className="flex items-center gap-2">
                        <FaClock className="text-coffee/50" />
                        {note.lastModified}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleStarNote(note.id)}
                      className="p-2 hover:bg-rose/10 rounded-lg transition-colors"
                      title={note.isStarred ? "Bỏ đánh dấu sao" : "Đánh dấu sao"}
                    >
                      <FaStar className={note.isStarred ? 'text-rose' : 'text-coffee/40'} />
                    </button>
                    <Link
                      to={`/note/${note.id}`}
                      className="p-2 hover:bg-terracotta/10 rounded-lg text-coffee/40 hover:text-terracotta transition-colors"
                      title="Chỉnh sửa ghi chú"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-coffee/40 hover:text-red-600 transition-colors"
                      title="Xóa ghi chú"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          onClick={() => setShowQuickNote(true)}
          className="bg-terracotta text-white w-14 h-14 rounded-full shadow-lg hover:bg-brass transition-colors flex items-center justify-center"
        >
          <FaPlus className="text-xl" />
        </button>
      </div>
    </div>
  );
}

export default function Notes() {
  return (
    <div className="min-h-screen notes-bg px-4 py-8">
      <div className="patterncraft-content">
        <NotesList />
      </div>
    </div>
  );
}
