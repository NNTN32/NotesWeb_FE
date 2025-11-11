import { useState, useEffect } from "react";
import { 
  FaCheckCircle, 
  FaCalendarAlt, 
  FaTrash, 
  FaClock, 
  FaCalendarWeek, 
  FaBullseye, 
  FaTachometerAlt, 
  FaTimes, 
  FaPlus,
  FaCalendarCheck,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import { useInView } from '../../utils/useInView';

// Constants and configuration
const CONSTANTS = {
  PRIORITY: {
    COLORS: {
      high: "bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white shadow-lg",
      medium: "bg-gradient-to-r from-amber-500 via-brass-500 to-yellow-500 text-white shadow-lg",
      low: "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white shadow-lg"
    },
    LABELS: {
      high: "🔥 Cao",
      medium: "⭐ TB", 
      low: "🌱 Thấp"
    },
    ORDER: {
      high: 0,
      medium: 1,
      low: 2
    }
  },
  
  WEEK_DAYS: [
    "Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"
  ],
  
  DAY_COLORS: {
    "Chủ nhật": "from-rose to-terracotta",
    "Thứ 2": "from-terracotta to-brass", 
    "Thứ 3": "from-brass to-coffee",
    "Thứ 4": "from-coffee to-ink",
    "Thứ 5": "from-ink to-rose",
    "Thứ 6": "from-rose to-terracotta",
    "Thứ 7": "from-terracotta to-brass"
  },
  
  MOTIVATIONAL_MESSAGES: [
    "Tuần này sẽ là tuần tuyệt vời nhất! 🌟",
    "Mỗi ngày là cơ hội để tiến gần hơn đến mục tiêu! 🎯",
    "Bạn đang xây dựng tương lai tuyệt vời! 🚀",
    "Thành công tuần này sẽ tạo động lực cho tuần sau! 💪",
    "Hãy biến kế hoạch thành hành động! ⚡",
    "Tuần này bạn sẽ làm được nhiều hơn mong đợi! ✨"
  ],
  
  ACHIEVEMENT_LEVELS: {
    beginner: { min: 0, max: 25, label: "Khởi đầu", color: "from-gray-400 to-gray-500", icon: "🌱" },
    progress: { min: 26, max: 50, label: "Tiến bộ", color: "from-blue-400 to-blue-500", icon: "📈" },
    good: { min: 51, max: 75, label: "Tốt", color: "from-green-400 to-green-500", icon: "👍" },
    excellent: { min: 76, max: 90, label: "Xuất sắc", color: "from-yellow-400 to-yellow-500", icon: "⭐" },
    outstanding: { min: 91, max: 100, label: "Vượt trội", color: "from-purple-400 to-purple-500", icon: "🏆" }
  }
};

// Helper functions for better code organization
const getAchievementLevel = (percentage) => {
  for (const [key, level] of Object.entries(CONSTANTS.ACHIEVEMENT_LEVELS)) {
    if (percentage >= level.min && percentage <= level.max) {
      return { key, ...level };
    }
  }
  return CONSTANTS.ACHIEVEMENT_LEVELS.beginner;
};

const getTodosByWeekDay = (todos, day) => {
  return todos.filter(todo => todo.weekDay === day);
};

const getWeeklyFocusTodos = (todos) => {
  const focusCandidates = todos
    .filter(todo => !todo.completed)
    .sort((a, b) => {
      if (CONSTANTS.PRIORITY.ORDER[a.priority] !== CONSTANTS.PRIORITY.ORDER[b.priority]) {
        return CONSTANTS.PRIORITY.ORDER[a.priority] - CONSTANTS.PRIORITY.ORDER[b.priority];
      }
      const aDate = new Date(a.dueDate || 0).getTime();
      const bDate = new Date(b.dueDate || 0).getTime();
      return aDate - bDate;
    });
  return focusCandidates.slice(0, 3);
};

const filterTodos = (todos, filter) => {
  switch (filter) {
    case 'high':
      return todos.filter(t => t.priority === 'high');
    case 'incomplete':
      return todos.filter(t => !t.completed);
    case 'completed':
      return todos.filter(t => t.completed);
    default:
      return todos;
  }
};

const sortTodosByPriority = (todos) => {
  return todos.sort((a, b) => {
    if (CONSTANTS.PRIORITY.ORDER[a.priority] !== CONSTANTS.PRIORITY.ORDER[b.priority]) {
      return CONSTANTS.PRIORITY.ORDER[a.priority] - CONSTANTS.PRIORITY.ORDER[b.priority];
    }
    const aDate = new Date(a.dueDate || 0).getTime();
    const bDate = new Date(b.dueDate || 0).getTime();
    return aDate - bDate;
  });
};

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
  const [weeklyFilter, setWeeklyFilter] = useState("all");
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [showStatsSidebar, setShowStatsSidebar] = useState(false);
  
  // Animation state
  const [animatedElements, setAnimatedElements] = useState({
    header: false,
    weeklyTable: false
  });

  // Animation refs
  const [headerRef, headerInView] = useInView({ threshold: 0.1, once: true });
  const [weeklyTableRef, weeklyTableInView] = useInView({ threshold: 0.1, once: true });

  // Animation effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedElements(prev => ({ ...prev, header: true }));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (weeklyTableInView) {
      setAnimatedElements(prev => ({ ...prev, weeklyTable: true }));
    }
  }, [weeklyTableInView]);

  // Helper functions
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
      const weekDay = CONSTANTS.WEEK_DAYS[selectedDate.getDay()];
      
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

  // Computed values
  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;
  const weeklyProgress = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  const achievement = getAchievementLevel(weeklyProgress);
  
  const today = new Date().toLocaleDateString('vi-VN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink/5 via-coffee/5 to-terracotta/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      <div className="max-w-[95%] mx-auto px-4 py-6 space-y-6">
        
        {/* Header Section */}
        <div ref={headerRef} className={`text-center space-y-4 transition-all duration-1000 ease-out ${
          animatedElements.header ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Welcome badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose/10 to-terracotta/10 dark:from-rose/20 dark:to-terracotta/20 px-4 py-2 rounded-full border border-rose/20 dark:border-rose/30">
            <FaCalendarWeek className="text-rose dark:text-rose-400 text-sm" />
            <span className="text-sm font-medium text-ink dark:text-gray-200">Weekly Planner</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            <span className="text-ink dark:text-gray-200">Lập kế hoạch tuần</span>
            <br />
            <span className="bg-gradient-to-r from-rose via-terracotta to-brass dark:from-rose-400 dark:via-terracotta-400 dark:to-brass-400 bg-clip-text text-transparent">
              một cách thông minh
            </span>
          </h1>
          
          <p className="text-lg text-coffee/80 dark:text-gray-300 max-w-2xl mx-auto">
            {today} • {CONSTANTS.MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * CONSTANTS.MOTIVATIONAL_MESSAGES.length)]}
          </p>
        </div>

        {/* Weekly Plan Section - Right below header */}
        <div ref={weeklyTableRef} className={`transition-all duration-1000 ease-out ${
          animatedElements.weeklyTable ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Weekly Plan Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-rose/10 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-ink dark:text-gray-200 flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-rose to-terracotta dark:from-rose-400 dark:to-terracotta-400">
                  <FaCalendarCheck className="text-white text-lg" />
                </div>
                Kế hoạch tuần của bạn
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-coffee/80 dark:text-gray-300">Bộ lọc:</span>
                <select
                  value={weeklyFilter}
                  onChange={(e) => setWeeklyFilter(e.target.value)}
                  className="px-3 py-2 border-2 border-rose/20 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose/20 dark:focus:ring-rose-400 focus:border-rose dark:focus:border-rose-400 transition-all bg-white dark:bg-gray-700 text-ink dark:text-gray-200"
                >
                  <option value="all">Tất cả</option>
                  <option value="high">Ưu tiên cao</option>
                  <option value="incomplete">Chưa hoàn thành</option>
                  <option value="completed">Đã hoàn thành</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Weekly Table - Large horizontal table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-rose/10 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-7 min-w-[1200px]">
                {CONSTANTS.WEEK_DAYS.map((day, index) => {
                  let dayTodos = getTodosByWeekDay(todos, day);
                  dayTodos = filterTodos(dayTodos, weeklyFilter);
                  dayTodos = sortTodosByPriority(dayTodos);
                  
                  const isToday = day === CONSTANTS.WEEK_DAYS[new Date().getDay()];
                  const completedCount = dayTodos.filter(t => t.completed).length;
                  const totalCount = dayTodos.length;
                  
                  return (
                    <div 
                      key={day}
                      className={`border-r border-rose/10 dark:border-gray-700 last:border-r-0 ${
                        isToday 
                          ? 'bg-gradient-to-b from-rose/5 to-terracotta/5 dark:from-rose-900/20 dark:to-terracotta-900/20' 
                          : 'bg-white dark:bg-gray-800'
                      }`}
                    >
                      {/* Day Header */}
                      <div className={`p-4 border-b-2 ${
                        isToday 
                          ? 'border-rose dark:border-rose-600 bg-gradient-to-r from-rose/10 to-terracotta/10 dark:from-rose-900/30 dark:to-terracotta-900/30' 
                          : 'border-rose/10 dark:border-gray-700'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-bold text-lg ${
                            isToday 
                              ? 'text-rose dark:text-rose-300' 
                              : 'text-ink dark:text-gray-200'
                          }`}>
                            {day}
                          </h4>
                          {isToday && (
                            <div className="w-2 h-2 bg-rose rounded-full animate-ping"></div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-coffee/80 dark:text-gray-400">
                            {completedCount}/{totalCount}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-coffee/20 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${CONSTANTS.DAY_COLORS[day]} transition-all duration-1000`}
                            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Todos List - Vertical */}
                      <div className="p-3 space-y-2 min-h-[400px] max-h-[600px] overflow-y-auto">
                        {totalCount === 0 ? (
                          <div className="text-center py-8 text-coffee/50 dark:text-gray-500">
                            <FaCalendarAlt className="text-2xl mx-auto mb-2" />
                            <p className="text-xs">Không có công việc</p>
                          </div>
                        ) : (
                          dayTodos.map((todo) => (
                            <div 
                              key={todo.id}
                              className={`p-3 rounded-lg border transition-all duration-300 hover:shadow-md ${
                                todo.completed 
                                  ? 'bg-brass/10 dark:bg-brass-900/30 border-brass/20 dark:border-brass-800' 
                                  : 'bg-white/50 dark:bg-gray-700 border-rose/10 dark:border-gray-600 hover:border-rose dark:hover:border-rose-600'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <button
                                  onClick={() => handleToggleTodo(todo.id)}
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 flex-shrink-0 ${
                                    todo.completed 
                                      ? 'bg-brass border-brass text-white' 
                                      : 'border-rose/30 dark:border-gray-600 hover:border-rose dark:hover:border-rose-400'
                                  }`}
                                >
                                  {todo.completed && <FaCheckCircle className="text-xs" />}
                                </button>
                                
                                <div className="flex-1 min-w-0">
                                  <div className={`text-xs font-medium leading-relaxed mb-1 ${
                                    todo.completed 
                                      ? 'line-through text-coffee/60 dark:text-gray-400' 
                                      : 'text-ink dark:text-gray-200'
                                  }`}>
                                    {todo.text}
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${CONSTANTS.PRIORITY.COLORS[todo.priority]}`}>
                                      {CONSTANTS.PRIORITY.LABELS[todo.priority].split(' ')[1]}
                                    </span>
                                    <span className="text-xs text-coffee/60 dark:text-gray-400 flex items-center gap-1">
                                      <FaClock className="text-xs" /> {todo.dueDate}
                                    </span>
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => handleDeleteTodo(todo.id)}
                                  className="p-1 rounded hover:bg-rose/10 dark:hover:bg-rose-900/50 transition-colors text-rose dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex-shrink-0"
                                >
                                  <FaTrash className="text-xs" />
                                </button>
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
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => setShowSidePanel(true)}
          className="fixed right-6 bottom-6 z-30 w-14 h-14 bg-gradient-to-r from-rose to-terracotta dark:from-rose-400 dark:to-terracotta-400 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        >
          <FaPlus className="text-xl group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Stats Sidebar - Collapsible on the right */}
        {/* 
          Design:
          - Sidebar panel is fixed to the right and slides in/out using translate-x.
          - Toggle button is independently fixed. When panel is open, the button shifts left by panel width (w-80).
          - This mimics SideMenu behavior: the button hugs the edge of the visible panel.
        */}
        {/* Sidebar Panel */}
        <div
          className={`fixed right-0 top-1/2 -translate-y-1/2 w-80 bg-white dark:bg-gray-800 rounded-l-2xl shadow-2xl border-l border-t border-b border-rose/10 dark:border-gray-700 p-6 space-y-4 max-h-[80vh] overflow-y-auto transition-transform duration-300 ease-in-out z-40 ${
            showStatsSidebar ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-hidden={!showStatsSidebar}
        >
              {/* Achievement Stats */}
              <div className="bg-gradient-to-br from-rose/5 to-terracotta/5 dark:from-rose-900/30 dark:to-terracotta-900/30 rounded-xl shadow-lg border border-rose/10 dark:border-gray-700 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${achievement.color} shadow-md`}>
                    <span className="text-lg">{achievement.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-ink dark:text-gray-200">Thành tích tuần</h3>
                    <p className="text-sm text-coffee/80 dark:text-gray-300">{achievement.label} ({weeklyProgress}%)</p>
                  </div>
                </div>
                
                {/* Progress Ring */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-coffee/20"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 32}`}
                        strokeDashoffset={`${2 * Math.PI * 32 * (1 - weeklyProgress / 100)}`}
                        className="text-rose"
                        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-ink dark:text-gray-200">{weeklyProgress}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-rose/10 dark:bg-rose-900/30 rounded-lg p-2">
                    <div className="text-lg font-bold text-rose dark:text-rose-400">{totalTodos}</div>
                    <div className="text-xs text-coffee/80 dark:text-gray-300">Tổng</div>
                  </div>
                  <div className="bg-brass/10 dark:bg-brass-900/30 rounded-lg p-2">
                    <div className="text-lg font-bold text-brass dark:text-brass-400">{completedTodos}</div>
                    <div className="text-xs text-coffee/80 dark:text-gray-300">Xong</div>
                  </div>
                  <div className="bg-terracotta/10 dark:bg-terracotta-900/30 rounded-lg p-2">
                    <div className="text-lg font-bold text-terracotta dark:text-terracotta-400">{totalTodos - completedTodos}</div>
                    <div className="text-xs text-coffee/80 dark:text-gray-300">Còn</div>
                </div>
              </div>
            </div>

              {/* Focus Section */}
              <div className="bg-gradient-to-br from-terracotta/5 to-brass/5 dark:from-terracotta-900/30 dark:to-brass-900/30 rounded-xl shadow-lg border border-terracotta/10 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-ink dark:text-gray-200 flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-gradient-to-r from-rose to-terracotta dark:from-rose-400 dark:to-terracotta-400">
                      <FaBullseye className="text-white text-sm" />
                    </div>
                    Focus tuần
                  </h3>
                  <select
                    value={weeklyFilter}
                    onChange={(e) => setWeeklyFilter(e.target.value)}
                    className="text-xs px-2 py-1 border border-rose/20 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose/20 dark:focus:ring-rose-400 focus:border-rose dark:focus:border-rose-400 transition-all bg-white dark:bg-gray-700 text-ink dark:text-gray-200"
                  >
                    <option value="all">Tất cả</option>
                    <option value="high">Cao</option>
                    <option value="incomplete">Chưa xong</option>
                    <option value="completed">Đã xong</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {(() => {
                    let focus = getWeeklyFocusTodos(todos);
                    focus = filterTodos(focus, weeklyFilter);
                    
                    if (focus.length === 0) {
                      return (
                        <div className="text-center py-6 text-coffee/50 dark:text-gray-500">
                          <FaBullseye className="text-2xl mx-auto mb-2" />
                          <p className="text-sm">Chưa có mục tiêu nổi bật</p>
                        </div>
                      );
                    }
                    
                    return focus.map((todo, index) => (
                      <div 
                        key={todo.id} 
                        className={`p-3 rounded-xl border transition-all duration-300 hover:shadow-md ${
                          todo.completed 
                            ? 'border-brass/20 dark:border-brass-800 bg-brass/10 dark:bg-brass-900/30' 
                            : 'border-rose/20 dark:border-rose-800 bg-rose/5 dark:bg-rose-900/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleTodo(todo.id)}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 flex-shrink-0 ${
                              todo.completed 
                                ? 'bg-brass border-brass text-white' 
                                : 'border-rose/30 dark:border-rose-600 hover:border-rose dark:hover:border-rose-400'
                            }`}
                          >
                            {todo.completed && <FaCheckCircle className="text-xs" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium leading-relaxed ${
                              todo.completed ? 'line-through text-coffee/60 dark:text-gray-400' : 'text-ink dark:text-gray-200'
                            }`}>{todo.text}</div>
                            <div className="mt-2 flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${CONSTANTS.PRIORITY.COLORS[todo.priority]}`}>
                                {CONSTANTS.PRIORITY.LABELS[todo.priority].split(' ')[1]}
                              </span>
                              <span className="text-xs text-coffee/60 dark:text-gray-400">{todo.weekDay}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
        {/* Toggle Button - fixed; shifts left when panel is open to hug the panel edge */}
        <button
          onClick={() => setShowStatsSidebar(!showStatsSidebar)}
          className={`fixed top-1/2 -translate-y-1/2 h-20 w-12 bg-gradient-to-r from-rose to-terracotta dark:from-rose-400 dark:to-terracotta-400 text-white rounded-l-lg shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${
            showStatsSidebar ? 'right-[20rem]' : 'right-0'
          }`}
          aria-label={showStatsSidebar ? 'Ẩn sidebar' : 'Hiện sidebar'}
        >
          {showStatsSidebar ? (
            <FaChevronRight className="text-lg transition-transform duration-300" />
          ) : (
            <FaChevronLeft className="text-lg transition-transform duration-300" />
          )}
        </button>

        {/* Add Todo Side Panel */}
        {showSidePanel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSidePanel(false)}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-rose/10 dark:border-gray-700 p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-rose to-terracotta dark:from-rose-400 dark:to-terracotta-400">
                      <FaTachometerAlt className="text-white" />
                    </div>
                  <span className="font-bold text-ink dark:text-gray-200 text-lg">Thêm công việc</span>
                  </div>
                <button 
                  className="p-2 rounded-lg hover:bg-rose/10 dark:hover:bg-gray-700 transition-colors" 
                  onClick={() => setShowSidePanel(false)}
                >
                  <FaTimes className="text-coffee/60 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Bạn muốn hoàn thành gì tuần này? ✨"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-rose/20 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-rose/20 dark:focus:ring-rose-400 focus:border-rose dark:focus:border-rose-400 transition-all bg-white dark:bg-gray-700 text-ink dark:text-gray-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                  autoFocus
                />
                <div className="flex gap-3">
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="flex-1 px-3 py-3 border-2 border-rose/20 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-rose/20 dark:focus:ring-rose-400 focus:border-rose dark:focus:border-rose-400 transition-all bg-white dark:bg-gray-700 text-ink dark:text-gray-200"
                  >
                    <option value="low">🌱 Thấp</option>
                    <option value="medium">⭐ Trung bình</option>
                    <option value="high">🔥 Cao</option>
                  </select>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="flex-1 px-3 py-3 border-2 border-rose/20 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-rose/20 dark:focus:ring-rose-400 focus:border-rose dark:focus:border-rose-400 transition-all bg-white dark:bg-gray-700 text-ink dark:text-gray-200"
                  />
                </div>
                <button 
                  onClick={handleAddTodo} 
                  className="w-full py-3 bg-gradient-to-r from-rose to-terracotta dark:from-rose-400 dark:to-terracotta-400 text-white rounded-xl font-semibold hover:from-terracotta hover:to-rose dark:hover:from-terracotta-400 dark:hover:to-rose-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Thêm công việc
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeeklyPlan;

