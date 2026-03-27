import { useState, useMemo, useCallback } from "react";
import {
  FaPlus,
  FaCheckCircle,
  FaTrash,
  FaRegClock,
  FaChevronUp,
  FaTasks,
  FaStar,
  FaEye,
  FaEyeSlash,
  FaFilter,
} from "react-icons/fa";

const PRIORITY_CONFIG = {
  high: {
    color: "bg-gradient-to-r from-red-500 to-rose-500 text-white",
    label: "🔥 Cao",
    order: 0,
  },
  medium: {
    color: "bg-gradient-to-r from-amber-500 to-brass-500 text-white",
    label: "⭐ Trung bình",
    order: 1,
  },
  low: {
    color: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    label: "🌱 Thấp",
    order: 2,
  },
};

const TIME_SLOTS = [
  { id: "morning_early", label: "Sáng sớm", time: "6h-9h", color: "from-rose/10 to-terracotta/10 border-rose/20" },
  { id: "morning", label: "Sáng", time: "9h-12h", color: "from-brass/10 to-coffee/10 border-brass/20" },
  { id: "noon", label: "Trưa", time: "12h-14h", color: "from-terracotta/10 to-ink/10 border-terracotta/20" },
  { id: "afternoon", label: "Chiều", time: "14h-17h", color: "from-rose/10 to-brass/10 border-rose/20" },
  { id: "evening", label: "Tối", time: "17h-21h", color: "from-coffee/10 to-terracotta/10 border-coffee/20" },
  { id: "night", label: "Đêm", time: "21h-24h", color: "from-ink/10 to-rose/10 border-ink/20" },
];

const SECTION_ANIM = "transition-all duration-300 ease-out";

const getSlotValue = (slot) => `${slot.label} (${slot.time})`;

const getCurrentSlotId = () => {
  const hour = new Date().getHours();
  if (hour < 9) return "morning_early";
  if (hour < 12) return "morning";
  if (hour < 14) return "noon";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
};

const getCurrentSlotLabel = () => {
  const currentId = getCurrentSlotId();
  const slot = TIME_SLOTS.find((item) => item.id === currentId);
  return slot ? getSlotValue(slot) : getSlotValue(TIME_SLOTS[1]);
};

const matchQuery = (todo, query) => {
  if (!query) return true;
  return todo.text.toLowerCase().includes(query.toLowerCase());
};

function TopHeader({ currentTimeSlot, currentMode }) {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`${SECTION_ANIM} animate-fadeInUp`}>
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose/10 to-terracotta/10 px-4 py-2 rounded-full border border-rose/20">
          <FaTasks className="text-rose text-sm" />
          <span className="text-sm font-medium text-ink">
            {currentMode === "expanded" ? "Focus Mode" : "Dashboard Mode"}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-ink">
          Kế hoạch hôm nay rõ ràng
        </h1>
        <p className="text-coffee/80">
          {today} • Mốc hiện tại: <span className="font-semibold">{currentTimeSlot}</span>
        </p>
      </div>
    </div>
  );
}

