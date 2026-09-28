"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";

type ParallaxProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  strength?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

// Drifts vertically, a few pixels either way, as its distance from viewport-center changes on scroll.
export function ParallaxWrap<T extends ElementType = "div">({
  as,
  children,
  className = "",
  strength = 14,
  ...rest
}: ParallaxProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const offset = Math.max(-strength, Math.min(strength, center * -0.06));
      el.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <Tag ref={ref} className={`parallax${className ? ` ${className}` : ""}`} {...rest}>
      {children}
    </Tag>
  );
}
