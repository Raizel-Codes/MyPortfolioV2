"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScrambleText } from "@/components/ScrambleText";
import { projectsData } from "@/data/projects";
import { experienceContent } from "@/data/site";

const NAV_LINKS = [
  { label: "About", href: "#about", id: "about" },
  { label: "Projects", href: "#projects", id: "projects", count: projectsData.items.length },
  { label: "Stack", href: "#stack", id: "stack" },
  { label: "Experience", href: "#experience", id: "experience", count: experienceContent.items.length },
  { label: "FAQ", href: "#faq", id: "faq" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export function Navbar() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const linkRefs = useRef<Partial<Record<string, HTMLAnchorElement | null>>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  // Same IntersectionObserver approach as MobileQuickNav's active-section tracking.
  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
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

  // header gains a slightly stronger backdrop once the page has scrolled a little
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // measure the active link's position, same sliding-indicator technique as Projects' filter tabs
  useEffect(() => {
    function measure() {
      const el = activeId ? linkRefs.current[activeId] : null;
      if (!el) {
        setIndicator(null);
        return;
      }
      const parent = el.closest(".nav-links") as HTMLElement | null;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      setIndicator({ left: rect.left - parentRect.left, width: rect.width });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeId]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <nav className="container nav" aria-label="Primary">
        <Link href="#top" className="logo" aria-label="Adrian Garcia, back to top">
          <ScrambleText text="A" ariaHidden />
          <span className="logo-dot">.</span>
          <ScrambleText text="GARCIA" ariaHidden />
        </Link>
        <ul className="nav-links">
          {indicator && (
            <span
              className="nav-indicator"
              aria-hidden="true"
              style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
            />
          )}
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                ref={(node) => {
                  linkRefs.current[link.id] = node;
                }}
                aria-current={activeId === link.id ? "true" : undefined}
                data-active={activeId === link.id}
              >
                {link.label}
                {link.count !== undefined && <span className="count">[{link.count}]</span>}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <ThemeToggle />
          <Link href="#contact" className="nav-cta">Let&apos;s talk</Link>
        </div>
      </nav>
    </header>
  );
}
