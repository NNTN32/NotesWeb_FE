import { useState, useEffect } from "react";
import { 
  FaCheckCircle, 
  FaCalendarAlt, 
  FaTrash, 
  FaEdit, 
  FaStar, 
  FaFire, 
  FaLightbulb, 
  FaClock, 
  FaCalendarWeek, 
  FaBullseye, 
  FaFilter, 
  FaChevronRight, 
  FaTachometerAlt, 
  FaPlusCircle, 
  FaTimes, 
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaRocket,
  FaHeart,
  FaArrowRight,
  FaPlay,
  FaUsers,
  FaTrophy,
  FaChartLine,
  FaCalendarCheck,
  FaExpand,
  FaCompress
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
    "Chủ nhật": "from-purple-500 to-indigo-500",
    "Thứ 2": "from-blue-500 to-cyan-500", 
    "Thứ 3": "from-green-500 to-emerald-500",
    "Thứ 4": "from-yellow-500 to-amber-500",
    "Thứ 5": "from-orange-500 to-red-500",
    "Thứ 6": "from-pink-500 to-rose-500",
    "Thứ 7": "from-violet-500 to-purple-500"
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
  
  // New state for enhanced UI
  const [collapsedDays, setCollapsedDays] = useState({});
  const [showWeeklyStats, setShowWeeklyStats] = useState(true);
  const [animatedElements, setAnimatedElements] = useState({
    header: false,
    stats: false,
    focus: false,
    weeklyGrid: false,
    sidePanel: false
  });

  // Animation refs
  const [headerRef, headerInView] = useInView({ threshold: 0.1, once: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, once: true });
  const [focusRef, focusInView] = useInView({ threshold: 0.1, once: true });
  const [weeklyGridRef, weeklyGridInView] = useInView({ threshold: 0.1, once: true });

  // Animation effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedElements(prev => ({ ...prev, header: true }));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (statsInView) {
      setAnimatedElements(prev => ({ ...prev, stats: true }));
    }
  }, [statsInView]);

  useEffect(() => {
    if (focusInView) {
      setAnimatedElements(prev => ({ ...prev, focus: true }));
    }
  }, [focusInView]);

  useEffect(() => {
    if (weeklyGridInView) {
      setAnimatedElements(prev => ({ ...prev, weeklyGrid: true }));
    }
  }, [weeklyGridInView]);

  // Helper functions
  const toggleDayCollapse = (day) => {
    setCollapsedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Compact Header Section */}
        <div ref={headerRef} className={`text-center space-y-4 transition-all duration-1000 ease-out ${
          animatedElements.header ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Welcome badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 px-4 py-2 rounded-full border border-indigo-500/20 dark:border-indigo-400/30">
            <FaCalendarWeek className="text-indigo-500 dark:text-indigo-400 text-sm" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Weekly Planner</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            <span className="text-gray-800 dark:text-gray-200">Lập kế hoạch tuần</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              một cách thông minh
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {today} • {CONSTANTS.MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * CONSTANTS.MOTIVATIONAL_MESSAGES.length)]}
          </p>
        </div>

        {/* Main Layout Grid - New Proportions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar - Achievement & Focus (25% of layout) */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Compact Achievement Stats */}
            <div ref={statsRef} className={`transition-all duration-1000 ease-out ${
              animatedElements.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${achievement.color} shadow-md`}>
                    <span className="text-lg">{achievement.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">Thành tích tuần</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.label} ({weeklyProgress}%)</p>
                  </div>
                </div>
                
                {/* Compact Progress Ring */}
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
                        className="text-gray-200"
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
                        className="text-indigo-500"
                        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{weeklyProgress}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Compact Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-2">
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{totalTodos}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Tổng</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-2">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{completedTodos}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Xong</div>
                  </div>
                  <div className="bg-pink-50 dark:bg-pink-900/30 rounded-lg p-2">
                    <div className="text-lg font-bold text-pink-600 dark:text-pink-400">{totalTodos - completedTodos}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Còn</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Focus Section */}
            <div ref={focusRef} className={`transition-all duration-1000 ease-out ${
              animatedElements.focus ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '200ms' }}>
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400">
                      <FaBullseye className="text-white text-sm" />
                    </div>
                    Focus tuần
                  </h3>
                  <select
                    value={weeklyFilter}
                    onChange={(e) => setWeeklyFilter(e.target.value)}
                    className="text-xs px-2 py-1 border border-indigo-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
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
                        <div className="text-center py-6 text-gray-400 dark:text-gray-500">
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
                            ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30' 
                            : 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30'
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleTodo(todo.id)}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 flex-shrink-0 ${
                              todo.completed 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-indigo-300 dark:border-indigo-600 hover:border-indigo-500 dark:hover:border-indigo-400'
                            }`}
                          >
                            {todo.completed && <FaCheckCircle className="text-xs" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium leading-relaxed ${
                              todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'
                            }`}>{todo.text}</div>
                            <div className="mt-2 flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${CONSTANTS.PRIORITY.COLORS[todo.priority]}`}>
                                {CONSTANTS.PRIORITY.LABELS[todo.priority].split(' ')[1]}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{todo.weekDay}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Weekly Plan (75% of layout) */}
          <div className="lg:col-span-9">
            <div ref={weeklyGridRef} className={`transition-all duration-1000 ease-out ${
              animatedElements.weeklyGrid ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '400ms' }}>
              
              {/* Enhanced Weekly Plan Header */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-indigo-100 dark:border-gray-700 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400">
                      <FaCalendarCheck className="text-white text-lg" />
                    </div>
                    Kế hoạch tuần của bạn
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Bộ lọc:</span>
                    <select
                      value={weeklyFilter}
                      onChange={(e) => setWeeklyFilter(e.target.value)}
                      className="px-3 py-2 border-2 border-indigo-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      <option value="all">Tất cả</option>
                      <option value="high">Ưu tiên cao</option>
                      <option value="incomplete">Chưa hoàn thành</option>
                      <option value="completed">Đã hoàn thành</option>
                    </select>
                  </div>
                </div>
                
                {/* Weekly Overview Stats */}
                <div className="grid grid-cols-7 gap-3">
                  {CONSTANTS.WEEK_DAYS.map((day, index) => {
                    const dayTodos = getTodosByWeekDay(todos, day);
                    const completedCount = dayTodos.filter(t => t.completed).length;
                    const totalCount = dayTodos.length;
                    const isToday = day === CONSTANTS.WEEK_DAYS[new Date().getDay()];
                    
                    return (
                      <div 
                        key={day}
                        className={`text-center p-3 rounded-xl transition-all ${
                          isToday 
                            ? 'bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 border-2 border-indigo-300 dark:border-indigo-600' 
                            : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{day}</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{completedCount}/{totalCount}</div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
                          <div 
                            className={`h-1.5 rounded-full bg-gradient-to-r ${CONSTANTS.DAY_COLORS[day]} transition-all duration-1000`}
                            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Enhanced Weekly Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {CONSTANTS.WEEK_DAYS.map((day, index) => {
                  let dayTodos = getTodosByWeekDay(todos, day);
                  dayTodos = filterTodos(dayTodos, weeklyFilter);
                  dayTodos = sortTodosByPriority(dayTodos);
                  
                  const isToday = day === CONSTANTS.WEEK_DAYS[new Date().getDay()];
                  const completedCount = dayTodos.filter(t => t.completed).length;
                  const totalCount = dayTodos.length;
                  const isCollapsed = collapsedDays[day];
                  const visible = isCollapsed ? dayTodos.slice(0, 3) : dayTodos.slice(0, 6);
                  const remaining = totalCount - visible.length;
                  
                  return (
                    <div 
                      key={day}
                      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-500 hover:shadow-xl ${
                        isToday ? 'border-indigo-300 dark:border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30' : 'border-gray-100 dark:border-gray-700'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Enhanced Day Header */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className={`font-bold text-lg ${isToday ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'}`}>
                            {day}
                          </h4>
                          <div className="flex items-center gap-2">
                            {isToday && (
                              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                            )}
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                              {completedCount}/{totalCount}
                            </span>
                          </div>
                        </div>
                        
                        {/* Enhanced Progress Bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${CONSTANTS.DAY_COLORS[day]} transition-all duration-1000`}
                            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Enhanced Todos List */}
                      <div className="p-4 space-y-3">
                        {totalCount === 0 ? (
                          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                            <FaCalendarAlt className="text-2xl mx-auto mb-2" />
                            <p className="text-sm">Không có công việc</p>
                          </div>
                        ) : (
                          <>
                            {visible.map((todo) => (
                              <div 
                                key={todo.id}
                                className={`p-3 rounded-xl border transition-all duration-300 hover:shadow-md ${
                                  todo.completed 
                                    ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' 
                                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <button
                                    onClick={() => handleToggleTodo(todo.id)}
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 flex-shrink-0 ${
                                      todo.completed 
                                        ? 'bg-green-500 border-green-500 text-white' 
                                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400'
                                    }`}
                                  >
                                    {todo.completed && <FaCheckCircle className="text-xs" />}
                                  </button>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className={`text-sm font-medium leading-relaxed ${
                                      todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'
                                    }`}>{todo.text}</div>
                                    <div className="mt-2 flex items-center gap-2">
                                      <span className={`text-xs px-2 py-1 rounded-full ${CONSTANTS.PRIORITY.COLORS[todo.priority]}`}>
                                        {CONSTANTS.PRIORITY.LABELS[todo.priority].split(' ')[1]}
                                      </span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                        <FaClock className="text-xs" /> {todo.dueDate}
                                      </span>
                                    </div>
                                  </div>
                                  
                                    <button
                                      onClick={() => handleDeleteTodo(todo.id)}
                                      className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                    >
                                      <FaTrash className="text-xs" />
                                    </button>
                                </div>
                              </div>
                            ))}
                            
                            {remaining > 0 && (
                              <button
                                onClick={() => toggleDayCollapse(day)}
                                className="w-full flex items-center justify-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                              >
                                {isCollapsed ? <FaExpand className="mr-1" /> : <FaCompress className="mr-1" />}
                                {isCollapsed ? `Xem thêm ${remaining} công việc` : `Thu gọn`}
                              </button>
                            )}
                          </>
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
          className="fixed right-6 bottom-6 z-30 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        >
          <FaPlus className="text-xl group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Enhanced Side Panel */}
        {showSidePanel && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSidePanel(false)}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-indigo-100 dark:border-gray-700 p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400">
                      <FaTachometerAlt className="text-white" />
                    </div>
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-lg">Thêm công việc</span>
                  </div>
                <button 
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
                  onClick={() => setShowSidePanel(false)}
                >
                  <FaTimes className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Bạn muốn hoàn thành gì tuần này? ✨"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-indigo-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                  autoFocus
                />
                <div className="flex gap-3">
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="flex-1 px-3 py-3 border-2 border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                  >
                    <option value="low">🌱 Thấp</option>
                    <option value="medium">⭐ Trung bình</option>
                    <option value="high">🔥 Cao</option>
                  </select>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="flex-1 px-3 py-3 border-2 border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                  />
                </div>
                <button 
                  onClick={handleAddTodo} 
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-indigo-500 dark:hover:from-purple-400 dark:hover:to-indigo-400 transition-all duration-300 shadow-lg hover:shadow-xl"
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
