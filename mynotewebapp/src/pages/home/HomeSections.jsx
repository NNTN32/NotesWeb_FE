import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import {
  SECTION_IDS,
  HOME_MOTION,
  FLOATING_CHIPS,
  HERO_COPY,
  HERO_STATS,
  HERO_DESK_PREVIEW,
  MISSION_COPY,
  PRINCIPLES_COPY,
  RESOURCES_COPY,
  FINAL_CTA_COPY,
  HOME_JUMP_LINKS,
  FEATURES,
  VALUE_PROPS,
  USER_SCENARIOS,
  WORKFLOW_STEPS,
} from "./homeConstants";

/* ========== Scroll + reveal (homepage motion only) ========== */

export function useHomeScrollProgress(pageRef) {
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      root.style.setProperty("--home-scroll", String(Math.min(1, Math.max(0, progress))));

      const mission = root.querySelector("[data-home-mission]");
      if (mission) {
        const rect = mission.getBoundingClientRect();
        const vh = window.innerHeight;
        const band = 1 - Math.min(1, Math.max(0, (rect.top + rect.height * 0.35) / vh));
        root.style.setProperty("--home-mission", String(band));
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pageRef]);
}

function useRevealOnScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("home-reveal--visible");
          observer.unobserve(node);
        }
      },
      {
        rootMargin: HOME_MOTION.revealRootMargin,
        threshold: HOME_MOTION.revealThreshold,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ========== Layout primitives ========== */

function HomeReveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const ref = useRevealOnScroll();
  const style = delay ? { "--home-reveal-delay": `${delay}ms` } : undefined;

  return (
    <Tag
      ref={ref}
      className={`home-reveal ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}

function SectionEyebrow({ children }) {
  return (
    <p className="home-eyebrow text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-terracotta dark:text-brass mb-3">
      {children}
    </p>
  );
}

function SectionTitle({ children, className = "" }) {
  return (
    <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl text-ink dark:text-paper leading-tight ${className}`}>
      {children}
    </h2>
  );
}

function PrimaryButton({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`home-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-paper bg-gradient-to-r from-terracotta to-brass shadow-lg hover:shadow-xl transition-shadow ${className}`}
    >
      {children}
    </Link>
  );
}

