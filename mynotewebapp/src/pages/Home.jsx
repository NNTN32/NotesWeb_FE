import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FaRegStickyNote, 
  FaTasks,
  FaCalendarAlt,
  FaHeart,
  FaRocket,
  FaLightbulb,
  FaUsers,
  FaStar,
  FaArrowRight,
  FaPlay,
  FaCheckCircle,
  FaBolt,
  FaPlusCircle,
  FaClock,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter
} from "react-icons/fa";
import { toast } from 'react-toastify';
import AuroraBackground from "../components/AuroraBackground";
import { useInView } from '../utils/useInView';

// ========================================
// CONSTANTS - Dễ maintain và update
// ========================================

/**
 * Main Features Configuration
 * Định nghĩa 3 tính năng chính của app
 */
const MAIN_FEATURES = [
  {
    id: "notes",
    title: "Ghi chú thông minh",
    description: "Viết, chỉnh sửa và quản lý ghi chú một cách dễ dàng. Lưu trữ ý tưởng, suy nghĩ và thông tin quan trọng mọi lúc mọi nơi.",
    icon: <FaRegStickyNote className="text-4xl" />,
    route: "/create",
    gradient: "from-rose to-terracotta",
    bgGradient: "from-rose/10 to-terracotta/10",
    iconBg: "bg-gradient-to-br from-rose to-terracotta",
    features: [
      "Tạo và chỉnh sửa ghi chú nhanh chóng",
      "Tìm kiếm ghi chú dễ dàng",
      "Lưu trữ an toàn trên cloud",
      "Giao diện thân thiện, dễ sử dụng"
    ],
    preview: {
      title: "Ghi chú mẫu",
      content: "Đây là một ví dụ về ghi chú. Bạn có thể viết bất cứ điều gì bạn muốn lưu lại...",
      date: "Hôm nay"
    }
  },
  {
    id: "todo",
    title: "Danh sách công việc",
    description: "Tổ chức công việc hàng ngày với danh sách rõ ràng. Đặt mức độ ưu tiên, theo dõi tiến độ và hoàn thành mục tiêu.",
    icon: <FaTasks className="text-4xl" />,
    route: "/todo",
    gradient: "from-brass to-coffee",
    bgGradient: "from-brass/10 to-coffee/10",
    iconBg: "bg-gradient-to-br from-brass to-coffee",
    features: [
      "Tạo danh sách công việc dễ dàng",
      "Đánh dấu hoàn thành nhanh chóng",
      "Sắp xếp theo mức độ ưu tiên",
      "Theo dõi tiến độ trực quan"
    ],
    preview: {
      items: [
        { text: "Hoàn thành dự án", completed: false, priority: "high" },
        { text: "Gọi điện cho khách hàng", completed: true, priority: "medium" },
        { text: "Đọc sách", completed: false, priority: "low" }
      ]
    }
  },
  {
    id: "weekly-plan",
    title: "Lập kế hoạch tuần",
    description: "Lên kế hoạch chi tiết cho cả tuần. Phân bổ công việc hợp lý, đặt mục tiêu và theo dõi tiến độ một cách trực quan.",
    icon: <FaCalendarAlt className="text-4xl" />,
    route: "/weekly-plan",
    gradient: "from-terracotta to-ink",
    bgGradient: "from-terracotta/10 to-ink/10",
    iconBg: "bg-gradient-to-br from-terracotta to-ink",
    features: [
      "Xem toàn bộ kế hoạch tuần",
      "Phân bổ công việc theo ngày",
      "Theo dõi tiến độ tổng thể",
      "Lập kế hoạch hiệu quả hơn"
    ],
    preview: {
      days: [
        { day: "Thứ 2", tasks: 3 },
        { day: "Thứ 3", tasks: 2 },
        { day: "Thứ 4", tasks: 4 }
      ]
    }
  }
];

/**
 * Stats Data
 */
