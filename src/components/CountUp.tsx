"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1200;
function ease(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

// Counts up to `value` once, the first time it scrolls into view — mirrors the
// once-per-visit reveal behavior already used across the page's IntersectionObserver spots.
export function CountUp({ value }: { value: number }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- reduced-motion skips the count-up animation entirely, jumping straight to the final value
            setDisplay(value);
            return;
        }

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || started.current) return;
                started.current = true;
                io.disconnect();

                const start = performance.now();
                function frame(now: number) {
                    const t = Math.min(1, (now - start) / DURATION);
                    setDisplay(Math.round(value * ease(t)));
                    if (t < 1) requestAnimationFrame(frame);
                }
                requestAnimationFrame(frame);
            },
            { threshold: 0.4 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [value]);

    return (
        <span ref={ref} className="contrib-num">
            {display.toLocaleString()}
        </span>
    );
}