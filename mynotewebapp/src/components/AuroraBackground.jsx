import React from "react";

export default function AuroraBackground({ className = "", intensity = 1 }) {
  const safeIntensity = Math.max(0.2, Math.min(2, intensity));
  return (
    <div className={`aurora-container ${className}`} aria-hidden="true">
      <div className="aurora-layer" style={{ animationDuration: `${28 / safeIntensity}s` }} />
      <div className="aurora-layer aurora-layer-2" style={{ animationDuration: `${36 / safeIntensity}s` }} />
      <div className="aurora-layer aurora-layer-3" style={{ animationDuration: `${44 / safeIntensity}s` }} />
      <div className="aurora-noise" />
    </div>
  );
}


