import { useState, useEffect, useRef, Component } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaSave, 
  FaRegStickyNote, 
  FaLightbulb,
  FaMagic,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaExpand,
  FaCompress,
  FaBars,
  FaTimes,
  FaMobile,
  FaTablet,
  FaDesktop
} from "react-icons/fa";

// Constants for better maintainability
const FORM_CONFIG = {
  MAX_TITLE_LENGTH: 100,
  MAX_CONTENT_LENGTH: 2000,
  CONTENT_WARNING_THRESHOLD: 0.8, // 80% of max length
  SAVE_DELAY: 1500, // Simulated API delay
  SUCCESS_ANIMATION_DELAY: 800,
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  SIDEBAR_AUTO_CLOSE_DELAY: 2000, // 2 seconds
  AUTO_SAVE_SUCCESS_DISPLAY_TIME: 1000 // 1 second
};

// Fullscreen layout constants for better maintainability
const FULLSCREEN_CONFIG = {
  SIDEBAR_WIDTH: {
    DEFAULT: 'w-16',
    SM: 'sm:w-18', 
    LG: 'lg:w-20',
    XL: 'xl:w-24'
  },
  CONTENT_PADDING: {
    DEFAULT: 'p-1',
    SM: 'sm:p-2',
    MD: 'md:p-3',
    LG: 'lg:p-4',
    XL: 'xl:p-6'
  },
  TITLE_TEXT_SIZE: {
    DEFAULT: 'text-lg',
    SM: 'sm:text-xl',
    MD: 'md:text-2xl',
    LG: 'lg:text-3xl',
    XL: 'xl:text-4xl'
  },
  CONTENT_TEXT_SIZE: {
    DEFAULT: 'text-sm',
    SM: 'sm:text-base',
    MD: 'md:text-lg',
    LG: 'lg:text-xl',
    XL: 'xl:text-2xl'
  }
};

// Background configuration for consistent appearance
const BACKGROUND_CONFIG = {
  // Use the same background for both fullscreen and normal mode
  // This ensures visual consistency and maintains the grid pattern across all states
  MAIN_BACKGROUND: 'min-h-screen bg-white transition-all duration-300 notes-bg'
};

// Helper functions for cleaner code
const getFullscreenClasses = (baseClasses, fullscreenClasses) => (isFullscreen) => 
  isFullscreen ? fullscreenClasses : baseClasses;

const getResponsiveClasses = (config) => Object.values(config).join(' ');

// Debug configuration
const DEBUG_CONFIG = {
  ENABLE_LOGGING: process.env.NODE_ENV === 'development',
  LOG_PREFIX: '[NoteForm]'
};

// Utility functions for debugging and error handling
const debugLog = (message, data = null) => {
  if (DEBUG_CONFIG.ENABLE_LOGGING) {
    console.log(`${DEBUG_CONFIG.LOG_PREFIX} ${message}`, data || '');
  }
};

const debugError = (message, error) => {
  if (DEBUG_CONFIG.ENABLE_LOGGING) {
    console.error(`${DEBUG_CONFIG.LOG_PREFIX} ERROR: ${message}`, error);
  }
};

// Error Boundary Component for better error handling
class NoteFormErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    debugError('Error Boundary caught an error', { error, errorInfo });
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-red-200">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-red-800 mb-2">
                Có lỗi xảy ra
              </h2>
              <p className="text-red-600 mb-4">
                Xin lỗi, có lỗi không mong muốn xảy ra trong ứng dụng.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Tải lại trang
              </button>
              {DEBUG_CONFIG.ENABLE_LOGGING && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-600">
                    Chi tiết lỗi (Development)
                  </summary>
                  <pre className="mt-2 text-xs text-gray-500 overflow-auto max-h-32">
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Device detection and responsive breakpoints
const DEVICE_BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 1024,
  DESKTOP: 1280
};