function ControlBar({
  currentMode,
  onToggleMode,
  showFilters,
  onToggleFilters,
  showQuickAdd,
  onToggleQuickAdd,
}) {
  const isExpanded = currentMode === "expanded";

  return (
    <div className={`${SECTION_ANIM} animate-fadeInUp`}>
      <div className="bg-white rounded-2xl shadow-lg border border-rose/10 p-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onToggleMode}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-rose/20 hover:bg-rose/5 transition-all text-sm"
        >
          {isExpanded ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
          {isExpanded ? "Thu gọn" : "Mở rộng"}
        </button>

        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-rose/20 hover:bg-rose/5 transition-all text-sm"
        >
          <FaFilter className="text-sm" />
          {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
        </button>

        <button
          onClick={onToggleQuickAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-terracotta to-brass text-white hover:shadow-lg transition-all text-sm"
        >
          <FaPlus className="text-sm" />
          {showQuickAdd ? "Đóng thêm nhanh" : "Thêm nhanh"}
        </button>
      </div>
    </div>
  );
}

function QuickAddTodo({ onAddTodo }) {
  const [quickText, setQuickText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [timeSlot, setTimeSlot] = useState(getSlotValue(TIME_SLOTS[1]));

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const value = quickText.trim();
      if (!value) return;
      onAddTodo(value, priority, timeSlot);
      setQuickText("");
    },
    [onAddTodo, priority, quickText, timeSlot]
  );

  return (
    <form onSubmit={handleSubmit} className={`${SECTION_ANIM} animate-fadeInUp`}>
      <div className="bg-white rounded-2xl shadow-lg border border-rose/10 p-4 space-y-3">
        <input
          type="text"
          placeholder="Thêm công việc nhanh..."
          value={quickText}
          onChange={(event) => setQuickText(event.target.value)}
          className="w-full px-4 py-2 border-2 border-rose/20 rounded-xl focus:ring-2 focus:ring-rose/20 focus:border-rose transition-all"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="px-3 py-2 border-2 border-rose/20 rounded-xl text-sm"
          >
            <option value="high">🔥 Cao</option>
            <option value="medium">⭐ Trung bình</option>
            <option value="low">🌱 Thấp</option>
          </select>

          <select
            value={timeSlot}
            onChange={(event) => setTimeSlot(event.target.value)}
            className="px-3 py-2 border-2 border-rose/20 rounded-xl text-sm sm:col-span-2"
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot.id} value={getSlotValue(slot)}>
                {getSlotValue(slot)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto bg-gradient-to-r from-terracotta to-brass text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <FaPlus className="text-sm" />
          Thêm công việc
        </button>
      </div>
    </form>
  );
}

function Filters({ filters, onChange, onReset }) {
  return (
    <div className={`${SECTION_ANIM} animate-fadeInUp`}>
      <div className="bg-white rounded-2xl shadow-lg border border-rose/10 p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          value={filters.query}
          onChange={(event) => onChange("query", event.target.value)}
          placeholder="Tìm theo nội dung..."
          className="px-3 py-2 border-2 border-rose/20 rounded-xl text-sm md:col-span-2"
        />
        <select
          value={filters.priority}
          onChange={(event) => onChange("priority", event.target.value)}
          className="px-3 py-2 border-2 border-rose/20 rounded-xl text-sm"
        >
          <option value="all">Mọi mức ưu tiên</option>
          <option value="high">🔥 Cao</option>
          <option value="medium">⭐ Trung bình</option>
          <option value="low">🌱 Thấp</option>
        </select>
        <select
          value={filters.status}
          onChange={(event) => onChange("status", event.target.value)}
          className="px-3 py-2 border-2 border-rose/20 rounded-xl text-sm"
        >
          <option value="all">Mọi trạng thái</option>
          <option value="open">Chưa xong</option>
          <option value="done">Đã xong</option>
        </select>
        <button
          onClick={onReset}
          type="button"
          className="md:col-span-4 px-4 py-2 rounded-xl border-2 border-rose/20 text-rose hover:bg-rose/5 transition-all text-sm"
        >
          Đặt lại bộ lọc
        </button>
      </div>
    </div>
  );
}

function TodoCard({ todo, onToggleTodo, onDeleteTodo, onSelectTodo }) {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-xl p-3 cursor-pointer transition-all hover:bg-white hover:shadow-md ${
        todo.completed ? "opacity-60" : ""
      }`}
      onClick={() => onSelectTodo(todo)}
    >
      <div className="flex items-start gap-2">
        <button
          onClick={(event) => {
            event.stopPropagation();
            onToggleTodo(todo.id);
          }}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${
            todo.completed
              ? "bg-brass border-brass text-white"
              : "border-rose/30 hover:border-rose hover:bg-rose/10"
          }`}
        >
          {todo.completed && <FaCheckCircle className="text-xs" />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-relaxed ${todo.completed ? "line-through text-coffee/60" : "text-ink"}`}>
            {todo.text}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_CONFIG[todo.priority].color}`}>
              {PRIORITY_CONFIG[todo.priority].label}
            </span>
            <span className="text-xs text-coffee/60">{todo.timeSlot}</span>
          </div>
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onDeleteTodo(todo.id);
          }}
          className="p-1 text-coffee/40 hover:text-rose hover:bg-rose/10 rounded transition-all flex-shrink-0"
        >
          <FaTrash className="text-xs" />
        </button>
      </div>
    </div>
  );
}

