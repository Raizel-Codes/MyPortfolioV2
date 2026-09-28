"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#$%&";

// Left-to-right decode: characters settle back to the real text in reading order while
// everything to the right still randomizes, giving the classic "terminal boot" look.
function runScramble(el: HTMLElement, text: string, duration = 480) {
  const start = performance.now();
  let raf = 0;
  function frame(now: number) {
    const elapsed = now - start;
    const revealed = Math.floor((elapsed / duration) * text.length);
    el.textContent = text
      .split("")
      .map((ch, i) => (ch === " " || i < revealed ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
      .join("");
    if (elapsed < duration) raf = requestAnimationFrame(frame);
    else el.textContent = text;
  }
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

// Hover/focus decode effect — a nod to the site's monospace/code aesthetic
// (--font-sans: Geist Mono) rather than a generic hover gimmick. Used on the
// Navbar logo, where an ancestor aria-label already sets the accessible name,
// so the rapid textContent churn here needs `ariaHidden` to stay out of the a11y tree.
export function ScrambleText({
  text,
  className,
  ariaHidden,
}: {
  text: string;
  className?: string;
  ariaHidden?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cancelRef.current?.(), []);

  function play() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    cancelRef.current?.();
    cancelRef.current = runScramble(el, text);
  }

  return (
    <span ref={ref} className={className} aria-hidden={ariaHidden} onMouseEnter={play} onFocus={play}>
      {text}
    </span>
  );
}