// Custom hook for device detection with error handling
const useDeviceDetection = () => {
  const [deviceType, setDeviceType] = useState('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      try {
        const width = window.innerWidth;
        let newDeviceType = 'desktop';
        
        if (width < DEVICE_BREAKPOINTS.MOBILE) {
          newDeviceType = 'mobile';
        } else if (width < DEVICE_BREAKPOINTS.TABLET) {
          newDeviceType = 'tablet';
        }
        
        setDeviceType(prevType => {
          if (prevType !== newDeviceType) {
            debugLog(`Device type changed: ${prevType} -> ${newDeviceType}`, { width });
          }
          return newDeviceType;
        });
      } catch (error) {
        debugError('Error in device detection', error);
      }
    };

    try {
      handleResize();
      window.addEventListener('resize', handleResize);
      debugLog('Device detection initialized');
    } catch (error) {
      debugError('Error initializing device detection', error);
    }

    return () => {
      try {
        window.removeEventListener('resize', handleResize);
        debugLog('Device detection cleanup');
      } catch (error) {
        debugError('Error cleaning up device detection', error);
      }
    };
  }, []);

  return { deviceType, isFullscreen, setIsFullscreen };
};

// Modern floating elements - only for desktop
const FloatingElements = ({ deviceType }) => {
  if (deviceType === 'mobile') return null;
  
  return (
    <>
      <div className="absolute top-20 left-10 animate-pulse">
        <div className="w-4 h-4 bg-rose/60 rounded-full"></div>
      </div>
      <div className="absolute top-40 right-20 animate-bounce">
        <div className="w-6 h-6 bg-brass/60 rounded-full"></div>
      </div>
      <div className="absolute bottom-40 left-20 animate-pulse">
        <div className="w-3 h-3 bg-terracotta/60 rounded-full"></div>
      </div>
    </>
  );
};

