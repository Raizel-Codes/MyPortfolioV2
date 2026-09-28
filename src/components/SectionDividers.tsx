"use client";

import { useEffect } from "react";

// Single shared IntersectionObserver over every "/SECTION" heading (see globals.css's
// .slash-title rules). Unlike Reveal.tsx's one-shot reveal, this keeps observing, so each
// heading slides back out and re-enters every time it's crossed — from the side opposite
// the current scroll direction (ScrollDirection.tsx's [data-scroll-dir] attribute). Scoped
// to just these five headings rather than every reveal on the page, so the replay stays
// cheap and legible instead of the whole page re-animating on every scroll direction change.
export function SectionDividers() {
  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>(".slash-title"));
    if (!headings.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      headings.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-in", entry.isIntersecting);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    headings.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
