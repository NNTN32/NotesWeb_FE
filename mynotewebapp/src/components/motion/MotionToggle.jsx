import { FiPauseCircle, FiPlayCircle } from "react-icons/fi";
import { useMotion } from "../../context/MotionContext";

export default function MotionToggle({ className, showLabel = false }) {
  const { quiet, reduced, systemReduced, toggleQuiet } = useMotion();
  const label = systemReduced
    ? "Reduced motion is enabled by your device"
    : "Quiet mode";
  return (
    <button
      type="button"
      className={className}
      onClick={toggleQuiet}
      aria-label={label}
      aria-pressed={reduced}
      disabled={systemReduced}
      title={
        systemReduced ? label : quiet ? "Resume animations" : "Pause animations"
      }
    >
      {reduced ? (
        <FiPauseCircle aria-hidden="true" />
      ) : (
        <FiPlayCircle aria-hidden="true" />
      )}
      {showLabel && (
        <span>{systemReduced ? "Reduced motion" : "Quiet mode"}</span>
      )}
    </button>
  );
}