function ScheduleGrid({ todos, compactMode, onToggleTodo, onDeleteTodo, onSelectTodo }) {
  const currentId = getCurrentSlotId();

  return (
    <div className={`${SECTION_ANIM} animate-fadeInUp`}>
      <div className="bg-white rounded-3xl shadow-xl border border-rose/10 overflow-hidden">
        <div className="p-4 border-b border-rose/10">
          <h2 className="text-xl font-bold text-ink flex items-center gap-2">
            <FaTasks className="text-rose" />
            Thời khóa biểu hôm nay
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
          {TIME_SLOTS.map((slot, index) => {
            const slotValue = getSlotValue(slot);
            const slotTodos = todos.filter((todo) => todo.timeSlot === slotValue);
            const completedCount = slotTodos.filter((todo) => todo.completed).length;
            const visibleTodos = slotTodos.slice(0, compactMode ? 2 : 4);
            const isCurrentSlot = slot.id === currentId;

            return (
              <article
                key={slot.id}
                className={`bg-gradient-to-br ${slot.color} rounded-2xl p-4 border-2 transition-all duration-300 hover:shadow-lg ${
                  isCurrentSlot ? "border-rose/40 shadow-lg" : "border-rose/20"
                }`}
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {isCurrentSlot ? <span className="w-2 h-2 bg-rose rounded-full animate-ping" /> : null}
                    <h3 className={`font-bold ${isCurrentSlot ? "text-rose" : "text-ink"}`}>{slot.label}</h3>
                  </div>
                  <span className="text-sm text-coffee/60">{slot.time}</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {visibleTodos.length === 0 ? (
                    <div className="text-center text-coffee/50 text-sm py-4">Chưa có công việc</div>
                  ) : (
                    visibleTodos.map((todo) => (
                      <TodoCard
                        key={todo.id}
                        todo={todo}
                        onToggleTodo={onToggleTodo}
                        onDeleteTodo={onDeleteTodo}
                        onSelectTodo={onSelectTodo}
                      />
                    ))
                  )}
                </div>

                {slotTodos.length > visibleTodos.length ? (
                  <p className="mt-2 text-xs text-coffee/60 text-center">
                    +{slotTodos.length - visibleTodos.length} công việc khác
                  </p>
                ) : null}

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-coffee/60">
                    {completedCount}/{slotTodos.length} hoàn thành
                  </span>
                  <div className="w-full bg-coffee/20 rounded-full h-1.5">
                    <div
                      className="h-full bg-gradient-to-r from-rose to-terracotta rounded-full transition-all duration-500"
                      style={{ width: slotTodos.length ? `${(completedCount / slotTodos.length) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ExpandedDayView({ todos, onToggleTodo, onDeleteTodo, onSelectTodo }) {
  return (
    <section className={`${SECTION_ANIM} animate-fadeInUp`}>
      <div className="bg-white rounded-3xl shadow-xl border border-rose/10 overflow-hidden min-h-[64vh]">
        <div className="p-5 border-b border-rose/10 bg-gradient-to-r from-ink via-coffee to-terracotta text-white">
          <h2 className="text-2xl font-bold">Danh sách công việc trong ngày</h2>
          <p className="text-white/85 text-sm mt-1">
            Chế độ mở rộng giúp tập trung vào danh sách lớn, ẩn các phần phụ để tránh nhiễu.
          </p>
        </div>

        <div className="p-5 space-y-3 max-h-[68vh] overflow-y-auto">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-semibold text-ink">Không có công việc phù hợp</p>
              <p className="text-coffee/60 mt-2">Thử điều chỉnh bộ lọc hoặc thêm công việc mới.</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className="border border-rose/15 rounded-2xl p-4 hover:shadow-md transition-all">
                <TodoCard todo={todo} onToggleTodo={onToggleTodo} onDeleteTodo={onDeleteTodo} onSelectTodo={onSelectTodo} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function StatsPanel({ stats }) {
  return (
    <aside className={`${SECTION_ANIM} animate-fadeInUp`}>
      <div className="bg-white rounded-3xl shadow-xl border border-rose/10 p-6">
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
            <div className="text-2xl font-bold text-terracotta">{stats.remaining}</div>
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
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

function FocusPanel({ selectedTodo, onUpdateTodo, onDeleteTodo, onClose }) {
  if (!selectedTodo) return null;

  return (
    <div className={`${SECTION_ANIM} animate-fadeInUp`}>
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
                selectedTodo.completed
                  ? "bg-brass border-brass text-white"
                  : "border-rose/30 hover:border-rose hover:bg-rose/10"
              }`}
            >
              {selectedTodo.completed && <FaCheckCircle className="text-sm" />}
            </button>
            <div className="flex-1">
              <h4 className={`text-lg font-semibold ${selectedTodo.completed ? "line-through text-coffee/60" : "text-ink"}`}>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={selectedTodo.priority}
              onChange={(event) => onUpdateTodo(selectedTodo.id, { priority: event.target.value })}
              className="px-3 py-2 border-2 border-rose/20 rounded-xl text-sm"
            >
              <option value="low">🌱 Thấp</option>
              <option value="medium">⭐ Trung bình</option>
              <option value="high">🔥 Cao</option>
            </select>
            <select
              value={selectedTodo.timeSlot}
              onChange={(event) => onUpdateTodo(selectedTodo.id, { timeSlot: event.target.value })}
              className="px-3 py-2 border-2 border-rose/20 rounded-xl text-sm"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot.id} value={getSlotValue(slot)}>
                  {getSlotValue(slot)}
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
}

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Tập thể dục buổi sáng", completed: false, priority: "high", timeSlot: getSlotValue(TIME_SLOTS[0]), createdAt: new Date() },
    { id: 2, text: "Đọc sách 30 phút", completed: true, priority: "medium", timeSlot: getSlotValue(TIME_SLOTS[1]), createdAt: new Date() },
    { id: 3, text: "Làm việc nhà", completed: false, priority: "low", timeSlot: getSlotValue(TIME_SLOTS[3]), createdAt: new Date() },
  ]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [layoutMode, setLayoutMode] = useState("collapsed");
  const [compactMode, setCompactMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [filters, setFilters] = useState({ query: "", priority: "all", status: "all" });

  const handleToggleTodo = useCallback((id) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  }, []);

  const handleDeleteTodo = useCallback(
    (id) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      if (selectedTodo?.id === id) setSelectedTodo(null);
    },
    [selectedTodo]
  );

  const handleUpdateTodo = useCallback(
    (id, updates) => {
      setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)));
      if (selectedTodo?.id === id) {
        setSelectedTodo((prev) => (prev ? { ...prev, ...updates } : null));
      }
    },
    [selectedTodo]
  );

  const handleAddTodo = useCallback((text, priority, timeSlot) => {
    const todo = {
      id: Date.now(),
      text,
      completed: false,
      priority,
      timeSlot,
      createdAt: new Date(),
    };
    setTodos((prev) => [todo, ...prev]);
    setSelectedTodo(todo);
    setShowQuickAdd(false);
  }, []);

  const filteredTodos = useMemo(() => {
    return [...todos]
      .filter((todo) => matchQuery(todo, filters.query))
      .filter((todo) => (filters.priority === "all" ? true : todo.priority === filters.priority))
      .filter((todo) => {
        if (filters.status === "done") return todo.completed;
        if (filters.status === "open") return !todo.completed;
        return true;
      })
      .sort((a, b) => {
        const slotA = TIME_SLOTS.findIndex((slot) => getSlotValue(slot) === a.timeSlot);
        const slotB = TIME_SLOTS.findIndex((slot) => getSlotValue(slot) === b.timeSlot);
        if (slotA !== slotB) return slotA - slotB;

        const prioA = PRIORITY_CONFIG[a.priority].order;
        const prioB = PRIORITY_CONFIG[b.priority].order;
        if (prioA !== prioB) return prioA - prioB;

        return Number(a.completed) - Number(b.completed);
      });
  }, [filters, todos]);

  const stats = useMemo(() => {
    const total = filteredTodos.length;
    const completed = filteredTodos.filter((todo) => todo.completed).length;
    const remaining = total - completed;
    const progress = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, remaining, progress };
  }, [filteredTodos]);

  const currentTimeSlot = getCurrentSlotLabel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink/5 via-coffee/5 to-terracotta/5">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <TopHeader currentTimeSlot={currentTimeSlot} currentMode={layoutMode} />

        <div className={`${SECTION_ANIM} animate-fadeInUp`}>
          <div className="bg-gradient-to-r from-ink via-coffee to-terracotta text-white rounded-2xl p-4 text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-3">
              <FaRegClock className="text-xl" />
              <span className="font-semibold">{currentTimeSlot}</span>
              <span className="w-2 h-2 bg-rose rounded-full animate-ping" />
            </div>
          </div>
        </div>

        <ControlBar
          currentMode={layoutMode}
          onToggleMode={() => setLayoutMode((prev) => (prev === "collapsed" ? "expanded" : "collapsed"))}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((prev) => !prev)}
          showQuickAdd={showQuickAdd}
          onToggleQuickAdd={() => setShowQuickAdd((prev) => !prev)}
        />

        <div className={`${SECTION_ANIM} animate-fadeInUp`}>
          <button
            onClick={() => setCompactMode((prev) => !prev)}
            className="px-4 py-2 rounded-xl border-2 border-rose/20 hover:bg-rose/5 transition-all text-sm"
          >
            {compactMode ? "Danh sách chi tiết hơn" : "Hiển thị ít hơn trong từng khung giờ"}
          </button>
        </div>

        {showFilters ? (
          <Filters
            filters={filters}
            onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
            onReset={() => setFilters({ query: "", priority: "all", status: "all" })}
          />
        ) : null}

        {showQuickAdd ? <QuickAddTodo onAddTodo={handleAddTodo} /> : null}

        {layoutMode === "expanded" ? (
          <ExpandedDayView
            todos={filteredTodos}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onSelectTodo={setSelectedTodo}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ScheduleGrid
                todos={filteredTodos}
                compactMode={compactMode}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
                onSelectTodo={setSelectedTodo}
              />
            </div>
            <div className="space-y-6">
              <StatsPanel stats={stats} />
              <FocusPanel
                selectedTodo={selectedTodo}
                onUpdateTodo={handleUpdateTodo}
                onDeleteTodo={handleDeleteTodo}
                onClose={() => setSelectedTodo(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Todo() {
  return <TodoList />;
}