const STATS_DATA = [
  {
    label: "Người dùng hoạt động",
    value: "10,000+",
    icon: <FaUsers className="text-3xl" />,
    gradient: "from-rose to-terracotta"
  },
  {
    label: "Ghi chú đã tạo",
    value: "50,000+",
    icon: <FaRegStickyNote className="text-3xl" />,
    gradient: "from-brass to-coffee"
  },
  {
    label: "Công việc hoàn thành",
    value: "100,000+",
    icon: <FaCheckCircle className="text-3xl" />,
    gradient: "from-terracotta to-ink"
  },
  {
    label: "Thời gian tiết kiệm",
    value: "2.5 giờ/ngày",
    icon: <FaBolt className="text-3xl" />,
    gradient: "from-rose to-brass"
  }
];

/**
 * Quick Actions
 */
const QUICK_ACTIONS = [
  {
    label: "Tạo ghi chú mới",
    icon: <FaPlusCircle className="text-2xl" />,
    route: "/create",
    color: "from-rose to-terracotta"
  },
  {
    label: "Xem danh sách công việc",
    icon: <FaTasks className="text-2xl" />,
    route: "/todo",
    color: "from-brass to-coffee"
  },
  {
    label: "Lập kế hoạch tuần",
    icon: <FaCalendarAlt className="text-2xl" />,
    route: "/weekly-plan",
    color: "from-terracotta to-ink"
  }
];

/**
 * Footer Sections
 */
const FOOTER_SECTIONS = [
  {
    title: "Sản phẩm",
    links: ["Tính năng", "Giá cả", "Tải xuống"]
  },
  {
    title: "Công ty", 
    links: ["Giới thiệu", "Tuyển dụng", "Liên hệ"]
  },
  {
    title: "Hỗ trợ",
    links: ["Blog", "Trung tâm trợ giúp", "FAQ"]
  },
  {
    title: "Pháp lý",
    links: ["Điều khoản", "Bảo mật", "Chính sách"]
  }
];

/**
 * Testimonials
 */
const TESTIMONIALS = [
  {
    name: "Nguyễn Văn A",
    role: "Sinh viên",
    content: "Ứng dụng này giúp tôi tổ chức việc học tập rất hiệu quả!",
    avatar: "A"
  },
  {
    name: "Trần Thị B", 
    role: "Nhân viên văn phòng",
    content: "Giao diện thân thiện, dễ sử dụng. Tôi rất thích tính năng lập kế hoạch tuần!",
    avatar: "B"
  },
  {
    name: "Lê Văn C",
    role: "Freelancer", 
    content: "Tính năng quản lý công việc giúp tôi làm việc hiệu quả hơn rất nhiều.",
    avatar: "C"
  }
];

// ========================================
// ANIMATION UTILITIES - Dễ debug
// ========================================

/**
 * Get animation classes based on visibility
 */
const getAnimationClasses = (isVisible, delay = 0) => {
  const baseClasses = "transition-all duration-700 ease-out";
  const visibleClasses = isVisible 
    ? "opacity-100 translate-y-0" 
    : "opacity-0 translate-y-8";
  return `${baseClasses} ${visibleClasses}`;
};

/**
 * Get stagger delay for sequential animations
 */
const getStaggerDelay = (index, baseDelay = 100) => ({
  transitionDelay: `${index * baseDelay}ms`
});

// ========================================
// COMPONENTS - Modular và maintainable
// ========================================

/**
 * Hero Section
 */
