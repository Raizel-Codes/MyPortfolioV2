"use client";

import { useEffect, useRef, useState } from "react";
import {
  User,
  LayoutGrid,
  Layers,
  History,
  CircleHelp,
  Mail,
  Settings2,
  PanelBottom,
  PanelRight,
  PanelTop,
  GripHorizontal,
  MoreHorizontal,
  X,
} from "lucide-react";

type NavStyle = "bottom" | "side" | "top";
type Panel = "more" | "settings" | null;

const STYLE_KEY = "quick-nav-style";
const SIDE_Y_KEY = "quick-nav-side-y";
const PRIMARY_COUNT = 4;
const EDGE_MARGIN = 10;

// Clamp so the rail's center never lets its own edges run off-screen, whatever its height.
function clampCenterRatio(ratio: number, railHeight: number) {
  const minRatio = (railHeight / 2 + EDGE_MARGIN) / window.innerHeight;
  const maxRatio = 1 - minRatio;
  if (minRatio > maxRatio) return 0.5;
  return Math.max(minRatio, Math.min(maxRatio, ratio));
}

const ITEMS = [
  { id: "about", label: "About", icon: User },
  { id: "projects", label: "Projects", icon: LayoutGrid },
  { id: "stack", label: "Stack", icon: Layers },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "experience", label: "Experience", icon: History },
  { id: "faq", label: "FAQ", icon: CircleHelp },
];

const PRIMARY_ITEMS = ITEMS.slice(0, PRIMARY_COUNT);
const OVERFLOW_ITEMS = ITEMS.slice(PRIMARY_COUNT);

const STYLE_OPTIONS: { value: NavStyle; label: string; hint: string; icon: typeof PanelBottom }[] = [
  { value: "bottom", label: "Bottom bar", hint: "Sits above the screen edge", icon: PanelBottom },
  { value: "side", label: "Side rail", hint: "Clear of gesture buttons, drag to move", icon: PanelRight },
  { value: "top", label: "Top bar", hint: "Below the header", icon: PanelTop },
];

export function MobileQuickNav() {
  // Always starts "bottom" to match the server-rendered markup exactly; the saved
  // choice (if any) is applied right after mount, same as a normal external-store sync.
  const [style, setStyle] = useState<NavStyle>("bottom");
  const [activeId, setActiveId] = useState<string>("about");
  const [openPanel, setOpenPanel] = useState<Panel>(null);
  const [sideY, setSideY] = useState<number | null>(null); // 0..1 fraction of viewport height, null = centered
  const navRef = useRef<HTMLElement>(null);
  const draggingRef = useRef(false);
  const sideYRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STYLE_KEY);
      if (saved === "bottom" || saved === "side" || saved === "top") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage on mount, not derived state
        setStyle(saved);
      }
      const savedY = Number(localStorage.getItem(SIDE_Y_KEY));
      if (Number.isFinite(savedY) && savedY >= 0 && savedY <= 1) {
        sideYRef.current = savedY;
        setSideY(savedY);
      }
    } catch {}
  }, []);

  // let CSS reserve room so the fixed bottom bar never covers page content
  useEffect(() => {
    document.body.dataset.quicknav = style;
    return () => {
      delete document.body.dataset.quicknav;
    };
  }, [style]);

  // re-clamp the dragged position against the rail's real height once it's actually laid out
  // as a side rail (on switching styles, and again if the viewport is resized/rotated)
  useEffect(() => {
    if (style !== "side") return;
    function reclamp() {
      const rail = navRef.current;
      if (!rail || sideYRef.current === null) return;
      const clamped = clampCenterRatio(sideYRef.current, rail.getBoundingClientRect().height);
      if (clamped !== sideYRef.current) {
        sideYRef.current = clamped;
        setSideY(clamped);
      }
    }
    const raf = requestAnimationFrame(reclamp);
    window.addEventListener("resize", reclamp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", reclamp);
    };
  }, [style]);

  useEffect(() => {
    const sections = ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
          setActiveId(topMost.target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!openPanel) return;
    function onPointerDown(e: PointerEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenPanel(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenPanel(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openPanel]);

  function choose(next: NavStyle) {
    setStyle(next);
    setOpenPanel(null);
    try {
      localStorage.setItem(STYLE_KEY, next);
    } catch {}
  }

  function onDragStart(e: React.PointerEvent) {
    e.preventDefault();
    draggingRef.current = true;
    const railHeight = navRef.current?.getBoundingClientRect().height ?? 320;

    function onMove(ev: PointerEvent) {
      if (!draggingRef.current) return;
      const ratio = clampCenterRatio(ev.clientY / window.innerHeight, railHeight);
      sideYRef.current = ratio;
      setSideY(ratio);
    }
    function onUp() {
      draggingRef.current = false;
      if (sideYRef.current !== null) {
        try {
          localStorage.setItem(SIDE_Y_KEY, String(sideYRef.current));
        } catch {}
      }
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function renderItem(item: (typeof ITEMS)[number]) {
    const Icon = item.icon;
    const isActive = activeId === item.id;
    return (
      <a
        key={item.id}
        href={`#${item.id}`}
        className="quick-nav-item"
        data-active={isActive}
        aria-current={isActive ? "true" : undefined}
        aria-label={item.label}
        title={item.label}
      >
        <Icon size={19} aria-hidden="true" />
      </a>
    );
  }

  const visibleItems = style === "side" ? ITEMS : PRIMARY_ITEMS;
  const showOverflow = style !== "side" && OVERFLOW_ITEMS.length > 0;

  return (
    <nav
      ref={navRef}
      className={`quick-nav quick-nav--${style}`}
      style={style === "side" ? { top: sideY !== null ? `${sideY * 100}vh` : undefined } : undefined}
      aria-label="Jump to section"
    >
      {style === "side" && (
        <span className="quick-nav-handle" onPointerDown={onDragStart} aria-hidden="true">
          <GripHorizontal size={14} />
        </span>
      )}

      {visibleItems.map(renderItem)}

      {showOverflow && (
        <div className="quick-nav-anchor quick-nav-more">
          <button
            type="button"
            className="quick-nav-item"
            aria-label="More sections"
            aria-expanded={openPanel === "more"}
            onClick={() => setOpenPanel((p) => (p === "more" ? null : "more"))}
          >
            <MoreHorizontal size={19} aria-hidden="true" />
          </button>

          {openPanel === "more" && (
            <div className="quick-nav-popover quick-nav-more-popover" role="menu">
              {OVERFLOW_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    role="menuitem"
                    className="quick-nav-more-item"
                    data-active={isActive}
                    onClick={() => setOpenPanel(null)}
                  >
                    <Icon size={17} aria-hidden="true" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="quick-nav-anchor quick-nav-settings">
        <button
          type="button"
          className="quick-nav-item"
          aria-label="Choose where this nav sits"
          aria-expanded={openPanel === "settings"}
          onClick={() => setOpenPanel((p) => (p === "settings" ? null : "settings"))}
        >
          {openPanel === "settings" ? <X size={19} aria-hidden="true" /> : <Settings2 size={19} aria-hidden="true" />}
        </button>

        {openPanel === "settings" && (
          <div className="quick-nav-popover" role="menu">
            <p className="quick-nav-popover-title">Nav placement</p>
            {STYLE_OPTIONS.map((opt) => {
              const OptIcon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={style === opt.value}
                  className="quick-nav-popover-option"
                  data-selected={style === opt.value}
                  onClick={() => choose(opt.value)}
                >
                  <OptIcon size={16} aria-hidden="true" />
                  <span>
                    <strong>{opt.label}</strong>
                    <em>{opt.hint}</em>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
