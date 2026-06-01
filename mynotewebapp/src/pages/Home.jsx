import { useRef } from "react";
import AuroraBackground from "../components/AuroraBackground";
import {
  useHomeScrollProgress,
  HeroSection,
  SectionJumpBar,
  MissionSection,
  PrinciplesSection,
  ProblemSolverSection,
  FeaturesSection,
  WorkflowSection,
  FinalCTASection,
  QuickActionsSection,
} from "./home/HomeSections";

/**
 * Marketing landing — planner / notebook layout.
 * Copy: `home/homeConstants.js` · Sections + motion hooks: `home/HomeSections.jsx` · CSS: `index.css` (.home-*)
 */
export default function Home() {
  const pageRef = useRef(null);
  useHomeScrollProgress(pageRef);

  return (
    <div
      ref={pageRef}
      className="home-page home-planner-bg min-h-screen relative overflow-x-hidden"
    >
      <div className="home-planner-spine" aria-hidden="true" />
      <AuroraBackground intensity={0.42} className="opacity-45 dark:opacity-30" />
      <div className="home-content-layer max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <HeroSection />
        <SectionJumpBar />
        <MissionSection />
        <PrinciplesSection />
        <ProblemSolverSection />
        <FeaturesSection />
        <WorkflowSection />
        <FinalCTASection />
        <QuickActionsSection />
      </div>
    </div>
  );
}
