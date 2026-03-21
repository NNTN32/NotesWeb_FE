import { Link } from "react-router-dom";
import {
  FaRegStickyNote,
  FaTasks,
  FaCalendarAlt,
  FaPlusCircle,
  FaArrowRight,
} from "react-icons/fa";
import ChibiMascot from "../components/ChibiMascot";
import AuroraBackground from "../components/AuroraBackground";
import { useInView } from "../utils/useInView";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/** Feature card config - single source of truth for maintainability */
const FEATURES = [
  {
    id: "notes",
    title: "Ghi chú",
    description: "Tạo và quản lý ghi chú mọi lúc mọi nơi. Ghi lại ý tưởng, tài liệu và thông tin quan trọng.",
    icon: FaRegStickyNote,
    to: "/create",
    gradient: "from-terracotta to-brass",
    label: "Tạo ghi chú",
  },
  {
    id: "todo",
    title: "Todo",
    description: "Theo dõi công việc với danh sách todo. Ưu tiên, lọc và hoàn thành từng nhiệm vụ.",
    icon: FaTasks,
    to: "/todo",
    gradient: "from-coffee to-terracotta",
    label: "Xem Todo",
  },
  {
    id: "weekly",
    title: "Weekly Plan",
    description: "Lên kế hoạch tuần hiệu quả. Phân bổ thời gian và theo dõi tiến độ hàng ngày.",
    icon: FaCalendarAlt,
    to: "/weekly-plan",
    gradient: "from-rose to-coffee",
    label: "Lên kế hoạch",
  },
];

/**
 * Hero section with chibi mascot and main headline
 */
