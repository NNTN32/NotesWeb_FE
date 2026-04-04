import AuroraBackground from "../components/AuroraBackground";
import {
  HeroSection,
  ValuePropsSection,
  FeaturesSection,
  WorkflowSection,
  FinalCTASection,
  QuickActionsSection,
} from "./home/HomeSections";

/**
 * Marketing landing page.
 *
 * Content and routes: `src/pages/home/homeConstants.js`
 * Sections and layout: `src/pages/home/HomeSections.jsx`
 * Motion styles: `src/index.css` (`.home-*`, prefers-reduced-motion)
 */
export default function Home() {
  return (
    <div className="home-page patterncraft-bg notes-bg min-h-screen relative">
      <AuroraBackground intensity={0.85} />
      <div className="patterncraft-content relative z-10">
        <HeroSection />
        <ValuePropsSection />
        <FeaturesSection />
        <WorkflowSection />
        <FinalCTASection />
        <QuickActionsSection />
      </div>
    </div>
  );
}
