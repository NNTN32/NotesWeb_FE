import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FaPlus, 
  FaSearch, 
  FaRegStickyNote, 
  FaCheckCircle, 
  FaClock, 
  FaStar, 
  FaLightbulb, 
  FaRobot, 
  FaChartLine, 
  FaBrain, 
  FaMagic, 
  FaRocket, 
  FaShieldAlt, 
  FaSyncAlt,
  FaCalendarAlt,
  FaTasks,
  FaBookOpen,
  FaUsers,
  FaCog,
  FaBell
} from "react-icons/fa";
import { toast } from 'react-toastify';

const recentNotes = [
  { id: 1, title: "Ghi chú Web3", content: "Khám phá công nghệ blockchain và ứng dụng Web3.", lastModified: "2 giờ trước", isStarred: true },
  { id: 2, title: "Học React", content: "Ôn tập các hook, component, và state management.", lastModified: "1 ngày trước", isStarred: false },
  { id: 3, title: "Viết bài blog", content: "Chia sẻ kiến thức về lập trình và công nghệ mới.", lastModified: "3 ngày trước", isStarred: true },
];

const quickActions = [
  { icon: <FaRegStickyNote className="text-2xl" />, title: "Ghi chú mới", description: "Tạo ghi chú nhanh", color: "bg-blue-500", link: "/create" },
  { icon: <FaTasks className="text-2xl" />, title: "Todo mới", description: "Thêm công việc", color: "bg-green-500", link: "/todo" },
  { icon: <FaBookOpen className="text-2xl" />, title: "Tài liệu", description: "Quản lý tài liệu", color: "bg-purple-500", link: "/docs" },
  { icon: <FaUsers className="text-2xl" />, title: "Chia sẻ", description: "Chia sẻ với team", color: "bg-orange-500", link: "/share" },
];

const aiInsights = [
  {
    type: "productivity",
    title: "Tăng hiệu suất 25%",
    description: "Dựa trên thói quen ghi chú của bạn",
    icon: <FaChartLine className="text-2xl" />,
    color: "from-green-400 to-green-600"
  },
  {
    type: "suggestion",
    title: "Đề xuất ghi chú",
    description: "Dựa trên lịch sử tìm kiếm",
    icon: <FaLightbulb className="text-2xl" />,
    color: "from-blue-400 to-blue-600"
  },
  {
    type: "reminder",
    title: "Nhắc nhở",
    description: "3 ghi chú cần cập nhật",
    icon: <FaBell className="text-2xl" />,
    color: "from-purple-400 to-purple-600"
  }
];

const todoItems = [
  { id: 1, text: "Hoàn thành bài viết về Web3", completed: false, priority: "high", dueDate: "2024-01-15" },
  { id: 2, text: "Ôn tập React hooks", completed: true, priority: "medium", dueDate: "2024-01-10" },
  { id: 3, text: "Lên kế hoạch cho dự án mới", completed: false, priority: "high", dueDate: "2024-01-20" },
  { id: 4, text: "Đọc sách về AI", completed: false, priority: "low", dueDate: "2024-01-25" },
];

export default function Home() {
  const [notes, setNotes] = useState(recentNotes);
  const [todos, setTodos] = useState(todoItems);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    toast.success("Đã xóa ghi chú!");
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleStarNote = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isStarred: !note.isStarred } : note
    ));
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-0">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Chào mừng trở lại! 👋</h2>
                <p className="text-blue-100 text-base sm:text-lg md:text-xl">Hôm nay bạn muốn làm gì?</p>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold">{new Date().getDate()}</div>
                <div className="text-blue-100 text-sm sm:text-base md:text-lg">{new Date().toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Thao tác nhanh</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`${action.color} w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">{action.title}</h4>
                  <p className="text-gray-600 text-sm sm:text-base">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <FaRobot className="text-purple-500 text-xl sm:text-2xl" />
              AI Insights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {aiInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-r ${insight.color} p-6 sm:p-8 rounded-xl sm:rounded-2xl text-white`}
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="text-2xl sm:text-3xl">{insight.icon}</div>
                    <span className="text-xs sm:text-sm bg-white bg-opacity-20 px-2 sm:px-3 py-1 sm:py-2 rounded-full">
                      {insight.type === "productivity" ? "Hiệu suất" : 
                       insight.type === "suggestion" ? "Đề xuất" : "Nhắc nhở"}
                    </span>
                  </div>
                  <h4 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3">{insight.title}</h4>
                  <p className="opacity-90 text-sm sm:text-base">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notes & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Recent Notes */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Ghi chú gần đây</h3>
                <Link to="/notes" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Xem tất cả
                </Link>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {filteredNotes.slice(0, 3).map((note) => (
                  <div key={note.id} className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">{note.title}</h4>
                        {note.isStarred && <FaStar className="text-yellow-400 text-xs sm:text-sm" />}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{note.content}</p>
                      <p className="text-xs text-gray-400">{note.lastModified}</p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleStarNote(note.id)}
                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <FaStar className={`text-xs sm:text-sm ${note.isStarred ? 'text-yellow-400' : 'text-gray-300'}`} />
                      </button>
                      <Link
                        to={`/note/${note.id}`}
                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                      >
                        <FaSyncAlt className="text-xs sm:text-sm" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats & Todo Progress */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Tiến độ & Thống kê</h3>
              <div className="space-y-6 sm:space-y-8">
                {/* Todo Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Todo Progress</span>
                    <span className="text-xs sm:text-sm text-gray-500">{completedTodos}/{totalTodos}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                    <div 
                      className="bg-green-500 h-2 sm:h-3 rounded-full transition-all duration-300"
                      style={{ width: `${totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-lg sm:rounded-xl">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">{notes.length}</div>
                    <div className="text-xs sm:text-sm text-blue-600">Ghi chú</div>
                  </div>
                  <div className="text-center p-4 sm:p-6 bg-green-50 rounded-lg sm:rounded-xl">
                    <div className="text-2xl sm:text-3xl font-bold text-green-600">{completedTodos}</div>
                    <div className="text-xs sm:text-sm text-green-600">Hoàn thành</div>
                  </div>
                </div>

                {/* Quick Todo Input */}
                <div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input
                      type="text"
                      placeholder="Thêm todo nhanh..."
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                    />
                    <button className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm">
                      <FaPlus className="text-xs sm:text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
