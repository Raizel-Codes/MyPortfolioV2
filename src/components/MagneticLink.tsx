"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";

// Nudges itself toward the cursor within a small radius, springs back on leave.
export function MagneticLink({ children, className = "", ...rest }: ComponentPropsWithoutRef<"a">) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.setProperty("--mx", `${(x * 0.25).toFixed(1)}px`);
    el.style.setProperty("--my", `${(y * 0.25).toFixed(1)}px`);
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  }

  return (
    <a
      ref={ref}
      className={`magnetic${className ? ` ${className}` : ""}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
    </a>
  );
}
