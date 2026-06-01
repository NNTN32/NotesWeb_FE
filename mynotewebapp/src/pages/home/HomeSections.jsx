import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import {
  SECTION_IDS,
  HOME_MOTION,
  HOME_DESK_MOTION,
  FLOATING_CHIPS,
  FLOATING_MODULE_ICONS,
  HERO_COPY,
  HERO_STATS,
  HERO_DESK_PREVIEW,
  MISSION_COPY,
  MISSION_FLOW_STEPS,
  MISSION_FLOW_MOTION,
  PRINCIPLES_COPY,
  SCENARIOS_COPY,
  FINAL_CTA_COPY,
  HOME_JUMP_LINKS,
  VALUE_PROPS,
  USER_SCENARIOS,
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

const HOME_JUMP_SECTION_IDS = HOME_JUMP_LINKS.map((link) => link.sectionId);

/** Highlights jump-bar tab from scroll position (paired with SectionJumpBar). */
function useHomeSectionSpy(sectionIds) {
  const [active, setActive] = useState(sectionIds[0]);
  const clickLock = useRef(false);

  useEffect(() => {
    const ratios = new Map(sectionIds.map((id) => [id, 0]));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        if (clickLock.current) return;

        let bestId = sectionIds[0];
        let bestRatio = 0;

        for (const id of sectionIds) {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestRatio > 0) setActive(bestId);
      },
      {
        rootMargin: "-18% 0px -52% 0px",
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
      }
    );

    sectionIds.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  const setActiveFromClick = useCallback((sectionId) => {
    setActive(sectionId);
    clickLock.current = true;
    window.setTimeout(() => {
      clickLock.current = false;
    }, 900);
  }, []);

  return [active, setActiveFromClick];
}

/** Shows floating jump bar after the hero scrolls out of view. */
function useJumpBarDocked() {
  const [docked, setDocked] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(SECTION_IDS.hero);
    if (!hero) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setDocked(!entry.isIntersecting),
      { threshold: 0.08, rootMargin: "0px 0px 0px 0px" }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return docked;
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
      {FLOATING_CHIPS.map((chip) => {
        const ModuleIcon = chip.module ? FLOATING_MODULE_ICONS[chip.module] : null;

        return (
          <div
            key={chip.id}
            className={`home-sticky-chip home-sticky-chip--${chip.variant} ${chip.alt ? "home-sticky-chip--alt" : ""} ${ModuleIcon ? "home-sticky-chip--module" : ""}`}
            style={{
              top: chip.top,
              left: chip.left,
              "--chip-delay": chip.delay,
              "--chip-duration": chip.duration,
              "--chip-rotate": chip.rotate,
            }}
          >
            {ModuleIcon ? (
              <ModuleIcon
                className={`home-sticky-module-icon home-sticky-module-icon--${chip.module}`}
                aria-label={chip.ariaLabel}
              />
            ) : (
              <>
                <span className="home-sticky-tape" />
                {chip.label}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function rotateDeckToBack(order) {
  const top = order[order.length - 1];
  return [top, ...order.slice(0, -1)];
}

function HeroDeskStack() {
  const cardById = useMemo(
    () => Object.fromEntries(HERO_DESK_PREVIEW.map((card) => [card.id, card])),
    []
  );
  const [deckOrder, setDeckOrder] = useState(() => HERO_DESK_PREVIEW.map((card) => card.id));
  const [tearingId, setTearingId] = useState(null);
  const [stackSettled, setStackSettled] = useState(false);
  const tearBusy = useRef(false);
  const deckOrderRef = useRef(deckOrder);

  deckOrderRef.current = deckOrder;

  useEffect(() => {
    const timer = window.setTimeout(() => setStackSettled(true), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  const finishTear = useCallback(() => {
    setDeckOrder((prev) => rotateDeckToBack(prev));
    setTearingId(null);
    tearBusy.current = false;
  }, []);

  const startTear = useCallback(() => {
    if (tearBusy.current) return;

    const order = deckOrderRef.current;
    const topId = order[order.length - 1];
    if (!topId) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDeckOrder(rotateDeckToBack(order));
      return;
    }

    tearBusy.current = true;
    setTearingId(topId);
  }, []);

  const handleTearAnimationEnd = useCallback(
    (event) => {
      if (!event.animationName.includes(HOME_DESK_MOTION.tearAnimationName)) return;
      finishTear();
    },
    [finishTear]
  );

  useEffect(() => {
    if (!stackSettled) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const intervalId = window.setInterval(() => {
      startTear();
    }, HOME_DESK_MOTION.autoTearIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [startTear, stackSettled]);

  const topId = deckOrder[deckOrder.length - 1];

  return (
    <div className="home-desk-stack relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto aspect-[4/3] sm:aspect-[5/4]">
      {deckOrder.map((cardId, stackIndex) => {
        const card = cardById[cardId];
        if (!card) return null;

        const isTop = cardId === topId;
        const isTearing = tearingId === cardId;

        return (
          <article
            key={card.id}
            data-stack={stackIndex}
            className={[
              "home-desk-card",
              `home-desk-card--${card.tone}`,
              stackSettled ? "home-desk-card--settled" : "",
              isTop ? "home-desk-card--top" : "",
              isTearing ? "home-desk-card--tearing" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ "--desk-stack": stackIndex }}
            onClick={isTop && !isTearing ? startTear : undefined}
            onAnimationEnd={isTearing ? handleTearAnimationEnd : undefined}
            role={isTop ? "button" : undefined}
            tabIndex={isTop ? 0 : undefined}
            onKeyDown={
              isTop
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      startTear();
                    }
                  }
                : undefined
            }
            aria-label={isTop ? `Xé và chuyển tờ: ${card.title}. Nhấn để xé thủ công.` : undefined}
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
        );
      })}
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
  const [active, setActiveFromClick] = useHomeSectionSpy(HOME_JUMP_SECTION_IDS);
  const docked = useJumpBarDocked();

  const handleJump = useCallback(
    (sectionId) => {
      setActiveFromClick(sectionId);
      scrollToSection(sectionId);
    },
    [setActiveFromClick]
  );

  return (
    <nav
      className={`home-jump-bar home-jump-bar--dock ${docked ? "home-jump-bar--visible" : ""}`}
      aria-label="Điều hướng nhanh trang chủ"
    >
      <div className="home-jump-inner flex flex-wrap justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl">
        {HOME_JUMP_LINKS.map((link) => (
          <button
            key={link.sectionId}
            type="button"
            onClick={() => handleJump(link.sectionId)}
            className={`home-jump-tab px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all ${
              active === link.sectionId ? "home-jump-tab--active" : ""
            }`}
            aria-current={active === link.sectionId ? "true" : undefined}
          >
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ========== Mission (scroll-scrubbed via --home-mission) ========== */

function MissionFlowVisual() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepCount = MISSION_FLOW_STEPS.length;

  useEffect(() => {
    if (stepCount < 2) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stepCount);
    }, MISSION_FLOW_MOTION.stepIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [stepCount]);

  return (
    <div className="home-mission-visual" aria-hidden="true">
      <div className="home-mission-visual-glow" />
      <ol className="home-mission-flow">
        {MISSION_FLOW_STEPS.map((step, index) => {
          const Icon = FLOATING_MODULE_ICONS[step.module];
          const isActive = index === activeIndex;

          return (
            <li key={step.id} className="home-mission-flow-item">
              {index > 0 && (
                <span
                  className={`home-mission-flow-connector ${index <= activeIndex ? "home-mission-flow-connector--lit" : ""}`}
                />
              )}
              <div
                className={`home-mission-flow-step ${isActive ? "home-mission-flow-step--active" : ""}`}
                style={{ "--flow-index": index }}
              >
                {Icon && (
                  <span className="home-mission-flow-icon-wrap">
                    <Icon className={`home-mission-flow-icon home-mission-flow-icon--${step.module}`} />
                  </span>
                )}
                <span className="home-mission-flow-copy">
                  <span className="home-mission-flow-label">{step.label}</span>
                  <span className="home-mission-flow-hint">{step.hint}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function MissionSection() {
  return (
    <section
      id={SECTION_IDS.mission}
      data-home-mission
      className="home-mission home-section py-16 sm:py-24 mb-8 sm:mb-12"
    >
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
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
          <p className="home-mission-outro mt-8 text-base sm:text-lg text-coffee/80 dark:text-latte/70 max-w-xl">
            {MISSION_COPY.outro}
          </p>
        </HomeReveal>

        <HomeReveal delay={120} className="relative min-h-[260px] sm:min-h-[300px]">
          <MissionFlowVisual />
        </HomeReveal>
      </div>
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

/** Icon 3D/4D — `module` khớp FLOATING_MODULE_ICONS; animation trong index.css */
function ScenarioModuleIcon({ module, size = "tab", active = false }) {
  const Icon = FLOATING_MODULE_ICONS[module];
  if (!Icon) return null;

  return (
    <div
      className={[
        "home-scenario-icon-4d",
        `home-scenario-icon-4d--${module}`,
        `home-scenario-icon-4d--${size}`,
        active ? "home-scenario-icon-4d--active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <span className="home-scenario-icon-4d-floor" />
      <span className="home-scenario-icon-4d-glow" />
      <span className="home-scenario-icon-4d-core">
        <Icon className="home-scenario-icon-4d-svg" />
      </span>
    </div>
  );
}

export function ProblemSolverSection() {
  const [activeId, setActiveId] = useState(USER_SCENARIOS[0]?.id);

  const active = USER_SCENARIOS.find((s) => s.id === activeId) ?? USER_SCENARIOS[0];

  return (
    <section id={SECTION_IDS.scenarios} className="home-section py-16 sm:py-20">
      <HomeReveal className="mb-10">
        <SectionEyebrow>{SCENARIOS_COPY.eyebrow}</SectionEyebrow>
        <SectionTitle className="max-w-2xl">{SCENARIOS_COPY.title}</SectionTitle>
      </HomeReveal>

      <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-6 lg:gap-8">
        <div className="flex flex-col gap-2.5" role="tablist" aria-label={SCENARIOS_COPY.tabListLabel}>
          {USER_SCENARIOS.map((scenario) => {
            const isActive = activeId === scenario.id;

            return (
              <button
                key={scenario.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(scenario.id)}
                className={`home-scenario-tab flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all ${
                  isActive ? "home-scenario-tab--active" : ""
                }`}
              >
                <ScenarioModuleIcon module={scenario.module} size="tab" active={isActive} />
                <span className="min-w-0 text-left">
                  <span className="block text-sm font-semibold text-ink dark:text-paper">{scenario.moduleLabel}</span>
                  <span className="block text-xs text-coffee/75 dark:text-latte/70 mt-0.5 line-clamp-1">{scenario.tagline}</span>
                </span>
              </button>
            );
          })}
        </div>

        {active && (
          <HomeReveal key={active.id} className="home-scenario-panel p-6 sm:p-8 rounded-3xl flex flex-col">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 mb-5">
              <ScenarioModuleIcon module={active.module} size="panel" active />
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-terracotta dark:text-brass">
                  {active.moduleLabel}
                </p>
                <p className="text-base sm:text-lg font-medium text-ink dark:text-paper mt-1">{active.tagline}</p>
              </div>
            </div>

            <p className="sr-only">{SCENARIOS_COPY.panelPrefix}</p>
            <ul className="home-scenario-points mb-6">
              {active.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <PrimaryButton to={active.to} className="text-sm w-full sm:w-auto mt-auto">
              {active.cta}
            </PrimaryButton>
          </HomeReveal>
        )}
      </div>
    </section>
  );
}

/* ========== CTA ========== */

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

/** @deprecated Alias — giữ tương thích import cũ */
export { PrinciplesSection as ValuePropsSection };
