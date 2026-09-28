"use client";

import { useEffect, useState } from "react";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done">("loading");

  useEffect(() => {
    // Smoothly count up to 100 over ~900ms
    const totalDuration = 900;
    const steps = 40;
    const interval = totalDuration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      const eased = Math.min(100, Math.round((1 - Math.pow(1 - current / steps, 3)) * 100));
      setProgress(eased);

      if (current >= steps) {
        clearInterval(timer);
        // Brief hold at 100%, then fade
        setTimeout(() => {
          setPhase("done");
          // Call onComplete after fade (500ms)
          setTimeout(onComplete, 500);
        }, 150);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        opacity: phase === "done" ? 0 : 1,
        transition: "opacity 500ms ease-out",
        pointerEvents: phase === "done" ? "none" : "all",
      }}
    >
      {/* Logo mark */}
      <span
        style={{
          fontFamily: "var(--font-ethnocentric), sans-serif",
          fontSize: "clamp(20px, 4vw, 32px)",
          letterSpacing: "0.12em",
          color: "var(--text)",
        }}
      >
        ASG
      </span>

      {/* Status text */}
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "13px",
          letterSpacing: "0.06em",
          color: "var(--text-dim)",
          textTransform: "uppercase",
        }}
      >
        INITIALIZING SYSTEM...&nbsp;
        <span style={{ color: "var(--text)", fontWeight: 600 }}>{progress}%</span>
      </p>

      {/* Progress bar */}
      <div
        style={{
          width: "clamp(200px, 30vw, 320px)",
          height: "2px",
          backgroundColor: "var(--border)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            backgroundColor: "var(--violet)",
            borderRadius: "2px",
            transition: "width 60ms linear",
          }}
        />
      </div>

      {/* Tick marks */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          alignItems: "center",
        }}
      >
        {[20, 40, 60, 80, 100].map((threshold) => (
          <div
            key={threshold}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: progress >= threshold ? "var(--violet)" : "var(--border)",
              transition: "background-color 150ms ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