// Collapsible sidebar component with fullscreen optimization
const CollapsibleSidebar = ({ isOpen, onToggle, deviceType, isFullscreen }) => {
  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile': return <FaMobile className="text-sm" />;
      case 'tablet': return <FaTablet className="text-sm" />;
      default: return <FaDesktop className="text-sm" />;
    }
  };

  // Device Tips component with compact and full layouts
  // This component adapts based on fullscreen mode for better space utilization
  const DeviceTips = ({ isCompact = false }) => {
    // Device-specific tips for better user experience
    const tips = {
      mobile: ['Tap to focus', 'Swipe to navigate', 'Voice input'],
      tablet: ['Apple Pencil', 'Split screen', 'Pinch to zoom'],
      desktop: ['Keyboard shortcuts', 'Drag & drop', 'Multi-window']
    };

    const currentTips = tips[deviceType] || tips.desktop;

    // Compact version for fullscreen mode - uses pill-style badges
    if (isCompact) {
      return (
        <div className="p-2 rounded-md bg-gradient-to-r from-rose/5 to-terracotta/5 border border-rose/10">
          <h3 className="font-semibold text-ink text-xs mb-1">Tips</h3>
          <div className="flex flex-wrap gap-1">
            {currentTips.map((tip, index) => (
              <span key={index} className="text-xs text-coffee/70 bg-white/50 px-2 py-1 rounded-full">
                {tip}
              </span>
            ))}
          </div>
        </div>
      );
    }

    // Full version for normal mode - uses traditional list layout
    return (
      <div className="p-4 rounded-lg bg-gradient-to-r from-rose/5 to-terracotta/5 border border-rose/10">
        <h3 className="font-semibold text-ink text-sm mb-2">Device Tips</h3>
        <ul className="text-xs text-coffee/80 space-y-1">
          {currentTips.map((tip, index) => (
            <li key={index}>• {tip}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && deviceType === 'mobile' && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full bg-white/95 backdrop-blur-sm border-r border-rose/10 z-50 lg:z-auto
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isFullscreen ? getResponsiveClasses(FULLSCREEN_CONFIG.SIDEBAR_WIDTH) : 'w-64 sm:w-72 lg:w-80'}
      `}>
        <div className={`${isFullscreen ? 'p-2' : 'p-4 sm:p-6'}`}>
          {isFullscreen ? (
            /* Compact fullscreen layout */
            <div className="flex flex-col items-center space-y-4">
              {/* App icon only */}
              <div className="p-2 rounded-xl bg-gradient-to-br from-rose to-terracotta">
                <FaRegStickyNote className="text-white text-lg" />
              </div>

              {/* Device icon */}
              <div className="p-2 rounded-lg bg-coffee/5">
                {getDeviceIcon()}
              </div>

              {/* Quick action icons */}
              <div className="flex flex-col space-y-2">
                <button className="p-2 rounded-lg hover:bg-rose/10 transition-colors" title="New Note">
                  <FaRegStickyNote className="text-terracotta" />
                </button>
                <button className="p-2 rounded-lg hover:bg-rose/10 transition-colors" title="Recent Notes">
                  <FaClock className="text-brass" />
                </button>
                <button className="p-2 rounded-lg hover:bg-rose/10 transition-colors" title="Templates">
                  <FaMagic className="text-rose" />
                </button>
              </div>

              {/* Compact Device Tips */}
              <div className="mt-auto">
                <DeviceTips isCompact={true} />
              </div>
            </div>
          ) : (
            /* Regular layout */
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-rose to-terracotta">
                    <FaRegStickyNote className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="font-bold text-ink text-lg">MyNoteApp</h2>
                    <p className="text-xs text-coffee/60">Writing Space</p>
                  </div>
                </div>
                <button
                  onClick={onToggle}
                  className="lg:hidden p-2 rounded-lg hover:bg-coffee/10 transition-colors"
                >
                  <FaTimes className="text-coffee" />
                </button>
              </div>

              {/* Device indicator */}
              <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-coffee/5">
                {getDeviceIcon()}
                <span className="text-sm text-coffee/80 capitalize">{deviceType} Mode</span>
              </div>

              {/* Quick actions */}
              <div className="space-y-2 mb-6">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-rose/10 transition-colors text-left">
                  <FaRegStickyNote className="text-terracotta" />
                  <span className="text-sm font-medium text-ink">New Note</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-rose/10 transition-colors text-left">
                  <FaClock className="text-brass" />
                  <span className="text-sm font-medium text-ink">Recent Notes</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-rose/10 transition-colors text-left">
                  <FaMagic className="text-rose" />
                  <span className="text-sm font-medium text-ink">Templates</span>
                </button>
              </div>

              {/* Device Tips */}
              <DeviceTips />
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Status indicator component with dedicated space
const StatusIndicator = ({ hasUnsavedChanges, lastSaved, isAutoSaving }) => (
  <div className="flex items-center gap-3 px-3 py-2 bg-white/80 rounded-lg shadow-sm border border-rose/10">
    {/* Save status */}
    {hasUnsavedChanges ? (
      <div className="flex items-center gap-2 text-amber-600">
        <FaExclamationTriangle className="text-xs animate-pulse" />
        <span className="text-xs font-medium">Unsaved changes</span>
      </div>
    ) : (
      <div className="flex items-center gap-2 text-green-600">
        <FaCheckCircle className="text-xs" />
        <span className="text-xs font-medium">Saved</span>
      </div>
    )}
    
    {/* Last saved time */}
    {lastSaved && (
      <div className="text-xs text-coffee/60 border-l border-coffee/20 pl-3">
        <FaClock className="inline mr-1" />
        {lastSaved}
      </div>
    )}
    
    {/* Auto-saving indicator */}
    {isAutoSaving && (
      <div className="flex items-center gap-1 text-blue-600">
        <div className="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent"></div>
        <span className="text-xs">Auto-saving...</span>
      </div>
    )}
  </div>
);

// Modern header with fullscreen and mobile menu
const ModernHeader = ({ 
  onBackClick, 
  onToggleSidebar, 
  onToggleFullscreen, 
  isFullscreen, 
  deviceType,
  hasUnsavedChanges,
  lastSaved,
  isAutoSaving
}) => (
  <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-rose/10">
    <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6">
      {/* Left side - Menu and back */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-coffee/10 transition-colors group"
          title="Open menu"
        >
          <FaBars className="text-coffee text-lg group-hover:scale-110 transition-transform" />
        </button>
        
        {/* Back button */}
        <button 
          onClick={onBackClick}
          className="group flex items-center gap-2 text-coffee hover:text-terracotta transition-all duration-300"
          title="Go back to home"
        >
          <div className="p-2 rounded-lg bg-white/80 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform duration-300" />
          </div>
          <span className="font-medium text-sm hidden sm:block">Quay lại</span>
        </button>
      </div>

      {/* Center - Title and status */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-ink group cursor-default" title="Note Editor">
            {isFullscreen ? 'Writing Mode' : 'Tạo ghi chú mới'}
          </h1>
          {!isFullscreen && (
            <p className="text-xs sm:text-sm text-coffee/70 mt-1 group-hover:text-coffee/90 transition-colors">
              {deviceType === 'mobile' ? 'Tap to write' : 
               deviceType === 'tablet' ? 'Perfect for Apple Pencil' : 
               'Use keyboard shortcuts'}
            </p>
          )}
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {/* Status indicator with dedicated space */}
        <StatusIndicator 
          hasUnsavedChanges={hasUnsavedChanges}
          lastSaved={lastSaved}
          isAutoSaving={isAutoSaving}
        />
        
        {/* Fullscreen toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-lg hover:bg-coffee/10 transition-colors group"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <FaCompress className="text-coffee text-lg group-hover:scale-110 transition-transform" />
          ) : (
            <FaExpand className="text-coffee text-lg group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </div>
  </div>
);

// Modern title input with floating label - optimized for fullscreen
const ModernTitleInput = ({ title, onTitleChange, titleRef, isFullscreen, deviceType }) => (
  <div className={`relative ${isFullscreen ? 'mb-4' : 'mb-6 sm:mb-8'}`}>
    <div className="relative">
      <input
        ref={titleRef}
        type="text"
        placeholder=" "
        className={`
          w-full bg-transparent border-0 border-b-2 border-coffee/20 
          focus:border-terracotta focus:outline-none transition-all duration-300
          text-ink font-medium touch-manipulation
          ${isFullscreen ? `${getResponsiveClasses(FULLSCREEN_CONFIG.TITLE_TEXT_SIZE)} py-2 sm:py-3` : 
            deviceType === 'mobile' ? 'text-lg py-3' :
            'text-xl sm:text-2xl lg:text-3xl py-3 sm:py-4'}
        `}
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        maxLength={FORM_CONFIG.MAX_TITLE_LENGTH}
      />
      <label className={`
        absolute left-0 transition-all duration-300 pointer-events-none
        ${title ? 'top-0 text-xs text-coffee/60' : 
          isFullscreen ? 'top-3 text-sm text-coffee/40' :
          'top-3 sm:top-4 text-sm sm:text-base text-coffee/40'}
      `}>
        <FaLightbulb className="inline mr-2 text-brass" />
        {isFullscreen ? 'What\'s on your mind?' : 'Tiêu đề ghi chú'}
      </label>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-coffee/50 text-xs">
        {title.length}/{FORM_CONFIG.MAX_TITLE_LENGTH}
      </div>
    </div>
  </div>
);

// Modern content area - optimized for fullscreen writing
const ModernContentArea = ({ content, onContentChange, contentRef, isFullscreen, deviceType }) => {
  const characterCount = content.length;
  const isNearLimit = characterCount > FORM_CONFIG.MAX_CONTENT_LENGTH * FORM_CONFIG.CONTENT_WARNING_THRESHOLD;

  return (
    <div className="relative flex-1">
      <div className="relative h-full">
        <textarea
          ref={contentRef}
          placeholder={isFullscreen ? 
            "Start writing your thoughts here...\n\n• Use bullet points for ideas\n• Add dates and deadlines\n• Let your creativity flow" :
            "Viết nội dung ghi chú của bạn ở đây... Hãy chia sẻ ý tưởng, suy nghĩ hoặc bất kỳ điều gì bạn muốn ghi nhớ!"
          }
          className={`
            w-full h-full bg-transparent border-0 resize-none
            focus:outline-none text-ink leading-relaxed touch-manipulation
            ${isFullscreen ? 
              `${getResponsiveClasses(FULLSCREEN_CONFIG.CONTENT_TEXT_SIZE)} ${getResponsiveClasses(FULLSCREEN_CONFIG.CONTENT_PADDING)}` :
              deviceType === 'mobile' ? 
                'text-base p-4 min-h-[300px]' :
                'text-base sm:text-lg lg:text-xl p-4 sm:p-6 lg:p-8 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]'
            }
          `}
          value={content}
          onChange={e => onContentChange(e.target.value)}
          maxLength={FORM_CONFIG.MAX_CONTENT_LENGTH}
        />
        
        {/* Character count - optimized for fullscreen */}
        <div className={`
          absolute transition-all duration-300 text-xs
          ${isFullscreen ? 
            'bottom-2 right-2 px-2 py-1 rounded-full' :
            'bottom-4 right-4 px-2 py-1 rounded-full'
          }
          ${isNearLimit ? 'bg-red-100 text-red-600' : 'bg-coffee/10 text-coffee/60'}
        `}>
          {characterCount}/{FORM_CONFIG.MAX_CONTENT_LENGTH}
        </div>
      </div>
    </div>
  );
};

// Floating action bar - modern and minimal with dedicated status area
const FloatingActionBar = ({ 
  isLoading, 
  isDisabled, 
  showSuccessAnimation, 
  onSave, 
  hasUnsavedChanges,
  isFullscreen,
  deviceType,
  lastSaved,
  isAutoSaving
}) => (
  <div className={`
    fixed bottom-4 right-4 z-40 transition-all duration-300
    ${isFullscreen ? 'bottom-6 right-6' : ''}
  `}>
    <div className="flex flex-col items-end gap-3">
      {/* Status area with dedicated space */}
      <div className="flex items-center gap-2">
        {/* Save status with dedicated space */}
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 rounded-full text-sm animate-pulse shadow-sm">
            <FaExclamationTriangle className="text-xs" />
            <span className="hidden sm:block">Unsaved</span>
          </div>
        )}
        
        {/* Last saved time */}
        {lastSaved && !hasUnsavedChanges && (
          <div className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-full text-sm shadow-sm">
            <FaClock className="text-xs" />
            <span className="hidden sm:block">Saved {lastSaved}</span>
          </div>
        )}
        
        {/* Auto-saving indicator */}
        {isAutoSaving && (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm shadow-sm">
            <div className="animate-spin rounded-full h-3 w-3 border border-blue-700 border-t-transparent"></div>
            <span className="hidden sm:block">Auto-saving...</span>
          </div>
        )}
      </div>
      
      {/* Save button */}
      <button 
        onClick={onSave}
        disabled={isDisabled}
        className={`
          group relative flex items-center gap-2 px-4 py-3 rounded-full font-semibold 
          transition-all duration-500 touch-manipulation shadow-lg hover:shadow-xl
          ${isDisabled
            ? 'bg-coffee/20 text-coffee/50 cursor-not-allowed'
            : 'bg-gradient-to-r from-terracotta to-brass text-white hover:scale-105 active:scale-95'
          }
          ${isFullscreen ? 'text-base px-6 py-4' : 'text-sm'}
        `}
        title={isDisabled ? 'Please fill in title and content' : 'Save note'}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Saving...</span>
          </>
        ) : (
          <>
            <FaSave className="group-hover:scale-110 transition-transform duration-300" />
            <span className="hidden sm:block">Save</span>
          </>
        )}
        
        {showSuccessAnimation && (
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce-in">
            <FaCheckCircle className="text-lg text-white" />
          </div>
        )}
      </button>
    </div>
  </div>
);


/**
 * Modern NoteForm component - Completely redesigned for optimal UX
 * Features:
 * - Mobile-first responsive design
 * - Collapsible sidebar for mobile/tablet
 * - Fullscreen writing mode
 * - Device-specific optimizations
 * - Clean, distraction-free interface
 * - Component-based architecture for maintainability
 */
// Main NoteForm component
function NoteFormComponent() {
  // Device detection and UI state
  const { deviceType, isFullscreen, setIsFullscreen } = useDeviceDetection();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  // Refs
  const navigate = useNavigate();
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // Auto-save functionality with better error handling
  useEffect(() => {
    try {
      if (title || content) {
        setHasUnsavedChanges(true);
        debugLog('Content changed, setting unsaved changes', { titleLength: title.length, contentLength: content.length });
        
        // Clear existing timeout
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
          debugLog('Cleared existing auto-save timeout');
        }
        
        // Set new auto-save timeout
        autoSaveTimeoutRef.current = setTimeout(() => {
          debugLog('Auto-save timeout triggered');
          handleAutoSave();
        }, FORM_CONFIG.AUTO_SAVE_INTERVAL);
        
        debugLog('Auto-save timeout set', { interval: FORM_CONFIG.AUTO_SAVE_INTERVAL });
      }
    } catch (error) {
      debugError('Error in auto-save effect', error);
    }
    
    return () => {
      try {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
          debugLog('Auto-save timeout cleared on cleanup');
        }
      } catch (error) {
        debugError('Error clearing auto-save timeout', error);
      }
    };
  }, [title, content]);

  // Auto-save function with comprehensive error handling
  const handleAutoSave = async () => {
    try {
      if (!title.trim() || !content.trim() || isLoading) {
        debugLog('Auto-save skipped', { 
          hasTitle: !!title.trim(), 
          hasContent: !!content.trim(), 
          isLoading 
        });
        return;
      }
      
      debugLog('Starting auto-save');
      setIsAutoSaving(true);
      
      // Simulate API call with timeout
      await Promise.race([
        new Promise(resolve => setTimeout(resolve, 1000)),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auto-save timeout')), 5000)
        )
      ]);
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      setLastSaved(timeString);
      setHasUnsavedChanges(false);
      
      debugLog('Auto-save completed successfully', { timeString });
      
      // Show brief success indicator
      setTimeout(() => {
        setIsAutoSaving(false);
        debugLog('Auto-save indicator hidden');
      }, FORM_CONFIG.AUTO_SAVE_SUCCESS_DISPLAY_TIME);
      
    } catch (error) {
      debugError("Auto-save failed", error);
      setIsAutoSaving(false);
      
      // Show error to user
      toast.error("Auto-save failed. Please save manually.");
    }
  };

  // Auto-focus on title input with error handling
  useEffect(() => {
    try {
      if (titleRef.current) {
        titleRef.current.focus();
        debugLog('Title input focused');
      }
    } catch (error) {
      debugError('Error focusing title input', error);
    }
  }, []);

  // Auto-close sidebar on mobile when content is focused
  useEffect(() => {
    try {
      if (deviceType === 'mobile' && sidebarOpen) {
        debugLog('Setting sidebar auto-close timer', { deviceType, sidebarOpen });
        const timer = setTimeout(() => {
          setSidebarOpen(false);
          debugLog('Sidebar auto-closed');
        }, FORM_CONFIG.SIDEBAR_AUTO_CLOSE_DELAY);
        
        return () => {
          clearTimeout(timer);
          debugLog('Sidebar auto-close timer cleared');
        };
      }
    } catch (error) {
      debugError('Error in sidebar auto-close effect', error);
    }
  }, [content, deviceType, sidebarOpen]);

  /**
   * Handle form submission with comprehensive error handling
   */
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      debugLog('Form submission started', { titleLength: title.length, contentLength: content.length });
      
      if (!title.trim() || !content.trim()) {
        debugLog('Form validation failed - missing required fields');
        toast.error("Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      setIsLoading(true);
      debugLog('Save process started');
      
      // Simulate API call with timeout protection
      await Promise.race([
        new Promise(resolve => setTimeout(resolve, FORM_CONFIG.SAVE_DELAY)),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Save timeout')), 10000)
        )
      ]);
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      setLastSaved(timeString);
      setShowSuccessAnimation(true);
      setHasUnsavedChanges(false);
      
      debugLog('Save completed successfully', { timeString });
      
      setTimeout(() => {
        toast.success("Đã lưu ghi chú thành công! 🎉");
        debugLog('Navigating to home page');
        navigate("/");
      }, FORM_CONFIG.SUCCESS_ANIMATION_DELAY);
      
    } catch (error) {
      debugError("Error saving note", error);
      toast.error("Có lỗi xảy ra khi lưu ghi chú!");
      setIsLoading(false);
    }
  };

  /**
   * Handle back navigation with confirmation
   */
  const handleBackClick = () => {
    try {
      debugLog('Back button clicked', { hasUnsavedChanges });
      
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm("Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang?");
        debugLog('User confirmation result', { confirmLeave });
        if (!confirmLeave) return;
      }
      
      debugLog('Navigating back to home');
      navigate("/");
    } catch (error) {
      debugError('Error in back navigation', error);
    }
  };

  /**
   * Toggle sidebar with logging
   */
  const handleToggleSidebar = () => {
    try {
      const newState = !sidebarOpen;
      setSidebarOpen(newState);
      debugLog('Sidebar toggled', { newState, deviceType });
    } catch (error) {
      debugError('Error toggling sidebar', error);
    }
  };

  /**
   * Toggle fullscreen mode with logging
   */
  const handleToggleFullscreen = () => {
    try {
      const newState = !isFullscreen;
      setIsFullscreen(newState);
      debugLog('Fullscreen toggled', { newState });
    } catch (error) {
      debugError('Error toggling fullscreen', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        // Clear all timeouts
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
          debugLog('Component unmounting - cleared auto-save timeout');
        }
        
        // Reset states
        setIsLoading(false);
        setIsAutoSaving(false);
        setShowSuccessAnimation(false);
        
        debugLog('Component cleanup completed');
      } catch (error) {
        debugError('Error during component cleanup', error);
      }
    };
  }, []);

  // Form validation with logging
  const isFormValid = title.trim() && content.trim();
  const isFormDisabled = isLoading || !isFormValid;
  
  // Debug form state changes
  useEffect(() => {
    debugLog('Form state changed', { 
      isFormValid, 
      isFormDisabled, 
      isLoading, 
      hasUnsavedChanges,
      titleLength: title.length,
      contentLength: content.length
    });
  }, [isFormValid, isFormDisabled, isLoading, hasUnsavedChanges, title.length, content.length]);

  return (
    <div className={BACKGROUND_CONFIG.MAIN_BACKGROUND}>
      <FloatingElements deviceType={deviceType} />
      
      {/* Main layout container */}
      <div className="flex h-screen">
        {/* Collapsible Sidebar */}
        <CollapsibleSidebar 
          isOpen={sidebarOpen} 
          onToggle={handleToggleSidebar}
          deviceType={deviceType}
          isFullscreen={isFullscreen}
        />
        
        {/* Main content area */}
        <div className={`
          flex-1 flex flex-col transition-all duration-300
          ${isFullscreen ? 'ml-0' : 'lg:ml-0'}
        `}>
          {/* Modern Header */}
          <ModernHeader
            onBackClick={handleBackClick}
            onToggleSidebar={handleToggleSidebar}
            onToggleFullscreen={handleToggleFullscreen}
            isFullscreen={isFullscreen}
            deviceType={deviceType}
            hasUnsavedChanges={hasUnsavedChanges}
            lastSaved={lastSaved}
            isAutoSaving={isAutoSaving}
          />
          
          {/* Writing area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <form 
              ref={formRef}
              onSubmit={handleSubmit} 
              className="flex-1 flex flex-col"
            >
              {/* Content container */}
              <div className={`
                flex-1 flex flex-col transition-all duration-300
                ${isFullscreen ? `${getResponsiveClasses(FULLSCREEN_CONFIG.CONTENT_PADDING)} max-w-none w-full` : 'p-4 sm:p-6 lg:p-8 xl:p-12 max-w-4xl mx-auto w-full'}
              `}>
                {/* Title input */}
                <ModernTitleInput
                  title={title}
                  onTitleChange={setTitle}
                  titleRef={titleRef}
                  isFullscreen={isFullscreen}
                  deviceType={deviceType}
                />
                
                {/* Content area */}
                <ModernContentArea
                  content={content}
                  onContentChange={setContent}
                  contentRef={contentRef}
                  isFullscreen={isFullscreen}
                  deviceType={deviceType}
                />
              </div>
      </form>
          </div>
        </div>
      </div>
      
      {/* Floating Action Bar */}
      <FloatingActionBar
        isLoading={isLoading}
        isDisabled={isFormDisabled}
        showSuccessAnimation={showSuccessAnimation}
        onSave={handleSubmit}
        hasUnsavedChanges={hasUnsavedChanges}
        isFullscreen={isFullscreen}
        deviceType={deviceType}
        lastSaved={lastSaved}
        isAutoSaving={isAutoSaving}
      />
    </div>
  );
}

// Export with Error Boundary wrapper
export default function NoteForm() {
  return (
    <NoteFormErrorBoundary>
      <NoteFormComponent />
    </NoteFormErrorBoundary>
  );
}