import { useState } from "react";
import { FaPlus, FaCheckCircle, FaCalendarAlt, FaTrash, FaEdit, FaStar, FaFire, FaLightbulb, FaClock, FaCalendarWeek } from "react-icons/fa";

const priorityColors = {
  high: "bg-gradient-to-r from-rose to-red-500 text-white border-rose",
  medium: "bg-gradient-to-r from-brass to-amber-500 text-white border-brass",
  low: "bg-gradient-to-r from-coffee to-amber-600 text-white border-coffee"
};

const priorityLabels = {
  high: "🔥 Ưu tiên cao",
  medium: "⭐ Trung bình", 
  low: "🌱 Thấp"
};

const weekDays = [
  "Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"
];

const motivationalMessages = [
  "Hôm nay là ngày tuyệt vời để hoàn thành mục tiêu! 💪",
  "Mỗi bước nhỏ đều đưa bạn đến gần ước mơ hơn ✨",
  "Bạn đang làm rất tốt! Hãy tiếp tục phát huy 🚀",
  "Thành công đến từ những thói quen nhỏ mỗi ngày 🌟"
];

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Hoàn thành bài viết về Web3", completed: false, priority: "high", dueDate: "2024-01-15", weekDay: "Thứ 2" },
    { id: 2, text: "Ôn tập React hooks", completed: true, priority: "medium", dueDate: "2024-01-10", weekDay: "Thứ 4" },
    { id: 3, text: "Lên kế hoạch cho dự án mới", completed: false, priority: "high", dueDate: "2024-01-20", weekDay: "Thứ 6" },
    { id: 4, text: "Đọc sách về AI", completed: false, priority: "low", dueDate: "2024-01-25", weekDay: "Chủ nhật" },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [viewMode, setViewMode] = useState("todo"); // "todo" or "weekly"

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const selectedDate = new Date(newDueDate);
      const weekDay = weekDays[selectedDate.getDay()];
      
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        priority: newPriority,
        dueDate: newDueDate || new Date().toISOString().split('T')[0],
        weekDay: weekDay
      };
      setTodos([...todos, todo]);
      setNewTodo("");
      setNewPriority("medium");
      setNewDueDate("");
    }
  };

  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;
  const today = new Date().toLocaleDateString('vi-VN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getTodosByWeekDay = (day) => {
    return todos.filter(todo => todo.weekDay === day);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header with Daily Motivation */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-brass via-rose to-terracotta bg-clip-text">
          <h1 className="text-4xl font-bold text-transparent">My Daily Planner</h1>
        </div>
        <p className="text-xl text-ink font-medium">{today}</p>
        <div className="bg-gradient-to-r from-brass/20 to-rose/20 rounded-2xl p-4 border border-brass/30">
          <p className="text-ink font-medium flex items-center justify-center gap-2">
            <FaLightbulb className="text-brass" />
            {motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]}
          </p>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
          <div className="flex">
            <button
              onClick={() => setViewMode("todo")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                viewMode === "todo" 
                  ? "bg-gradient-to-r from-terracotta to-brass text-white shadow-lg" 
                  : "text-ink hover:bg-gray-50"
              }`}
            >
              <FaCheckCircle className="inline mr-2" />
              Todo List
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                viewMode === "weekly" 
                  ? "bg-gradient-to-r from-terracotta to-brass text-white shadow-lg" 
                  : "text-ink hover:bg-gray-50"
              }`}
            >
              <FaCalendarWeek className="inline mr-2" />
              Weekly Plan
            </button>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-ink">Tiến độ hôm nay</h3>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-terracotta">{completedTodos}</div>
              <div className="text-sm text-ink/70">Đã hoàn thành</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brass">{totalTodos}</div>
              <div className="text-sm text-ink/70">Tổng cộng</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-rose">{Math.round((completedTodos / totalTodos) * 100) || 0}%</div>
              <div className="text-sm text-ink/70">Hoàn thành</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-terracotta to-brass h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Add New Todo */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
          <FaPlus className="text-terracotta" />
          Thêm công việc mới
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Bạn muốn hoàn thành gì hôm nay? ✨"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-terracotta/20 focus:border-terracotta text-lg transition-all"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-terracotta/20 focus:border-terracotta transition-all"
            >
              <option value="low">🌱 Ưu tiên thấp</option>
              <option value="medium">⭐ Trung bình</option>
              <option value="high">🔥 Ưu tiên cao</option>
            </select>
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-terracotta/20 focus:border-terracotta transition-all"
            />
            <button
              onClick={handleAddTodo}
              className="px-8 py-3 bg-gradient-to-r from-terracotta to-brass text-white rounded-xl hover:from-brass hover:to-terracotta transition-all transform hover:scale-105 font-semibold text-lg flex items-center gap-2"
            >
              <FaPlus />
              Thêm
            </button>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "todo" ? (
        /* Todo List View */
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
            <FaStar className="text-brass" />
            Danh sách công việc của bạn
          </h3>
          
          {todos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-terracotta/20 to-brass/20 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-4xl text-terracotta" />
              </div>
              <p className="text-lg">Chưa có công việc nào! Hãy bắt đầu với todo đầu tiên của bạn</p>
              <p className="text-sm mt-2">Mỗi bước nhỏ đều đưa bạn đến gần mục tiêu hơn ✨</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todos.map((todo) => (
                <div 
                  key={todo.id} 
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                    todo.completed 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-terracotta'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleTodo(todo.id)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all mt-1 ${
                        todo.completed 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-400 text-white shadow-lg' 
                          : 'border-gray-300 hover:border-terracotta hover:bg-terracotta/10'
                      }`}
                    >
                      {todo.completed && <FaCheckCircle className="text-lg" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <span className={`font-semibold text-lg leading-relaxed ${
                        todo.completed 
                          ? 'line-through text-gray-500' 
                          : 'text-ink'
                      }`}>
                        {todo.text}
                      </span>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`text-sm px-3 py-1 rounded-full border ${priorityColors[todo.priority]}`}>
                          {priorityLabels[todo.priority]}
                        </span>
                        <span className="text-sm text-ink/70 flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                          <FaCalendarAlt className="text-terracotta" />
                          {todo.dueDate}
                        </span>
                        <span className="text-sm text-ink/70 flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                          <FaClock className="text-brass" />
                          {todo.weekDay}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-3 text-gray-400 hover:text-terracotta hover:bg-terracotta/10 rounded-xl transition-all">
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
      ) : (
        /* Weekly Plan View */
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-ink flex items-center gap-2">
            <FaCalendarWeek className="text-rose" />
            Kế hoạch tuần của bạn
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {weekDays.map((day, index) => {
              const dayTodos = getTodosByWeekDay(day);
              const isToday = day === weekDays[new Date().getDay()];
              
              return (
                <div 
                  key={day}
                  className={`bg-white rounded-2xl shadow-lg border-2 p-4 transition-all hover:shadow-xl ${
                    isToday ? 'border-terracotta bg-gradient-to-br from-terracotta/5 to-brass/5' : 'border-gray-100'
                  }`}
                >
                  <div className="text-center mb-4">
                    <h4 className={`font-bold text-lg ${
                      isToday ? 'text-terracotta' : 'text-ink'
                    }`}>
                      {day}
                    </h4>
                    <p className="text-sm text-ink/60">
                      {dayTodos.length} công việc
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {dayTodos.length === 0 ? (
                      <div className="text-center py-4 text-ink/40">
                        <FaCalendarAlt className="text-2xl mx-auto mb-2" />
                        <p className="text-xs">Không có công việc</p>
                      </div>
                    ) : (
                      dayTodos.map((todo) => (
                        <div 
                          key={todo.id}
                          className={`p-3 rounded-xl border transition-all ${
                            todo.completed 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => handleToggleTodo(todo.id)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 ${
                                todo.completed 
                                  ? 'bg-green-400 border-green-400 text-white' 
                                  : 'border-gray-300 hover:border-terracotta'
                              }`}
                            >
                              {todo.completed && <FaCheckCircle className="text-xs" />}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <span className={`text-sm font-medium ${
                                todo.completed 
                                  ? 'line-through text-gray-500' 
                                  : 'text-ink'
                              }`}>
                                {todo.text}
                              </span>
                              
                              <div className="mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[todo.priority]}`}>
                                  {priorityLabels[todo.priority].split(' ')[1]}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-terracotta to-brass rounded-3xl shadow-lg p-6 text-center text-white">
          <div className="text-4xl font-bold mb-2">{totalTodos}</div>
          <div className="text-white/90">Tổng công việc</div>
        </div>
        <div className="bg-gradient-to-br from-rose to-pink-500 rounded-3xl shadow-lg p-6 text-center text-white">
          <div className="text-4xl font-bold mb-2">{completedTodos}</div>
          <div className="text-white/90">Đã hoàn thành</div>
        </div>
        <div className="bg-gradient-to-br from-brass to-amber-500 rounded-3xl shadow-lg p-6 text-center text-white">
          <div className="text-4xl font-bold mb-2">{todos.filter(t => t.priority === 'high').length}</div>
          <div className="text-white/90">Ưu tiên cao</div>
        </div>
      </div>
    </div>
  );
}

export default function Todo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-paper via-sand to-latte px-6 py-8">
      <TodoList />
    </div>
  );
}
