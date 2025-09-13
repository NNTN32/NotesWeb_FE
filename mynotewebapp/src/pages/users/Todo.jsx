import { useState, useEffect } from "react";
import { FaPlus, FaCheckCircle, FaTrash, FaEdit, FaSun, FaMoon, FaRegClock } from "react-icons/fa";

const priorityColors = {
  high: "bg-red-500 text-white",
  medium: "bg-amber-500 text-white", 
  low: "bg-green-500 text-white"
};

const priorityLabels = {
  high: "🔥 Cao",
  medium: "⭐ TB", 
  low: "🌱 Thấp"
};

const timeSlots = [
  "Sáng sớm (6h-9h)",
  "Sáng (9h-12h)", 
  "Trưa (12h-14h)",
  "Chiều (14h-17h)",
  "Tối (17h-21h)",
  "Đêm (21h-24h)"
];

function TodoList() {
  const [todos, setTodos] = useState([
    { 
      id: 1, 
      text: "Tập thể dục buổi sáng", 
      completed: false, 
      priority: "high", 
      timeSlot: "Sáng sớm (6h-9h)",
      createdAt: new Date()
    },
    { 
      id: 2, 
      text: "Đọc sách 30 phút", 
      completed: true, 
      priority: "medium", 
      timeSlot: "Sáng (9h-12h)",
      createdAt: new Date()
    },
    { 
      id: 3, 
      text: "Làm việc nhà", 
      completed: false, 
      priority: "low", 
      timeSlot: "Chiều (14h-17h)",
      createdAt: new Date()
    },
  ]);
  
  const [newTodo, setNewTodo] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newTimeSlot, setNewTimeSlot] = useState("Sáng (9h-12h)");
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

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
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        priority: newPriority,
        timeSlot: newTimeSlot,
        createdAt: new Date()
      };
      setTodos([...todos, todo]);
      setNewTodo("");
      setNewPriority("medium");
      setNewTimeSlot("Sáng (9h-12h)");
      setShowAddForm(false);
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

  const currentHour = currentTime.getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Chào buổi sáng! ☀️";
    if (currentHour < 17) return "Chào buổi chiều! 🌤️";
    return "Chào buổi tối! 🌙";
  };

  const getCurrentTimeSlot = () => {
    if (currentHour < 9) return "Sáng sớm (6h-9h)";
    if (currentHour < 12) return "Sáng (9h-12h)";
    if (currentHour < 14) return "Trưa (12h-14h)";
    if (currentHour < 17) return "Chiều (14h-17h)";
    if (currentHour < 21) return "Tối (17h-21h)";
    return "Đêm (21h-24h)";
  };

  const currentTimeSlot = getCurrentTimeSlot();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
          <h1 className="text-3xl font-bold text-transparent">Todo Hôm Nay</h1>
        </div>
        <p className="text-lg text-gray-600">{today}</p>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
          <p className="text-gray-700 font-medium flex items-center justify-center gap-2">
            {currentHour < 12 ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
            {getGreeting()}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 animate-slide-up">
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{totalTodos}</div>
          <div className="text-sm text-gray-600">Tổng cộng</div>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{completedTodos}</div>
          <div className="text-sm text-gray-600">Hoàn thành</div>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-purple-600">{totalTodos - completedTodos}</div>
          <div className="text-sm text-gray-600">Còn lại</div>
        </div>
      </div>

      {/* Add Todo Button */}
      <div className="text-center animate-bounce">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105 font-semibold text-lg flex items-center gap-2 mx-auto shadow-lg"
        >
          <FaPlus />
          Thêm công việc mới
        </button>
      </div>

      {/* Add Todo Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-slide-down">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Bạn muốn làm gì hôm nay? ✨"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              autoFocus
            />
            <div className="flex gap-4">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
              >
                <option value="low">🌱 Thấp</option>
                <option value="medium">⭐ Trung bình</option>
                <option value="high">🔥 Cao</option>
              </select>
              <select
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddTodo}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all font-semibold"
              >
                Thêm
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl hover:border-gray-400 transition-all"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current Time Slot Highlight */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-4 text-center animate-pulse">
        <p className="text-lg font-medium flex items-center justify-center gap-2">
          <FaRegClock />
          Khung giờ hiện tại: {currentTimeSlot}
        </p>
      </div>

      {/* Todo List by Time Slots */}
      <div className="space-y-6">
        {timeSlots.map((timeSlot, index) => {
          const slotTodos = todos.filter(todo => todo.timeSlot === timeSlot);
          const isCurrentSlot = timeSlot === currentTimeSlot;
          
          if (slotTodos.length === 0) return null;
          
          return (
            <div 
              key={timeSlot}
              className={`bg-white rounded-2xl shadow-lg border-2 p-6 transition-all duration-300 hover:shadow-xl ${
                isCurrentSlot ? 'border-blue-300 bg-blue-50' : 'border-gray-100'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                isCurrentSlot ? 'text-blue-700' : 'text-gray-700'
              }`}>
                {isCurrentSlot && <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>}
                {timeSlot}
                {isCurrentSlot && <span className="text-sm bg-blue-500 text-white px-2 py-1 rounded-full ml-2">Hiện tại</span>}
              </h3>
              
              <div className="space-y-3">
                {slotTodos.map((todo) => (
                  <div 
                    key={todo.id} 
                    className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 ${
                      todo.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleTodo(todo.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-1 flex-shrink-0 ${
                          todo.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        {todo.completed && <FaCheckCircle className="text-sm" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <span className={`font-medium text-lg leading-relaxed ${
                          todo.completed 
                            ? 'line-through text-gray-500' 
                            : 'text-gray-800'
                        }`}>
                          {todo.text}
                        </span>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[todo.priority]}`}>
                            {priorityLabels[todo.priority]}
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {todos.length === 0 && (
        <div className="text-center py-16 text-gray-500 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <FaCheckCircle className="text-3xl text-blue-500" />
          </div>
          <p className="text-xl font-medium mb-2">Chưa có công việc nào!</p>
          <p className="text-gray-400">Hãy bắt đầu với todo đầu tiên của bạn hôm nay ✨</p>
        </div>
      )}
    </div>
  );
}

export default function Todo() {
  return (
    <div className="min-h-screen patterncraft-bg px-6 py-8">
      <div className="patterncraft-content">
        <TodoList />
      </div>
    </div>
  );
}
