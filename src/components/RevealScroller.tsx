"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";

type RevealScrollerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

// Reveal.tsx's enter-once IntersectionObserver, plus a per-child scroll-focus
// measurement for containers that turn into a horizontal scroller on mobile:
// each direct child gets --offset (-1..1, signed) and --focus (0..1, 1 = centered)
// as CSS custom properties, recomputed on scroll/resize. Both are no-ops when
// reduced motion is on, and the focus math is a no-op whenever the container
// isn't actually scrollable (e.g. the desktop grid layout), so this is safe to
// use as a drop-in replacement for Reveal on any section that scrolls on mobile.
export function RevealScroller<T extends ElementType = "div">({
  as,
  children,
  className = "",
  ...rest
}: RevealScrollerProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    function update() {
      raf = 0;
      if (!el || el.scrollWidth <= el.clientWidth + 1) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      for (const child of Array.from(el.children)) {
        const c = child as HTMLElement;
        const cRect = c.getBoundingClientRect();
        const cCenter = cRect.left + cRect.width / 2;
        const offset = Math.max(-1, Math.min(1, (cCenter - centerX) / (rect.width / 2)));
        c.style.setProperty("--offset", offset.toFixed(3));
        c.style.setProperty("--focus", (1 - Math.abs(offset)).toFixed(3));
      }
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal-scope${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
