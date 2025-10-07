import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FaRegStickyNote, 
  FaTasks,
  FaCalendarAlt,
  FaHeart,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaRocket,
  FaLightbulb,
  FaUsers,
  FaStar,
  FaArrowRight,
  FaPlay,
  FaCheckCircle
} from "react-icons/fa";
import { toast } from 'react-toastify';
import AuroraBackground from "../components/AuroraBackground";
import { useInView } from '../utils/useInView';

// Enhanced features data with warm, user-friendly design
const mainFeatures = [
  {
    id: "smart-notes",
    title: "Ghi chú thông minh",
    description: "Viết ghi chú một cách dễ dàng, lưu trữ ý tưởng và truy cập mọi lúc mọi nơi với giao diện thân thiện.",
    icon: <FaRegStickyNote className="text-4xl" />,
    position: "left",
    gradient: "from-rose to-terracotta",
    bgGradient: "from-rose/10 to-terracotta/10",
    iconBg: "bg-gradient-to-br from-rose to-terracotta"
  },
  {
    id: "todo-lists", 
    title: "Danh sách công việc",
    description: "Tổ chức công việc hàng ngày với danh sách rõ ràng, nhắc nhở thông minh và theo dõi tiến độ.",
    icon: <FaTasks className="text-4xl" />,
    position: "right",
    gradient: "from-brass to-coffee",
    bgGradient: "from-brass/10 to-coffee/10",
    iconBg: "bg-gradient-to-br from-brass to-coffee"
  },
  {
    id: "weekly-planning",
    title: "Lập kế hoạch tuần",
    description: "Lên kế hoạch chi tiết cho tuần, đặt mục tiêu và theo dõi tiến độ một cách trực quan và hiệu quả.",
    icon: <FaCalendarAlt className="text-4xl" />,
    position: "left",
    gradient: "from-terracotta to-ink",
    bgGradient: "from-terracotta/10 to-ink/10",
    iconBg: "bg-gradient-to-br from-terracotta to-ink"
  }
];

// Enhanced footer with Vietnamese content
const footerSections = [
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
  },
  {
    title: "Theo dõi chúng tôi",
    links: ["Twitter", "Facebook", "Instagram"]
  }
];

// User testimonials for social proof
const testimonials = [
  {
    name: "Nguyễn Văn A",
    role: "Sinh viên",
    content: "Ứng dụng này giúp tôi tổ chức việc học tập rất hiệu quả!",
    avatar: "A"
  },
  {
    name: "Trần Thị B", 
    role: "Nhân viên văn phòng",
    content: "Giao diện thân thiện, dễ sử dụng. Tôi rất thích!",
    avatar: "B"
  },
  {
    name: "Lê Văn C",
    role: "Freelancer", 
    content: "Tính năng lập kế hoạch tuần rất hữu ích cho công việc của tôi.",
    avatar: "C"
  }
];


