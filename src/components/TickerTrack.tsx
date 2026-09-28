"use client";

import { useEffect, useRef } from "react";

const BASE_DURATION = 22; // seconds, matches the resting pace of .ticker-track's old fixed animation
const MIN_DURATION = 7; // fastest allowed pace during a fast scroll
const SETTLE = 0.06; // how quickly duration eases back toward BASE_DURATION each frame (0-1)

// Wraps the marquee track: speeds it up slightly while the page is being scrolled fast,
// then lets it settle back to its resting pace. Coupling is felt more than seen —
// hover-to-pause (handled purely in CSS via .ticker:hover) still works normally.
//
// The rAF loop that drives this only runs while the ticker is actually on screen —
// gated by IntersectionObserver — since it otherwise costs a JS callback every single
// frame for the entire life of the page, visible or not.
export function TickerTrack({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);
  const duration = useRef(BASE_DURATION);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onScroll() {
      const y = window.scrollY;
      const delta = Math.abs(y - lastY.current);
      lastY.current = y;
      const target = Math.max(MIN_DURATION, BASE_DURATION - delta * 0.6);
      // only ever speed up in response to scroll; the per-frame loop below eases it back down
      duration.current = Math.min(duration.current, target);
    }

    function tick() {
      duration.current += (BASE_DURATION - duration.current) * SETTLE;
      if (track) track.style.animationDuration = `${duration.current.toFixed(2)}s`;
      raf.current = requestAnimationFrame(tick);
    }

    function startLoop() {
      if (raf.current !== null) return; // already running
      lastY.current = window.scrollY;
      raf.current = requestAnimationFrame(tick);
    }

    function stopLoop() {
      if (raf.current === null) return;
      cancelAnimationFrame(raf.current);
      raf.current = null;
      // rest at base pace while paused, so .ticker-track's own CSS play-state pause
      // (see .pause-offscreen in globals.css) doesn't freeze it mid-sprint
      duration.current = BASE_DURATION;
      if (track) track.style.animationDuration = `${BASE_DURATION}s`;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", onScroll, { passive: true });
          startLoop();
        } else {
          window.removeEventListener("scroll", onScroll);
          stopLoop();
        }
      },
      { rootMargin: "80px 0px 80px 0px", threshold: 0 }
    );
    io.observe(track);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      stopLoop();
    };
  }, []);

  return (
    <div className="ticker-track" ref={trackRef}>
      {children}
    </div>
  );
}