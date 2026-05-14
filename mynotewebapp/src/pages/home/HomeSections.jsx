import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaPlusCircle,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaLightbulb,
} from "react-icons/fa";
import { useCallback, useContext, useEffect, useState } from "react";
import ChibiMascot from "../../components/ChibiMascot";
import { useInView } from "../../utils/useInView";
import { AuthContext } from "../../context/AuthContext";
import {
  FEATURES,
  HERO_STATS,
  HOME_JUMP_LINKS,
  SECTION_IDS,
  USER_SCENARIOS,
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

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Sticky jump bar — scroll targets are SECTION_IDS from homeConstants.js
 */
export function SectionJumpBar() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`
        z-30 px-4 sm:px-6 -mt-2 mb-6 transition-all duration-300
        ${stuck ? "sticky top-3" : "relative"}
      `}
    >
      <div className="max-w-6xl mx-auto flex justify-center">
        <nav
          className={`
            inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl
            bg-white/80 dark:bg-ink/55 border border-terracotta/20 dark:border-terracotta/30
            shadow-lg backdrop-blur-md transition-shadow duration-300
            ${stuck ? "shadow-xl ring-1 ring-terracotta/10" : ""}
          `}
          aria-label="Điều hướng nhanh trang chủ"
        >
          {HOME_JUMP_LINKS.map((item) => (
            <button
              key={item.sectionId}
              type="button"
              onClick={() => scrollToSection(item.sectionId)}
              className="
                px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold
                text-coffee dark:text-latte
                hover:bg-terracotta/10 hover:text-terracotta dark:hover:text-brass
                focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/60 focus-visible:ring-offset-2
                dark:focus-visible:ring-offset-ink transition-colors
              "
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

/**
 * Problem → solution picker — state is local for predictable debugging
 */
export function ProblemSolverSection() {
  const [activeId, setActiveId] = useState(USER_SCENARIOS[0]?.id ?? "");
  const active = USER_SCENARIOS.find((s) => s.id === activeId) ?? USER_SCENARIOS[0];
  const relatedFeature = FEATURES.find((f) => f.id === active?.featureId);

  const [ref, isInView] = useInView({
    threshold: 0.08,
    rootMargin: "0px 0px -24px 0px",
  });

  if (!active) return null;

  return (
    <section
      id={SECTION_IDS.scenarios}
      ref={ref}
      className="px-4 sm:px-6 py-10 lg:py-14"
      aria-labelledby="scenarios-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 lg:mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta dark:text-brass mb-2">
            Bắt đầu từ vấn đề của bạn
          </p>
          <h2
            id="scenarios-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink dark:text-paper mb-3"
          >
            Chọn tình huống gần với bạn nhất
          </h2>
          <p className="text-coffee dark:text-latte max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
            Mỗi lựa chọn gợi ý cách dùng app để giảm ma sát — bạn luôn có thể đổi ý và thử module khác.
          </p>
        </div>

        <SectionShell>
          <div className="absolute inset-0 bg-gradient-to-br from-terracotta/[0.06] via-transparent to-brass/[0.07] pointer-events-none" />
          <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-0 lg:gap-0">
            <div
              className="p-4 sm:p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-terracotta/15 dark:border-terracotta/25"
              role="tablist"
              aria-label="Tình huống thường gặp"
            >
              <div className="flex flex-col gap-2">
                {USER_SCENARIOS.map((scenario, i) => {
                  const Icon = scenario.icon;
                  const selected = scenario.id === active.id;
                  return (
                    <button
                      key={scenario.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      id={`scenario-tab-${scenario.id}`}
                      aria-controls={`scenario-panel-${scenario.id}`}
                      onClick={() => setActiveId(scenario.id)}
                      className={`
                        text-left rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 transition-all duration-300
                        flex gap-3 items-start
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/55 focus-visible:ring-offset-2
                        dark:focus-visible:ring-offset-ink
                        ${selected
                          ? "bg-gradient-to-r from-terracotta/15 to-brass/10 dark:from-terracotta/25 dark:to-brass/15 border-2 border-terracotta/40 shadow-md scale-[1.01]"
                          : "bg-white/50 dark:bg-ink/35 border border-transparent hover:border-terracotta/25 hover:bg-white/70 dark:hover:bg-ink/50"
                        }
                        ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                      `}
                      style={{ transitionDelay: `${i * 60}ms` }}
                    >
                      <span
                        className={`
                          flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg
                          ${selected
                            ? "bg-gradient-to-br from-terracotta to-brass text-white shadow-md"
                            : "bg-terracotta/10 dark:bg-brass/15 text-terracotta dark:text-brass"
                          }
                        `}
                      >
                        <Icon />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-bold text-ink dark:text-paper text-sm sm:text-base leading-snug">
                          {scenario.pain}
                        </span>
                        <span className="block text-xs sm:text-sm text-coffee dark:text-latte mt-1 line-clamp-2">
                          {scenario.detail}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center min-h-[280px]"
              role="tabpanel"
              id={`scenario-panel-${active.id}`}
              aria-labelledby={`scenario-tab-${active.id}`}
            >
              <div
                key={active.id}
                className="home-animate-reveal"
                style={{ animationDuration: "0.45s", animationDelay: "0s" }}
              >
                <div className="inline-flex items-center gap-2 text-terracotta dark:text-brass font-semibold text-sm mb-3">
                  <FaLightbulb className="text-base" aria-hidden />
                  Gợi ý lộ trình
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-ink dark:text-paper mb-3">
                  {active.solveTitle}
                </h3>
                <p className="text-coffee dark:text-latte leading-relaxed mb-6 text-sm sm:text-base">
                  {active.solveBody}
                </p>

                {relatedFeature && (
                  <div className="rounded-2xl border border-terracotta/20 dark:border-terracotta/30 bg-white/60 dark:bg-ink/40 p-4 mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-coffee/80 dark:text-latte/80 mb-1">
                      Module liên quan
                    </p>
                    <p className="font-semibold text-ink dark:text-paper">{relatedFeature.title}</p>
                    <p className="text-sm text-coffee dark:text-latte mt-1">{relatedFeature.description}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={active.to}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-terracotta to-brass text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    {active.cta}
                    <FaArrowRight className="text-sm" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => scrollToSection(SECTION_IDS.workflow)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-terracotta/35 text-ink dark:text-paper font-semibold hover:bg-terracotta/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50"
                  >
                    Xem quy trình 3 bước
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SectionShell>
      </div>
    </section>
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
  const onExploreClick = useCallback(() => {
    scrollToSection(SECTION_IDS.scenarios);
  }, []);

  return (
    <section
      id={SECTION_IDS.hero}
      className="relative px-4 sm:px-6 pt-10 pb-4 lg:pt-14 lg:pb-6 min-h-[min(72vh,840px)] flex flex-col justify-center"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-6xl mx-auto w-full">
        <SectionShell className="home-hero-panel home-shimmer-edge overflow-visible">
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
                className="home-animate-reveal grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg lg:max-w-none mb-6"
                style={{ animationDelay: "0.36s" }}
              >
                {HERO_STATS.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-2xl bg-white/60 dark:bg-ink/50 border border-terracotta/15 px-3 py-3 sm:px-4 sm:py-4 text-center lg:text-left transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-default"
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

              <button
                type="button"
                onClick={onExploreClick}
                className="home-animate-reveal group flex flex-col items-center gap-1 text-coffee dark:text-latte text-xs sm:text-sm font-medium hover:text-terracotta dark:hover:text-brass transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 rounded-xl px-3 py-2"
                style={{ animationDelay: "0.44s" }}
              >
                <span>Tìm giải pháp cho tình huống của bạn</span>
                <FaChevronDown
                  className="text-terracotta/70 motion-safe:animate-bounce group-hover:text-terracotta"
                  aria-hidden
                />
              </button>
            </div>

            <div
              className="home-animate-reveal flex justify-center lg:justify-end relative"
              style={{ animationDelay: "0.22s" }}
            >
              <div className="relative w-full max-w-[320px] sm:max-w-[360px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-terracotta/25 via-brass/15 to-rose/20 blur-3xl rounded-full scale-110 home-orb home-orb-mascot" />
                <div className="relative rounded-[2rem] border border-white/50 dark:border-ink/40 bg-gradient-to-b from-white/40 to-transparent dark:from-ink/30 p-6 sm:p-8 shadow-inner transition-transform duration-500 hover:scale-[1.02]">
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

function FeatureCard({ feature, isInView, delay, expanded, onToggleTips }) {
  const Icon = feature.icon;
  const tips = feature.tips ?? [];
  const showTips = expanded && tips.length > 0;

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
            relative overflow-hidden flex flex-col
          "
        >
          <div
            className={`absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${feature.gradient} opacity-20 blur-2xl pointer-events-none group-hover:opacity-30 transition-opacity`}
          />
          <div className="relative flex flex-col flex-1">
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
            <p className="text-coffee dark:text-latte mb-4 text-sm sm:text-base leading-relaxed">
              {feature.description}
            </p>

            {tips.length > 0 && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => onToggleTips(feature.id)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta dark:text-brass hover:underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 rounded-lg"
                  aria-expanded={expanded}
                >
                  {expanded ? (
                    <>
                      Ẩn gợi ý
                      <FaChevronUp className="text-xs" aria-hidden />
                    </>
                  ) : (
                    <>
                      Gợi ý sử dụng
                      <FaChevronDown className="text-xs" aria-hidden />
                    </>
                  )}
                </button>
                {showTips && (
                  <ul className="mt-3 space-y-2 text-sm text-coffee dark:text-latte border-t border-terracotta/15 pt-3">
                    {tips.map((tip) => (
                      <li key={tip} className="flex gap-2 items-start">
                        <FaCheck className="text-olive flex-shrink-0 text-xs mt-0.5" aria-hidden />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <Link
              to={feature.to}
              className="inline-flex items-center gap-2 text-terracotta dark:text-brass font-semibold group/link mt-auto"
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
  const [expandedId, setExpandedId] = useState(null);

  const toggleTips = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

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
            Ba trụ cột chính — mở rộng “Gợi ý sử dụng” nếu bạn muốn vài cách làm cụ thể hơn.
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
                expanded={expandedId === feature.id}
                onToggleTips={toggleTips}
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
    <section className="px-4 sm:px-6 py-8 lg:py-10" aria-labelledby="value-heading">
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
                  group flex gap-4 p-5 rounded-2xl border border-terracotta/15 dark:border-terracotta/25
                  bg-white/55 dark:bg-ink/30 backdrop-blur-sm shadow-sm
                  transition-all duration-500
                  ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                  hover:border-terracotta/40 hover:shadow-lg hover:-translate-y-0.5
                  cursor-default
                `}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-terracotta/20 to-brass/20 flex items-center justify-center text-terracotta dark:text-brass transition-transform duration-300 group-hover:scale-110">
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
 * Workflow — numbered steps with expandable detail (single-open accordion)
 */
export function WorkflowSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const [ref, isInView] = useInView({
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px",
  });

  const toggleStep = useCallback((index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }, []);

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
            Chạm từng bước để xem chi tiết — ba bước đơn giản cho cả ghi nhanh và quản lý cả tuần.
          </p>
        </div>

        <SectionShell>
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-terracotta/15 dark:divide-terracotta/25">
            {WORKFLOW_STEPS.map((step, index) => {
              const open = openIndex === index;
              return (
                <div
                  key={step.id}
                  className={`
                    relative transition-all duration-500
                    ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                  `}
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => toggleStep(index)}
                    className="w-full text-left p-6 sm:p-8 lg:p-10 flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-terracotta/40 bg-transparent hover:bg-terracotta/[0.04] dark:hover:bg-brass/[0.06] transition-colors rounded-none"
                    aria-expanded={open}
                    aria-controls={`workflow-detail-${step.id}`}
                    id={`workflow-trigger-${step.id}`}
                  >
                    <div className="flex items-start gap-4 mb-2">
                      <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-terracotta to-brass text-white font-bold text-sm flex items-center justify-center shadow-md">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-bold text-ink dark:text-paper pr-2">{step.title}</h3>
                          <span className="text-terracotta dark:text-brass flex-shrink-0 mt-1" aria-hidden>
                            {open ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
                          </span>
                        </div>
                        <p className="text-sm text-coffee dark:text-latte mt-1 leading-relaxed">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </button>

                  <div
                    id={`workflow-detail-${step.id}`}
                    role="region"
                    aria-labelledby={`workflow-trigger-${step.id}`}
                    className={`px-6 sm:px-8 lg:px-10 overflow-hidden transition-all duration-300 ease-out ${open ? "max-h-[320px] opacity-100 pb-6 sm:pb-8 lg:pb-10" : "max-h-0 opacity-0 pointer-events-none"}`}
                  >
                    <ul className="space-y-2 text-sm text-coffee/90 dark:text-latte/90 mb-5 pl-0 list-none border-t border-terracotta/10 pt-4">
                      {step.highlights.map((line) => (
                        <li key={line} className="flex items-start gap-2">
                          <FaCheck className="text-olive flex-shrink-0 text-xs mt-1" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={step.to}
                      className="inline-flex items-center gap-2 text-terracotta dark:text-brass font-semibold text-sm hover:gap-3 transition-all w-fit mb-2"
                    >
                      {step.cta}
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              );
            })}
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
        <div className="relative rounded-3xl overflow-hidden border border-terracotta/25 shadow-xl group">
          <div
            className="absolute inset-0 bg-gradient-to-r from-terracotta via-coffee to-brass opacity-95 home-cta-gradient transition-transform duration-700 group-hover:scale-105"
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
                      transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]
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
                <Link to="/auth/login" className="text-terracotta dark:text-brass font-semibold hover:underline">
                  Đăng nhập
                </Link>
                {" hoặc "}
                <Link to="/auth/register" className="text-terracotta dark:text-brass font-semibold hover:underline">
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
