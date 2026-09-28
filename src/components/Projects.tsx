"use client";

import { useLayoutEffect, useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { projectsData, type ProjectKind } from "@/data/projects";
import { TiltMedia } from "@/components/TiltMedia";
import { BrowserFrame, PhoneFrame } from "@/components/DeviceFrame";
import { PauseOffscreen } from "@/components/PauseOffscreen";

type Filter = "All" | ProjectKind;

const FILTERS: Filter[] = ["All", "Web", "Mobile"];

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "") || "site";
}

export function Projects() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = projectsData.items.filter((p) => filter === "All" || p.kind === filter);

  const groupRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Partial<Record<Filter, HTMLButtonElement | null>>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    function measure() {
      const btn = btnRefs.current[filter];
      const group = groupRef.current;
      if (!btn || !group) return;
      const groupRect = group.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setIndicator({ left: btnRect.left - groupRect.left, width: btnRect.width });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [filter]);

  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [revealed, setRevealed] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || revealed) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealed]);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, filter]);

  function scrollByPage(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <section className="section projects" id="projects" aria-labelledby="projects-title">
      <span className="watermark" aria-hidden="true">PORTFOLIO</span>
      <div className="container">
        <div className="section-head">
          <div>
            <h2 className="slash-title" id="projects-title">/Projects</h2>
            <p className="section-title">{projectsData.title}</p>
            <p className="section-lede">{projectsData.lede}</p>
          </div>
          <div className="projects-controls">
            <div className="filters" role="group" aria-label="Filter projects" ref={groupRef}>
              {indicator && (
                <span
                  className="filter-indicator"
                  aria-hidden="true"
                  style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
                />
              )}
              {FILTERS.map((f) => (
                <button
                  key={f}
                  ref={(node) => {
                    btnRefs.current[f] = node;
                  }}
                  type="button"
                  className="filter"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f}
                  <span className="count">
                    [{f === "All" ? projectsData.items.length : projectsData.items.filter((p) => p.kind === f).length}]
                  </span>
                </button>
              ))}
            </div>
            <div className="project-nav">
              <button
                type="button"
                className="project-arrow"
                onClick={() => scrollByPage(-1)}
                disabled={!canPrev}
                aria-label="Scroll to previous projects"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="project-arrow"
                onClick={() => scrollByPage(1)}
                disabled={!canNext}
                aria-label="Scroll to more projects"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container project-scroller-outer">
        <PauseOffscreen className="project-scroller-outer-pause">
          <ul ref={scrollerRef} className={`project-scroller reveal-scope${revealed ? " is-visible" : ""}`}>
            {visible.map((project, i) => (
              <li className="project-card reveal-item" style={{ "--i": i } as React.CSSProperties} key={project.title}>
                <div className="project-media">
                  <span className="project-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <TiltMedia className="project-media-tilt">
                    {project.frame === "browser" && (
                      <BrowserFrame label={slugify(project.title)}>
                        <Image
                          src={project.image}
                          alt={`${project.title} screenshot`}
                          fill
                          sizes="(max-width: 900px) 85vw, 420px"
                        />
                      </BrowserFrame>
                    )}
                    {project.frame === "phone" && (
                      <PhoneFrame>
                        <Image
                          src={project.image}
                          alt={`${project.title} screenshot`}
                          fill
                          sizes="(max-width: 900px) 85vw, 420px"
                        />
                      </PhoneFrame>
                    )}
                    {project.frame === "plain" && (
                      <Image
                        src={project.image}
                        alt={`${project.title} screenshot`}
                        fill
                        sizes="(max-width: 900px) 85vw, 420px"
                      />
                    )}
                  </TiltMedia>
                </div>
                <div>
                  <div className="project-top">
                    <h3 className="project-name">{project.title}</h3>
                    <span className="project-kind">{project.kindLabel}</span>
                  </div>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-meta">
                    <span className="project-role">{project.role}</span>
                    <span className="project-status" data-status={project.status}>
                      {project.status}
                    </span>
                  </div>
                  <ul className="tag-list" aria-label="Built with">
                    {project.tags.map((tag) => (
                      <li className="tag" key={tag}>{tag}</li>
                    ))}
                  </ul>
                  {project.links.map((link) => (
                    <a key={link.url} href={link.url} className="text-link" target="_blank" rel="noreferrer">
                      <link.icon size={14} aria-hidden="true" />
                      {link.label}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </PauseOffscreen>
      </div>
    </section>
  );
}