// Enhanced Hero Section with warm, welcoming design
const HeroSection = ({ isVisible, onGetStarted }) => (
  <section className="relative py-20 lg:py-32 overflow-hidden">
    {/* Background gradient matching side menu */}
    <div className="absolute inset-0 bg-gradient-to-br from-ink/5 via-coffee/5 to-terracotta/5"></div>
    
    {/* Floating decorative elements */}
    <div className="absolute top-20 left-10 animate-pulse">
      <div className="w-4 h-4 bg-rose/60 rounded-full"></div>
    </div>
    <div className="absolute top-40 right-20 animate-bounce">
      <div className="w-6 h-6 bg-brass/60 rounded-full"></div>
    </div>
    <div className="absolute bottom-40 left-20 animate-pulse">
      <div className="w-3 h-3 bg-terracotta/60 rounded-full"></div>
    </div>
    
    <div className="relative max-w-6xl mx-auto text-center px-4">
      <div className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Welcome badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose/10 to-terracotta/10 px-4 py-2 rounded-full border border-rose/20 mb-6">
          <FaStar className="text-rose text-sm" />
          <span className="text-sm font-medium text-ink">Chào mừng đến với MyNoteWebApp</span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-ink">Quản lý cuộc sống</span>
          <br />
          <span className="bg-gradient-to-r from-rose via-terracotta to-brass bg-clip-text text-transparent">
            một cách thông minh
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-coffee/80 mb-8 max-w-3xl mx-auto leading-relaxed">
          Ứng dụng ghi chú, quản lý công việc và lập kế hoạch được thiết kế đặc biệt cho người Việt. 
          Đơn giản, hiệu quả và thân thiện.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onGetStarted}
            className="group bg-gradient-to-r from-terracotta to-brass text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-500 ease-out flex items-center gap-2"
          >
            <FaRocket className="group-hover:translate-x-1 transition-transform duration-300" />
            Bắt đầu ngay
          </button>
          <Link
            to="/demo"
            className="group bg-white text-ink px-8 py-4 rounded-full text-lg font-semibold border-2 border-terracotta/20 hover:border-terracotta hover:shadow-xl transition-all duration-500 ease-out flex items-center gap-2"
          >
            <FaPlay className="group-hover:scale-110 transition-transform duration-300" />
            Xem demo
          </Link>
        </div>
        
        {/* User count for social proof */}
        <div className="mt-8 flex items-center justify-center gap-2 text-coffee/60">
          <FaUsers className="text-sm" />
          <span className="text-sm">Hơn 10,000+ người dùng tin tưởng</span>
        </div>
      </div>
    </div>
  </section>
);

