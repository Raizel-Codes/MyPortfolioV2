"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";

// Subtle 3D tilt + zoom that follows the cursor. Renders the same box it's given
// (pass className="project-media" etc.) so it drops in without changing layout.
export function TiltMedia({ children, className = "", ...rest }: ComponentPropsWithoutRef<"div">) {
  const ref = useRef<HTMLDivElement | null>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-x", `${(-py * 8).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(px * 8).toFixed(2)}deg`);
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave} {...rest}>
      {children}
    </div>
  );
}
