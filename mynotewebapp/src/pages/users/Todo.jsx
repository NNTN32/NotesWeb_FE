import { useState, useEffect, useMemo } from "react";
import { 
  FaPlus, 
  FaCheckCircle, 
  FaTrash, 
  FaRegClock,
  FaChevronDown,
  FaChevronUp,
  FaTasks,
  FaStar
} from "react-icons/fa";
import { useInView } from '../../utils/useInView';

// Enhanced priority system with warm colors matching Home page
const priorityColors = {
  high: "bg-gradient-to-r from-red-500 to-rose-500 text-white",
  medium: "bg-gradient-to-r from-amber-500 to-brass-500 text-white", 
  low: "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
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

// Time slot colors matching the warm theme
const timeSlotColors = {
  "Sáng sớm (6h-9h)": "from-rose/10 to-terracotta/10 border-rose/20",
  "Sáng (9h-12h)": "from-brass/10 to-coffee/10 border-brass/20", 
  "Trưa (12h-14h)": "from-terracotta/10 to-ink/10 border-terracotta/20",
  "Chiều (14h-17h)": "from-rose/10 to-brass/10 border-rose/20",
  "Tối (17h-21h)": "from-coffee/10 to-terracotta/10 border-coffee/20",
  "Đêm (21h-24h)": "from-ink/10 to-rose/10 border-ink/20"
};

// Component cho Current Time Slot
function CurrentTimeSlot({ currentTimeSlot, animatedElements }) {
  return (
    <div className={`bg-gradient-to-r from-ink via-coffee to-terracotta text-white rounded-3xl p-6 text-center relative overflow-hidden transition-all duration-1000 ease-out ${
      animatedElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 bg-white rounded-full animate-bounce"></div>
      </div>
      <div className="relative flex items-center justify-center gap-3">
        <FaRegClock className="text-2xl" />
        <span className="text-xl font-semibold">Khung giờ hiện tại: {currentTimeSlot}</span>
        <div className="w-3 h-3 bg-rose rounded-full animate-ping"></div>
      </div>
    </div>
  );
}

// Component cho Add Todo Form
function AddTodoForm({ 
  showAddForm, 
  setShowAddForm, 
  newTodo, 
  setNewTodo, 
  newPriority, 
  setNewPriority, 
  newTimeSlot, 
  setNewTimeSlot, 
  handleAddTodo, 
  timeSlots, 
  animatedElements 
}) {
  return (
    <div className={`transition-all duration-700 ease-out ${
      animatedElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="text-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="group bg-gradient-to-r from-terracotta to-brass text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-out flex items-center gap-2 mx-auto"
        >
          <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
          {showAddForm ? 'Đóng form' : 'Thêm công việc mới'}
        </button>
      </div>

      {showAddForm && (
        <div className="mt-6 bg-white rounded-3xl shadow-xl border border-rose/10 p-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Bạn muốn làm gì hôm nay? ✨"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="w-full px-6 py-4 border-2 border-rose/20 rounded-2xl focus:ring-4 focus:ring-rose/20 focus:border-rose text-lg transition-all bg-gradient-to-r from-rose/5 to-terracotta/5"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              autoFocus
            />
            <div className="flex gap-4">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-rose/20 rounded-2xl focus:ring-4 focus:ring-rose/20 focus:border-rose transition-all bg-gradient-to-r from-rose/5 to-terracotta/5"
              >
                <option value="low">🌱 Thấp</option>
                <option value="medium">⭐ Trung bình</option>
                <option value="high">🔥 Cao</option>
              </select>
              <select
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-rose/20 rounded-2xl focus:ring-4 focus:ring-rose/20 focus:border-rose transition-all bg-gradient-to-r from-rose/5 to-terracotta/5"
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddTodo}
                className="flex-1 bg-gradient-to-r from-terracotta to-brass text-white py-3 rounded-2xl hover:shadow-xl transition-all font-semibold"
              >
                Thêm công việc
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 border-2 border-rose/20 text-coffee rounded-2xl hover:border-rose hover:bg-rose/5 transition-all"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Component cho Todo List theo Time Slots
function TodoTimeSlots({ 
  timeSlots, 
  filteredTodosBySlot, 
  currentTimeSlot, 
  collapsedSections, 
  toggleSection, 
  viewCompact, 
  handleToggleTodo, 
  handleDeleteTodo, 
  setSelectedTodo, 
  priorityColors, 
  priorityLabels, 
  animatedElements 
}) {
  return (
    <div className={`space-y-6 transition-all duration-700 ease-out ${
      animatedElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      {timeSlots.map((timeSlot, index) => {
        const slotTodos = (filteredTodosBySlot && filteredTodosBySlot[timeSlot]) ? filteredTodosBySlot[timeSlot] : [];
        const isCurrentSlot = timeSlot === currentTimeSlot;
        const isCollapsed = collapsedSections[timeSlot];
        
        if (slotTodos.length === 0) return null;
        
        return (
          <div 
            key={timeSlot}
            className={`bg-white rounded-3xl shadow-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-2xl ${
              isCurrentSlot ? 'border-rose/30 bg-gradient-to-br from-rose/5 to-terracotta/5' : 'border-rose/10'
            }`}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <button
              onClick={() => toggleSection(timeSlot)}
              className="w-full p-6 flex items-center justify-between hover:bg-rose/5 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                {isCurrentSlot && <div className="w-3 h-3 bg-rose rounded-full animate-ping"></div>}
                <h3 className={`text-xl font-bold ${
                  isCurrentSlot ? 'text-rose' : 'text-ink'
                }`}>
                  {timeSlot}
                </h3>
                {isCurrentSlot && (
                  <span className="text-sm bg-rose text-white px-3 py-1 rounded-full">
                    Hiện tại
                  </span>
                )}
                <span className="text-sm bg-gradient-to-r from-rose/10 to-terracotta/10 text-coffee px-3 py-1 rounded-full border border-rose/20">
                  {slotTodos.length} công việc
                </span>
              </div>
              {isCollapsed ? <FaChevronDown className="text-rose" /> : <FaChevronUp className="text-rose" />}
            </button>
            
            {!isCollapsed && (
              <div className={`px-6 pb-6 space-y-3`}>
                {slotTodos.map((todo) => (
                  <div 
                    key={todo.id} 
                    className={`cursor-pointer ${viewCompact ? 'p-3' : 'p-4'} rounded-2xl border-2 transition-all duration-200 hover:shadow-lg ${
                      todo.completed 
                        ? 'bg-gradient-to-r from-brass/10 to-coffee/10 border-brass/20' 
                        : 'bg-gradient-to-r from-rose/5 to-terracotta/5 border-rose/20 hover:border-rose/30'
                    }`}
                    onClick={() => setSelectedTodo(todo)}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleTodo(todo.id); }}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-1 flex-shrink-0 ${
                          todo.completed 
                            ? 'bg-brass border-brass text-white' 
                            : 'border-rose/30 hover:border-rose hover:bg-rose/10'
                        }`}
                      >
                        {todo.completed && <FaCheckCircle className="text-sm" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <span className={`font-medium ${viewCompact ? 'text-base' : 'text-lg'} leading-relaxed ${
                          todo.completed 
                            ? 'line-through text-coffee/60' 
                            : 'text-ink'
                        }`}>
                          {todo.text}
                        </span>
                        
                        <div className={`flex items-center gap-2 mt-2 ${viewCompact ? 'text-[10px]' : ''}`}>
                          <span className={`text-xs px-3 py-1 rounded-full ${priorityColors[todo.priority]}`}>
                            {priorityLabels[todo.priority]}
                          </span>
                          {!viewCompact && (
                            <span className="text-xs text-coffee/60">{new Date(todo.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                          )}
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteTodo(todo.id); }}
                        className="p-2 text-coffee/40 hover:text-rose hover:bg-rose/10 rounded-lg transition-all flex-shrink-0"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Component chính TodoList
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
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [viewCompact, setViewCompact] = useState(false);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCompletion, setFilterCompletion] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("priority");
  
  // Collapsible states
  const [collapsedSections, setCollapsedSections] = useState({});
  const [showSummary, setShowSummary] = useState(true);
  const [animatedElements, setAnimatedElements] = useState({
    header: false,
    summary: false,
    addForm: false,
    timeSlots: false
  });

  // Animation refs
  const [headerRef, headerInView] = useInView({ threshold: 0.1, once: true });
  const [summaryRef, summaryInView] = useInView({ threshold: 0.1, once: true });
  const [addFormRef, addFormInView] = useInView({ threshold: 0.1, once: true });
  const [timeSlotsRef, timeSlotsInView] = useInView({ threshold: 0.1, once: true });

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Animation effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedElements(prev => ({ ...prev, header: true }));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (summaryInView) {
      setAnimatedElements(prev => ({ ...prev, summary: true }));
    }
  }, [summaryInView]);

  useEffect(() => {
    if (addFormInView) {
      setAnimatedElements(prev => ({ ...prev, addForm: true }));
    }
  }, [addFormInView]);

  useEffect(() => {
    if (timeSlotsInView) {
      setAnimatedElements(prev => ({ ...prev, timeSlots: true }));
    }
  }, [timeSlotsInView]);

  // Helper functions
  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
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
      setSelectedTodo(todo);
    }
  };

  // Computed values
  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;
  const progressPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  
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

  // collapse all sections by default except current time slot
  useEffect(() => {
    setCollapsedSections(prev => {
      if (Object.keys(prev).length > 0) return prev;
      const next = {};
      timeSlots.forEach(slot => {
        next[slot] = slot !== currentTimeSlot;
      });
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  const filteredTodosBySlot = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    const result = {};
    timeSlots.forEach(slot => {
      let slotTodos = todos.filter(t => t.timeSlot === slot);
      if (filterPriority !== "all") slotTodos = slotTodos.filter(t => t.priority === filterPriority);
      if (filterCompletion !== "all") slotTodos = slotTodos.filter(t => filterCompletion === "completed" ? t.completed : !t.completed);
      if (lowerSearch) slotTodos = slotTodos.filter(t => t.text.toLowerCase().includes(lowerSearch));
      const sorted = [...slotTodos].sort((a, b) => {
        if (sortBy === "priority") {
          const byPri = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (byPri !== 0) return byPri;
          return b.createdAt - a.createdAt;
        }
        if (sortBy === "createdAsc") return a.createdAt - b.createdAt;
        if (sortBy === "createdDesc") return b.createdAt - a.createdAt;
        return 0;
      });
      result[slot] = sorted;
    });
    return result;
  }, [todos, filterPriority, filterCompletion, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink/5 via-coffee/5 to-terracotta/5">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Enhanced Header Section */}
        <div ref={headerRef} className={`text-center space-y-6 transition-all duration-1000 ease-out ${
          animatedElements.header ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Welcome badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose/10 to-terracotta/10 px-4 py-2 rounded-full border border-rose/20">
            <FaTasks className="text-rose text-sm" />
            <span className="text-sm font-medium text-ink">Todo Hôm Nay</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-ink">Quản lý công việc</span>
            <br />
            <span className="bg-gradient-to-r from-rose via-terracotta to-brass bg-clip-text text-transparent">
              một cách thông minh
            </span>
          </h1>
          
          <p className="text-xl text-coffee/80 max-w-2xl mx-auto">
            {today} • {getGreeting()}
          </p>
        </div>

        {/* Main content grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-700 ease-out ${
          animatedElements.summary ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* Left list and controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Search and Filter Controls */}
            <div className="bg-white rounded-3xl shadow-xl border border-rose/10 p-4">
              <div className="flex flex-col md:flex-row gap-3 md:items-center">
                <div className="flex-1 flex items-center gap-3">
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm công việc..."
                    className="flex-1 px-4 py-3 border-2 border-rose/20 rounded-2xl focus:ring-4 focus:ring-rose/20 focus:border-rose transition-all"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-3 py-2 border-2 border-rose/20 rounded-2xl">
                    <option value="all">Tất cả mức độ</option>
                    <option value="high">Cao</option>
                    <option value="medium">Trung bình</option>
                    <option value="low">Thấp</option>
                  </select>
                  <select value={filterCompletion} onChange={(e) => setFilterCompletion(e.target.value)} className="px-3 py-2 border-2 border-rose/20 rounded-2xl">
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Chưa hoàn thành</option>
                    <option value="completed">Đã hoàn thành</option>
                  </select>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border-2 border-rose/20 rounded-2xl">
                    <option value="priority">Ưu tiên</option>
                    <option value="createdDesc">Mới nhất</option>
                    <option value="createdAsc">Cũ nhất</option>
                  </select>
                  <button onClick={() => setViewCompact(v => !v)} className="px-4 py-2 rounded-2xl border-2 border-rose/20 hover:bg-rose/5">
                    {viewCompact ? 'Chế độ đầy đủ' : 'Chế độ gọn nhẹ'}
                  </button>
                </div>
              </div>
            </div>

            {/* Current Time Slot */}
            <CurrentTimeSlot 
              currentTimeSlot={currentTimeSlot} 
              animatedElements={animatedElements.summary}
            />

            {/* Add Todo Form */}
            <AddTodoForm
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
              newTodo={newTodo}
              setNewTodo={setNewTodo}
              newPriority={newPriority}
              setNewPriority={setNewPriority}
              newTimeSlot={newTimeSlot}
              setNewTimeSlot={setNewTimeSlot}
              handleAddTodo={handleAddTodo}
              timeSlots={timeSlots}
              animatedElements={animatedElements.addForm}
            />

            {/* Todo List by Time Slots */}
            <TodoTimeSlots
              timeSlots={timeSlots}
              filteredTodosBySlot={filteredTodosBySlot}
              currentTimeSlot={currentTimeSlot}
              collapsedSections={collapsedSections}
              toggleSection={toggleSection}
              viewCompact={viewCompact}
              handleToggleTodo={handleToggleTodo}
              handleDeleteTodo={handleDeleteTodo}
              setSelectedTodo={setSelectedTodo}
              priorityColors={priorityColors}
              priorityLabels={priorityLabels}
              animatedElements={animatedElements.timeSlots}
            />
          </div>

          {/* Right focus & summary */}
          <div className="lg:col-span-5 space-y-6">
            <div ref={summaryRef} className={`transition-all duration-700 ease-out ${
              animatedElements.summary ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="bg-white rounded-3xl shadow-xl border border-rose/10 overflow-hidden">
            <button
              onClick={() => setShowSummary(!showSummary)}
                  className="w-full p-5 flex items-center justify-between hover:bg-rose/5 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-gradient-to-br from-rose to-terracotta shadow-lg">
                  <FaStar className="text-white text-xl" />
                </div>
                <div className="text-left">
                      <h2 className="text-xl font-bold text-ink">Tổng quan hôm nay</h2>
                  <p className="text-coffee/60">Tiến độ: {progressPercentage}% hoàn thành</p>
                </div>
              </div>
              {showSummary ? <FaChevronUp className="text-rose" /> : <FaChevronDown className="text-rose" />}
            </button>
            
            {showSummary && (
                  <div className="px-5 pb-5 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-rose/10 to-terracotta/10 rounded-2xl p-4 text-center border border-rose/20">
                    <div className="text-3xl font-bold text-rose">{totalTodos}</div>
                    <div className="text-sm text-coffee/80">Tổng cộng</div>
                  </div>
                  <div className="bg-gradient-to-br from-brass/10 to-coffee/10 rounded-2xl p-4 text-center border border-brass/20">
                    <div className="text-3xl font-bold text-brass">{completedTodos}</div>
                    <div className="text-sm text-coffee/80">Hoàn thành</div>
                  </div>
                  <div className="bg-gradient-to-br from-terracotta/10 to-ink/10 rounded-2xl p-4 text-center border border-terracotta/20">
                    <div className="text-3xl font-bold text-terracotta">{totalTodos - completedTodos}</div>
                    <div className="text-sm text-coffee/80">Còn lại</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-coffee/80">
                    <span>Tiến độ hoàn thành</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-coffee/20 rounded-full h-3 overflow-hidden">
                    <div 
                          className="h-full bg-gradient-to-r from-rose to-terracotta rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
              </div>
            </div>

            {/* Focus Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-rose/10 p-6">
              <h3 className="text-xl font-bold text-ink mb-4">Trọng tâm hôm nay</h3>
              {!selectedTodo ? (
                <div className="text-coffee/70">Chọn một công việc ở danh sách để xem chi tiết.</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTodo(selectedTodo.id)}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedTodo.completed ? 'bg-brass border-brass text-white' : 'border-rose/30 hover:border-rose hover:bg-rose/10'
                      }`}
                    >
                      {selectedTodo.completed && <FaCheckCircle className="text-sm" />}
                    </button>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-ink break-words">{selectedTodo.text}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full ${priorityColors[selectedTodo.priority]}`}>{priorityLabels[selectedTodo.priority]}</span>
                        <span className="text-xs text-coffee/60">{selectedTodo.timeSlot}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={selectedTodo.priority}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTodos(prev => prev.map(t => t.id === selectedTodo.id ? { ...t, priority: value } : t));
                        setSelectedTodo(prev => prev ? { ...prev, priority: value } : prev);
                      }}
                      className="px-4 py-3 border-2 border-rose/20 rounded-2xl"
                    >
                      <option value="low">🌱 Thấp</option>
                      <option value="medium">⭐ Trung bình</option>
                      <option value="high">🔥 Cao</option>
                    </select>
                    <select
                      value={selectedTodo.timeSlot}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTodos(prev => prev.map(t => t.id === selectedTodo.id ? { ...t, timeSlot: value } : t));
                        setSelectedTodo(prev => prev ? { ...prev, timeSlot: value } : prev);
                      }}
                      className="px-4 py-3 border-2 border-rose/20 rounded-2xl"
                    >
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDeleteTodo(selectedTodo.id)}
                      className="flex-1 px-4 py-3 rounded-2xl border-2 border-rose/20 text-rose hover:bg-rose/5"
                    >
                      Xóa
                    </button>
                    <button
                      onClick={() => setSelectedTodo(null)}
                      className="flex-1 px-4 py-3 rounded-2xl border-2 border-rose/20 hover:bg-rose/5"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {todos.length === 0 && (
          <div className={`text-center py-16 transition-all duration-1000 ease-out ${
            animatedElements.timeSlots ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '800ms' }}>
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-rose/10 to-terracotta/10 rounded-full flex items-center justify-center border border-rose/20">
              <FaCheckCircle className="text-4xl text-rose" />
            </div>
            <h3 className="text-2xl font-bold text-ink mb-2">Chưa có công việc nào!</h3>
            <p className="text-coffee/60 text-lg">Hãy bắt đầu với todo đầu tiên của bạn hôm nay ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Todo() {
  return <TodoList />;
}