// Enhanced Features Section with warm, interactive design
const FeaturesSection = ({ isVisible }) => (
  <section className="py-20 px-4 bg-gradient-to-b from-white to-rose/5">
    <div className="max-w-7xl mx-auto">
      {/* Section header */}
      <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose/10 to-terracotta/10 px-4 py-2 rounded-full border border-rose/20 mb-4">
          <FaLightbulb className="text-rose text-sm" />
          <span className="text-sm font-medium text-ink">Tính năng nổi bật</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-4">
          Tất cả những gì bạn cần
        </h2>
        <p className="text-lg text-coffee/80 max-w-2xl mx-auto">
          Được thiết kế để giúp bạn tổ chức cuộc sống một cách hiệu quả và thú vị
        </p>
      </div>

      <div className="space-y-20">
        {mainFeatures.map((feature, index) => (
          <div
            key={feature.id}
            className={`group grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
              feature.position === 'right' ? 'lg:grid-flow-col-dense' : ''
            }`}
          >
            {/* Content */}
            <div className={`${feature.position === 'right' ? 'lg:col-start-2' : ''} ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            } transition-all duration-700 ease-out`}
            style={{ transitionDelay: `${index * 200}ms` }}>
              <div className="space-y-4">
                <h3 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-coffee/80 leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 text-terracotta font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>Tìm hiểu thêm</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
            
            {/* Visual */}
            <div className={`${feature.position === 'right' ? 'lg:col-start-1' : ''} flex justify-center ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } transition-all duration-700 ease-out`}
            style={{ transitionDelay: `${index * 200 + 100}ms` }}>
              <div className="relative">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500`}></div>
                
                {/* Main card */}
                <div className={`relative w-48 h-48 bg-gradient-to-br ${feature.bgGradient} rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl group-hover:shadow-3xl group-hover:scale-105 transition-all duration-500`}>
                  {/* Icon container */}
                  <div className={`${feature.iconBg} p-6 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose/60 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-brass/60 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Testimonials Section Component
const TestimonialsSection = ({ isVisible }) => (
  <section className="py-20 px-4 bg-gradient-to-b from-rose/5 to-white">
    <div className="max-w-6xl mx-auto">
      <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brass/10 to-coffee/10 px-4 py-2 rounded-full border border-brass/20 mb-4">
          <FaStar className="text-brass text-sm" />
          <span className="text-sm font-medium text-ink">Đánh giá từ người dùng</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
          Người dùng nói gì về chúng tôi
        </h2>
        <p className="text-lg text-coffee/80 max-w-2xl mx-auto">
          Hàng nghìn người dùng đã tin tưởng và sử dụng ứng dụng của chúng tôi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-2xl shadow-lg border border-rose/10 hover:shadow-xl hover:scale-105 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose to-terracotta rounded-full flex items-center justify-center text-white font-bold">
                {testimonial.avatar}
              </div>
              <div>
                <h4 className="font-semibold text-ink">{testimonial.name}</h4>
                <p className="text-sm text-coffee/60">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-coffee/80 italic">"{testimonial.content}"</p>
            <div className="flex gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-brass text-sm" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Enhanced CTA Section Component
const CTASection = ({ isVisible }) => (
  <section className="py-20 px-4 bg-gradient-to-br from-ink via-coffee to-terracotta relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full animate-bounce"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse"></div>
    </div>
    
    <div className="relative max-w-4xl mx-auto text-center text-white">
      <div className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 mb-6">
          <FaHeart className="text-rose text-sm" />
          <span className="text-sm font-medium">Miễn phí hoàn toàn</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Sẵn sàng bắt đầu?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Tham gia cùng hàng nghìn người dùng đang tận hưởng cuộc sống được tổ chức tốt hơn
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="group bg-white text-terracotta px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-500 ease-out flex items-center justify-center gap-2"
          >
            <FaRocket className="group-hover:translate-x-1 transition-transform duration-300" />
            Đăng ký miễn phí
          </Link>
          <Link
            to="/login"
            className="group border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-terracotta transition-all duration-500 ease-out flex items-center justify-center gap-2"
          >
            <FaCheckCircle className="group-hover:scale-110 transition-transform duration-300" />
            Đăng nhập
          </Link>
        </div>
        
        <p className="mt-6 text-sm opacity-75">
          Không cần thẻ tín dụng • Dễ dàng hủy bất kỳ lúc nào
        </p>
      </div>
    </div>
  </section>
);

// Enhanced Footer Component
const Footer = ({ isVisible }) => (
  <footer className="py-16 px-4 bg-gradient-to-b from-ink/5 to-coffee/10">
    <div className="max-w-6xl mx-auto">
      {/* Logo and description */}
      <div className={`text-center mb-12 transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-rose to-terracotta shadow-lg">
            <FaRegStickyNote className="text-white text-2xl" />
          </div>
          <span className="bg-gradient-to-r from-rose via-terracotta to-brass bg-clip-text text-transparent font-bold text-2xl">
            MyNoteWebApp
          </span>
        </div>
        <p className="text-coffee/80 max-w-md mx-auto">
          Đơn giản hóa cuộc sống của bạn với công nghệ hiện đại
        </p>
      </div>

      {/* Navigation links */}
      <div className={`grid grid-cols-2 md:grid-cols-5 gap-8 transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '200ms' }}>
        {footerSections.map((section, index) => (
          <div key={section.title} className="space-y-4">
            <h3 className="font-bold text-ink text-sm uppercase tracking-wide">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link}>
                  <Link 
                    to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-coffee/70 hover:text-terracotta transition-colors duration-200 text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom border */}
      <div className={`mt-12 pt-8 border-t border-rose/20 text-center transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '400ms' }}>
        <p className="text-coffee/60 text-sm">
          © 2024 MyNoteWebApp. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </div>
  </footer>
);

export default function Home() {
  const [animatedElements, setAnimatedElements] = useState({
    hero: false,
    features: false,
    testimonials: false,
    cta: false,
    footer: false
  });

  const [heroRef, heroInView] = useInView({ threshold: 0.1, once: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, once: true });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.1, once: true });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, once: true });
  const [footerRef, footerInView] = useInView({ threshold: 0.1, once: true });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedElements(prev => ({ ...prev, hero: true }));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (featuresInView) {
      setAnimatedElements(prev => ({ ...prev, features: true }));
    }
  }, [featuresInView]);

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

  const handleGetStarted = () => {
    toast.success("Welcome to MyNoteWebApp! 🎉");
  };

  return (
    <>
      <AuroraBackground intensity={0.85} />
      <div className="min-h-screen app-content-layer">
      {/* Hero Section */}
      <div ref={heroRef}>
        <HeroSection isVisible={animatedElements.hero} onGetStarted={handleGetStarted} />
      </div>

      {/* Features Section */}
      <div ref={featuresRef}>
        <FeaturesSection isVisible={animatedElements.features} />
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
