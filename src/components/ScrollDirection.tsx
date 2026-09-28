"use client";

import { useEffect } from "react";

// Single global scroll-direction signal, written as a data attribute (not React state)
// so CSS can react to it without a re-render on every scroll tick — see globals.css's
// [data-scroll-dir] rules (currently: SectionDividers.tsx's heading re-entrance) for
// what consumes it.
export function ScrollDirection() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastY = window.scrollY;
    let raf = 0;

    function update() {
      raf = 0;
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 2) {
        document.documentElement.dataset.scrollDir = y > lastY ? "down" : "up";
        lastY = y;
      }
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
