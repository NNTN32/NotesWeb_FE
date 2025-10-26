import { Link, useLocation } from "react-router-dom";
import { 
  FaRegStickyNote, 
  FaPlusCircle, 
  FaSignInAlt, 
  FaUserPlus, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaSearch,
  FaBell,
  FaCog,
  FaTasks,
  FaBookOpen,
  FaRobot,
  FaChartLine,
  FaLightbulb,
  FaUsers,
  FaCalendarAlt,
  FaStar,
  FaHome
} from "react-icons/fa";
import { useContext, useState, useCallback, memo } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const navItems = [
  { to: "/", label: "Trang chủ", icon: <FaHome /> },
  { to: "/create", label: "Tạo ghi chú", icon: <FaPlusCircle /> },
  { to: "/todo", label: "Todo", icon: <FaTasks /> },
  { to: "/weekly-plan", label: "Weekly Plan", icon: <FaCalendarAlt /> },
];

const quickActions = [
  { icon: <FaRegStickyNote />, title: "Ghi chú mới", link: "/create" },
  { icon: <FaTasks />, title: "Todo mới", link: "/todo" },
  { icon: <FaBookOpen />, title: "Tài liệu", link: "/docs" },
  { icon: <FaUsers />, title: "Chia sẻ", link: "/share" },
];

function SideMenu() {
  const { user, logout } = useContext(AuthContext) || {};
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen(prev => !prev);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-terracotta text-white rounded-lg shadow-lg hover:bg-brass transition-colors"
      >
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Side Menu */}
      <aside className={`
        fixed left-0 top-0 h-full bg-gradient-to-b from-ink via-coffee to-terracotta 
        shadow-2xl z-30 transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-20'} 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
     `}>
        {/* Logo Section */}
        <div className="p-3 sm:p-4 border-b border-white/20">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 text-white">
            <span className="p-1.5 sm:p-2 rounded-full bg-white/10 shadow-lg">
              <FaRegStickyNote className="text-rose text-lg sm:text-xl" />
            </span>
            {isOpen && (
              <span className="bg-gradient-to-r from-brass via-rose to-terracotta bg-clip-text text-transparent font-bold text-base sm:text-lg">
                MyNoteWeb3
              </span>
            )}
          </Link>
        </div>

        {/* Search Bar */}
        {isOpen && (
          <div className="p-3 sm:p-4 border-b border-white/20">
            <div className="relative">
              <FaSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-xs sm:text-sm" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-brass focus:border-transparent text-xs sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={toggleMenu}
          className="hidden lg:block absolute -right-3 top-16 sm:top-20 bg-terracotta text-white p-1.5 rounded-full shadow-lg hover:bg-brass transition-colors"
        >
          {isOpen ? <FaTimes size={12} /> : <FaBars size={12} />}
        </button>

        {/* Navigation Items */}
        <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2">
          {navItems.map((item) => (
              <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileOpen(false)}
              className={`
                flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 
                hover:bg-white/20 hover:scale-105 text-white font-semibold shadow-md text-sm sm:text-base
                ${location.pathname === item.to ? "bg-white/20 border-l-4 border-terracotta" : ""}
                ${!isOpen ? "px-2" : ""}
              `}
            >
              <span className="text-base sm:text-lg min-w-[16px] sm:min-w-[20px]">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-white/20">
          {user ? (
            <div className="space-y-2">
              {/* User Profile */}
              <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white/10 rounded-lg ${!isOpen ? "justify-center px-2" : ""}`}>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-rose rounded-full flex items-center justify-center text-ink font-semibold text-xs sm:text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                {isOpen && (
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-xs sm:text-sm truncate">
                      {user.name || 'User'}
                    </div>
                    <div className="text-white/60 text-xs truncate">
                      {user.email || 'user@example.com'}
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Actions */}
              <div className={`flex items-center gap-1 sm:gap-2 ${!isOpen ? "justify-center" : ""}`}>
                <button 
                  onClick={toggleTheme}
                  className="flex-1 p-1.5 sm:p-2 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors"
                  title={theme === 'light' ? 'Chuyển sang Dark Mode' : 'Chuyển sang Light Mode'}
                >
                  {theme === 'light' ? (
                    <FaMoon className="text-xs sm:text-sm mx-auto" />
                  ) : (
                    <FaSun className="text-xs sm:text-sm mx-auto" />
                  )}
                </button>
                <button className="flex-1 p-1.5 sm:p-2 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors">
                  <FaBell className="text-xs sm:text-sm mx-auto" />
                </button>
                <button className="flex-1 p-1.5 sm:p-2 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors">
                  <FaCog className="text-xs sm:text-sm mx-auto" />
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileOpen(false);
                  }}
                  className="flex-1 p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg text-red-200 hover:text-red-100 transition-colors"
                >
                  <FaSignOutAlt className="text-xs sm:text-sm mx-auto" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button 
                onClick={toggleTheme}
                className={`
                  w-full flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-white/20 
                  text-white transition-all duration-300 hover:scale-105 font-semibold shadow-md text-sm sm:text-base
                  ${!isOpen ? "px-2" : ""}
                `}
                title={theme === 'light' ? 'Chuyển sang Dark Mode' : 'Chuyển sang Light Mode'}
              >
                {theme === 'light' ? (
                  <FaMoon className="min-w-[16px] sm:min-w-[20px]" />
                ) : (
                  <FaSun className="min-w-[16px] sm:min-w-[20px]" />
                )}
                {isOpen && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
              </button>
              <Link
                to="/login"
                onClick={() => setIsMobileOpen(false)}
                className={`
                  w-full flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-white/20 
                  text-white transition-all duration-300 hover:scale-105 font-semibold shadow-md text-sm sm:text-base
                  ${!isOpen ? "px-2" : ""}
                `}
              >
                <FaSignInAlt className="min-w-[16px] sm:min-w-[20px]" />
                {isOpen && <span>Đăng nhập</span>}
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileOpen(false)}
                className={`
                  w-full flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-white/20 
                  text-white transition-all duration-300 hover:scale-105 font-semibold shadow-md text-sm sm:text-base
                  ${!isOpen ? "px-2" : ""}
                `}
              >
                <FaUserPlus className="min-w-[16px] sm:min-w-[20px]" />
                {isOpen && <span>Đăng ký</span>}
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Spacer */}
      <div className={`${isOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`} />
    </>
  );
}
export default memo(SideMenu);