function GhostButton({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`home-btn-ghost inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-ink dark:text-paper border-2 border-coffee/25 dark:border-paper/20 hover:border-terracotta/50 transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}

function scrollToSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ========== Hero ========== */

function HeroStickyChips() {
  return (
    <div className="home-sticky-field pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {FLOATING_CHIPS.map((chip) => (
        <div
          key={chip.id}
          className={`home-sticky-chip home-sticky-chip--${chip.variant} ${chip.alt ? "home-sticky-chip--alt" : ""}`}
          style={{
            top: chip.top,
            left: chip.left,
            "--chip-delay": chip.delay,
            "--chip-duration": chip.duration,
            "--chip-rotate": chip.rotate,
          }}
        >
          <span className="home-sticky-tape" />
          {chip.label}
        </div>
      ))}
    </div>
  );
}

function HeroDeskStack() {
  return (
    <div className="home-desk-stack relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto aspect-[4/3] sm:aspect-[5/4]">
      {HERO_DESK_PREVIEW.map((card, index) => (
        <article
          key={card.id}
          className={`home-desk-card home-desk-card--${card.tone}`}
          style={{ "--desk-index": index }}
        >
          <div className="home-desk-card-hole" />
          <h3 className="font-semibold text-ink dark:text-ink text-sm sm:text-base mb-2">{card.title}</h3>
          <ul className="space-y-1.5 text-xs sm:text-sm text-coffee/90 dark:text-coffee">
            {card.lines.map((line) => (
              <li key={line} className="home-ruled-line pl-1">
                {line}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      id={SECTION_IDS.hero}
      className="home-hero relative pt-10 sm:pt-16 pb-16 sm:pb-24 min-h-[88vh] flex flex-col justify-center"
    >
      <HeroStickyChips />

      <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <HomeReveal delay={0}>
            <p className="home-eyebrow inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand/80 dark:bg-coffee/30 text-terracotta dark:text-brass text-xs font-bold tracking-widest uppercase mb-6">
              <span className="home-pulse-dot" />
              {HERO_COPY.eyebrow}
            </p>
          </HomeReveal>

          <HomeReveal delay={80}>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-ink dark:text-paper leading-[1.08] mb-6">
              {HERO_COPY.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="block home-headline-accent">{HERO_COPY.headlineAccent}</span>
            </h1>
          </HomeReveal>

          <HomeReveal delay={160}>
            <p className="text-base sm:text-lg text-coffee dark:text-latte/90 max-w-xl mb-8 leading-relaxed">
              {HERO_COPY.subline}
            </p>
          </HomeReveal>

          <HomeReveal delay={240} className="flex flex-wrap gap-3 mb-10">
            <PrimaryButton to="/create">{HERO_COPY.primaryCta}</PrimaryButton>
            <GhostButton to="/todo">{HERO_COPY.secondaryCta}</GhostButton>
          </HomeReveal>

          <HomeReveal delay={320}>
            <dl className="grid grid-cols-3 gap-3 sm:gap-4">
              {HERO_STATS.map((stat) => (
                <div key={stat.id} className="home-stat-pill text-center p-3 sm:p-4 rounded-2xl">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-serif text-2xl sm:text-3xl text-terracotta dark:text-brass">{stat.value}</dd>
                  <dd className="text-[10px] sm:text-xs font-semibold text-ink dark:text-paper mt-1 leading-tight">{stat.label}</dd>
                  <dd className="text-[9px] sm:text-[10px] text-coffee/70 dark:text-latte/60 mt-0.5 hidden sm:block">{stat.sub}</dd>
                </div>
              ))}
            </dl>
          </HomeReveal>
        </div>

        <HomeReveal delay={120} className="relative">
          <HeroDeskStack />
        </HomeReveal>
      </div>

      <p className="home-scroll-hint absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs text-coffee/60 dark:text-latte/50">
        <span>{HERO_COPY.exploreHint}</span>
        <FaChevronDown className="w-4 h-4 home-scroll-hint-icon" aria-hidden="true" />
      </p>
    </section>
  );
}

/* ========== Jump bar ========== */

export function SectionJumpBar() {
  const [active, setActive] = useState(HOME_JUMP_LINKS[0]?.sectionId);

  const handleJump = useCallback((sectionId) => {
    setActive(sectionId);
    scrollToSection(sectionId);
  }, []);

  return (
    <nav
      className="home-jump-bar sticky top-2 z-30 mb-12 sm:mb-16"
      aria-label="Điều hướng nhanh trang chủ"
    >
      <HomeReveal className="home-jump-inner flex flex-wrap justify-center gap-2 p-2 rounded-2xl">
        {HOME_JUMP_LINKS.map((link) => (
          <button
            key={link.sectionId}
            type="button"
            onClick={() => handleJump(link.sectionId)}
            className={`home-jump-tab px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              active === link.sectionId ? "home-jump-tab--active" : ""
            }`}
          >
            {link.label}
          </button>
        ))}
      </HomeReveal>
    </nav>
  );
}

/* ========== Mission (scroll-scrubbed via --home-mission) ========== */

export function MissionSection() {
  return (
    <section
      id={SECTION_IDS.mission}
      data-home-mission
      className="home-mission home-section py-16 sm:py-24 mb-8 sm:mb-12"
    >
      <HomeReveal>
        <p className="text-lg sm:text-xl text-coffee dark:text-latte/80 mb-6 font-medium">
          {MISSION_COPY.intro}
        </p>
        <div className="space-y-2 sm:space-y-3">
          {MISSION_COPY.lines.map((line, i) => (
            <p
              key={line}
              className="home-mission-line font-serif text-2xl sm:text-3xl lg:text-4xl text-ink dark:text-paper"
              style={{ "--mission-i": i }}
            >
              {line}
            </p>
          ))}
        </div>
        <p className="home-mission-outro mt-8 text-base sm:text-lg text-coffee/80 dark:text-latte/70 max-w-3xl">
          {MISSION_COPY.outro}
        </p>
      </HomeReveal>
    </section>
  );
}

/* ========== Principles ========== */

export function PrinciplesSection() {
  return (
    <section id={SECTION_IDS.principles} className="home-section py-16 sm:py-20 relative">
      <span className="home-ghost-label" aria-hidden="true">
        {PRINCIPLES_COPY.ghostLabel}
      </span>
      <HomeReveal>
        <SectionEyebrow>{PRINCIPLES_COPY.eyebrow}</SectionEyebrow>
        <SectionTitle className="max-w-3xl mb-12">{PRINCIPLES_COPY.title}</SectionTitle>
      </HomeReveal>
      <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
        {VALUE_PROPS.map((prop, i) => {
          const Icon = prop.icon;
          return (
            <HomeReveal key={prop.id} delay={i * 90} className="home-principle-card p-6 sm:p-7 rounded-2xl">
              <div className="w-11 h-11 rounded-xl bg-terracotta/15 dark:bg-brass/20 flex items-center justify-center text-terracotta dark:text-brass mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-ink dark:text-paper mb-2">{prop.title}</h3>
              <p className="text-sm text-coffee dark:text-latte/80 leading-relaxed">{prop.body}</p>
            </HomeReveal>
          );
        })}
      </div>
    </section>
  );
}

/* ========== Scenarios ========== */

export function ProblemSolverSection() {
  const [activeId, setActiveId] = useState(USER_SCENARIOS[0]?.id);

  const active = USER_SCENARIOS.find((s) => s.id === activeId) ?? USER_SCENARIOS[0];
  const ActiveIcon = active?.icon;

  return (
    <section id={SECTION_IDS.scenarios} className="home-section py-16 sm:py-20">
      <HomeReveal className="mb-10">
        <SectionEyebrow>Giải pháp</SectionEyebrow>
        <SectionTitle className="max-w-2xl">Từ vướng mắc đến lối đi rõ ràng</SectionTitle>
      </HomeReveal>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-8">
        <div className="flex flex-col gap-2" role="tablist" aria-label="Tình huống">
          {USER_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              role="tab"
              aria-selected={activeId === scenario.id}
              onClick={() => setActiveId(scenario.id)}
              className={`home-scenario-tab text-left p-4 sm:p-5 rounded-2xl transition-all ${
                activeId === scenario.id ? "home-scenario-tab--active" : ""
              }`}
            >
              <span className="block text-sm font-semibold text-terracotta dark:text-brass mb-1">{scenario.pain}</span>
              <span className="block text-xs text-coffee/70 dark:text-latte/60 line-clamp-2">{scenario.detail}</span>
            </button>
          ))}
        </div>

        {active && (
          <HomeReveal key={active.id} className="home-scenario-panel p-6 sm:p-8 rounded-3xl">
            <div className="flex items-start gap-4 mb-5">
              {ActiveIcon && (
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-terracotta/20 to-brass/20 flex items-center justify-center text-terracotta">
                  <ActiveIcon className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-xl text-ink dark:text-paper">{active.solveTitle}</h3>
                <p className="text-sm text-coffee dark:text-latte/80 mt-2 leading-relaxed">{active.solveBody}</p>
              </div>
            </div>
            <PrimaryButton to={active.to} className="text-sm">
              {active.cta}
            </PrimaryButton>
          </HomeReveal>
        )}
      </div>
    </section>
  );
}

/* ========== Features ========== */

export function FeaturesSection() {
  return (
    <section id={SECTION_IDS.features} className="home-section py-16 sm:py-20">
      <HomeReveal className="mb-12 text-center max-w-2xl mx-auto">
        <SectionEyebrow>{RESOURCES_COPY.eyebrow}</SectionEyebrow>
        <SectionTitle>{RESOURCES_COPY.title}</SectionTitle>
      </HomeReveal>

      <div className="grid md:grid-cols-3 gap-6">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <HomeReveal key={feature.id} delay={i * 100} className="home-feature-card group flex flex-col rounded-3xl overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${feature.gradient}`} />
              <div className="flex-1 p-6 sm:p-7 flex flex-col">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-paper mb-4 home-feature-icon`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-xl text-ink dark:text-paper mb-2">{feature.title}</h3>
                <p className="text-sm text-coffee dark:text-latte/80 mb-4 flex-1">{feature.description}</p>
                <ul className="text-xs text-coffee/70 dark:text-latte/60 space-y-2 mb-6 border-t border-dashed border-coffee/15 dark:border-paper/10 pt-4">
                  {feature.tips.map((tip) => (
                    <li key={tip} className="flex gap-2">
                      <span className="text-terracotta">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
                <Link
                  to={feature.to}
                  className="text-sm font-semibold text-terracotta dark:text-brass hover:underline underline-offset-4"
                >
                  {feature.label} →
                </Link>
              </div>
            </HomeReveal>
          );
        })}
      </div>
    </section>
  );
}

/* ========== Workflow ========== */

export function WorkflowSection() {
  return (
    <section id={SECTION_IDS.workflow} className="home-section py-16 sm:py-20">
      <HomeReveal className="mb-12">
        <SectionEyebrow>Quy trình</SectionEyebrow>
        <SectionTitle className="max-w-xl">Ba bước — một nhịp làm việc</SectionTitle>
      </HomeReveal>

      <ol className="home-workflow-list relative space-y-0">
        {WORKFLOW_STEPS.map((step, i) => (
          <HomeReveal key={step.id} delay={i * 120} className="home-workflow-step relative pl-12 sm:pl-16 pb-12 last:pb-0">
            <span className="home-workflow-num absolute left-0 top-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold text-paper bg-terracotta shadow-md">
              {i + 1}
            </span>
            <div className="home-workflow-body p-5 sm:p-6 rounded-2xl">
              <h3 className="font-semibold text-lg text-ink dark:text-paper mb-2">{step.title}</h3>
              <p className="text-sm text-coffee dark:text-latte/80 mb-4">{step.body}</p>
              <ul className="text-xs text-coffee/70 space-y-1 mb-4">
                {step.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2">
                    <span className="home-check-mark">✓</span>
                    {h}
                  </li>
                ))}
              </ul>
              <Link to={step.to} className="text-sm font-semibold text-terracotta dark:text-brass hover:underline">
                {step.cta} →
              </Link>
            </div>
          </HomeReveal>
        ))}
      </ol>
    </section>
  );
}

/* ========== CTA + quick start ========== */

export function FinalCTASection() {
  return (
    <section className="home-section py-12 sm:py-16">
      <HomeReveal className="home-cta-band text-center p-8 sm:p-12 rounded-3xl">
        <h2 className="font-serif text-3xl sm:text-4xl text-ink dark:text-paper mb-4">{FINAL_CTA_COPY.title}</h2>
        <p className="text-coffee dark:text-latte/80 max-w-lg mx-auto mb-8">{FINAL_CTA_COPY.body}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <PrimaryButton to="/create">{FINAL_CTA_COPY.primaryCta}</PrimaryButton>
          <GhostButton to="/weekly-plan">{FINAL_CTA_COPY.secondaryCta}</GhostButton>
        </div>
      </HomeReveal>
    </section>
  );
}

export function QuickActionsSection() {
  return (
    <section id={SECTION_IDS.quickStart} className="home-section pb-8">
      <HomeReveal>
        <SectionEyebrow>Bắt đầu nhanh</SectionEyebrow>
        <div className="flex flex-wrap gap-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.id}
                to={feature.to}
                className="home-quick-chip inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium"
              >
                <Icon className="w-4 h-4 text-terracotta" />
                {feature.label}
              </Link>
            );
          })}
        </div>
      </HomeReveal>
    </section>
  );
}

/** @deprecated Alias — giữ tương thích import cũ */
export { PrinciplesSection as ValuePropsSection };