const HeroSection = ({ isVisible, onGetStarted }) => (
  <section className="relative py-20 lg:py-32 overflow-hidden min-h-[85vh] flex items-center">
    {/* Background gradient layers */}
    <div className="absolute inset-0 bg-gradient-to-br from-ink/5 via-coffee/5 to-terracotta/5"></div>
    
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-rose/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-brass/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-terracotta/20 rounded-full blur-3xl animate-pulse delay-200"></div>
    </div>
    
    <div className="relative max-w-7xl mx-auto text-center px-4 z-10">
      <div className={getAnimationClasses(isVisible)}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose/10 to-terracotta/10 px-5 py-2.5 rounded-full border border-rose/20 mb-8 backdrop-blur-sm">
          <FaStar className="text-rose text-sm animate-pulse" />
          <span className="text-sm font-medium text-ink">Chào mừng đến với MyNoteWebApp</span>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight">
          <span className="block text-ink mb-2">Quản lý cuộc sống</span>
          <span className="block bg-gradient-to-r from-rose via-terracotta to-brass bg-clip-text text-transparent animate-gradient">
            một cách thông minh
          </span>
        </h1>
        
        {/* Description */}
        <p className="text-xl sm:text-2xl text-coffee/80 mb-12 max-w-3xl mx-auto leading-relaxed">
          Ứng dụng ghi chú, quản lý công việc và lập kế hoạch được thiết kế đặc biệt cho người Việt. 
          <br className="hidden sm:block" />
          Đơn giản, hiệu quả và thân thiện.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button 
            onClick={onGetStarted}
            className="group relative bg-gradient-to-r from-terracotta to-brass text-white px-10 py-5 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-terracotta/50 hover:scale-105 transition-all duration-500 ease-out flex items-center gap-3 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-brass to-terracotta opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <FaRocket className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            <span className="relative z-10">Bắt đầu ngay</span>
          </button>
          <Link
            to="/register"
            className="group bg-white/80 backdrop-blur-sm text-ink px-10 py-5 rounded-full text-lg font-semibold border-2 border-terracotta/20 hover:border-terracotta hover:shadow-xl hover:bg-white transition-all duration-500 ease-out flex items-center gap-3"
          >
            <FaPlay className="group-hover:scale-110 transition-transform duration-300" />
            Đăng ký miễn phí
          </Link>
        </div>
        
        {/* Social Proof */}
        <div className="flex items-center justify-center gap-3 text-coffee/60">
          <FaUsers className="text-base" />
          <span className="text-base">Hơn 10,000+ người dùng tin tưởng</span>
        </div>
      </div>
    </div>
  </section>
);

/**
 * Stats Section
 */
