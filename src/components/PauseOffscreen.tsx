"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

// Wraps a chunk of markup and toggles a "section-in-view" class on it based on
// IntersectionObserver, so any CSS-driven `infinite` animation inside can be
// written to pause via `animation-play-state` once its ancestor loses this class.
// This targets the ongoing, always-on animations (ticker, cursor blinks, status
// dots) that otherwise keep consuming frames even while scrolled far off-screen —
// not the reveal/entrance animations, which already run once and stop on their own.
export function PauseOffscreen({
    children,
    as: Tag = "div",
    className = "",
}: {
    children: ReactNode;
    as?: "div" | "span";
    className?: string;
}) {
    const TagEl = Tag as ElementType;
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // already paused globally

        const io = new IntersectionObserver(
            ([entry]) => {
                el.classList.toggle("is-in-view", entry.isIntersecting);
            },
            { rootMargin: "80px 0px 80px 0px", threshold: 0 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <TagEl ref={ref} className={`pause-offscreen${className ? ` ${className}` : ""}`}>
            {children}
        </TagEl>
    );
}