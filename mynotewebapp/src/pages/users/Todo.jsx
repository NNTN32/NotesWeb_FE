import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  FaPlus, 
  FaCheckCircle, 
  FaTrash, 
  FaRegClock,
  FaChevronDown,
  FaChevronUp,
  FaTasks,
  FaStar,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaFilter
} from "react-icons/fa";
import { useInView } from '../../utils/useInView';

// Constants for better maintainability
const PRIORITY_CONFIG = {
  high: { 
    color: "bg-gradient-to-r from-red-500 to-rose-500 text-white",
    label: "🔥 Cao",
    order: 0
  },
  medium: { 
    color: "bg-gradient-to-r from-amber-500 to-brass-500 text-white",
    label: "⭐ TB",
    order: 1
  },
  low: { 
    color: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    label: "🌱 Thấp",
    order: 2
  }
};

const TIME_SLOTS = [
  { id: "morning_early", label: "Sáng sớm", time: "6h-9h", color: "from-rose/10 to-terracotta/10 border-rose/20" },
  { id: "morning", label: "Sáng", time: "9h-12h", color: "from-brass/10 to-coffee/10 border-brass/20" },
  { id: "noon", label: "Trưa", time: "12h-14h", color: "from-terracotta/10 to-ink/10 border-terracotta/20" },
  { id: "afternoon", label: "Chiều", time: "14h-17h", color: "from-rose/10 to-brass/10 border-rose/20" },
  { id: "evening", label: "Tối", time: "17h-21h", color: "from-coffee/10 to-terracotta/10 border-coffee/20" },
  { id: "night", label: "Đêm", time: "21h-24h", color: "from-ink/10 to-rose/10 border-ink/20" }
];

const ANIMATION_CONFIG = {
  duration: 300,
  stagger: 50,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)"
};

// Add CSS animations
const fadeInUpStyle = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = fadeInUpStyle;
  document.head.appendChild(styleSheet);
}

// Compact Header Component
const CompactHeader = ({ currentTimeSlot, animated }) => (
  <div className={`bg-gradient-to-r from-ink via-coffee to-terracotta text-white rounded-2xl p-4 text-center relative overflow-hidden transition-all duration-${ANIMATION_CONFIG.duration} ${ANIMATION_CONFIG.easing} ${
    animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
  }`}>
    <div className="flex items-center justify-center gap-3">
      <FaRegClock className="text-xl" />
      <span className="font-semibold">{currentTimeSlot}</span>
      <div className="w-2 h-2 bg-rose rounded-full animate-ping"></div>
    </div>
  </div>
);

