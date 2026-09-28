"use client";

import { useRef, useState, type ReactNode } from "react";
import { Phone, PhoneOff } from "lucide-react";

const COMMIT_THRESHOLD = 0.72;

export function CallReveal({ children }: { children: ReactNode }) {
  const [answered, setAnswered] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const movedRef = useRef(false);

  function maxDrag() {
    const track = trackRef.current;
    return track ? Math.max(1, track.clientWidth - 60) : 200;
  }

  function commit() {
    setDragX(maxDrag());
    setAnswered(true);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (answered) return;
    movedRef.current = false;
    setDragging(true);
    const startX = e.clientX;
    const max = maxDrag();

    function onMove(ev: PointerEvent) {
      const delta = ev.clientX - startX;
      if (Math.abs(delta) > 4) movedRef.current = true;
      setDragX(Math.max(0, Math.min(max, delta)));
    }
    function onUp(ev: PointerEvent) {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setDragging(false);
      const delta = Math.max(0, Math.min(max, ev.clientX - startX));
      if (delta / max >= COMMIT_THRESHOLD) commit();
      else setDragX(0);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function onThumbClick() {
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    if (!answered) commit();
  }

  function hangUp() {
    setAnswered(false);
    setDragX(0);
  }

  return (
    <div className={`call${answered ? " is-answered" : ""}`}>
      <div className="call-cover" aria-hidden={answered}>
        <div className="call-card">
          <span className="call-ring" aria-hidden="true">
            <Phone size={20} aria-hidden="true" />
          </span>
          <p className="call-label">Incoming call</p>
          <p className="call-name">New project?</p>

          <div className="call-track" ref={trackRef}>
            <span className="call-track-label" style={{ opacity: Math.max(0, 1 - dragX / 90) }}>
              Slide to answer
            </span>
            <button
              type="button"
              className="call-thumb"
              style={{ transform: `translateX(${dragX}px)` }}
              data-dragging={dragging}
              onPointerDown={onPointerDown}
              onClick={onThumbClick}
              aria-label="Answer and show ways to reach me"
              tabIndex={answered ? -1 : undefined}
            >
              <Phone size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="call-content">
        <div className="call-reveal-content">
          {answered && (
            <button type="button" className="call-hangup" onClick={hangUp}>
              <PhoneOff size={14} aria-hidden="true" />
              Hang up
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
