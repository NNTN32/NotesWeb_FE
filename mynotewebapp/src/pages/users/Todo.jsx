import { useState } from "react";
import { FaPlus, FaCheckCircle, FaCalendarAlt, FaTrash, FaEdit } from "react-icons/fa";

const priorityColors = {
  high: "bg-rose text-ink border-rose",
  medium: "bg-sand text-terracotta border-sand",
  low: "bg-latte text-ink border-latte"
};

const priorityLabels = {
  high: "Cao",
  medium: "Trung bình", 
  low: "Thấp"
};

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Hoàn thành bài viết về Web3", completed: false, priority: "high", dueDate: "2024-01-15" },
    { id: 2, text: "Ôn tập React hooks", completed: true, priority: "medium", dueDate: "2024-01-10" },
    { id: 3, text: "Lên kế hoạch cho dự án mới", completed: false, priority: "high", dueDate: "2024-01-20" },
    { id: 4, text: "Đọc sách về AI", completed: false, priority: "low", dueDate: "2024-01-25" },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newDueDate, setNewDueDate] = useState("");

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
        dueDate: newDueDate || new Date().toISOString().split('T')[0]
      };
      setTodos([...todos, todo]);
      setNewTodo("");
      setNewPriority("medium");
      setNewDueDate("");
    }
  };

  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Todo List</h2>
          <p className="text-gray-700">Quản lý công việc và dự án của bạn</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-terracotta">{completedTodos}/{totalTodos}</div>
          <div className="text-sm text-gray-500">Hoàn thành</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Tiến độ tổng thể</span>
          <span className="text-sm text-gray-500">{Math.round((completedTodos / totalTodos) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-terracotta to-brass h-3 rounded-full transition-all duration-500"
            style={{ width: `${totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {/* Add New Todo */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm todo mới</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Nhập công việc cần làm..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brass focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brass focus:border-transparent"
          >
            <option value="low">Ưu tiên thấp</option>
            <option value="medium">Ưu tiên trung bình</option>
            <option value="high">Ưu tiên cao</option>
          </select>
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brass focus:border-transparent"
          />
          <button
            onClick={handleAddTodo}
            className="px-6 py-3 bg-gradient-to-r from-terracotta to-brass text-white rounded-lg hover:opacity-95 transition-colors flex items-center gap-2 font-medium"
          >
            <FaPlus />
            Thêm
          </button>
        </div>
      </div>

      {/* Todo List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh sách công việc</h3>
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaCheckCircle className="text-4xl mx-auto mb-3 text-gray-300" />
              <p>Chưa có công việc nào. Hãy thêm todo đầu tiên!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div 
                key={todo.id} 
                className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  todo.completed 
                    ? 'bg-sand border-sand' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      todo.completed 
                        ? 'bg-olive border-olive text-white' 
                        : 'border-gray-300 hover:border-terracotta'
                    }`}
                  >
                    {todo.completed && <FaCheckCircle className="text-sm" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <span className={`font-medium text-lg ${
                      todo.completed 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-900'
                    }`}>
                      {todo.text}
                    </span>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[todo.priority]}`}>
                        {priorityLabels[todo.priority]}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <FaCalendarAlt />
                        {todo.dueDate}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-terracotta hover:bg-sand rounded-lg transition-colors">
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-terracotta mb-2">{totalTodos}</div>
          <div className="text-sm text-gray-600">Tổng cộng</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-olive mb-2">{completedTodos}</div>
          <div className="text-sm text-gray-600">Đã hoàn thành</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-rose mb-2">{todos.filter(t => t.priority === 'high').length}</div>
          <div className="text-sm text-gray-600">Ưu tiên cao</div>
        </div>
      </div>
    </div>
  );
}

export default function Todo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-paper via-sand to-latte px-8 py-12">
      <TodoList />
    </div>
  );
}
