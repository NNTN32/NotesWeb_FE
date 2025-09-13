import { useState } from "react";
import { FaCheckCircle, FaCalendarAlt, FaTrash, FaEdit, FaStar, FaFire, FaLightbulb, FaClock, FaCalendarWeek, FaBullseye, FaFilter, FaChevronRight, FaTachometerAlt, FaPlusCircle, FaTimes, FaPlus } from "react-icons/fa";

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

const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2
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

function WeeklyPlan() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Hoàn thành bài viết về Web3", completed: false, priority: "high", dueDate: "2024-01-15", weekDay: "Thứ 2" },
    { id: 2, text: "Ôn tập React hooks", completed: true, priority: "medium", dueDate: "2024-01-10", weekDay: "Thứ 4" },
    { id: 3, text: "Lên kế hoạch cho dự án mới", completed: false, priority: "high", dueDate: "2024-01-20", weekDay: "Thứ 6" },
    { id: 4, text: "Đọc sách về AI", completed: false, priority: "low", dueDate: "2024-01-25", weekDay: "Chủ nhật" },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [weeklyFilter, setWeeklyFilter] = useState("all"); // all | high | incomplete | completed
  const [showSidePanel, setShowSidePanel] = useState(false); // combined progress + add form

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

  const getWeeklyFocusTodos = () => {
    const focusCandidates = todos
      .filter(todo => !todo.completed)
      .sort((a, b) => {
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        const aDate = new Date(a.dueDate || 0).getTime();
        const bDate = new Date(b.dueDate || 0).getTime();
        return aDate - bDate;
      });
    return focusCandidates.slice(0, 3);
  };

  return (
    <div className="min-h-screen patterncraft-bg px-6 py-8">
      <div className="patterncraft-content">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Floating droplet button */}
        <style>{`
          @keyframes floatUpDown { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          @keyframes liquidExpand {
            0% { 
              transform: translate(calc(50vw - 2.5rem), calc(2.5rem - 50vh)) scale(0.05); 
              opacity: 0.3; 
              border-radius: 50%;
              filter: blur(2px);
            }
            20% { 
              transform: translate(calc(50vw - 2.5rem), calc(2.5rem - 50vh)) scale(0.15); 
              opacity: 0.5; 
              border-radius: 45%;
              filter: blur(1px);
            }
            40% { 
              transform: translate(calc(50vw - 2.5rem), calc(2.5rem - 50vh)) scale(0.3); 
              opacity: 0.7; 
              border-radius: 40%;
              filter: blur(0.5px);
            }
            60% { 
              transform: translate(calc(50vw - 2.5rem), calc(2.5rem - 50vh)) scale(0.6); 
              opacity: 0.8; 
              border-radius: 35%;
              filter: blur(0px);
            }
            80% { 
              transform: translate(calc(50vw - 2.5rem), calc(2.5rem - 50vh)) scale(0.85); 
              opacity: 0.9; 
              border-radius: 28%;
              filter: blur(0px);
            }
            100% { 
              transform: translate(-50%, -50%) scale(1); 
              opacity: 1; 
              border-radius: 24px;
              filter: blur(0px);
            }
          }
        `}</style>
        <button
          onClick={() => setShowSidePanel(true)}
          className="fixed right-5 top-5 z-30 rounded-full w-12 h-12 flex items-center justify-center text-white shadow-md active:scale-95 transition-transform"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.45), rgba(255,255,255,0.15) 40%, rgba(0,0,0,0) 41%), linear-gradient(135deg, #e76f51, #b08968) ',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
          }}
          aria-label="Open summary"
        >
          <div className="w-10 h-10 rounded-full" style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.7), rgba(255,255,255,0.25))',
            animation: 'floatUpDown 3s ease-in-out infinite'
          }}></div>
        </button>

        {/* Header with Daily Motivation */}
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-brass via-rose to-terracotta bg-clip-text">
            <h1 className="text-4xl font-bold text-transparent">My Weekly Planner</h1>
          </div>
          <p className="text-xl text-ink font-medium">{today}</p>
          <div className="bg-gradient-to-r from-brass/20 to-rose/20 rounded-2xl p-4 border border-brass/30">
            <p className="text-ink font-medium flex items-center justify-center gap-2">
              <FaLightbulb className="text-brass" />
              {motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]}
            </p>
          </div>
        </div>

        {/* Weekly Focus */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-ink flex items-center gap-2">
              <FaBullseye className="text-rose" />
              Focus tuần này
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <FaFilter className="text-ink/60" />
              <select
                value={weeklyFilter}
                onChange={(e) => setWeeklyFilter(e.target.value)}
                className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-terracotta/20 focus:border-terracotta transition-all"
              >
                <option value="all">Tất cả</option>
                <option value="high">Ưu tiên cao</option>
                <option value="incomplete">Chưa hoàn thành</option>
                <option value="completed">Đã hoàn thành</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(() => {
              let focus = getWeeklyFocusTodos();
              if (weeklyFilter === 'high') focus = focus.filter(t => t.priority === 'high');
              if (weeklyFilter === 'incomplete') focus = focus.filter(t => !t.completed);
              if (weeklyFilter === 'completed') focus = focus.filter(t => t.completed);
              if (focus.length === 0) {
                return (
                  <div className="md:col-span-3 text-center py-6 text-ink/50">
                    Không có mục tiêu nổi bật. Hãy thêm công việc ưu tiên nhé!
                  </div>
                );
              }
              return focus.map((todo) => (
                <div key={todo.id} className={`p-4 rounded-2xl border-2 ${todo.completed ? 'border-green-200 bg-green-50' : 'border-rose/30 bg-rose/5'}`}>
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTodo(todo.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 ${
                        todo.completed ? 'bg-green-400 border-green-400 text-white' : 'border-rose/50 hover:border-terracotta'
                      }`}
                    >
                      {todo.completed && <FaCheckCircle className="text-xs" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold ${todo.completed ? 'line-through text-gray-500' : 'text-ink'}`}>{todo.text}</div>
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className={`px-2 py-1 rounded-full border ${priorityColors[todo.priority]}`}>{priorityLabels[todo.priority]}</span>
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-ink/70 flex items-center gap-1">
                          <FaCalendarAlt className="text-terracotta" /> {todo.dueDate}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-ink/70 flex items-center gap-1">
                          <FaClock className="text-brass" /> {todo.weekDay}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Weekly Plan Grid */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-ink flex items-center gap-2">
            <FaCalendarWeek className="text-rose" />
            Kế hoạch tuần của bạn
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {weekDays.map((day) => {
              let dayTodos = getTodosByWeekDay(day);
              if (weeklyFilter === 'high') dayTodos = dayTodos.filter(t => t.priority === 'high');
              if (weeklyFilter === 'incomplete') dayTodos = dayTodos.filter(t => !t.completed);
              if (weeklyFilter === 'completed') dayTodos = dayTodos.filter(t => t.completed);
              // sort by priority then due date
              dayTodos = dayTodos.sort((a, b) => {
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                }
                const aDate = new Date(a.dueDate || 0).getTime();
                const bDate = new Date(b.dueDate || 0).getTime();
                return aDate - bDate;
              });
              const isToday = day === weekDays[new Date().getDay()];
              const completedCount = dayTodos.filter(t => t.completed).length;
              const totalCount = dayTodos.length;
              const visible = dayTodos.slice(0, 3);
              const remaining = totalCount - visible.length;
              
              return (
                <div 
                  key={day}
                  className={`bg-white rounded-2xl shadow-lg border-2 p-4 transition-all hover:shadow-xl ${
                    isToday ? 'border-terracotta bg-gradient-to-br from-terracotta/5 to-brass/5' : 'border-gray-100'
                  }`}
                >
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold text-lg ${isToday ? 'text-terracotta' : 'text-ink'}`}>{day}</h4>
                      <span className="text-xs text-ink/60">{completedCount}/{totalCount}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-terracotta to-brass h-2 rounded-full"
                        style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {totalCount === 0 ? (
                      <div className="text-center py-4 text-ink/40">
                        <FaCalendarAlt className="text-2xl mx-auto mb-2" />
                        <p className="text-xs">Không có công việc</p>
                      </div>
                    ) : (
                      <>
                        {visible.map((todo) => (
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
                                <div className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-ink'}`}>{todo.text}</div>
                                <div className="mt-1 flex items-center gap-2">
                                  <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[todo.priority]}`}>{priorityLabels[todo.priority].split(' ')[1]}</span>
                                  <span className="text-xs text-ink/60 flex items-center gap-1"><FaCalendarAlt className="text-terracotta" />{todo.dueDate}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {remaining > 0 && (
                          <div className="flex items-center justify-center text-xs text-ink/60 py-1">
                            +{remaining} công việc nữa
                            <FaChevronRight className="ml-1" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Centered modal: progress + add new */}
        {showSidePanel && (
          <div className="fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/30" onClick={() => setShowSidePanel(false)}></div>
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] sm:w-[560px] bg-white rounded-3xl shadow-2xl border border-gray-200 p-5"
              style={{
                animation: 'liquidExpand 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaTachometerAlt className="text-terracotta" />
                  <span className="font-bold text-ink text-lg">Bảng tổng hợp</span>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => setShowSidePanel(false)} aria-label="Đóng">
                  <FaTimes />
                </button>
              </div>
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2 text-sm text-ink/70">
                  <span>Tiến độ hôm nay</span>
                  <span>{completedTodos}/{totalTodos}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-terracotta to-brass h-3 rounded-full" style={{ width: `${totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0}%` }}></div>
                </div>
                <div className="mt-3 grid grid-cols-3 text-center">
                  <div>
                    <div className="text-xl font-bold text-terracotta">{completedTodos}</div>
                    <div className="text-xs text-ink/70">Hoàn thành</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-brass">{totalTodos}</div>
                    <div className="text-xs text-ink/70">Tổng</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-rose">{Math.round((completedTodos / totalTodos) * 100) || 0}%</div>
                    <div className="text-xs text-ink/70">Tỉ lệ</div>
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <div className="font-bold text-ink mb-3 flex items-center gap-2">
                  <FaPlusCircle className="text-terracotta" />
                  Thêm công việc mới
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Bạn muốn hoàn thành gì? ✨"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-terracotta/20 focus:border-terracotta"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                  />
                  <div className="flex gap-3">
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                      className="flex-1 px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-terracotta/20 focus:border-terracotta"
                    >
                      <option value="low">🌱 Ưu tiên thấp</option>
                      <option value="medium">⭐ Trung bình</option>
                      <option value="high">🔥 Ưu tiên cao</option>
                    </select>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="flex-1 px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-terracotta/20 focus:border-terracotta"
                    />
                  </div>
                  <button onClick={handleAddTodo} className="w-full py-3 bg-gradient-to-r from-terracotta to-brass text-white rounded-xl font-semibold hover:from-brass hover:to-terracotta">
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default WeeklyPlan;