const StatsSection = ({ isVisible }) => (
  <section className="py-16 lg:py-24 px-4 bg-gradient-to-b from-white via-rose/5 to-white relative">
    <div className="max-w-7xl mx-auto">
      <div className={getAnimationClasses(isVisible)}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS_DATA.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-rose/10 hover:border-terracotta/30 hover:shadow-xl transition-all duration-500"
              style={getStaggerDelay(index, 150)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                
                <div className="text-3xl lg:text-4xl font-bold text-ink mb-2 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                
                <div className="text-sm text-coffee/70 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/**
 * Feature Preview Card Component
 */
const FeaturePreviewCard = ({ feature, isVisible, index }) => {
  const isEven = index % 2 === 0;
  
  return (
    <div
      className={`group grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 last:mb-0 ${
        !isEven ? 'lg:grid-flow-col-dense' : ''
      }`}
    >
      {/* Content */}
      <div 
        className={`${!isEven ? 'lg:col-start-2' : ''} ${
          isVisible ? 'opacity-100 translate-x-0' : isEven ? 'opacity-0 -translate-x-8' : 'opacity-0 translate-x-8'
        } transition-all duration-700 ease-out`}
        style={getStaggerDelay(index, 200)}
      >
        <div className="space-y-6">
          {/* Icon Badge */}
          <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.iconBg} text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
            {feature.icon}
          </div>
          
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-4">
            {feature.title}
          </h3>
          
          <p className="text-lg lg:text-xl text-coffee/80 leading-relaxed mb-6">
            {feature.description}
          </p>
          
          {/* Feature List */}
          <ul className="space-y-3 mb-6">
            {feature.features.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-coffee/70">
                <FaCheckCircle className="text-terracotta flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          
          {/* CTA Button */}
          <Link
            to={feature.route}
            className="inline-flex items-center gap-2 text-terracotta font-semibold group-hover:gap-3 transition-all duration-300 hover:text-brass"
          >
            <span>Khám phá ngay</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
      
      {/* Preview Card */}
      <div 
        className={`${!isEven ? 'lg:col-start-1' : ''} flex justify-center ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } transition-all duration-700 ease-out`}
        style={getStaggerDelay(index, 200 + 100)}
      >
        <div className="relative w-full max-w-md">
          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 scale-110`}></div>
          
          {/* Preview Card */}
          <div className={`relative bg-white/90 backdrop-blur-sm rounded-3xl border border-rose/10 shadow-2xl group-hover:shadow-3xl group-hover:scale-105 transition-all duration-500 overflow-hidden`}>
            {/* Card Header */}
            <div className={`bg-gradient-to-r ${feature.gradient} p-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3 text-white">
                {feature.icon}
                <span className="font-semibold">{feature.title}</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
              </div>
            </div>
            
            {/* Card Content */}
            <div className="p-6">
              {feature.id === "notes" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-ink">{feature.preview.title}</h4>
                    <span className="text-xs text-coffee/60">{feature.preview.date}</span>
                  </div>
                  <p className="text-coffee/70 text-sm leading-relaxed">{feature.preview.content}</p>
                  <div className="flex gap-2 pt-2">
                    <div className="flex-1 h-2 bg-rose/20 rounded"></div>
                    <div className="flex-1 h-2 bg-terracotta/20 rounded"></div>
                    <div className="flex-1 h-2 bg-brass/20 rounded"></div>
                  </div>
                </div>
              )}
              
              {feature.id === "todo" && (
                <div className="space-y-3">
                  {feature.preview.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-rose/5 rounded-lg">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        item.completed ? 'bg-terracotta border-terracotta' : 'border-coffee/30'
                      }`}>
                        {item.completed && <FaCheckCircle className="text-white text-xs" />}
                      </div>
                      <span className={`flex-1 text-sm ${item.completed ? 'line-through text-coffee/50' : 'text-ink'}`}>
                        {item.text}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.priority === 'high' ? 'bg-rose/20 text-rose' :
                        item.priority === 'medium' ? 'bg-brass/20 text-brass' :
                        'bg-coffee/20 text-coffee'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {feature.id === "weekly-plan" && (
                <div className="space-y-3">
                  {feature.preview.days.map((day, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-rose/5 rounded-lg">
                      <span className="font-medium text-ink text-sm">{day.day}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(day.tasks)].map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full bg-gradient-to-br ${feature.gradient}`}></div>
                          ))}
                        </div>
                        <span className="text-xs text-coffee/60">{day.tasks} công việc</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Features Section - Showcase 3 main features
 */
const FeaturesSection = ({ isVisible }) => (
  <section className="py-20 lg:py-32 px-4 bg-white">
    <div className="max-w-7xl mx-auto">
      {/* Section Header */}
      <div className={getAnimationClasses(isVisible)}>
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose/10 to-terracotta/10 px-4 py-2 rounded-full border border-rose/20 mb-6">
            <FaLightbulb className="text-rose text-sm" />
            <span className="text-sm font-medium text-ink">Tính năng chính</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mb-6">
            Tất cả những gì bạn cần
          </h2>
          <p className="text-xl text-coffee/80 max-w-2xl mx-auto">
            Ba tính năng mạnh mẽ giúp bạn quản lý cuộc sống một cách hiệu quả
          </p>
        </div>
      </div>

      {/* Features List */}
      <div>
        {MAIN_FEATURES.map((feature, index) => (
          <FeaturePreviewCard
            key={feature.id}
            feature={feature}
            isVisible={isVisible}
            index={index}
          />
        ))}
      </div>
    </div>
  </section>
);

/**
 * Quick Actions Section
 */
const QuickActionsSection = ({ isVisible }) => (
  <section className="py-20 px-4 bg-gradient-to-b from-white to-rose/5">
    <div className="max-w-7xl mx-auto">
      <div className={getAnimationClasses(isVisible)}>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
            Bắt đầu ngay
          </h2>
          <p className="text-lg text-coffee/80">
            Chọn một trong các tính năng để bắt đầu
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {QUICK_ACTIONS.map((action, index) => (
            <Link
              key={index}
              to={action.route}
              className={`group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-rose/10 hover:border-terracotta/30 hover:shadow-xl transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={getStaggerDelay(index, 150)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
              
              <div className="relative z-10 text-center">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${action.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {action.icon}
                </div>
                <h3 className="text-xl font-semibold text-ink mb-2 group-hover:text-terracotta transition-colors duration-300">
                  {action.label}
                </h3>
                <div className="flex items-center justify-center gap-2 text-coffee/60 group-hover:text-terracotta transition-colors duration-300">
                  <span className="text-sm">Khám phá</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/**
 * Testimonials Section
 */
const TestimonialsSection = ({ isVisible }) => (
  <section className="py-20 lg:py-32 px-4 bg-gradient-to-b from-rose/5 via-white to-white">
    <div className="max-w-7xl mx-auto">
      <div className={getAnimationClasses(isVisible)}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brass/10 to-coffee/10 px-4 py-2 rounded-full border border-brass/20 mb-6">
            <FaStar className="text-brass text-sm" />
            <span className="text-sm font-medium text-ink">Đánh giá từ người dùng</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-ink mb-6">
            Người dùng nói gì về chúng tôi
          </h2>
          <p className="text-xl text-coffee/80 max-w-2xl mx-auto">
            Hàng nghìn người dùng đã tin tưởng và sử dụng ứng dụng của chúng tôi
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        {TESTIMONIALS.map((testimonial, index) => (
          <div
            key={index}
            className={`group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-rose/10 hover:shadow-2xl hover:scale-105 hover:border-terracotta/30 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={getStaggerDelay(index, 150)}
          >
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-brass text-base group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
              ))}
            </div>
            
            <p className="text-coffee/80 italic mb-6 text-lg leading-relaxed">
              "{testimonial.content}"
            </p>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-rose to-terracotta rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {testimonial.avatar}
              </div>
              <div>
                <h4 className="font-semibold text-ink text-lg">{testimonial.name}</h4>
                <p className="text-sm text-coffee/60">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/**
 * CTA Section
 */
const CTASection = ({ isVisible }) => (
  <section className="py-20 lg:py-32 px-4 bg-gradient-to-br from-ink via-coffee to-terracotta relative overflow-hidden">
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full animate-bounce delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full animate-pulse delay-500"></div>
    </div>
    
    <div className="relative max-w-5xl mx-auto text-center text-white z-10">
      <div className={getAnimationClasses(isVisible)}>
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20 mb-8">
          <FaHeart className="text-rose text-sm animate-pulse" />
          <span className="text-sm font-medium">Miễn phí hoàn toàn</span>
        </div>
        
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
          Sẵn sàng bắt đầu?
        </h2>
        <p className="text-xl lg:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
          Tham gia cùng hàng nghìn người dùng đang tận hưởng cuộc sống được tổ chức tốt hơn
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="group bg-white text-terracotta px-10 py-5 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-500 ease-out flex items-center justify-center gap-3"
          >
            <FaRocket className="group-hover:translate-x-1 transition-transform duration-300" />
            Đăng ký miễn phí
          </Link>
          <Link
            to="/login"
            className="group border-2 border-white text-white px-10 py-5 rounded-full text-lg font-semibold hover:bg-white hover:text-terracotta transition-all duration-500 ease-out flex items-center justify-center gap-3"
          >
            <FaCheckCircle className="group-hover:scale-110 transition-transform duration-300" />
            Đăng nhập
          </Link>
        </div>
        
        <p className="mt-8 text-base opacity-75">
          Không cần thẻ tín dụng • Dễ dàng hủy bất kỳ lúc nào
        </p>
      </div>
    </div>
  </section>
);

/**
 * Footer Component
 */
const Footer = ({ isVisible }) => (
  <footer className="py-16 lg:py-20 px-4 bg-gradient-to-b from-ink/5 to-coffee/10">
    <div className="max-w-7xl mx-auto">
      <div className={getAnimationClasses(isVisible)}>
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-4 rounded-full bg-gradient-to-br from-rose to-terracotta shadow-xl hover:scale-110 transition-transform duration-300">
              <FaRegStickyNote className="text-white text-3xl" />
            </div>
            <span className="bg-gradient-to-r from-rose via-terracotta to-brass bg-clip-text text-transparent font-bold text-3xl">
              MyNoteWebApp
            </span>
          </div>
          <p className="text-coffee/80 max-w-md mx-auto text-lg">
            Đơn giản hóa cuộc sống của bạn với công nghệ hiện đại
          </p>
        </div>
      </div>

      <div 
        className={`grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } transition-all duration-1000 ease-out`}
        style={getStaggerDelay(1, 100)}
      >
        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              {section.title}
            </h3>
            <ul className="space-y-3">
              {section.links.map((link) => (
                <li key={link}>
                  <Link 
                    to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-coffee/70 hover:text-terracotta transition-colors duration-200 text-sm inline-block hover:translate-x-1 transform"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div 
        className={`mt-12 lg:mt-16 pt-8 border-t border-rose/20 text-center ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } transition-all duration-1000 ease-out`}
        style={getStaggerDelay(2, 100)}
      >
        <p className="text-coffee/60 text-sm">
          © 2024 MyNoteWebApp. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </div>
  </footer>
);

// ========================================
// MAIN COMPONENT
// ========================================
export default function Home() {
  // Animation state management - Dễ debug
  const [animatedElements, setAnimatedElements] = useState({
    hero: false,
    stats: false,
    features: false,
    quickActions: false,
    testimonials: false,
    cta: false,
    footer: false
  });

  // Intersection Observer hooks - Clean và maintainable
  const [heroRef, heroInView] = useInView({ threshold: 0.1, once: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.2, once: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, once: true });
  const [quickActionsRef, quickActionsInView] = useInView({ threshold: 0.1, once: true });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.1, once: true });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, once: true });
  const [footerRef, footerInView] = useInView({ threshold: 0.1, once: true });

  // Update animation states - Dễ debug với useEffect riêng biệt
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedElements(prev => ({ ...prev, hero: true }));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (statsInView) {
      setAnimatedElements(prev => ({ ...prev, stats: true }));
    }
  }, [statsInView]);

  useEffect(() => {
    if (featuresInView) {
      setAnimatedElements(prev => ({ ...prev, features: true }));
    }
  }, [featuresInView]);

  useEffect(() => {
    if (quickActionsInView) {
      setAnimatedElements(prev => ({ ...prev, quickActions: true }));
    }
  }, [quickActionsInView]);

  useEffect(() => {
    if (testimonialsInView) {
      setAnimatedElements(prev => ({ ...prev, testimonials: true }));
    }
  }, [testimonialsInView]);

  useEffect(() => {
    if (ctaInView) {
      setAnimatedElements(prev => ({ ...prev, cta: true }));
    }
  }, [ctaInView]);

  useEffect(() => {
    if (footerInView) {
      setAnimatedElements(prev => ({ ...prev, footer: true }));
    }
  }, [footerInView]);

  // Event handlers
  const handleGetStarted = () => {
    toast.success("Chào mừng đến với MyNoteWebApp! 🎉");
  };

  return (
    <>
      <AuroraBackground intensity={0.85} />
      <div className="min-h-screen app-content-layer">
        {/* Hero Section */}
        <div ref={heroRef}>
          <HeroSection isVisible={animatedElements.hero} onGetStarted={handleGetStarted} />
        </div>

        {/* Stats Section */}
        <div ref={statsRef}>
          <StatsSection isVisible={animatedElements.stats} />
        </div>

        {/* Features Section - Showcase 3 main features */}
        <div ref={featuresRef}>
          <FeaturesSection isVisible={animatedElements.features} />
        </div>

        {/* Quick Actions Section */}
        <div ref={quickActionsRef}>
          <QuickActionsSection isVisible={animatedElements.quickActions} />
        </div>

        {/* Testimonials Section */}
        <div ref={testimonialsRef}>
          <TestimonialsSection isVisible={animatedElements.testimonials} />
        </div>

        {/* CTA Section */}
        <div ref={ctaRef}>
          <CTASection isVisible={animatedElements.cta} />
        </div>

        {/* Footer */}
        <div ref={footerRef}>
          <Footer isVisible={animatedElements.footer} />
        </div>
      </div>
    </>
  );
}