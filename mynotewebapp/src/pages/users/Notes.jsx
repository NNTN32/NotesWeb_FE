import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegStickyNote, FaStar, FaSyncAlt, FaTrash, FaPlus, FaSearch, FaClock } from "react-icons/fa";
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
  const [sortBy, setSortBy] = useState("recent");

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

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.lastModified) - new Date(a.lastModified);
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "starred") {
      return b.isStarred - a.isStarred;
    }
    return 0;
  });

  const starredNotes = notes.filter(note => note.isStarred).length;
  const totalNotes = notes.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tất cả ghi chú</h2>
          <p className="text-gray-700">Quản lý và tổ chức ghi chú của bạn</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-terracotta">{totalNotes}</div>
            <div className="text-sm text-gray-500">Tổng ghi chú</div>
          </div>
          <Link
            to="/create"
            className="bg-gradient-to-r from-terracotta to-brass text-white px-4 py-2 rounded-lg hover:opacity-95 flex items-center gap-2 transition-colors"
          >
            <FaPlus />
            Ghi chú mới
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm ghi chú..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-brass focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brass focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === "all" ? "Tất cả danh mục" : category}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brass focus:border-transparent"
          >
            <option value="recent">Gần đây nhất</option>
            <option value="title">Theo tên</option>
            <option value="starred">Đã đánh dấu sao</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-terracotta mb-2">{totalNotes}</div>
          <div className="text-sm text-gray-600">Tổng cộng</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{starredNotes}</div>
          <div className="text-sm text-gray-600">Đã đánh dấu sao</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-olive mb-2">{notes.filter(n => n.category === "Technology").length}</div>
          <div className="text-sm text-gray-600">Công nghệ</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-plum mb-2">{notes.filter(n => n.category === "Learning").length}</div>
          <div className="text-sm text-gray-600">Học tập</div>
        </div>
      </div>

      {/* Notes Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Ghi chú ({filteredNotes.length})
          </h3>
          {searchQuery && (
            <span className="text-sm text-gray-500">
              Kết quả tìm kiếm cho "{searchQuery}"
            </span>
          )}
        </div>
        
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <FaRegStickyNote className="text-8xl text-gray-300 mx-auto mb-6" />
            <div className="text-gray-400 text-2xl mb-3">
              {searchQuery ? "Không tìm thấy ghi chú nào." : "Chưa có ghi chú nào."}
            </div>
            <p className="text-gray-500 text-lg mb-6">
              {searchQuery ? "Thử tìm kiếm với từ khóa khác." : "Bắt đầu tạo ghi chú đầu tiên của bạn!"}
            </p>
            {!searchQuery && (
              <Link 
                to="/create"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-terracotta to-brass text-white rounded-lg hover:opacity-95 transition-colors"
              >
                <FaPlus />
                Tạo ghi chú đầu tiên
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedNotes.map((note, index) => (
              <div 
                key={note.id} 
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-xl font-semibold text-gray-900 truncate">{note.title}</h4>
                      {note.isStarred && <FaStar className="text-yellow-400 flex-shrink-0" />}
                      <span className="text-xs px-2 py-1 bg-sand text-terracotta rounded-full">
                        {note.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{note.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaClock />
                        {note.lastModified}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleStarNote(note.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={note.isStarred ? "Bỏ đánh dấu sao" : "Đánh dấu sao"}
                    >
                      <FaStar className={note.isStarred ? 'text-yellow-400' : 'text-gray-400'} />
                    </button>
                    <Link
                      to={`/note/${note.id}`}
                      className="p-2 hover:bg-sand rounded-lg text-gray-400 hover:text-terracotta transition-colors"
                      title="Xem chi tiết"
                    >
                      <FaSyncAlt />
                    </Link>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
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
    </div>
  );
}

export default function Notes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-paper via-sand to-latte px-8 py-12">
      <NotesList />
    </div>
  );
}