// Quick Add Todo Component
const QuickAddTodo = ({ onAddTodo, animated }) => {
  const [quickText, setQuickText] = useState("");
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (quickText.trim()) {
      onAddTodo(quickText.trim(), "medium", "Sáng (9h-12h)");
      setQuickText("");
    }
  }, [quickText, onAddTodo]);

  return (
    <form onSubmit={handleSubmit} className={`transition-all duration-${ANIMATION_CONFIG.duration} ${ANIMATION_CONFIG.easing} ${
      animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="bg-white rounded-2xl shadow-lg border border-rose/10 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Thêm công việc nhanh..."
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-rose/20 rounded-xl focus:ring-2 focus:ring-rose/20 focus:border-rose transition-all"
            autoFocus
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-terracotta to-brass text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
          >
            <FaPlus className="text-sm" />
            Thêm
          </button>
        </div>
      </div>
    </form>
  );
};

// Schedule Grid Component - Main focus
const ScheduleGrid = ({ 
  todos, 
  currentTimeSlot, 
  onToggleTodo, 
  onDeleteTodo, 
  onSelectTodo, 
  animated,
  compactMode 
}) => {
  const getCurrentTimeSlotId = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 9) return "morning_early";
    if (hour < 12) return "morning";
    if (hour < 14) return "noon";
    if (hour < 17) return "afternoon";
    if (hour < 21) return "evening";
    return "night";
  }, []);

  const getTodosForSlot = useCallback((slotId) => {
    return todos.filter(todo => {
      const slotTime = `${TIME_SLOTS.find(s => s.id === slotId)?.label} (${TIME_SLOTS.find(s => s.id === slotId)?.time})`;
      return todo.timeSlot === slotTime;
    });
  }, [todos]);

  return (
    <div className={`transition-all duration-${ANIMATION_CONFIG.duration} ${ANIMATION_CONFIG.easing} ${
      animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="bg-white rounded-3xl shadow-xl border border-rose/10 overflow-hidden">
        <div className="p-4 border-b border-rose/10">
          <h2 className="text-xl font-bold text-ink flex items-center gap-2">
            <FaTasks className="text-rose" />
            Thời khóa biểu hôm nay
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {TIME_SLOTS.map((slot, index) => {
            const slotTodos = getTodosForSlot(slot.id);
            const isCurrentSlot = slot.id === getCurrentTimeSlotId();
            const completedCount = slotTodos.filter(t => t.completed).length;
            
            return (
              <div
                key={slot.id}
                className={`bg-gradient-to-br ${slot.color} rounded-2xl p-4 border-2 transition-all duration-${ANIMATION_CONFIG.duration} hover:shadow-lg ${
                  isCurrentSlot ? 'border-rose/40 shadow-lg' : 'border-rose/20'
                }`}
                style={{ 
                  animationDelay: `${index * ANIMATION_CONFIG.stagger}ms`,
                  animation: animated ? 'fadeInUp 0.5s ease-out forwards' : 'none'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {isCurrentSlot && <div className="w-2 h-2 bg-rose rounded-full animate-ping"></div>}
                    <h3 className={`font-bold ${isCurrentSlot ? 'text-rose' : 'text-ink'}`}>
                      {slot.label}
                    </h3>
                  </div>
                  <span className="text-sm text-coffee/60">{slot.time}</span>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {slotTodos.length === 0 ? (
                    <div className="text-center text-coffee/50 text-sm py-4">
                      Chưa có công việc
                    </div>
                  ) : (
                    slotTodos.slice(0, compactMode ? 2 : 4).map((todo) => (
                      <div
                        key={todo.id}
                        className={`bg-white/70 backdrop-blur-sm rounded-xl p-3 cursor-pointer transition-all hover:bg-white/90 hover:shadow-md ${
                          todo.completed ? 'opacity-60' : ''
                        }`}
                        onClick={() => onSelectTodo(todo)}
                      >
                        <div className="flex items-start gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleTodo(todo.id);
                            }}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${
                              todo.completed 
                                ? 'bg-brass border-brass text-white' 
                                : 'border-rose/30 hover:border-rose hover:bg-rose/10'
                            }`}
                          >
                            {todo.completed && <FaCheckCircle className="text-xs" />}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium leading-relaxed ${
                              todo.completed ? 'line-through text-coffee/60' : 'text-ink'
                            }`}>
                              {todo.text}
                            </p>
                            
                            <div className="flex items-center gap-1 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_CONFIG[todo.priority].color}`}>
                                {PRIORITY_CONFIG[todo.priority].label}
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTodo(todo.id);
                            }}
                            className="p-1 text-coffee/40 hover:text-rose hover:bg-rose/10 rounded transition-all flex-shrink-0"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {slotTodos.length > (compactMode ? 2 : 4) && (
                  <div className="mt-2 text-center">
                    <span className="text-xs text-coffee/60">
                      +{slotTodos.length - (compactMode ? 2 : 4)} công việc khác
                    </span>
                  </div>
                )}
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-coffee/60">
                    {completedCount}/{slotTodos.length} hoàn thành
                  </div>
                  <div className="w-full bg-coffee/20 rounded-full h-1.5 ml-2">
                    <div 
                      className="h-full bg-gradient-to-r from-rose to-terracotta rounded-full transition-all duration-500"
                      style={{ width: slotTodos.length > 0 ? `${(completedCount / slotTodos.length) * 100}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Focus Panel - Collapsible detail view
const FocusPanel = ({ selectedTodo, onUpdateTodo, onDeleteTodo, onClose, animated }) => {
  if (!selectedTodo) return null;

  return (
    <div className={`transition-all duration-${ANIMATION_CONFIG.duration} ${ANIMATION_CONFIG.easing} ${
      animated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
    }`}>
      <div className="bg-white rounded-3xl shadow-xl border border-rose/10 overflow-hidden">
        <div className="p-4 border-b border-rose/10 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink flex items-center gap-2">
            <FaStar className="text-rose" />
            Trọng tâm
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-coffee/40 hover:text-rose hover:bg-rose/10 rounded-lg transition-all"
          >
            <FaChevronUp className="text-sm" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpdateTodo(selectedTodo.id, { completed: !selectedTodo.completed })}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedTodo.completed ? 'bg-brass border-brass text-white' : 'border-rose/30 hover:border-rose hover:bg-rose/10'
              }`}
            >
              {selectedTodo.completed && <FaCheckCircle className="text-sm" />}
            </button>
            <div className="flex-1">
              <h4 className={`text-lg font-semibold ${selectedTodo.completed ? 'line-through text-coffee/60' : 'text-ink'}`}>
                {selectedTodo.text}
              </h4>
              <div className="mt-1 flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full ${PRIORITY_CONFIG[selectedTodo.priority].color}`}>
                  {PRIORITY_CONFIG[selectedTodo.priority].label}
                </span>
                <span className="text-xs text-coffee/60">{selectedTodo.timeSlot}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <select
              value={selectedTodo.priority}
              onChange={(e) => onUpdateTodo(selectedTodo.id, { priority: e.target.value })}
              className="px-3 py-2 border-2 border-rose/20 rounded-xl text-sm"
            >
              <option value="low">🌱 Thấp</option>
              <option value="medium">⭐ Trung bình</option>
              <option value="high">🔥 Cao</option>
            </select>
            <select
              value={selectedTodo.timeSlot}
              onChange={(e) => onUpdateTodo(selectedTodo.id, { timeSlot: e.target.value })}
              className="px-3 py-2 border-2 border-rose/20 rounded-xl text-sm"
            >
              {TIME_SLOTS.map(slot => (
                <option key={slot.id} value={`${slot.label} (${slot.time})`}>
                  {slot.label} ({slot.time})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onDeleteTodo(selectedTodo.id)}
              className="flex-1 px-4 py-2 rounded-xl border-2 border-rose/20 text-rose hover:bg-rose/5 transition-all text-sm"
            >
              Xóa
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl border-2 border-rose/20 hover:bg-rose/5 transition-all text-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Control Panel - Compact controls
const ControlPanel = ({ 
  compactMode, 
  onToggleCompact, 
  showFilters, 
  onToggleFilters, 
  onQuickAdd,
  animated 
}) => {
  return (
    <div className={`transition-all duration-${ANIMATION_CONFIG.duration} ${ANIMATION_CONFIG.easing} ${
      animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="bg-white rounded-2xl shadow-lg border border-rose/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onToggleCompact}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-rose/20 hover:bg-rose/5 transition-all text-sm"
          >
            {compactMode ? <FaEye className="text-sm" /> : <FaEyeSlash className="text-sm" />}
            {compactMode ? 'Mở rộng' : 'Thu gọn'}
          </button>
          
          <button
            onClick={onToggleFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-rose/20 hover:bg-rose/5 transition-all text-sm"
          >
            <FaFilter className="text-sm" />
            {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
          
          <button
            onClick={onQuickAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-terracotta to-brass text-white hover:shadow-lg transition-all text-sm"
          >
            <FaPlus className="text-sm" />
            Thêm nhanh
          </button>
        </div>
      </div>
    </div>
  );
};

// Main TodoList Component - Redesigned with Schedule Layout
function TodoList() {
  // Core state
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
  
  // UI state
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [compactMode, setCompactMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  // Animation state
  const [animatedElements, setAnimatedElements] = useState({
    header: false,
    controls: false,
    schedule: false,
    focus: false
  });

  // Animation refs
  const [headerRef, headerInView] = useInView({ threshold: 0.1, once: true });
  const [controlsRef, controlsInView] = useInView({ threshold: 0.1, once: true });
  const [scheduleRef, scheduleInView] = useInView({ threshold: 0.1, once: true });
  const [focusRef, focusInView] = useInView({ threshold: 0.1, once: true });

  // Animation effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedElements(prev => ({ ...prev, header: true }));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (controlsInView) {
      setAnimatedElements(prev => ({ ...prev, controls: true }));
    }
  }, [controlsInView]);

  useEffect(() => {
    if (scheduleInView) {
      setAnimatedElements(prev => ({ ...prev, schedule: true }));
    }
  }, [scheduleInView]);

  useEffect(() => {
    if (focusInView) {
      setAnimatedElements(prev => ({ ...prev, focus: true }));
    }
  }, [focusInView]);

  // Helper functions - Optimized with useCallback
  const handleToggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const handleDeleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    if (selectedTodo?.id === id) {
      setSelectedTodo(null);
    }
  }, [selectedTodo]);

  const handleUpdateTodo = useCallback((id, updates) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
    if (selectedTodo?.id === id) {
      setSelectedTodo(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedTodo]);

  const handleAddTodo = useCallback((text, priority = "medium", timeSlot = "Sáng (9h-12h)") => {
    const todo = {
      id: Date.now(),
      text,
      completed: false,
      priority,
      timeSlot,
      createdAt: new Date()
    };
    setTodos(prev => [...prev, todo]);
    setSelectedTodo(todo);
    setShowQuickAdd(false);
  }, []);

  const getCurrentTimeSlot = useCallback(() => {
    const hour = new Date().getHours();
    const slot = TIME_SLOTS.find(s => {
      const [start, end] = s.time.split('-').map(t => parseInt(t));
      return hour >= start && hour < end;
    });
    return slot ? `${slot.label} (${slot.time})` : "Sáng (9h-12h)";
  }, []);

  // Computed values - Memoized for performance
  const stats = useMemo(() => {
    const completed = todos.filter(todo => todo.completed).length;
    const total = todos.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, progress };
  }, [todos]);

  const currentTimeSlot = getCurrentTimeSlot();

  const today = new Date().toLocaleDateString('vi-VN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng! ☀️";
    if (hour < 17) return "Chào buổi chiều! 🌤️";
    return "Chào buổi tối! 🌙";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink/5 via-coffee/5 to-terracotta/5">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Compact Header */}
        <div ref={headerRef} className={`text-center space-y-4 transition-all duration-${ANIMATION_CONFIG.duration} ${ANIMATION_CONFIG.easing} ${
          animatedElements.header ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose/10 to-terracotta/10 px-4 py-2 rounded-full border border-rose/20">
            <FaTasks className="text-rose text-sm" />
            <span className="text-sm font-medium text-ink">Todo Hôm Nay</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            <span className="text-ink">Quản lý công việc</span>
            <br />
            <span className="bg-gradient-to-r from-rose via-terracotta to-brass bg-clip-text text-transparent">
              thông minh
            </span>
          </h1>
          
          <p className="text-lg text-coffee/80">
            {today} • {getGreeting()}
          </p>
        </div>

        {/* Current Time Slot */}
        <CompactHeader 
          currentTimeSlot={currentTimeSlot} 
          animated={animatedElements.header}
        />

        {/* Control Panel */}
        <div ref={controlsRef}>
          <ControlPanel
            compactMode={compactMode}
            onToggleCompact={() => setCompactMode(!compactMode)}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onQuickAdd={() => setShowQuickAdd(!showQuickAdd)}
            animated={animatedElements.controls}
          />
        </div>

        {/* Quick Add Form */}
        {showQuickAdd && (
          <QuickAddTodo
            onAddTodo={handleAddTodo}
            animated={animatedElements.controls}
          />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schedule Grid - Main Focus */}
          <div className="lg:col-span-2" ref={scheduleRef}>
            <ScheduleGrid
              todos={todos}
              currentTimeSlot={currentTimeSlot}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
                onSelectTodo={setSelectedTodo}
              animated={animatedElements.schedule}
              compactMode={compactMode}
              />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6" ref={focusRef}>
            {/* Stats Summary */}
            <div className={`bg-white rounded-3xl shadow-xl border border-rose/10 p-6 transition-all duration-${ANIMATION_CONFIG.duration} ${ANIMATION_CONFIG.easing} ${
              animatedElements.schedule ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <FaStar className="text-rose" />
                Tổng quan
              </h3>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gradient-to-br from-rose/10 to-terracotta/10 rounded-xl p-3 text-center border border-rose/20">
                  <div className="text-2xl font-bold text-rose">{stats.total}</div>
                  <div className="text-xs text-coffee/80">Tổng</div>
                </div>
                <div className="bg-gradient-to-br from-brass/10 to-coffee/10 rounded-xl p-3 text-center border border-brass/20">
                  <div className="text-2xl font-bold text-brass">{stats.completed}</div>
                  <div className="text-xs text-coffee/80">Xong</div>
                </div>
                <div className="bg-gradient-to-br from-terracotta/10 to-ink/10 rounded-xl p-3 text-center border border-terracotta/20">
                  <div className="text-2xl font-bold text-terracotta">{stats.total - stats.completed}</div>
                  <div className="text-xs text-coffee/80">Còn lại</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-coffee/80">
                  <span>Tiến độ</span>
                  <span>{stats.progress}%</span>
                </div>
                <div className="w-full bg-coffee/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose to-terracotta rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${stats.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Focus Panel */}
            <FocusPanel
              selectedTodo={selectedTodo}
              onUpdateTodo={handleUpdateTodo}
              onDeleteTodo={handleDeleteTodo}
              onClose={() => setSelectedTodo(null)}
              animated={animatedElements.focus}
            />
          </div>
        </div>

        {/* Empty State */}
        {todos.length === 0 && (
          <div className={`text-center py-12 transition-all duration-${ANIMATION_CONFIG.duration} ${ANIMATION_CONFIG.easing} ${
            animatedElements.schedule ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-rose/10 to-terracotta/10 rounded-full flex items-center justify-center border border-rose/20">
              <FaCheckCircle className="text-3xl text-rose" />
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">Chưa có công việc nào!</h3>
            <p className="text-coffee/60">Hãy thêm công việc đầu tiên của bạn ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Todo() {
  return <TodoList />;
}