function HeroSection() {
  return (
    <section
      className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-6 py-12 lg:py-20 min-h-[60vh]"
      aria-labelledby="hero-heading"
    >
      <div className="w-full max-w-5xl">
        <div className="relative rounded-3xl bg-white/70 dark:bg-ink/35 border border-terracotta/20 backdrop-blur-sm shadow-xl overflow-hidden">
          {/* Soft glow behind hero content (not too flashy) */}
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-gradient-to-br from-terracotta/25 via-brass/20 to-rose/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-coffee/15 to-terracotta/20 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-6 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-ink/60 border border-terracotta/20 shadow-sm mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-brass" />
                <span className="text-terracotta dark:text-brass font-semibold text-sm">
                  Notes + Todo + Weekly Plan
                </span>
              </div>

              <h1
                id="hero-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink dark:text-paper mb-4 animate-hero-in animate-hero-in-delay-1"
              >
                Chào mừng đến{" "}
                <span className="bg-gradient-to-r from-terracotta via-brass to-rose bg-clip-text text-transparent">
                  MyNoteWeb3
                </span>
              </h1>

              <p className="text-lg text-coffee dark:text-latte mb-6 animate-hero-in animate-hero-in-delay-2">
                Trợ lý ghi chú và quản lý công việc của bạn. Ghi chú, todo và kế hoạch tuần — tất cả ở một nơi.
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start animate-hero-in animate-hero-in-delay-3">
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-terracotta to-brass text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <FaPlusCircle />
                  Tạo ghi chú ngay
                </Link>
                <Link
                  to="/todo"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/90 dark:bg-ink/70 text-ink dark:text-paper font-semibold border-2 border-terracotta/50 hover:border-terracotta hover:bg-white/100 transition-all duration-300"
                >
                  Xem Todo
                  <FaArrowRight className="text-sm" />
                </Link>
              </div>
            </div>

            <div className="animate-hero-in animate-hero-in-delay-4 flex-shrink-0 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-r from-terracotta/20 via-brass/10 to-rose/20 blur-2xl rounded-full" />
                <ChibiMascot size={210} className="drop-shadow-2xl relative" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Feature card - reusable, descriptive
 */
function FeatureCard({ feature, isInView, delay }) {
  const Icon = feature.icon;
  return (
    <article
      className={`
        relative rounded-2xl
        transition-all duration-300
        ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        hover:-translate-y-1
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Gradient border wrapper */}
      <div className={`rounded-2xl bg-gradient-to-r ${feature.gradient} p-[1px]`}>
        <div
          className={`
            h-full p-6 rounded-2xl bg-white/92 dark:bg-ink/50 backdrop-blur-sm relative
            border border-terracotta/20 dark:border-terracotta/35
            shadow-md hover:shadow-xl
          `}
        >
          {/* Subtle glow */}
          <div
            className={`absolute -top-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-br ${feature.gradient} opacity-15 blur-2xl pointer-events-none`}
          />
          <div className="relative">
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${feature.gradient} text-white shadow-sm`}
            >
              <Icon className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-ink dark:text-paper mb-2">
              {feature.title}
            </h3>
            <p className="text-coffee dark:text-latte mb-4 text-sm sm:text-base leading-relaxed">
              {feature.description}
            </p>
            <Link
              to={feature.to}
              className="inline-flex items-center gap-2 text-terracotta dark:text-brass font-semibold hover:gap-3 transition-all"
            >
              {feature.label}
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Features grid - explains app functions
 */
function FeaturesSection() {
  const [ref, isInView] = useInView({ threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  return (
    <section
      ref={ref}
      className="px-6 py-16 lg:py-24"
      aria-labelledby="features-heading"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          id="features-heading"
          className="text-2xl sm:text-3xl font-bold text-ink dark:text-paper text-center mb-4"
        >
          Bạn có thể làm gì?
        </h2>
        <p className="text-coffee dark:text-latte text-center max-w-2xl mx-auto mb-10">
          MyNoteWeb3 giúp bạn ghi chú, quản lý công việc và lên kế hoạch — đơn giản, rõ ràng.
        </p>

        {/* Wrapper panel to make the section feel less plain */}
        <div className="relative rounded-3xl bg-white/55 dark:bg-ink/25 border border-terracotta/15 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
          <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-gradient-to-br from-terracotta/20 via-brass/15 to-rose/15 blur-3xl pointer-events-none" />
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {FEATURES.map((feature, i) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                isInView={isInView}
                delay={i * 120}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Quick actions for logged-in or guest users
 */
function QuickActionsSection() {
  const { user } = useContext(AuthContext) || {};

  return (
    <section
      className="px-6 py-12 lg:py-16 mb-8"
      aria-labelledby="quick-actions-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl bg-white/65 dark:bg-ink/30 border border-terracotta/20 backdrop-blur-sm shadow-lg p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-br from-terracotta/20 via-brass/15 to-rose/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-br from-coffee/15 to-terracotta/20 blur-3xl pointer-events-none" />

          <div className="relative">
            <h2
              id="quick-actions-heading"
              className="text-xl sm:text-2xl font-bold text-ink dark:text-paper text-center mb-8"
            >
              Bắt đầu nhanh
            </h2>

            <div className="flex flex-wrap justify-center gap-4">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <Link
                    key={f.id}
                    to={f.to}
                    className={`
                      flex items-center gap-3 px-5 py-3 rounded-xl
                      bg-white/85 dark:bg-ink/60 border border-terracotta/30
                      hover:border-terracotta hover:shadow-lg
                      transition-all duration-300 hover:scale-105
                    `}
                  >
                    <Icon className="text-terracotta text-xl" />
                    <span className="font-semibold text-ink dark:text-paper">{f.label}</span>
                  </Link>
                );
              })}
            </div>

            {!user && (
              <p className="text-center text-coffee dark:text-latte mt-6 text-sm">
                <Link to="/login" className="text-terracotta font-semibold hover:underline">
                  Đăng nhập
                </Link>
                {" hoặc "}
                <Link to="/register" className="text-terracotta font-semibold hover:underline">
                  Đăng ký
                </Link>
                {" để lưu dữ liệu của bạn."}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Home page - landing layout with hero, features, quick actions
 */
export default function Home() {
  return (
    <div className="patterncraft-bg notes-bg min-h-screen relative">
      <AuroraBackground intensity={0.8} />
      <div className="patterncraft-content relative z-10">
        <HeroSection />
        <FeaturesSection />
        <QuickActionsSection />
      </div>
    </div>
  );
}
