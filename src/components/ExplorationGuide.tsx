"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, X } from "lucide-react";

// Order matters for the "next unvisited" suggestion — roughly the page's reading order.
const SECTIONS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const IDLE_MS = 9000;
const STORAGE_KEY = "exploration-visited";

function loadVisited(): Set<SectionId> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr.filter((id): id is SectionId => SECTIONS.some((s) => s.id === id)));
  } catch {
    return new Set();
  }
}

function saveVisited(visited: Set<SectionId>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]));
  } catch { }
}

export function ExplorationGuide() {
  const [visited, setVisited] = useState<Set<SectionId>>(() => new Set());
  const [hydrated, setHydrated] = useState(false);
  const [bubble, setBubble] = useState<{ text: string; action?: SectionId } | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // the badge/bubble sit bottom-right, the same corner as the hero's GitHub-stats
  // block — stay hidden until the hero has scrolled by so the two never overlap
  const [pastHero, setPastHero] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNudgedFor = useRef<string | null>(null);
  const announcedComplete = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from sessionStorage on mount, not derived state
    setVisited(loadVisited());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveVisited(visited);
  }, [visited, hydrated]);

  useEffect(() => {
    // no #top section (shouldn't happen — Hero always renders it) means there's nothing
    // to stay clear of, but skip wiring an observer rather than setState synchronously here
    const hero = document.getElementById("top");
    if (!hero) return;
    // track continuously (not just once) so scrolling back up to the hero re-hides
    // the guide too, rather than leaving it stuck visible over hero content forever
    const io = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!elements.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id as SectionId;
          setVisited((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
        });
      },
      { threshold: 0.4 }
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!hydrated || dismissed) return;

    function scheduleIdleCheck() {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        const unvisited = SECTIONS.filter((s) => !visited.has(s.id));
        if (unvisited.length === 0) return;
        const next = unvisited[0];
        if (lastNudgedFor.current === next.id) return;
        lastNudgedFor.current = next.id;
        setBubble({
          text: `Haven't seen ${next.label} yet — want to take a look?`,
          action: next.id,
        });
      }, IDLE_MS);
    }

    scheduleIdleCheck();
    window.addEventListener("scroll", scheduleIdleCheck, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleIdleCheck);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [visited, hydrated, dismissed]);

  useEffect(() => {
    if (!hydrated || announcedComplete.current) return;
    if (visited.size === SECTIONS.length) {
      announcedComplete.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time completion announcement triggered by visited-set changes, not a render-time derivation
      setBubble({
        text: "Thank you for exploring the whole page! If anything stood out — or you'd rather just ask — the Contact section is right below.",
        action: "contact",
      });
    }
  }, [visited, hydrated]);

  if (!hydrated || dismissed || !pastHero) return null;

  const percent = Math.round((visited.size / SECTIONS.length) * 100);

  return (
    <div className="explore-guide" aria-live="off">
      {bubble && (
        <div className="explore-bubble" role="status">
          <button
            type="button"
            className="explore-bubble-close"
            aria-label="Dismiss suggestion"
            onClick={() => setBubble(null)}
          >
            <X size={13} aria-hidden="true" />
          </button>
          <p>{bubble.text}</p>
          {bubble.action && (
            <a
              href={`#${bubble.action}`}
              className="explore-bubble-link"
              onClick={() => setBubble(null)}
            >
              Take me there →
            </a>
          )}
        </div>
      )}

      <button
        type="button"
        className="explore-badge"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        aria-label={`Page exploration ${percent} percent`}
      >
        <span className="explore-badge-ring" style={{ "--pct": percent } as React.CSSProperties}>
          <Compass size={15} aria-hidden="true" />
        </span>
        <span className="explore-badge-pct">{percent}%</span>
      </button>

      {expanded && (
        <div className="explore-panel" role="menu">
          <div className="explore-panel-head">
            <p>You&apos;ve explored {percent}%</p>
            <button
              type="button"
              aria-label="Hide exploration tracker"
              onClick={() => setDismissed(true)}
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id} data-done={visited.has(s.id)}>
                <a href={`#${s.id}`} onClick={() => setExpanded(false)}>
                  <span className="explore-dot" aria-hidden="true" />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
