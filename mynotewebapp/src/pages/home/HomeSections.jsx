import { Link } from "react-router-dom";
import { FaArrowRight, FaPlusCircle, FaCheck } from "react-icons/fa";
import { useContext } from "react";
import ChibiMascot from "../../components/ChibiMascot";
import { useInView } from "../../utils/useInView";
import { AuthContext } from "../../context/AuthContext";
import {
  FEATURES,
  HERO_STATS,
  SECTION_IDS,
  VALUE_PROPS,
  WORKFLOW_STEPS,
} from "./homeConstants";

/** Shared panel chrome — keeps section visuals consistent and easy to tweak */
function SectionShell({ children, className = "" }) {
  return (
    <div
      className={`
        relative rounded-3xl overflow-hidden
        bg-white/75 dark:bg-ink/40
        border border-terracotta/20 dark:border-terracotta/30
        backdrop-blur-md shadow-xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}

function HeroBackgroundOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
      <div className="home-orb home-orb-1 absolute -top-20 -left-16 w-72 h-72 rounded-full bg-gradient-to-br from-terracotta/30 via-brass/20 to-rose/15 blur-3xl" />
      <div className="home-orb home-orb-2 absolute top-1/2 -right-20 w-64 h-64 rounded-full bg-gradient-to-bl from-coffee/20 to-terracotta/25 blur-3xl" />
      <div className="home-orb home-orb-3 absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-gradient-to-tr from-brass/15 via-rose/10 to-transparent blur-3xl" />
    </div>
  );
}

/**
 * Hero — primary headline, CTAs, mascot, stat strip
 */
export function HeroSection() {
  return (
    <section
      id={SECTION_IDS.hero}
      className="relative px-4 sm:px-6 pt-10 pb-6 lg:pt-14 lg:pb-10 min-h-[min(70vh,820px)] flex flex-col justify-center"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-6xl mx-auto w-full">
        <SectionShell className="home-hero-panel home-shimmer-edge">
          <HeroBackgroundOrbs />

          <div className="relative z-[2] grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl mx-auto lg:mx-0">
              <div
                className="home-animate-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-ink/55 border border-terracotta/25 shadow-sm mb-5"
                style={{ animationDelay: "0.05s" }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brass opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brass" />
                </span>
                <span className="text-terracotta dark:text-brass font-semibold text-sm tracking-wide">
                  Notes · Todo · Weekly Plan
                </span>
              </div>

              <h1
                id="hero-heading"
                className="home-animate-reveal text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-bold text-ink dark:text-paper mb-4 leading-tight"
                style={{ animationDelay: "0.12s" }}
              >
                Chào mừng đến{" "}
                <span className="bg-gradient-to-r from-terracotta via-brass to-rose bg-clip-text text-transparent animate-gradient">
                  MyNoteWeb3
                </span>
              </h1>

              <p
                className="home-animate-reveal text-base sm:text-lg text-coffee dark:text-latte mb-7 max-w-md lg:max-w-none leading-relaxed"
                style={{ animationDelay: "0.2s" }}
              >
                Trợ lý ghi chú và quản lý công việc — ghi lại ý tưởng, xử lý todo và nhìn toàn cảnh tuần
                trong một giao diện ấm, rõ ràng.
              </p>

              <div
                className="home-animate-reveal flex flex-wrap gap-3 justify-center lg:justify-start mb-10"
                style={{ animationDelay: "0.28s" }}
              >
                <Link
                  to="/create"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-terracotta to-brass text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <FaPlusCircle className="transition-transform duration-300 group-hover:rotate-12" />
                  Tạo ghi chú ngay
                </Link>
                <Link
                  to="/todo"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/95 dark:bg-ink/65 text-ink dark:text-paper font-semibold border-2 border-terracotta/45 hover:border-terracotta hover:bg-white dark:hover:bg-ink/80 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Xem Todo
                  <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              <dl
                className="home-animate-reveal grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg lg:max-w-none"
                style={{ animationDelay: "0.36s" }}
              >
                {HERO_STATS.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-2xl bg-white/60 dark:bg-ink/50 border border-terracotta/15 px-3 py-3 sm:px-4 sm:py-4 text-center lg:text-left"
                  >
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-terracotta to-brass bg-clip-text text-transparent tabular-nums">
                      {s.value}
                    </dd>
                    <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-coffee/80 dark:text-latte/80 mt-1">
                      {s.label}
                    </div>
                    <div className="hidden sm:block text-[11px] text-coffee/70 dark:text-latte/70 mt-0.5 leading-snug">
                      {s.sub}
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div
              className="home-animate-reveal flex justify-center lg:justify-end relative"
              style={{ animationDelay: "0.22s" }}
            >
              <div className="relative w-full max-w-[320px] sm:max-w-[360px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-terracotta/25 via-brass/15 to-rose/20 blur-3xl rounded-full scale-110 home-orb home-orb-mascot" />
                <div className="relative rounded-[2rem] border border-white/50 dark:border-ink/40 bg-gradient-to-b from-white/40 to-transparent dark:from-ink/30 p-6 sm:p-8 shadow-inner">
                  <ChibiMascot size={228} className="drop-shadow-2xl mx-auto w-auto max-w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </SectionShell>
      </div>
    </section>
  );
}

function FeatureCard({ feature, isInView, delay }) {
  const Icon = feature.icon;
  return (
    <article
      className={`
        group relative rounded-2xl h-full
        transition-all duration-500 ease-out
        ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        hover:-translate-y-1
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`rounded-2xl bg-gradient-to-br ${feature.gradient} p-px shadow-md group-hover:shadow-xl transition-shadow duration-300`}>
        <div
          className="
            h-full p-6 sm:p-7 rounded-[0.95rem] bg-white/95 dark:bg-ink/55 backdrop-blur-sm
            border border-terracotta/10 dark:border-terracotta/25
            relative overflow-hidden
          "
        >
          <div
            className={`absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${feature.gradient} opacity-20 blur-2xl pointer-events-none group-hover:opacity-30 transition-opacity`}
          />
          <div className="relative">
            <div
              className={`
                w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                bg-gradient-to-br ${feature.gradient} text-white shadow-md
                transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
              `}
            >
              <Icon className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-ink dark:text-paper mb-2">{feature.title}</h3>
            <p className="text-coffee dark:text-latte mb-5 text-sm sm:text-base leading-relaxed">
              {feature.description}
            </p>
            <Link
              to={feature.to}
              className="inline-flex items-center gap-2 text-terracotta dark:text-brass font-semibold group/link"
            >
              <span className="border-b border-transparent group-hover/link:border-terracotta dark:group-hover/link:border-brass transition-colors">
                {feature.label}
              </span>
              <FaArrowRight className="text-sm transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Feature grid — driven by FEATURES in homeConstants.js
 */
export function FeaturesSection() {
  const [ref, isInView] = useInView({
    threshold: 0.08,
    rootMargin: "0px 0px -40px 0px",
  });

  return (
    <section
      id={SECTION_IDS.features}
      ref={ref}
      className="px-4 sm:px-6 py-14 lg:py-20"
      aria-labelledby="features-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 lg:mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta dark:text-brass mb-2">
            Khám phá
          </p>
          <h2
            id="features-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink dark:text-paper mb-3"
          >
            Bạn có thể làm gì?
          </h2>
          <p className="text-coffee dark:text-latte max-w-2xl mx-auto leading-relaxed">
            Ba trụ cột chính — mỗi phần được thiết kế để bạn vào việc nhanh và giữ tập trung lâu hơn.
          </p>
        </div>

        <div className="relative rounded-3xl bg-gradient-to-br from-white/50 to-white/20 dark:from-ink/35 dark:to-ink/20 border border-terracotta/15 p-6 sm:p-8 lg:p-10 shadow-lg">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-terracotta/40 to-transparent" />
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {FEATURES.map((feature, i) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                isInView={isInView}
                delay={i * 100}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Value props — concise reasons to trust the product
 */
export function ValuePropsSection() {
  const [ref, isInView] = useInView({
    threshold: 0.12,
    rootMargin: "0px 0px -30px 0px",
  });

  return (
    <section className="px-4 sm:px-6 py-6 lg:py-8" aria-labelledby="value-heading">
      <div ref={ref} className="max-w-6xl mx-auto">
        <h2 id="value-heading" className="sr-only">
          Vì sao chọn MyNoteWeb3
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {VALUE_PROPS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`
                  flex gap-4 p-5 rounded-2xl border border-terracotta/15 dark:border-terracotta/25
                  bg-white/55 dark:bg-ink/30 backdrop-blur-sm shadow-sm
                  transition-all duration-500
                  ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                  hover:border-terracotta/35 hover:shadow-md
                `}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-terracotta/20 to-brass/20 flex items-center justify-center text-terracotta dark:text-brass">
                  <Icon className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-ink dark:text-paper mb-1">{item.title}</h3>
                  <p className="text-sm text-coffee dark:text-latte leading-relaxed">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Workflow — numbered steps with CTAs (content from homeConstants.js)
 */
export function WorkflowSection() {
  const [ref, isInView] = useInView({
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px",
  });

  return (
    <section
      id={SECTION_IDS.workflow}
      ref={ref}
      className="px-4 sm:px-6 py-14 lg:py-20"
      aria-labelledby="workflow-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 lg:mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta dark:text-brass mb-2">
            Quy trình
          </p>
          <h2
            id="workflow-heading"
            className="text-2xl sm:text-3xl font-bold text-ink dark:text-paper mb-2"
          >
            Từ ý tưởng đến kế hoạch tuần
          </h2>
          <p className="text-coffee dark:text-latte max-w-xl mx-auto text-sm sm:text-base">
            Ba bước đơn giản — phù hợp cả khi bạn chỉ cần ghi nhanh hay quản lý cả tuần.
          </p>
        </div>

        <SectionShell>
          <div className="relative grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-terracotta/15 dark:divide-terracotta/25">
            {WORKFLOW_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`
                  relative p-6 sm:p-8 lg:p-10 flex flex-col
                  transition-all duration-500
                  ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                `}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-terracotta to-brass text-white font-bold text-sm flex items-center justify-center shadow-md">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-ink dark:text-paper">{step.title}</h3>
                    <p className="text-sm text-coffee dark:text-latte mt-1 leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
                <ul className="mt-auto space-y-2 text-sm text-coffee/90 dark:text-latte/90 mb-5 pl-0 list-none">
                  {step.highlights.map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <FaCheck className="text-olive flex-shrink-0 text-xs mt-1" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={step.to}
                  className="inline-flex items-center gap-2 text-terracotta dark:text-brass font-semibold text-sm hover:gap-3 transition-all w-fit"
                >
                  {step.cta}
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            ))}
          </div>
        </SectionShell>
      </div>
    </section>
  );
}

/**
 * Full-width CTA band before quick actions
 */
export function FinalCTASection() {
  return (
    <section className="px-4 sm:px-6 py-10 lg:py-12" aria-labelledby="cta-heading">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-terracotta/25 shadow-xl">
          <div
            className="absolute inset-0 bg-gradient-to-r from-terracotta via-coffee to-brass opacity-95 home-cta-gradient"
            aria-hidden="true"
          />
          <div className="relative px-6 py-10 sm:px-10 sm:py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 text-center lg:text-left">
            <div className="max-w-xl mx-auto lg:mx-0">
              <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Sẵn sàng ghi lại điều quan trọng?
              </h2>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                Mở ghi chú mới trong vài giây — hoặc xem todo và tuần của bạn ngay bây giờ.
              </p>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end gap-3">
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-terracotta font-bold shadow-lg hover:bg-paper transition-colors duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaPlusCircle />
                Tạo ghi chú
              </Link>
              <Link
                to="/weekly-plan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/15 text-white font-semibold border-2 border-white/40 hover:bg-white/25 transition-all duration-300"
              >
                Weekly Plan
                <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Quick actions + auth hint for guests
 */
export function QuickActionsSection() {
  const { user } = useContext(AuthContext) || {};

  return (
    <section
      id={SECTION_IDS.quickStart}
      className="px-4 sm:px-6 pb-16 lg:pb-20 pt-2"
      aria-labelledby="quick-actions-heading"
    >
      <div className="max-w-6xl mx-auto">
        <SectionShell className="p-6 sm:p-8 lg:p-10">
          <div className="absolute -top-24 right-0 w-72 h-72 rounded-full bg-gradient-to-bl from-brass/20 to-transparent blur-3xl pointer-events-none" />
          <div className="relative">
            <h2
              id="quick-actions-heading"
              className="text-xl sm:text-2xl font-bold text-ink dark:text-paper text-center mb-2"
            >
              Bắt đầu nhanh
            </h2>
            <p className="text-center text-coffee dark:text-latte text-sm mb-8 max-w-lg mx-auto">
              Chọn đúng việc bạn cần — mỗi ô dưới đây dẫn thẳng tới trang tương ứng.
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <Link
                    key={f.id}
                    to={f.to}
                    className={`
                      group flex items-center gap-3 px-5 py-3.5 rounded-2xl min-w-[200px] sm:min-w-0
                      bg-white/90 dark:bg-ink/55 border border-terracotta/25
                      hover:border-terracotta hover:shadow-lg
                      transition-all duration-300 hover:-translate-y-1
                    `}
                  >
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${f.gradient} text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="text-lg" />
                    </span>
                    <span className="font-semibold text-ink dark:text-paper">{f.label}</span>
                  </Link>
                );
              })}
            </div>

            {!user && (
              <p className="text-center text-coffee dark:text-latte mt-8 text-sm">
                <Link to="/login" className="text-terracotta dark:text-brass font-semibold hover:underline">
                  Đăng nhập
                </Link>
                {" hoặc "}
                <Link to="/register" className="text-terracotta dark:text-brass font-semibold hover:underline">
                  Đăng ký
                </Link>
                {" để lưu dữ liệu của bạn."}
              </p>
            )}
          </div>
        </SectionShell>
      </div>
    </section>
  );
}
