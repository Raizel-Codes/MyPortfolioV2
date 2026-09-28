"use client";

import { useEffect, useRef } from "react";

// Slim reading-progress bar pinned above the sticky header. Writes --progress as a CSS
// custom property (not React state) from one rAF-throttled scroll listener, same
// convention as ScrollDirection.tsx. Consumes ScrollDirection's [data-scroll-dir]
// attribute purely in CSS to flip which edge the bar grows from — no extra JS wiring.
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    function update() {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el!.style.setProperty("--progress", progress.toFixed(4));
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={ref} className="scroll-progress-bar" />
    </div>
  );
}
