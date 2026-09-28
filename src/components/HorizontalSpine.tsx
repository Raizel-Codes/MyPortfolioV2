"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Drives --hspine-progress (0 to 1) on the scroll track from its own horizontal
// scrollLeft — same "listen to the element's own scroll event" approach Projects.tsx
// uses for its arrow-nav, just also exposed as a progress value for the spine fill.
// Renders the arrows itself so the two stay in sync with one shared measurement.
export function HorizontalSpine({ children }: { children: React.ReactNode }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const update = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        const progress = max > 0 ? el.scrollLeft / max : 1;
        el.style.setProperty("--hspine-progress", progress.toFixed(4));
        setCanPrev(el.scrollLeft > 4);
        setCanNext(el.scrollLeft < max - 4);
    }, []);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        update();
        el.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            el.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [update]);

    function scrollByPage(direction: 1 | -1) {
        const el = trackRef.current;
        if (!el) return;
        el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
    }

    return (
        <div className="hspine-wrap">
            <div className="hspine-track" ref={trackRef}>
                {children}
            </div>
            <div className="hspine-nav">
                <button
                    type="button"
                    className="hspine-arrow"
                    onClick={() => scrollByPage(-1)}
                    disabled={!canPrev}
                    aria-label="Scroll to earlier"
                >
                    <ChevronLeft size={16} aria-hidden="true" />
                </button>
                <button
                    type="button"
                    className="hspine-arrow"
                    onClick={() => scrollByPage(1)}
                    disabled={!canNext}
                    aria-label="Scroll to later"
                >
                    <ChevronRight size={16} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}